import { useContext, createContext, type PropsWithChildren } from 'react';
import {setStorageItemAsync, useStorageState} from './useStorageState';
import {router} from "expo-router";
import {FirebaseApp, initializeApp} from "firebase/app";
import {login} from "@/services/auth";
import {createTables, dropTables} from "@/services/database";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);


const AuthContext = createContext<{
    signIn: (email: string, password: string) => void;
    signOut: () => void;
    signUp: () => void;
    firebaseApp?: FirebaseApp | null;
    session?: string | null;
    isLoading: boolean;
    changeTheme: (theme: string) => void;
    theme?: string | null;
    isLoadingTheme: boolean;
}>({
    signIn: (email: string, password: string) => null,
    signOut: () => null,
    signUp: () => null,
    firebaseApp: firebaseApp,
    session: null,
    isLoading: false,
    changeTheme: async (theme: string) => null,
    theme: null,
    isLoadingTheme: false,
    // @ts-ignore
});

// This hook can be used to access the user info.
export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');
    const [[isLoadingTheme, theme], setTheme] = useStorageState('theme');

    return (
        <AuthContext.Provider
            value={{
                signIn: (email: string, password: string) => {
                    return login(email, password, setSession);
                },
                signOut: async () => {
                    setSession(null);
                    await dropTables();
                    await createTables();
                    return router.replace("/login");
                },
                signUp: () => {
                    // Perform sign-in logic here
                    setSession('xxx');
                    // @ts-ignore
                    return router.replace("(tabs)");
                },
                changeTheme: async (theme: string) => {
                    await setStorageItemAsync('theme', theme);
                },
                firebaseApp: firebaseApp,
                session,
                isLoading,
                theme,
                isLoadingTheme,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
