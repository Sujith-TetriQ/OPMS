import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage, useField, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { onboardingSteps, MANAGERS_BY_DEPT } from '@config/onboard.config';
import { useTheme } from '@context/ThemeContext';
import Button from '@components/common/Button';

import Select from 'react-select';
import countryList from 'react-select-country-list';
import { State, City } from 'country-state-city';
import PhoneInput from 'react-phone-input-2';
import DatePicker from 'react-datepicker';

import countryToCurrency from 'country-to-currency';
import getSymbolFromCurrency from 'currency-symbol-map';

import './index.css';

/* ──────────────────────────────────────────────────────────────
   Utils
─────────────────────────────────────────────────────────────── */
const fmt2d = (n) => String(n).padStart(2, '0');
const formatDDMMYYYY = (d) => (d ? `${fmt2d(d.getDate())}-${fmt2d(d.getMonth() + 1)}-${d.getFullYear()}` : '');
const parseDDMMYYYY = (s) => {
  if (!s) return null;
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
  if (!m) return null;
  const [, dd, mm, yyyy] = m.map(Number);
  const dt = new Date(yyyy, mm - 1, dd);
  return Number.isNaN(+dt) ? null : dt;
};

const TIME12_RE = /^(\d{1,2}):([0-5]\d)\s?(AM|PM)$/i;
const parseTime12 = (str) => {
  if (!str || !TIME12_RE.test(str)) return null;
  const [, h, m, ap] = TIME12_RE.exec(str);
  let hh = parseInt(h, 10) % 12;
  if (/pm/i.test(ap)) hh += 12;
  const d = new Date();
  d.setHours(hh, parseInt(m, 10), 0, 0);
  return d;
};
const formatTime12 = (date) => {
  if (!date) return '';
  const hh = date.getHours();
  const h12 = hh % 12 || 12;
  const mm = `${date.getMinutes()}`.padStart(2, '0');
  const suffix = hh >= 12 ? 'PM' : 'AM';
  return `${h12}:${mm} ${suffix}`;
};

// Personal domains blocked for Work Email
const PERSONAL_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'outlook.com', 'hotmail.com', 'live.com', 'aol.com',
  'proton.me', 'icloud.com', 'rediffmail.com', 'gmx.com', 'zoho.com', 'mail.com', 'yandex.com', 'fastmail.com'
];

// Numeric-only fields
const NUMERIC_FIELDS = new Set([
  'baseSalary', 'hra', 'variablePay', 'bonus', 'hourlyRate', 'monthlySalary',
  'workHoursPerWeek', 'accountNumber', 'joiningBonus', 'grossSalary', 'pfDeduction', 'totalSalary'
]);

/* ──────────────────────────────────────────────────────────────
   Currency helpers
─────────────────────────────────────────────────────────────── */
const localeForCountry = (iso2) => {
  const M = {
    IN: 'en-IN', US: 'en-US', GB: 'en-GB', AE: 'en-AE', SG: 'en-SG', AU: 'en-AU', CA: 'en-CA',
    JP: 'ja-JP', CN: 'zh-CN', HK: 'zh-HK', KR: 'ko-KR', MY: 'ms-MY', TH: 'th-TH', PH: 'en-PH',
    ID: 'id-ID', NZ: 'en-NZ', BR: 'pt-BR', MX: 'es-MX', SA: 'ar-SA', QA: 'ar-QA', KW: 'ar-KW',
    BH: 'ar-BH', OM: 'ar-OM', PK: 'ur-PK', BD: 'bn-BD', LK: 'si-LK', NP: 'ne-NP', TR: 'tr-TR',
    IL: 'he-IL', CH: 'de-CH', SE: 'sv-SE', NO: 'nb-NO', DK: 'da-DK', CZ: 'cs-CZ', PL: 'pl-PL',
    HU: 'hu-HU', RO: 'ro-RO', RU: 'ru-RU',
    DE: 'de-DE', FR: 'fr-FR', IT: 'it-IT', ES: 'es-ES', NL: 'nl-NL', PT: 'pt-PT', IE: 'en-IE',
    AT: 'de-AT', BE: 'nl-BE', FI: 'fi-FI', GR: 'el-GR', LU: 'fr-LU', MT: 'en-MT', SI: 'sl-SI',
    SK: 'sk-SK', EE: 'et-EE', LV: 'lv-LV', LT: 'lt-LT', CY: 'el-CY', HR: 'hr-HR', ZA: 'en-ZA'
  };
  const up = (iso2 || '').toUpperCase();
  return M[up] || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
};

const currencyCodeForCountry = (iso2) => {
  const code = countryToCurrency[(iso2 || '').toUpperCase()];
  return code || 'USD';
};

const currencySymbolForCountry = (iso2) => {
  const code = currencyCodeForCountry(iso2);
  return getSymbolFromCurrency(code) || code;
};

const moneyFormat = (iso2, value) => {
  const code = currencyCodeForCountry(iso2);
  const locale = localeForCountry(iso2);
  const v = Number(value || 0);
  const zeroDec = ['JPY', 'KRW', 'VND'].includes(code);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: zeroDec ? 0 : 2,
    maximumFractionDigits: zeroDec ? 0 : 2,
  }).format(v);
};

/* ──────────────────────────────────────────────────────────────
   Country-aware bank labels & validation
─────────────────────────────────────────────────────────────── */
const bankMetaFor = (iso2) => {
  switch ((iso2 || '').toUpperCase()) {
    case 'IN':
      return {
        bankNameLabel: 'Bank Name',
        acctLabel: 'Account Number',
        codeLabel: 'IFSC Code',
        codeHint: 'e.g., HDFC0001234',
        codeRegex: /^[A-Z]{4}0[A-Z0-9]{6}$/,
        codeError: 'Enter a valid IFSC (e.g., HDFC0001234)',
      };
    case 'US':
      return {
        bankNameLabel: 'Bank Name',
        acctLabel: 'Account Number',
        codeLabel: 'Routing Number (ABA)',
        codeHint: '9 digits',
        codeRegex: /^\d{9}$/,
        codeError: 'Enter a 9-digit routing number',
      };
    case 'GB':
      return {
        bankNameLabel: 'Bank Name',
        acctLabel: 'Account Number',
        codeLabel: 'Sort Code',
        codeHint: 'e.g., 12-34-56',
        codeRegex: /^\d{2}-\d{2}-\d{2}$/,
        codeError: 'Use format 12-34-56',
      };
    case 'AE':
      return {
        bankNameLabel: 'Bank Name',
        acctLabel: 'IBAN',
        codeLabel: 'SWIFT/BIC (optional)',
        codeHint: 'e.g., AE07 0331 2345 6789 0123 456',
        codeRegex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/,
        codeError: 'Enter a valid IBAN',
      };
    default:
      return {
        bankNameLabel: 'Bank Name',
        acctLabel: 'Account / IBAN',
        codeLabel: 'SWIFT/BIC',
        codeHint: '8 or 11 characters',
        codeRegex: /^[A-Z0-9]{8}([A-Z0-9]{3})?$/,
        codeError: 'Enter a valid SWIFT/BIC (8 or 11 chars)',
      };
  }
};

