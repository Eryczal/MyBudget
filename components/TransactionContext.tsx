import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { MonthData, Transaction, TransactionContextProps, TransactionList } from "@/app/types";

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
    const [monthData, setMonthData] = useState<MonthData | null>(null);
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

    useEffect(() => {
        const loadDatabase = async () => {
            const database = await SQLite.openDatabaseAsync("database");

            setDb(database);

            await database.execAsync(`
                CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY NOT NULL, date TEXT NOT NULL, name TEXT NOT NULL, cost REAL NOT NULL, desc TEXT);
                CREATE TABLE IF NOT EXISTS months (id INTEGER PRIMARY KEY NOT NULL, date TEXT NOT NULL, balance REAL NOT NULL);
            `);

            databaseSelect(database);
        };

        loadDatabase();
    }, []);

    // useEffect(() => {
    //     databaseClear();
    // }, [db]);

    const databaseAdd = async (transaction: Transaction) => {
        if (!db) {
            return;
        }

        const { date, name, cost, desc } = transaction;
        const monthDate = date.split("-").slice(0, 2).join("-");

        await db.withTransactionAsync(async () => {
            await db.runAsync("INSERT INTO transactions (date, name, cost, desc) VALUES (?, ?, ?, ?)", date, name, cost, desc ?? "");

            const result: any = await db.getFirstAsync("SELECT balance FROM months WHERE date = ?", monthDate);

            if (result === null) {
                const previousResult: any = await db.getFirstAsync("SELECT * FROM months WHERE date < ? ORDER BY date DESC");

                if (previousResult !== null) {
                    const lastMonth = previousResult.rows[0];

                    const sum: any = await db.getFirstAsync(
                        "SELECT SUM(cost) as total FROM transactions WHERE date BETWEEN strftime('%Y-%m-01', ?) AND strftime('%Y-%m-%d', ?, 'start of month', '+1 month', '-1 day')"
                    );

                    await db.runAsync("INSERT INTO months (date, balance) VALUES (?, ?)", monthDate, lastMonth["balance"] + sum.rows[0]["total"]);
                } else {
                    await db.runAsync("INSERT INTO months (date, balance) VALUES (?, 0)", monthDate);
                }
            }

            await db.runAsync("UPDATE months SET balance = balance + ? WHERE date > ?", cost, monthDate);
        });
        databaseSelect(db);
    };

    const databaseSelect = async (database: SQLite.SQLiteDatabase, year?: string, month?: string) => {
        if (!year || !month) {
            const currentDate = new Date();

            year = currentDate.getFullYear().toString();
            month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        }

        const date = `${year}-${month}-01`;

        const loadedTransactions: unknown[] = await database.getAllAsync(
            "SELECT * FROM transactions WHERE date BETWEEN strftime('%Y-%m-01', ?) AND strftime('%Y-%m-%d', ?, 'start of month', '+1 month', '-1 day') ORDER BY date DESC",
            date,
            date
        );

        const dbTransactions: Transaction[] = loadedTransactions as Transaction[];

        const groupedTransactions = dbTransactions.reduce((groups: TransactionList, transaction) => {
            const transactionDate = transaction.date;
            if (!groups[transactionDate]) {
                groups[transactionDate] = [];
            }
            groups[transactionDate].push(transaction);
            return groups;
        }, {});

        const loadedMonth: any = await database.getAllAsync("SELECT * FROM months WHERE date = ?", `${year}-${month}`);
        const monthValue = loadedMonth[0] ? loadedMonth[0] : { date: "${year}-${month}", balance: 0 };

        setTransactions(groupedTransactions);
        setMonthData(monthValue);
    };

    const loadTransactions = async (date: Date) => {
        if (db) {
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");

            databaseSelect(db, year, month);
        }
    };

    const addTransaction = (transaction: Transaction) => {
        databaseAdd(transaction);
    };

    const getTransaction = async (id: number): Promise<Transaction | null> => {
        if (!db) {
            return null;
        }

        const transaction: unknown[] = await db.getAllAsync("SELECT * FROM transactions WHERE id = ?", id);

        if (!transaction) {
            return null;
        }

        return transaction[0] as Transaction;
    };

    const databaseClear = () => {
        if (db) {
            db.execAsync(`
                DROP TABLE IF EXISTS transactions;
                DROP TABLE IF EXISTS months;
            `);

            setTransactions(null);
            setMonthData(null);
        }
    };

    const value: TransactionContextProps = {
        transactions,
        monthData,
        addTransaction,
        loadTransactions,
        getTransaction,
    };

    return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};
