export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Expense = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
};

export type Budget = {
  category: Category;
  amount: number;
}