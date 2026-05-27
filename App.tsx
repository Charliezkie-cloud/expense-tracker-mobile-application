import { NavigationContainer } from '@react-navigation/native';
import {SQLiteProvider} from "expo-sqlite";
import {useEffect} from "react";
import ExpoNavigationBar from "expo-navigation-bar/src/ExpoNavigationBar";

import RootStack from './navigation/RootStack';
import { initializeDatabase } from "./database/initializeDatabase";
import {ThemeProvider} from "./components/ThemeContext";

const APPLICATION_DATABASE: string = process.env.EXPO_PUBLIC_APP_DATABASE ?? "";

export default function App() {
    useEffect(() => {
        async function setNativeNavBar() {
            await ExpoNavigationBar.setVisibilityAsync("hidden");
        }

        setNativeNavBar();
    }, []);

    return (
        <SQLiteProvider databaseName={APPLICATION_DATABASE} onInit={initializeDatabase}>
            <ThemeProvider>
                <NavigationContainer>
                    <RootStack />
                </NavigationContainer>
            </ThemeProvider>
        </SQLiteProvider>
    );
}