import {Alert, FlatList, View} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {Button, Chip, Text, TextInput, useTheme} from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import {
  Utensils, Coffee, Car, Zap, Gamepad2, ShoppingBag, Users, BookOpen,
  TrendingUp, Home, HeartPulse, ShieldAlert, Briefcase, Plane, Sparkles,
  Tv, Dumbbell, Hammer, PawPrint, Landmark, HelpCircle, Gift,
  Scissors, Pizza, Baby, ShieldCheck, ShoppingCart, Wine,
  Wrench, Scale, KeyRound, Construction, Crosshair,
  Activity, GraduationCap, Laptop, PiggyBank, RefreshCw, AlertTriangle, Coins, Heart, Brush, Radio, Ticket
} from 'lucide-react-native';

import { RootParamStackList } from "../../types/navigation.types";
import { validateAddCategoryForm } from "../../libs/validators";
import { getCategoryDetailStyles } from "../../styles/mainStyles";
import { createCategory } from "../../database/categoryQueries";

type NavProp = NativeStackNavigationProp<RootParamStackList, "AddCategory">;

export const CATEGORY_CHIPS = [
  { id: "food", label: "Groceries", icon: Utensils, color: "#EF4444" },
  { id: "dining", label: "Dining Out", icon: Pizza, color: "#F97316" },
  { id: "coffee", label: "Coffee & Snacks", icon: Coffee, color: "#B45309" },
  { id: "transport", label: "Transport", icon: Car, color: "#3B82F6" },
  { id: "utilities", label: "Bills & Utilities", icon: Zap, color: "#EAB308" },
  { id: "housing", label: "Rent & Mortgage", icon: Home, color: "#6366F1" },
  { id: "entertainment", label: "Gaming & Fun", icon: Gamepad2, color: "#8B5CF6" },
  { id: "streaming", label: "Subscriptions", icon: Tv, color: "#EC4899" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, color: "#14B8A6" },
  { id: "social", label: "Socializing", icon: Users, color: "#F43F5E" },
  { id: "hobbies", label: "Hobbies & Crafts", icon: Sparkles, color: "#A855F7" },
  { id: "travel", label: "Travel & Vacation", icon: Plane, color: "#06B6D4" },
  { id: "health", label: "Medical & Pharmacy", icon: HeartPulse, color: "#10B981" },
  { id: "fitness", label: "Gym & Fitness", icon: Dumbbell, color: "#059669" },
  { id: "grooming", label: "Personal Care", icon: Scissors, color: "#D946EF" },
  { id: "pets", label: "Pet Care", icon: PawPrint, color: "#84CC16" },
  { id: "education", label: "Learning & Books", icon: BookOpen, color: "#2563EB" },
  { id: "work", label: "Work & Business", icon: Briefcase, color: "#475569" },
  { id: "savings", label: "Savings & Deposits", icon: PiggyBank, color: "#22C55E" },
  { id: "taxes", label: "Taxes & Levies", icon: Landmark, color: "#64748B" },
  { id: "emergency", label: "Emergency Fund", icon: ShieldAlert, color: "#DC2626" },
  { id: "maintenance", label: "Home Repairs", icon: Hammer, color: "#78350F" },
  { id: "gifts", label: "Gifts & Donations", icon: Gift, color: "#FB7185" },
  { id: "baby", label: "Baby & Childcare", icon: Baby, color: "#F472B6" },
  { id: "insurance", label: "Insurance", icon: ShieldCheck, color: "#0EA5E9" },
  { id: "clothing", label: "Apparel & Shoes", icon: ShoppingCart, color: "#EC4899" },
  { id: "vices", label: "Alcohol & Tobacco", icon: Wine, color: "#9F1239" },
  { id: "car-maintenance", label: "Vehicle Repair", icon: Wrench, color: "#475569" },
  { id: "legal", label: "Legal & Professional", icon: Scale, color: "#1E3A8A" },
  { id: "investing", label: "Stocks & Crypto", icon: TrendingUp, color: "#15803D" },
  { id: "rentals", label: "Storage & Rentals", icon: KeyRound, color: "#7C3AED" },
  { id: "tuition", label: "School Fees & Tuition", icon: GraduationCap, color: "#1D4ED8" },
  { id: "gadgets", label: "Electronics & Tech", icon: Laptop, color: "#0F172A" },
  { id: "charity", label: "Alms & Charity", icon: Heart, color: "#BE123C" },
  { id: "creative", label: "Art & Design Gear", icon: Brush, color: "#C026D3" },
  { id: "concerts", label: "Events & Tickets", icon: Ticket, color: "#EA580C" },
  { id: "laundry", label: "Dry Cleaning", icon: RefreshCw, color: "#06B6D4" },
  { id: "debt", label: "Loan Repayment", icon: Coins, color: "#B45309" },
  { id: "supplements", label: "Vitamins & Health", icon: Activity, color: "#047857" },
  { id: "unplanned", label: "Spontaneous Spends", icon: AlertTriangle, color: "#EAB308" },
  { id: "cinema", label: "Movies & Theater", icon: Radio, color: "#701A75" },
  { id: "renovation", label: "Home Improvement", icon: Construction, color: "#CA8A04" },
  { id: "hunting", label: "Outdoor & Camping", icon: Crosshair, color: "#166534" },
  // { id: "other", label: "Others", icon: HelpCircle, color: "#94A3B8" }
];

export default function AddCategoryScreen() {
  // Hooks
  const db = useSQLiteContext();
  const navigation = useNavigation<NavProp>();
  const theme = useTheme();
  const styles = getCategoryDetailStyles(theme);

  // States
  const [categoryName, setCategoryName] = useState("");
  const [categoryChips, setCategoryChips] = useState(CATEGORY_CHIPS);

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

  function categoryNameOnChangeText(e: string) {
    setCategoryName(e);

    const lowerCaseInput = e.toLowerCase();

    if (lowerCaseInput === "")
      return setCategoryChips(CATEGORY_CHIPS);

    setCategoryChips([
      ...CATEGORY_CHIPS.filter((item) =>
        item.id.includes(lowerCaseInput) || item.label.toLowerCase().includes(lowerCaseInput)
      ),
      { id: "others", label: "Others", icon: HelpCircle, color: "#94A3B8" }
    ]);
  }

  function selectedSuggestion(item: string) {
    setCategoryName(item);
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
          onChangeText={categoryNameOnChangeText}
          placeholder="e.g., Groceries"
        />
      </View>

      <View style={styles.suggestionsContainer}>
        <Text variant="bodyMedium">Suggestions</Text>
        <FlatList
            style={styles.suggestionsList}
            data={categoryChips}
            renderItem={({ item }) => (
                <Chip
                    style={styles.suggestionsListItem}
                    icon={({ size }) => (
                        <item.icon size={size} color={item.color} />
                    )}
                    onPress={() => selectedSuggestion(item.label)}
                >
                  {item.label}
                </Chip>
            )}
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