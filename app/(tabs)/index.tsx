import { Appbar } from "react-native-paper";
import { router } from "expo-router";

export default function HomeScreen() {
    return (
        <Appbar.Header>
          <Appbar.Content title="Home"/>
          <Appbar.Action
            icon="dots-vertical"
            onPress={() => {
              router.push("settings");
            }}
          />
        </Appbar.Header>
    );
}

