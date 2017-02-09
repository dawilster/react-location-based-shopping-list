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
  NavigatorIOS,
  AsyncStorage,
  AppState
} from 'react-native';

import BackgroundGeolocation from "react-native-background-geolocation";
import NotificationsIOS from "react-native-notifications";

var Home = require('./Home');

// global.BackgroundGeolocation = BackgroundGeolocation;

export default class ShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openedAppRecently: false,
      lastCrossed: null
    };
  }

  componentWillMount() {
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));

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
      locationUpdateInterval: 10000, //active location updates in ms
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
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        BackgroundGeolocation.start(() => {
          console.log("- Start success");

          this.addGeofences();
        });
      } else {
        this.addGeofences();
      }
    });
  }
  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    // Remove BackgroundGeolocation listeners
    BackgroundGeolocation.un('location', this.onLocation);
    BackgroundGeolocation.un('motionchange', this.onMotionChange);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  onLocation(location) {
    console.log('- [js]location: ', JSON.stringify(location));
  }
  onMotionChange(location) {
    console.log('- [js]motionchanged: ', JSON.stringify(location));
  }

  geoFenceCrossed(params) {
    if(params.action == 'EXIT') {
      //opene recently or crossed geoFence greater than 5 minutes ago
      if(this.state.openedAppRecently ||
          (this.state.lastCrossed != null &&
          this.state.lastCrossed <= (Date.now() - (5 * 60)))) {
        this.triggerExitNotification();

        this.setState({ openedAppRecently: false });
      } else {
        NotificationsIOS.cancelAllLocalNotifications();
      }
    } else {
      this.setState({ lastCrossed: Date.now()});

      this.triggerEntryNotification();

      this.scheduleDwellNotification();
    }
  }

  _buildGooglePlacesUrl(lat, lng) {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

    url += '?location=' + lat + ',' + lng;
    url += '&rankby=distance';
    url += '&keyword=shoppers drug mart';
    url += '&key=AIzaSyA7zAbta-8Bnu--NoJr3AkR--NOZuE1JY0'

    return url;
  }

  _handleAppStateChange(currentAppState) {
    console.log("AppState: " + currentAppState);
    console.log("lastCrossed: " + this.state.lastCrossed);
    //basically if the app had been opened within 10 minutes of crossing
    //a geoFence
    if(currentAppState === 'active' &&
        this.state.lastCrossed != null &&
        this.state.lastCrossed >= (Date.now() - (10 * 60))) {

      this.setState({ openedAppRecently: true });
    }
  }

  addGeofences() {

    BackgroundGeolocation.getCurrentPosition({
      persist: true,
      timeout: 30,      // 30 second timeout to fetch location
      samples: 5,       // Fetch maximum 5 location samples
      maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
      desiredAccuracy: 10  // Fetch a location with a minimum accuracy of `10` meters.
    }, (location) => {
      fetch(this._buildGooglePlacesUrl(location.coords.latitude, location.coords.longitude), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then((response) => response.json())
      .then((json) => {
        console.log('building places objects');
        let geoFences = json.results.map(this.buildGeoObject);

        BackgroundGeolocation.addGeofences(geoFences, function() {
            console.log("Successfully added geofences");
        }, function(error) {
            console.warn("Failed to add geofences", error);
        });
      });
    }, function(errorCode) {
        alert('A location error occurred: ' + errorCode);
    });

  }

  buildGeoObject(place) {
    return {
      identifier: place.name + ' - ' + place.vicinity,
      radius: 10,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyOnDwell: false,
    }
  }

  triggerExitNotification() {
    NotificationsIOS.localNotification({
      alertTitle: "Leaving so soon?",
      alertBody: "Just wanted to make sure you got everything :)",
      alertAction: "Click here to open",
    });
  }

  scheduleDwellNotification() {
    //5 minutes from now
    NotificationsIOS.localNotification({
      fireDate: new Date(Date.now() + (300 * 1000)).toISOString(),
      alertTitle: "Got everything?",
      alertBody: "Just making sure you don't forget anything",
      alertAction: "Click here to open",
    });
  }

  triggerEntryNotification() {
    NotificationsIOS.localNotification({
      alertTitle: "Hey! Looks like you're near a Shoppers",
      alertBody: "If you are, you have items in your Shopping list",
      alertAction: "Click here to open",
    });
  }

  render() {
    return (
      <NavigatorIOS
        style={{flex: 1}}
        initialRoute={{
          title: 'Home',
          component: Home
        }}/>
    );
  }
}
AppRegistry.registerComponent('ShoppingList', () => ShoppingList);
