export type Category = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Budget = {
  id: number;
  category_id: number;
  budget: number;
};

export type Expense = {
  id: number;
  category_id: number;
  name: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
};