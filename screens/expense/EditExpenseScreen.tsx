import { useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput as TextField } from "react-native-paper";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import InputSpinner from "react-native-input-spinner";

import { containers } from "../../styles/containers";
import { RootParamStackList } from "../../types/navigation.types";
import { convertDateToDateString, convertNumberToCurrencyString } from "../../utils/converters";
import { validateEditExpenseForm } from "../../utils/validators";
import { useExpenseStore } from "../../hooks/useExpenseStore";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { useSettingsStore } from "../../hooks/useSettingsStore";
import HorizontalLineWithTitle from "../../components/HorizontalLineWithTitle";
import { theme } from "../../styles/theme";

type RouteProps = NativeStackScreenProps<RootParamStackList, "EditExpense">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "EditExpense">;

export default function EditExpenseScreen({ route }: RouteProps) {
  // Route
  const expense = route.params;

  // Hooks
  const navigation = useNavigation<NavProps>();
  const categories = useCategoryStore((state) => state.categories);
  const updateExpense = useExpenseStore((state) => state.updateExpense);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const settings = useSettingsStore((state) => state.settings);

  // States
  const [expenseName, setExpenseName] = useState(expense.name);
  const [expensePrice, setExpensePrice] = useState(expense.price.toString());
  const [expenseQuantity, setExpenseQuantity] = useState(expense.quantity);

  const [expensePriceDisplay, setExpensePriceDisplay] = useState(0.00);
  const [expenseQuantityDisplay, setExpenseQuantityDisplay] = useState(0);
  const [expenseTotalDisplay, setExpenseTotalDisplay] = useState(0);

  const [detailsModal, setDetailsModal] = useState(false);

  // References
  const priceTextInputRef = useRef<TextInput | null>(null);

  // Handlers
  function saveButtonOnPress() {
    const validationMessage = validateEditExpenseForm(expenseQuantity, expensePrice);
    const categoryExists = categories.some(e => e.id === expense.category.id);

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

    const parsedPrice = Number.parseFloat(expensePrice);
    if (expenseName)
      updateExpense(expense.id, expenseQuantity, parsedPrice, expenseName);
    else
      updateExpense(expense.id, expenseQuantity, parsedPrice);

    Alert.alert("Success", "All set! Your changes are saved.");
    navigation.goBack();
  }

  function deleteButtonOnPress() {
    Alert.alert(
      "Deletion Confirmation",
      "Are you sure you want to delete this item? this action can't be undone.",
      [
        {
          text: "Yes",
          onPress: () => {
            deleteExpense(expense.id);
            navigation.goBack();
          }
        },
        {
          text: "No",
          style: "cancel"
        }
      ]
    )
  }

  function toggleModalButtonOnPress() {
    setDetailsModal(prev => !prev);
  }

  // Use effects
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
    <View
      style={{
        ...styles.mainContainer,
        flex: 1
      }}
    >

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

      {/* Expense name input */}
      <View style={styles.formContainer}>
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
            <Text variant="bodyLarge" style={{ color: "red" }}>*</Text>
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
            style={{ elevation: 0, shadowOpacity: 0 }}
          />
        </View>

        {/* Expense price input */}
        <View style={styles.inputContainer}>
          <Text variant="bodyLarge">
            Price{" "}
            <Text variant="bodyLarge" style={{ color: "red" }}>*</Text>
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
        
        {/* Form buttons */}
        <View style={{ gap: 8 }}>
          <Button
            mode="contained"
            labelStyle={{ fontSize: 16 }}
            onPress={saveButtonOnPress}
          >
            Save
          </Button>

          <Button
            mode="contained-tonal"
            labelStyle={{ fontSize: 16 }}
            onPress={toggleModalButtonOnPress}
          >
            Details
          </Button>
        </View>
      </View>

      <View style={{ marginTop: "auto" }}>
        <HorizontalLineWithTitle
          label="Danger"
          color="#ef4444"
          style={{ marginBlock: 14 }}
        />

        <Button
          labelStyle={{ fontSize: 16 }}
          onPress={deleteButtonOnPress}
        >
          Delete
        </Button>
      </View>

      {/* Information modal */}
      <Portal>
        <Modal visible={detailsModal} style={{ margin: 24 }}>
          <View style={styles.informationContainer}>
            <Text variant="headlineSmall">Details</Text>
            <Text variant="bodyLarge">Category: {expense.category.name}</Text>
            <Text variant="bodyLarge">Created at {convertDateToDateString(new Date(expense.createdAt))}</Text>
            <Text variant="bodyLarge">Updated at {convertDateToDateString(new Date(expense.updatedAt))}</Text>
            <Button onPress={toggleModalButtonOnPress}>Close</Button>
          </View>
        </Modal>
      </Portal>

    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    ...containers.main,
  },
  inputContainer: {
    gap: 8
  },
  informationContainer: {
    gap: 10,
    backgroundColor: "#e5e7eb",
    padding: 24,
    borderRadius: 8
  },
  formContainer: {
    gap: 14
  }
});