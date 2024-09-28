import {ScrollView} from 'react-native';
import {Avatar, Button, Grid, Snackbar, TextInput} from "@/components";
import {useSession} from "@/app/ctx";
import {Link} from "expo-router";
import {useEffect, useState} from "react";
import {Text} from "react-native-paper";
import {createTables, dropTables, syncBothDatabase} from "@/services/database";

export default function LoginScreen() {
    const { signIn } = useSession();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [email, setEmail] = useState('tiago@gmail.com');
    const [password, setPassword] = useState('123456');
    const [helpData, setHelpData] = useState({
        email: null,
        password: null
    });

    const verifyFields = (text: string, name: string) => {
        setHelpData((v: any) => ({
            ...v,
            [name]: text.length === 0 ? "Campo obrigatório" : null,
        }));
    }

    const initDatabases = async () => {
        await dropTables();
        await createTables();
    }

    useEffect(() => {
        initDatabases();
    }, []);

    return  <>
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
                                onChangeText={(text: string) => {
                                    setEmail(text);
                                    verifyFields(text, 'email');
                                }}
                                label="E-mail"
                                helpText={helpData.email}
                                error={helpData.email !== null}
                            />
                        </Grid>
                        <Grid style={{
                            ...styles.padding
                        }}>
                            <TextInput
                                value={password}
                                onChangeText={(text: string) => {
                                    setPassword(text);
                                    verifyFields(text, 'password');
                                }}
                                label="Senha"
                                secureTextEntry={true}
                                helpText={helpData.password}
                                error={helpData.password !== null}
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
                                loading={loading}
                                mode="contained"
                                onPress={async () => {
                                    if(email.length > 0 && password.length > 0) {
                                        setLoading(true);
                                        try {
                                            await signIn(email, password);
                                        } catch (e) {
                                            if (e.toString().indexOf("(auth/invalid-credential")) {
                                                setMessage("Dados de usuário inválidos")
                                            }
                                        }
                                        setLoading(false);
                                    }else{
                                        setMessage("Preencha todos os campos");
                                        verifyFields(email, 'email');
                                        verifyFields(password, 'password');
                                    }
                                }}>
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
                <Snackbar
                    visible={message !== null}
                    onDismiss={() => setMessage(null)}
                    duration={5000}
                    text={message}
                />
        </>;
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