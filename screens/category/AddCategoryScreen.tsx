import { Alert, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";

import { RootParamStackList } from "../../types/navigation.types";
import { validateAddCategoryForm } from "../../utils/validators";
import { getCategoryDetailStyles } from "../../styles/mainStyles";
import { createCategory } from "../../database/categoryQueries";

type NavProp = NativeStackNavigationProp<RootParamStackList, "AddCategory">;

export default function AddCategoryScreen() {
  // Hooks
  const db = useSQLiteContext();
  const navigation = useNavigation<NavProp>();
  const theme = useTheme();
  const styles = getCategoryDetailStyles(theme);

  // States
  const [categoryName, setCategoryName] = useState("");

  // Handlers
  async function saveButtonOnPress() {
    const validationMessage = validateAddCategoryForm(categoryName);

    if (typeof validationMessage === "string")
      return Alert.alert("Error", validationMessage);

    try {
      await createCategory(db, { name: categoryName.trim() });

      navigation.navigate("Tabs", { screen: "Categories" });
      Alert.alert("Success", `${categoryName} added to your list.`);
    } catch (error) {
      Alert.alert("Error", "Something went wrong while create a new category");
    }
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