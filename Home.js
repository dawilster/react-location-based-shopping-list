'use strict';

import React, { Component } from 'react'
import {
  View,
  Button,
  StyleSheet,
  Text
} from 'react-native';

import BackgroundGeolocation from "react-native-background-geolocation";
var GeoFenceList = require('./GeoFenceList');

class Home extends Component {

  openGeoFenceList() {

    BackgroundGeolocation.getGeofences((geoFences) => {
      this.props.navigator.push({
        title: 'GeoFences',
        component: GeoFenceList,
        passProps: {geoFences: geoFences}
      });
    });
  }

  render() {
    console.log('home.render');
    return (
      <View style={styles.container}>
        <Button

          onPress={this.openGeoFenceList.bind(this)}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  }
});

module.exports = Home;
