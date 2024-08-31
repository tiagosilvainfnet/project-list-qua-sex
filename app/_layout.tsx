import {Navigator} from "expo-router";
import Slot = Navigator.Slot;
import {SessionProvider, useSession} from "@/app/ctx";
import {PaperProvider} from "react-native-paper";
import {useColorScheme} from "react-native";
import {darkTheme, lightTheme} from "@/constants/Theme";
import {useStorageState} from "@/app/useStorageState";
import {useEffect} from "react";
import {createTable} from "@/services/database";

export default function RootLayout() {
    const themeType = useColorScheme();
    const [[isLoadingTheme, theme], setTheme] = useStorageState('theme');
    const themeJson = {
        'dark': darkTheme,
        'light': lightTheme
    }

    useEffect(() => {
        createTable('user');
    }, []);

    // @ts-ignore
    return  <PaperProvider theme={theme === "auto" || theme === null ? themeType === "dark" ? themeJson['dark'] : themeJson['light'] :  themeJson[theme]}>
                <SessionProvider>
                    <Slot />
                </SessionProvider>
            </PaperProvider>
}
