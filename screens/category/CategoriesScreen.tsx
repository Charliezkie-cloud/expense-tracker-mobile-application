import { FlatList, View } from "react-native";
import { Button, List, Modal, Portal, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowUpDown, ChevronRight, Plus, Layers } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";

import { RootParamStackList } from "../../types/navigation.types";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { Category } from "../../types/data.types"
import { convertDateToDateString } from "../../utils/converters";
import { sortCategories } from "../../utils/sorters";
import { getCategoriesStyles } from "../../styles/theme";

type NavProps = NativeStackNavigationProp<RootParamStackList, "AddCategory">;

export default function CategoriesScreen() {
  // Hooks
  const navigation = useNavigation<NavProps>();
  const categories = useCategoryStore((state) => state.categories);

  // Theme & Styles
  const theme = useTheme();
  const styles = getCategoriesStyles(theme);

  // States
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [sortingModal, setSortingModal] = useState(false);
  const [sortBySelectedItem, setSortBySelectedItem] = useState<"createdAt" | "updatedAt">("createdAt");
  const [sortOrderSelectedItem, setSortOrderSelectedItem] = useState<"ascending" | "descending">("ascending");

  // Handlers
  function addCategoryButtonOnPress() {
    navigation.navigate("AddCategory");
  }

  function toggleSortingModal() {
    setSortingModal(prev => !prev);
  }

  function applySortingButtonOnPress() {
    const sortedCategories = sortCategories(categories, sortBySelectedItem, sortOrderSelectedItem);
    setFilteredCategories(sortedCategories);
    toggleSortingModal();
  }

  function listItemButtonOnPress(category: Category) {
    navigation.navigate("Category", category)
  }

  // Use effects
  useEffect(() => {
    const sortedCategories = sortCategories(categories, sortBySelectedItem, sortOrderSelectedItem);
    setFilteredCategories(sortedCategories);
  }, [categories]);

  return (
    <View style={styles.mainContainer}>

      {/* Sort button */}
      <Button
        mode="text"
        style={styles.sortButton}
        labelStyle={styles.sortButtonLabel}
        icon={(props) => (
          <ArrowUpDown color={props.color} size={props.size} />
        )}
        onPress={toggleSortingModal}
      >
        Sort Categories
      </Button>

      {/* Sorting modal */}
      <Portal>
        <Modal visible={sortingModal} style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>Category Sorting</Text>

            <View style={styles.pickerContainer}>
              <Text variant="bodyMedium" style={styles.pickerLabel}>Sort by</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  dropdownIconColor={theme.colors.onSurfaceVariant}
                  selectedValue={sortBySelectedItem}
                  onValueChange={(e) => setSortBySelectedItem(e)}
                >
                  <Picker.Item label="Creation Date & Time" value="createdAt" />
                  <Picker.Item label="Updation Date & Time" value="updatedAt" />
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
                  onValueChange={(e) => setSortOrderSelectedItem(e)}
                >
                  <Picker.Item label="Ascending" value="ascending" />
                  <Picker.Item label="Descending" value="descending" />
                </Picker>
              </View>
            </View>

            <View style={styles.modalButtonsContainer}>
              <Button
                mode="contained"
                style={styles.modalActionButton}
                labelStyle={{ fontSize: 16, fontWeight: "600" }}
                onPress={applySortingButtonOnPress}
              >
                Apply
              </Button>
              <Button
                mode="text"
                style={styles.modalActionButton}
                labelStyle={{ fontSize: 16, fontWeight: "600" }}
                onPress={toggleSortingModal}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Category list wrapped in premium iOS container layout */}
      {filteredCategories && filteredCategories.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={filteredCategories}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <List.Item
                title={item.name}
                description={convertDateToDateString(new Date(item.updatedAt))}
                titleStyle={styles.itemTitleText}
                descriptionStyle={styles.itemDescriptionText}
                left={() => (
                  <View style={styles.iconWrapper}>
                    <Layers size={20} color={theme.colors.primary} />
                  </View>
                )}
                right={() => (
                  <View style={styles.chevronWrapper}>
                    <ChevronRight color={theme.colors.onSurfaceVariant} size={20} />
                  </View>
                )}
                onPress={() => listItemButtonOnPress(item)}
                style={styles.listItemStyle}
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Create your first category to get started.
          </Text>
        </View>
      )}

      {/* Bottom Actions Container */}
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          style={styles.newCategoryButton}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
          icon={(props) => <Plus color={props.color} size={20} />}
          onPress={addCategoryButtonOnPress}
        >
          New Category
        </Button>
      </View>
    </View>
  )
}