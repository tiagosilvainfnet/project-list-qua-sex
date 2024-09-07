import {Avatar, Button, Camera, Fab, Grid, Snackbar, TextInput, Topbar} from "@/components";
import {select} from "@/services/database";
import {useRef, useState, useEffect} from "react";
import * as ImagePicker from "expo-image-picker";
import {UserInterface} from "@/interfaces/User";
import {update} from "@/services/database";

export default function ProfileScreen() {
    const [cameraVisible, setCameraVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const cameraRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UserInterface>({
        photoURL: null
    });
    const getUser = async () => {
        const d = await select("user", ["uid", "emailVerified", "username", "displayName", "email", "photoURL", "phoneNumber", "createdAt"], null, false);

        setData((v) => ({
            ...v,
            ...d
        }))
    }

    const _update = async () => {
        setLoading(true);

        try{
            await update('user', data, data.uid)
            setMessage("Dados atualizados com sucesso!!!")
        }catch (err){
            setMessage("Um erro ocorreu ao atualizar o perfil.")
        }

        setLoading(false);
    }

    useEffect(() => {
        getUser();
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            aspect: [4, 3],
            quality: 1,
        });
        setLoading(true);

        if (!result.canceled) {
            setData((v: any) => ({
                ...v,
                photoURL: result.assets[0].uri
            }));
        }

        setLoading(false);
    };

    const onCapture = (photo: any) => {
        setData((v: any) => ({
            ...v,
            image: photo.uri
        }));
    }

    return  <>
                <Grid>
                    <Grid>
                        <Topbar title="Perfil"/>
                    </Grid>
                    <Grid>
                        <Grid style={{
                            ...styles.containerImage
                        }}>
                            <Grid style={{
                                ...styles.containerCenterImage
                            }}>
                                {
                                    data.photoURL ? <Avatar size={230} source={{uri: data.photoURL}} /> : <Avatar size={230} icon="account" />
                                }
                                <Fab
                                    onPress={pickImage}
                                    icon="image"
                                    style={{
                                        ...styles.fab,
                                        ...styles.left
                                    }}/>
                                <Fab
                                    onPress={() => setCameraVisible(true)}
                                    icon="camera"
                                    style={{
                                        ...styles.fab,
                                        ...styles.right
                                    }}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid style={{
                        marginTop: 30,
                        ...styles.padding
                    }}>
                        <TextInput
                            label="Nome"
                            value={data.displayName}
                            onChangeText={(text: string) => setData((v) => ({...v, displayName: text}))}
                        />
                    </Grid>
                    <Grid style={{
                        ...styles.padding
                    }}>
                        <TextInput
                            label="Nome de usuário"
                            value={data.username}
                            onChangeText={(text: string) => setData((v) => ({...v, username: text}))}
                        />
                    </Grid>
                    <Grid style={{
                        ...styles.padding
                    }}>
                        <TextInput
                            label="E-mail"
                            keyboardType="email-address"
                            value={data.email}
                            disabled
                        />
                    </Grid>
                    <Grid style={{
                        ...styles.padding
                    }}>
                        <TextInput
                            label="Telefone"
                            keyboardType="numeric"
                            value={data.phoneNumber}
                            onChangeText={(text: string) => setData((v) => ({...v, phoneNumber: text}))}
                        />
                    </Grid>
                    <Grid style={{
                        ...styles.padding
                    }}>
                        <Button
                            loading={loading}
                            onPress={_update}
                            mode="contained">
                            Salvar
                        </Button>
                    </Grid>
                </Grid>
                <Snackbar
                    visible={message !== null}
                    onDismiss={() => setMessage(null)}
                    duration={5000}
                    text={message}
                />
                {
                    cameraVisible ? <Camera
                        onCapture={onCapture}
                        setCameraVisible={setCameraVisible}
                        ref={cameraRef}
                    /> : null
                }
            </>
}

const styles = {
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    padding: {
        padding: 16
    },
    containerCenterImage: {
        width: 230,
        position: 'relative',
    },
    fab: {
        bottom: 0,
        position: 'absolute',
        borderRadius: 200
    },
    right: {
        right: 0,
    },
    left: {
        left: 0
    }
}
