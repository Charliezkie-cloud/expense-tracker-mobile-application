import {Alert, FlatList, View, TouchableOpacity, Modal, StyleSheet} from "react-native";
import {Button, Text, TextInput, useTheme} from "react-native-paper";
import {NativeStackNavigationProp, NativeStackScreenProps} from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {useSQLiteContext} from "expo-sqlite";
import {useNavigation} from "@react-navigation/native";
import { HelpCircle } from 'lucide-react-native';

import { RootParamStackList } from "../../types/navigation.types";
import { convertDateToDateString } from "../../libs/converters.lib";
import HorizontalLine from "../../components/HorizontalLine";
import { getCategoryDetailStyles } from "../../styles/sub-screen-styles";
import {deleteCategory, updateCategory} from "../../database/category-queries";
import {validateAddCategoryForm} from "../../libs/validators.lib";
import {getRgbaColor} from "../../libs/helpers.lib";
import {CATEGORY_NAMES} from "../../application/data";

type RouteProps = NativeStackScreenProps<RootParamStackList, "EditCategory">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "Tabs">;

export default function EditCategoryScreen({ route }: RouteProps) {
  // Route
  const category = route.params;

  // Hooks
  const db = useSQLiteContext();
  const navigation = useNavigation<NavProps>();
  const theme = useTheme();
  const styles = getCategoryDetailStyles(theme);

  // States
  const [categoryName, setCategoryName] = useState("");
  const [detailsModal, setDetailsModal] = useState(false);
  const [categoryChips, setCategoryChips] = useState(CATEGORY_NAMES);

  // Handlers
  async function saveButtonOnPress() {
    const validationMessage = validateAddCategoryForm(categoryName);

    if (typeof validationMessage === "string")
      return Alert.alert("Error", validationMessage);

    try {
      await updateCategory(db, {
        name: categoryName.trim(),
        id: category.id
      });

      navigation.navigate("Tabs", {
        screen: "Categories"
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong while updating the category.");
    }
  }

  function toggleModalButtonOnPress() {
    setDetailsModal(prev => !prev);
  }

  async function deleteButtonOnPress() {
    try {
      await deleteCategory(db, category.id);
      navigation.navigate("Tabs", { screen: "Categories" });
    } catch (error) {
      Alert.alert("Error", "Something went wrong while deleting the category.");
    }
  }

  function categoryNameOnChangeText(e: string) {
    setCategoryName(e);

    const lowerCaseInput = e.toLowerCase();

    if (lowerCaseInput === "")
      return setCategoryChips(CATEGORY_NAMES);

    setCategoryChips([
      ...CATEGORY_NAMES.filter((item) =>
          item.id.includes(lowerCaseInput) || item.label.toLowerCase().includes(lowerCaseInput)
      ),
      { id: "others", label: "Others", icon: HelpCircle, color: "#94A3B8" }
    ]);
  }

  function selectedSuggestion(item: string) {
    setCategoryName(item);
  }

  // Use effects
  useEffect(() => {
    setCategoryName(category.name);
  }, []);

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
              Name <Text style={{ color: theme.colors.error }}>*</Text>
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

        <View style={styles.buttonGroup}>
          <Button
              mode="contained"
              labelStyle={{ fontSize: 16, fontWeight: "700", letterSpacing: 0.3 }}
              onPress={saveButtonOnPress}
          >
            Save Changes
          </Button>

          <Button
              mode="contained-tonal"
              labelStyle={{ fontSize: 16, fontWeight: "700", letterSpacing: 0.3 }}
              onPress={toggleModalButtonOnPress}
          >
            View Details
          </Button>
        </View>

        <View style={styles.dangerSection}>
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
            Delete Category
          </Button>
        </View>

        {/* Info details panel */}
        <Modal
            visible={detailsModal}
            transparent={true}
            animationType="slide"
            onRequestClose={toggleModalButtonOnPress}
        >
          <View style={[styles.modalBackdrop, { flex: 1 }]}>
            <TouchableOpacity
                style={StyleSheet.absoluteFillObject}
                activeOpacity={1}
                onPress={toggleModalButtonOnPress}
            />
            <View style={styles.modalContent}>
              <View style={styles.sheetHandle} />
              <Text variant="headlineSmall" style={styles.modalTitle}>Details</Text>

              <View style={{ gap: 12, marginVertical: 8 }}>
                <View style={styles.detailsRow}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "600" }}>Name</Text>
                  <Text variant="bodyMedium" style={{ fontWeight: "700", color: theme.colors.onSurface }}>{category.name}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "600" }}>Created</Text>
                  <Text variant="bodyMedium" style={{ fontWeight: "700", color: theme.colors.onSurface }}>
                    {convertDateToDateString(new Date(category.created_at))}
                  </Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "600" }}>Modified</Text>
                  <Text variant="bodyMedium" style={{ fontWeight: "700", color: theme.colors.onSurface }}>
                    {convertDateToDateString(new Date(category.updated_at))}
                  </Text>
                </View>
              </View>

              <Button
                  mode="contained-tonal"
                  labelStyle={{ fontWeight: "700" }}
                  onPress={toggleModalButtonOnPress}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </View>
  );
}
