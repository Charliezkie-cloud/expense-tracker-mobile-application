import {Alert, FlatList, View} from "react-native";
import {Button, FAB, List, Modal, Portal, Text, useTheme} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowUpDown, ChevronRight, Plus, Layers } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {useSQLiteContext} from "expo-sqlite";

import { RootParamStackList } from "../../types/navigation.types";
import { convertDateToDateString } from "../../libs/converters";
import { getCategoriesStyles } from "../../styles/mainStyles";
import { Category } from "../../types/models.types";
import { getAllCategories } from "../../database/categoryQueries";

type NavProps = NativeStackNavigationProp<RootParamStackList, "AddCategory">;

export default function CategoriesScreen() {
  // Hooks
  const db = useSQLiteContext();
  const navigation = useNavigation<NavProps>();

  // Theme & Styles
  const theme = useTheme();
  const styles = getCategoriesStyles(theme);

  // States
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [sortingModal, setSortingModal] = useState(false);
  const [sortBySelectedItem, setSortBySelectedItem] = useState<"created_at" | "updated_at">("updated_at");
  const [sortOrderSelectedItem, setSortOrderSelectedItem] = useState<"ASC" | "DESC">("DESC");

  // Handlers
  function addCategoryButtonOnPress() {
    navigation.navigate("AddCategory");
  }

  function toggleSortingModal() {
    setSortingModal(prev => !prev);
  }

  async function applySortingButtonOnPress() {
    try {
      const res = await getAllCategories(db, sortBySelectedItem, sortOrderSelectedItem);
      setFilteredCategories(res ?? []);
      toggleSortingModal();
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching the categories.");
    }
  }

  function listItemButtonOnPress(category: Category) {
    navigation.navigate("Category", category);
  }

  // Use effects
  useEffect(() => {
    async function fetchAllCategories() {
      try {
        const res = await getAllCategories(db);
        setFilteredCategories(res ?? []);
      } catch (error) {
        Alert.alert("Error", "Something went wrong while fetching the categories.");
      }
    }

    fetchAllCategories();
  }, []);

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
                  <Picker.Item label="Creation Date & Time" value="created_at" />
                  <Picker.Item label="Updation Date & Time" value="updated_at" />
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
                  <Picker.Item label="Ascending" value="ASC" />
                  <Picker.Item label="Descending" value="DESC" />
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
                description={convertDateToDateString(new Date(item.updated_at))}
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
        <FAB mode="flat" icon="plus" onPress={addCategoryButtonOnPress} variant="primary" />
      </View>
    </View>
  )
}