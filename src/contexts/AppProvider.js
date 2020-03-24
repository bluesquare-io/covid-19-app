import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../components/Loading';

/**
 * We need an API token.
 */

export const AppContext = React.createContext({
    token: null
})

/**
 * This component provides AppContext, and retrieve the token from storage (if present) when mounting.
 */

class AppProvider extends Component
{
    state = {
        token: null,
        loading: true
    }

    async componentDidMount(): void {
        try {
            const token = await AsyncStorage.getItem('@token')

            this.setState({
                loading: false,
                token
            })
        }
        catch (e) {
            this.setState({ loading: false })
        }
    }

    _update = (token) => {
        this.setState({ token })
        AsyncStorage.setItem('@token', token)
    }

    _remove = () => {
        this.setState({ token: null })
        AsyncStorage.removeItem('@token')
    }

    render()
    {
        if (this.state.loading)
            return <Loading/>

        return (
            <AppContext.Provider value={{
                token: this.state.token,
                updateToken: this._update,
                removeToken: this._remove,
            }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default AppProvider;
