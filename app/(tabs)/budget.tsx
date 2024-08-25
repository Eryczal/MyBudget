import { View } from "@/components/Themed";
import { useState } from "react";
import { Dimensions, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { Text } from "react-native-paper";

const window = Dimensions.get("window");

const chartData = {
    labels: ["01-07", "08-15", "16-23", "24-30"],
    datasets: [
        {
            data: [3200, 3100, 3500, 3000],
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
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726",
    },
};

export default function BudgetScreen() {
    const [fromZero, setFromZero] = useState<boolean>(true);
    const changeChart = () => {
        setFromZero(!fromZero);
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.header}>
                Sierpień 2024
            </Text>
            <TouchableWithoutFeedback onPress={changeChart}>
                <View>
                    <LineChart
                        data={chartData}
                        width={window.width * 0.94}
                        height={220}
                        chartConfig={chartConfig}
                        yAxisSuffix="zł"
                        fromZero={fromZero}
                        style={styles.chart}
                    />
                </View>
            </TouchableWithoutFeedback>
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
});
