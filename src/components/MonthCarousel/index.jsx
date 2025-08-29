// MonthCarousel.jsx
import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import months from "@data/mockPayrollData"; // your mock data file
import { useTheme } from "@context/ThemeContext";
import { format, subMonths, addMonths } from "date-fns";
import "./index.css";

/**
 * MonthCarousel
 * - props.onMonthSelect(monthObj) -> called when a month card is selected
 * - Shows months up to the current (working) month (includes current as Pending)
 * - Title = payroll month (month/year from the record)
 * - Process date = 1st day of next month (for past months); "Pending" for current month
 * - Default selected month = previous month (last processed)
 */
export default function MonthCarousel({ onMonthSelect }) {
    const { themeColor, themeMode } = useTheme(); // get theme color from context

    const VISIBLE_COUNT = 5; // number of cards visible at once
    const SCROLL_STEP = 2; // cards to move when arrow clicked

    // 1) compute current working month (month/year)
    const now = new Date();
    const currentMonthName = format(now, "MMMM");
    const currentYear = now.getFullYear();

    // 2) filter months to only include up to the current working month (exclude future months)
    const filteredMonths = (months || []).filter((m) => {
        const mDate = new Date(`${m.month} 1, ${m.year}`);
        const currentMonthDate = new Date(currentYear, now.getMonth(), 1);
        return mDate.getTime() <= currentMonthDate.getTime();
    });

    // 3) determine default selected month = previous month (the last processed month)
    const prevDate = subMonths(now, 1);
    const prevMonthName = format(prevDate, "MMMM");
    const prevMonthYear = prevDate.getFullYear();

    // find previous month within filteredMonths; fallback to last filtered
    const defaultSelected =
        filteredMonths.find((m) => m.month === prevMonthName && m.year === prevMonthYear) ||
        filteredMonths[filteredMonths.length - 1] ||
        null;

    // 4) state: startIndex controls which slice of filteredMonths we show
    const defaultIndex = defaultSelected ? Math.max(filteredMonths.indexOf(defaultSelected), 0) : 0;
    const calcInitialStart = () => {
        // try to center the defaultSelected when possible
        const centerOffset = Math.floor(VISIBLE_COUNT / 2);
        const proposed = Math.max(defaultIndex - centerOffset, 0);
        const maxStart = Math.max(filteredMonths.length - VISIBLE_COUNT, 0);
        return Math.min(proposed, maxStart);
    };

    const [startIndex, setStartIndex] = useState(calcInitialStart());
    const [activeMonthId, setActiveMonthId] = useState(defaultSelected?.id ?? null);

    // 5) expose selected month to parent on mount & whenever activeMonthId changes
    useEffect(() => {
        if (!defaultSelected) return;
        // fire initial selection event with defaultSelected
        onMonthSelect?.(defaultSelected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run only once on mount

    useEffect(() => {
        const sel = filteredMonths.find((m) => m.id === activeMonthId);
        if (sel) onMonthSelect?.(sel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeMonthId]);

    // 6) helper: clamp value between min and max
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    // 7) arrow handlers: move by SCROLL_STEP while clamping bounds
    const handlePrev = () => {
        setStartIndex((prev) => clamp(prev - SCROLL_STEP, 0, Math.max(filteredMonths.length - VISIBLE_COUNT, 0)));
    };

    const handleNext = () => {
        setStartIndex((prev) =>
            clamp(prev + SCROLL_STEP, 0, Math.max(filteredMonths.length - VISIBLE_COUNT, 0))
        );
    };

    // 8) card select handler: set active id and notify parent
    const handleSelect = (month) => {
        setActiveMonthId(month.id);
        onMonthSelect?.(month);
    };

    // 9) theme class for active card background
    const themeBgClass = `bg-${themeColor || "violet"}`;

    // 10) guard: if no months available after filtering, show message
    if (!filteredMonths || filteredMonths.length === 0) {
        return <div className="text-muted">No payroll months available yet.</div>;
    }

    // 11) derive slice of months to render
    const visibleMonths = filteredMonths.slice(startIndex, startIndex + VISIBLE_COUNT);

    return (
        <div className={`month-carousel d-flex align-items-center bg-${themeMode}-one pt-3 pb-3 rounded-2`}>
            {/* Left Arrow */}
            <button
                className="btn btn-link p-0 me-2"
                onClick={handlePrev}
                disabled={startIndex === 0}
                aria-label="Previous months"
            >
                <FiChevronLeft size={20} />
            </button>

            {/* Cards container (horizontal row) */}
            <div className={`d-flex overflow-hidden `} style={{ flex: 1 }}>
                {visibleMonths.map((month) => {
                    const isActive = activeMonthId === month.id;

                    // A) payroll month title is the month/year of the record (e.g. July-2025)
                    const payrollTitle = `${month.month}-${month.year}`;

                    // B) compute process date = 1st day of next month
                    const payrollDate = new Date(`${month.month} 1, ${month.year}`);
                    const processDateObj = addMonths(payrollDate, 1);
                    processDateObj.setDate(1);

                    // C) determine if this month is the current working month (should show Pending)
                    const isCurrentWorkingMonth =
                        month.month === currentMonthName && month.year === currentYear;

                    // D) display amount (from the payroll month object)
                    const amountStr =
                        typeof month.amount === "number" ? month.amount : "-";

                    // E) final process label (Pending for current working month, otherwise 1st of next month)
                    const processLabel = isCurrentWorkingMonth ? "Pending" : format(processDateObj, "dd-MM-yyyy");

                    return (
                        <div
                            key={month.id}
                            className={`month-card card p-2 me-2 flex-shrink-0 bg-${themeMode}-two ${isActive ? `${themeBgClass} text-white` : ""}`}
                            style={{ cursor: "pointer", minWidth: 140, maxWidth: 220 }}
                            onClick={() => handleSelect(month)}
                            role="button"
                            aria-pressed={isActive}
                        >
                            {/* Title: payroll month */}
                            <div className={`fw-bold ${isActive ? "text-white" : `text-${themeColor}`}`}>
                                {payrollTitle}
                            </div>

                            {/* Process date or Pending */}
                            <div className="small">{processLabel}</div>

                            {/* Amount for that payroll month */}
                            <div className={`fw-semibold ${isActive ? "text-white" : "text-dark"} pay-amount`}>₹{amountStr}</div>

                            {/* Optional small status badge */}
                            {month.status === "Pending" && (
                                <div className={`small mt-1 ${isActive ? "text-white" : "text-muted"}`}>Pending</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Right Arrow */}
            <button
                className="btn btn-link p-0 ms-2"
                onClick={handleNext}
                disabled={startIndex + VISIBLE_COUNT >= filteredMonths.length}
                aria-label="Next months"
            >
                <FiChevronRight size={20} />
            </button>
        </div>
    );
}
