import { MD3LightTheme, MD3DarkTheme, MD3Theme } from "react-native-paper";

export type ThemeMode =
    | "defaultBlue"

    // Light themes
    | "emeraldGreen"
    | "sunsetOrange"
    | "royalPurple"
    | "rosePetal"
    | "oceanBreeze"

    // Dark themes
    | "darkSlate"
    | "darkMidnightNeon"
    | "darkCyberpunkGold"
    | "darkCrimsonVamp"
    | "darkDeepOcean"
    | "darkForestShadow";

export const themeSchemes: Record<ThemeMode, MD3Theme> = {
  defaultBlue: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#3b82f6",
      background: "#f8fafc",
      surface: "#ffffff",
      surfaceVariant: "#e5e7eb",

      primaryContainer: "#dbeafe",
      onPrimaryContainer: "#1e40af",
      secondaryContainer: "#e5e7eb",
      onSecondaryContainer: "#374151",
      tertiaryContainer: "#eff6ff",
      onErrorContainer: "#991b1b",
      errorContainer: "#fee2e2",
    },
    roundness: 8,
  },
  emeraldGreen: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#10b981",
      background: "#f4fbf7",
      surface: "#ffffff",
      surfaceVariant: "#d1e7dd",

      primaryContainer: "#d1fae5",
      onPrimaryContainer: "#065f46",
      secondaryContainer: "#e6f4ea",
      onSecondaryContainer: "#1e3a1e",
      tertiaryContainer: "#f0fdf4",
      errorContainer: "#fee2e2",
      onErrorContainer: "#991b1b",
    },
    roundness: 12,
  },
  darkSlate: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: "#60a5fa",
      background: "#0f172a",
      surface: "#1e293b",
      surfaceVariant: "#475569",
      onSurface: "#f8fafc",
      onSurfaceVariant: "#94a3b8",

      primaryContainer: "#1e3a8a",
      onPrimaryContainer: "#dbeafe",
      secondaryContainer: "#334155",
      onSecondaryContainer: "#e2e8f0",
      tertiaryContainer: "#1e293b",
      errorContainer: "#7f1d1d",
      onErrorContainer: "#fca5a5",
    },
    roundness: 10,
  },
  sunsetOrange: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#f97316",
      background: "#fffaf7",
      surface: "#ffffff",
      surfaceVariant: "#fed7aa",

      primaryContainer: "#ffedd5",
      onPrimaryContainer: "#9a3412",
      secondaryContainer: "#fde6d2",
      onSecondaryContainer: "#431407",
      tertiaryContainer: "#fff7ed",
      errorContainer: "#fee2e2",
      onErrorContainer: "#991b1b",
    },
    roundness: 6,
  },
  royalPurple: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#7c3aed",
      background: "#faf5ff",
      surface: "#ffffff",
      surfaceVariant: "#e9d5ff",

      primaryContainer: "#f3e8ff",
      onPrimaryContainer: "#5b21b6",
      secondaryContainer: "#f3e8ff",
      onSecondaryContainer: "#4c1d95",
      tertiaryContainer: "#fae8ff",
      errorContainer: "#fee2e2",
      onErrorContainer: "#991b1b",
    },
    roundness: 8,
  },
  rosePetal: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#db2777",
      background: "#fff5f7",
      surface: "#ffffff",
      surfaceVariant: "#fbcfe8",

      primaryContainer: "#fce7f3",
      onPrimaryContainer: "#9d174d",
      secondaryContainer: "#ffe4e6",
      onSecondaryContainer: "#4c0519",
      tertiaryContainer: "#fff1f2",
      errorContainer: "#fee2e2",
      onErrorContainer: "#991b1b",
    },
    roundness: 14,
  },
  oceanBreeze: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#06b6d4",
      background: "#f0fdfa",
      surface: "#ffffff",
      surfaceVariant: "#cffafe",

      primaryContainer: "#ecfeff",
      onPrimaryContainer: "#155e75",
      secondaryContainer: "#e0f2fe",
      onSecondaryContainer: "#0c4a6e",
      tertiaryContainer: "#f0f9ff",
      errorContainer: "#fee2e2",
      onErrorContainer: "#991b1b",
    },
    roundness: 10,
  },
  darkMidnightNeon: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: "#a855f7",
      background: "#090514",
      surface: "#120d24",
      surfaceVariant: "#2d1b4e",
      onSurface: "#f3e8ff",
      onSurfaceVariant: "#c084fc",

      primaryContainer: "#4c1d95",
      onPrimaryContainer: "#f3e8ff",
      secondaryContainer: "#3b0764",
      onSecondaryContainer: "#e9d5ff",
      tertiaryContainer: "#1e1b4b",
      errorContainer: "#500724",
      onErrorContainer: "#fda4af",
    },
    roundness: 12,
  },
  darkCyberpunkGold: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: "#eab308",
      background: "#121212",
      surface: "#1c1c1e",
      surfaceVariant: "#2e2e33",
      onSurface: "#ffffff",
      onSurfaceVariant: "#a1a1aa",

      primaryContainer: "#713f12",
      onPrimaryContainer: "#fef08a",
      secondaryContainer: "#27272a",
      onSecondaryContainer: "#e4e4e7",
      tertiaryContainer: "#18181b",
      errorContainer: "#7f1d1d",
      onErrorContainer: "#fca5a5",
    },
    roundness: 4,
  },

  /* ==========================================
     NEW DARK THEMES (Prefixed with dark)
     ========================================== */
  darkCrimsonVamp: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: "#f43f5e",
      background: "#0f0507",
      surface: "#1a0b0e",
      surfaceVariant: "#371319",
      onSurface: "#ffe4e6",
      onSurfaceVariant: "#fb7185",

      primaryContainer: "#881337",
      onPrimaryContainer: "#ffe4e6",
      secondaryContainer: "#4c0519",
      onSecondaryContainer: "#fda4af",
      tertiaryContainer: "#27050f",
      errorContainer: "#7f1d1d",
      onErrorContainer: "#fca5a5",
    },
    roundness: 6,
  },
  darkDeepOcean: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: "#38bdf8",
      background: "#030712",
      surface: "#0b1329",
      surfaceVariant: "#1c2541",
      onSurface: "#f0f9ff",
      onSurfaceVariant: "#7dd3fc",

      primaryContainer: "#0369a1",
      onPrimaryContainer: "#e0f2fe",
      secondaryContainer: "#0f172a",
      onSecondaryContainer: "#bae6fd",
      tertiaryContainer: "#020617",
      errorContainer: "#7f1d1d",
      onErrorContainer: "#fca5a5",
    },
    roundness: 10,
  },
  darkForestShadow: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: "#4ade80",
      background: "#050806",
      surface: "#0c140e",
      surfaceVariant: "#192c1e",
      onSurface: "#f0fdf4",
      onSurfaceVariant: "#86efac",

      primaryContainer: "#15803d",
      onPrimaryContainer: "#dcfce7",
      secondaryContainer: "#052e16",
      onSecondaryContainer: "#bbf7d0",
      tertiaryContainer: "#021a0c",
      errorContainer: "#7f1d1d",
      onErrorContainer: "#fca5a5",
    },
    roundness: 12,
  },
};

export type themeKey = keyof typeof themeSchemes;