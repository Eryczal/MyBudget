import { Alert, Dimensions, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";

import { View } from "@/components/Themed";
import { Button, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { useTransactions } from "@/components/TransactionContext";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { router } from "expo-router";

const window = Dimensions.get("window");

export default function AddScreen() {
    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [cost, setCost] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(true);
    const { transactions, addTransaction } = useTransactions();

    useEffect(() => {
        setDate(formatDate(new Date()));
    }, []);

    const changeName = (text: string) => {
        setName(text);

        setDisabled(text.length < 3 || cost.length < 1);
    };

    const changeDate = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        setIsVisible(false);

        if (selectedDate) {
            setDate(formatDate(selectedDate));
        }
    };

    const typeDate = (val: string) => {
        setDate(val);
    };

    const validateDate = () => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(date)) {
            Alert.alert("Niepoprawna data", "Wprowadź datę w formacie yyyy-mm-dd");
            setDate(formatDate(new Date()));
        }
    };

    const changeCost = (text: string) => {
        setCost(text);

        setDisabled(name.length < 3 || text.length < 1);
    };

    const showCalendar = (val: boolean) => {
        Keyboard.dismiss();
        validateDate();
        setIsVisible(val);
    };

    const submitTransaction = () => {
        const regex = /^[0-9.,]+$/;

        if (cost.length >= 1 && name.length >= 3) {
            if (regex.test(cost)) {
                const transaction = {
                    date,
                    name,
                    cost: parseFloat(cost.replace(/,/g, ".")),
                    desc,
                };

                addTransaction(transaction);

                router.push("../(tabs)/budget");
            }
        }
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <TextInput mode="outlined" label="Nazwa" value={name} onChangeText={(text) => changeName(text)} style={styles.input} />
                <TextInput
                    mode="outlined"
                    label="Data"
                    value={date}
                    style={styles.input}
                    right={<TextInput.Icon icon="calendar" onPress={() => showCalendar(true)} />}
                    onChangeText={(val) => typeDate(val)}
                    onEndEditing={validateDate}
                />
                {isVisible && (
                    <RNDateTimePicker
                        mode={"date"}
                        value={new Date(date)}
                        onPointerCancel={() => showCalendar(false)}
                        onChange={(event, val) => changeDate(event, val)}
                    />
                )}
                <TextInput mode="outlined" label="Wartość" keyboardType="numeric" value={cost} onChangeText={(num) => changeCost(num)} style={styles.input} />
                <TextInput mode="outlined" label="Opis" multiline numberOfLines={4} value={desc} onChangeText={(text) => setDesc(text)} style={styles.input} />
                <Button mode="contained" textColor="#fff" disabled={disabled} style={styles.button} onPress={() => submitTransaction()}>
                    Dodaj
                </Button>
            </View>
        </TouchableWithoutFeedback>
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
