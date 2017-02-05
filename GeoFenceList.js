'use strict';

import React, { Component } from 'react'
import {
  ListView,
  View,
  Text
} from 'react-native';

import BackgroundGeolocation from "react-native-background-geolocation";

class GeoFenceList extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    console.log(this.props.geoFences);

    this.state = {
      dataSource: ds.cloneWithRows(this.props.geoFences)
    };
  }

  renderRow(rowData, sectionID, rowID) {
    return (
        <View>
          <Text>{rowData.identifier}</Text>
        </View>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }
}

module.exports = GeoFenceList;
