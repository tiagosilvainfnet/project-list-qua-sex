import {Avatar, Button, Fab, Grid, TextInput, Topbar} from "@/components";
import {useState} from "react";

export default function ProfileScreen() {
    const [image, setImage] = useState(null);

    return  <Grid>
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
                                image ? <Avatar size={230} source={require('../../assets/images/logo.jpg')} /> : <Avatar size={230} icon="account" />
                            }
                            <Fab
                                icon="image"
                                style={{
                                    ...styles.fab,
                                    ...styles.left
                                }}/>
                            <Fab
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
                    />
                </Grid>
                <Grid style={{
                    ...styles.padding
                }}>
                    <TextInput
                        label="Sobrenome"
                    />
                </Grid>
                <Grid style={{
                    ...styles.padding
                }}>
                    <TextInput
                        label="Nome de usuário"
                    />
                </Grid>
                <Grid style={{
                    ...styles.padding
                }}>
                    <TextInput
                        label="E-mail"
                        keyboardType="email-address"
                    />
                </Grid>
                <Grid style={{
                    ...styles.padding
                }}>
                    <Button mode="contained" onPress={() => {}}>
                        Salvar
                    </Button>
                </Grid>
            </Grid>
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
