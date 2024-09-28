import { Checkbox as Check, Text } from 'react-native-paper';
import {View} from "react-native";

const Checkbox = (props: any) => {
    return  <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Check {...props} />
                { props.label && <Text onPress={props.onPress}>{props.label}</Text> }
            </View>
}

export default Checkbox;