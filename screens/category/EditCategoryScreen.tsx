import { Alert, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import { RootParamStackList } from "../../types/navigation.types";
import { validateAddCategoryForm } from "../../utils/validators";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { convertDateToDateString } from "../../utils/converters";
import { useExpenseStore } from "../../hooks/useExpenseStore";
import { useBudgetStore } from "../../hooks/useBudgetStore";
import HorizontalLineWithTitle from "../../components/HorizontalLineWithTitle";
import { getCategoryDetailStyles } from "../../styles/theme";

type RouteProps = NativeStackScreenProps<RootParamStackList, "EditCategory">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "Tabs">;

export default function EditCategoryScreen({ route }: RouteProps) {
  // Route
  const category = route.params;

  // Hooks
  const navigation = useNavigation<NavProps>();
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);
  const deleteCategoryExpenses = useExpenseStore((state) => state.deleteCategoryExpenses);
  const deleteBudget = useBudgetStore((state) => state.deleteBudget);

  const theme = useTheme();
  const styles = getCategoryDetailStyles(theme);

  // States
  const [categoryName, setCategoryName] = useState("");
  const [detailsModal, setDetailsModal] = useState(false);

  // Handlers
  function saveButtonOnPress() {
    const validationMessage = validateAddCategoryForm(categoryName);

    if (typeof validationMessage === "string") {
      Alert.alert("Error", validationMessage);
      return;
    }

    updateCategory(category.id, categoryName);
    Alert.alert("Success", "You've successfully updated the category.");
    navigation.navigate("Tabs", { screen: "Categories" });
  }

  function toggleModalButtonOnPress() {
    setDetailsModal(prev => !prev);
  }

  function deleteButtonOnPress() {
    Alert.alert(
      "Deletion Confirmation",
      "Are you sure you want to delete this category? this action can't be undone.",
      [
        {
          text: "Yes",
          onPress: () => {
            deleteBudget(category);
            deleteCategoryExpenses(category.id);
            deleteCategory(category.id);
            navigation.navigate("Tabs", { screen: "Categories" });
          }
        },
        { text: "No", style: "cancel" }
      ]
    );
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
          onChangeText={(e) => setCategoryName(e)}
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
        <HorizontalLineWithTitle
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
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Identity</Text>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>{category.name}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Created</Text>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                  {convertDateToDateString(new Date(category.createdAt))}
                </Text>
              </View>
              <View style={styles.detailsRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Modified</Text>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                  {convertDateToDateString(new Date(category.updatedAt))}
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