import { FlatList, StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChevronRight, Plus } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { containers } from "../../styles/containers";
import { RootParamStackList } from "../../types/navigation.types";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import { Category } from "../../types/data.types"
import { convertDateToDateString } from "../../utils/converters";
import { useEffect } from "react";

type NavProps = NativeStackNavigationProp<RootParamStackList, "AddCategory">;

export default function CategoriesScreen() {
  // Hooks
  const navigation = useNavigation<NavProps>();
  const categories = useCategoryStore((state) => state.categories);

  // Handlers
  function addCategoryButtonOnPress() {
    navigation.navigate("AddCategory");
  }

  function listItemButtonOnPress(category: Category) {
    navigation.navigate("Category", category)
  }

  return (
    <View style={styles.mainContainer}>

      {/* List */}
      <FlatList
        data={categories}
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
            style={{
              backgroundColor: "#e5e7eb",
              borderRadius: 999,
              marginBottom: 8
            }}
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