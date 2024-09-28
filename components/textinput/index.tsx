import * as React from 'react';
import {HelperText, TextInput as TIp, TextInputProps} from 'react-native-paper';

const TextInput = (props: any) => {
    return <>
                <TIp {...props} />
                {props.helpText ? <HelperText type="error" visible={true}>{props.helpText}</HelperText> : null }
            </>

};

TextInput.defaultProps  = {
    helpText: null
}

export default TextInput;