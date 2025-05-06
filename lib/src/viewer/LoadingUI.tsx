import { FC } from "react";

export const LoadingUI: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-16 h-16">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-blue animate-spin-fast"></div>

        {/* Inner glowing ring */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent-cyan animate-spin-slow"></div>

        {/* Center dot */}
        <div className="absolute inset-5 bg-accent-blue rounded-full shadow-[var(--neon-glow-blue)]"></div>
      </div>
    </div>
  );
};
