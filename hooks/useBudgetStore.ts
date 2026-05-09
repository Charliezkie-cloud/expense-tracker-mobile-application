import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Budget, Category } from "../types/data.types"
import { buildBudget } from "../utils/builders";

type BudgeStore = {
  budgets: Budget[];
  setBudget: (category: Category, amount: number) => void;
  deleteBudget: (category: Category) => void;
};

export const useBudgetStore = create<BudgeStore>()(
  persist(
    (set) => ({
      budgets: [],
      setBudget(category, amount) {
        set((state) => ({
          budgets: state.budgets.filter(e => e.category.id !== category.id)
        }));

        set((state) => ({
          budgets: [...state.budgets, buildBudget(category, amount)]
        }));
      },
      deleteBudget(category) {
        set((state) => ({
          budgets: state.budgets.filter(e => e.category.id !== category.id)
        }));
      }
    }),
    {
      name: "budgets",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);