import { Alert, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Button, Text, TextInput } from "react-native-paper";

import { containers } from "../../styles/containers";
import { RootParamStackList } from "../../types/navigation.types";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { validateAddCategoryForm } from "../../utils/validators";

type NavProp = NativeStackNavigationProp<RootParamStackList, "AddCategory">;

export default function AddCategoryScreen() {
  // Hooks
  const navigation = useNavigation<NavProp>();
  const addCategory = useCategoryStore((state) => state.addCategory);

  // States
  const [categoryName, setCategoryName] = useState("");

  // Handlers
  function saveButtonOnPress() {
    const validationMessage = validateAddCategoryForm(categoryName);

    if (typeof validationMessage === "string") {
      Alert.alert("Error", validationMessage);
      return;
    }

    addCategory(categoryName);
    navigation.navigate("Tabs", { screen: "Categories" });
    Alert.alert("Success", `${categoryName} added to your list.`);
  }

  return (
    <View style={containers.main}>

      <View style={styles.inputContainer}>
        <Text variant="bodyLarge">
          Category name{" "}
          <Text variant="bodyLarge" style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          value={categoryName}
          mode="flat"
          onChangeText={(e) => setCategoryName(e)}
          placeholder="e.g., Groceries"
        />
      </View>
      <Button
        mode="contained"
        onPress={saveButtonOnPress}
        labelStyle={{ fontSize: 16 }}
      >
        Save
      </Button>

    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: { gap: 8 }
});