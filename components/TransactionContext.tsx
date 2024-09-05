import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

interface TransactionContextProps {
    transactions: TransactionList | null;
    addTransaction: any;
}

type TransactionList = {
    [key: string]: Transaction[];
};

type Transaction = {
    id: number;
    date: string;
    name: string;
    cost: number;
    desc?: string;
};

const TransactionContext = createContext<TransactionContextProps | null>(null);

export const useTransactions = () => {
    const transactionsContext = useContext(TransactionContext);

    if (transactionsContext === null) {
        throw new Error("Context error");
    }

    return transactionsContext;
};

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<TransactionList | null>(null);
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

    useEffect(() => {
        const loadDatabase = async () => {
            const database = await SQLite.openDatabaseAsync("database");

            setDb(database);

            await database.execAsync(`
                CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY NOT NULL, date TEXT NOT NULL, name TEXT NOT NULL, cost REAL NOT NULL, desc TEXT);
            `);

            databaseSelect(database);
        };

        loadDatabase();
    }, []);

    const databaseAdd = async (transaction: Transaction) => {
        if (!db) {
            return;
        }

        const { date, name, cost, desc } = transaction;
        await db.runAsync("INSERT INTO transactions (date, name, cost, desc) VALUES (?, ?, ?, ?)", date, name, cost, desc ?? "");
        databaseSelect(db);
    };

    const databaseSelect = async (database: SQLite.SQLiteDatabase, year?: string, month?: string) => {
        if (!year || !month) {
            const currentDate = new Date();

            year = currentDate.getFullYear().toString();
            month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        }

        const date = `${year}-${month}-01`;

        const loadTransactions: unknown[] = await database.getAllAsync(
            "SELECT * FROM transactions WHERE date BETWEEN strftime('%Y-%m-01', ?) AND strftime('%Y-%m-%d', ?, 'start of month', '+1 month', '-1 day')",
            date,
            date
        );

        const dbTransactions: Transaction[] = loadTransactions as Transaction[];

        const groupedTransactions = dbTransactions.reduce((groups: TransactionList, transaction) => {
            const transactionDate = transaction.date;
            if (!groups[transactionDate]) {
                groups[transactionDate] = [];
            }
            groups[transactionDate].push(transaction);
            return groups;
        }, {});

        setTransactions(groupedTransactions);
    };

    const addTransaction = (transaction: Transaction) => {
        databaseAdd(transaction);
    };

    const value: TransactionContextProps = {
        transactions,
        addTransaction,
    };

    return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};
