import { FC } from "react";

type CardTitleUIProps = {
  title: string;
};

export const CardTitleUI: FC<CardTitleUIProps> = ({
  title,
}: CardTitleUIProps) => (
  <h2 className="text-[var(--color-accent-light)] text-2xl font-bold">
    {title}
  </h2>
);
