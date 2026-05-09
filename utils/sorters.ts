import { Expense } from "../types/data.types";

/**
 * Sorts the expenses object for ya ;D
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
      result = a[property].localeCompare(b[property]);

    return order === "ascending" ? result : -result;
  });
}