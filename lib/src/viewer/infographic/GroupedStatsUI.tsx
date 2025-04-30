import { FC, ReactNode } from "react";

type StatBlock = {
  label: string; // E.g. "Latency"
  value: string | number; // E.g. "45ms"
  icon?: ReactNode; // Optional: visual icon, emoji, or SVG
  color?: string; // Optional: text or icon accent color
};

type GroupedStatsUIProps = {
  title: string;
  stats: StatBlock[];
};

/**
 * GroupedStatsCardUI shows multiple compact stat blocks in a responsive grid.
 *
 * - `stats` is an array of metric blocks, each with a label and a value
 * - Optional icon and color make each block visually distinct
 */
export const GroupedStatsUI: FC<GroupedStatsUIProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full text-center">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-2 rounded-[var(--radius-card)] bg-[var(--color-surface)] shadow-sm"
        >
          {stat.icon && (
            <div
              className="mb-2 text-xl"
              style={{ color: stat.color ?? "var(--color-accent-blue)" }}
            >
              {stat.icon}
            </div>
          )}
          <div className="text-[var(--color-primary)] text-lg font-bold">
            {stat.value}
          </div>
          <div className="text-[var(--color-muted)] text-xs mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
