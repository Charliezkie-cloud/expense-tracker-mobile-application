import { Alert, Linking, TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { logger } from "react-native-logs";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {deleteDatabaseAsync, useSQLiteContext} from "expo-sqlite";
import ExpoUpdates from "expo-updates/src/ExpoUpdates";

import { useSettingsStore } from "../hooks/useSettingsStore";
import { getSettingsStyles } from "../styles/mainStyles";
import { ThemeMode } from "../theme/themeSchemes";
import { CurrencyCode } from "../types/settings.types";
import {useAppTheme} from "../components/ThemeContext";

const APPLICATION_DB = "expense_tracker.db";
const socials = [
  {
    title: "Facebook",
    icon: "facebook",
    url: "https://www.facebook.com/Charlzk05"
  },
  {
    title: "Instagram",
    icon: "instagram",
    url: "https://www.instagram.com/charlzk_"
  },
  {
    title: "Github",
    icon: "github",
    url: "https://github.com/Charliezkie-cloud"
  },
  {
    title: "LinkedIn",
    icon: "linkedin",
    url: "https://ph.linkedin.com/in/charles-henry-tinoy-jr-850b1831b"
  }
];
const themes: { name: string, value: ThemeMode }[] = [
  { name: "Default", value: "defaultBlue" },
  { name: "Dark Slate", value: "darkSlate" },
  { name: "Emerald Green", value: "emeraldGreen" },
  { name: "Sunset Orange", value: "sunsetOrange" },
];
const currencies = ["PHP", "USD", "EUR", "JPY", "GBP"];
const log = logger.createLogger();

export default function SettingsScreen() {
  // Hooks
  const settings = useSettingsStore((state) => state.settings);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setCurrencyCode = useSettingsStore((state) => state.setCurrency);

  // Hooks
  const db = useSQLiteContext();
  const theme = useTheme();
  const styles = getSettingsStyles(theme);
  const { currentThemeKey, setCurrentThemeKey } = useAppTheme();

  // States
  const [currencySelectedItem, setCurrencySelectedItem] = useState<CurrencyCode>("PHP");
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(currentThemeKey);

  // Handlers
  function currencyPickerOnValueChange(itemValue: CurrencyCode) {
    setCurrencySelectedItem(itemValue);
    setCurrencyCode(itemValue);
  }

  function themePickerOnValueChange(itemValue: ThemeMode) {
    setSelectedTheme(itemValue);
    setCurrentThemeKey(itemValue);
    setTheme(itemValue);
  }

  function clearCacheOnPress() {
    Alert.alert(
      "Clear cache confirmation",
      "Are you sure you want to clear your local data? This action will remove all categories, expenses, and budgets permanently.",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              await deleteDatabase();

              Alert.alert("Success", "Cache cleared successfully.");
            } catch (e) {
              log.error({
                error: "Something went wrong while clearing the cache.",
                errorInfo: e
              });
              Alert.alert("Error", "Failed to clear cache.");
            }
          }
        },
        { text: "No", style: "cancel" }
      ]
    );
  }

  // Helpers
  function openLink(url: string) {
    Linking.openURL(url);
  }

  /** A VERY DANGEROUS HELPER */
  async function deleteDatabase() {
    try {
      if (!db) return;

      await db.closeAsync();
      await deleteDatabaseAsync(APPLICATION_DB);
      await ExpoUpdates.reload();
    } catch (error) {
      log.error({
        error: "Something went wrong while deleting the database.",
        details: error instanceof Error ? error.message : String(error)
      });
      Alert.alert("Error", "Something went wrong while deleting the application cache.");
    }
  }

  // Use effects
  useEffect(() => {
    setCurrencySelectedItem(settings.currencyCode);
  }, [settings]);

  return (
    <View style={styles.mainContainer}>

      {/* Theme Config Section */}
      <View style={styles.sectionContainer}>
        <Text variant="bodyLarge" style={styles.sectionLabel}>Theme</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            style={styles.picker}
            dropdownIconColor={theme.colors.onSurfaceVariant}
            selectedValue={selectedTheme}
            onValueChange={(itemValue) => themePickerOnValueChange(itemValue)}
          >
            {themes.map((item, index) => (
              <Picker.Item
                key={`currency-picker-item-${index}`}
                label={item.name}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Currency Config Section */}
      <View style={styles.sectionContainer}>
        <Text variant="bodyLarge" style={styles.sectionLabel}>Currency</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            style={styles.picker}
            dropdownIconColor={theme.colors.onSurfaceVariant}
            selectedValue={currencySelectedItem}
            onValueChange={(itemValue) => currencyPickerOnValueChange(itemValue as CurrencyCode)}
          >
            {currencies.map((item, index) => (
              <Picker.Item
                key={`currency-picker-item-${index}`}
                label={item}
                value={item}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Cache Config Section */}
      <View style={styles.sectionContainer}>
        <Text variant="bodyLarge" style={styles.sectionLabel}>Cache</Text>
        <Button
          mode="contained-tonal"
          buttonColor={theme.colors.errorContainer}
          textColor={theme.colors.onErrorContainer}
          style={styles.actionButton}
          onPress={clearCacheOnPress}
        >
          Clear Cache
        </Button>
      </View>

      {/* Support section */}
      <View style={styles.sectionContainer}>
        <Text variant="bodyLarge" style={styles.sectionLabel}>Support</Text>
        <Button
          mode="contained-tonal"
          style={styles.actionButton}
          onPress={() => openLink("https://github.com/Charliezkie-cloud/expense-tracker-mobile-application/issues/new")}
        >
          Report an Issue
        </Button>
      </View>

      {/* Modernized Project Card Component */}
      <View style={styles.infoCard}>
        <Text variant="titleLarge" style={styles.infoTitle}>Project Information</Text>

        <View style={styles.textGroup}>
          <Text variant="bodyLarge" style={styles.infoText}>Version: 1.0.1</Text>
          <Text variant="bodyLarge" style={styles.infoText}>Developed by Charles Henry M. Tinoy Jr.</Text>
        </View>

        {/* Brand Link Matrix Grid */}
        <View>
          <View style={styles.socialsRow}>
            {socials.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={styles.socialTouchTarget}
                onPress={() => openLink(item.url)}
              >
                <FontAwesome6
                  name={item.icon}
                  size={26}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Button
            mode="contained"
            style={styles.developerButton}
            onPress={() => openLink("https://charlzk.vercel.app/")}
          >
            View Developer Portfolio
          </Button>
        </View>
      </View>

    </View>
  );
}