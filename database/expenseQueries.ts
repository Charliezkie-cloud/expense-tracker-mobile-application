import {SQLiteDatabase} from "expo-sqlite";
import {logger} from "react-native-logs";

import {CreateExpenseDto, UpdateExpenseDto} from "../types/DTOs/expenseDTOs.types";
import {Category, Expense} from "../types/models.types";
import {convertDateToDateString} from "../libs/converters";
import {generateRandomName} from "../libs/generators";

const log = logger.createLogger();

/**
 * Create a new expense item
 * @param db The SQLiteDatabase Context
 * @param data The data of create expense
 */
export async function createExpense(db: SQLiteDatabase, data: CreateExpenseDto) {
    const date = new Date();
    const dateISOString = date.toISOString();
    const randomName = generateRandomName();

    try {
        if (data.name.trim().length < 1) {
            await db.runAsync(`
                        INSERT INTO "expenses" ("category_id", "name", "quantity", "price", "created_at", "updated_at")
                        VALUES (?, ?, ?, ?, ?, ?)
                `,
                data.category_id,
                randomName,
                data.quantity,
                data.price,
                dateISOString,
                dateISOString
            );
            return;
        }

        await db.runAsync(`
                    INSERT INTO "expenses" ("category_id", "name", "quantity", "price", "created_at", "updated_at")
                    VALUES (?, ?, ?, ?, ?, ?)
            `,
            data.category_id,
            data.name,
            data.quantity,
            data.price,
            dateISOString,
            dateISOString
        );
    } catch (error) {
        log.error({
            error: "createExpense(): Something went wrong while creating an expense.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Get all expenses of a category
 * @param db The SQLiteDatabase context
 * @param categoryId The id of the category
 * @param orderBy Which column to be ordered by
 * @param orderDirection The direction of the order
 */
export async function getAllExpensesOfCategory(
    db: SQLiteDatabase,
    categoryId: number,
    orderBy: "quantity" | "price" | "created_at" | "updated_at" = "created_at",
    orderDirection: "ASC" | "DESC" = "ASC"
) {
    try {
        return await db.getAllAsync<Expense>(`
            SELECT * FROM "expenses"
            WHERE category_id = ?
            ORDER BY ${orderBy} ${orderDirection}
        `, categoryId);
    } catch (error) {
        log.error({
            error: "getAllExpensesOfCategory(): Something went wrong while fetching the category expenses.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Get the sum of expenses in a category
 * @param db The SQLiteDatabase context
 * @param categoryId The id of the category
 */
export async function getTheSumOfExpenses(db: SQLiteDatabase, categoryId: number) {
    try {
        return await db.getFirstAsync<{ total_sum: number }>(`
            SELECT COALESCE(SUM(price * quantity), 0) AS total_sum
            FROM "expenses" WHERE category_id = ?;
        `, categoryId);
    } catch (error) {
        log.error({
            error: "getTheSumOfExpenses(): Something went wrong while summing up the category expenses.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Get the sum of all expenses
 * @param db The SQLiteDatabase context
 */
export async function getTheSumOfAllExpenses(db: SQLiteDatabase) {
    try {
        return await db.getFirstAsync<{ total: number }>(`SELECT SUM(price * quantity) AS total FROM "expenses";`);
    } catch (error) {
        log.error({
            error: "getTheSumOfAllExpenses(): Something went wrong while summing up all the expenses",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Get the expense category details
 * @param db The SQLiteDatabase context
 * @param expenseId The id of the expense
 */
export async function getExpenseCategory(db: SQLiteDatabase, expenseId: number) {
    try {
        return await db.getFirstAsync<Category>(`
            SELECT c.* FROM "expenses" e
                                INNER JOIN "categories" c ON c.id = e.category_id
            WHERE e.id = ?
        `, expenseId);
    } catch (error) {
        log.error({
            error: "getExpenseCategory(): Something went wrong while fetching the expense category.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Get all the recent expenses
 * @param db The SQLiteDatabase context
 * @param orderDirection The diretion of the sort
 * @param limit The limit of the recent expenses
 */
export async function getRecentExpenses(db: SQLiteDatabase, orderDirection: "ASC" | "DESC" = "DESC", limit: number = 5) {
    try {
        return await db.getAllAsync<Expense>(`
            SELECT * FROM "expenses"
            ORDER BY "created_at" ${orderDirection}
            LIMIT ${limit}
        `);
    } catch (error) {
        log.error({
            error: "getRecentExpenses(): Something went wrong while fetching the recent expenses.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Updates the expense by expense ID
 * @param db The SQLiteDatabase context
 * @param data The data of the update expense
 */
export async function updateExpense(db: SQLiteDatabase, data: UpdateExpenseDto) {
    const date = new Date();
    const dateISOString = date.toISOString();
    const randomName = generateRandomName();

    try {
        if (data.name.trim().length < 1) {
            await db.runAsync(`
                        UPDATE "expenses"
                        SET
                            name = ?,
                            quantity = ?,
                            price = ?,
                            updated_at = ?
                        WHERE id = ?
                `,
                randomName,
                data.quantity,
                data.price,
                dateISOString,
                data.id
            );
            return;
        }

        await db.runAsync(`
                    UPDATE "expenses"
                    SET
                        name = ?,
                        quantity = ?,
                        price = ?,
                        updated_at = ?
                    WHERE id = ?
            `,
            data.name,
            data.quantity,
            data.price,
            dateISOString,
            data.id
        );
    } catch (error) {
        log.error({
            error: "updateExpense(): Something went wrong while updating the expense.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Deletes the expenses by expense ID
 * @param db The SQLiteDatabase context
 * @param expenseId The ID of the expense
 */
export async function deleteExpense(db: SQLiteDatabase, expenseId: number) {
    try {
        await db.runAsync(`DELETE FROM "expenses" WHERE id = ?`, expenseId);
    } catch (error) {
        log.error({
            error: "deleteExpense(): Something went wrong while deleting the expense.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}