import React, {Component} from 'react';
import {ScrollView, View, Button} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {AppContext} from '../contexts/AppProvider';
import {request, withToken} from '../helpers';
import {sources} from '../../app.json';

/**
 * Infos tab.
 * It displays an auto-resizing WebView, to feel like native
 */
class Infos extends Component
{
    _reset = (callback) => {
        request('delete', sources.token, {}, {
            "Authorization": `Bearer ${this.props.token}`
        })
            .then(callback).catch(callback)
    }

    render()
    {
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.offsetTop}/>
                {this.renderWebView()}
                {this.renderActions()}
                <View style={styles.offsetBottom}/>
            </ScrollView>
        );
    }

    renderWebView()
    {
        return (
            <AutoHeightWebView
                source={{ uri: `${sources.infos}?token=${this.props.token}` }}
                scalesPageToFit={true}
                viewportContent={'width=device-width, user-scalable=no'}
            />
        )
    }

    renderActions()
    {
        return (
            <View style={styles.actionsContainer}>
                <AppContext.Consumer>
                    {({ removeToken }) => (
                        <Button onPress={() => this._reset(removeToken)}
                                color="#999999"
                                title="Delete my data"/>
                    )}
                </AppContext.Consumer>
            </View>
        )
    }
}

export default withToken(Infos);

const styles = {
    scrollView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#eee'
    },
    actionsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 50
    },
    offsetTop: {
        height: 30
    },
    offsetBottom: {
        height: 65
    }
}
