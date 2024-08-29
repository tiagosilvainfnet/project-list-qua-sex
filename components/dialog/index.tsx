import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog as Dlg, Portal, Text } from 'react-native-paper';
import {Button} from "@/components";

const Dialog = (props: any) => {
    return (
        <Portal>
            <Dlg visible={props.visible} onDismiss={props.hideDialog}>
                <Dlg.Icon icon={props.icon} />
                <Dlg.Title style={styles.title}>{props.title}</Dlg.Title>
                <Dlg.Content>
                    <Text variant="bodyMedium">{props.text}</Text>
                </Dlg.Content>
                <Dlg.Actions>
                    {props.actions?.map((action: any, index: number) => {
                        return <Button key={index} onPress={action.onPress}>{action.text}</Button>
                    })}
                </Dlg.Actions>
            </Dlg>
        </Portal>
    );
};

Dialog.defaultProps = {
    actions: [],
    hideDialog: () => {},
    text: '',
    title: '',
    visible: false,

}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
    },
})

export default Dialog;