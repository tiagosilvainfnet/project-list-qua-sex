import { Button } from '@/components';
import { router } from 'expo-router';

export default function SettingsScreen() {
    const logout = () => {
        router.navigate('login');
    }

    return (
        <>
            <Button onPress={logout}>Sair</Button>
            <Button onPress={() => router.navigate('components')}>Componentes</Button>
        </>
    );
}