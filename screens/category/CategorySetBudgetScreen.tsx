import {Alert, View} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import {NativeStackNavigationProp, NativeStackScreenProps} from "@react-navigation/native-stack";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";

import { RootParamStackList } from "../../types/navigation.types";
import HorizontalLine from "../../components/HorizontalLine";
import { getCategoryDetailStyles } from "../../styles/mainStyles";
import {isBudgetExists, setBudget, deleteBudget, getBudget} from "../../database/budgetQueries";
import { useSQLiteContext } from "expo-sqlite";
import {validateAddBudgetForm} from "../../lib/validators";
import {convertDecimalToWholeNumber, convertWholeNumberToDecimal} from "../../lib/converters";

type RouteProps = NativeStackScreenProps<RootParamStackList, "CategorySetBudget">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "CategorySetBudget">;

export default function CategorySetBudgetScreen({ route }: RouteProps) {
    // Route
    const category = route.params;

    // Hooks
    const db = useSQLiteContext();
    const navigation = useNavigation<NavProps>();
    const theme = useTheme();
    const styles = getCategoryDetailStyles(theme);

    // States
    const [budgetAmount, setBudgetAmount] = useState("");
    const [hasBudget, setHasBudget] = useState(false);

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
                    onChangeText={(e) => setBudgetAmount(e)}
                    keyboardType="numeric"
                    placeholder="e.g, 76.25"
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