import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { Button, List, ProgressBar, Text, useTheme } from "react-native-paper";
import { useCallback, useState } from "react";
import { ChevronRight, TrendingUp, Wallet } from "lucide-react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { convertDateToDateString,  convertNumberToCurrencyString, convertNumberToPercentageString, convertWholeNumberToDecimal } from "../libs/converters.lib";
import { useSettingsStore } from "../hooks/useSettingsStore";
import { getRecentExpenses, getTheSumOfAllExpenses } from "../database/expense-queries";
import { getCategoriesBudgetProgress, getTheSumOfAllBudgets } from "../database/budget-queries";
import { RootParamStackList } from "../types/navigation.types";
import { getRecentCategories } from "../database/category-queries";
import { Category, Expense } from "../types/models.types";
import { getCategoryIconAndColor } from "../libs/helpers.lib";
import { getHomeStyles } from "../styles/screen-styles";

type NavProps = NativeStackNavigationProp<RootParamStackList, "Tabs">;

export default function HomeScreen() {
    // Hooks
    const navigation = useNavigation<NavProps>();
    const db = useSQLiteContext();
    const settings = useSettingsStore((state) => state.settings);
    const theme = useTheme();
    const styles = getHomeStyles(theme);

    // States
    const [totalExpenses, setTotalExpenses] = useState(0.00);
    const [totalBudgets, setTotalBudgets] = useState(0.00);
    const [totalExpensePercentage, setTotalExpensePercentage] = useState(0.00);
    const [budgetProgress, setBudgetProgress] = useState<{ budget_percentage: number, category_name: string }[] | null>(null);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [recentCategories, setRecentCategories]  = useState<Category[]>([]);
    const [expensesLoading, setExpensesLoading] = useState(false);
    const [recentExpenses, setRecentExpenses] = useState<({ [K in keyof Expense]: Expense[K] } & { category_name: string })[]>([]);

    // Use effects
    useFocusEffect(
        useCallback(() => {
            async function getAllTotalSpent() {
                try {
                    const res = await getTheSumOfAllExpenses(db);

                    if (res) {
                        setTotalExpenses(convertWholeNumberToDecimal(res.total ?? 0));
                    }
                } catch {
                    Alert.alert("Error", "Something went wrong while summing up all the expenses.");
                }
            }

            getAllTotalSpent();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            async function getThePercentageOfUsedBudget() {
                try {
                    const res = await getTheSumOfAllBudgets(db);

                    if (res) {
                        const convertedBudgets = convertWholeNumberToDecimal(res.total);
                        setTotalBudgets(convertedBudgets);

                        if (convertedBudgets > 0) {
                            const percentage = totalExpenses / convertedBudgets;
                            return setTotalExpensePercentage(percentage * 100);
                        }

                        setTotalExpensePercentage(0.00);
                    }
                } catch {
                    Alert.alert("Error", "Something went wrong while summing up all the expenses.");
                }
            }

            getThePercentageOfUsedBudget();
        }, [totalExpenses])
    );

    useFocusEffect(
        useCallback(() => {
            async function getBudgetsProgress() {
                try {
                    const res = await getCategoriesBudgetProgress(db);

                    if (res)
                        setBudgetProgress(res);
                } catch {
                    Alert.alert("Error", "Something went wrong while fetching the budget progress.");
                }
            }

            getBudgetsProgress();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            async function fetchRecentCategories() {
                setRecentCategories([]);
                setCategoriesLoading(true);

                try {
                    const res = await getRecentCategories(db);
                    setRecentCategories(res);
                } catch {
                    Alert.alert("Error", "Something went wrong while fetching the recent categories.");
                } finally {
                    setCategoriesLoading(false);
                }
            }

            async function fetchRecentExpenses() {
                setRecentExpenses([]);
                setExpensesLoading(true);

                try {
                    const res = await getRecentExpenses(db);
                    setRecentExpenses(res);
                } catch {
                    Alert.alert("Error", "Something went wrong while fetching the recent expenses.");
                } finally {
                    setExpensesLoading(false);
                }
            }

            fetchRecentCategories();
            fetchRecentExpenses();
        }, [])
    );

    return (
        <ScrollView
            style={styles.screenBackground}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.mainContainer}>
                {/* Ambient liquid orbs background */}
                <View style={styles.categoryLiquidShape1} />
                <View style={styles.categoryLiquidShape2} />
                <View style={styles.categoryLiquidShape3} />
                <View style={styles.categoryGlassOverlay} />

                {/* Glass Hero Card Content with Glass-Liquid Layers */}
                <View style={styles.heroCard}>
                    {/* Multi-layered dynamic fluid blur effect */}
                    <View style={styles.heroLiquidShape1} />
                    <View style={styles.heroLiquidShape2} />
                    <View style={styles.heroGlassOverlay}/>

                    {/* Top row showing currency symbol & status */}
                    <View style={styles.heroHeaderRow}>
                        <Text variant="labelMedium" style={styles.heroLabel}>
                            OVERVIEW
                        </Text>
                        <View style={styles.liveIndicator}>
                            <View style={styles.liveIndicatorPulse} />
                            <Text variant="labelSmall" style={styles.liveText}>LIVE TIME</Text>
                        </View>
                    </View>

                    {/* Spend Display Section (Full width, auto-scalable) */}
                    <View style={styles.heroSpendSection}>
                        <Text variant="labelMedium" style={styles.heroSubLabel}>
                            TOTAL SPEND
                        </Text>
                        <Text
                            variant="displayMedium"
                            style={styles.heroAmount}
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}
                            minimumFontScale={0.55}
                        >
                            {convertNumberToCurrencyString(totalExpenses, settings.currencyCode)}
                        </Text>
                    </View>

                    {/* Horizontal Frosted Divider */}
                    <View style={styles.heroHorizontalDivider} />

                    {/* Footer Row: Total Budget (Left) and Used Badge (Right) */}
                    <View style={styles.heroFooterRow}>
                        <View style={styles.heroFooterBudgetBlock}>
                            <Text variant="labelSmall" style={styles.heroSubLabelSmallStacked}>
                                TOTAL BUDGET
                            </Text>
                            <Text
                                variant="titleMedium"
                                style={styles.heroBudgetAmountStacked}
                                numberOfLines={1}
                                adjustsFontSizeToFit={true}
                                minimumFontScale={0.7}
                            >
                                {convertNumberToCurrencyString(totalBudgets, settings.currencyCode)}
                            </Text>
                        </View>

                        {/* Used percentage pill badge */}
                        <View style={styles.pillBadge}>
                            <TrendingUp size={14} color={theme.colors.primary} style={{marginRight: 6}}/>
                            <Text variant="bodySmall" style={styles.pillText}>
                                {convertNumberToPercentageString(totalExpensePercentage)} Used
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Section: Budget Progress Bar */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Budget Progress</Text>
                        {budgetProgress && budgetProgress.length > 0 && (
                            <Text variant="labelSmall" style={styles.headerCounterText}>
                                {budgetProgress.length} Categories
                            </Text>
                        )}
                    </View>

                    {budgetProgress && budgetProgress.length > 0 ? (
                        <View style={styles.glassCard}>
                            {budgetProgress.map((item, index) => (
                                <View key={`budget-progress-item-${index}`} style={budgetProgress.length - index !== 1 ? styles.progressItemRow : { }}>
                                    <View style={styles.progressHeaderRow}>
                                        <Text variant="bodyMedium" style={styles.itemTitleText}>{item.category_name}</Text>
                                        <Text variant="bodySmall" style={styles.mutedText}>
                                            {Math.min(Math.round(item.budget_percentage * 100), 100)}%
                                        </Text>
                                    </View>
                                    <View style={styles.progressBarWrapper}>
                                        <ProgressBar
                                            progress={Math.min(item.budget_percentage, 1)}
                                            color={item.budget_percentage > 0.9 ? theme.colors.error : theme.colors.primary}
                                            style={styles.progressBarLine}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : null}

                    {budgetProgress && budgetProgress.length < 1 && (
                        <Button
                            mode="contained-tonal"
                            elevation={0}
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
                    <View style={styles.sectionHeader}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Recent Categories</Text>
                        {recentCategories && recentCategories.length > 0 && (
                            <Button onPress={() => navigation.navigate("Tabs", { screen: "Categories" })}>
                                View All
                            </Button>
                        )}
                    </View>

                    {recentCategories && recentCategories.length > 0 ? (
                        <View style={styles.glassCardList}>
                            {recentCategories.map((item, index) => {
                                const { color, Icon } = getCategoryIconAndColor(item.name);

                                return (
                                    <View key={`recent-category-${index}`}>
                                        <List.Item
                                            title={
                                                <Text variant="bodyLarge" style={styles.itemTitleText}>
                                                    {item.name}
                                                </Text>
                                            }
                                            description={
                                                <Text variant="bodySmall" style={styles.itemDescriptionText}>
                                                    Created {convertDateToDateString(new Date(item.created_at))}
                                                </Text>
                                            }
                                            left={() => (
                                                <View style={styles.iconWrapperCategory}>
                                                    <Icon size={18} color={color} />
                                                </View>
                                            )}
                                            right={() => (
                                                <View style={styles.chevronWrapper}>
                                                    <ChevronRight color={theme.colors.onSurfaceVariant} size={18} />
                                                </View>
                                            )}
                                            onPress={() => navigation.navigate("Category", item)}
                                            style={styles.listItemStyle}
                                        />
                                        {index < recentCategories.length - 1 && <View style={styles.listSeparator} />}
                                    </View>
                                );
                            })}
                        </View>
                    ) : null}

                    {categoriesLoading ? (
                        <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary} />
                    ) : recentCategories.length < 1 && (
                        <Button
                            mode="contained-tonal"
                            elevation={0}
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
                    <View style={styles.sectionHeader}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Recent Expenses</Text>
                        {recentExpenses && recentExpenses.length > 0 && (
                            <Button onPress={() => navigation.navigate("Tabs", { screen: "Expenses" })}>
                                View All
                            </Button>
                        )}
                    </View>

                    {recentExpenses && recentExpenses.length > 0 ? (
                        <View style={styles.glassCardList}>
                            {recentExpenses.map((item, index) => {
                                const { color } = getCategoryIconAndColor(item.category_name);

                                return (
                                    <View key={`recent-expenses-${index}`}>
                                        <List.Item
                                            title={
                                                <Text variant="bodyLarge" style={styles.itemTitleText}>
                                                    {`${convertNumberToCurrencyString(convertWholeNumberToDecimal(item.price), settings.currencyCode)} x ${item.quantity}`}
                                                </Text>
                                            }
                                            description={
                                                <Text variant="bodySmall" style={styles.itemDescriptionText}>
                                                    Created: {convertDateToDateString(new Date(item.created_at))}
                                                </Text>
                                            }
                                            left={() => (
                                                <View style={styles.iconWrapperExpense}>
                                                    <Wallet size={18} color={color} />
                                                </View>
                                            )}
                                            right={() => (
                                                <View style={styles.chevronWrapper}>
                                                    <ChevronRight color={theme.colors.onSurfaceVariant} size={18} />
                                                </View>
                                            )}
                                            onPress={() => navigation.navigate("EditExpense", item)}
                                            style={styles.listItemStyle}
                                        />
                                        {index < recentExpenses.length - 1 && <View style={styles.listSeparator} />}
                                    </View>
                                );
                            })}
                        </View>
                    ) : null}

                    {expensesLoading ? (
                        <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary} />
                    ) : recentExpenses.length < 1 && (
                        <Button
                            mode="contained-tonal"
                            elevation={0}
                            style={styles.iosActionButton}
                            labelStyle={styles.iosActionLabel}
                            onPress={() => navigation.navigate("Tabs", { screen: "Expenses" })}
                        >
                            Log your first expense
                        </Button>
                    )}

                </View>

            </View>
        </ScrollView>
    );
}