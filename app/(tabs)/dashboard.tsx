import { router } from "expo-router";
import { AppBar } from "@/components";

export default function DashboardScreen() {
  return (
      <AppBar
        title="Relatório"
        icon="dots-vertical"
        onPress={() => {
            router.push("settings");
        }}/>
  );
}
