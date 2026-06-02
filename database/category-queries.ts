import { logger } from "react-native-logs";
import { SQLiteDatabase } from "expo-sqlite";

import { CreateCategoryDto, UpdateCategoryDto } from "../types/DTOs/categoryDTOs.types";
import { Category } from "../types/models.types";

const log = logger.createLogger();

/**
 * Inserts a category into categories table
 * @param db The SQLiteDatabase context
 * @param data The data
 */
export async function createCategory(db: SQLiteDatabase, data: CreateCategoryDto) {
    const dateNow = new Date().toISOString();

    try {
        await db.runAsync(`
            INSERT INTO "categories" ("name", "created_at", "updated_at")
            VALUES (?, ?, ?)
        `,
            data.name,
            dateNow,
            dateNow
        );
    } catch (error) {
        log.error({
            error: "createCategory(): Something went wrong while creating a row.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Gets all the categories
 * @param db The SQLiteDatabase context
 * @param orderBy The column to order by
 * @param orderDirection The direction of the order
 * @param limit The limit of each page
 * @param offset The offset of the page
 */
export async function getAllCategories(
    db: SQLiteDatabase,
    orderBy: "created_at" | "updated_at" = "updated_at",
    orderDirection: "ASC" | "DESC" = "DESC",
    limit: number,
    offset: number
) {
    try {
        return await db.getAllAsync<Category>(`
            SELECT * FROM "categories"
            ORDER BY ${orderBy} ${orderDirection}
            LIMIT ? OFFSET ?;
        `, limit, offset);
    } catch (error) {
        log.error({
            error: "getAllCategories(): Something went wrong while fetching a row.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Get the recent categories
 * @param db The SQLiteDatabase context
 * @param orderDirection The direction of the order
 * @param limit The limit of the recent categories
 */
export async function getRecentCategories(db: SQLiteDatabase, orderDirection: "ASC" | "DESC" = "DESC", limit: number = 5) {
    try {
        return await db.getAllAsync<Category>(`
            SELECT * FROM "categories"
            ORDER BY "created_at" ${orderDirection}
            LIMIT ?
        `, [limit]);
    } catch (error) {
        log.error({
            error: "getRecentCategories(): Something went wrong while fetching the recent categories.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Updates the category by ID
 * @param db The SQLiteDatabase context
 * @param data The new category data
 */
export async function updateCategory(db: SQLiteDatabase, data: UpdateCategoryDto) {
    const dateNow = new Date().toISOString();

    try {
        await db.runAsync(`
            UPDATE "categories"
            SET name = ?,
                updated_at = ?
            WHERE id = ?;
        `,
            data.name,
            dateNow,
            data.id
        );
    } catch (error) {
        log.error({
            error: "updateCategory(): Something went wrong while updating a row.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

/**
 * Deletes the category by ID
 * @param db The SQLiteDatabase Context
 * @param categoryId The id of the category
 */
export async function deleteCategory(db: SQLiteDatabase, categoryId: number) {
    try {
        await db.runAsync(`DELETE FROM "categories" WHERE id = ?`, categoryId);
    } catch (error) {
        log.error({
            error: "deleteCategory(): Something went wrong while deleting a row.",
            details: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}