import {router} from "expo-router";
import {save} from "@/services/database";
import {getAuth, IdTokenResult, signInWithEmailAndPassword, UserCredential} from "@firebase/auth";

const isLoggedIn = (): boolean => {
    return true;
}

const login = async (email: string, password: string, setSession: any) => {
    const auth = getAuth();

    try{
        const response: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        const user: any = response.user.toJSON();
        setSession(user.stsTokenManager.accessToken);

        await save('user', {
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            uid: user.uid,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt,
        });
        return router.replace("(tabs)");
    }catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

export { isLoggedIn, login };