/* ──────────────────────────────────────────────────────────────
   Pretty-print helpers for preview
─────────────────────────────────────────────────────────────── */
const countryLabel = (iso2) => {
  if (!iso2) return '';
  const up = String(iso2).toUpperCase();
  const found = countryList().getData().find(c => c.value === up);
  return found ? found.label : iso2; // fallback
};

const stateLabel = (countryIso, stateIso) => {
  if (!countryIso || !stateIso) return stateIso || '';
  const s = State.getStateByCodeAndCountry(String(stateIso), String(countryIso));
  return s?.name || stateIso;
};

const withPlus = (phone) => {
  if (!phone) return '';
  return phone.startsWith('+') ? phone : `+${phone}`;
};

const COUNTRY_FIELDS = new Set(['country', 'nationality', 'officeCountry']);
const STATE_FIELDS = new Set(['state', 'officeState']);
const PHONE_FIELDS = new Set(['phone', 'workPhone']);

/* ──────────────────────────────────────────────────────────────
   Statutory / CTC (data-driven, country + company overrides)
─────────────────────────────────────────────────────────────── */

// Round to 2 decimals
const round2 = (n) => Math.round(Number(n || 0) * 100) / 100;

// Build "gross" the same way you currently think of CTC components
const calcGross = (v) => {
  const base = Number(v.baseSalary || 0);
  const hra = Number(v.hra || 0);
  const varp = Number(v.variablePay || 0);
  const bonus = Number(v.bonus || 0);
  return round2(base + hra + varp + bonus);
};

// Uses: window.__COMPANY_KEY__ OR Vite import.meta.env.VITE_COMPANY_KEY OR values.companyKey
const getCompanyKey = (values = {}) => {
  const k =
    (typeof window !== 'undefined' && window.__COMPANY_KEY__) ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_COMPANY_KEY) ||
    values.companyKey ||
    '';
  return String(k || '').toLowerCase();
};

/**
 * Default statutory configuration (simplified demo defaults).
 * You SHOULD override these per legal/compliance needs.
 */
