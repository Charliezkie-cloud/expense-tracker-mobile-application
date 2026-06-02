import { Alert, Linking, TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { logger } from "react-native-logs";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteDatabaseAsync, useSQLiteContext } from "expo-sqlite";
import ExpoUpdates from "expo-updates/src/ExpoUpdates";

import { useSettingsStore } from "../hooks/useSettingsStore";
import { getSettingsStyles } from "../styles/screen-styles";
import { ThemeMode } from "../theme/themeSchemes";
import { CurrencyCode } from "../types/settings.types";
import { useAppTheme } from "../components/ThemeContext";

const APPLICATION_DB: string = process.env.EXPO_PUBLIC_APP_DATABASE ?? "";
const APPLICATION_VERSION: string = process.env.EXPO_PUBLIC_APP_VERSION ?? "";
const APPLICATION_REPOSITORY_URL: string = process.env.EXPO_PUBLIC_APP_REPOSITORY_URL ?? "";

const APPLICATION_AUTHOR: string = process.env.EXPO_PUBLIC_AUTHOR ?? "";
const APPLICATION_AUTHOR_PORTFOLIO: string = process.env.EXPO_PUBLIC_AUTHOR_PORTFOLIO ?? "";
const APPLICATION_AUTHOR_FACEBOOK: string = process.env.EXPO_PUBLIC_AUTHOR_FACEBOOK ?? "";
const APPLICATION_AUTHOR_INSTAGRAM: string = process.env.EXPO_PUBLIC_AUTHOR_INSTAGRAM ?? "";
const APPLICATION_AUTHOR_GITHUB: string = process.env.EXPO_PUBLIC_AUTHOR_GITHUB ?? "";
const APPLICATION_AUTHOR_LINKEDIN: string = process.env.EXPO_PUBLIC_AUTHOR_LINKEDIN ?? "";

