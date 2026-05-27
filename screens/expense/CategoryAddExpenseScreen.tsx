import {Alert, TextInput, View} from "react-native";
import {Button, Text, TextInput as TextField, useTheme} from "react-native-paper";
import {NativeStackNavigationProp, NativeStackScreenProps} from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import InputSpinner from "react-native-input-spinner";
import {useSQLiteContext} from "expo-sqlite";
import {useNavigation} from "@react-navigation/native";

import { RootParamStackList } from "../../types/navigation.types";
import { getExpenseStyles } from "../../styles/mainStyles";
import {validateAddExpenseForm} from "../../libs/validators";
import {createExpense} from "../../database/expenseQueries";
import {convertDecimalToWholeNumber} from "../../libs/converters";

type RouteProps = NativeStackScreenProps<RootParamStackList, "CategoryAddExpense">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "CategoryAddExpense">;

export default function CategoryAddExpenseScreen({ route }: RouteProps) {
    // Route
    const category = route.params;

    // Hooks
    const db = useSQLiteContext();
    const navigation = useNavigation<NavProps>();
    const theme = useTheme();
    const styles = getExpenseStyles(theme);

    // States
    const [expenseName, setExpenseName] = useState("");
    const [expenseQuantity, setExpenseQuantity] = useState(1);
    const [expensePrice, setExpensePrice] = useState("");

    // Refs
    const priceTextInputRef = useRef<TextInput>(null);

    // Handlers
    async function saveButtonOnPress() {
        const validationMessage = validateAddExpenseForm(expenseQuantity, expensePrice);

        if (typeof validationMessage === "string")
            return Alert.alert("Error", validationMessage);

        const parsedPrice = Number.parseFloat(expensePrice);
        const convertedPrice = convertDecimalToWholeNumber(parsedPrice);

        try {
            await createExpense(db, {
                category_id: category.id,
                name: expenseName.trim(),
                quantity: expenseQuantity,
                price: convertedPrice
            });

            navigation.goBack();
        } catch {
            Alert.alert("Error", "Something went wrong while creating an expense.");
        }
    }

    return (
        <View style={styles.formContainer}>

            {/* Expense name input */}
            <View style={styles.inputGroup}>
                <Text variant="bodyLarge" style={styles.inputLabel}>
                    Expense name <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextField
                    mode="outlined"
                    style={styles.textInput}
                    placeholder="e.g., Jeepney fare"
                    value={expenseName}
                    onChangeText={(e) => setExpenseName(e)}
                />
            </View>

            {/* Expense quantity input */}
            <View style={styles.inputGroup}>
                <Text variant="bodyLarge" style={styles.inputLabel}>
                    Quantity <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <View style={styles.spinnerContainer}>
                    <InputSpinner
                        min={1}
                        max={100}
                        fontSize={18}
                        skin="round"
                        colorMax={theme.colors.error}
                        colorMin={theme.colors.primary}
                        background={theme.colors.surface}
                        textColor={theme.colors.onSurface}
                        value={expenseQuantity}
                        onChange={(e: number) => setExpenseQuantity(e)}
                        onSubmit={() => priceTextInputRef.current?.focus()}
                        style={{ elevation: 0, shadowOpacity: 0, width: "100%" }}
                    />
                </View>
            </View>

            {/* Expense price input */}
            <View style={styles.inputGroup}>
                <Text variant="bodyLarge" style={styles.inputLabel}>
                    Price <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextField
                    ref={priceTextInputRef}
                    mode="outlined"
                    style={styles.textInput}
                    placeholder="e.g., 67.25"
                    keyboardType="numeric"
                    value={expensePrice}
                    onChangeText={(e) => setExpensePrice(e)}
                />
            </View>

            <Button
                mode="contained"
                style={styles.formButton}
                labelStyle={{ fontSize: 16, fontWeight: "600" }}
                onPress={saveButtonOnPress}
            >
                Save Expense
            </Button>
        </View>
    );
}