const DEFAULT_STATUTORY_RATES = {
  // Fallback country (no deductions)
  XX: { items: [], notes: [] },

  IN: {
    items: [
      { code: 'PF', label: 'PF (Employee 12%)', base: 'base', ratePct: 12 },
      { code: 'ESI', label: 'ESI (0.75%)', base: 'gross', ratePct: 0.75 },
    ],
    notes: ['Employer PF ~12% (not deducted from employee).'],
  },
  US: {
    items: [
      { code: 'SS', label: 'Social Security (6.2%)', base: 'gross', ratePct: 6.2, capAbs: 168600 },
      { code: 'MED', label: 'Medicare (1.45%)', base: 'gross', ratePct: 1.45 },
    ],
    notes: ['Employer matches FICA portions; 401(k) match is employer-side.'],
  },
  GB: {
    items: [
      { code: 'NI', label: 'National Insurance (employee)', base: 'gross', ratePct: 8 },
      { code: 'PENS', label: 'Workplace Pension (employee)', base: 'gross', ratePct: 5 },
    ],
    notes: ['Employer NI + employer pension apply (not deducted from employee).'],
  },
  SG: {
    items: [
      { code: 'CPF', label: 'CPF (Employee)', base: 'gross', ratePct: 20 },
    ],
    notes: ['Employer CPF contribution is additional and not deducted from employee.'],
  },
  AU: {
    items: [
      { code: 'MED', label: 'Medicare Levy (2%)', base: 'gross', ratePct: 2 },
    ],
    notes: ['Superannuation (11%+) is employer-side (not deducted).'],
  },
  CA: {
    items: [
      { code: 'CPP', label: 'CPP (employee)', base: 'gross', ratePct: 5.95 },
      { code: 'EI', label: 'EI (employee)', base: 'gross', ratePct: 1.63 },
    ],
    notes: ['Employer also contributes CPP/EI.'],
  },
  AE: {
    items: [],
    notes: ['End-of-Service Gratuity is employer-side; no employee deduction.'],
  },
  DE: {
    items: [
      { code: 'PEN', label: 'Pension (employee)', base: 'gross', ratePct: 9.3 },
      { code: 'HEALTH', label: 'Health Insurance (employee)', base: 'gross', ratePct: 7.3 },
      { code: 'UNEMP', label: 'Unemployment (employee)', base: 'gross', ratePct: 1.3 },
      { code: 'CARE', label: 'Nursing Care (employee)', base: 'gross', ratePct: 1.525 },
    ],
    notes: ['Employer shares roughly similar contributions.'],
  },
  FR: {
    items: [
      { code: 'SS', label: 'Social contributions (employee)', base: 'gross', ratePct: 15 },
    ],
    notes: ['Simplified; France has multiple lines—configure accurately as needed.'],
  },
  IT: {
    items: [
      { code: 'INPS', label: 'INPS Pension (employee)', base: 'gross', ratePct: 9.19 },
    ],
    notes: ['Simplified; Italy varies by sector—configure per company.'],
  },
  ES: {
    items: [
      { code: 'SS', label: 'Social Security (employee)', base: 'gross', ratePct: 6.35 },
    ],
    notes: ['Simplified; different regimes exist.'],
  },
  NL: {
    items: [
      { code: 'PENS', label: 'Pension (employee)', base: 'gross', ratePct: 5 },
    ],
    notes: ['Simplified; pension often via CAO—configure per plan.'],
  },
  CH: {
    items: [
      { code: 'AHV', label: 'AHV/IV/EO (employee)', base: 'gross', ratePct: 5.3 },
      { code: 'ALV', label: 'ALV (employee)', base: 'gross', ratePct: 1.1 },
      { code: 'PEN', label: '2nd Pillar (employee)', base: 'gross', ratePct: 5 },
    ],
    notes: ['Simplified; 2nd pillar depends on plan and age.'],
  },
  JP: {
    items: [
      { code: 'PEN', label: 'Pension (employee)', base: 'gross', ratePct: 9.15 },
      { code: 'HLTH', label: 'Health (employee)', base: 'gross', ratePct: 5 },
      { code: 'UI', label: 'Unemployment', base: 'gross', ratePct: 0.6 },
    ],
    notes: ['Simplified; rates vary by prefecture/health society.'],
  },
  KR: {
    items: [
      { code: 'NPS', label: 'National Pension', base: 'gross', ratePct: 4.5 },
      { code: 'NHI', label: 'Health Insurance', base: 'gross', ratePct: 3.5 },
      { code: 'EI', label: 'Employment Ins.', base: 'gross', ratePct: 0.8 },
    ],
    notes: ['Simplified; employer pays separate shares.'],
  },
  MX: {
    items: [
      { code: 'IMSS', label: 'IMSS (employee)', base: 'gross', ratePct: 2 },
    ],
    notes: ['Simplified; IMSS is multi-line in practice.'],
  },
  BR: {
    items: [
      { code: 'INSS', label: 'INSS (employee)', base: 'gross', ratePct: 8 },
    ],
    notes: ['Simplified progressive brackets—configure if needed.'],
  },
  ZA: {
    items: [
      { code: 'UIF', label: 'UIF (employee)', base: 'gross', ratePct: 1 },
    ],
    notes: ['Simplified; retirement fund contributions often pre-tax.'],
  },
  NZ: {
    items: [
      { code: 'KIWI', label: 'KiwiSaver (employee)', base: 'gross', ratePct: 3 },
    ],
    notes: ['Employer contributes to KiwiSaver separately.'],
  },
  IE: {
    items: [
      { code: 'PRSI', label: 'PRSI (employee)', base: 'gross', ratePct: 4 },
      { code: 'PENS', label: 'Pension (employee)', base: 'gross', ratePct: 5 },
    ],
    notes: ['Simplified; USC is a tax, not a contribution.'],
  },
  SE: {
    items: [
      { code: 'PENS', label: 'Occupational Pension (employee)', base: 'gross', ratePct: 5 },
    ],
    notes: ['Simplified; employer social charges are high and employer-side.'],
  },
  NO: {
    items: [
      { code: 'PENS', label: 'Pension (employee)', base: 'gross', ratePct: 2 },
    ],
    notes: ['Simplified defaults.'],
  },
  DK: {
    items: [
      { code: 'ATP', label: 'ATP (employee)', base: 'gross', ratePct: 1 },
    ],
    notes: ['Simplified; Denmark often uses fixed ATP amounts.'],
  },
  FI: {
    items: [
      { code: 'EPI', label: 'Employee Pension (TyEL)', base: 'gross', ratePct: 7.15 },
    ],
    notes: ['Age-banded—configure as needed.'],
  },
  BE: {
    items: [
      { code: 'SS', label: 'Social Security (employee)', base: 'gross', ratePct: 13.07 },
    ],
    notes: ['Simplified; employer social sec. separate.'],
  },
  AT: {
    items: [
      { code: 'SV', label: 'Social Insurance (employee)', base: 'gross', ratePct: 18 },
    ],
    notes: ['Simplified demo default.'],
  },
  PL: {
    items: [
      { code: 'ZUS', label: 'ZUS (employee parts)', base: 'gross', ratePct: 13.71 },
    ],
    notes: ['Simplified; multiple components in practice.'],
  },
  TR: {
    items: [
      { code: 'SGK', label: 'Social Security (employee)', base: 'gross', ratePct: 14 },
    ],
    notes: ['Simplified.'],
  },
  IL: {
    items: [
      { code: 'PEN', label: 'Pension (employee)', base: 'gross', ratePct: 6 },
      { code: 'SEV', label: 'Severance (employee)', base: 'gross', ratePct: 0 },
    ],
    notes: ['Employer pays severance; employee contributes pension and training fund optionally.'],
  },
  MY: {
    items: [
      { code: 'EPF', label: 'EPF (employee)', base: 'gross', ratePct: 11 },
    ],
    notes: ['Employer EPF separate.'],
  },
  TH: {
    items: [
      { code: 'SSF', label: 'Social Security (employee)', base: 'gross', ratePct: 5 },
    ],
    notes: ['Caps apply—configure as needed.'],
  },
  PH: {
    items: [
      { code: 'SSS', label: 'SSS (employee)', base: 'gross', ratePct: 4.5 },
      { code: 'PHIC', label: 'PhilHealth (employee)', base: 'gross', ratePct: 2.25 },
      { code: 'HDMF', label: 'Pag-IBIG (employee)', base: 'gross', ratePct: 2 },
    ],
    notes: ['Simplified; caps and brackets apply.'],
  },
  ID: {
    items: [
      { code: 'BPJS', label: 'BPJS (employee)', base: 'gross', ratePct: 1 },
    ],
    notes: ['Separate health/old age; simplified.'],
  },
  HK: {
    items: [
      { code: 'MPF', label: 'MPF (employee)', base: 'gross', ratePct: 5 },
    ],
    notes: ['MPF has caps—configure as needed.'],
  },
  ES_AR: {
    items: [
      { code: 'RET', label: 'Retirement (employee)', base: 'gross', ratePct: 11 },
      { code: 'HEALTH', label: 'Health (employee)', base: 'gross', ratePct: 3 },
    ],
    notes: [],
  },
};

// Optional runtime-wide override injection (e.g., from server)
const RUNTIME_STATUTORY_RATES =
  (typeof window !== 'undefined' && window.__STATUTORY_RATES__) || null;

// Example company overrides structure
const COMPANY_OVERRIDES = {
  // 'acme': {
  //   IN: { items: [{ code:'PF', label:'PF (Emp 12%)', base:'base', ratePct:12 }], notes:['Custom note'] },
  //   US: { items: [{ code:'401K', label:'401(k) Employee', base:'gross', ratePct: 3 }], notes:[] }
  // },
};

const deepClone = (o) => JSON.parse(JSON.stringify(o || {}));
const mergeCountry = (baseCfg = {}, overrideCfg = {}) => {
  if (!overrideCfg || !Object.keys(overrideCfg).length) return deepClone(baseCfg);
  const out = deepClone(baseCfg);
  if (overrideCfg.items) out.items = deepClone(overrideCfg.items);
  if (overrideCfg.notes) out.notes = deepClone(overrideCfg.notes);
  return out;
};

const resolveCountryConfig = (iso2, companyKey) => {
  const up = (iso2 || 'XX').toUpperCase();
  let cfg = DEFAULT_STATUTORY_RATES[up] || DEFAULT_STATUTORY_RATES.XX;

  if (companyKey && COMPANY_OVERRIDES[companyKey]?.[up]) {
    cfg = mergeCountry(cfg, COMPANY_OVERRIDES[companyKey][up]);
  }
  if (RUNTIME_STATUTORY_RATES?.[up]) {
    cfg = mergeCountry(cfg, RUNTIME_STATUTORY_RATES[up]);
  }
  return cfg;
};

