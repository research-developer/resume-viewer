import { FC } from "react";
import { useChartColors } from "../../../ColorUtils";

type MetricItem = {
  label: string;
  value: number; // Value as a percentage (0–100)
  color?: string; // Optional bar color
};

type MetricListUIProps = {
  items: MetricItem[];
};

/**
 * MetricListCardUI renders a list of items with percentage bars and labels.
 *
 * - `items` is an array of objects containing a label, value (as %), and optional color
 * - Visually shows relative comparisons with filled bars beside text labels
 */
export const MetricListUI: FC<MetricListUIProps> = ({ items }) => {
  const colors = useChartColors(items.length);
  return (
    <div className="flex flex-col gap-4 w-full">
      {items.map((item, index) => {
        const color = item.color ?? colors[index % colors.length];
        return (
          <div key={index} className="flex flex-col w-full">
            <div className="flex justify-between text-sm text-[var(--color-secondary)] mb-1">
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-border)] rounded-full">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(item.value, 100)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
