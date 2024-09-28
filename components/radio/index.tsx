import * as React from 'react';
import { View } from 'react-native';
import {RadioButton, RadioButtonProps, Text} from 'react-native-paper';

const Radio = (props: any) => {
    return (
        <View>
            {
                props.radios.map((radio: any, index: number) => {
                    return (
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <RadioButton
                                key={index}
                                value={radio.value}
                                status={props.valueChecked === radio.value ? 'checked' : 'unchecked'}
                                onPress={() => props.setValueChecked(radio.value)}
                            />
                            { radio.label && <Text onPress={() => props.setValueChecked(radio.value)}>{radio.label}</Text> }
                        </View>
                    );
                })
            }
        </View>
    );
};

export default Radio;