const computeStatutory = (iso2, values) => {
  const companyKey = getCompanyKey(values);
  const cfg = resolveCountryConfig(iso2, companyKey);
  const gross = calcGross(values);
  const baseSalary = Number(values.baseSalary || 0);

  const items = (cfg.items || []).map((it) => {
    const pct =
      typeof it.ratePctField === 'string'
        ? Number(values[it.ratePctField] || 0)
        : Number(it.ratePct || 0);

    const base = it.base === 'base' ? baseSalary : gross;
    const taxableBase = typeof it.capAbs === 'number' ? Math.min(base, it.capAbs) : base;
    const amount = round2((pct / 100) * taxableBase);

    return { code: it.code, label: it.label, amount };
  });

  const total = round2(items.reduce((s, x) => s + Number(x.amount || 0), 0));
  return { items, total, notes: cfg.notes || [] };
};

const buildCtcView = (values) => {
  const country = values.officeCountry;
  const gross = calcGross(values);
  const { items, total, notes } = computeStatutory(country, values);
  const netAnnual = round2(gross - total);
  return { country, gross, items, totalStatutory: total, netAnnual, employerNotes: notes };
};

/* ──────────────────────────────────────────────────────────────
   Reusable field components (with per-field onBlur validation)
─────────────────────────────────────────────────────────────── */
const CountrySelect = ({ name, placeholder = 'Select country', isDisabled = false, onBlurValidate }) => {
  const [field, meta, helpers] = useField(name);
  const { touched, error } = meta;
  const options = useMemo(
    () => countryList().getData().map((o) => ({ label: o.label, value: o.value })),
    []
  );
  const value = useMemo(() => options.find((o) => o.value === field.value) || null, [field.value, options]);

  return (
    <div className={`select-shell ${touched && error ? 'has-error' : ''}`}>
      <Select
        className="react-select-container premium-select"
        classNamePrefix="react-select"
        options={options}
        placeholder={placeholder}
        value={value}
        onChange={(opt) => helpers.setValue(opt?.value || '')}
        onBlur={() => onBlurValidate?.(name)}
        isClearable
        isSearchable
        isDisabled={isDisabled}
        menuPortalTarget={document.body}
        styles={{
          control: (base, state) => ({
            ...base, minHeight: 44, borderWidth: 2,
            borderColor: state.isFocused ? 'var(--focus)' : 'var(--field-brd)',
            boxShadow: 'none', cursor: 'pointer',
          }),
          menuPortal: (b) => ({ ...b, zIndex: 9999 }),
        }}
      />
      <ErrorMessage name={name} component="div" className="error text-danger small mt-1" />
    </div>
  );
};

