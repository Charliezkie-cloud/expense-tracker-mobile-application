import { Alert, StyleSheet, TextInput, View } from "react-native";
import { Button, Text, TextInput as TextField, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import InputSpinner from "react-native-input-spinner";

import { RootParamStackList } from "../../types/navigation.types";
import { useExpenseStore } from "../../hooks/useExpenseStore";
import { validateAddExpenseForm } from "../../utils/validators";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { convertNumberToCurrencyString } from "../../utils/converters";
import { useSettingsStore } from "../../hooks/useSettingsStore";
import { getExpenseStyles } from "../../styles/theme";

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

  // Theme & Style Hook
  const theme = useTheme();
  const styles = getExpenseStyles(theme);

  // States
  const [expenseName, setExpenseName] = useState("");
  const [expenseQuantity, setExpenseQuantity] = useState(1);
  const [expensePrice, setExpensePrice] = useState("");

  // Refs
  const priceTextInputRef = useRef<TextInput>(null);

  // Handlers
  function saveButtonOnPress() {
    const categoryExists = categories.some(e => e.id === category.id);

    if (!categoryExists) {
      Alert.alert(
        "Category not found",
        "The category you are assigning this expense to does not exist. Would you like to create a new category?",
        [
          { text: "Yes", onPress: () => navigation.navigate("AddCategory") },
          { text: "No", style: "cancel" }
        ]
      );
      return;
    }

    const validationMessage = validateAddExpenseForm(expenseQuantity, expensePrice, expenseName);

    if (typeof validationMessage === "string") {
      Alert.alert("Error", validationMessage);
      return;
    }

    const parsedPrice = Number.parseFloat(expensePrice);

    if (expenseName)
      addExpense(category, expenseQuantity, parsedPrice, expenseName);
    else
      addExpense(category, expenseQuantity, parsedPrice);

    const priceString = convertNumberToCurrencyString(parsedPrice * expenseQuantity, settings.currencyCode);
    Alert.alert("Success", `${expenseName} worth ${priceString} successfully added.`);
    navigation.goBack();
  }

  return (
    <View style={styles.formContainer}>

      {/* Expense name input */}
      <View style={styles.inputGroup}>
        <Text variant="bodyLarge" style={styles.inputLabel}>
          Expense name <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextField
          mode="outlined"
          style={styles.textInput}
          placeholder="e.g., Jeepney fare"
          value={expenseName}
          onChangeText={(e) => setExpenseName(e)}
        />
      </View>

      {/* Expense quantity input */}
      <View style={styles.inputGroup}>
        <Text variant="bodyLarge" style={styles.inputLabel}>
          Quantity <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <View style={styles.spinnerContainer}>
          <InputSpinner
            min={1}
            max={100}
            fontSize={18}
            skin="round"
            colorMax={theme.colors.error}
            colorMin={theme.colors.primary}
            background={theme.colors.surface}
            textColor={theme.colors.onSurface}
            value={expenseQuantity}
            onChange={(e: number) => setExpenseQuantity(e)}
            onSubmit={() => priceTextInputRef.current?.focus()}
            style={{ elevation: 0, shadowOpacity: 0, width: "100%" }}
          />
        </View>
      </View>

      {/* Expense price input */}
      <View style={styles.inputGroup}>
        <Text variant="bodyLarge" style={styles.inputLabel}>
          Price <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextField
          ref={priceTextInputRef}
          mode="outlined"
          style={styles.textInput}
          placeholder="e.g., 67.25"
          keyboardType="numeric"
          value={expensePrice}
          onChangeText={(e) => setExpensePrice(e)}
        />
      </View>

      <Button
        mode="contained"
        style={styles.formButton}
        labelStyle={{ fontSize: 16, fontWeight: "600" }}
        onPress={saveButtonOnPress}
      >
        Save Expense
      </Button>
    </View>
  );
}