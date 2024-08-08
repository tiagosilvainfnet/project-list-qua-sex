import {Button, Avatar, Card, IconButton} from "@/components";

// @ts-ignore
const Components = () => {
    return  <>
                <Button mode="contained">Botão</Button>
                <Avatar source={require('../assets/images/react-logo.png')} />
                <Avatar label="TL" />
                <Avatar icon="folder" />
                <Card
                    title="Card Title"
                    subtitle="Card Subtitle"
                    left={(props: any) => <Avatar {...props} icon="folder" />}
                    right={(props: any) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
                />
            </>
};
export default Components;