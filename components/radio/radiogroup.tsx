import {RadioButton} from "react-native-paper";

// @ts-ignore
const RadioGroup = ({ children, ...props }) => {
    // @ts-ignore
    return  <RadioButton.Group {...props}>
                {children}
            </RadioButton.Group>
}

export default RadioGroup;