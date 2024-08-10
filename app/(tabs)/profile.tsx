import { router } from "expo-router";
import {AppBar} from "@/components";

export default function ProfileScreen() {
    return (
        <AppBar
            title="Perfil"
            icon="dots-vertical"
            onPress={() => {
                router.push("settings");
            }}/>
    );
}
