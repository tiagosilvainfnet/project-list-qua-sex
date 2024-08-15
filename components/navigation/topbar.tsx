import { AppBar, Menu } from "@/components";
import {router} from "expo-router";
import {useState} from "react";

const Topbar = (props: any) => {
    const [visible, setVisible] = useState(false);

    return  <>
                <AppBar
                    title={props.title}
                    icon={props.menu ? "dots-vertical" : ""}
                    onPress={() => setVisible(!visible)}
                    back={props.back}
                />
                {
                    props.menu ? <Menu
                                    visible={visible}
                                    setVisible={setVisible}
                                    items={[
                                        {
                                            title: "Settings",
                                            leadingIcon: "cog",
                                            // onPress: router.push("/settings")
                                        },
                                        {
                                            title: "Logout",
                                            leadingIcon: "logout",
                                            onPress: () => { console.log("Sair") }
                                        }
                                    ]}
                                    /> : null
                }
            </>
}

Topbar.defaultProps = {
    menu: true,
    back: false
}

export default Topbar;