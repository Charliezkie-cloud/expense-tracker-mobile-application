import { Alert, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import { containers } from "../../styles/containers";
import { RootParamStackList } from "../../types/navigation.types";
import { validateAddCategoryForm } from "../../utils/validators";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { convertDateToDateString } from "../../utils/converters";
import { useExpenseStore } from "../../hooks/useExpenseStore";
import { useBudgetStore } from "../../hooks/useBudgetStore";

type RouteProps = NativeStackScreenProps<RootParamStackList, "EditCategory">;
type NavProps = NativeStackNavigationProp<RootParamStackList, "Tabs">;

export default function EditCategoryScreen({ route }: RouteProps) {
  // Route
  const category = route.params;

  // Hook
  const navigation = useNavigation<NavProps>();
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);
  const deleteCategoryExpenses = useExpenseStore((state) => state.deleteCategoryExpenses);
  const deleteBudget = useBudgetStore((state) => state.deleteBudget);

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
            navigation.navigate("Tabs", {
              screen: "Categories"
            });
          }
        },
        {
          text: "No",
          style: "cancel"
        }
      ]
    )
  }

  // Use effects
  useEffect(() => {
    setCategoryName(category.name);
  }, []);

  return (
    <View style={containers.main}>

      {/* Form */}
      <View style={{ gap: 8 }}>
        <Text variant="bodyLarge">
          Name{" "}
          <Text variant="bodyLarge" style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          placeholder="e.g, Grocery"
          value={categoryName}
          onChangeText={(e) => setCategoryName(e)}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Button
          mode="contained"
          labelStyle={{ fontSize: 16 }}
          onPress={saveButtonOnPress}
        >
          Save
        </Button>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Button
            labelStyle={{ fontSize: 16 }}
            style={{ width: "50%" }}
            onPress={deleteButtonOnPress}
          >
            Delete
          </Button>
          <Button
            labelStyle={{ fontSize: 16 }}
            style={{ width: "50%" }}
            onPress={toggleModalButtonOnPress}
          >
            Details
          </Button>
        </View>
      </View>

      {/* Modal */}
      <Portal>
        <Modal visible={detailsModal} style={{ margin: 24 }}>
          <View
            style={{
              gap: 10,
              backgroundColor: "#e5e7eb",
              padding: 24,
              borderRadius: 8
            }}
          >
            <Text variant="headlineSmall">Details</Text>
            <Text variant="bodyLarge">Category name: {category.name}</Text>
            <Text variant="bodyLarge">Created at {convertDateToDateString(new Date(category.createdAt))}</Text>
            <Text variant="bodyLarge">Created at {convertDateToDateString(new Date(category.updatedAt))}</Text>
            <Button onPress={toggleModalButtonOnPress}>Close</Button>
          </View>
        </Modal>
      </Portal>

    </View>
  )
}