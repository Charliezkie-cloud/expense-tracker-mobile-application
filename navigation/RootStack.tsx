import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, List, Settings } from "lucide-react-native";
import { useTheme } from "react-native-paper";

import { RootParamStackList, TabParamStackList } from "../types/navigation.types";
import HomeScreen from "../screens/HomeScreen";
import CategoriesScreen from "../screens/category/CategoriesScreen";
import AddCategoryScreen from "../screens/category/AddCategoryScreen";
import CategoryScreen from "../screens/category/CategoryScreen";
import EditExpenseScreen from "../screens/expense/EditExpenseScreen";
import CategorySetBudgetScreen from "../screens/category/CategorySetBudgetScreen";
import EditCategoryScreen from "../screens/category/EditCategoryScreen";
import CategoryAddExpenseScreen from "../screens/expense/CategoryAddExpenseScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator<RootParamStackList>();
const Tab = createBottomTabNavigator<TabParamStackList>();

// Styled Tabs Component
function Tabs() {
  const theme = useTheme(); // Hook to fetch the active color settings

  return (
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShadowVisible: false,
        // Match the top navbar to your active theme
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          color: theme.colors.onSurface,
          fontWeight: "700",
        },
        // Match the bottom tab bar to your active theme
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
          borderTopWidth: 1,
          height: 60,
          // paddingBottom: 8,
          // paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 12,
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Dashboard",
          tabBarIcon: (({ color, size }) => (
            <Home color={color} size={size - 2} />
          ))
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: "Categories",
          tabBarIcon: (({ color, size }) => (
            <List color={color} size={size - 2} />
          ))
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          tabBarIcon: (({ color, size }) => (
            <Settings color={color} size={size - 2} />
          ))
        }}
      />
    </Tab.Navigator>
  );
}

// Master Root Stack Component
export default function RootStack() {
  const theme = useTheme(); // Dynamic theme implementation for full screens

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          color: theme.colors.onSurface,
          fontWeight: "700",
        },
        headerTintColor: theme.colors.primary, // Updates back button arrow colors automatically
      }}
    >
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
        }}
      />
      <Stack.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{
          title: "Edit Category",
        }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={(({ route }) => ({
          headerTitle: `${route.params.name} Expenses`,
        }))}
      />
      <Stack.Screen
        name="CategoryAddExpense"
        component={CategoryAddExpenseScreen}
        options={(({ route }) => ({
          headerTitle: `Add ${route.params.name} Expense`,
        }))}
      />
      <Stack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={(({ route }) => ({
          headerTitle: `Edit ${route.params.name} Expense`,
        }))}
      />
      <Stack.Screen
        name="CategorySetBudget"
        component={CategorySetBudgetScreen}
        options={(({ route }) => ({
          headerTitle: `Set ${route.params.name} Budget`,
        }))}
      />
    </Stack.Navigator>
  );
}