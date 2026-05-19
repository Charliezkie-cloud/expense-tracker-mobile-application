import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, View } from "react-native";
import { ArrowUpDown, BanknoteArrowUp, ChevronRight, Pencil, Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Button, List, Modal, Portal, Text, useTheme } from "react-native-paper";

import { RootParamStackList } from "../../types/navigation.types";
import { Expense } from "../../types/data.types";
import { useExpenseStore } from "../../hooks/useExpenseStore";
import { convertNumberToCurrencyString } from "../../utils/converters";
import { useBudgetStore } from "../../hooks/useBudgetStore";
import { sortExpensesWithCategoryId } from "../../utils/sorters";
import { useSettingsStore } from "../../hooks/useSettingsStore";
import { getCategoryDetailStyles } from "../../styles/theme";

type RouteProps = NativeStackScreenProps<RootParamStackList, "Category">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "Category">;

export default function CategoryScreen({ route }: RouteProps) {
  // Params
  const category = route.params;

  // Hooks
  const navigation = useNavigation<NavProps>();
  const expenses = useExpenseStore((state) => state.expenses);
  const budgets = useBudgetStore((state) => state.budgets);
  const settings = useSettingsStore((state) => state.settings);

  const theme = useTheme();
  const styles = getCategoryDetailStyles(theme);

  // States
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0.00);
  const [budget, setBudget] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [isBudgetExists, setIsBudgetExists] = useState(false);
  const [sortingModal, setSortingModal] = useState(false);

  const [sortBySelectedItem, setSortBySelectedItem] = useState<"price" | "quantity" | "createdAt" | "updatedAt">("createdAt");
  const [sortOrderSelectedItem, setSortOrderSelectedItem] = useState<"ascending" | "descending">("ascending");

  // Handlers
  function addExpenseButtonOnPress() {
    navigation.navigate("CategoryAddExpense", category);
  }

  function editCategoryButtonOnPress() {
    navigation.navigate("EditCategory", category);
  }

  function setBudgetButtonOnPress() {
    navigation.navigate("CategorySetBudget", category);
  }

  function toggleSortingModal() {
    setSortingModal(prev => !prev);
  }

  function applySortingButtonOnPress() {
    const updated = sortExpensesWithCategoryId(category.id, expenses, sortBySelectedItem, sortOrderSelectedItem);
    setFilteredExpenses(updated);
    toggleSortingModal();
  }

  function expenseListItemOnPress(expense: Expense) {
    navigation.navigate("EditExpense", expense);
  }

  // Use effects
  useEffect(() => {
    const updated = expenses.filter(e => e.category.id === category.id);
    setFilteredExpenses(sortExpensesWithCategoryId(category.id, updated, sortBySelectedItem, sortOrderSelectedItem));

    const totalCalculated = updated.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0);
    setTotal(totalCalculated);

    const categoryBudget = budgets.find(e => e.category.id === category.id);
    if (categoryBudget) {
      setIsBudgetExists(true);
      setBudget(categoryBudget.amount);
      setRemainingBudget(categoryBudget.amount - totalCalculated);
      return;
    }

    setIsBudgetExists(false);
  }, [expenses, budgets]);

  return (
    <View style={styles.mainContainer}>

      {/* Total display area */}
      <View style={styles.totalDisplayContainer}>
        <Text variant="displayMedium" style={styles.totalAmountText}>
          {convertNumberToCurrencyString(total, settings.currencyCode)}
        </Text>
      </View>

      {/* Structured Budget Panel */}
      {isBudgetExists && (
        <View style={styles.budgetCard}>
          <View style={styles.budgetTextRow}>
            <Text variant="bodyMedium" style={styles.budgetTextLabel}>Allocated Budget</Text>
            <Text variant="bodyLarge" style={styles.budgetTextValue}>
              {convertNumberToCurrencyString(budget, settings.currencyCode)}
            </Text>
          </View>
          <View style={styles.budgetTextRow}>
            <Text variant="bodyMedium" style={styles.budgetTextLabel}>Remaining Position</Text>
            <Text
              variant="bodyLarge"
              style={[
                styles.budgetTextValue,
                { color: remainingBudget <= 0 ? theme.colors.error : "#16a34a" }
              ]}
            >
              {convertNumberToCurrencyString(remainingBudget ?? 0.00, settings.currencyCode)}
            </Text>
          </View>
        </View>
      )}

      {/* Inline Section Adjustments */}
      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={editCategoryButtonOnPress}
          style={styles.splitButton}
          labelStyle={styles.splitButtonLabel}
          icon={(props) => <Pencil color={props.color} size={16} />}
        >
          Edit Category
        </Button>
        <Button
          mode="contained-tonal"
          onPress={setBudgetButtonOnPress}
          style={styles.splitButton}
          labelStyle={styles.splitButtonLabel}
          icon={(props) => <BanknoteArrowUp color={props.color} size={16} />}
        >
          Set Budget
        </Button>
      </View>

      {/* Sorting Activation triggers */}
      <Button
        mode="text"
        style={styles.sortButton}
        labelStyle={styles.sortButtonLabel}
        icon={(props) => <ArrowUpDown color={props.color} size={props.size} />}
        onPress={toggleSortingModal}
      >
        Sort Expenses
      </Button>

      {/* Expense Dynamic Ordering Modal */}
      <Portal>
        <Modal visible={sortingModal} style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>Expense Sorting</Text>

            <View style={styles.pickerContainer}>
              <Text variant="bodyMedium" style={styles.pickerLabel}>Sort by</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  dropdownIconColor={theme.colors.onSurfaceVariant}
                  selectedValue={sortBySelectedItem}
                  onValueChange={(e) => setSortBySelectedItem(e)}
                >
                  <Picker.Item label="Price" value="price" />
                  <Picker.Item label="Quantity" value="quantity" />
                  <Picker.Item label="Creation Date & Time" value="createdAt" />
                  <Picker.Item label="Updation Date & Time" value="updatedAt" />
                </Picker>
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <Text variant="bodyMedium" style={styles.pickerLabel}>Order</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  dropdownIconColor={theme.colors.onSurfaceVariant}
                  selectedValue={sortOrderSelectedItem}
                  onValueChange={(e) => setSortOrderSelectedItem(e)}
                >
                  <Picker.Item label="Ascending" value="ascending" />
                  <Picker.Item label="Descending" value="descending" />
                </Picker>
              </View>
            </View>

            <View style={styles.modalButtonsContainer}>
              <Button
                mode="contained"
                style={styles.modalActionButton}
                labelStyle={{ fontSize: 16, fontWeight: "600" }}
                onPress={applySortingButtonOnPress}
              >
                Apply
              </Button>
              <Button
                mode="text"
                style={styles.modalActionButton}
                labelStyle={{ fontSize: 16, fontWeight: "600" }}
                onPress={toggleSortingModal}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Categorized Layout Trackers */}
      {filteredExpenses && filteredExpenses.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={filteredExpenses}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <List.Item
                onPress={() => expenseListItemOnPress(item)}
                title={`${convertNumberToCurrencyString(item.price, settings.currencyCode)} x ${item.quantity}`}
                description={item.name}
                titleStyle={styles.itemTitleText}
                descriptionStyle={styles.itemDescriptionText}
                right={() => (
                  <View style={styles.chevronWrapper}>
                    <ChevronRight color={theme.colors.onSurfaceVariant} size={20} />
                  </View>
                )}
                style={styles.listItemStyle}
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Ready? Add an expense to get started.
          </Text>
        </View>
      )}

      {/* Structural bottom interactions */}
      <View style={styles.actionFooter}>
        <Button
          mode="contained"
          style={styles.primaryActionButton}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
          icon={(props) => <Plus color={props.color} size={20} />}
          onPress={addExpenseButtonOnPress}
        >
          New Expense
        </Button>
      </View>
    </View>
  );
}