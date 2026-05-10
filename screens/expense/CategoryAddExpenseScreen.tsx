import { Alert, StyleSheet, TextInput, View } from "react-native";
import { Button, Text, TextInput as TextField } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import InputSpinner from "react-native-input-spinner";

import { containers } from "../../styles/containers";
import { RootParamStackList } from "../../types/navigation.types";
import { useExpenseStore } from "../../hooks/useExpenseStore";
import { validateAddExpenseForm } from "../../utils/validators";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { convertNumberToCurrencyString } from "../../utils/converters";
import { useSettingsStore } from "../../hooks/useSettingsStore";
import { theme } from "../../App";

type RouteProps = NativeStackScreenProps<RootParamStackList, "CategoryAddExpense">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "CategoryAddExpense">;

export default function CategoryAddExpenseScreen({ route }: RouteProps) {
  // Route
  const category = route.params;

  // Hooks
  const navigation = useNavigation<NavProps>();
  const addExpense = useExpenseStore((state) => state.addExpense);
  const categories = useCategoryStore((state) => state.categories);
  const settings = useSettingsStore((state) => state.settings);

  // States
  const [expenseName, setExpenseName] = useState("");
  const [expensePrice, setExpensePrice] = useState("");
  const [expenseQuantity, setExpenseQuantity] = useState(0);

  const [expensePriceDisplay, setExpensePriceDisplay] = useState(0.00);
  const [expenseQuantityDisplay, setExpenseQuantityDisplay] = useState(1);
  const [expenseTotalDisplay, setExpenseTotalDisplay] = useState(0.00);
  
  // References
  const priceTextInputRef = useRef<TextInput | null>(null);

  // Handlers
  function saveButtonOnPress() {
    const validationMessage = validateAddExpenseForm(expenseQuantity, expensePrice, expenseName);
    const categoryExists = categories.some(e => e.id === category.id);

    if (!categoryExists) {
      Alert.alert(
        "Category not found",
        "Would you like to create it?",
        [
          {
            text: "Yes",
            onPress: () => navigation.navigate("AddCategory")
          },
          {
            text: "No",
            style: "cancel"
          }
        ]
      );
      return;
    }

    if (typeof validationMessage === "string") {
      Alert.alert("Error", validationMessage);
      return;
    }

    const parsedExpensePrice = Number.parseFloat(expensePrice);
    if (expenseName)
      addExpense(category, expenseQuantity, parsedExpensePrice, expenseName);
    else
      addExpense(category, expenseQuantity, parsedExpensePrice);

    Alert.alert("Success", `Successfully saved in ${category.name}.`);
    navigation.goBack();
  }

  // Use effect
  useEffect(() => {
    const parsedPrice = Number.parseFloat(expensePrice);
    if (isNaN(parsedPrice))
      setExpensePriceDisplay(0.00);
    else
      setExpensePriceDisplay(parsedPrice)

    if (isNaN(expenseQuantity))
      setExpenseQuantityDisplay(0);
    else
      setExpenseQuantityDisplay(expenseQuantity)

    const result = (isNaN(parsedPrice) ? 0.00 : parsedPrice) * (isNaN(expenseQuantity) ? 0 : expenseQuantity);
    setExpenseTotalDisplay(result);
  }, [expensePrice, expenseQuantity]);
  
  return (
    <View style={containers.main}>

      {/* Calculated display */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text variant="headlineLarge">{convertNumberToCurrencyString(expensePriceDisplay, settings.currencyCode)}</Text>
        <Text variant="headlineSmall" style={{ color: "gray" }}>{" "}x{" "}</Text>
        <Text variant="headlineLarge">{expenseQuantityDisplay}</Text>
        <Text variant="headlineSmall" style={{ color: "gray" }}>{" = "}</Text>
        <Text variant="headlineLarge">{convertNumberToCurrencyString(expenseTotalDisplay)}</Text>
      </View>

      {/* Expense name quantity */}
      <View style={styles.inputContainer}>
        <Text variant="bodyLarge">
          Name{" "}
        </Text>
        <TextField
          mode="flat"
          placeholder="e.g, Jeepney fare"
          value={expenseName}
          onChangeText={(e) => setExpenseName(e)}
        />
      </View>

      {/* Expense quantity input */}
      <View style={styles.inputContainer}>
        <Text variant="bodyLarge">
          Quantity{" "}
          <Text style={{ color: "red" }} variant="bodyLarge">*</Text>
        </Text>
        <InputSpinner
          min={0}
          max={100}
          fontSize={20}
          skin="round"
          colorMin={theme.colors.primary}
          colorMax={theme.colors.primary}
          value={expenseQuantity}
          onChange={(e: number) => setExpenseQuantity(e)}
          onSubmit={() => priceTextInputRef.current?.focus()}
        />
      </View>

      {/* Expense price input */}
      <View style={styles.inputContainer}>
        <Text variant="bodyLarge">
          Price{" "}
          <Text style={{ color: "red" }} variant="bodyLarge">*</Text>
        </Text>
        <TextField
          ref={priceTextInputRef}
          mode="flat"
          placeholder="e.g, 67.25"
          keyboardType="numeric"
          value={expensePrice}
          onChangeText={(e) => setExpensePrice(e)}
        />
      </View>

      <Button
        mode="contained"
        labelStyle={{ fontSize: 16 }}
        onPress={saveButtonOnPress}
      >
        Save
      </Button>

    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 8
  }
});