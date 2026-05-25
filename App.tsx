import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {SQLiteProvider} from "expo-sqlite";
import {useEffect} from "react";

import RootStack from './navigation/RootStack';
import { initializeDatabase } from "./database/initializeDatabase";
import {ThemeProvider} from "./components/ThemeContext";
import ExpoNavigationBar from "expo-navigation-bar/src/ExpoNavigationBar";
import {APPLICATION_DB} from "./screens/SettingsScreen";

export default function App() {
    useEffect(() => {
        async function setNativeNavBar() {
            await ExpoNavigationBar.setVisibilityAsync("hidden");
        }

        setNativeNavBar();
    }, []);

    return (
        <SQLiteProvider databaseName={APPLICATION_DB} onInit={initializeDatabase}>
            <ThemeProvider>
                <StatusBar style="auto" />
                <NavigationContainer>
                    <RootStack />
                </NavigationContainer>
            </ThemeProvider>
        </SQLiteProvider>
    );
}