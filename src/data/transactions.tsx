
export interface TransactionI {
      type: string;
      concept: string;
      category: string;
      amount: number;
  }

export const transactions: Array<TransactionI> = [
  {
    type: "income",
    concept: "Sold clothes from Temu",
    category: "Sellings",
    amount: 56,
  },
  {
    type: "outcome",
    concept: "Bought new headphones",
    category: "Tech",
    amount: 130,
  },
  {
    type: "outcome",
    concept: "Went to a Restaurant",
    category: "Food",
    amount: 24,
  },
];