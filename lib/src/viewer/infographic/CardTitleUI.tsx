import { FC } from "react";

type CardTitleUIProps = {
  title: string;
};

export const CardTitleUI: FC<{ title: string }> = ({ title }) => (
  <h2 className="text-[var(--color-primary)] text-2xl font-bold">{title}</h2>
);
