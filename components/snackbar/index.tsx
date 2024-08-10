import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {Snackbar as Snack, SnackbarProps} from 'react-native-paper';

const Snackbar = (props: SnackbarProps | any, children: any) => {
    return (
        <View style={styles.container}>
            <Snack {...props}>{props.text}</Snack>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
});

export default Snackbar;