const StateSelect = ({ name, countryField, placeholder = 'Select state…', isDisabled = false, onBlurValidate }) => {
  const { values, setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const { touched, error } = meta;
  const countryIso = values[countryField];
  const prevCountryIso = useRef(countryIso);

  const stateOptions = useMemo(() => {
    if (!countryIso) return [];
    return State.getStatesOfCountry(countryIso).map((s) => ({ label: s.name, value: s.isoCode }));
  }, [countryIso]);

  const value = useMemo(() => stateOptions.find((o) => o.value === field.value) || null, [field.value, stateOptions]);

  useEffect(() => {
    if (prevCountryIso.current !== countryIso) {
      setFieldValue(name, '');
      const maybeCityField = name.replace('State', 'City').replace('state', 'city');
      if (Object.prototype.hasOwnProperty.call(values, maybeCityField)) setFieldValue(maybeCityField, '');
      prevCountryIso.current = countryIso;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryIso]);

  return (
    <div className={`select-shell ${touched && error ? 'has-error' : ''}`}>
      <Select
        className="react-select-container premium-select"
        classNamePrefix="react-select"
        options={stateOptions}
        placeholder={placeholder}
        value={value}
        onChange={(opt) => setFieldValue(name, opt?.value || '')}
        onBlur={() => onBlurValidate?.(name)}
        isClearable
        isSearchable
        isDisabled={isDisabled || !countryIso}
        noOptionsMessage={() => (countryIso ? 'No states found' : 'Select a country first')}
        menuPortalTarget={document.body}
        styles={{
          control: (base, state) => ({
            ...base, minHeight: 44, borderWidth: 2,
            borderColor: state.isFocused ? 'var(--focus)' : 'var(--field-brd)',
            boxShadow: 'none', cursor: 'pointer',
          }),
          menuPortal: (b) => ({ ...b, zIndex: 9999 }),
        }}
      />
      <ErrorMessage name={name} component="div" className="error text-danger small mt-1" />
    </div>
  );
};

const CitySelect = ({ name, countryField, stateField, placeholder = 'Select city…', isDisabled = false, onBlurValidate }) => {
  const { values, setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const { touched, error } = meta;
  const countryIso = values[countryField];
  const stateIso = values[stateField];
  const prevStateIso = useRef(stateIso);

  const cityOptions = useMemo(() => {
    if (!countryIso || !stateIso) return [];
    return City.getCitiesOfState(countryIso, stateIso).map((c) => ({ label: c.name, value: c.name }));
  }, [countryIso, stateIso]);

  const value = useMemo(() => cityOptions.find((o) => o.value === field.value) || null, [field.value, cityOptions]);

  useEffect(() => {
    if (prevStateIso.current !== stateIso) {
      setFieldValue(name, '');
      prevStateIso.current = stateIso;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateIso]);

  return (
    <div className={`select-shell ${touched && error ? 'has-error' : ''}`}>
      <Select
        className="react-select-container premium-select"
        classNamePrefix="react-select"
        options={cityOptions}
        placeholder={placeholder}
        value={value}
        onChange={(opt) => setFieldValue(name, opt?.value || '')}
        onBlur={() => onBlurValidate?.(name)}
        isClearable
        isSearchable
        isDisabled={isDisabled || !countryIso || !stateIso}
        noOptionsMessage={() => (stateIso ? 'No cities found' : countryIso ? 'Select a state first' : 'Select a country first')}
        menuPortalTarget={document.body}
        styles={{
          control: (base, state) => ({
            ...base, minHeight: 44, borderWidth: 2,
            borderColor: state.isFocused ? 'var(--focus)' : 'var(--field-brd)',
            boxShadow: 'none', cursor: 'pointer',
          }),
          menuPortal: (b) => ({ ...b, zIndex: 9999 }),
        }}
      />
      <ErrorMessage name={name} component="div" className="error text-danger small mt-1" />
    </div>
  );
};

const PhoneIntl = ({ name, required, countryField, onBlurValidate }) => {
  const { values, setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const iso2 = (values?.[countryField] || 'IN').toLowerCase();

  return (
    <div>
      <PhoneInput
        country={iso2}
        value={field.value}
        onChange={(val) => setFieldValue(name, val)}
        onBlur={() => onBlurValidate?.(name)}
        inputProps={{ name, required, autoComplete: 'tel', 'aria-invalid': !!(meta.touched && meta.error) }}
        inputClass="phone-intl-input"
        containerClass={`phone-intl-container ${meta.touched && meta.error ? 'has-error' : ''}`}
        buttonClass="phone-intl-button"
        enableSearch
        countryCodeEditable={false}
        specialLabel=""
      />
      {meta.touched && meta.error ? <div className="error text-danger small mt-1">{meta.error}</div> : null}
    </div>
  );
};

const DateFieldDDMMYYYY = ({ name, onBlurValidate }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);
  const selected = useMemo(() => parseDDMMYYYY(field.value), [field.value]);

  return (
    <DatePicker
      selected={selected}
      onChange={(date) => setFieldValue(name, formatDDMMYYYY(date))}
      onBlur={() => onBlurValidate?.(name)}
      dateFormat="dd-MM-yyyy"
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      scrollableYearDropdown
      yearDropdownItemNumber={5}
      maxDate={new Date()}
      placeholderText="DD-MM-YYYY"
      className="form-control"
      isClearable
    />
  );
};

const TimeField12h = ({ name, placeholder = 'hh:mm AM/PM', onBlurValidate }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);
  const selected = useMemo(() => parseTime12(field.value), [field.value]);

  return (
    <DatePicker
      selected={selected}
      onChange={(date) => setFieldValue(name, date ? formatTime12(date) : '')}
      onBlur={() => onBlurValidate?.(name)}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
      placeholderText={placeholder}
      className="form-control"
    />
  );
};

/* Derived fields (kept) */
const ShiftTimingSync = () => {
  const { values, setFieldValue } = useFormikContext();
  useEffect(() => {
    const combined = values.shiftStart && values.shiftEnd ? `${values.shiftStart} - ${values.shiftEnd}` : '';
    setFieldValue('shiftTiming', combined, false);
  }, [values.shiftStart, values.shiftEnd, setFieldValue]);
  return null;
};

const DisplayNameAuto = () => {
  const { values, setFieldValue } = useFormikContext();
  useEffect(() => {
    if (!values.__displayNameManual) {
      const auto = [values.firstName, values.lastName].filter(Boolean).join(' ').trim();
      setFieldValue('displayName', auto, false);
    }
  }, [values.firstName, values.lastName, values.__displayNameManual, setFieldValue]);
  return null;
};

/* ──────────────────────────────────────────────────────────────
   Validation (per-step, dynamic comp messages)
─────────────────────────────────────────────────────────────── */
const buildSchemaForStep = (stepDef, values) => {
  const shape = {};
  const ddmmyyyy = /^([0-2]\d|3[01])-(0\d|1[0-2])-\d{4}$/;

  // Context for dynamic messages in Compensation
  const struct = values.salaryStructure || 'selected structure';
  const sym = currencySymbolForCountry(values.officeCountry);
  const moneyMsg = (label) => `${label} (${sym}) is required for ${struct}`;
  const onlyDigits = /^\d+(\.\d+)?$/;

  stepDef.fields.forEach((f) => {
    if (f.showWhen && values.salaryStructure !== f.showWhen) return;

    let base = Yup.string().trim();
    if (f.type === 'email') base = Yup.string().email('Enter a valid email address');
    if (f.type === 'date-ddmmyyyy') base = base.matches(ddmmyyyy, 'Use DD-MM-YYYY');
    if (f.type === 'phone-intl') {
      base = base.test('phone', 'Enter a valid phone number', (v) => !v || /^\+?\d{7,15}$/.test(v));
    }
    if (f.name === 'workEmail') {
      base = Yup.string()
        .email('Enter a valid work email')
        .test('no-personal', 'Use company email (Gmail/Yahoo/etc. not allowed)', (v = '') => {
          const d = v.split('@')[1]?.toLowerCase();
          return !d || !PERSONAL_DOMAINS.includes(d);
        });
    }
    if (f.name === 'ifscCode') {
      const { codeRegex, codeError } = bankMetaFor(values.officeCountry);
      base = base.test('bank-code', codeError, (v = '') => v === '' || codeRegex.test(v));
    }

    // Numeric-friendly checks
    if (NUMERIC_FIELDS.has(f.name)) {
      base = base
        .test('num', 'Enter a valid amount', (v = '') => v === '' || onlyDigits.test(v))
        .test('nonneg', 'Amount cannot be negative', (v = '') => v === '' || Number(v) >= 0);
    }

    // Required with dynamic labels (esp. compensation)
    if (f.required) {
      let reqLabel = f.label;
      const bankMeta = bankMetaFor(values.officeCountry);
      if (f.name === 'bankName') reqLabel = bankMeta.bankNameLabel;
      if (f.name === 'accountNumber') reqLabel = bankMeta.acctLabel;
      if (f.name === 'ifscCode') reqLabel = bankMeta.codeLabel;

      if (['baseSalary', 'hra', 'variablePay', 'bonus', 'hourlyRate', 'monthlySalary', 'totalSalary'].includes(f.name)) {
        const baseLbl = (f.label || '').replace(/\s*\(.*?\)\s*/g, '');
        base = base.required(moneyMsg(baseLbl || reqLabel));
      } else {
        base = base.required(`${reqLabel} is required`);
      }
    }

    shape[f.name] = base;
  });

  if (stepDef.fields.some((f) => f.name === 'shiftTiming')) {
    shape.shiftStart = Yup.string().trim().test('time-12h', 'Use hh:mm AM/PM', (v) => !v || TIME12_RE.test(v));
    shape.shiftEnd = Yup.string().trim().test('time-12h', 'Use hh:mm AM/PM', (v) => !v || TIME12_RE.test(v));
  }

  shape.joiningDate = (shape.joiningDate || Yup.string().trim()).test(
    'min-18y',
    'Joining date must be at least 18 years after Date of Birth',
    function (v) {
      const dobStr = this.parent.dob;
      const jdStr = v;
      const dob = parseDDMMYYYY(dobStr);
      const jd = parseDDMMYYYY(jdStr);
      if (!dob || !jd) return true;
      const min = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());
      return jd >= min;
    }
  );

  return Yup.object().shape(shape);
};

const validateWithYup = (schema, values) => {
  try {
    schema.validateSync(values, { abortEarly: false });
    return {};
  } catch (e) {
    const errs = {};
    e?.inner?.forEach((err) => {
      if (err.path && !errs[err.path]) errs[err.path] = err.message;
    });
    return errs;
  }
};

const scrollToFirstError = (errors) => {
  const names = Object.keys(errors || {});
  if (!names.length) return;
  const name = names[0];
  const el =
    document.querySelector(`[name="${name}"]`) ||
    document.querySelector(`[id="${name}"]`) ||
    document.querySelector(`[data-name="${name}"]`);
  if (el && typeof el.scrollIntoView === 'function') {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      if ('focus' in el) try { el.focus({ preventScroll: true }); } catch (_) { }
      el.classList.add('error-ring');
      setTimeout(() => el.classList.remove('error-ring'), 1200);
    }, 250);
  }
};

