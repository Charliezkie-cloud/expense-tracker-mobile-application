import { Alert, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import { RootParamStackList } from "../../types/navigation.types";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { useBudgetStore } from "../../hooks/useBudgetStore";
import { validateAddBudgetForm } from "../../utils/validators";
import { convertNumberToCurrencyString } from "../../utils/converters";
import HorizontalLineWithTitle from "../../components/HorizontalLineWithTitle";
import { getCategoryDetailStyles } from "../../styles/theme";

type RouteProps = NativeStackScreenProps<RootParamStackList, "CategorySetBudget">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "CategorySetBudget">;

export default function CategorySetBudgetScreen({ route }: RouteProps) {
  // Route
  const category = route.params;

  // Hooks
  const navigation = useNavigation<NavProps>();
  const categories = useCategoryStore((state) => state.categories);
  const budgets = useBudgetStore((state) => state.budgets);
  const setBudget = useBudgetStore((state) => state.setBudget);
  const deleteBudget = useBudgetStore((state) => state.deleteBudget);

  const theme = useTheme();
  const styles = getCategoryDetailStyles(theme);

  // States
  const [budgetAmount, setBudgetAmount] = useState("");
  const [hasBudget, setHasBudget] = useState(false);

  // Handlers
  function saveButtonOnPress() {
    const validationMessage = validateAddBudgetForm(budgetAmount);
    const categoryExists = categories.some(e => e.id === category.id);

    if (!categoryExists) {
      Alert.alert(
        "Category not found",
        "Would you like to create it?",
        [
          { text: "Yes", onPress: () => navigation.navigate("AddCategory") },
          { text: "No", style: "cancel" }
        ]
      );
      return;
    }

    if (typeof validationMessage === "string") {
      Alert.alert("Error", validationMessage);
      return;
    }

    const parsedAmount = Number.parseFloat(budgetAmount);
    const currencyString = convertNumberToCurrencyString(parsedAmount);

    setBudget(category, parsedAmount);
    Alert.alert("Success", `You've set ${currencyString} to your ${category.name} budget.`);
    navigation.goBack();
  }

  function deleteButtonOnPress() {
    Alert.alert(
      "Deletion Confirmation",
      "Are you sure you want to delete the budget for this category? this action can't be undone.",
      [
        {
          text: "Yes",
          onPress: () => {
            deleteBudget(category);
            navigation.goBack();
          }
        },
        { text: "No", style: "cancel" }
      ]
    );
  }

  // Use effects
  useEffect(() => {
    const categoryBudget = budgets.find(e => e.category.id === category.id);
    if (categoryBudget) {
      setBudgetAmount(categoryBudget.amount.toString());
      setHasBudget(true);
    }
  }, []);

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text variant="bodyLarge" style={styles.inputLabel}>
          Amount <Text style={{ color: theme.colors.error }}>*</Text>
        </Text>
        <TextInput
          value={budgetAmount}
          mode="outlined"
          style={styles.textInput}
          onChangeText={(e) => setBudgetAmount(e)}
          keyboardType="numeric"
          placeholder="e.g, 76.25"
        />
      </View>

      <Button
        mode="contained"
        style={styles.formButton}
        labelStyle={{ fontSize: 16, fontWeight: "600" }}
        onPress={saveButtonOnPress}
      >
        Save Limits
      </Button>

      <View style={styles.dangerSection}>
        {hasBudget && (
          <>
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
              Remove Budget
            </Button>
          </>
        )}
      </View>
    </View>
  );
}