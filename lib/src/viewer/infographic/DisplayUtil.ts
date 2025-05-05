export function convertMonthsToYears(months: number): number {
  return roundToOneDecimalPlace(months / 12);
}

export function formatYears(value: number): string {
  return `${value.toLocaleString()} yrs`;
}

export function roundToOneDecimalPlace(value: number): number {
  return Math.round(value * 10) / 10; // Round the value to one decimal place
}
