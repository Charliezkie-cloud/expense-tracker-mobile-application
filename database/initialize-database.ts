import { logger } from "react-native-logs";
import { SQLiteDatabase } from "expo-sqlite";

const log = logger.createLogger();

export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    await db.execAsync("PRAGMA foreign_keys = ON;");
    await db.execAsync("PRAGMA journal_mode = WAL;");
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS "categories"
        (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "name" TEXT NOT NULL,
            "created_at" TEXT NOT NULL,
            "updated_at" TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "budgets"
        (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "category_id" INTEGER NOT NULL UNIQUE,
            "budget" INTEGER NOT NULL,
            CONSTRAINT "fk_budget_category"
            FOREIGN KEY ("category_id") REFERENCES categories ("id")
            ON DELETE CASCADE
            );

        CREATE TABLE IF NOT EXISTS "expenses"
        (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "category_id" INTEGER NOT NULL,
            "name" TEXT NOT NULL,
            "quantity" INTEGER NOT NULL,
            "price" INTEGER NOT NULL,
            "created_at" TEXT NOT NULL,
            "updated_at" TEXT NOT NULL,
            CONSTRAINT "fk_expense_category"
            FOREIGN KEY ("category_id") REFERENCES categories ("id")
            ON DELETE CASCADE
            );
    `);

    log.info({ success: "The sqlite database has been succesfully initialized!" });
  } catch (error) {
    log.error({
      error: "initializeDatabase(): Something went wrong while initializing the sqlite database",
      details: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}