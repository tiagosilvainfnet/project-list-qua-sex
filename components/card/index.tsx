import * as React from 'react';
import {Card as Cd, Button, Text} from 'react-native-paper';

const Card = (props: any) => {
    // @ts-ignore
    return  <Cd>
                {
                    props.texts?.length > 0 ?
                        // @ts-ignore
                        <Cd.Content>
                            {props.texts.map((text: any, index: number) => <Text {...text.props}>Card title</Text>)}
                        </Cd.Content> : null
                }
                {
                    props.buttons?.length > 0 ?
                        <Cd.Actions>
                            {props.buttons.map((button: any, index: number) => <Button key={index} {...button.props}>{button.label}</Button>)}
                        </Cd.Actions> : null
                }
                { props.title ? <Cd.Title {...props}/> : null }
            </Cd>
}

Card.defaultProps = {
    texts: [],
    buttons: []
}

export default Card;