import { Button, Text } from 'react-native-paper';
import { router } from 'expo-router';

export default function SettingsScreen() {
    const logout = () => {
        router.navigate('login');
    }

    return (
        <Button onPress={logout}>Sair</Button>
    );
}