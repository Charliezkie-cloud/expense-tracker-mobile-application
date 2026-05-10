import { Category, Expense } from "../types/data.types";

/**
 * Sorts the expenses array for ya ;D
 * @param expenses The array of expenses object
 * @param property The propert you want to sort
 * @param order The order of the sort
 * @returns The sorted array of expenses object ;D
 */
export function sortExpenses(
    expenses: Expense[],
    property: "price" | "quantity" | "createdAt" | "updatedAt",
    order: "ascending" | "descending"
  ): Expense[] {
  const sorted = [...expenses];

  return sorted.sort((a, b) => {
    let result = 0;

    if (property === "price" || property === "quantity")
      result = a[property] - b[property];
    else
      result = new Date(a[property]).getTime() - new Date(b[property]).getTime();

    return order === "ascending" ? result : -result;
  });
}

/**
 * Sorts the categories array for ya ;D
 * @param categories An array of category object
 * @param property The property you want to sort by
 * @param order The order of the sort
 * @returns The sorted array of category object
 */
export function sortCategories(
  categories: Category[],
  property: "createdAt" | "updatedAt",
  order: "ascending" | "descending"
) {
  const sorted = [...categories];

  return sorted.sort((a, b) => {
    let result = 0;

    result = new Date(a[property]).getTime() - new Date(b[property]).getTime();

    return order === "ascending" ? result : -result;
  });
}