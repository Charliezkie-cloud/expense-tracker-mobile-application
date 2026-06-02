import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CurrencyCode, Settings } from "../types/settings.types"
import { ThemeMode } from "../theme/themeSchemes";

type SettingsStore = {
  settings: Settings;
  setCurrency: (currencyCode: CurrencyCode) => void;
  setTheme: (theme: ThemeMode) => void;
  setToDefault: () => void;
};

const defaultSettings: Settings = {
  currencyCode: "PHP",
  theme: "defaultBlue"
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setCurrency(currencyCode) {
        set((state) => ({
          settings: { ...state.settings, currencyCode }
        }));
      },
      setTheme(theme) {
        set((state) => ({
          settings: { ...state.settings, theme }
        }));
      },
      setToDefault() {
        set({ settings: defaultSettings });
      }
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);