import { View } from "@/components/Themed";
import { useTransactions } from "@/components/TransactionContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { Card, FAB, Icon, Text } from "react-native-paper";

const window = Dimensions.get("window");

const chartData = {
    labels: [
        "01",
        "",
        "03",
        "",
        "05",
        "",
        "07",
        "",
        "09",
        "",
        "11",
        "",
        "13",
        "",
        "15",
        "",
        "17",
        "",
        "19",
        "",
        "21",
        "",
        "23",
        "",
        "25",
        "",
        "27",
        "",
        "29",
        "",
    ],
    datasets: [
        {
            data: [
                350, 320, 320, 400, 390, 330, 4500, 4450, 4450, 4000, 3900, 3900, 3900, 3700, 3500, 3450, 3450, 3100, 3000, 2980, 2950, 2750, 2500, 2400, 2000,
                1900, 1900, 1750, 1700, 1700, 1650,
            ],
        },
    ],
};

const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: "#ffa726",
    },
};

export default function BudgetScreen() {
    const router = useRouter();
    const { transactions } = useTransactions();
    const [fromZero, setFromZero] = useState<boolean>(true);

    const changeChart = () => {
        setFromZero(!fromZero);
    };

    const displayDate = (stringDate: string) => {
        const date = new Date(stringDate);

        return date.toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    if (!transactions) {
        return <></>;
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text variant="headlineMedium" style={styles.header}>
                    Sierpień 2024
                </Text>
                <TouchableWithoutFeedback onPress={changeChart}>
                    <View>
                        <LineChart
                            data={chartData}
                            verticalLabelRotation={-70}
                            width={window.width * 0.94}
                            height={220}
                            chartConfig={chartConfig}
                            yAxisSuffix="zł"
                            fromZero={fromZero}
                            style={styles.chart}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.margin}>
                    {Object.keys(transactions).map((date: string) => (
                        <View key={date}>
                            <Text variant="titleMedium" style={styles.date}>
                                {displayDate(date)}
                            </Text>
                            {transactions[date].map((transaction: any) => (
                                <Card key={transaction.id} mode="elevated" style={styles.payment}>
                                    <View style={styles.paymentContainer}>
                                        <View style={styles.paymentView}>
                                            <Icon source="piggy-bank-outline" size={26} />
                                            <Text variant="bodyLarge" style={styles.paymentName}>
                                                {transaction.name}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text variant="bodyLarge">{transaction.cost}zł</Text>
                                        </View>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
            <FAB icon="plus" style={styles.fab} color="#fff" onPress={() => router.push("/add")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
    },
    header: {
        margin: 20,
        textAlign: "center",
    },
    chart: {
        borderRadius: 16,
        alignSelf: "center",
    },
    margin: {
        marginBottom: 70,
    },
    date: {
        alignSelf: "center",
        marginTop: 22,
        marginBottom: 4,
    },
    payment: {
        padding: 12,
        backgroundColor: "#fafafa",
        width: window.width * 0.9,
        alignSelf: "center",
        marginBottom: 14,
    },
    paymentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    paymentView: {
        flexDirection: "row",
    },
    paymentName: {
        marginLeft: 6,
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 14,
        backgroundColor: "#fb8c00",
        borderRadius: 50,
    },
});
