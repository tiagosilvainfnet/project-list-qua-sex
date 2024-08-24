import {Button, Card, Dialog, Grid, IconButton, Snackbar, Text, TextInput, Topbar} from "@/components";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {ScrollView} from "react-native";
import {useTheme} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

export default function FormScreen() {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const params = useLocalSearchParams();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [data, setData] = useState({
        id: null,
        title: null,
        description: null,
        images: []
    });
    const [messageText, setMessageText] = useState(null);
    const [imageToDelete, setImageToDelete] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if(params.id){
            setData((v: any) => ({
                ...v,
                id: params.id,
                title: "Teste",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                images: [
                    "https://img.freepik.com/fotos-gratis/beleza-abstrata-de-outono-em-padrao-multicolorido-de-veios-de-folhas-gerado-por-ia_188544-9871.jpg",
                    "https://img.freepik.com/fotos-gratis/beleza-abstrata-de-outono-em-padrao-multicolorido-de-veios-de-folhas-gerado-por-ia_188544-9871.jpg",
                    "https://img.freepik.com/fotos-gratis/beleza-abstrata-de-outono-em-padrao-multicolorido-de-veios-de-folhas-gerado-por-ia_188544-9871.jpg",
                    "https://img.freepik.com/fotos-gratis/beleza-abstrata-de-outono-em-padrao-multicolorido-de-veios-de-folhas-gerado-por-ia_188544-9871.jpg",
                    "https://img.freepik.com/fotos-gratis/beleza-abstrata-de-outono-em-padrao-multicolorido-de-veios-de-folhas-gerado-por-ia_188544-9871.jpg",
                    "https://img.freepik.com/fotos-gratis/beleza-abstrata-de-outono-em-padrao-multicolorido-de-veios-de-folhas-gerado-por-ia_188544-9871.jpg"
                ]
            }));
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });
        setLoading(true);

        if (!result.canceled) {
            const images = data.images;
            result.assets.forEach((image: any) => {
                images.push(image.uri);
            })
            updateImages(images);
        }
        setLoading(false);
    };

    const updateImages = (images: string[]) => {
        setData((v: any) => ({...v, images: images}));
    }

    return <Grid style={{
                height: '100%',
                width: '100%',
            }}>
                <Grid>
                    <Topbar title="Novo item" back={true} menu={false}/>
                </Grid>
                <Grid style={{
                    ...styles.padding
                }}>
                    <Text variant="headlineLarge">{ data.id ? "Cadastrar item" : "Editar item" }</Text>
                </Grid>
                <ScrollView>
                    <Grid style={{
                        ...styles.padding
                    }}>
                        <TextInput
                            label="Título"
                            value={data.title}
                            onChangeText={(text) => setData((v: any) => ({...v, title: text}))}
                        />
                    </Grid>
                    <Grid style={{
                        ...styles.padding
                    }}>
                        <TextInput
                            label="Descrição"
                            multiline={true}
                            numberOfLines={6}
                            value={data.description}
                            onChangeText={(text) => setData((v: any) => ({...v, description: text}))}
                        />
                    </Grid>
                    <Grid style={{
                        ...styles.padding
                    }}>
                        <Text variant="headlineSmall">Galeria</Text>
                    </Grid>
                    <Grid style={{
                        ...styles.padding,
                        paddingTop: 0,
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                    }}>
                        {
                            loading ?
                                <Text>Carregando...</Text>
                                : data.images.map((image: string, index: number) => {
                                        return <Grid key={index}
                                                     style={{
                                                         width: '33.33%',
                                                         height: 100,
                                                         padding: 5,
                                                         position: 'relative'
                                                     }}>
                                            <Card
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    zIndex: 2,
                                                }}
                                                source={{ uri: image }}/>
                                            <IconButton
                                                icon={"close"}
                                                onPress={() => {
                                                    setDialogVisible(true);
                                                    setImageToDelete(index);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: -15,
                                                    right: -15,
                                                    zIndex: 2,
                                                    backgroundColor: "#fff",
                                                }}/>
                                        </Grid>
                                    })
                        }
                    </Grid>
                    <Grid style={{
                        ...styles.padding,
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <Grid style={{
                            ...styles.padding,
                            width: '50%'
                        }}>
                            <Button
                                style={{
                                    borderRadius: 0,
                                    backgroundColor: theme.colors.onTertiaryContainer
                                }}
                                icon="camera"
                                mode="contained"
                                onPress={() => {}}>
                                Tirar foto
                            </Button>
                        </Grid>
                        <Grid style={{
                            ...styles.padding,
                            width: '50%'
                        }}>
                            <Button
                                style={{
                                    borderRadius: 0,
                                    backgroundColor: theme.colors.onSecondaryContainer
                                }}
                                icon="image"
                                mode="contained"
                                onPress={pickImage}>
                                Galeria
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid style={{
                        ...styles.padding
                    }}>
                        <Button
                            style={{
                                borderRadius: 0
                            }}
                            mode="contained"
                            onPress={() => {}}>
                            {data.id ? "Editar" : "Cadastrar"}
                        </Button>
                    </Grid>
                </ScrollView>
                <Dialog
                    icon={"alert"}
                    title={"Excluir imagem"}
                    text={"Deseja realmente excluir esta imagem?"}
                    visible={dialogVisible}
                    setVisibility={setDialogVisible}
                    onDismiss={() => setDialogVisible(false)}
                    actions={[
                        {
                            text: "Cancelar",
                            onPress: () => {
                                setDialogVisible(false);
                                setImageToDelete(null);
                                setMessageText("Ação cancelada");
                            }
                        },
                        {
                            text: "Excluir",
                            onPress: () => {
                                const images = data.images;
                                images.splice(imageToDelete, 1);
                                updateImages(images);
                                setImageToDelete(null);
                                setMessageText("Imagem excluída com sucesso!");
                                setDialogVisible(false);
                            }
                        }
                    ]}
                />
                <Snackbar
                    visible={messageText !== null}
                    onDismiss={() => setMessageText(null)}
                    text={messageText} />
            </Grid>;
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
}
