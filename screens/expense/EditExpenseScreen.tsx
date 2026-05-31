import {Alert, TextInput, View, Modal, StyleSheet, TouchableOpacity} from "react-native";
import { Button, Text, TextInput as TextField, useTheme } from "react-native-paper";
import {NativeStackNavigationProp, NativeStackScreenProps} from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import InputSpinner from "react-native-input-spinner";
import {useSQLiteContext} from "expo-sqlite";
import {useNavigation} from "@react-navigation/native";

import { RootParamStackList } from "../../types/navigation.types";
import { convertDateToDateString, convertDecimalToWholeNumber, convertWholeNumberToDecimal } from "../../libs/converters";
import HorizontalLine from "../../components/HorizontalLine";
import { getExpenseStyles } from "../../styles/mainStyles";
import {deleteExpense, getExpenseCategory, updateExpense} from "../../database/expenseQueries";
import {Category} from "../../types/models.types";
import {validateAddExpenseForm} from "../../libs/validators";

type RouteProps = NativeStackScreenProps<RootParamStackList, "EditExpense">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "EditExpense">;

export default function EditExpenseScreen({ route }: RouteProps) {
  // Route
  const expense = route.params;

  // Hooks
  const db = useSQLiteContext();
  const navigation = useNavigation<NavProps>();
  const theme = useTheme();
  const styles = getExpenseStyles(theme);

  // States
  const [expenseCategory, setExpenseCategory] = useState<Category | null>(null);
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

  async function saveButtonOnPress() {
    const validationMessage = validateAddExpenseForm(expenseQuantity, expensePrice);
    if (typeof validationMessage === "string")
      return Alert.alert("Error", validationMessage);

    const parsedPrice = Number.parseFloat(expensePrice);
    const convertedPrice = convertDecimalToWholeNumber(parsedPrice);

    try {
      await updateExpense(db, {
        id: expense.id,
        name: expenseName.trim(),
        quantity: expenseQuantity,
        price: convertedPrice
      });
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Something went wrong while updating the expense.");
    }
  }

  async function deleteButtonOnPress() {
    try {
      await deleteExpense(db, expense.id);
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Something went wrong while deleting the expense.");
    }
  }

  // Use effects
  useEffect(() => {
    setExpenseName(expense.name);
    setExpenseQuantity(expense.quantity);
    setExpensePrice(convertWholeNumberToDecimal(expense.price).toString());
  }, []);

  useEffect(() => {
    async function fetchExpenseCategoryDetails() {
      try {
        const res = await getExpenseCategory(db, expense.id);

        if (res)
          setExpenseCategory(res);
      } catch {
        Alert.alert("Error", "Something went wrong while fetching the expense category details.");
      }
    }

    fetchExpenseCategoryDetails();
  }, []);

  return (
      <View style={styles.formContainer}>
        {/* Ambient liquid orbs background */}
        <View style={styles.categoryLiquidShape1} />
        <View style={styles.categoryLiquidShape2} />
        <View style={styles.categoryLiquidShape3} />
        <View style={styles.categoryGlassOverlay} />

        {/* Volumetric Frosted Glass Input Card */}
        <View style={styles.glassInputCard}>
          {/* Expense Name field */}
          <View style={styles.inputGroup}>
            <Text variant="bodyLarge" style={styles.inputLabel}>
              Name
            </Text>
            <TextField
                mode="outlined"
                style={styles.textInput}
                placeholder="e.g., Grocery Item"
                placeholderTextColor={theme.dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"}
                textColor={theme.colors.onSurface}
                activeOutlineColor={theme.colors.primary}
                outlineColor={theme.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
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
                  background="transparent"
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
                placeholderTextColor={theme.dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"}
                textColor={theme.colors.onSurface}
                activeOutlineColor={theme.colors.primary}
                outlineColor={theme.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
                keyboardType="numeric"
                value={expensePrice}
                onChangeText={(e) => setExpensePrice(e)}
            />
          </View>
        </View>

        {/* Main Form Actions */}
        <View style={styles.buttonGroup}>
          <Button
              mode="contained"
              labelStyle={[theme.fonts.titleMedium, { fontWeight: "700", letterSpacing: 0.3 }]}
              onPress={saveButtonOnPress}
          >
            Save Changes
          </Button>

          <Button
              mode="contained-tonal"
              labelStyle={[theme.fonts.titleMedium, { fontWeight: "700", letterSpacing: 0.3 }]}
              onPress={toggleModalButtonOnPress}
          >
            View Details
          </Button>
        </View>

        {/* Danger Zone Separation */}
        <View style={styles.dangerSection}>
          <HorizontalLine
              label="Danger Zone"
              color={theme.colors.error}
              style={{ marginVertical: 14 }}
          />
          <Button
              mode="outlined"
              style={styles.dangerButton}
              labelStyle={[theme.fonts.titleMedium, styles.dangerButtonLabel, { letterSpacing: 0.3 }]}
              onPress={deleteButtonOnPress}
          >
            Delete Expense
          </Button>
        </View>

        {/* Structured Info Portal Sheet */}
        <Modal
            visible={detailsModal}
            transparent={true}
            animationType="slide"
            onRequestClose={toggleModalButtonOnPress}
        >
          <View style={[styles.modalBackdrop, { flex: 1 }]}>
            <TouchableOpacity
                style={StyleSheet.absoluteFillObject}
                activeOpacity={1}
                onPress={toggleModalButtonOnPress}
            />
            <View style={styles.modalContent}>
              <View style={styles.sheetHandle} />
              <Text variant="headlineSmall" style={styles.modalTitle}>Expense Details</Text>

              <View style={{ gap: 12, marginVertical: 8 }}>
                <View style={styles.detailsRow}>
                  <Text variant="titleSmall" style={styles.detailsLabel}>Category</Text>
                  <Text variant="bodyLarge" style={styles.detailsValue}>{expenseCategory?.name || "None"}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text variant="titleSmall" style={styles.detailsLabel}>Created stamp</Text>
                  <Text variant="bodyLarge" style={styles.detailsValue}>
                    {convertDateToDateString(new Date(expense.created_at))}
                  </Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text variant="titleSmall" style={styles.detailsLabel}>Last modified</Text>
                  <Text variant="bodyLarge" style={styles.detailsValue}>
                    {convertDateToDateString(new Date(expense.updated_at))}
                  </Text>
                </View>
              </View>

              <Button
                  mode="contained-tonal"
                  labelStyle={[theme.fonts.labelLarge, { fontWeight: "700", letterSpacing: 0.3 }]}
                  onPress={toggleModalButtonOnPress}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>

      </View>
  );
}
