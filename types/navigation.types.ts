import { NavigatorScreenParams } from "@react-navigation/native";

import { Category, Expense } from "./data.types";

export type RootParamStackList = {
  Tabs: NavigatorScreenParams<TabParamStackList>;
  
  AddCategory: undefined;
  EditCategory: Category;
  Category: Category;
  CategoryAddExpense: Category;
  EditExpense: Expense;
  CategorySetBudget: Category;
};

export type TabParamStackList = {
  Home: undefined;
  Categories: undefined;
};