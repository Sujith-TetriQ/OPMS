import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function formatIdentifier(input) {
    const trimmed = input.trim();

    // If input contains '@', treat as email
    if (trimmed.includes('@')) {
        return trimmed;
    }

    // Try parsing as a phone number with a default country.
    // Specifying 'IN' helps parse local numbers without a country code.
    const phoneNumber = parsePhoneNumberFromString(trimmed, 'IN');

    // Check if the number is valid and return it in E.164 format.
    if (phoneNumber && phoneNumber.isValid()) {
        return phoneNumber.number; // Returns E.164 format: +919897866868
    }

    // Fallback: Return as-is for invalid input (e.g., usernames, garbage).
    return trimmed;
}