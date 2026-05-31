import {Alert, FlatList, View, TouchableOpacity} from "react-native";
import {Button, Text, TextInput, useTheme} from "react-native-paper";
import {NativeStackNavigationProp, NativeStackScreenProps} from "@react-navigation/native-stack";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {
    Activity,
    BookOpen, Briefcase,
    Bus,
    Coffee, GraduationCap, Home, PiggyBank, ShieldCheck,
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
import { convertDecimalToWholeNumber, convertNumberToCurrencyString, convertWholeNumberToDecimal } from "../../libs/converters";
import {useSettingsStore} from "../../hooks/useSettingsStore";
import {getRgbaColor} from "../../libs/helpers";

type RouteProps = NativeStackScreenProps<RootParamStackList, "CategorySetBudget">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "CategorySetBudget">;

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
            item.value.toString().includes(lowerCaseInput)));
    }

    // Suggestions click handler to fill selected suggestion and auto filter
    function selectedSuggestion(item: number) {
        const itemStr = item.toString();
        setBudgetAmount(itemStr);
        // Clean chips suggestion matching state
        setBudgetChips(BUDGET_CHIPS.filter((suggestion) =>
            suggestion.value.toString().includes(itemStr)));
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

                setBudgetAmount(convertedBudget > 0 ? convertedBudget.toString() : "");
            } catch {
                Alert.alert("Error", "Something went wrong while fetching the current category budget.");
            }
        }

        getExistingBudget();
    }, [hasBudget]);

    return (
        <View style={styles.formContainer}>
            {/* Ambient liquid orbs background */}
            <View style={styles.categoryLiquidShape1} />
            <View style={styles.categoryLiquidShape2} />
            <View style={styles.categoryLiquidShape3} />
            <View style={styles.categoryGlassOverlay} />

            {/* Volumetric Frosted Glass Input Card */}
            <View style={styles.glassInputCard}>
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
                        placeholder="e.g., 76.25"
                        textColor={theme.colors.onSurface}
                        activeOutlineColor={theme.colors.primary}
                        outlineColor={theme.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
                    />
                </View>
            </View>

            {/* Volumetric Glass list of suggestions */}
            <View style={styles.suggestionsContainer}>
                <View style={styles.suggestionsTitleRow}>
                    <Text style={styles.suggestionsTitle}>Suggestions</Text>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: theme.colors.onSurfaceVariant, opacity: 0.6 }}>
                        {budgetChips.length} loaded
                    </Text>
                </View>

                <View style={styles.suggestionsListContainer}>
                    <FlatList
                        key={`suggestions-grid-${budgetChips.length}`}
                        style={styles.suggestionsList}
                        data={budgetChips}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const customBg = getRgbaColor(item.color, 0.08);
                            const customBorder = getRgbaColor(item.color, 0.2);

                            return (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={styles.suggestionsListItem}
                                    onPress={() => selectedSuggestion(item.value)}
                                >
                                    <View style={[styles.chipItemInner, { backgroundColor: customBg, borderColor: customBorder }]}>
                                        <item.icon size={16} color={item.color} />
                                        <Text style={[styles.chipText, { color: theme.colors.onSurface }]}>{item.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </View>

            {/* Save Button with glowing/volumetric shadow */}
            <Button
                mode="contained"
                labelStyle={{ fontSize: 16, fontWeight: "700", letterSpacing: 0.3 }}
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
