import { ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { Button, List, ProgressBar, Text, useTheme } from "react-native-paper";
import { ChevronRight, TrendingUp, Wallet, Layers } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useCategoryStore } from "../hooks/useCategoryStore";
import { useExpenseStore } from "../hooks/useExpenseStore";
import { useBudgetStore } from "../hooks/useBudgetStore";
import { convertDateToDateString, convertNumberToCurrencyString, convertNumberToPercentageString } from "../utils/converters";
import { useSettingsStore } from "../hooks/useSettingsStore";
import { Category, Expense } from "../types/data.types";
import { sortBudget, sortCategories, sortExpenses } from "../utils/sorters";
import { RootParamStackList } from "../types/navigation.types";
import { getHomeStyles } from "../styles/theme";

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

  // Access the dynamic Paper theme context
  const theme = useTheme();
  const styles = getHomeStyles(theme);

  // States
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalExpensePercentage, setTotalExpensePercentage] = useState(0);
  const [budgetProgress, setBudgetProgress] = useState<BudgetProgress[]>([]);

  const [recentCategories, setRecentCategories] = useState<Category[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);

  // ========== Use effects ==========
  useEffect(() => {
    const tempTotalExpenses = expenses.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0);
    const totalBudget = budgets.reduce((prev, curr) => prev + curr.amount, 0);
    const tempTotalExpensePercentage = totalBudget === 0 ? 0 : (tempTotalExpenses / totalBudget) * 100;

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

  useEffect(() => {
    const sortedCategories = sortCategories(categories, "createdAt", "descending");
    sortedCategories.splice(5);

    setRecentCategories(sortedCategories);
  }, [categories]);

  useEffect(() => {
    const sortedExpenses = sortExpenses(expenses, "createdAt", "descending");
    sortedExpenses.splice(5);

    setRecentExpenses(sortedExpenses);
  }, [expenses]);

  return (
    <ScrollView
      style={styles.screenBackground}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mainContainer}>

        {/* Hero Card: Total Spent */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlassOverlay} />
          <Text variant="labelMedium" style={styles.heroLabel}>
            TOTAL SPEND
          </Text>
          <Text variant="displayMedium" style={styles.heroAmount}>
            {convertNumberToCurrencyString(totalExpenses, settings.currencyCode)}
          </Text>
          <View style={styles.pillBadge}>
            <TrendingUp size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
            <Text variant="bodySmall" style={styles.pillText}>
              Used {convertNumberToPercentageString(totalExpensePercentage)} of budget
            </Text>
          </View>
        </View>

        {/* Section: Budget Progress Bar */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Budget Progress</Text>

          {budgetProgress && budgetProgress.length > 0 ? (
            <View style={styles.glassCard}>
              {budgetProgress.map((item, index) => (
                <View key={`budget-progress-item-${index}`} style={styles.progressItemRow}>
                  <View style={styles.progressHeaderRow}>
                    <Text variant="bodyMedium" style={styles.itemTitleText}>{item.category.name}</Text>
                    <Text variant="bodySmall" style={styles.mutedText}>
                      {Math.min(Math.round(item.progress * 100), 100)}%
                    </Text>
                  </View>
                  <ProgressBar
                    progress={Math.min(item.progress, 1)}
                    color={item.progress > 0.9 ? theme.colors.error : theme.colors.primary}
                    style={styles.progressBarLine}
                  />
                </View>
              ))}
            </View>
          ) : null}

          {budgetProgress.length < 1 && (
            <Button
              mode="contained-tonal"
              style={styles.iosActionButton}
              labelStyle={styles.iosActionLabel}
              onPress={() => navigation.navigate("Tabs", { screen: "Categories" })}
            >
              Set up your category budget
            </Button>
          )}
        </View>

        {/* Section: Recent Categories */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Recent Categories</Text>

          {recentCategories && recentCategories.length > 0 ? (
            <View style={styles.glassCardList}>
              {recentCategories.map((item, index) => (
                <View key={`recent-category-${index}`}>
                  <List.Item
                    title={item.name}
                    description={convertDateToDateString(new Date(item.createdAt))}
                    titleStyle={styles.itemTitleText}
                    descriptionStyle={styles.itemDescriptionText}
                    left={() => (
                      <View style={styles.iconWrapper}>
                        <Layers size={20} color={theme.colors.primary} />
                      </View>
                    )}
                    right={() => (
                      <View style={styles.chevronWrapper}>
                        <ChevronRight color={theme.colors.onSurfaceVariant} size={20} />
                      </View>
                    )}
                    onPress={() => navigation.navigate("Category", item)}
                    style={styles.listItemStyle}
                  />
                  {index < recentCategories.length - 1 && <View style={styles.listSeparator} />}
                </View>
              ))}
            </View>
          ) : null}

          {categories.length < 1 && (
            <Button
              mode="contained-tonal"
              style={styles.iosActionButton}
              labelStyle={styles.iosActionLabel}
              onPress={() => navigation.navigate("AddCategory")}
            >
              Create your first category
            </Button>
          )}
        </View>

        {/* Section: Recent Expenses */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Recent Expenses</Text>

          {recentExpenses && recentExpenses.length > 0 ? (
            <View style={styles.glassCardList}>
              {recentExpenses.map((item, index) => (
                <View key={`recent-expenses-${index}`}>
                  <List.Item
                    title={item.name}
                    description={convertDateToDateString(new Date(item.createdAt))}
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
                    onPress={() => navigation.navigate("Category", item)}
                    style={styles.listItemStyle}
                  />
                  {index < recentExpenses.length - 1 && <View style={styles.listSeparator} />}
                </View>
              ))}
            </View>
          ) : null}

          {expenses.length < 1 && (
            <Button
              mode="contained-tonal"
              style={styles.iosActionButton}
              labelStyle={styles.iosActionLabel}
              onPress={() => navigation.navigate("Tabs", { screen: "Categories" })}
            >
              Log your first expense
            </Button>
          )}
        </View>

      </View>
    </ScrollView>
  );
}