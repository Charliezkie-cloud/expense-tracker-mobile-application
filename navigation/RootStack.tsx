import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, List } from "lucide-react-native";

import { RootParamStackList, TabParamStackList } from "../types/navigation.types";
import HomeScreen from "../screens/HomeScreen";
import CategoriesScreen from "../screens/category/CategoriesScreen";
import AddCategoryScreen from "../screens/category/AddCategoryScreen";
import CategoryScreen from "../screens/category/CategoryScreen";
import EditExpenseScreen from "../screens/expense/EditExpenseScreen";
import CategorySetBudgetScreen from "../screens/category/CategorySetBudgetScreen";
import EditCategoryScreen from "../screens/category/EditCategoryScreen";
import CategoryAddExpenseScreen from "../screens/expense/CategoryAddExpenseScreen";

const Stack = createNativeStackNavigator<RootParamStackList>();
const Tab = createBottomTabNavigator<TabParamStackList>();

function Tabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Dashboard",
          headerShadowVisible: false,
          tabBarIcon: (({ color, size }) => (
            <Home color={color} size={size} />
          ))
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          headerShadowVisible: false,
          headerTitle: "My Categories",
          tabBarIcon: (({ color, size }) => (
            <List color={color} size={size} />
          ))
        }}
      />
    </Tab.Navigator>
  )
}

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      
      {/* Non-tabs Screens */}
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{
          title: "Add Category",
          headerShadowVisible: false
        }}
      />
      <Stack.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{
          title: "Edit Category",
          headerShadowVisible: false
        }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={(({ route }) => ({
          headerTitle: `${route.params.name} Expenses`,
          headerShadowVisible: false
        }))}
      />
      <Stack.Screen
        name="CategoryAddExpense"
        component={CategoryAddExpenseScreen}
        options={(({ route }) => ({
          headerTitle: `Add ${route.params.name} Expense`,
          headerShadowVisible: false
        }))}
      />
      <Stack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={(({ route }) => ({
          headerTitle: `Edit ${route.params.name} Expense`,
          headerShadowVisible: false
        }))}
      />
      <Stack.Screen
        name="CategorySetBudget"
        component={CategorySetBudgetScreen}
        options={(({ route }) => ({
          headerTitle: `Set ${route.params.name} Budget`,
          headerShadowVisible: false
        }))}
      />
    </Stack.Navigator>
  )
}