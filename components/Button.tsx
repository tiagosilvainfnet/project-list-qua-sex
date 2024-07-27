import { Button as Btn } from 'react-native-paper';

const Button = ({ children, ...props }) => {
    return  <Btn {...props}>
                {children}
            </Btn>
};
export default Button;