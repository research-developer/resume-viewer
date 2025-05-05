import { FC } from "react";

type KPIStatUIProps = {
  label?: string; // E.g. "Users" or "Revenue"
  value: string; // E.g. "$1.2M"
  trend?: {
    value: string; // E.g. "+4.9%" or "-2.1%"
    direction: "up" | "down"; // Used for color/icon logic
  };
};

/**
 * KPIStatCardUI displays a primary metric with optional trend direction and value.
 * Often used for revenue, engagement, or user KPIs.
 *
 * - `label` is a short descriptor like "Users" or "Revenue"
 * - `value` is the large stat to emphasize (e.g. "$1.2M")
 * - `trend` is optional and shows an arrow + change percentage (e.g. "▲ +4.9%")
 */
export const KPIStatUI: FC<KPIStatUIProps> = ({ label, value, trend }) => {
  const trendColor =
    trend?.direction === "up"
      ? "text-[var(--color-accent-green)]"
      : "text-red-500";
  const trendArrow = trend?.direction === "up" ? "▲" : "▼";

  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl font-bold text-[var(--color-primary)]">
        {value}
      </span>
      {trend && (
        <span className={`mt-2 text-sm font-medium ${trendColor}`}>
          {trendArrow} {trend.value}
        </span>
      )}
      {label && (
        <span className="text-sm text-[var(--color-accent-light)] mt-1">
          {label}
        </span>
      )}
    </div>
  );
};
