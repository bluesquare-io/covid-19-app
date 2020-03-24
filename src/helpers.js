import React, {Component} from 'react'
import {AppContext} from './contexts/AppProvider';
import {version} from '../package.json';
import {features} from '../app.json';

/**
 * This helper provides a simple way to communicate with our API
 */
export function request(method, url, data = null, headers = {})
{
    return new Promise((resolve, reject) => {
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-APP-VERSION": version,
            ...headers
        }

        features.debug && console.log(method, url, headers, data)

        fetch(url, {
            method,
            cache: "no-cache",
            headers,
            referrer: "no-referrer",
            body: data !== null ? JSON.stringify(data) : null
        })
            .then(response => {
                return new Promise((resolve, reject) => {
                    response.json()
                        .then((data) => {
                            features.debug && console.log(method, url, data)
                            response.ok ? resolve(data) : reject(data)
                        })
                        .catch((error) => {
                            features.debug && console.error(method, url, error)
                            reject(error)
                        })
                })
            })
            .then(data => data.code && data.code != 200 ? reject(data) : resolve(data))
            .catch(err => reject(err))
        ;
    })
}

/**
 * This helpers provides a convenient access to AppContext
 */
export function withToken(Component)
{
    return props => (
        <AppContext.Consumer>
            {({ token, removeToken }) => <Component {...props} token={token} removeToken={removeToken}/>}
        </AppContext.Consumer>
    )
}
