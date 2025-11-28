// utils/currency.ts or utils/numbers.ts

/**
 * Round amount to nearest whole number
 */
export const roundAmount = (amount: number | string): number => {
    return Math.round(Number(amount) || 0);
};

/**
 * Format amount as currency with no decimals
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: $)
 * @returns Formatted string like "$50" not "$50.00"
 */
export const formatCurrency = (amount: number | string, currency: string = '$'): string => {
    const rounded = roundAmount(amount);
    return `${currency}${rounded}`;
};

/**
 * Format amount as currency with commas for thousands
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: $)
 * @returns Formatted string like "$1,250" not "$1250.00"
 */
export const formatCurrencyWithCommas = (amount: number | string, currency: string = '$'): string => {
    const rounded = roundAmount(amount);
    return `${currency}${rounded.toLocaleString()}`;
};

/**
 * Calculate percentage and round to whole number
 */
export const calculatePercentage = (amount: number, percentage: number): number => {
    return roundAmount(amount * (percentage / 100));
};

/**
 * Calculate service fee (5%) and round
 */
export const calculateServiceFee = (amount: number, feePercentage: number = 5): number => {
    return roundAmount(amount * (feePercentage / 100));
};

/**
 * Calculate total with fee
 */
export const calculateTotalWithFee = (amount: number, feePercentage: number = 5): number => {
    const fee = calculateServiceFee(amount, feePercentage);
    return roundAmount(amount + fee);
};