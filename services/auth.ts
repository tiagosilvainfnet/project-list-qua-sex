import {router} from "expo-router";
import {insert, populateDatabase} from "@/services/database";
import {getAuth, IdTokenResult, signInWithEmailAndPassword, UserCredential} from "@firebase/auth";
import {UserInterface} from "@/interfaces/User";

const login = async (email: string, password: string, setSession: any) => {
    const auth = getAuth();

    try{
        const response: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        const user: any = response.user.toJSON();

        // TODO: Pegar no firebase o perfil no banco
        const _user: UserInterface = {
            email: user.email ? user.email : "",
            emailVerified: user.emailVerified.toString(),
            displayName: user.displayName ? user.displayName : "",
            uid: user.uid,
            username: "",
            photoURL: user.photoURL ? user.photoURL: "",
            phoneNumber: user.phoneNumber ? user.phoneNumber : "",
            createdAt: user.createdAt,
            sync: 1
        };

        await insert('user', _user, false);
        await populateDatabase(user.uid);
        setSession(user.stsTokenManager.accessToken);
        return router.replace("(tabs)");
    }catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

export { login };