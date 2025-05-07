import { FC } from "react";

/**
 * A subtle, top-right corner ribbon that displays the label “PROTOTYPE” in all caps.
 * Visually clean and professional: light gray background, dark text, angled diagonally (45 degrees).
 * Ribbon is non-interactive and responsive. Follows project UI standards.
 */
export const PrototypeUI: FC = () => (
  <div
    className="select-none pointer-events-none z-50 absolute top-7 md:top-14 right-[-55px] md:right-[-55px] w-[185px] md:w-[250px] overflow-hidden"
    style={{ transform: "rotate(45deg)" }}
  >
    <span className="block text-center bg-accent-yellow-dark text-accent-yellow-light font-semibold tracking-widest text-xs md:text-xl py-1 shadow-sm border border-accent-dark uppercase">
      PROTOTYPE
    </span>
  </div>
);
