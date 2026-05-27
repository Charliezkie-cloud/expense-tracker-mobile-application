import { SQLiteDatabase } from "expo-sqlite";
import { logger } from "react-native-logs";

import { SetBudgetDto } from "../types/DTOs/budgetDTOs.types";
import {Budget} from "../types/models.types";

const log = logger.createLogger();

/**
 * Sets the budget
 * @param db The SQLiteDatabase context
 * @param data The data of the set budget
 */
export async function setBudget(db: SQLiteDatabase, data: SetBudgetDto) {
    try {
        await db.runAsync(`
            INSERT INTO budgets ("category_id", "budget")
            VALUES (?, ?)
            ON CONFLICT ("category_id") DO UPDATE
               SET "budget" = excluded.budget;
        `, data.category_id, data.budget);
    } catch (error) {
        log.error({
            error: "setBudget(): Something went wrong while setting the budget.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Checks if budget already existed!
 * @param db The SQLiteDatabase Context
 * @param categoryId The category id of the budget
 */
export async function isBudgetExists(db: SQLiteDatabase, categoryId: number) {
    try {
        const res = await db.getFirstAsync<{ isExists: number }>(`SELECT EXISTS (SELECT 1 FROM budgets WHERE category_id = ?) as isExists`, categoryId);
        return res?.isExists === 1;
    } catch (error) {
        log.error({
            error: "isBudgetExists(): Something went wrong while checking the budget.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Get the budget by category id
 * @param db The SQLiteDatabase context
 * @param categoryId The id of the category
 */
export async function getBudget(db: SQLiteDatabase, categoryId: number) {
    try {
        return await db.getFirstAsync<Budget>(`SELECT * FROM budgets WHERE category_id = ?`, categoryId);
    } catch (error) {
        log.error({
            error: "getBudget(): Something went wrong while fetching the budget.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Get the sum of all the budgets
 * @param db The SQLiteDatabase context
 */
export async function getTheSumOfAllBudgets(db: SQLiteDatabase) {
    try {
        return await db.getFirstAsync<{ total: number }>(`SELECT SUM(budget) as total FROM "budgets";`);
    } catch (error) {
        log.error({
            error: "getTheSumOfAllBudgets(): Something went wrong while summing up all the budget.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

export async function getCategoriesBudgetProgress(db: SQLiteDatabase) {
    try {
        return await db.getAllAsync<{
            budget_percentage: number,
            category_name: string
        }>(`
            SELECT
                (SUM(e.price * e.quantity) * 1.0) / b.budget AS budget_percentage,
                c.name AS category_name
            FROM "categories" c
            INNER JOIN "budgets" b ON b.category_id = c.id
            INNER JOIN "expenses" e ON e.category_id = c.id
            GROUP BY c.id, b.budget
            ORDER BY budget_percentage DESC
            LIMIT 5
        `);
    } catch (error) {
        log.error({
            error: "getCategoriesBudgetProgress(): Something went wrong while fetching the categories budgets progress",
            details: error
        });
        throw error;
    }
}

/**
 * Deletes the budget by category id
 * @param db The SQLiteDatabase context
 * @param categoryId The id of the category
 */
export async function deleteBudget(db: SQLiteDatabase, categoryId: number) {
    try {
        await db.runAsync(`DELETE FROM "budgets" WHERE category_id = ?`, categoryId);
    } catch (error) {
        log.error({
            error: "deleteBudget(): Something went wrong while deleting the budget.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}