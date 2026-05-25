import React, { createContext, useState, useContext, ReactNode } from 'react';
import { PaperProvider, MD3Theme } from 'react-native-paper';

import {themeKey, themeSchemes} from "../theme/themeSchemes";
import {useSettingsStore} from "../hooks/useSettingsStore";

type ThemeContextType = {
    currentThemeKey: themeKey;
    setCurrentThemeKey: (key: themeKey) => void;
    themes: Record<themeKey, MD3Theme>;
};
type ThemeProviderProps = { children: ReactNode; };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { theme } = useSettingsStore((state) => state.settings);
    const [currentThemeKey, setCurrentThemeKey] = useState<themeKey>(theme);
    const activeTheme = themeSchemes[theme] || themeSchemes.defaultBlue;

    return (
        <ThemeContext.Provider value={{ currentThemeKey, setCurrentThemeKey, themes: themeSchemes }}>
            <PaperProvider theme={activeTheme}>
                {children}
            </PaperProvider>
        </ThemeContext.Provider>
    );
};

export const useAppTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within a ThemeProvider layout tree.');
    }
    return context;
};