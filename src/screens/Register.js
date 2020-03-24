import React, {Component} from 'react';
import {AppContext} from '../contexts/AppProvider';
import {request} from '../helpers';
import {sources, features} from '../../app.json'
import {getUniqueId} from 'react-native-device-info';
import Loading from '../components/Loading';

/**
 * This component displays a loader while it fetches an API token by registering the device
 */
class Register extends Component
{
    _register = (callback) => {
        request('post', sources.token, {
            device_uuid: getUniqueId()
        }).then(data => {
            callback(data.token)
        }).catch(error => {
            features.debug && console.log(error)
        })
    }

    render()
    {
        return (
            <AppContext.Consumer>
                {({ updateToken }) => {
                    this._register(updateToken)
                    return <Loading/>
                }}
            </AppContext.Consumer>
        );
    }
}

export default Register;
