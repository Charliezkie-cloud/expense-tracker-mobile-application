import { DefaultTheme, MD3Theme } from "react-native-paper";

export const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3b82f6",
    secondary: "#e5e7eb",
    secondaryContainer: "#e5e7eb",
    surfaceVariant: "#e5e7eb",
  },
  roundness: 8
};