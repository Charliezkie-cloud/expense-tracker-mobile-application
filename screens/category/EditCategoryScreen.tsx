import {Alert, FlatList, View} from "react-native";
import {Button, Chip, Modal, Portal, Text, TextInput, useTheme} from "react-native-paper";
import {NativeStackNavigationProp, NativeStackScreenProps} from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {useSQLiteContext} from "expo-sqlite";
import {useNavigation} from "@react-navigation/native";
import { HelpCircle } from 'lucide-react-native';

import { RootParamStackList } from "../../types/navigation.types";
import { convertDateToDateString } from "../../libs/converters";
import HorizontalLine from "../../components/HorizontalLine";
import { getCategoryDetailStyles } from "../../styles/mainStyles";
import {deleteCategory, updateCategory} from "../../database/categoryQueries";
import {validateAddCategoryForm} from "../../libs/validators";
import {CATEGORY_CHIPS} from "./AddCategoryScreen";

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
  const [categoryChips, setCategoryChips] = useState(CATEGORY_CHIPS);

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

  // Use effects
  useEffect(() => {
    setCategoryName(category.name);
  }, []);

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text variant="bodyLarge" style={styles.inputLabel}>
          Name <Text style={{ color: theme.colors.error }}>*</Text>
        </Text>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          placeholder="e.g, Grocery"
          value={categoryName}
          onChangeText={categoryNameOnChangeText}
        />
      </View>

      <View style={styles.suggestionsContainer}>
        <Text variant="bodyMedium">Suggestions</Text>
        <FlatList
            style={styles.suggestionsList}
            data={categoryChips}
            renderItem={({ item }) => (
                <Chip
                    style={styles.suggestionsListItem}
                    icon={({ size }) => (
                        <item.icon size={size} color={item.color} />
                    )}
                    onPress={() => selectedSuggestion(item.label)}
                >
                  {item.label}
                </Chip>
            )}
        />
      </View>

      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          style={styles.formButton}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
          onPress={saveButtonOnPress}
        >
          Save Changes
        </Button>

        <Button
          mode="contained-tonal"
          style={styles.formButton}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
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
      <Portal>
        <Modal visible={detailsModal} style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>Details</Text>
            
            <View style={{ gap: 8, marginVertical: 4 }}>
              <View style={styles.detailsRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Name</Text>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>{category.name}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Created</Text>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                  {convertDateToDateString(new Date(category.created_at))}
                </Text>
              </View>
              <View style={styles.detailsRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Modified</Text>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                  {convertDateToDateString(new Date(category.updated_at))}
                </Text>
              </View>
            </View>

            <Button 
              mode="contained-tonal" 
              style={styles.modalActionButton}
              onPress={toggleModalButtonOnPress}
            >
              Close
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}