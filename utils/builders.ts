import { v4 } from "react-native-uuid/dist/v4";

import { Budget, Category, Expense } from "../types/data.types";
import { convertDateToDateString } from "./converters";

/**
 * Builds the category item from category name for ya ;D
 * @param name The name of the category
 * @returns The category item with generated UUID
 */
export function buildCategory(name: string): Category {
  const date = new Date();
  
  return {
    id: v4(),
    name: name.trim(),
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  }
}

/**
 * Builds the category item for ya ;D
 * @param category The category object
 * @param name The new name of the category
 * @returns The updated category object
 */
export function buildUpdatedCategory(category: Category, name: string): Category {
  return {
    ...category,
    updatedAt: new Date().toISOString(),
    name: name.trim()
  }
}

/**
 * Builds the expense item from category id, amount and title (optional) for ya ;D
 * @param category The category object
 * @param amount The amount of the expense
 * @param name The name of the expense (optional)
 * @returns The expense with generated UUID
 */
export function buildExpense(category: Category, quantity: number, price: number, name?: string): Expense {
  const date = new Date();
  
  return {
    id: v4(),
    quantity,
    price,
    category,
    name: name?.trim() ?? convertDateToDateString(date),
    createdAt: date.toISOString(),
    updatedAt: date.toISOString()
  }
}

/**
 * Builds the updated expense item from expense ID
 * @param expense The expense object
 * @param amount The new value of the amount
 * @param name The new value of the name
 * @returns The updated expense object
 */
export function buildUpdatedExpense(expense: Expense, quantity: number, price: number, name?: string): Expense {
  const date = new Date();
  
  return {
    ...expense,
    updatedAt: date.toISOString(),
    quantity,
    price,
    name: name?.trim() ?? convertDateToDateString(date)
  }
}

/**
 * Builds the budget object for ya ;D
 * @param category The category object
 * @param amount The amount of the budget
 * @returns The budget object
 */
export function buildBudget(category: Category, amount: number): Budget {
  return { category, amount }
}