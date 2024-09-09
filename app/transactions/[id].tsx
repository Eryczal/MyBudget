import { Dimensions, StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import { Text } from "react-native-paper";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useTransactions } from "@/components/TransactionContext";
import { Transaction } from "../types";

const window = Dimensions.get("window");

export default function TransactionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getTransaction } = useTransactions();
    const navigation = useNavigation();
    const [transaction, setTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        const loadTransaction = async () => {
            const loadedTransaction = await getTransaction(parseInt(id));

            setTransaction(loadedTransaction);
        };

        loadTransaction();
    }, []);

    useEffect(() => {
        if (transaction) {
            navigation.setOptions({ title: `Transakcja: ${transaction.name}` });
        }
    }, [transaction]);

    if (!transaction) {
        return <></>;
    }

    return (
        <View style={styles.container}>
            <Text>{transaction.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    input: {
        marginTop: 12,
        width: window.width * 0.9,
        alignSelf: "center",
    },
    button: {
        marginTop: 18,
        padding: 6,
    },
});
