export interface TransactionContextProps {
    transactions: TransactionList | null;
    monthData: MonthData | null;
    addTransaction: (transaction: Transaction) => void;
    loadTransactions: (date: Date) => void;
}

export type TransactionList = {
    [key: string]: Transaction[];
};

export type Transaction = {
    id?: number;
    date: string;
    name: string;
    cost: number;
    desc?: string;
};

export type MonthData = {
    id?: number;
    date: string;
    balance: number;
};
