import { FC } from "react";
import { CardUI } from "./CardUI";

type KPIStatCardProps = {
  label: string; // E.g. "Revenue"
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
export const KPIStatCardUI: FC<KPIStatCardProps> = ({
  label,
  value,
  trend,
}) => {
  const trendColor =
    trend?.direction === "up"
      ? "text-[var(--color-accent-green)]"
      : "text-red-500";
  const trendArrow = trend?.direction === "up" ? "▲" : "▼";

  return (
    <CardUI title={label}>
      <div className="flex flex-col items-center">
        <span className="text-5xl font-bold text-[var(--color-primary)]">
          {value}
        </span>
        {trend && (
          <span className={`mt-2 text-sm font-medium ${trendColor}`}>
            {trendArrow} {trend.value}
          </span>
        )}
      </div>
    </CardUI>
  );
};
