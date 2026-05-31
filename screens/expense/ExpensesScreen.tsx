import {ActivityIndicator, Alert, FlatList, Modal, StyleSheet, TouchableOpacity, View} from "react-native";
import {Button, FAB, Text, useTheme} from "react-native-paper";
import {ChevronRight, SlidersHorizontal, Wallet} from "lucide-react-native";
import {Picker} from "@react-native-picker/picker";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useCallback, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";

import {getExpensesScreenStyles} from "../../styles/mainStyles";
import {getCategoryIconAndColor, getRgbaColor} from "../../libs/helpers";
import { convertDateToDateString, convertNumberToCurrencyString, convertWholeNumberToDecimal } from "../../libs/converters";
import {Expense} from "../../types/models.types";
import {getAllExpenses} from "../../database/expenseQueries";
import {useSettingsStore} from "../../hooks/useSettingsStore";
import {RootParamStackList} from "../../types/navigation.types";

type NavProps = NativeStackNavigationProp<RootParamStackList, "Tabs">;

const PAGE_SIZE = 10;

export default function ExpensesScreen() {
    // Hooks
    const navigation = useNavigation<NavProps>();
    const db = useSQLiteContext();
    const settings = useSettingsStore((state) => state.settings);
    const theme = useTheme();
    const styles = getExpensesScreenStyles(theme);

    // States
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [expenses, setExpenses] = useState<({ [K in keyof Expense]: Expense[K]; } & { category_name: string })[]>([]);
    const [sortBySelectedItem, setSortBySelectedItem] = useState<"quantity" | "price" | "created_at" | "updated_at">("created_at");
    const [sortBySelectedItemDisplay, setSortBySelectedItemDisplay] = useState("Created");
    const [sortOrderSelectedItem, setSortOrderSelectedItem] = useState<"ASC" | "DESC">("DESC");
    const [sortingModal, setSortingModal] = useState(false);

    // Handlers
    function toggleSortingModal() {
        setSortingModal(!sortingModal);
    }

    function applySortingButtonOnPress() {
        setExpenses([]);
        fetchExpenses(0, true);
        setSortingModal(false);
    }

    function expenseListItemOnPress(item: Expense) {
        navigation.navigate("EditExpense", item);
    }

    // Helpers
    async function fetchExpenses(targetPage: number = 0, cleanStart = false) {
        if (loading || (!hasMore && !cleanStart)) return;
        setLoading(true);

        try {
            const offset = targetPage * PAGE_SIZE;
            const res = await getAllExpenses(db, sortBySelectedItem, sortOrderSelectedItem, PAGE_SIZE, offset);

            if (res.length < PAGE_SIZE)
                setHasMore(false);
            else
                setHasMore(true);

            setExpenses(prev => [...prev, ...res]);
            setPage(targetPage + 1);
        } catch {
            Alert.alert("Error", "Something went wrong while fetching all the expenses.");
        } finally {
            setLoading(false);
        }
    }

    // Use effects
    useFocusEffect(
        useCallback(() => {
            setExpenses([]);
            fetchExpenses(0, true);
        }, [])
    );

    return (
        <View style={styles.mainContainer}>
            {/* Ambient liquid orbs background */}
            <View style={styles.categoryLiquidShape1} />
            <View style={styles.categoryLiquidShape2} />
            <View style={styles.categoryLiquidShape3} />
            <View style={styles.categoryGlassOverlay} />

            {/* iOS Segment Sort Header */}
            <View style={styles.sortActiveHeader}>
                <View style={styles.sortStatusGroup}>
                    <Text variant="labelMedium" style={styles.sortStatusLabel}>Sort:</Text>
                    <View style={styles.sortBadge}>
                        <Text variant="labelSmall" style={styles.sortBadgeText}>
                            {sortBySelectedItemDisplay} • {sortOrderSelectedItem === "ASC" ? "Asc" : "Desc"}
                        </Text>
                    </View>
                </View>

                <Button
                    mode="text"
                    compact
                    onPress={toggleSortingModal}
                    style={styles.sortButton}
                    labelStyle={styles.sortButtonLabel}
                    icon={(props) => (
                        <SlidersHorizontal color={props.color} size={13} />
                    )}
                >
                    Sort & Filter
                </Button>
            </View>

            {/* Sorting modal acting as iOS Interactive Bottom Sheet */}
            <Modal
                visible={sortingModal}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleSortingModal}
            >
                <View style={[styles.modalBackdrop, { flex: 1 }]}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFillObject}
                        activeOpacity={1}
                        // onPress={toggleSortingModal}
                    />
                    <View style={styles.modalContent}>
                        {/* Bottom Sheet grab-handle pull representation */}
                        <View style={styles.sheetHandle} />

                        <Text variant="headlineSmall" style={styles.modalTitle}>Expense Sorting</Text>

                        <View style={styles.pickerContainer}>
                            <Text variant="bodyMedium" style={styles.pickerLabel}>Sort by</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    style={styles.picker}
                                    dropdownIconColor={theme.colors.onSurfaceVariant}
                                    selectedValue={sortBySelectedItem}
                                    onValueChange={(e) => {
                                        setSortBySelectedItem(e);

                                        switch (e) {
                                            case "created_at":
                                                setSortBySelectedItemDisplay("Created");
                                                break;
                                            case "updated_at":
                                                setSortBySelectedItemDisplay("Updated");
                                                break;
                                            case "price":
                                                setSortBySelectedItemDisplay("Price");
                                                break;
                                            case "quantity":
                                                setSortBySelectedItemDisplay("Quantity");
                                                break;
                                        }
                                    }}
                                >
                                    <Picker.Item label="Quantity" value="quantity" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                                    <Picker.Item label="Price" value="price" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                                    <Picker.Item label="Creation Date & Time" value="created_at" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                                    <Picker.Item label="Updation Date & Time" value="updated_at" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.pickerContainer}>
                            <Text variant="bodyMedium" style={styles.pickerLabel}>Order</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    style={styles.picker}
                                    dropdownIconColor={theme.colors.onSurfaceVariant}
                                    selectedValue={sortOrderSelectedItem}
                                    onValueChange={(e) => setSortOrderSelectedItem(e as "ASC" | "DESC")}
                                >
                                    <Picker.Item label="Ascending" value="ASC" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                                    <Picker.Item label="Descending" value="DESC" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.modalButtonsContainer}>
                            <Button
                                mode="contained"
                                labelStyle={{ fontWeight: "700" }}
                                onPress={applySortingButtonOnPress}
                            >
                                Apply Sorting
                            </Button>
                            <Button
                                mode="text"
                                labelStyle={{ fontWeight: "600" }}
                                onPress={toggleSortingModal}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Expense list wrapped in premium iOS container layout*/}
            {expenses && expenses.length > 0 ? (
                <View style={styles.listContainer}>
                    <FlatList
                        data={expenses}
                        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const { color: categoryColor } = getCategoryIconAndColor(item.category_name);

                            return (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => expenseListItemOnPress(item)}
                                    style={styles.listItemStyle}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 6 }}>
                                        <View style={[styles.iconWrapper, {
                                            backgroundColor: getRgbaColor(categoryColor, 0.08),
                                            borderColor: getRgbaColor(categoryColor, 0.15),
                                            borderWidth: 1,
                                            marginLeft: 4
                                        }]}>
                                            <Wallet size={16} color={categoryColor} />
                                        </View>

                                        <View style={{ flex: 1, marginLeft: 14 }}>
                                            <Text variant="bodyLarge" style={[styles.itemTitleText, { fontWeight: "700" }]}>
                                                {convertNumberToCurrencyString(convertWholeNumberToDecimal(item.price), settings.currencyCode)}
                                                {item.quantity > 1 && (
                                                    <Text variant="bodySmall" style={{ fontWeight: "500", color: theme.colors.onSurfaceVariant }}>
                                                        {` • Quantity: ${item.quantity}`}
                                                    </Text>
                                                )}
                                            </Text>
                                            <Text variant="bodyMedium" style={[styles.itemDescriptionText, { opacity: 0.8 }]}>
                                                {isNaN(new Date(item.name).getTime()) ? item.name : convertDateToDateString(new Date(item.name))}
                                            </Text>
                                            <Text variant="bodySmall" style={[styles.itemDescriptionText, { opacity: 0.8 }]}>
                                                Created: {convertDateToDateString(new Date(item.created_at))}
                                            </Text>
                                        </View>

                                        <View style={styles.chevronWrapper}>
                                            <ChevronRight color={theme.colors.onSurfaceVariant} size={15} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        onEndReached={() => fetchExpenses(page)}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={() => (
                            loading ? <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary}/> : null
                        )}
                    />
                </View>
            ) : (<></>)}

            {loading ? (
                <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary} />
            ) : expenses.length < 1 && (
                <View style={styles.emptyContainer}>
                    <Text variant="bodyLarge" style={styles.emptyText}>
                        Create your first expense to get started.
                    </Text>
                </View>
            )}

            {/* Bottom Actions Container */}
            <View style={styles.buttonsContainer}>
                <FAB mode="flat" icon="plus" onPress={() => navigation.navigate("AddExpense")} variant="primary" style={{ borderRadius: 16 }} />
            </View>
        </View>
    );
}