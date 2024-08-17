import {View} from "react-native";
import {useTheme} from "react-native-paper";

const Body = (props: any) => {
    const theme = useTheme();

    return <View style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.onBackground,
    }} {...props}>{props.children}</View>
}

export default Body;