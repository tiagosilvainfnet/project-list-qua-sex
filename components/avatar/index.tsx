import * as React from 'react';
import { Avatar as Av } from 'react-native-paper';

// @ts-ignore
const Avatar = (props: AvatarProps) => {
    const detectTypeAvatar = (props: any) => {
        if(props.source){
            return <Av.Image
                        style={{
                            ...props.style,
                            backgroundColor: props.bgColor
                        }}
                        {...props} />;
        }else if (props.icon) {
            return <Av.Icon
                        style={{
                            ...props.style,
                            backgroundColor: props.bgColor
                        }}
                        {...props} />;
        }else{
            return <Av.Text
                        style={{
                            ...props.style,
                            backgroundColor: props.bgColor
                        }}
                        {...props} />;
        }
    }

    // @ts-ignore
    return detectTypeAvatar(props);
};

Avatar.defaultProps = {
    source: null,
    label: 'XD',
    bgColor: "#fff",
    color: "#333"
}

export default Avatar;