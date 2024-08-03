import { Appbar } from "react-native-paper";
import { router } from "expo-router";

export default function ProfileScreen() {
    return (
        <Appbar.Header>
            <Appbar.Content title="Perfil"/>
            <Appbar.Action
                icon="dots-vertical"
                onPress={() => {
                    router.push("settings");
                }}
            />
        </Appbar.Header>
    );
}
