import React, {Component} from 'react';
import {View, FlatList, Text} from 'react-native';
import Article from '../components/Article';
import {request, withToken} from '../helpers';
import {sources, features} from '../../app.json';
import Loading from '../components/Loading';

/**
 * Provides an infinite-scroll newsfeed
 */
class News extends Component
{
    state = {
        data: {
            page: 0,
            data: []
        }
    }

    loading = 0

    componentDidMount() {
        this._load()
    }

    // Load next page
    _load = () => {
        const page = this.state.data ? this.state.data.page + 1 : 1

        if (this.loading === page)
            return features.debug && console.log('News: already fetching');

        this.loading = page

        request('get', sources.newsfeed + '?page=' + page, null,
            { 'Authorization': `Bearer ${this.props.token}`})
            .then(data => {
                if (data.data.length) {
                    this.setState({
                        data: {
                            page: data.page,
                            data: [...this.state.data.data, ...data.data]
                        }
                    })
                }
            })
            .catch(e => {
                features.debug && console.error(e)
                this.loading = null
            })
    }

    render()
    {
        if (!this.state.data)
            return <Loading />

        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.flex}
                    contentInset={styles.contentInset}
                    contentContainerStyle={styles.contentContainer}
                    onEndReached={this._load}
                    onEndReachedThreshold={0.5}
                    data={this.state.data.data}
                    renderItem={({ item }) => (
                        <View key={`article-${item.id}`}>
                            <Article data={item} />
                        </View>
                    )}
                />
                {!this.props.notifications && this.renderNotice()}
            </View>
        );
    }

    renderNotice()
    {
        return (
            <View style={styles.noticeView}>
                <Text style={styles.noticeText}>Notifications disabled.</Text>
            </View>
        )
    }
}

export default withToken(News);

const styles = {
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    contentInset: {
        top: 0,
        bottom: 70
    },
    contentContainer: {
        flexDirection: 'column',
        paddingTop: 50,
    },
    noticeView: {
        backgroundColor: '#c40000',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 40,
        paddingBottom: 10
    },
    noticeText: {
        color: '#fff',
        textAlign: 'center'
    }
}
