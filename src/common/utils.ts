/**
 * Check that a string is not empty
 */
export function isValidString(value?: string): boolean {
    return value != null && value.trim().length > 0;
}
