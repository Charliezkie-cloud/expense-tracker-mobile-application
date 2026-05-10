/**
 * Validator for add category form ;D
 * @param categoryName The name of the category
 * @returns The message of the invalid field or false for valid
 */
export function validateAddCategoryForm(categoryName: string): string | boolean {
  if (categoryName.trim().length < 1)
    return "Category name is required.";

  return false;
}

/**
 * Validator for add expense form ;D
 * @param categoryId The ID of the category
 * @param amount The amount of the expense
 * @param name The name of the expense (optional)
 * @returns The message of invalid or false for valid
 */
export function validateAddExpenseForm(quantity: number, price: string, name: string): string | boolean {
  if (quantity < 1)
    return "Quantity is required.";
  if (isNaN(quantity))
    return "Please use whole numbers only (e.g., 3).";
  if (quantity <= 0)
    return "Quantity must be greater than zero.";

  if (price.trim().length < 1)
    return "Price is required.";
  const parsedPrice = Number.parseFloat(price);
  if (isNaN(parsedPrice))
    return "Please use numbers only (e.g., 50.00).";
  if (parsedPrice <= 0)
    return "Price must be greater than zero.";

  return false;
}

/**
 * Validator for edit expense form
 * @param amount The amount of the new expense
 * @returns The message of invalid or false for valid
 */
export function validateEditExpenseForm(quantity: number, price: string): string | boolean {
  if (quantity < 1)
    return "Quantity is required.";
  if (isNaN(quantity))
    return "Please use whole numbers only (e.g., 3).";
  if (quantity <= 0)
    return "Quantity must be greater than zero.";
  
  if (price.trim().length < 1)
    return "Price is required.";
  const parsedPrice = Number.parseFloat(price);
  if (isNaN(parsedPrice))
    return "Please use numbers only (e.g., 50.00).";
  if (parsedPrice <= 0)
    return "Price must be greater than zero.";

  return false;
}

/**
 * Validator for add budget form
 * @param amount The amount of the budget
 * @returns The message of invalid or false for valid
 */
export function validateAddBudgetForm(amount: string): string | boolean {
  const parsedAmount = Number.parseFloat(amount);
  if (isNaN(parsedAmount))
    return "Please use numbers only (e.g., 50.00).";
  if (parsedAmount <= 0)
    return "Amount must be greater than zero.";

  return false;
}