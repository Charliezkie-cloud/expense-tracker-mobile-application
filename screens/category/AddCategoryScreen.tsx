import { Alert, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

import { RootParamStackList } from "../../types/navigation.types";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { validateAddCategoryForm } from "../../utils/validators";
import { getCategoryDetailStyles } from "../../styles/theme";

type NavProp = NativeStackNavigationProp<RootParamStackList, "AddCategory">;

export default function AddCategoryScreen() {
  // Hooks
  const navigation = useNavigation<NavProp>();
  const addCategory = useCategoryStore((state) => state.addCategory);
  const theme = useTheme();
  const styles = getCategoryDetailStyles(theme);

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
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text variant="bodyLarge" style={styles.inputLabel}>
          Category name <Text style={{ color: theme.colors.error }}>*</Text>
        </Text>
        <TextInput
          value={categoryName}
          mode="outlined"
          style={styles.textInput}
          onChangeText={(e) => setCategoryName(e)}
          placeholder="e.g., Groceries"
        />
      </View>
      
      <Button
        mode="contained"
        style={styles.formButton}
        labelStyle={{ fontSize: 16, fontWeight: "600" }}
        onPress={saveButtonOnPress}
      >
        Save Category
      </Button>
    </View>
  );
}