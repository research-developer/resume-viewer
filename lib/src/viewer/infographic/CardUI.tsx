import { FC, PropsWithChildren } from "react";
import { CardTitleUI } from "./CardTitleUI";

type InfographicCardProps = {
  title?: React.ReactElement | string;
  className?: string;
  size?: string;
};

/**
 * Base card wrapper for infographic content. Handles layout, padding, shadow, and scale interaction.
 * Designed to be composable: accepts children to embed chart visualizations, metrics, or diagrams.
 * Title is displayed prominently at the top.
 */
export const CardUI: FC<PropsWithChildren<InfographicCardProps>> = ({
  title,
  children,
  className,
  size,
}) => (
  <div
    className={`flex flex-row rounded-[var(--radius-card)] shadow-[var(--shadow-card)] bg-[var(--color-surface)] border border-[var(--color-border)] transition-transform duration-300 hover:scale-[1.01] gap-4 ${className} ${
      size || "max-w-md"
    }`}
  >
    <div className="flex flex-col gap-4 p-[var(--spacing-card)] text-[var(--color-secondary)]">
      {typeof title === "string" ? <CardTitleUI title={title} /> : title}
      <div className="flex flex-col items-center w-full">{children}</div>
    </div>
  </div>
);
