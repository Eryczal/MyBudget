import { View } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

import { Card, Icon, ProgressBar, Text } from "react-native-paper";

const window = Dimensions.get("window");

export default function MainScreen() {
    return (
        <View style={styles.container}>
            <ScrollView horizontal style={styles.scrollContainer}>
                <Card mode="elevated" style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge">Budżet</Text>
                        <Text variant="bodyMedium">Dostępne: 500zł</Text>
                        <Text variant="bodyMedium">W tym miesiącu: -20zł</Text>
                    </Card.Content>
                </Card>
                <Card mode="elevated" style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge">Oszczędności</Text>
                        <Text variant="bodyMedium">Zaoszczędzono: 1000zł</Text>
                        <Text variant="bodyMedium">W tym miesiącu: +100zł</Text>
                    </Card.Content>
                </Card>
            </ScrollView>
            <Card mode="contained">
                <Text variant="headlineLarge" style={styles.header}>
                    Twoje cele
                </Text>
                <Card mode="elevated" style={styles.goal}>
                    <View style={styles.goalContainer}>
                        <View style={styles.goalView}>
                            <Icon source="piggy-bank-outline" size={26} />
                            <Text variant="bodyLarge" style={styles.goalName}>
                                Rower
                            </Text>
                        </View>
                        <View>
                            <Text variant="bodyLarge">30zł / 3000zł</Text>
                        </View>
                    </View>
                    <ProgressBar progress={0.01} color="#d9c222" style={styles.bar} />
                </Card>
                <Card mode="elevated" style={styles.goal}>
                    <View style={styles.goalContainer}>
                        <View style={styles.goalView}>
                            <Icon source="piggy-bank-outline" size={26} />
                            <Text variant="bodyLarge" style={styles.goalName}>
                                Rower
                            </Text>
                        </View>
                        <View>
                            <Text variant="bodyLarge">300zł / 3000zł</Text>
                        </View>
                    </View>
                    <ProgressBar progress={0.1} color="#d9c222" style={styles.bar} />
                </Card>
                <Card mode="elevated" style={styles.goal}>
                    <View style={styles.goalContainer}>
                        <View style={styles.goalView}>
                            <Icon source="piggy-bank-outline" size={26} />
                            <Text variant="bodyLarge" style={styles.goalName}>
                                Rower
                            </Text>
                        </View>
                        <View>
                            <Text variant="bodyLarge">1500zł / 3000zł</Text>
                        </View>
                    </View>
                    <ProgressBar progress={0.5} color="#d9c222" style={styles.bar} />
                </Card>
            </Card>
            <StatusBar style={"dark"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
    },
    scrollContainer: {
        flexDirection: "row",
        flexGrow: 0,
    },
    card: {
        width: window.width * 0.8,
        margin: 10,
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        margin: 20,
        textAlign: "center",
    },
    goal: {
        padding: 12,
        paddingVertical: 24,
        backgroundColor: "#fff",
        width: window.width * 0.9,
        margin: "auto",
        marginVertical: 5,
    },
    goalContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    goalView: {
        flexDirection: "row",
        alignItems: "center",
    },
    goalName: {
        marginLeft: 6,
    },
    bar: {
        backgroundColor: "#ebd777",
    },
    icon: {
        margin: 0,
    },
});
