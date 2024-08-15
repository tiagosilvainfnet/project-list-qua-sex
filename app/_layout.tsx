import {Navigator} from "expo-router";
import Slot = Navigator.Slot;
import {SessionProvider} from "@/app/ctx";

export default function RootLayout() {
  return  <SessionProvider>
            <Slot />
          </SessionProvider>
}
