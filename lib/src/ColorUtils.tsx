import { JSX, useMemo } from "react";
import { ac } from "vitest/dist/chunks/reporters.d.79o4mouw.js";

/**
 * @fileoverview Color utility functions and constants for the application
 * @tailwind-purge-preserve This file contains CSS variable references that should not be purged
 */

/* -------------------------------------------------------------------------- */
/*                                  Tokens                                    */
/* -------------------------------------------------------------------------- */

export const BASE_ACCENT_COLORS = [
  "purple",
  "cyan",
  "green",
  "blue",
  "orange",
  "pink",
  "yellow",
  "red",
] as const;

export const LIGHT_ACCENT_SUFFIX = "-light";
export const DARK_ACCENT_SUFFIX = "-dark";

/**
 * All accent‑color tokens, inferred from BASE_ACCENT_COLORS so we never fall out
 * of sync when adding new hues.
 */
export const ACCENT_COLORS = [
  ...BASE_ACCENT_COLORS,
  ...BASE_ACCENT_COLORS.map((c) => `${c}${LIGHT_ACCENT_SUFFIX}`),
  ...BASE_ACCENT_COLORS.map((c) => `${c}${DARK_ACCENT_SUFFIX}`),
] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];
export type AccentColorBase = (typeof BASE_ACCENT_COLORS)[number];
export type AccentColorLight =
  `${AccentColorBase}${typeof LIGHT_ACCENT_SUFFIX}`;
export type AccentColorDark = `${AccentColorBase}${typeof DARK_ACCENT_SUFFIX}`;

/* -------------------------------------------------------------------------- */
/*                                 Gradients                                  */
/* -------------------------------------------------------------------------- */

export const GRADIENTS = [
  "purple-pink",
  "cyan-blue",
  "green-yellow",
  "orange-red",
  "blue-purple",
  "pink-purple",
  "yellow-green",
  "red-orange",
  "purple-blue",
  "pink-blue",
  "yellow-red",
  "green-blue",
  "orange-purple",
  "blue-green",
  "red-yellow",
  "purple-orange",
] as const;

export type GradientType = (typeof GRADIENTS)[number];

/* -------------------------------------------------------------------------- */
/*                        CSS Variable Explicit References                    */
/* -------------------------------------------------------------------------- */

/**
 * Explicit references to all CSS variables to prevent TailwindCSS from purging them.
 * @preserve-tailwind
 */
