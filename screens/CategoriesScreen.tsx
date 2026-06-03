import { Alert, FlatList, TouchableOpacity, View, Modal, StyleSheet, ActivityIndicator } from "react-native";
import { Button, FAB, Text, useTheme } from "react-native-paper";
import {useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChevronRight, SlidersHorizontal } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { RootParamStackList } from "../types/navigation.types";
import { convertDateToDateString } from "../libs/converters.lib";
import { getCategoriesStyles } from "../styles/screen-styles";
import { Category } from "../types/models.types";
import { getAllCategories } from "../database/category-queries";
import { getCategoryIconAndColor, getRgbaColor } from "../libs/helpers.lib";

type NavProps = NativeStackNavigationProp<RootParamStackList, "AddCategory">;

const PAGE_SIZE = 10;

export default function CategoriesScreen() {
  // Hooks
  const db = useSQLiteContext();
  const navigation = useNavigation<NavProps>();

  // Theme & Styles
  const theme = useTheme();
  const styles = getCategoriesStyles(theme);

  // States
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [sortingModal, setSortingModal] = useState(false);
  const [sortBySelectedItem, setSortBySelectedItem] = useState<"created_at" | "updated_at">("created_at");
  const [sortOrderSelectedItem, setSortOrderSelectedItem] = useState<"ASC" | "DESC">("DESC");

  // Handlers
  function addCategoryButtonOnPress() {
    navigation.navigate("AddCategory");
  }

  function toggleSortingModal() {
    setSortingModal(prev => !prev);
  }

  async function applySortingButtonOnPress() {
    setFilteredCategories([]);
    fetchCategories(0, true);
    setSortingModal(false);
  }

  function listItemButtonOnPress(category: Category) {
    navigation.navigate("Category", category);
  }

  // Helpers
  async function fetchCategories(targetPage: number = 0, cleanStart = false) {
    if (loading || (!hasMore && !cleanStart)) return;
    setLoading(true);

    try {
      const offset = targetPage * PAGE_SIZE;
      const res = await getAllCategories(db, sortBySelectedItem, sortOrderSelectedItem, PAGE_SIZE, offset);

      if (res.length < PAGE_SIZE)
        setHasMore(false);
      else
        setHasMore(true);

      setFilteredCategories(prev => [...prev, ...res]);
      setPage(targetPage + 1);
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching the categories.");
    } finally {
      setLoading(false);
    }
  }

  // Use effects
  useFocusEffect(
    useCallback(() => {
      setFilteredCategories([]);
      fetchCategories(0, true);
    }, [])
  );

  return (
    <View style={styles.mainContainer}>
      {/* Ambient liquid orbs background */}
      <View style={styles.categoryLiquidShape1} />
      <View style={styles.categoryLiquidShape2} />
      <View style={styles.categoryLiquidShape3} />
      <View style={styles.categoryGlassOverlay} />

      {/* iOS Segment Sort Header */}
      <View style={styles.sortActiveHeader}>
        <View style={styles.sortStatusGroup}>
          <Text variant="labelMedium" style={styles.sortStatusLabel}>Sort:</Text>
          <View style={styles.sortBadge}>
            <Text variant="labelSmall" style={styles.sortBadgeText}>
              {sortBySelectedItem === "created_at" ? "Created" : "Updated"} • {sortOrderSelectedItem === "ASC" ? "Asc" : "Desc"}
            </Text>
          </View>
        </View>

        <Button
          mode="text"
          compact
          onPress={toggleSortingModal}
          style={styles.sortButton}
          labelStyle={styles.sortButtonLabel}
          icon={(props) => (
            <SlidersHorizontal color={props.color} size={13} />
          )}
        >
          Sort & Filter
        </Button>
      </View>

      {/* Sorting modal acting as iOS Interactive Bottom Sheet */}
      <Modal
        visible={sortingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleSortingModal}
      >
        <View style={[styles.modalBackdrop, { flex: 1 }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={toggleSortingModal}
          />
          <View style={styles.modalContent}>
            {/* Bottom Sheet grab-handle pull representation */}
            <View style={styles.sheetHandle} />

            <Text variant="headlineSmall" style={styles.modalTitle}>Category Sorting</Text>

            <View style={styles.pickerContainer}>
              <Text variant="bodyMedium" style={styles.pickerLabel}>Sort by</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  dropdownIconColor={theme.colors.onSurfaceVariant}
                  selectedValue={sortBySelectedItem}
                  onValueChange={(e) => setSortBySelectedItem(e as "created_at" | "updated_at")}
                >
                  <Picker.Item label="Creation Date & Time" value="created_at" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                  <Picker.Item label="Updation Date & Time" value="updated_at" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
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
                  onValueChange={(e) => setSortOrderSelectedItem(e as "ASC" | "DESC")}
                >
                  <Picker.Item label="Ascending" value="ASC" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                  <Picker.Item label="Descending" value="DESC" color={theme.colors.onSurface} style={{ backgroundColor: theme.dark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)" }} />
                </Picker>
              </View>
            </View>

            <View style={styles.modalButtonsContainer}>
              <Button
                mode="contained"
                labelStyle={{ fontWeight: "700" }}
                onPress={applySortingButtonOnPress}
              >
                Apply Sorting
              </Button>
              <Button
                mode="text"
                labelStyle={{ fontWeight: "600" }}
                onPress={toggleSortingModal}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category list wrapped in premium iOS container layout */}
      {filteredCategories && filteredCategories.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={filteredCategories}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const { Icon, color } = getCategoryIconAndColor(item.name);
              const customBg = getRgbaColor(color, 0.08);
              const customBorder = getRgbaColor(color, 0.2);

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => listItemButtonOnPress(item)}
                  style={styles.listItemWrapper}
                >
                  <View style={styles.listItemInner}>
                    <View style={[styles.iconWrapper, { backgroundColor: customBg, borderColor: customBorder }]}>
                      <Icon size={18} color={color} />
                    </View>

                    <View style={styles.itemTextContainer}>
                      <Text variant="bodyLarge" style={styles.itemTitleText}>{item.name}</Text>
                      <Text variant="bodySmall" style={styles.itemDescriptionText}>
                        Created: {convertDateToDateString(new Date(item.created_at))}
                      </Text>
                    </View>

                    <View style={styles.chevronWrapper}>
                      <ChevronRight color={theme.colors.onSurfaceVariant} size={15} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={() => (
              loading ? <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary} /> : null
            )}
            onEndReached={() => fetchCategories(page)}
            onEndReachedThreshold={0.2}
          />
        </View>
      ) : (<></>)}

      {loading ? (
        <ActivityIndicator style={{ marginVertical: 15 }} color={theme.colors.primary} />
      ) : filteredCategories.length < 1 && (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Create your first category to get started.
          </Text>
        </View>
      )}

      {/* Bottom Actions Container */}
      <View style={styles.buttonsContainer}>
        <FAB mode="flat" icon="plus" onPress={addCategoryButtonOnPress} variant="primary" style={{ borderRadius: 30 }} />
      </View>
    </View>
  );
}
