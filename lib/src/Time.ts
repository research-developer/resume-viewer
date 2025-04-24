export function differenceInMonths(
  dateLeft: Date | undefined,
  dateRight: Date | undefined
): number {
  if (!dateLeft || !dateRight) return 0;
  const start = new Date(dateLeft);
  const end = new Date(dateRight);
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth()
  );
}
