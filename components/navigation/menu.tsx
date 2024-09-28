import {Surface, Menu as Mn} from "react-native-paper";

const Menu = (props: any) => {
    return props.visible ?
                    <Surface style={{
                        flex: 1,
                        position: "absolute",
                        right: 20,
                        top: 80,
                        backgroundColor: 'white',
                        zIndex: 10000
                    }} elevation={2}>
                        {
                            props.items.map((item: any, index: number) => {
                                return <Mn.Item
                                    leadingIcon="redo"
                                    {...item}
                                    onPress={() => {
                                        item.onPress();
                                        props.setVisible(false);
                                    }}/>
                            })
                        }
                    </Surface> : null
}

export default Menu;