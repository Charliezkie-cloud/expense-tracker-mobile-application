import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, FlatList, View, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from "react-native";
import { BanknoteArrowUp, ChevronRight, Pencil, Wallet, SlidersHorizontal } from "lucide-react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useEffect, useState } from "react";
import { Button, Text, useTheme, FAB } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";

import { RootParamStackList } from "../../types/navigation.types";
import { convertDateToDateString, convertNumberToCurrencyString, convertWholeNumberToDecimal } from "../../libs/converters.lib";
import { useSettingsStore } from "../../hooks/useSettingsStore";
import { getCategoryDetailStyles } from "../../styles/sub-screen-styles";
import { getBudget, isBudgetExists } from "../../database/budget-queries";
import { getAllExpensesOfCategory, getTheSumOfExpenses } from "../../database/expense-queries";
import { Expense } from "../../types/models.types";
import { getCategoryIconAndColor, getRgbaColor } from "../../libs/helpers.lib";

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

  // Dynamic colors matching the Category
  const { Icon: CategoryIcon, color: categoryColor } = getCategoryIconAndColor(category.name);

  // States
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState<number>(0.00);
  const [budget, setBudget] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [isBudgetExistsState, setIsBudgetExistsState] = useState(false);
  const [sortingModal, setSortingModal] = useState(false);
  const [sortBySelectedItem, setSortBySelectedItem] = useState<"price" | "quantity" | "created_at" | "updated_at">("updated_at");
  const [sortOrderSelectedItem, setSortOrderSelectedItem] = useState<"ASC" | "DESC">("DESC");

  // Handlers
  function addExpenseButtonOnPress() {
    navigation.navigate("CategoryAddExpense", category);
  }

  function addExpensesButtonOnPress() {
    navigation.navigate("Tabs", { screen: "Camera" });
  }

  // Set NavProps target to fit correctly
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
    }, [category.id])
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
        setExpensesLoading(true);

        try {
          const res = await getAllExpensesOfCategory(db, category.id, sortBySelectedItem, sortOrderSelectedItem);
          setFilteredExpenses(res ?? []);
        } catch (error) {
          Alert.alert("Error", "Something went wrong while fetching the category expenses.");
        } finally {
          setExpensesLoading(false);
        }
      }

      fetchTheSumOfExpenses();
      fetchCategoryExpenses();
    }, [category.id, sortBySelectedItem, sortOrderSelectedItem])
  );

  useEffect(() => {
    setRemainingBudget(budget - total);
  }, [budget, total]);

  return (
    <View style={styles.mainContainer}>
      {/* Ambient liquid orbs background */}
      <View style={styles.categoryLiquidShape1} />
      <View style={styles.categoryLiquidShape2} />
      <View style={styles.categoryLiquidShape3} />
      <View style={styles.categoryGlassOverlay} />

      {/* Volumetric Glassmorphic Dashboard Card */}
      <View style={styles.glassCard}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={[styles.iconWrapper, {
              backgroundColor: getRgbaColor(categoryColor, 0.1),
              borderColor: getRgbaColor(categoryColor, 0.25),
              borderWidth: 1,
              marginLeft: 0
            }]}>
              <CategoryIcon size={18} color={categoryColor} />
            </View>
            <View>
              <Text variant="titleMedium" style={{ fontWeight: "800", color: theme.colors.onSurface }}>
                {category.name}
              </Text>
              <Text variant="labelSmall" style={{ fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, color: theme.colors.onSurfaceVariant, opacity: 0.7 }}>
                Categorized Spending
              </Text>
            </View>
          </View>
        </View>

        {/* Total Display */}
        <View style={[styles.totalDisplayContainer, { paddingVertical: 12 }]}>
          <Text variant="displaySmall" style={[styles.totalAmountText, { letterSpacing: -0.5, fontWeight: "900" }]}>
            {convertNumberToCurrencyString(total, settings.currencyCode)}
          </Text>
        </View>
      </View>

      {/* Structured Budget Panel */}
      {isBudgetExistsState ? (
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
                { color: remainingBudget <= 0 ? theme.colors.error : "#10b981", fontWeight: "700" }
              ]}
            >
              {convertNumberToCurrencyString(remainingBudget ?? 0.00, settings.currencyCode)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.budgetCard, { borderStyle: "dashed", borderColor: theme.colors.outlineVariant, alignItems: "center", paddingVertical: 16 }]}>
          <Text variant="bodyMedium" style={[styles.budgetTextLabel, { fontStyle: "italic", marginBottom: 4 }]}>
            No budget limits set.
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.65, fontWeight: "500" }}>
            Keep tracking organized by defining a monthly budget cap.
          </Text>
        </View>
      )}

      {/* Inline Section Adjustments */}
      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={editCategoryButtonOnPress}
          style={styles.splitButton}
          labelStyle={[styles.splitButtonLabel, { fontWeight: "700" }]}
          icon={(props) => <Pencil color={props.color} size={15} />}
        >
          Edit Category
        </Button>
        <Button
          mode="contained-tonal"
          onPress={setBudgetButtonOnPress}
          style={styles.splitButton}
          labelStyle={[styles.splitButtonLabel, { fontWeight: "700" }]}
          icon={(props) => <BanknoteArrowUp color={props.color} size={15} />}
        >
          Set Budget
        </Button>
      </View>

      {/* Sorting Activation triggers */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4, paddingHorizontal: 4 }}>
        <View style={{ flex: 1 }}>
          <Text variant="labelSmall" style={{ fontWeight: "800", color: theme.colors.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 1.1 }}>
            Expenses List
          </Text>
        </View>
        <Button
          mode="text"
          compact
          style={[styles.sortButton, { alignSelf: "flex-end", width: "auto", marginBottom: 0 }]}
          labelStyle={[styles.sortButtonLabel, { fontWeight: "700" }]}
          icon={(props) => <SlidersHorizontal color={props.color} size={13} />}
          onPress={toggleSortingModal}
        >
          {sortBySelectedItem === "price" ? "Price" : sortBySelectedItem === "quantity" ? "Qty" : "Date"} • {sortOrderSelectedItem === "ASC" ? "Asc" : "Desc"}
        </Button>
      </View>

      {/* Expense Dynamic Ordering Modal */}
      <Modal
        visible={sortingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleSortingModal}
      >
        <View style={[styles.modalBackdrop, { flex: 1 }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={toggleSortingModal}
          />
          <View style={styles.modalContent}>
            {/* Bottom Sheet grab-handle pull representation */}
            <View style={styles.sheetHandle} />
            <Text variant="headlineSmall" style={styles.modalTitle}>Expense Sorting</Text>

            <View style={styles.pickerContainer}>
              <Text variant="bodyMedium" style={styles.pickerLabel}>Sort by</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  dropdownIconColor={theme.colors.onSurfaceVariant}
                  selectedValue={sortBySelectedItem}
                  onValueChange={(e) => setSortBySelectedItem(e as "price" | "quantity" | "created_at" | "updated_at")}
                >
                  <Picker.Item label="Price" value="price" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                  <Picker.Item label="Quantity" value="quantity" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                  <Picker.Item label="Creation Date & Time" value="created_at" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                  <Picker.Item label="Updation Date & Time" value="updated_at" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
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
                  onValueChange={(e) => setSortOrderSelectedItem(e as "ASC" | "DESC")}
                >
                  <Picker.Item label="Ascending" value="ASC" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                  <Picker.Item label="Descending" value="DESC" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                </Picker>
              </View>
            </View>

            <View style={styles.modalButtonsContainer}>
              <Button
                mode="contained"
                labelStyle={{ fontWeight: "700" }}
                onPress={applySortingButtonOnPress}
              >
                Apply Sort
              </Button>
              <Button
                mode="text"
                labelStyle={{ fontWeight: "600" }}
                onPress={toggleSortingModal}
              >
                Close
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Categorized Layout Trackers */}
      {filteredExpenses && filteredExpenses.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={filteredExpenses}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => expenseListItemOnPress(item)}
                style={styles.listItemStyle}
              >
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 6 }}>
                  <View style={[styles.iconWrapper, {
                    backgroundColor: getRgbaColor(categoryColor, 0.08),
                    borderColor: getRgbaColor(categoryColor, 0.15),
                    borderWidth: 1,
                    marginLeft: 4
                  }]}>
                    <Wallet size={16} color={categoryColor} />
                  </View>

                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text variant="bodyLarge" style={[styles.itemTitleText, { fontWeight: "700" }]}>
                      {convertNumberToCurrencyString(convertWholeNumberToDecimal(item.price), settings.currencyCode)}
                      {item.quantity > 1 && (
                        <Text variant="bodySmall" style={{ fontWeight: "500", color: theme.colors.onSurfaceVariant }}>
                          {` • Quantity: ${item.quantity}`}
                        </Text>
                      )}
                    </Text>
                    <Text variant="bodySmall" style={[styles.itemDescriptionText, { opacity: 0.8 }]}>
                      {isNaN(new Date(item.name).getTime()) ? item.name : convertDateToDateString(new Date(item.name))}
                    </Text>
                  </View>

                  <View style={styles.chevronWrapper}>
                    <ChevronRight color={theme.colors.onSurfaceVariant} size={15} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : expensesLoading ? (
        <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary} />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.surfaceVariant, justifyContent: "center", alignItems: "center", marginBottom: 12, opacity: 0.8 }}>
            <Wallet size={20} color={theme.colors.onSurfaceVariant} />
          </View>
          <Text variant="bodyMedium" style={[styles.emptyText, { fontWeight: "600" }]}>
            No expenses found
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7, textAlign: "center", marginTop: 4, paddingHorizontal: 24 }}>
            Ready? Add an expense using the plus button below to get started.
          </Text>
        </View>
      )}

      {/* Structural bottom interactions */}
      <View style={styles.actionFooter}>
        <FAB
          mode="flat"
          icon="camera"
          onPress={addExpensesButtonOnPress}
          variant="primary"
          style={{ borderRadius: 30 }}
        />
        <FAB
          mode="flat"
          icon="plus"
          onPress={addExpenseButtonOnPress}
          variant="primary"
          style={{ borderRadius: 30 }}
        />
      </View>
    </View>
  );
}