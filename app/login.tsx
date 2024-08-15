import {Text, View} from 'react-native';
import {Button} from "@/components";
import {useSession} from "@/app/ctx";
import {router} from "expo-router";

export default function LoginScreen() {
    const { signIn } = useSession();

    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        }}>
            <Text>
                Login
            </Text>
            <Button onPress={signIn}>
                Entrar
            </Button>
        </View>
    );
}