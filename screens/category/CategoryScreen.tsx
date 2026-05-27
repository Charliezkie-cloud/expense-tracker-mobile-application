import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import {Alert, FlatList, View} from "react-native";
import {ArrowUpDown, BanknoteArrowUp, ChevronRight, Pencil, Plus, Wallet} from "lucide-react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import {useCallback, useEffect, useState} from "react";
import {Button, Modal, Portal, Text, useTheme, List, FAB} from "react-native-paper";
import {useSQLiteContext} from "expo-sqlite";

import { RootParamStackList } from "../../types/navigation.types";
import { convertDateToDateString, convertNumberToCurrencyString, convertWholeNumberToDecimal } from "../../libs/converters";
import { useSettingsStore } from "../../hooks/useSettingsStore";
import { getCategoryDetailStyles } from "../../styles/mainStyles";
import {getBudget, isBudgetExists} from "../../database/budgetQueries";
import {getAllExpensesOfCategory, getTheSumOfExpenses} from "../../database/expenseQueries";
import {Expense} from "../../types/models.types";

type RouteProps = NativeStackScreenProps<RootParamStackList, "Category">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "Category">;

export default function CategoryScreen({ route }: RouteProps) {
  // Params
  const category = route.params;

  // Hooks
  const db = useSQLiteContext();
  const navigation = useNavigation<NavProps>();
  const settings = useSettingsStore((state) => state.settings);
  const theme = useTheme();
  const styles = getCategoryDetailStyles(theme);

  // States
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState<number>(0.00);
  const [budget, setBudget] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [isBudgetExistsState, setIsBudgetExistsState] = useState(false);
  const [sortingModal, setSortingModal] = useState(false);

  const [sortBySelectedItem, setSortBySelectedItem] = useState<"price" | "quantity" | "created_at" | "updated_at">("created_at");
  const [sortOrderSelectedItem, setSortOrderSelectedItem] = useState<"ASC" | "DESC">("ASC");

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

  async function applySortingButtonOnPress() {
    try {
      const res = await getAllExpensesOfCategory(db, category.id, sortBySelectedItem, sortOrderSelectedItem);
      setFilteredExpenses(res);
      toggleSortingModal();
    } catch {
      Alert.alert("Error", "Something went wrong while fetching the category expenses.");
    }
  }

  function expenseListItemOnPress(item: Expense) {
    navigation.navigate("EditExpense", item);
  }

  // Helpers
  function toggleSortingModal() {
    setSortingModal(prev => !prev);
  }

  // Use effects
  useFocusEffect(
      useCallback(() => {
        async function checkIfBudgetExists() {
          try {
            const res = await isBudgetExists(db, category.id);
            setIsBudgetExistsState(res ?? false);
          } catch {
            Alert.alert("Error", "Something went wrong while fetching the category budget.");
          }
        }

        async function fetchBudget() {
          try {
            const res = await getBudget(db, category.id);
            const tempBudget = res?.budget ?? 0;
            const convertedBudget = convertWholeNumberToDecimal(tempBudget);

            setBudget(convertedBudget);
          } catch {
            Alert.alert("Error", "Something went wrong while fetching the category budget.");
          }
        }

        checkIfBudgetExists();
        fetchBudget();
      }, [])
  );

  useFocusEffect(
      useCallback(() => {
        async function fetchTheSumOfExpenses() {
          try {
            const res = await getTheSumOfExpenses(db, category.id);
            const convertedTotal = convertWholeNumberToDecimal(res?.total_sum ?? 0);

            setTotal(convertedTotal);
          } catch (error) {
            Alert.alert("Error", "Something went wrong while summing up the category expenses.");
          }
        }

        async function fetchCategoryExpenses() {
          try {
            const res = await getAllExpensesOfCategory(db, category.id, sortBySelectedItem, sortOrderSelectedItem);
            setFilteredExpenses(res ?? []);
          } catch (error) {
            Alert.alert("Error", "Something went wrong while fetching the category expenses.");
          }
        }

        fetchTheSumOfExpenses();
        fetchCategoryExpenses();
      }, [])
  );

  useEffect(() => {
    setRemainingBudget(budget - total);
  }, [budget, total]);

  return (
      <View style={styles.mainContainer}>

        {/* Total display area */}
        <View style={styles.totalDisplayContainer}>
          <Text variant="displayMedium" style={styles.totalAmountText}>
            {convertNumberToCurrencyString(total, settings.currencyCode)}
          </Text>
        </View>

        {/* Structured Budget Panel */}
        {isBudgetExistsState && (
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
                    <Picker.Item label="Creation Date & Time" value="created_at" />
                    <Picker.Item label="Updation Date & Time" value="updated_at" />
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
                    <Picker.Item label="Ascending" value="ASC" />
                    <Picker.Item label="Descending" value="DESC" />
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
                          title={`${convertNumberToCurrencyString(convertWholeNumberToDecimal(item.price), settings.currencyCode)} x ${item.quantity}`}
                          description={
                            isNaN(new Date(item.name).getTime()) ? item.name : convertDateToDateString(new Date(item.name))
                          }
                          titleStyle={styles.itemTitleText}
                          descriptionStyle={styles.itemDescriptionText}
                          left={() => (
                              <View style={[styles.iconWrapper, { backgroundColor: theme.colors.surfaceVariant }]}>
                                <Wallet size={20} color={theme.colors.primary} />
                              </View>
                          )}
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
          <FAB mode="flat" icon="plus" onPress={addExpenseButtonOnPress} variant="primary" />
        </View>
      </View>
  );
}