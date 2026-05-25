import {Alert, ScrollView, View} from "react-native";
import {Button, List, ProgressBar, Text, useTheme} from "react-native-paper";
import {useCallback, useState} from "react";
import {ChevronRight, Layers, TrendingUp, Wallet} from "lucide-react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {useSQLiteContext} from "expo-sqlite";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

import { convertDateToDateString,  convertNumberToCurrencyString, convertNumberToPercentageString, convertWholeNumberToDecimal } from "../lib/converters";
import { getHomeStyles } from "../styles/mainStyles";
import {useSettingsStore} from "../hooks/useSettingsStore";
import {getRecentExpenses, getTheSumOfAllExpenses} from "../database/expenseQueries";
import {getCategoriesBudgetProgress, getTheSumOfAllBudgets} from "../database/budgetQueries";
import {RootParamStackList} from "../types/navigation.types";
import {getRecentCategories} from "../database/categoryQueries";
import {Category, Expense} from "../types/models.types";

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
    const [totalExpensePercentage, setTotalExpensePercentage] = useState(0.00);
    const [budgetProgress, setBudgetProgress] = useState<{ budget_percentage: number, category_name: string }[] | null>(null);
    const [recentCategories, setRecentCategories]  = useState<Category[]>([]);
    const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);

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
                try {
                    const res = await getRecentCategories(db);
                    setRecentCategories(res);
                } catch {
                    Alert.alert("Error", "Something went wrong while fetching the recent categories.");
                }
            }

            async function fetchRecentExpenses() {
                try {
                    const res = await getRecentExpenses(db);
                    setRecentExpenses(res);
                } catch {
                    Alert.alert("Error", "Something went wrong while fetching the recent expenses.");
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

                {/*Hero Card: Total Spent*/}
                <View style={styles.heroCard}>
                    <View style={styles.heroGlassOverlay}/>
                    <Text variant="labelMedium" style={styles.heroLabel}>
                        TOTAL SPEND
                    </Text>
                    <Text variant="displayMedium" style={styles.heroAmount}>
                        {convertNumberToCurrencyString(totalExpenses, settings.currencyCode)}
                    </Text>
                    <View style={styles.pillBadge}>
                        <TrendingUp size={14} color={theme.colors.primary} style={{marginRight: 4}}/>
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
                                        <Text variant="bodyMedium" style={styles.itemTitleText}>{item.category_name}</Text>
                                        <Text variant="bodySmall" style={styles.mutedText}>
                                            {Math.min(Math.round(item.budget_percentage * 100), 100)}%
                                        </Text>
                                    </View>
                                    <ProgressBar
                                        progress={Math.min(item.budget_percentage, 1)}
                                        color={item.budget_percentage > 0.9 ? theme.colors.error : theme.colors.primary}
                                        style={styles.progressBarLine}
                                    />
                                </View>
                            ))}
                        </View>
                    ) : null}

                    {budgetProgress && budgetProgress.length < 1 && (
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
                                        description={convertDateToDateString(new Date(item.created_at))}
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

                    {recentCategories.length < 1 && (
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
                                        title={`${convertNumberToCurrencyString(convertWholeNumberToDecimal(item.price))} x ${item.quantity}`}
                                        description={convertDateToDateString(new Date(item.created_at))}
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
                                        onPress={() => navigation.navigate("EditExpense", item)}
                                        style={styles.listItemStyle}
                                    />
                                    {index < recentExpenses.length - 1 && <View style={styles.listSeparator} />}
                                </View>
                            ))}
                        </View>
                    ) : null}

                    {recentExpenses.length < 1 && (
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