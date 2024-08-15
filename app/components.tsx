import {
    Button,
    Avatar,
    Card,
    IconButton,
    Fab,
    Checkbox,
    Progressbar,
    Radio,
    Snackbar,
    Tooltip,
    TextInput,
    List,
    Grid
} from "@/components";
import React from "react";
import {MD3Colors } from 'react-native-paper';
import {ScrollView} from "react-native";

// @ts-ignore
const Components = () => {
    const [state, setState] = React.useState({ open: false });
    const [checked, setChecked] = React.useState(false);
    const [valueChecked, setValueChecked] = React.useState('first');

    // @ts-ignore
    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    const radios = [
        { value: 'first', label: 'first', setChecked: (value: string) => setValueChecked(value) },
        { value: 'second', label: 'second', setChecked: (value: string) => setValueChecked(value) },
        { value: 'third', label: 'third', setChecked: (value: string) => setValueChecked(value) },
    ];

    const [visible, setVisible] = React.useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const [text, setText] = React.useState("");

    return   <ScrollView>
                    <Progressbar progress={0.5} color={MD3Colors.primary10} />
                    <Grid
                        elevation={2}
                    >
                        <Button onPress={onToggleSnackBar} mode="contained">{visible ? 'Hide' : 'Show'}</Button>
                    </Grid>
                    <Tooltip title="Botão">
                        <Avatar source={require('../assets/images/react-logo.png')} />
                    </Tooltip>
                    <Avatar label="TL" />
                    <Avatar icon="folder" />
                    <Card
                        title="Card Title"
                        subtitle="Card Subtitle"
                        left={(props: any) => <Avatar {...props} icon="folder" />}
                        right={(props: any) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
                    />
                    <Checkbox
                        label="Item"
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                        }}
                    />
                    <Radio
                        valueChecked={valueChecked}
                        radios={radios} />
                    <Snackbar
                        visible={visible}
                        onDismiss={onDismissSnackBar}
                        text="Hey there! I'm a Snackbar."
                        duration={3000}
                        action={{
                            label: 'Undo',
                            onPress: () => {
                                // Do something
                            },
                        }}>
                        Hey there! I'm a Snackbar.
                    </Snackbar>
                    <TextInput
                        label="Email"
                        value={text}
                        onChangeText={text => setText(text)}
                    />
                    <List
                        title="First Item"
                        description="Item description"
                        left={() =>  <Checkbox
                                            status={checked ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked(!checked);
                                            }}
                                        />}
                    />
                    <Fab
                        icon="plus"
                        style={{
                            position: 'absolute',
                            margin: 16,
                            right: 0,
                            bottom: 20,
                        }}
                        onPress={() => console.log('Pressed')}
                    />
                    <Fab
                        open={open}
                        visible
                        icon={open ? 'calendar-today' : 'plus'}
                        actions={[
                            { icon: 'plus', onPress: () => console.log('Pressed add') },
                            {
                                icon: 'star',
                                label: 'Star',
                                onPress: () => console.log('Pressed star'),
                            },
                            {
                                icon: 'email',
                                label: 'Email',
                                onPress: () => console.log('Pressed email'),
                            },
                            {
                                icon: 'bell',
                                label: 'Remind',
                                onPress: () => console.log('Pressed notifications'),
                            },
                        ]}
                        onStateChange={onStateChange}
                        onPress={() => {
                            if (open) {
                                // do something if the speed dial is openr
                            }
                        }}
                    />
            </ScrollView>
};
export default Components;