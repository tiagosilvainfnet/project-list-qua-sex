import { Appbar } from "react-native-paper";
import { router } from "expo-router";

export default function DashboardScreen() {
  return (
      <Appbar.Header>
        <Appbar.Content title="Relatório"/>
        <Appbar.Action
            icon="dots-vertical"
            onPress={() => {
              router.push("settings");
            }}
        />
      </Appbar.Header>
  );
}
