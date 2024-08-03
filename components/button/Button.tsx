import { Button as Btn } from 'react-native-paper';

// @ts-ignore
const Button = ({ children, ...props }) => {
    return  <Btn {...props}>
                {children}
            </Btn>
};
export default Button;