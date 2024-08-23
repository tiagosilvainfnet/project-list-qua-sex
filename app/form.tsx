import { Text } from 'react-native';
import {Fab, Grid, Topbar} from "@/components";
import {router} from "expo-router";

export default function FormScreen() {
    return <Grid style={{
                height: '100%',
                width: '100%',
            }}>
                <Grid>
                    <Topbar title="Novo item" back={true} menu={false}/>
                </Grid>
                <Grid></Grid>
            </Grid>;
}