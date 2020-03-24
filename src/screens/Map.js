import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import MapView, {UrlTile, Marker, Circle} from 'react-native-maps'; // You may want to add PROVIDER_GOOGLE
import Geolocation from '@react-native-community/geolocation';
import {request, withToken} from '../helpers';
import {sources, map, features} from '../../app.json'

// Setup Geolocation options
Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse'
});

/**
 * Provides a map that can display pins & circles
 */
class Map extends Component
{
    map = React.createRef()

    region = null

    state = {
        ready: false,
        position: null,
        data: null
    }

    componentDidMount()
    {
        // Retrieve current location to center the map and update API user
        Geolocation.getCurrentPosition(
            position => {
                position = position.coords

                if (this.state.ready) {
                    this.map.setCamera({
                        center: {
                            latitude: position.latitude,
                            longitude: position.longitude,
                        }
                    })
                }

                this.setState({ position })

                request('post', sources.track,
                    { position },
                    { "Authorization": "Bearer " + this.props.token })
            }
        )
    }

    _load = (region) => {
        if (this.region == JSON.stringify(region))
            return features.debug && console.log('map: ignoring refresh');

        this.region = JSON.stringify(region)
        features.debug && console.log(region)

        request('post', sources.map, { region },
            { 'Authorization': `Bearer ${this.props.token}` })
            .then(data => this.setState({ data }))
    }

    render()
    {
        return (
            <View style={styles.flex}>
                <MapView
                    ref={this.map}
                    mapPadding={styles.mapPadding}
                    onLayout={() => {
                        if (this.state.position && this.map.setCamera) {
                            this.map.setCamera({
                                center: {
                                    latitude: this.state.position.latitude,
                                    longitude: this.state.position.longitude,
                                }
                            })
                        }
                    }}
                    //provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={false}
                    showsTraffic={false}
                    minZoomLevel={4}
                    onRegionChangeComplete={(region) => this._load(region)}
                    onMarkerPress={(marker) => {
                        features.debug && console.log('Marker pressed', marker.target)
                    }}
                    style={styles.flex}
                    initialRegion={map.defaultPosition}>
                    {this.renderTiles()}
                    {this.renderData()}
                </MapView>
            </View>
        );
    }

    renderTiles()
    {
        if (Platform.OS === 'Android')
            return (
                <UrlTile urlTemplate={"http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"} />
            )

        return null
    }

    renderData()
    {
        const {data} = this.state
        if (!data) return null

        return data.map(entity => {
            if (entity.type === 'pin') {
                return (
                    <Marker
                        key={entity.id}
                        identifier={entity.id}
                        coordinate={{
                            latitude: entity.latitude,
                            longitude: entity.longitude,
                        }}
                        title={entity.title}
                        description={entity.description}
                        pinColor={entity.color}
                    />
                )
            }

            if (entity.type === 'circle') {
                return (
                    <Circle
                        key={entity.id}
                        center={{
                            latitude: entity.latitude,
                            longitude: entity.longitude,
                        }}
                        radius={entity.radius}
                        fillColor={entity.color}
                        strokeColor="transparent"
                    />
                )
            }

            return null
        })
    }
}

export default withToken(Map);

const styles = {
    flex: {
        flex: 1
    },
    mapPadding: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 80
    }
}
