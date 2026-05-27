import {Alert, FlatList, View} from "react-native";
import {Button, Chip, Text, TextInput, useTheme} from "react-native-paper";
import {NativeStackNavigationProp, NativeStackScreenProps} from "@react-navigation/native-stack";
import {useEffect, useRef, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {
    Activity,
    BookOpen, Briefcase,
    Bus,
    Coffee, GraduationCap, HelpCircle, Home, PiggyBank, ShieldCheck,
    ShoppingBag,
    ShoppingBasket,
    Sparkles, TrendingUp,
    Tv,
    Utensils, Zap
} from "lucide-react-native";

import { RootParamStackList } from "../../types/navigation.types";
import HorizontalLine from "../../components/HorizontalLine";
import { getCategoryDetailStyles } from "../../styles/mainStyles";
import {isBudgetExists, setBudget, deleteBudget, getBudget} from "../../database/budgetQueries";
import { useSQLiteContext } from "expo-sqlite";
import {validateAddBudgetForm} from "../../libs/validators";
import {
    convertDecimalToWholeNumber,
    convertNumberToCurrencyString,
    convertWholeNumberToDecimal
} from "../../libs/converters";
import {useSettingsStore} from "../../hooks/useSettingsStore";
import {CATEGORY_CHIPS} from "./AddCategoryScreen";

type RouteProps = NativeStackScreenProps<RootParamStackList, "CategorySetBudget">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "CategorySetBudget">;

// const BUDGET_CHIPS = [
//     { label: "₱200", value: 200, icon: Coffee, color: "#8B5A2B" },
//     { label: "₱300", value: 300, icon: BookOpen, color: "#3B82F6" },
//     { label: "₱500", value: 500, icon: ShoppingBag, color: "#EC4899" },
//     { label: "₱800", value: 800, icon: Sparkles, color: "#A855F7" },
//     { label: "₱1,000", value: 1000, icon: Utensils, color: "#F97316" },
//     { label: "₱1,500", value: 1500, icon: Bus, color: "#06B6D4" },
//     { label: "₱2,000", value: 2000, icon: Tv, color: "#6366F1" },
//     { label: "₱2,500", value: 2500, icon: ShoppingBasket, color: "#14B8A6" },
//     { label: "₱3,500", value: 3500, icon: Activity, color: "#EF4444" },
//     { label: "₱5,000", value: 5000, icon: Zap, color: "#EAB308" },
//     { label: "₱6,500", value: 6500, icon: ShieldCheck, color: "#059669" },
//     { label: "₱7,500", value: 7500, icon: PiggyBank, color: "#ED64A6" },
//     { label: "₱10,000", value: 10000, icon: Home, color: "#475569" },
//     { label: "₱15,000", value: 15000, icon: GraduationCap, color: "#1E3A8A" },
//     { label: "₱20,000", value: 20000, icon: TrendingUp, color: "#10B981" },
//     { label: "₱30,000", value: 30000, icon: Briefcase, color: "#7C3AED" }
// ];

export default function CategorySetBudgetScreen({ route }: RouteProps) {
    // Route
    const category = route.params;

    // Hooks
    const db = useSQLiteContext();
    const settings = useSettingsStore((state) => state.settings);
    const navigation = useNavigation<NavProps>();
    const theme = useTheme();
    const styles = getCategoryDetailStyles(theme);

    // Constants
    const BUDGET_CHIPS = [
        { label: convertNumberToCurrencyString(200, settings.currencyCode), value: 200, icon: Coffee, color: "#8B5A2B" },
        { label: convertNumberToCurrencyString(300, settings.currencyCode), value: 300, icon: BookOpen, color: "#3B82F6" },
        { label: convertNumberToCurrencyString(500, settings.currencyCode), value: 500, icon: ShoppingBag, color: "#EC4899" },
        { label: convertNumberToCurrencyString(800, settings.currencyCode), value: 800, icon: Sparkles, color: "#A855F7" },
        { label: convertNumberToCurrencyString(1000, settings.currencyCode), value: 1000, icon: Utensils, color: "#F97316" },
        { label: convertNumberToCurrencyString(1500, settings.currencyCode), value: 1500, icon: Bus, color: "#06B6D4" },
        { label: convertNumberToCurrencyString(2000, settings.currencyCode), value: 2000, icon: Tv, color: "#6366F1" },
        { label: convertNumberToCurrencyString(2500, settings.currencyCode), value: 2500, icon: ShoppingBasket, color: "#14B8A6" },
        { label: convertNumberToCurrencyString(3500, settings.currencyCode), value: 3500, icon: Activity, color: "#EF4444" },
        { label: convertNumberToCurrencyString(5000, settings.currencyCode), value: 5000, icon: Zap, color: "#EAB308" },
        { label: convertNumberToCurrencyString(6500, settings.currencyCode), value: 6500, icon: ShieldCheck, color: "#059669" },
        { label: convertNumberToCurrencyString(7500, settings.currencyCode), value: 7500, icon: PiggyBank, color: "#ED64A6" },
        { label: convertNumberToCurrencyString(10000, settings.currencyCode), value: 10000, icon: Home, color: "#475569" },
        { label: convertNumberToCurrencyString(15000, settings.currencyCode), value: 15000, icon: GraduationCap, color: "#1E3A8A" },
        { label: convertNumberToCurrencyString(20000, settings.currencyCode), value: 20000, icon: TrendingUp, color: "#10B981" },
        { label: convertNumberToCurrencyString(30000, settings.currencyCode), value: 30000, icon: Briefcase, color: "#7C3AED" }
    ];

    // States
    const [budgetAmount, setBudgetAmount] = useState("");
    const [hasBudget, setHasBudget] = useState(false);
    const [budgetChips, setBudgetChips] = useState(BUDGET_CHIPS);

    // Handlers
    async function saveButtonOnPress() {
        const validationMessage = validateAddBudgetForm(budgetAmount);

        if (typeof validationMessage === "string")
            return Alert.alert("Error", validationMessage);

        const parsedBudget = Number.parseFloat(budgetAmount);
        const convertedBudget = convertDecimalToWholeNumber(parsedBudget);

        try {
            await setBudget(db, {
                budget: convertedBudget,
                category_id: category.id
            });

            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Something went wrong while setting the budget.");
        }
    }

    async function deleteButtonOnPress() {
        try {
            await deleteBudget(db, category.id);
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error"," Something went wrong while deleting the budget.");
        }
    }

    function budgetAmountOnChangeText(e: string) {
        setBudgetAmount(e);

        const lowerCaseInput = e.toLowerCase();

        if (lowerCaseInput === "")
            return setBudgetChips(BUDGET_CHIPS);

        setBudgetChips(BUDGET_CHIPS.filter((item) =>
            item.label.toLowerCase().includes(lowerCaseInput)));
    }

    function selectedSuggestion(item: number) {
        setBudgetAmount(item.toString());
    }

    // Use effects
    useEffect(() => {
        async function checkBudget() {
            try {
                const res = await isBudgetExists(db, category.id);
                setHasBudget(res ?? false);
            } catch (error) {
                Alert.alert("Error", "Something went wrong while fetching the budget.");
            }
        }

        checkBudget();
    }, []);

    useEffect(() => {
        async function getExistingBudget() {
            try {
                const res = await getBudget(db, category.id);
                const convertedBudget = convertWholeNumberToDecimal(res?.budget ?? 0);

                setBudgetAmount(convertedBudget.toString());
            } catch {
                Alert.alert("Error", "Something went wrong while fetching the current category budget.");
            }
        }

        getExistingBudget();
    }, [hasBudget]);

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
                    onChangeText={budgetAmountOnChangeText}
                    keyboardType="numeric"
                    placeholder="e.g, 76.25"
                />
            </View>

            <View style={styles.suggestionsContainer}>
                <Text variant="bodyMedium">Suggestions</Text>
                <FlatList
                    style={styles.suggestionsList}
                    data={budgetChips}
                    renderItem={({ item }) => (
                        <Chip
                            style={styles.suggestionsListItem}
                            icon={({ size }) => (
                                <item.icon size={size} color={item.color} />
                            )}
                            onPress={() => selectedSuggestion(item.value)}
                        >
                            {item.label}
                        </Chip>
                    )}
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
                        <HorizontalLine
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