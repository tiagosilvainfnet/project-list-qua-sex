import { useContext, createContext, type PropsWithChildren } from 'react';
import {setStorageItemAsync, useStorageState} from './useStorageState';
import {router} from "expo-router";

const AuthContext = createContext<{
    signIn: () => void;
    signOut: () => void;
    signUp: () => void;
    session?: string | null;
    isLoading: boolean;
    changeTheme: (theme: string) => void;
    theme?: string | null;
    isLoadingTheme: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    signUp: () => null,
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
                signIn: () => {
                    // Perform sign-in logic here
                    setSession('xxx');
                    // @ts-ignore
                    return router.replace("(tabs)");
                },
                signOut: () => {
                    setSession(null);
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
                session,
                isLoading,
                theme,
                isLoadingTheme,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
