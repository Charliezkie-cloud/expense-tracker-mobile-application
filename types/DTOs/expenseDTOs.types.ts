export type CreateExpenseDto = {
    category_id: number;
    name: string;
    quantity: number;
    price: number;
};

export type UpdateExpenseDto = {
    id: number;
    name: string;
    quantity: number;
    price: number;
};