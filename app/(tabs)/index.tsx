import {Checkbox, Fab, Grid, IconButton, List, Topbar} from "@/components";
import {router} from "expo-router";
import {useEffect, useState} from "react";
import {select} from "@/services/database";
import {ItemIterface} from "@/interfaces/Item";

export default function HomeScreen() {
    const [data, setData] = useState([]);

    const loadData = async () => {
        const d: Array<ItemIterface> = await select("item", [ "uid", "title", "description", "createdAt", "sync"], "", true);
        if (d.length > 0) {
            setData(d);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return <Grid style={{
                height: '100%',
                width: '100%',
            }}>
                <Grid>
                    <Topbar title="Home"/>
                </Grid>
                <Grid>
                    {
                        data.length > 0 ?
                            data.map((d: ItemIterface, idx: number) => {
                                return <List
                                    title={d.title}
                                    description={d.description}
                                    left={() => <Checkbox />}
                                    right={() => <IconButton
                                                        onPress={() => {
                                                            router.push({ pathname: `/form`, params: { uid: d.uid } });
                                                        }}
                                                        icon="pencil" />}
                                />
                            })
                            : null
                    }
                </Grid>
                <Fab
                    icon="plus"
                    onPress={() => {
                        router.push('form');
                    }}
                    style={{
                        bottom: 20,
                        position: 'absolute',
                        borderRadius: 200,
                        right: 20,
                    }}/>
            </Grid>;
}

