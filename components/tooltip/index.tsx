import * as React from 'react';
import { Tooltip as Tp} from 'react-native-paper';

const Tooltip = (props: any, children: any) => (
    <Tp {...props}>
        {props.children}
    </Tp>
);

export default Tooltip;