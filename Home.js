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
var DB = require('./db.js');
// var DBEvents = require('react-native-db-models').DBEvents

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
          style={styles.button}
          onPress={this.openGeoFenceList.bind(this)}
          title="View Geofences"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
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
  }
});

module.exports = Home;
