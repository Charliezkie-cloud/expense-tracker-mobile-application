import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, StyleSheet, View } from "react-native";
import { BanknoteArrowUp, ChevronRight, Pencil, Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import { RootParamStackList } from "../../types/navigation.types";
import { containers } from "../../styles/containers";
import { useEffect, useState } from "react";
import { Expense } from "../../types/data.types";
import { useExpenseStore } from "../../hooks/useExpenseStore";
import { convertNumberToCurrencyString } from "../../utils/converters";
import { Button, List, Text } from "react-native-paper";
import { useBudgetStore } from "../../hooks/useBudgetStore";
import { sortExpenses } from "../../utils/sorters";

type RouteProps = NativeStackScreenProps<RootParamStackList, "Category">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "Category">;

export default function CategoryScreen({ route }: RouteProps) {
  // Route
  const category = route.params;

  // Hooks
  const navigation = useNavigation<NavProps>();
  const expenses = useExpenseStore((state) => state.expenses);
  const budgets = useBudgetStore((state) => state.budgets);

  // States
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0.00);
  const [budget, setBudget] = useState<number | null>(null);
  const [remainingBudget, setRemainingBudget] = useState<number | null>(null);

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

  function expenseListItemOnPress(expense: Expense) {
    navigation.navigate("EditExpense", expense);
  }

  // Use effects
  useEffect(() => {
    const updated = expenses.filter(e => e.category.id === category.id);
    setFilteredExpenses(updated);

    const total = updated.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0);
    setTotal(total);

    const categoryBudget = budgets.find(e => e.category.id === category.id);
    if (categoryBudget) {
      setBudget(categoryBudget.amount);
      setRemainingBudget(categoryBudget.amount - total);
    } else {
      setBudget(null);
      setRemainingBudget(null);
    }
  }, [expenses, budgets]);

  return (
    <View style={styles.mainContainer}>
      <Text
        variant="displayMedium"
        style={{ textAlign: "center" }}
      >
        {convertNumberToCurrencyString(total)}
      </Text>

      {(budget && remainingBudget) && (
        <View
          style={{
            borderColor: "#6b7280",
            borderWidth: StyleSheet.hairlineWidth,
            padding: 14,
            borderRadius: 8,
            gap: 6
          }}
        >
          <Text variant="bodyLarge">
            Budget:{" "}
            {convertNumberToCurrencyString(budget)}
          </Text>
          <Text variant="bodyLarge">
            Remaining budget:{" "}
            <Text
              variant="bodyLarge"
              style={{
                color: remainingBudget <= 0 ? "#ef4444" : "#166534"
              }}
            >
              {convertNumberToCurrencyString(remainingBudget)}
            </Text>
          </Text>
        </View>
      )}
      
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 8
        }}
      >
        <Button
          mode="contained"
          onPress={editCategoryButtonOnPress}
          style={{ width: "50%" }}
          labelStyle={{ fontSize: 16 }}
          icon={(props) => <Pencil color={props.color} size={20} />}
        >
          Edit Category
        </Button>
        <Button
          onPress={setBudgetButtonOnPress}
          style={{ width: "50%" }}
          labelStyle={{ fontSize: 16 }}
          icon={(props) => <BanknoteArrowUp color={props.color} size={20} />}
        >
          Set Budget
        </Button>
      </View>

      {/* Order */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 6
        }}
        >
        <View style={{ gap: 8, width: "50%" }}>
          <Text variant="bodyLarge">Sort by</Text>
          <Picker style={{ backgroundColor: "#e5e7eb" }}>
            <Picker.Item label="Price" value="price" />
            <Picker.Item label="Quantity" value="quantity" />
            <Picker.Item label="Creation Date & Time" value="createdAt" />
            <Picker.Item label="Updation Date & Time" value="updatedAt" />
          </Picker>
        </View>
        <View style={{ gap: 8, width: "50%" }}>
          <Text variant="bodyLarge">Order</Text>
          <Picker style={{ backgroundColor: "#e5e7eb" }}>
            <Picker.Item label="Ascending" value="ascending" />
            <Picker.Item label="Descending" value="descending" />
          </Picker>
        </View>
      </View>

      {/* Expense list */}
      <FlatList
        data={filteredExpenses}
        renderItem={(({ item }) => (
          <List.Item
            onPress={() => expenseListItemOnPress(item)}
            title={`${convertNumberToCurrencyString(item.price)} x ${item.quantity}`}
            description={item.name}
            style={{
              backgroundColor: "#e5e7eb",
              borderRadius: 8,
              marginBottom: 8
            }}
            right={(props) => (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                <ChevronRight color={props.color} size={22}/>
              </View>
            )}
          />
        ))}
        ListEmptyComponent={() => (
          <Text variant="bodyLarge" style={{ textAlign: "center" }}>
            Ready? Add an expense to get started.
          </Text>
        )}
      />

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          icon={(props) => <Plus color={props.color} size={20} />}
          labelStyle={{ fontSize: 16 }}
          onPress={addExpenseButtonOnPress}
        >
          New Expense
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    ...containers.main,
    flex: 1,
    justifyContent: "space-between"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6
  },
});