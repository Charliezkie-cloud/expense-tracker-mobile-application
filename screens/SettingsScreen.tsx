import { Alert, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "react-native-logs";

import { containers } from "../styles/containers";
import { useSettingsStore } from "../hooks/useSettingsStore";
import { CurrencyCode } from "../types/data.types";
import { useCategoryStore } from "../hooks/useCategoryStore";
import { useExpenseStore } from "../hooks/useExpenseStore";
import { useBudgetStore } from "../hooks/useBudgetStore";

export default function SettingsScreen() {
  // Log
  const log = logger.createLogger();

  // Hooks
  const settings = useSettingsStore((state) => state.settings);
  const clearAllBudgets = useBudgetStore((state) => state.clearAllBudgets);
  const clearAllCategories = useCategoryStore((state) => state.clearAllCategories);
  const clearAllExpenses = useExpenseStore((state) => state.clearAllExpenses);
  const setCurrency = useSettingsStore((state) => state.setCurrency);

  // States
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(settings.currencyCode)

  // References
  const currencyValues = useRef<CurrencyCode[]>(
    ["PHP", "USD", "EUR", "GBP", "JPY", "CNY", "CAD", "AUD", "INR"]
  );
  
  // Handlers
  function clearCacheOnPress() {
    Alert.alert(
      "Delete your application data?",
      "This will permanently remove all your data. You cannot undo this action.",
      [
        {
          text: "Yes",
          onPress: clearCache
        },
        {
          text: "No",
          style: "cancel"
        }
      ]
    );
  }

  // Helpers
  async function clearCache() {
    try {
      await AsyncStorage.clear();

      clearAllBudgets();
      clearAllCategories();
      clearAllExpenses();

      log.info("Your app data has been cleared!");
      Alert.alert("Success", "Your application data has successfully been cleared.");
    } catch (error: unknown) {
      if (error instanceof Error)
        log.error("Something went wrong!", {
          error: error.message
        });
      else
        log.error("Something went wrong!", {
          error: String(error)
        });
    }
  }

  // Use effects
  useEffect(() => {
    setCurrency(selectedCurrency);
  }, [selectedCurrency]);

  return (
    <View style={{
      ...containers.main,
      gap: 24
    }}>

      <View style={{ gap: 12 }}>
        <Text variant="bodyLarge">Currency</Text>
        <Picker
          style={{
            backgroundColor: "#e5e7eb"
          }}
          selectedValue={selectedCurrency}
          onValueChange={(e) => setSelectedCurrency(e)}
        >
          {currencyValues.current.map((item, index) => (
            <Picker.Item
              key={`currency-item-${index}`}
              label={item}
              value={item}
            />
          ))}
        </Picker>
      </View>

      <View style={{ gap: 12 }}>
        <Text variant="bodyLarge">Cache</Text>
        <Button mode="contained" onPress={clearCacheOnPress}>
          Clear Cache
        </Button>
      </View>

    </View>
  )
}