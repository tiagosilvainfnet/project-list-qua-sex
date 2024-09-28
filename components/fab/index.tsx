import {FAB, Portal, PaperProvider} from 'react-native-paper';
import React from "react";

const Fab = (props: any) => {
    return props.actions && props.actions.length > 0 ?
            <PaperProvider>
                <Portal>
                    <FAB.Group
                        {...props}/>
                </Portal>
            </PaperProvider>
            : <FAB {...props} />
}

Fab.defaultProps = {
    actions: []
}

export default Fab;