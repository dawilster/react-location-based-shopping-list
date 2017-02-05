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
  Alert,
  Button,
  NavigatorIOS
} from 'react-native';

import BackgroundGeolocation from "react-native-background-geolocation";
import NotificationsIOS from "react-native-notifications";

var Home = require('./Home');

// global.BackgroundGeolocation = BackgroundGeolocation;

export default class ShoppingList extends Component {

  componentWillMount() {
    let here = this;

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on('location', this.onLocation.bind(this));

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on('motionchange', this.onMotionChange.bind(this));

    BackgroundGeolocation.on('geofence', this.geoFenceCrossed.bind(this));

    // Now configure the plugin.
    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      stationaryRadius: 25,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: false, // <-- enable for debug sounds & notifications
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

          here.addGeofences();
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
    if(params.action == 'EXIT') {
      this.triggerExitNotification();
    } else {
      this.triggerEntryNotification();
    }
  }

  addGeofences() {
    let geoFences = [{
      identifier: "shoppers_1",
      radius: 20,
      latitude: 43.643050,
      longitude: -79.406161,
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyOnDwell: true,
      loiteringDelay: 30000,  // 30 seconds
    }, {
      identifier: "shoppers_2",
      radius: 20,
      latitude: 43.642053,
      longitude: -79.411170,
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyOnDwell: true,
      loiteringDelay: 30000,  // 30 seconds
    }, {
      identifier: "citymarket_1",
      radius: 20,
      latitude: 43.641530,
      longitude: -79.415251,
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyOnDwell: true,
      loiteringDelay: 30000,  // 30 seconds
    }];

    BackgroundGeolocation.addGeofences(geoFences, function() {
        console.log("Successfully added geofence");
    }, function(error) {
        console.warn("Failed to add geofence", error);
    });
  }

  triggerExitNotification() {
    NotificationsIOS.localNotification({
      alertTitle: "You're leaving Shoppers",
      alertBody: "Did you make sure to get everything?",
      alertAction: "Click here to open",
      soundName: "chime.aiff",
      category: "SOME_CATEGORY",
    });
  }

  triggerEntryNotification() {
    NotificationsIOS.localNotification({
      alertTitle: "You just arrived at Shoppers",
      alertBody: "And have items in your shopping list",
      alertAction: "Click here to open",
      soundName: "chime.aiff",
      category: "SOME_CATEGORY",
      userInfo: { }
    });
  }

  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Home',
          component: Home
        }}/>
    );
  }
}

var styles = StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1,
  }
});
AppRegistry.registerComponent('ShoppingList', () => ShoppingList);
