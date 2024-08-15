import {Appbar} from "react-native-paper";
import {router} from "expo-router";

const AppBar = (props: any) => {
    return <Appbar.Header>
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