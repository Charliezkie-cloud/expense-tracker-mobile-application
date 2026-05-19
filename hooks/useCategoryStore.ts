import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Category } from "../types/data.types";
import { buildCategory, buildUpdatedCategory } from "../utils/builders";

type CategoryStore = {
  categories: Category[],
  addCategory: (name: string) => void;
  updateCategory: (categoryId: string, name: string) => void;
  deleteCategory: (categoryId: string) => void;
  clearAllCategories: () => void;
};

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      categories: [],
      addCategory(name) {
        set((state) => ({
          categories: [...state.categories, buildCategory(name)]
        }));
      },
      updateCategory(categoryId, name) {
        set((state) => ({
          categories: state.categories.map(item =>
            item.id === categoryId ? buildUpdatedCategory(item, name) : item
          )
        }));
      },
      deleteCategory(categoryId) {
        set((state) => ({
          categories: state.categories.filter((item) => item.id !== categoryId)
        }));
      },
      clearAllCategories() {
        set({ categories: [] });
      },
    }),
    {
      name: "categories",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);