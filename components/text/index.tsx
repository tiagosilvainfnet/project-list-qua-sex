import {Text as T} from "react-native-paper";

const Text = ({ children, ...props }) => {
    return <T {...props}>{children}</T>
}

export default Text;