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
            <View style={styles.transaction}>
                <View style={styles.details}>
                    <Text variant="headlineSmall">Transakcja</Text>
                    <Text variant="bodyLarge" style={styles.smallText}>
                        {transaction.name}
                    </Text>
                </View>
                <View style={styles.details}>
                    <Text variant="headlineSmall">Kwota</Text>
                    <Text variant="bodyLarge" style={styles.smallText}>
                        {transaction.cost}zł
                    </Text>
                </View>
                <View style={styles.details}>
                    <Text variant="headlineSmall">Data</Text>
                    <Text variant="bodyLarge" style={styles.smallText}>
                        {transaction.date}
                    </Text>
                </View>
                <View style={[styles.details, styles.noBorder]}>
                    <Text variant="headlineSmall">Opis</Text>
                    <Text variant="bodyLarge" style={styles.smallText}>
                        {transaction.desc || "Brak"}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
    },
    transaction: {
        marginTop: 20,
    },
    details: {
        alignSelf: "center",
        width: window.width * 0.5,
        paddingVertical: 12,
        marginBottom: 6,
        borderBottomWidth: 1,
        borderBlockColor: "#dadada",
        alignItems: "center",
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    bigText: {
        alignSelf: "center",
    },
    smallText: {
        marginTop: 6,
        color: "#555",
        fontSize: 18,
    },
});
