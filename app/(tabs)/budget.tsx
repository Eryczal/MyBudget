import { View } from "@/components/Themed";
import { useTransactions } from "@/components/TransactionContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, ScrollView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { Card, FAB, Icon, Text } from "react-native-paper";

const window = Dimensions.get("window");

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
    const { transactions, monthData, loadTransactions } = useTransactions();
    const [fromZero, setFromZero] = useState<boolean>(true);
    const [date, setDate] = useState<Date>(new Date());
    const [chartData, setChartData] = useState<any>();
    const swiped = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, { dx, dy, moveX, moveY }) => {
                return Math.abs(dx) > window.width * 0.01;
            },
            onPanResponderMove: (evt, gestureState) => {
                const swipeThreshold = window.width * 0.1;
                const direction = gestureState.dx > 0 ? 1 : -1;
                if (Math.abs(gestureState.dx) >= swipeThreshold) {
                    swiped.setValue(gestureState.dx - swipeThreshold * direction);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (Math.abs(gestureState.dx) > window.width * 0.3) {
                    const direction = gestureState.dx > 0 ? -1 : 1;

                    Animated.spring(swiped, {
                        toValue: window.width * direction * -1,
                        useNativeDriver: true,
                        speed: 36,
                    }).start();

                    setTimeout(() => {
                        setDate((prev) => {
                            const newDate = new Date(prev);
                            newDate.setMonth(prev.getMonth() + direction);
                            return newDate;
                        });

                        Animated.timing(swiped, {
                            toValue: window.width * direction,
                            useNativeDriver: true,
                            duration: 0,
                        }).start();
                    }, 150);
                } else {
                    Animated.spring(swiped, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        loadTransactions(date);
    }, [date]);

    useEffect(() => {
        if (parseInt(JSON.stringify(swiped)) !== 0) {
            setTimeout(() => {
                Animated.spring(swiped, {
                    toValue: 0,
                    useNativeDriver: true,
                    speed: 24,
                }).start();
            }, 50);
        }
    }, [transactions]);

    useEffect(() => {
        updateChart();
    }, [transactions, monthData]);

    const changeChart = () => {
        setFromZero(!fromZero);
    };

    const updateChart = () => {
        if (transactions && monthData) {
            const year = date.getFullYear();
            const month = date.getMonth();
            const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

            const labels = Array.from({ length: lastDayOfMonth }, (_, i) => (i + 1).toString().padStart(2, "0"));

            let currentBalance = monthData.balance;

            const dataset = labels.map((label) => {
                const dateKey = `${year}-${(month + 1).toString().padStart(2, "0")}-${label}`;
                const transactionsForDay = transactions[dateKey] || [];
                transactionsForDay.forEach((t) => (currentBalance += t.cost));
                return currentBalance;
            });

            const data = {
                labels,
                datasets: [
                    {
                        data: dataset,
                    },
                ],
            };
            setChartData(data);
        }
    };

    const displayDate = (stringDate: string | Date, header: boolean = false) => {
        const dateObj: Date = stringDate instanceof Date ? stringDate : new Date(stringDate);

        return dateObj.toLocaleDateString("pl-PL", {
            month: "long",
            year: "numeric",
            ...(!header && { day: "2-digit" }),
        });
    };

    const showTransaction = (id: number) => {
        router.push(`../transactions/${id}`);
    };

    if (!transactions) {
        return <></>;
    }

    return (
        <View style={styles.container}>
            <Animated.View {...panResponder.panHandlers} style={{ flex: 1, transform: [{ translateX: swiped }] }}>
                <ScrollView>
                    <Text variant="headlineMedium" style={styles.header}>
                        {displayDate(date, true)}
                    </Text>
                    <TouchableWithoutFeedback onPress={changeChart}>
                        <View>
                            {chartData ? (
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
                            ) : (
                                <></>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.margin}>
                        {Object.keys(transactions).length === 0 ? (
                            <Text variant="titleMedium" style={styles.date}>
                                Brak zmian
                            </Text>
                        ) : (
                            Object.keys(transactions).map((date: string) => (
                                <View key={date}>
                                    <Text variant="titleMedium" style={styles.date}>
                                        {displayDate(date)}
                                    </Text>
                                    {transactions[date].map((transaction: any) => (
                                        <Card key={transaction.id} mode="elevated" style={styles.payment} onPress={() => showTransaction(transaction.id)}>
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
                            ))
                        )}
                    </View>
                </ScrollView>
            </Animated.View>
            <FAB icon="plus" style={styles.fab} color="#fff" onPress={() => router.push("../transactions/add")} />
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
        textTransform: "capitalize",
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
