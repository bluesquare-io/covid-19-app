import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';

class Loading extends Component
{
    render()
    {
        return (
            <View style={styles.container}>
                <ActivityIndicator/>
            </View>
        );
    }
}

export default Loading;

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
}
