// only positive integers
export function isPositiveInteger(value: string) {
    // only accept string of integer (no symbols)
    const intValue = Number(value);
    if (isNaN(intValue)) return false;
    if (intValue < 0) return false;

    const parsedValue = String(intValue)
    if (String(value) !== String(parsedValue)) return false;

    return true;
}