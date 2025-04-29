import { FC, PropsWithChildren } from "react";

type InfographicCardProps = {
  title?: React.ReactElement | string;
};

/**
 * Base card wrapper for infographic content. Handles layout, padding, shadow, and scale interaction.
 * Designed to be composable: accepts children to embed chart visualizations, metrics, or diagrams.
 * Title is displayed prominently at the top.
 */
export const CardUI: FC<PropsWithChildren<InfographicCardProps>> = ({
  title,
  children,
}) => (
  <div className="w-full max-w-md mx-auto rounded-[var(--radius-card)] shadow-[var(--shadow-card)] bg-[var(--color-surface)] border border-[var(--color-border)] transition-transform duration-300 hover:scale-[1.01] p-4">
    <div className="flex flex-col p-[var(--spacing-card)] text-[var(--color-secondary)]">
      {title}
      <div className="flex flex-col items-center mt-4 w-full">{children}</div>
    </div>
  </div>
);
