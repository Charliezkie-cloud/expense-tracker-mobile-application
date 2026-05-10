import { View } from "react-native";
import { Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useRef, useState } from "react";

import { containers } from "../styles/containers";
import { useSettingsStore } from "../hooks/useSettingsStore";
import { CurrencyCode } from "../types/data.types";

export default function SettingsScreen() {
  // Hooks
  const settings = useSettingsStore((state) => state.settings);
  const setCurrency = useSettingsStore((state) => state.setCurrency);

  // States
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(settings.currencyCode);

  // References
  const currencyValues = useRef<CurrencyCode[]>(
    ["PHP", "USD", "EUR", "GBP", "JPY", "CNY", "CAD", "AUD", "INR"]
  );

  // Use effects
  useEffect(() => {
    setCurrency(selectedCurrency);
  }, [selectedCurrency]);

  return (
    <View style={containers.main}>

      <View style={{ gap: 8 }}>
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

    </View>
  )
}