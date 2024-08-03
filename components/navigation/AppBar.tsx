import {Appbar} from "react-native-paper";

const AppBar = (props: any) => {
    return <Appbar.Header>
                <Appbar.Content {...props}/>
                <Appbar.Action
                    {...props}
                />
            </Appbar.Header>
}

export default AppBar;