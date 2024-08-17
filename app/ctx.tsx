import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import {router} from "expo-router";

const AuthContext = createContext<{
    signIn: () => void;
    signOut: () => void;
    signUp: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    signUp: () => null,
    session: null,
    isLoading: false,
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

    return (
        <AuthContext.Provider
            value={{
                signIn: () => {
                    // Perform sign-in logic here
                    setSession('xxx');
                    return router.replace("(tabs)");
                },
                signOut: () => {
                    setSession(null);
                    return router.replace("/login");
                },
                signUp: () => {
                    // Perform sign-in logic here
                    setSession('xxx');
                    return router.replace("(tabs)");
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
