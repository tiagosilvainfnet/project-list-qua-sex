import {Topbar} from '@/components';

export default function SettingsScreen() {
    return (
        <Topbar
            title="Configurações"
            back={true}
            menu={false}/>
    );
}