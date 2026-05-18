import { FlatList, ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { List, ProgressBar, Text } from "react-native-paper";
import { ChevronRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { containers } from "../styles/containers";
import { useCategoryStore } from "../hooks/useCategoryStore";
import { useExpenseStore } from "../hooks/useExpenseStore";
import { useBudgetStore } from "../hooks/useBudgetStore";
import { convertDateToDateString, convertNumberToCurrencyString, convertNumberToPercentageString } from "../utils/converters";
import { useSettingsStore } from "../hooks/useSettingsStore";
import { Category, Expense } from "../types/data.types";
import { sortBudget, sortCategories, sortExpenses } from "../utils/sorters";
import { RootParamStackList } from "../types/navigation.types";

type BudgetProgress = {
  category: Category;
  progress: number;
};

type NavProps = NativeStackNavigationProp<RootParamStackList, "Tabs">;

export default function HomeScreen() {
  // Hooks
  const navigation = useNavigation<NavProps>();
  const categories = useCategoryStore((state) => state.categories);
  const expenses = useExpenseStore((state) => state.expenses);
  const budgets = useBudgetStore((state) => state.budgets);
  const settings = useSettingsStore((state) => state.settings);

  // States
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalExpensePercentage, setTotalExpensePercentage] = useState(0);
  const [budgetProgress, setBudgetProgress] = useState<BudgetProgress[]>([]);

  const [recentCategories, setRecentCategories] = useState<Category[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);

  // ========== Use effects ==========
  // Get total expenses and category progress
  useEffect(() => {
    const tempTotalExpenses = expenses.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0);
    const totalBudget = budgets.reduce((prev, curr) => prev + curr.amount, 0);
    const tempTotalExpensePercentage = totalBudget === 0 ? 0 :(tempTotalExpenses / totalBudget) * 100;
    
    setTotalExpenses(tempTotalExpenses);
    setTotalExpensePercentage(tempTotalExpensePercentage);

    setBudgetProgress([]);

    const sortedBudgets = sortBudget(budgets, "amount", "descending");
    sortedBudgets.splice(3);

    for (const item of sortedBudgets) {
      const tempExpense = expenses.filter(e => e.category.id === item.category.id);
      const totalTempExpense = tempExpense.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0);
      const budgetProgress = item.amount === 0 ? 0 : totalTempExpense / item.amount;

      setBudgetProgress(prev => [
        ...prev, {
          category: item.category,
          progress: budgetProgress
        }
      ]);
    }
  }, [expenses, budgets]);

  // Get recent categories
  useEffect(() => {
    const sortedCategories = sortCategories(categories, "createdAt", "descending");
    sortedCategories.splice(5);

    setRecentCategories(sortedCategories);
  }, [categories]);

  // Get recent expenses
  useEffect(() => {
    const sortedExpenses = sortExpenses(expenses, "createdAt", "descending");
    sortedExpenses.splice(5);

    setRecentExpenses(sortedExpenses);
  }, [expenses]);

  return (
    <ScrollView>
      <View style={{
        ...containers.main,
        gap: 20
      }}>

        {/* Total spent */}
        <View style={{ gap: 12, }}>
          <Text
            variant="titleMedium"
            style={{ textAlign: "center" }}
          >
            TOTAL SPEND
          </Text>
          <Text
            variant="displayLarge"
            style={{ textAlign: "center", color: "#16a34a" }}
          >
            {convertNumberToCurrencyString(totalExpenses, settings.currencyCode)}
          </Text>
          <Text
            variant="bodyLarge"
            style={{ textAlign: "center" }}
          >
            "You've used{" "}{convertNumberToPercentageString(totalExpensePercentage)}{" "}of budget"
          </Text>
        </View>

        {/* Budget progress bar */}
        <View>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>Budget Progress</Text>
          {budgetProgress && budgetProgress.map((item, index) => (
            <View
              key={`budget-progress-item-${index}`}
              style={{
                gap: 6,
                padding: 12,
                borderRadius: 8
              }}
            >
              <Text variant="bodyLarge">{item.category.name}</Text>
              <ProgressBar
                progress={item.progress}
                style={{ height: 12, borderRadius: 8, backgroundColor: "white" }}
              />
            </View>
          ))}
          {budgetProgress.length < 1 ? (
            <Text variant="bodyLarge" style={{ textAlign: "center", marginBlock: 18 }}>
              Create your first category to get started.
            </Text>
          ) : (<></>)}
        </View>

        {/* Recent categories */}
        <View>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>Recent Categories</Text>
          {recentCategories && recentCategories.map((item, index) => (
            <List.Item
              key={`recent-category-${index}`}
              title={item.name}
              description={convertDateToDateString(new Date(item.createdAt))}
              right={(props) => (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                  <ChevronRight color={props.color} size={22} />
                </View>
              )}
              onPress={() => navigation.navigate("Category", item)}
            />
          ))}
          {budgetProgress.length < 1 ? (
            <Text variant="bodyLarge" style={{ textAlign: "center", marginBlock: 18 }}>
              Create your first category to get started.
            </Text>
          ) : (<></>)}
        </View>

        {/* Recent expenses */}
        <View>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>Recent Expenses</Text>
          {recentExpenses && recentExpenses.map((item, index) => (
            <List.Item
              key={`recent-expenses-${index}`}
              title={item.name}
              description={convertDateToDateString(new Date(item.createdAt))}
              right={(props) => (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                  <ChevronRight color={props.color} size={22} />
                </View>
              )}
              onPress={() => navigation.navigate("Category", item)}
            />
          ))}
          {budgetProgress.length < 1 ? (
            <Text variant="bodyLarge" style={{ textAlign: "center", marginBlock: 18 }}>
              Create your first category to get started.
            </Text>
          ) : (<></>)}
        </View>

      </View>
    </ScrollView>
  )
}