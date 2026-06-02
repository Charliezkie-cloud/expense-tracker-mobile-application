import { ActivityIndicator, Alert, FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput as TextField, useTheme } from "react-native-paper";
import InputSpinner from "react-native-input-spinner";
import { useCallback, useRef, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Wallet } from "lucide-react-native";

import { getExpenseDetailStyles } from "../../styles/sub-screen-styles";
import { getCategoryIconAndColor, getRgbaColor } from "../../libs/helpers.lib";
import {
  convertDateToDateString,
  convertDecimalToWholeNumber,
  convertNumberToCurrencyString
} from "../../libs/converters.lib";
import { Category, ScannedExpense } from "../../types/models.types";
import { getAllCategories } from "../../database/category-queries";
import { RootParamStackList } from "../../types/navigation.types";
import { validateAddExpenseForm } from "../../libs/validators.lib";
import { createExpense, createExpenses } from "../../database/expense-queries";
import { useSettingsStore } from "../../hooks/useSettingsStore";
type RouteProps = NativeStackScreenProps<RootParamStackList, "AddExpense">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "AddExpense">;

const PAGE_SIZE = 10;

export default function AddExpenseScreen({ route }: RouteProps) {
  // Route
  const scannerData = route.params;

  // Hooks
  const settings = useSettingsStore((state) => state.settings);
  const navigation = useNavigation<NavProps>();
  const db = useSQLiteContext();
  const theme = useTheme();
  const styles = getExpenseDetailStyles(theme);

  // States
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseQuantity, setExpenseQuantity] = useState(1);
  const [expensePrice, setExpensePrice] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<Category | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);

  // Handlers
  async function saveOneButtonOnPress() {
    const validationMessage = validateAddExpenseForm(expenseQuantity, expensePrice, expenseCategory);

    if (typeof validationMessage === "string")
      return Alert.alert("Error", validationMessage);

    if (!expenseCategory)
      return;

    const parsedPrice = Number.parseFloat(expensePrice);
    const convertedPrice = convertDecimalToWholeNumber(parsedPrice);

    try {
      await createExpense(db, {
        category_id: expenseCategory.id,
        name: expenseName.trim(),
        quantity: expenseQuantity,
        price: convertedPrice
      });

      navigation.goBack();
    } catch {
      Alert.alert("Error", "Something went wrong while creating an expense.");
    }
  }

  async function saveMultipleButtonOnPress() {
    if (!Array.isArray(scannerData))
      return;

    for (const item of scannerData) {
      const data: ScannedExpense = item;
      const validationMessage = validateAddExpenseForm(data.quantity, data.price.toString(), expenseCategory);

      if (typeof validationMessage === "string")
        return Alert.alert("Error", validationMessage);
    }

    if (!expenseCategory)
      return;

    const parsedData = scannerData.map((e: ScannedExpense & { category_id: number }) => ({
      ...e,
      name: e.name.trim(),
      price: convertDecimalToWholeNumber(e.price),
      category_id: expenseCategory.id
    }));

    try {
      await createExpenses(db, parsedData);
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Something went wrong while creating an expense.");
    }
  }

  function listItemButtonOnPress(category: Category) {
    if (selectedCategoryId === category.id) {
      setSelectedCategoryId(-1);
      setExpenseCategory(null);
      return;
    }

    setExpenseCategory(category);
    setSelectedCategoryId(category.id);
  }

  // Refs
  const priceTextInputRef = useRef<TextInput>(null);

  // Helpers
  async function fetchCategories(targetPage: number = 0, cleanStart = false) {
    if (loading || (!hasMore && !cleanStart)) return;
    setLoading(true);

    try {
      const offset = targetPage * PAGE_SIZE;
      const res = await getAllCategories(db, "created_at", "DESC", PAGE_SIZE, offset);

      if (res.length < PAGE_SIZE)
        setHasMore(false);
      else
        setHasMore(true);

      setCategories(prev => [...prev, ...res]);
      setPage(targetPage + 1);
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching the categories.");
    } finally {
      setLoading(false);
    }
  }

  // Use effects
  useFocusEffect(
    useCallback(() => {
      setCategories([]);
      fetchCategories(0, true);
    }, [])
  );

  // Scanner data
  if (scannerData)
    return (
      <View style={styles.formContainer}>
        {/* Ambient liquid orbs background */}
        <View style={styles.categoryLiquidShape1} />
        <View style={styles.categoryLiquidShape2} />
        <View style={styles.categoryLiquidShape3} />
        <View style={styles.categoryGlassOverlay} />

        {/* Volumetric Frosted Glass Input Card */}
        <View style={styles.listContainer}>
          <Text style={styles.inputLabel}>
            Expenses
          </Text>

          <FlatList
            data={scannerData}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.listItemStyle}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 6 }}>
                    <View style={[styles.iconWrapper, {
                      backgroundColor: getRgbaColor(theme.colors.onPrimaryContainer, 0.08),
                      borderColor: getRgbaColor(theme.colors.onPrimaryContainer, 0.15),
                      borderWidth: 1,
                      marginLeft: 4
                    }]}>
                      <Wallet size={16} color={theme.colors.primary} />
                    </View>

                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text variant="bodyLarge" style={[styles.itemTitleText, { fontWeight: "700" }]}>
                        {convertNumberToCurrencyString(item.price, settings.currencyCode)}
                        {item.quantity > 1 && (
                          <Text variant="bodySmall" style={{ fontWeight: "500", color: theme.colors.onSurfaceVariant }}>
                            {` • Quantity: ${item.quantity}`}
                          </Text>
                        )}
                      </Text>
                      <Text variant="bodyMedium" style={[styles.itemDescriptionText, { opacity: 0.8 }]}>
                        {item.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            // onEndReached={() => fetchExpenses(page)}
            onEndReachedThreshold={0.2}
            ListFooterComponent={() => (
              loading ? <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary}/> : null
            )}
          />
        </View>

        {/*Category List*/}
        <View style={styles.suggestionsListContainer}>
          <Text style={styles.inputLabel}>
            Category <Text style={styles.requiredAsterisk}>*</Text>
          </Text>

          {categories && categories.length > 0 ? (
            <FlatList
              key={`category-grid-${categories.length}`}
              style={styles.suggestionsList}
              data={categories}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const { Icon, color } = getCategoryIconAndColor(item.name);
                const customBg = getRgbaColor(color, 0.08);
                const customBorder = getRgbaColor(color, 0.2);

                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => listItemButtonOnPress(item)}
                    style={[
                      styles.listItemWrapper,
                      {
                        backgroundColor: selectedCategoryId === item.id ?
                          theme.colors.primaryContainer :
                          "transparent"
                      }
                    ]}
                  >
                    <View style={styles.listItemInner}>
                      <View style={[styles.iconWrapper, { backgroundColor: customBg, borderColor: customBorder }]}>
                        <Icon size={18} color={color} />
                      </View>

                      <View style={styles.itemTextContainer}>
                        <Text variant="bodyLarge" style={styles.itemTitleText}>{item.name}</Text>
                        <Text variant="bodySmall" style={styles.itemDescriptionText}>
                          Created: {convertDateToDateString(new Date(item.created_at))}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={() => (
                loading ? <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary} /> : null
              )}
              onEndReached={() => fetchCategories(page)}
              onEndReachedThreshold={0.2}
            />
          ) : (<></>)}

          {loading ? (
            <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary} />
          ) : categories.length < 1 && (
            <View style={styles.emptyContainer}>
              <Button
                mode="contained-tonal"
                elevation={0}
                style={styles.iosActionButton}
                labelStyle={styles.iosActionLabel}
                onPress={() => navigation.navigate("AddCategory")}
              >
                Create your first category
              </Button>
            </View>
          )}
        </View>

        {/* Save Button with glowing/volumetric shadow */}
        <Button
          mode="contained"
          labelStyle={[theme.fonts.titleMedium, { fontWeight: "700", letterSpacing: 0.3 }]}
          onPress={saveMultipleButtonOnPress}
        >
          Save Expenses
        </Button>
      </View>
    );

  return (
    <View style={styles.formContainer}>
      {/* Ambient liquid orbs background */}
      <View style={styles.categoryLiquidShape1} />
      <View style={styles.categoryLiquidShape2} />
      <View style={styles.categoryLiquidShape3} />
      <View style={styles.categoryGlassOverlay} />

      {/* Volumetric Frosted Glass Input Card */}
      <View style={styles.glassInputCard}>
        {/* Expense name input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Expense name
          </Text>
          <TextField
            mode="outlined"
            style={styles.textInput}
            placeholder="e.g., Jeepney fare"
            placeholderTextColor={theme.dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"}
            textColor={theme.colors.onSurface}
            activeOutlineColor={theme.colors.primary}
            outlineColor={theme.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
            value={expenseName}
            onChangeText={(e) => setExpenseName(e)}
          />
        </View>

        {/* Expense quantity input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
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
              background="transparent"
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
          <Text style={styles.inputLabel}>
            Price <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <TextField
            ref={priceTextInputRef}
            mode="outlined"
            style={styles.textInput}
            placeholder="e.g., 67.25"
            placeholderTextColor={theme.dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"}
            textColor={theme.colors.onSurface}
            activeOutlineColor={theme.colors.primary}
            outlineColor={theme.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
            keyboardType="numeric"
            value={expensePrice}
            onChangeText={(e) => setExpensePrice(e)}
          />
        </View>
      </View>

      {/*Category List*/}
      <View style={styles.suggestionsListContainer}>
        <Text style={styles.inputLabel}>
          Category <Text style={styles.requiredAsterisk}>*</Text>
        </Text>

        {categories && categories.length > 0 ? (
          <FlatList
            key={`category-grid-${categories.length}`}
            style={styles.suggestionsList}
            data={categories}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const { Icon, color } = getCategoryIconAndColor(item.name);
              const customBg = getRgbaColor(color, 0.08);
              const customBorder = getRgbaColor(color, 0.2);

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => listItemButtonOnPress(item)}
                  style={[
                    styles.listItemWrapper,
                    {
                      backgroundColor: selectedCategoryId === item.id ?
                        theme.colors.primaryContainer :
                        "transparent"
                    }
                  ]}
                >
                  <View style={styles.listItemInner}>
                    <View style={[styles.iconWrapper, { backgroundColor: customBg, borderColor: customBorder }]}>
                      <Icon size={18} color={color} />
                    </View>

                    <View style={styles.itemTextContainer}>
                      <Text variant="bodyLarge" style={styles.itemTitleText}>{item.name}</Text>
                      <Text variant="bodySmall" style={styles.itemDescriptionText}>
                        Created: {convertDateToDateString(new Date(item.created_at))}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={() => (
              loading ? <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary} /> : null
            )}
            onEndReached={() => fetchCategories(page)}
            onEndReachedThreshold={0.2}
          />
        ) : (<></>)}

        {loading ? (
          <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary} />
        ) : categories.length < 1 && (
          <View style={styles.emptyContainer}>
            <Button
              mode="contained-tonal"
              elevation={0}
              style={styles.iosActionButton}
              labelStyle={styles.iosActionLabel}
              onPress={() => navigation.navigate("AddCategory")}
            >
              Create your first category
            </Button>
          </View>
        )}
      </View>

      {/* Save Button with glowing/volumetric shadow */}
      <Button
        mode="contained"
        labelStyle={[theme.fonts.titleMedium, { fontWeight: "700", letterSpacing: 0.3 }]}
        onPress={saveOneButtonOnPress}
      >
        Save Expense
      </Button>
    </View>
  );
}