import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

import { Category, Expense } from "../types/data.types";
import { buildExpense, buildUpdatedExpense } from "../utils/builders";

type ExpenseStore = {
  expenses: Expense[];
  addExpense: (category: Category, quantity: number, price: number, name?: string) => void;
  updateExpense: (expenseId: string, quantity: number, amount: number, name?: string) => void;
  deleteExpense: (expenseId: string) => void;
  deleteCategoryExpenses: (categoryId: string) => void;
  clearAllExpenses: () => void;
};

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      addExpense(category, quantity, amount, name) {
        set((state) => ({
          expenses: [...state.expenses, buildExpense(category, quantity, amount,name)]
        }));
      },
      updateExpense(expenseId, quantity, amount, name) {
        set((state) => ({
          expenses: state.expenses.map((item) =>
            item.id === expenseId ? buildUpdatedExpense(item, quantity, amount, name) : item
          )
        }));
      },
      deleteExpense(expenseId) {
        set((state) => ({
          expenses: state.expenses.filter((item) => item.id !== expenseId)
        }));
      },
      deleteCategoryExpenses(categoryId) {
        set((state) => ({
          expenses: state.expenses.filter((item) => item.category.id !== categoryId)
        })); 
      },
      clearAllExpenses() {
        set({ expenses: [] });
      }
    }),
    {
      name: "expenses",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);