import {Alert, FlatList, View, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {Button, Text, TextInput, useTheme} from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import {HelpCircle} from 'lucide-react-native';

import { RootParamStackList } from "../../types/navigation.types";
import { validateAddCategoryForm } from "../../libs/validators";
import { getCategoryDetailStyles } from "../../styles/mainStyles";
import { createCategory } from "../../database/categoryQueries";
import {getRgbaColor} from "../../libs/helpers";
import {CATEGORY_CHIPS} from "../../application/data";

type NavProp = NativeStackNavigationProp<RootParamStackList, "AddCategory">;

export default function AddCategoryScreen() {
    // Hooks
    const db = useSQLiteContext();
    const navigation = useNavigation<NavProp>();
    const theme = useTheme();
    const styles = getCategoryDetailStyles(theme);

    // States
    const [categoryName, setCategoryName] = useState("");
    const [categoryChips, setCategoryChips] = useState(CATEGORY_CHIPS);

    // Handlers
    async function saveButtonOnPress() {
        const validationMessage = validateAddCategoryForm(categoryName);

        if (typeof validationMessage === "string")
            return Alert.alert("Error", validationMessage);

        try {
            const trimmedCategoryName = categoryName.trim();
            await createCategory(db, { name: trimmedCategoryName });

            navigation.navigate("Tabs", { screen: "Categories" });
            Alert.alert("Success", `${trimmedCategoryName} added to your list.`);
        } catch (error) {
            Alert.alert("Error", "Something went wrong while create a new category");
        }
    }

    function categoryNameOnChangeText(e: string) {
        setCategoryName(e);

        const lowerCaseInput = e.toLowerCase();

        if (lowerCaseInput === "")
            return setCategoryChips(CATEGORY_CHIPS);

        setCategoryChips([
            ...CATEGORY_CHIPS.filter((item) =>
                item.id.includes(lowerCaseInput) || item.label.toLowerCase().includes(lowerCaseInput)
            ),
            { id: "others", label: "Others", icon: HelpCircle, color: "#94A3B8" }
        ]);
    }

    function selectedSuggestion(item: string) {
        setCategoryName(item);
    }

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
                    <Text style={styles.inputLabel}>
                        Category name <Text style={{ color: theme.colors.error }}>*</Text>
                    </Text>
                    <TextInput
                        value={categoryName}
                        mode="outlined"
                        style={styles.textInput}
                        onChangeText={categoryNameOnChangeText}
                        placeholder="e.g., Groceries"
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
                        {categoryChips.length} loaded
                    </Text>
                </View>

                <View style={styles.suggestionsListContainer}>
                    <FlatList
                        key={`suggestions-grid-${categoryChips.length}`}
                        style={styles.suggestionsList}
                        data={categoryChips}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const customBg = getRgbaColor(item.color, 0.08);
                            const customBorder = getRgbaColor(item.color, 0.2);

                            return (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={styles.suggestionsListItem}
                                    onPress={() => selectedSuggestion(item.label)}
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
                Save Category
            </Button>
        </View>
    );
}
