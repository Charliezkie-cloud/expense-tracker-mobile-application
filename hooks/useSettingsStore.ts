import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CurrencyCode, Settings } from "../types/data.types"

type SettingsStore = {
  settings: Settings;
  setCurrency: (currencyCode: CurrencyCode) => void;
};

const defaultSettings: Settings = {
  currencyCode: "PHP"
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setCurrency(currencyCode) {
        set((state) => ({
          settings: { ...state.settings, currencyCode }
        }));
      }
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);