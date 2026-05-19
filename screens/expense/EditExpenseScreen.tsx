import { useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput as TextField, useTheme } from "react-native-paper";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import InputSpinner from "react-native-input-spinner";

import { RootParamStackList } from "../../types/navigation.types";
import { convertDateToDateString } from "../../utils/converters";
import { validateEditExpenseForm } from "../../utils/validators";
import { useExpenseStore } from "../../hooks/useExpenseStore";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { useSettingsStore } from "../../hooks/useSettingsStore";
import HorizontalLineWithTitle from "../../components/HorizontalLineWithTitle";
import { getExpenseStyles } from "../../styles/theme";

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

  // Theme & Style Hook
  const theme = useTheme();
  const styles = getExpenseStyles(theme);

  // States
  const [expenseName, setExpenseName] = useState("");
  const [expenseQuantity, setExpenseQuantity] = useState(0);
  const [expensePrice, setExpensePrice] = useState("");
  const [detailsModal, setDetailsModal] = useState(false);

  // Refs
  const priceTextInputRef = useRef<TextInput>(null);

  // Handlers
  function toggleModalButtonOnPress() {
    setDetailsModal(prev => !prev);
  }

  function saveButtonOnPress() {
    const categoryExists = categories.some(e => e.id === expense.category.id);

    if (!categoryExists) {
      Alert.alert("Category not found", "The category assigned to this expense cannot be resolved.");
      return;
    }

    const validationMessage = validateEditExpenseForm(expenseQuantity, expensePrice);

    if (typeof validationMessage === "string") {
      Alert.alert("Error", validationMessage);
      return;
    }

    const parsedPrice = Number.parseFloat(expensePrice);

    if (expenseName)
      updateExpense(expense.id, expenseQuantity, parsedPrice, expenseName);
    else
      updateExpense(expense.id, expenseQuantity, parsedPrice);

    Alert.alert("Success", "Expense updated successfully.");
    navigation.goBack();
  }

  function deleteButtonOnPress() {
    Alert.alert(
      "Deletion Confirmation",
      "Are you sure you want to completely drop this entry? This action cannot be reverted.",
      [
        {
          text: "Yes",
          onPress: () => {
            deleteExpense(expense.id);
            navigation.goBack();
          }
        },
        { text: "No", style: "cancel" }
      ]
    );
  }

  // Use effects
  useEffect(() => {
    setExpenseName(expense.name);
    setExpenseQuantity(expense.quantity);
    setExpensePrice(expense.price.toString());
  }, []);

  return (
    <View style={styles.formContainer}>

      {/* Expense Name field */}
      <View style={styles.inputGroup}>
        <Text variant="bodyLarge" style={styles.inputLabel}>
          Name <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextField
          mode="outlined"
          style={styles.textInput}
          placeholder="e.g., Grocery Item"
          value={expenseName}
          onChangeText={(e) => setExpenseName(e)}
        />
      </View>

      {/* Expense Quantity field */}
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

      {/* Expense Price field */}
      <View style={styles.inputGroup}>
        <Text variant="bodyLarge" style={styles.inputLabel}>
          Price <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextField
          ref={priceTextInputRef}
          mode="outlined"
          style={styles.textInput}
          placeholder="e.g., 150.00"
          keyboardType="numeric"
          value={expensePrice}
          onChangeText={(e) => setExpensePrice(e)}
        />
      </View>

      {/* Main Form Actions */}
      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          style={styles.formButton}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
          onPress={saveButtonOnPress}
        >
          Save Changes
        </Button>

        <Button
          mode="contained-tonal"
          style={styles.formButton}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
          onPress={toggleModalButtonOnPress}
        >
          View Details
        </Button>
      </View>

      {/* Danger Zone Separation */}
      <View style={styles.dangerSection}>
        <HorizontalLineWithTitle
          label="Danger Zone"
          color={theme.colors.error}
          style={{ marginVertical: 14 }}
        />
        <Button
          mode="outlined"
          style={styles.dangerButton}
          labelStyle={styles.dangerButtonLabel}
          onPress={deleteButtonOnPress}
        >
          Delete Expense
        </Button>
      </View>

      {/* Structured Info Portal Sheet */}
      <Portal>
        <Modal visible={detailsModal} style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>Expense Details</Text>

            <View style={{ gap: 8, marginVertical: 4 }}>
              <View style={styles.detailsRow}>
                <Text variant="bodyMedium" style={styles.detailsLabel}>Category context</Text>
                <Text variant="bodyMedium" style={styles.detailsValue}>{expense.category.name}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text variant="bodyMedium" style={styles.detailsLabel}>Created stamp</Text>
                <Text variant="bodyMedium" style={styles.detailsValue}>
                  {convertDateToDateString(new Date(expense.createdAt))}
                </Text>
              </View>
              <View style={styles.detailsRow}>
                <Text variant="bodyMedium" style={styles.detailsLabel}>Last modified</Text>
                <Text variant="bodyMedium" style={styles.detailsValue}>
                  {convertDateToDateString(new Date(expense.updatedAt))}
                </Text>
              </View>
            </View>

            <Button
              mode="contained-tonal"
              style={styles.modalActionButton}
              onPress={toggleModalButtonOnPress}
            >
              Close
            </Button>
          </View>
        </Modal>
      </Portal>

    </View>
  );
}