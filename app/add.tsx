import { Dimensions, Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";

import { View } from "@/components/Themed";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";

const window = Dimensions.get("window");

export default function AddScreen() {
    const [name, setName] = useState<string>("");
    const [cost, setCost] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(true);

    const changeName = (text: string) => {
        setName(text);

        setDisabled(text.length < 3 || cost.length < 1);
    };

    const changeCost = (text: string) => {
        setCost(text);

        setDisabled(name.length < 3 || text.length < 1);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <TextInput mode="outlined" label="Nazwa" value={name} onChangeText={(text) => changeName(text)} style={styles.input} />
                <TextInput mode="outlined" label="Wartość" keyboardType="numeric" value={cost} onChangeText={(num) => changeCost(num)} style={styles.input} />
                <TextInput mode="outlined" label="Opis" multiline numberOfLines={4} value={desc} onChangeText={(text) => setDesc(text)} style={styles.input} />
                <Button mode="contained" textColor="#fff" disabled={disabled} style={styles.button} onPress={() => console.log(name, cost, desc)}>
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
