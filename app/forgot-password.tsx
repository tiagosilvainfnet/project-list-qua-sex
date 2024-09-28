import {ScrollView} from 'react-native';
import {Avatar, Button, Grid, TextInput} from "@/components";
import {Link} from "expo-router";
import {useState} from "react";
import {Text} from "react-native-paper";

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');

    return (
        <ScrollView>
            <Grid style={{
                display: 'flex',
                justifyContent: 'center',
                height: '100%'
            }}>
                <Grid style={{
                    marginTop: 50,
                    ...styles.container,
                    ...styles.padding
                }}>
                    <Avatar size={200} source={require('../assets/images/logo.jpg')}/>
                </Grid>
                <Grid style={{
                    ...styles.padding,
                    ...styles.container,
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <Text style={{
                        fontSize: 24
                    }}>Esqueci minha senha</Text>
                </Grid>
                <Grid style={{
                    ...styles.padding
                }}>
                    <TextInput
                        value={email}
                        keyboardType="email-address"
                        onChangeText={setEmail}
                        label="E-mail"
                    />
                </Grid>
                <Grid style={{
                    ...styles.padding,
                    ...styles.container,
                    textAlign: 'center'
                }}>
                    {/*@ts-ignore*/}
                    <Link href="login">
                        Fazer login
                    </Link>
                </Grid>
                <Grid style={{
                    ...styles.padding
                }}>
                    <Button
                        style={{
                            borderRadius: 0
                        }}
                        mode="contained">
                        Cadastrar
                    </Button>
                </Grid>
            </Grid>
        </ScrollView>
    );
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    padding: {
        padding: 16,
    }
}