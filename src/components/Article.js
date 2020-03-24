import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback, Image, Animated, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ArticleTitle = ({ data }) => {
    return (
        <View style={styles.articleTitleView}>
            <View style={styles.flex}>
                <Text style={styles.articleTitle}>{data.title}</Text>
            </View>
            <View>
                <Icon name="angle-right" size={28} color="black"/>
            </View>
        </View>
    )
}

const ArticleSubtitle = ({ data }) => {
    return (
        <View style={styles.articleSubtitleView}>
            <View style={styles.flex}>
                <Text style={styles.articleSubtitle}>{data.news_feed.name}</Text>
            </View>
        </View>
    )
}

const ArticleImage = ({ data }) => {
    return (
        <Image
            style={styles.articleImage}
            source={{ uri: data.picture }} />
    )
}

class Article extends Component
{
    state = {
        focus: false
    }

    // This component is animated (on press)
    animation = new Animated.Value(1)

    _open = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    }

    _pressIn = () => {
        this.setState({ focus: true })
        Animated.spring(this.animation, { toValue: 0.9 }).start()
    }

    _pressOut = () => {
        this.setState({ focus: false })
        Animated.spring(this.animation, {
            toValue: 1,
            friction: 3,
            tension: 40
        }).start()
    }

    render()
    {
        const {data} = this.props
        const {focus} = this.state

        const transformStyle = {
            transform: [
                { scale: this.animation }
            ],
            shadowOpacity: focus ? 1 : 0.37,
            elevation: focus ? 15 : 12,
        }

        return (
            <View style={styles.articleView}>
                <TouchableWithoutFeedback
                    onPressIn={this._pressIn}
                    onPressOut={this._pressOut}
                    onPress={() => this._open(data.source)}>
                    <Animated.View style={{...styles.articleAnimatedView, ...transformStyle}}>
                        {data.picture && <ArticleImage data={data}/>}
                        <ArticleTitle data={data}/>
                        <ArticleSubtitle data={data}/>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

export default Article;

const styles = {
    flex: {
        flex: 1
    },
    articleView: {
        flexDirection: 'row',
        marginHorizontal: 30,
        marginBottom: 30
    },
    articleAnimatedView: {
        flex: 1,
        borderRadius: 10,
        shadowColor: "#aaa",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowRadius: 7.49,
        backgroundColor: '#fff',
    },
    articleTitleView: {
        padding: 20,
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    articleTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black'
    },
    articleSubtitleView: {
        padding: 20,
        paddingTop: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    articleSubtitle: {
        fontSize: 16,
        color: '#aaa'
    },
    articleImage: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 160,
        backgroundColor: '#eee'
    }
}