export const CSS_VAR_REFERENCES = {
  // Base/Core colors
  colorBackground: "var(--color-background)",
  colorSurface: "var(--color-surface)",
  colorPrimary: "var(--color-primary)",
  colorSecondary: "var(--color-secondary)",
  colorBorder: "var(--color-border)",
  colorMuted: "var(--color-muted)",
  colorBase: "var(--color-base)",
  colorAccent: "var(--color-accent)",

  // Accent colors
  colorAccentPurple: "var(--color-accent-purple)",
  colorAccentCyan: "var(--color-accent-cyan)",
  colorAccentGreen: "var(--color-accent-green)",
  colorAccentBlue: "var(--color-accent-blue)",
  colorAccentOrange: "var(--color-accent-orange)",
  colorAccentPink: "var(--color-accent-pink)",
  colorAccentYellow: "var(--color-accent-yellow)",
  colorAccentRed: "var(--color-accent-red)",

  // Light accent variants
  colorAccentPurpleLight: "var(--color-accent-purple-light)",
  colorAccentCyanLight: "var(--color-accent-cyan-light)",
  colorAccentGreenLight: "var(--color-accent-green-light)",
  colorAccentBlueLight: "var(--color-accent-blue-light)",
  colorAccentOrangeLight: "var(--color-accent-orange-light)",
  colorAccentPinkLight: "var(--color-accent-pink-light)",
  colorAccentYellowLight: "var(--color-accent-yellow-light)",
  colorAccentRedLight: "var(--color-accent-red-light)",

  // Dark accent variants
  colorAccentPurpleDark: "var(--color-accent-purple-dark)",
  colorAccentCyanDark: "var(--color-accent-cyan-dark)",
  colorAccentGreenDark: "var(--color-accent-green-dark)",
  colorAccentBlueDark: "var(--color-accent-blue-dark)",
  colorAccentOrangeDark: "var(--color-accent-orange-dark)",
  colorAccentPinkDark: "var(--color-accent-pink-dark)",
  colorAccentYellowDark: "var(--color-accent-yellow-dark)",
  colorAccentRedDark: "var(--color-accent-red-dark)",

  // Gradients
  gradientPurplePink: "var(--gradient-purple-pink)",
  gradientCyanBlue: "var(--gradient-cyan-blue)",
  gradientGreenYellow: "var(--gradient-green-yellow)",
  gradientOrangeRed: "var(--gradient-orange-red)",
  gradientBluePurple: "var(--gradient-blue-purple)",
  gradientPinkPurple: "var(--gradient-pink-purple)",
  gradientYellowGreen: "var(--gradient-yellow-green)",
  gradientRedOrange: "var(--gradient-red-orange)",
  gradientPurpleBlue: "var(--gradient-purple-blue)",
  gradientPinkBlue: "var(--gradient-pink-blue)",
  gradientYellowRed: "var(--gradient-yellow-red)",
  gradientGreenBlue: "var(--gradient-green-blue)",
  gradientOrangePurple: "var(--gradient-orange-purple)",
  gradientBlueGreen: "var(--gradient-blue-green)",
  gradientRedYellow: "var(--gradient-red-yellow)",
  gradientPurpleOrange: "var(--gradient-purple-orange)",
};

/* -------------------------------------------------------------------------- */
/*                             CSS Variable Utils                             */
/* -------------------------------------------------------------------------- */

/**
 * Reads a CSS custom property, returning a fallback when running server‑side.
 */
export const cssVar = (name: string, fallback = ""): string =>
  typeof window === "undefined"
    ? fallback
    : getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || fallback;

export const getAccentColor = (token: AccentColor): string =>
  token.startsWith("var(") || !ACCENT_COLORS.includes(token as AccentColor)
    ? token
    : `var(--color-accent-${token})`;

export const getGradient = (token: GradientType): string =>
  token.startsWith("var(") ? token : `var(--gradient-${token})`;

/* -------------------------------------------------------------------------- */
/*                              Palette Helpers                               */
/* -------------------------------------------------------------------------- */

/**
 * Returns an array of accent colors long enough to cover *count* chart series.
 * Colors cycle deterministically through the base palette.
 */
export const getAccentColors = (count: number): string[] => {
  const colors: string[] = new Array(count);
  for (let i = 0; i < count; i++) {
    colors[i] = getAccentColor(ACCENT_COLORS[i % ACCENT_COLORS.length]);
  }
  return colors;
};

/**
 * React hook that memoises a palette for the given number of series.
 */
export const useChartColors = (seriesCount: number): string[] =>
  useMemo(() => getAccentColors(seriesCount), [seriesCount]);

/**
 * Picks a color from `colors`, wrapping when index ≥ length.
 */
export const getColorByIndex = (
  colors: readonly string[],
  index: number
): string => colors[index % colors.length];

/* -------------------------------------------------------------------------- */
/*                             Recharts Helpers                               */
/* -------------------------------------------------------------------------- */

/**
 * Generates a vertical fading gradient suitable for area charts. Place this
 * inside Recharts' `<defs>`.
 */
export const createChartGradient = (
  id: string,
  color: AccentColor,
  opacity: { start?: number; end?: number } = { start: 0.8, end: 0 }
): JSX.Element => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop
      offset="5%"
      stopColor={getAccentColor(color)}
      stopOpacity={opacity.start}
    />
    <stop
      offset="95%"
      stopColor={getAccentColor(color)}
      stopOpacity={opacity.end}
    />
  </linearGradient>
);