/* ──────────────────────────────────────────────────────────────
   Initial values & constants
─────────────────────────────────────────────────────────────── */
const initialValuesAll = onboardingSteps.reduce((acc, s) => {
  s.fields.forEach((f) => (acc[f.name] = ''));
  return acc;
}, {});
initialValuesAll.shiftStart = '';
initialValuesAll.shiftEnd = '';
initialValuesAll.__displayNameManual = false;

const EXCLUDE_PREVIEW = new Set(['__displayNameManual', 'shiftStart', 'shiftEnd']);
const MONEY_FIELDS = new Set(['baseSalary', 'hra', 'variablePay', 'bonus', 'hourlyRate', 'monthlySalary', 'grossSalary', 'pfDeduction', 'totalSalary']);

/* ──────────────────────────────────────────────────────────────
   Component
─────────────────────────────────────────────────────────────── */
const EmployeeOnboarding = () => {
  const [step, setStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const { themeColor, themeMode } = useTheme();
  const themeVar = `var(--${themeColor})`;

  const EMPLOYEES_ROUTE = '/admin/employees';

  const [closeSide, setCloseSide] = useState('right');
  useEffect(() => {
    const ua = (navigator?.userAgent || '');
    const isIOS = /iPad|iPhone|Macintosh/.test(ua) && /AppleWebKit/.test(ua);
    const isMobile = /Mobile|iPhone|Android|iPad|iPod/.test(ua);
    setCloseSide(isIOS && !isMobile ? 'left' : 'right');
  }, []);

  const COMP_STEP_INDEX = useMemo(() => {
    const idx = onboardingSteps.findIndex((s) => /compensation/i.test(String(s.title || '')));
    return idx !== -1 ? idx : onboardingSteps.length - 1;
  }, []);

  return (
    <div className={`onboarding-page ${themeMode} p-2`}>
      <div className={`form-wrapper bg-${themeMode}-two`} style={{ '--theme': themeVar }}>
        {/* Form Close (X) -> Employee main page */}
        <button
          type="button"
          className="form-close"
          aria-label="Close"
          title="Close"
          onClick={() => navigate(EMPLOYEES_ROUTE)}
        >
          ×
        </button>

        <Formik
          initialValues={initialValuesAll}
          // Defer validation; we'll validate on blur (single field) and on submit/step-change
          validateOnBlur={false}
          validateOnChange={false}
          validate={(values) => validateWithYup(buildSchemaForStep(onboardingSteps[step], values), values)}
          onSubmit={async (values, { setSubmitting, validateForm, setTouched }) => {
            const errs = await validateForm();
            const visibleFields = onboardingSteps[step].fields
              .filter((f) => !f.showWhen || values.salaryStructure === f.showWhen)
              .map((f) => f.name);
            if (Object.keys(errs).length) {
              // Touch only CURRENT STEP fields so only they show messages
              setTouched(visibleFields.reduce((acc, n) => ((acc[n] = true), acc), {}), false);
              setSubmitting(false);
              scrollToFirstError(errs);
              return;
            }
            if (step < onboardingSteps.length - 1) {
              setSubmitting(false);
              setStep((s) => Math.min(s + 1, onboardingSteps.length - 1));
            } else {
              setSubmitting(false);
              setPreviewOpen(true);
            }
          }}
        >
          {({ values, setFieldValue, setFieldTouched, setFieldError, isSubmitting, submitForm, validateForm, errors, touched }) => {
            const bankMeta = useMemo(() => bankMetaFor(values.officeCountry), [values.officeCountry]);
            const currSymbol = currencySymbolForCountry(values.officeCountry);

            // NOTE: We no longer need to auto-clear salaryStructure when workerType is Contractual,
            // because we *remove* CTC from the dropdown entirely now.

            // Schema for current step (for single-field validateAt)
            const schemaForCurrentStep = useMemo(
              () => buildSchemaForStep(onboardingSteps[step], values),
              [step, values]
            );

            // Per-field validation on blur
            const validateSingle = async (name) => {
              try {
                await schemaForCurrentStep.validateAt(name, values);
                setFieldError(name, undefined);
              } catch (e) {
                setFieldError(name, e.message);
              }
              setFieldTouched(name, true, false);
            };

            // Format a single value for the preview modal
            const prettyValue = (name) => {
              const raw = values[name];

              if (MONEY_FIELDS.has(name)) return moneyFormat(values.officeCountry, raw);

              if (COUNTRY_FIELDS.has(name)) return countryLabel(raw) || '–';

              if (STATE_FIELDS.has(name)) {
                const countryIso = name.startsWith('office') ? values.officeCountry : values.country;
                return stateLabel(countryIso, raw) || '–';
              }

              if (PHONE_FIELDS.has(name)) return withPlus(raw) || '–';

              if (/date|dob/i.test(name)) return raw || '–';

              if (raw === '' || typeof raw === 'undefined' || raw === null) return '–';

              return String(raw);
            };

            // Build preview sections + add a "Compensation Summary" section
            const previewSections = useMemo(() => {
              const sections = onboardingSteps.map((sec) => {
                const fields = sec.fields
                  .filter((f) => !EXCLUDE_PREVIEW.has(f.name))
                  .filter((f) => !f.showWhen || values.salaryStructure === f.showWhen)
                  .map((f) => {
                    let label = f.label || f.name;

                    if (['baseSalary', 'hra', 'variablePay', 'bonus', 'hourlyRate', 'monthlySalary'].includes(f.name)) {
                      const base = (f.label || '').replace(/\s*\(.*?\)\s*/g, '');
                      label = `${base}${currSymbol ? ` (${currSymbol})` : ''}`;
                    }
                    if (['bankName', 'accountNumber', 'ifscCode'].includes(f.name)) {
                      if (f.name === 'bankName') label = bankMeta.bankNameLabel;
                      if (f.name === 'accountNumber') label = bankMeta.acctLabel;
                      if (f.name === 'ifscCode') label = bankMeta.codeLabel;
                    }

                    return { name: f.name, label };
                  });

                return { title: sec.title, fields };
              });

              if (values.salaryStructure === 'CTC') {
                const ctc = buildCtcView(values);
                sections.push({
                  title: 'Compensation Summary',
                  fields: [
                    { name: '__ctc_gross', label: 'Gross (Per Annum)' },
                    ...ctc.items.map((it, idx) => ({ name: `__ctc_item_${idx}`, label: it.label })),
                    { name: '__ctc_total_stat', label: 'Total Statutory' },
                    { name: '__ctc_net', label: 'In-Hand (Per Annum)' },
                  ],
                  __ctc: ctc,
                });
              }

              return sections;
            }, [values, bankMeta, currSymbol]);

            return (
              <Form className="form-content" noValidate>
                <ShiftTimingSync />
                <DisplayNameAuto />

                {/* Stepper chips */}
                <div className={`segchips col-12 bg-${themeMode}-two`} role="tablist" aria-label="Form steps">
                  {onboardingSteps.map((s, i) => {
                    const isActive = i === step;
                    const isCompleted = i < step;

                    const classes = `segchip ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;

                    const handleChipClick = async () => {
                      if (i === step) return;
                      if (i < step) { setStep(i); return; }
                      const errs = await validateForm();
                      if (Object.keys(errs).length) {
                        // Touch only fields of current step
                        const visible = onboardingSteps[step].fields
                          .filter((f) => !f.showWhen || values.salaryStructure === f.showWhen)
                          .map((f) => f.name);
                        visible.forEach((n) => setFieldTouched(n, true, false));
                        scrollToFirstError(errs);
                        return;
                      }
                      setStep(i);
                    };

                    const style = isActive
                      ? {
                        background: `color-mix(in oklab, var(--theme) 65%, white)`,
                        borderColor: `color-mix(in oklab, var(--theme) 65%, white)`,
                        color: '#0b1220',
                        fontWeight: 500
                      }
                      : isCompleted
                        ? { background: 'transparent', borderColor: 'var(--chip-brd)', color: 'var(--chip-fg)', fontWeight: 800 }
                        : { background: 'transparent', borderColor: 'var(--chip-brd)', color: 'var(--chip-fg)', fontWeight: 500 };

                    return (
                      <button
                        key={s.title}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={classes}
                        onClick={handleChipClick}
                        style={style}
                      >
                        <span
                          className="seg-dot"
                          style={{ background: isActive ? '#0b1220' : '#9aa4b2' }}
                        />
                        {s.title}
                      </button>
                    );
                  })}
                </div>

                {/* Section heading */}
                <div className="section-heading col-12">
                  <h6 className="section-title">{onboardingSteps[step].title}</h6>
                </div>

                {/* Fields */}
                {onboardingSteps[step].fields.map((field) => {
                  if (field.showWhen && values.salaryStructure !== field.showWhen) return null;

                  if (field.name === 'shiftTiming') {
                    return (
                      <div key="shiftTiming" className="form-group col wide">
                        <label className="form-label">Shift Timing</label>
                        <div className="d-flex gap-2">
                          <div className="flex-fill">
                            <TimeField12h name="shiftStart" placeholder="Shift start time" onBlurValidate={validateSingle} />
                            <ErrorMessage name="shiftStart" component="div" className="error text-danger small mt-1" />
                          </div>
                          <div className="flex-fill">
                            <TimeField12h name="shiftEnd" placeholder="Shift end time" onBlurValidate={validateSingle} />
                            <ErrorMessage name="shiftEnd" component="div" className="error text-danger small mt-1" />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const isOffice = ['officeCountry', 'officeState', 'officeCity'].includes(field.name);

                  let label = field.label;
                  let placeholder = field.placeholder;

                  if (['baseSalary', 'hra', 'variablePay', 'bonus', 'hourlyRate', 'monthlySalary'].includes(field.name)) {
                    const base = (field.label || '').replace(/\s*\(.*?\)\s*/g, '');
                    label = `${base}${currSymbol ? ` (${currSymbol})` : ''}`;
                  }

                  if (['bankName', 'accountNumber', 'ifscCode'].includes(field.name)) {
                    if (field.name === 'bankName') label = bankMeta.bankNameLabel;
                    if (field.name === 'accountNumber') { label = bankMeta.acctLabel; }
                    if (field.name === 'ifscCode') { label = bankMeta.codeLabel; placeholder = bankMeta.codeHint; }
                  }

                  return (
                    <div
                      key={field.name}
                      className={`form-group col ${isOffice ? 'office-field' : ''} ${(errors[field.name] && touched[field.name]) ? 'has-error' : ''}`}
                    >
                      <label className="form-label">
                        {label}{field.required && ' *'}
                      </label>

                      {/* Manager (filtered by department) */}
                      {field.type === 'select' && field.dynamic === 'MANAGER' && (
                        <div className="select-arrow">
                          <select
                            className="form-select with-arrow"
                            value={values.reportingManager || ''}
                            onChange={(e) => setFieldValue('reportingManager', e.target.value)}
                            onBlur={() => validateSingle('reportingManager')}
                            aria-invalid={!!(errors.reportingManager && touched.reportingManager)}
                          >
                            <option value="">{field.placeholder || 'Select'}</option>
                            {(MANAGERS_BY_DEPT[values.department] || []).map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Plain native selects */}
                      {field.type === 'select' && !field.dynamic && field.name !== 'salaryStructure' && (
                        <div className="select-arrow">
                          <Field
                            as="select"
                            name={field.name}
                            className="form-select with-arrow"
                            aria-invalid={!!(errors[field.name] && touched[field.name])}
                            onBlur={() => validateSingle(field.name)}
                          >
                            <option value="">{field.placeholder || 'Select'}</option>
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                            {field.name === 'gender' && (
                              <option value="Prefer not to say">Prefer not to say</option>
                            )}
                          </Field>
                        </div>
                      )}

                      {/* Salary Structure select — remove CTC if Worker Type is Contractual */}
                      {field.type === 'select' && field.name === 'salaryStructure' && (
                        <div className="select-arrow">
                          <Field
                            as="select"
                            name={field.name}
                            className="form-select with-arrow"
                            aria-invalid={!!(errors[field.name] && touched[field.name])}
                            onBlur={() => validateSingle(field.name)}
                          >
                            <option value="">{field.placeholder || 'Select'}</option>
                            {field.options
                              ?.filter((opt) => !(values.workerType === 'Contractual' && opt === 'CTC'))
                              .map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                          </Field>
                        </div>
                      )}

                      {/* Date */}
                      {field.type === 'date-ddmmyyyy' && <DateFieldDDMMYYYY name={field.name} onBlurValidate={validateSingle} />}

                      {/* Country/State/City */}
                      {field.type === 'country-select' && (
                        <CountrySelect name={field.name} placeholder={`Select ${field.label.toLowerCase()}`} onBlurValidate={validateSingle} />
                      )}
                      {field.type === 'state-select' && (
                        <StateSelect
                          name={field.name}
                          countryField={field.name.startsWith('office') ? 'officeCountry' : 'country'}
                          isDisabled={field.name.startsWith('office') ? !values.officeCountry : !values.country}
                          onBlurValidate={validateSingle}
                        />
                      )}
                      {field.type === 'city-select' && (
                        <CitySelect
                          name={field.name}
                          countryField={field.name.startsWith('office') ? 'officeCountry' : 'country'}
                          stateField={field.name.startsWith('office') ? 'officeState' : 'state'}
                          isDisabled={field.name.startsWith('office') ? !values.officeState : !values.state}
                          onBlurValidate={validateSingle}
                        />
                      )}

                      {/* Phone */}
                      {field.type === 'phone-intl' && (
                        <PhoneIntl
                          name={field.name}
                          required={field.required}
                          countryField={
                            field.name === 'phone'
                              ? 'nationality'
                              : field.name === 'workPhone'
                                ? 'officeCountry'
                                : 'nationality'
                          }
                          onBlurValidate={validateSingle}
                        />
                      )}

                      {/* Text / Email */}
                      {(field.type === 'text' || field.type === 'email') && !field.dynamic && field.type !== 'date-ddmmyyyy' && (
                        <Field
                          type={field.type}
                          name={field.name}
                          className="form-control"
                          placeholder={placeholder || `Enter ${label?.toLowerCase?.() || ''}`}
                          aria-invalid={!!(errors[field.name] && touched[field.name])}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (NUMERIC_FIELDS.has(field.name)) val = val.replace(/[^\d.]/g, '');
                            if (field.name === 'displayName') {
                              setFieldValue('__displayNameManual', val !== '');
                              setFieldValue('displayName', val);
                              return;
                            }
                            setFieldValue(field.name, val);
                          }}
                          onBlur={() => validateSingle(field.name)}
                        />
                      )}

                      {/* Error (avoid double-render for special widgets) */}
                      {!['phone-intl', 'country-select', 'state-select', 'city-select'].includes(field.type) &&
                        field.name !== 'shiftTiming' && (
                          <ErrorMessage name={field.name} component="div" className="error text-danger small mt-1" />
                        )}
                    </div>
                  );
                })}

                {/* Dynamic CTC strip (visible on Compensation step only) */}
                {values.salaryStructure === 'CTC' && step === COMP_STEP_INDEX && (() => {
                  const ctc = buildCtcView(values);
                  return (
                    <div className="calc-card">
                      <div className="calc-row">
                        <div className="calc-item">
                          <span className="calc-label">Gross (Per Annum)</span>
                          <span className="calc-value">{moneyFormat(values.officeCountry, ctc.gross)}</span>
                        </div>

                        {ctc.items.map((it) => (
                          <div className="calc-item" key={it.code}>
                            <span className="calc-label">{it.label}</span>
                            <span className="calc-value">-{moneyFormat(values.officeCountry, it.amount)}</span>
                          </div>
                        ))}

                        <div className="calc-item">
                          <span className="calc-label">Total Statutory</span>
                          <span className="calc-value">-{moneyFormat(values.officeCountry, ctc.totalStatutory)}</span>
                        </div>

                        <div className="calc-item">
                          <span className="calc-label">In-Hand (Per Annum)</span>
                          <span className="calc-value">{moneyFormat(values.officeCountry, ctc.netAnnual)}</span>
                        </div>
                      </div>

                      {ctc.employerNotes?.length ? (
                        <div className="calc-note">
                          {ctc.employerNotes[0]}
                        </div>
                      ) : null}
                    </div>
                  );
                })()}

                {/* Footer — single centered primary button */}
                {!previewOpen && (
                  <div className="form-buttons center-only">
                    <Button
                      variant="solid"
                      size="sm"
                      onClick={submitForm}
                      label={step === onboardingSteps.length - 1 ? 'Preview' : 'Save & Next'}
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                {/* Sectioned Preview + per-section Edit (with Compensation Summary) */}
                {previewOpen && (
                  <div className="preview-backdrop" onClick={() => setPreviewOpen(false)}>
                    <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={`preview-close ${closeSide}`}
                        aria-label="Close preview"
                        onClick={() => setPreviewOpen(false)}
                        title="Close"
                      >
                        &times;
                      </button>

                      <div className={`preview-hero ${themeColor}`}>
                        <div className="preview-title"><span className="dot" />Review & Confirm</div>
                        <div className="preview-sub">Check each section. Use Edit to jump back.</div>
                      </div>

                      <div className="preview-body">
                        {previewSections.map((sec, idx) => {
                          const isCompSummary = !!sec.__ctc;
                          return (
                            <div className="pv-section" key={sec.title}>
                              <div className="pv-section-head">
                                <div className="pv-section-title">{sec.title}</div>
                                {!isCompSummary && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    label="Edit"
                                    onClick={() => {
                                      setPreviewOpen(false);
                                      setStep(idx);
                                    }}
                                  />
                                )}
                              </div>

                              {!isCompSummary ? (
                                <div className="kv-list">
                                  {sec.fields.map(({ name, label }) => (
                                    <div key={name} className="kv-row">
                                      <div className="kv-k">{label}</div>
                                      <div className="kv-v">{prettyValue(name)}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="kv-list">
                                  <div className="kv-row">
                                    <div className="kv-k">Gross (Per Annum)</div>
                                    <div className="kv-v">{moneyFormat(values.officeCountry, sec.__ctc.gross)}</div>
                                  </div>
                                  {sec.__ctc.items.map((it, i) => (
                                    <div className="kv-row" key={i}>
                                      <div className="kv-k">{it.label}</div>
                                      <div className="kv-v">-{moneyFormat(values.officeCountry, it.amount)}</div>
                                    </div>
                                  ))}
                                  <div className="kv-row">
                                    <div className="kv-k">Total Statutory</div>
                                    <div className="kv-v">-{moneyFormat(values.officeCountry, sec.__ctc.totalStatutory)}</div>
                                  </div>
                                  <div className="kv-row">
                                    <div className="kv-k">In-Hand (Per Annum)</div>
                                    <div className="kv-v">{moneyFormat(values.officeCountry, sec.__ctc.netAnnual)}</div>
                                  </div>
                                  {sec.__ctc.employerNotes?.length ? (
                                    <div className="pv-note">{sec.__ctc.employerNotes[0]}</div>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="preview-footer">
                        <Button
                          variant='solid'
                          size='sm'
                          label='Confirm & Submit'
                          onClick={() => {
                            setPreviewOpen(false);
                            console.log('SUBMIT PAYLOAD', values);
                            alert('Submitted! (see console for payload)');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default EmployeeOnboarding;
