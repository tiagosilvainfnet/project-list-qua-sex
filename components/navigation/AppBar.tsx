import {Appbar, useTheme} from "react-native-paper";
import {router} from "expo-router";

const AppBar = (props: any) => {
    const theme = useTheme();

    return <Appbar.Header
                style={{
                    backgroundColor: theme.colors.background,
                }}
            >
                {
                    props.back ? <Appbar.BackAction onPress={() => router.back()}/> : null
                }
                <Appbar.Content {...props}/>
                <Appbar.Action
                    {...props}
                />
            </Appbar.Header>
}

export default AppBar;