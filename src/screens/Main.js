import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import messaging from '@react-native-firebase/messaging';
import AppProvider, {AppContext} from '../contexts/AppProvider';
import {features} from '../../app.json';
import Register from './Register';
import Map from './Map';
import Infos from './Infos';
import News from './News';

/**
 * Our main view.
 * It displays tabs and screens.
 */
class Main extends Component
{
    state = {
        tab: 'news',
        notifications: null
    }

    componentDidMount(): void {
        features.notifications && this._requestNotificationsPermission()
    }

    _requestNotificationsPermission = () => {
        // Setup Firebase notifications
        messaging().registerForRemoteNotifications().then(() => {
            // Ask notifications permission
            const notifications = messaging().requestPermission();
            // Store permission status, in order to display a notice on the Map if disabled
            this.setState({ notifications })
        })
    }

    render()
    {
        return (
            <AppProvider>
                <AppContext.Consumer>
                    {({ token }) => token ? this.renderApp() : <Register />}
                </AppContext.Consumer>
            </AppProvider>
        );
    }

    renderApp()
    {
        return (
            <View style={styles.flex}>
                <View style={styles.flex}>
                    {this.renderCurrentScreen()}
                </View>
                {this.renderTabs()}
            </View>
        )
    }

    renderCurrentScreen()
    {
        switch (this.state.tab)
        {
            case 'map':
                return <Map/>
            case 'infos':
                return <Infos/>
            case 'news':
                return <News notifications={this.state.notifications}/>
        }

        return null
    }

    renderTabs()
    {
        return (
            <View style={styles.tabsContainer}>
                <BlurView blurType="dark" blurAmount={10} style={styles.flex}>
                    <View style={styles.tabsView}>
                        {this.renderTab('news', 'News', 'newspaper-o', 'fontawesome')}
                        {this.renderTab('map', 'Map', 'map')}
                        {this.renderTab('infos', 'Infos', 'warning')}
                    </View>
                </BlurView>
            </View>
        )
    }

    renderTab(tab, title, icon, iconProvider = 'entypo')
    {
        const color = this.state.tab === tab ? '#fff' : '#999'

        return (
            <TouchableOpacity
                style={styles.tab}
                onPress={() => this.setState({ tab })}>
                {iconProvider === 'fontawesome' ? <FontAwesomeIcon name={icon} size={28} color={color}/> : <Icon name={icon} size={28} color={color}/>}
                <Text style={{ ...styles.tabText, color }}>{title}</Text>
            </TouchableOpacity>
        )
    }
}

export default Main;

const styles = {
    flex: {
        flex: 1
    },
    tabsContainer: {
        borderTopColor: '#555',
        borderTopWidth: 1,
        height: 100,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    tabsView: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 15
    },
    tab: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    tabText: {
        padding: 5
    }
}
