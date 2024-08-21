import {ScrollView} from 'react-native';
import {Avatar, Button, Grid, TextInput} from "@/components";
import {useSession} from "@/app/ctx";
import {Link} from "expo-router";
import {useState} from "react";
import {Text} from "react-native-paper";

export default function LoginScreen() {
    const { signIn } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                    }}>Seja Bem-vindo!!!</Text>
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
                    ...styles.padding
                }}>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        label="Senha"
                        secureTextEntry={true}
                    />
                </Grid>
                <Grid style={{
                    ...styles.padding,
                    ...styles.container,
                    textAlign: 'center'
                }}>
                    {/*@ts-ignore*/}
                    <Link href="register">
                        Criar conta
                    </Link>
                </Grid>
                <Grid style={{
                    ...styles.padding
                }}>
                    <Button
                        style={{
                            borderRadius: 0
                        }}
                        mode="contained"
                        onPress={signIn}>
                        Entrar
                    </Button>
                </Grid>
                <Grid style={{
                    ...styles.padding,
                    ...styles.container,
                    textAlign: 'center'
                }}>
                    {/*@ts-ignore*/}
                    <Link href="forgot-password">
                       Esqueci minha senha
                    </Link>
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