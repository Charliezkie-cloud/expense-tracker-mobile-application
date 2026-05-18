import { FlatList, StyleSheet, View } from "react-native";
import { Button, List, Modal, Portal, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowUpDown, ChevronRight, Plus } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";

import { containers } from "../../styles/containers";
import { RootParamStackList } from "../../types/navigation.types";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { Category } from "../../types/data.types"
import { convertDateToDateString } from "../../utils/converters";
import { sortCategories } from "../../utils/sorters";
import { theme } from "../../styles/theme";

type NavProps = NativeStackNavigationProp<RootParamStackList, "AddCategory">;

export default function CategoriesScreen() {
  // Hooks
  const navigation = useNavigation<NavProps>();
  const categories = useCategoryStore((state) => state.categories);

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
        labelStyle={{ fontSize: 16 }}
        icon={(props) => (
          <ArrowUpDown color={props.color} size={props.size} />
        )}
        onPress={toggleSortingModal}
      >
        Sort Categories
      </Button>

      {/* Sorting modal */}
      <Portal>
        <Modal visible={sortingModal} style={{ margin: 24 }}>
          <View
            style={{
              gap: 14,
              padding: 24,
              backgroundColor: "#e5e7eb",
              borderRadius: 8
            }}
          >
            <Text variant="headlineSmall">Category Sorting</Text>

            <View style={{ gap: 8 }}>
              <Text variant="bodyLarge">Sort by</Text>
              <Picker
                style={{ backgroundColor: "#d1d5db" }}
                selectedValue={sortBySelectedItem}
                onValueChange={(e) => setSortBySelectedItem(e)}
              >
                <Picker.Item label="Creation Date & Time" value="createdAt" />
                <Picker.Item label="Updation Date & Time" value="updatedAt" />
              </Picker>
            </View>

            <View style={{ gap: 8 }}>
              <Text variant="bodyLarge">Order</Text>
              <Picker
                style={{ backgroundColor: "#d1d5db" }}
                selectedValue={sortOrderSelectedItem}
                onValueChange={(e) => setSortOrderSelectedItem(e)}
              >
                <Picker.Item label="Ascending" value="ascending" />
                <Picker.Item label="Descending" value="descending" />
              </Picker>
            </View>

            <View style={{ gap: 8 }}>
              <Button
                mode="contained"
                labelStyle={{ fontSize: 16 }}
                onPress={applySortingButtonOnPress}
              >
                Apply
              </Button>
              <Button
                labelStyle={{ fontSize: 16 }}
                onPress={toggleSortingModal}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Category list */}
      <FlatList
        data={filteredCategories}
        renderItem={(({ item }) => (
          <List.Item
            title={item.name}
            description={convertDateToDateString(new Date(item.updatedAt))}
            right={(props) => (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                <ChevronRight color={props.color} size={22} />
              </View>
            )}
            onPress={() => listItemButtonOnPress(item)}
          />
        ))}
        ListEmptyComponent={(
          <Text variant="bodyLarge" style={{ textAlign: "center" }}>
            Create your first category to get started.
          </Text>
        )}
      />

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          icon={(props) => <Plus color={props.color} size={20} />}
          onPress={addCategoryButtonOnPress}
          labelStyle={{ fontSize: 16 }}
        >
          New Category
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    ...containers.main,
    flex: 1,
    justifyContent: "space-between",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end"
  }
});