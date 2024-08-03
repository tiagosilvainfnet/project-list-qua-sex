import { router } from "expo-router";
import {AppBar} from "@/components";

export default function HomeScreen() {
    return (
        <AppBar
            title="Início"
            icon="dots-vertical"
            onPress={() => {
                router.push("settings");
            }}/>
    );
}