const socials = [
  {
    title: "Facebook",
    icon: "facebook",
    url: APPLICATION_AUTHOR_FACEBOOK
  },
  {
    title: "Instagram",
    icon: "instagram",
    url: APPLICATION_AUTHOR_INSTAGRAM
  },
  {
    title: "Github",
    icon: "github",
    url: APPLICATION_AUTHOR_GITHUB
  },
  {
    title: "LinkedIn",
    icon: "linkedin",
    url: APPLICATION_AUTHOR_LINKEDIN
  }
];
const themes: { name: string, value: ThemeMode }[] = [
  // Light Themes
  { name: "Default (Light)", value: "defaultBlue" },
  { name: "Emerald Green (Light)", value: "emeraldGreen" },
  { name: "Sunset Orange (Light)", value: "sunsetOrange" },
  { name: "Royal Purple (Light)", value: "royalPurple" },
  { name: "Rose Petal (Light)", value: "rosePetal" },
  { name: "Ocean Breeze (Light)", value: "oceanBreeze" },
  // Dark Themes
  { name: "Dark Slate (Dark)", value: "darkSlate" },
  { name: "Midnight Neon (Dark)", value: "darkMidnightNeon" },
  { name: "Cyberpunk Gold (Dark)", value: "darkCyberpunkGold" },
  { name: "Crimson Vamp (Dark)", value: "darkCrimsonVamp" },
  { name: "Deep Ocean (Dark)", value: "darkDeepOcean" },
  { name: "Forest Shadow (Dark)", value: "darkForestShadow" },
];
const currencies: { name: string, value: CurrencyCode }[] = [
  { name: "AED (United Arab Emirates Dirham)", value: "AED" },
  { name: "AFN (Afghan Afghani)", value: "AFN" },
  { name: "ALL (Albanian Lek)", value: "ALL" },
  { name: "AMD (Armenian Dram)", value: "AMD" },
  { name: "ANG (Netherlands Antillean Guilder)", value: "ANG" },
  { name: "AOA (Angolan Kwanza)", value: "AOA" },
  { name: "ARS (Argentine Peso)", value: "ARS" },
  { name: "AUD (Australian Dollar)", value: "AUD" },
  { name: "AWG (Aruban Florin)", value: "AWG" },
  { name: "AZN (Azerbaijani Manat)", value: "AZN" },
  { name: "BAM (Bosnia and Herzegovina Convertible Mark)", value: "BAM" },
  { name: "BBD (Barbados Dollar)", value: "BBD" },
  { name: "BDT (Banglastani Taka)", value: "BDT" },
  { name: "BGN (Bulgarian Lev)", value: "BGN" },
  { name: "BHD (Bahraini Dinar)", value: "BHD" },
  { name: "BIF (Burundian Franc)", value: "BIF" },
  { name: "BMD (Bermudian Dollar)", value: "BMD" },
  { name: "BND (Brunei Dollar)", value: "BND" },
  { name: "BOB (Boliviano)", value: "BOB" },
  { name: "BRL (Brazilian Real)", value: "BRL" },
  { name: "BSD (Bahamian Dollar)", value: "BSD" },
  { name: "BTN (Bhutanese Ngultrum)", value: "BTN" },
  { name: "BWP (Botswana Pula)", value: "BWP" },
  { name: "BYN (Belarusian Ruble)", value: "BYN" },
  { name: "BZD (Belize Dollar)", value: "BZD" },
  { name: "CAD (Canadian Dollar)", value: "CAD" },
  { name: "CDF (Congolese Franc)", value: "CDF" },
  { name: "CHF (Swiss Franc)", value: "CHF" },
  { name: "CLP (Chilean Peso)", value: "CLP" },
  { name: "CNY (Chinese Yuan)", value: "CNY" },
  { name: "COP (Colombian Peso)", value: "COP" },
  { name: "CRC (Costa Rican Colón)", value: "CRC" },
  { name: "CUP (Cuban Peso)", value: "CUP" },
  { name: "CVE (Cape Verdean Escudo)", value: "CVE" },
  { name: "CZK (Czech Koruna)", value: "CZK" },
  { name: "DJF (Djiboutian Franc)", value: "DJF" },
  { name: "DKK (Danish Krone)", value: "DKK" },
  { name: "DOP (Dominican Peso)", value: "DOP" },
  { name: "DZD (Algerian Dinar)", value: "DZD" },
  { name: "EGP (Egyptian Pound)", value: "EGP" },
  { name: "ERN (Eritrean Nakfa)", value: "ERN" },
  { name: "ETB (Ethiopian Birr)", value: "ETB" },
  { name: "EUR (Euro)", value: "EUR" },
  { name: "FJD (Fiji Dollar)", value: "FJD" },
  { name: "FKP (Falkland Islands Pound)", value: "FKP" },
  { name: "GBP (Pound Sterling)", value: "GBP" },
  { name: "GEL (Georgian Lari)", value: "GEL" },
  { name: "GHS (Ghanaian Cedi)", value: "GHS" },
  { name: "GIP (Gibraltar Pound)", value: "GIP" },
  { name: "GMD (Gambian Dalasi)", value: "GMD" },
  { name: "GNF (Guinean Franc)", value: "GNF" },
  { name: "GTQ (Guatemalan Quetzal)", value: "GTQ" },
  { name: "GYD (Guyanese Dollar)", value: "GYD" },
  { name: "HKD (Hong Kong Dollar)", value: "HKD" },
  { name: "HNL (Honduran Lempira)", value: "HNL" },
  { name: "HRK (Croatian Kuna)", value: "HRK" },
  { name: "HTG (Haitian Gourde)", value: "HTG" },
  { name: "HUF (Hungarian Forint)", value: "HUF" },
  { name: "IDR (Indonesian Rupiah)", value: "IDR" },
  { name: "ILS (Israeli New Shekel)", value: "ILS" },
  { name: "INR (Indian Rupee)", value: "INR" },
  { name: "IQD (Iraqi Dinar)", value: "IQD" },
  { name: "IRR (Iranian Rial)", value: "IRR" },
  { name: "ISK (Icelandic Króna)", value: "ISK" },
  { name: "JMD (Jamaican Dollar)", value: "JMD" },
  { name: "JOD (Jordanian Dinar)", value: "JOD" },
  { name: "JPY (Japanese Yen)", value: "JPY" },
  { name: "KES (Kenyan Shilling)", value: "KES" },
  { name: "KGS (Kyrgyzstani Som)", value: "KGS" },
  { name: "KHR (Cambodian Riel)", value: "KHR" },
  { name: "KMF (Comorian Franc)", value: "KMF" },
  { name: "KPW (North Korean Won)", value: "KPW" },
  { name: "KRW (South Korean Won)", value: "KRW" },
  { name: "KWD (Kuwaiti Dinar)", value: "KWD" },
  { name: "KYD (Cayman Islands Dollar)", value: "KYD" },
  { name: "KZT (Kazakhstani Tenge)", value: "KZT" },
  { name: "LAK (Lao Kip)", value: "LAK" },
  { name: "LBP (Lebanese Pound)", value: "LBP" },
  { name: "LKR (Sri Lankan Rupee)", value: "LKR" },
  { name: "LRD (Liberian Dollar)", value: "LRD" },
  { name: "LSL (Lesotho Loti)", value: "LSL" },
  { name: "LYD (Libyan Dinar)", value: "LYD" },
  { name: "MAD (Moroccan Dirham)", value: "MAD" },
  { name: "MDL (Moldovan Leu)", value: "MDL" },
  { name: "MGA (Malagasy Ariary)", value: "MGA" },
  { name: "MKD (Macedonian Denar)", value: "MKD" },
  { name: "MMK (Myanmar Kyat)", value: "MMK" },
  { name: "MNT (Mongolian Tughrik)", value: "MNT" },
  { name: "MOP (Macanese Pataca)", value: "MOP" },
  { name: "MRU (Mauritanian Ouguiya)", value: "MRU" },
  { name: "MUR (Mauritius Rupee)", value: "MUR" },
  { name: "MVR (Maldivian Rufiyaa)", value: "MVR" },
  { name: "MWK (Malawian Kwacha)", value: "MWK" },
  { name: "MXN (Mexican Peso)", value: "MXN" },
  { name: "MYR (Malaysian Ringgit)", value: "MYR" },
  { name: "MZN (Mozambican Metical)", value: "MZN" },
  { name: "NAD (Namibian Dollar)", value: "NAD" },
  { name: "NGN (Nigerian Naira)", value: "NGN" },
  { name: "NIO (Nicaraguan Córdoba Oro)", value: "NIO" },
  { name: "NOK (Norwegian Krone)", value: "NOK" },
  { name: "NPR (Nepalese Rupee)", value: "NPR" },
  { name: "NZD (New Zealand Dollar)", value: "NZD" },
  { name: "OMR (Omani Rial)", value: "OMR" },
  { name: "PAB (Panamanian Balboa)", value: "PAB" },
  { name: "PEN (Peruvian Sol)", value: "PEN" },
  { name: "PGK (Papua New Guinean Kina)", value: "PGK" },
  { name: "PHP (Philippine Peso)", value: "PHP" },
  { name: "PKR (Pakistani Rupee)", value: "PKR" },
  { name: "PLN (Polish Złoty)", value: "PLN" },
  { name: "PYG (Paraguayan Guaraní)", value: "PYG" },
  { name: "QAR (Qatari Riyal)", value: "QAR" },
  { name: "RON (Romanian Leu)", value: "RON" },
  { name: "RSD (Serbian Dinar)", value: "RSD" },
  { name: "RUB (Russian Ruble)", value: "RUB" },
  { name: "RWF (Rwandan Franc)", value: "RWF" },
  { name: "SAR (Saudi Riyal)", value: "SAR" },
  { name: "SBD (Solomon Islands Dollar)", value: "SBD" },
  { name: "SCR (Seychellois Rupee)", value: "SCR" },
  { name: "SDG (Sudanese Pound)", value: "SDG" },
  { name: "SEK (Swedish Krone)", value: "SEK" },
  { name: "SGD (Singapore Dollar)", value: "SGD" },
  { name: "SHP (Saint Helena Pound)", value: "SHP" },
  { name: "SLE (Sierra Leonean Leone)", value: "SLE" },
  { name: "SLL (Sierra Leonean Leone Old)", value: "SLL" },
  { name: "SOS (Somali Shilling)", value: "SOS" },
  { name: "SRD (Surinamese Dollar)", value: "SRD" },
  { name: "STN (São Tomé and Príncipe Dobra)", value: "STN" },
  { name: "SVC (Salvadoran Colón)", value: "SVC" },
  { name: "SYP (Syrian Pound)", value: "SYP" },
  { name: "SZL (Swazi Lilangeni)", value: "SZL" },
  { name: "THB (Thai Baht)", value: "THB" },
  { name: "TJS (Tajikistani Somoni)", value: "TJS" },
  { name: "TMT (Turkmenistani Manat)", value: "TMT" },
  { name: "TND (Tunisian Dinar)", value: "TND" },
  { name: "TOP (Tongan Paʻanga)", value: "TOP" },
  { name: "TRY (Turkish Lira)", value: "TRY" },
  { name: "TTD (Trinidad and Tobago Dollar)", value: "TTD" },
  { name: "TWD (New Taiwan Dollar)", value: "TWD" },
  { name: "TZS (Tanzanian Shilling)", value: "TZS" },
  { name: "UAH (Ukrainian Hryvnia)", value: "UAH" },
  { name: "UGX (Ugandan Shilling)", value: "UGX" },
  { name: "USD (United States Dollar)", value: "USD" },
  { name: "UYU (Uruguayan Peso)", value: "UYU" },
  { name: "UZS (Uzbekistani Som)", value: "UZS" },
  { name: "VED (Venezuelan Bolívar Digital)", value: "VED" },
  { name: "VES (Venezuelan Bolívar Soberano)", value: "VES" },
  { name: "VND (Vietnamese Đồng)", value: "VND" },
  { name: "VUV (Vanuatu Vatu)", value: "VUV" },
  { name: "WST (Samoan Tālā)", value: "WST" },
  { name: "XAF (Central African CFA Franc)", value: "XAF" },
  { name: "XCD (East Caribbean Dollar)", value: "XCD" },
  { name: "XCG (Caribbean Guilder)", value: "XCG" },
  { name: "XOF (West African CFA Franc)", value: "XOF" },
  { name: "XPF (CFP Franc)", value: "XPF" },
  { name: "YER (Yemeni Rial)", value: "YER" },
  { name: "ZAR (South African Rand)", value: "ZAR" },
  { name: "ZMW (Zambian Kwacha)", value: "ZMW" },
  { name: "ZWG (Zimbabwe Gold)", value: "ZWG" }
];
const supportLink = new URL("issues", APPLICATION_REPOSITORY_URL);
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
  function openLink(url: string | URL) {
    if (typeof url === "string") {
      Linking.openURL(url);
      return;
    }

    Linking.openURL(url.toString());
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
      {/* Ambient liquid orbs background */}
      <View style={styles.categoryLiquidShape1} />
      <View style={styles.categoryLiquidShape2} />
      <View style={styles.categoryLiquidShape3} />
      <View style={styles.categoryGlassOverlay} />

      {/* Theme Config Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Theme</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            style={styles.picker}
            dropdownIconColor={theme.colors.onSurfaceVariant}
            selectedValue={selectedTheme}
            onValueChange={(itemValue) => themePickerOnValueChange(itemValue)}
          >
            {themes.map((item, index) => (
              <Picker.Item
                key={`theme-picker-item-${index}`}
                label={item.name}
                value={item.value}
                color={theme.colors.onSurface}
                style={{ backgroundColor: theme.dark ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)" }}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Currency Config Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Currency</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            style={styles.picker}
            dropdownIconColor={theme.colors.onSurfaceVariant}
            selectedValue={currencySelectedItem}
            onValueChange={(itemValue) => currencyPickerOnValueChange(itemValue as CurrencyCode)}
          >
            {currencies.map((item, index) => item.value === currencySelectedItem ? (
              <Picker.Item
                key={`currency-picker-item-${index}`}
                label={item.name}
                value={item.value}
                color={theme.colors.onSurface}
                style={{ backgroundColor: theme.dark ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)" }}
              />
            ) : (
              <Picker.Item
                key={`currency-picker-item-${index}`}
                label={item.name}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Cache Config Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Cache</Text>
        <Button
          mode="contained-tonal"
          buttonColor={theme.colors.errorContainer}
          textColor={theme.colors.onErrorContainer}
          labelStyle={[theme.fonts.titleMedium, { fontWeight: "700", letterSpacing: 0.3 }]}
          onPress={clearCacheOnPress}
        >
          Clear Cache
        </Button>
      </View>

      {/* Support section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Support</Text>
        <Button
          mode="contained-tonal"
          textColor={theme.colors.primary}
          labelStyle={[theme.fonts.titleMedium, { fontWeight: "700", letterSpacing: 0.3 }]}
          onPress={() => openLink(supportLink)}
        >
          Report an Issue
        </Button>
      </View>

      {/* Modernized Project Card Component */}
      <View style={styles.infoCard}>
        <Text variant="titleLarge" style={styles.infoTitle}>Project Information</Text>

        <View style={styles.textGroup}>
          <Text variant="bodyLarge" style={styles.infoText}>Version: {APPLICATION_VERSION}</Text>
          <Text variant="bodyLarge" style={styles.infoText}>Developed by {APPLICATION_AUTHOR}</Text>
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
            labelStyle={[theme.fonts.titleMedium, { fontWeight: "700", letterSpacing: 0.3, color: theme.colors.onPrimary }]}
            onPress={() => openLink(APPLICATION_AUTHOR_PORTFOLIO)}
          >
            View Developer Portfolio
          </Button>
        </View>
      </View>

    </View>
  );
}
