import { NavigatorScreenParams } from "@react-navigation/native";

import { Category, Expense, ScannedExpense } from "./models.types";

export type RootParamStackList = {
  Tabs: NavigatorScreenParams<TabParamStackList>;

  AddCategory: undefined;
  EditCategory: Category;
  Category: Category;
  AddExpense: ScannedExpense[] | undefined;
  CategoryAddExpense: Category;
  EditExpense: Expense;
  CategorySetBudget: Category;
};

export type TabParamStackList = {
  Home: undefined;
  Categories: undefined;
  Camera: undefined;
  Settings: undefined;
  Expenses: undefined;
};