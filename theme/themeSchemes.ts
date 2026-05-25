import { MD3LightTheme, MD3DarkTheme, MD3Theme } from "react-native-paper";

export type ThemeMode = "defaultBlue" | "emeraldGreen" | "darkSlate" | "sunsetOrange";

export const themeSchemes: Record<ThemeMode, MD3Theme> = {
  defaultBlue: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#3b82f6",
      background: "#f8fafc",
      surface: "#ffffff",
      secondaryContainer: "#e5e7eb",
      surfaceVariant: "#e5e7eb",
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
      secondaryContainer: "#e6f4ea",
      surfaceVariant: "#d1e7dd",
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
      secondaryContainer: "#334155",
      surfaceVariant: "#475569",
      onSurface: "#f8fafc",
      onSurfaceVariant: "#94a3b8",
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
      secondaryContainer: "#ffedd5",
      surfaceVariant: "#fed7aa",
    },
    roundness: 6,
  },
};

export type themeKey = keyof typeof themeSchemes;