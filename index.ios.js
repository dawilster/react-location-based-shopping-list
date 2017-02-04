/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import BackgroundGeolocation from "react-native-background-geolocation";
import NotificationsIOS from "react-native-notifications";

// global.BackgroundGeolocation = BackgroundGeolocation;

export default class ShoppingList extends Component {

  componentWillMount() {

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on('location', this.onLocation);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on('motionchange', this.onMotionChange);

    BackgroundGeolocation.on('geofence', this.geoFenceCrossed);

    // Now configure the plugin.
    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      stationaryRadius: 25,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: true, // <-- enable for debug sounds & notifications
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
      autoSync: false,         // <-- POST each location immediately to server
      params: {               // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    }, function(state) {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
      }
    });
  }
  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    // Remove BackgroundGeolocation listeners
    BackgroundGeolocation.un('location', this.onLocation);
    BackgroundGeolocation.un('motionchange', this.onMotionChange);
  }
  onLocation(location) {
    console.log('- [js]location: ', JSON.stringify(location));
  }
  onMotionChange(location) {
    console.log('- [js]motionchanged: ', JSON.stringify(location));
  }

  geoFenceCrossed(params) {
    Alert.alert(
      "You're at Shoppers",
      'My Alert Msg'
    );
  }

  addGeofences() {
    let geoFences = [{
      identifier: "Shoppers #1",
      radius: 50,
      latitude: 43.6437499,
      longitude: -79.4098437,
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyOnDwell: true,
      loiteringDelay: 30000,  // 30 seconds
    }];

    NotificationsIOS.localNotification({
    alertBody: "Local notificiation!",
    alertTitle: "Local Notification Title",
    alertAction: "Click here to open",
    soundName: "chime.aiff",
    category: "SOME_CATEGORY",
    userInfo: { }
});

    BackgroundGeolocation.addGeofences(geoFences, function() {
        console.log("Successfully added geofence");
    }, function(error) {
        console.warn("Failed to add geofence", error);
    });

  }

  render() {
    this.addGeofences();

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ShoppingList', () => ShoppingList);
