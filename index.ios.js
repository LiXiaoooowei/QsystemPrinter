/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Button,View, Alert, Text} from 'react-native';
import * as Firebase from "firebase";

var config = {
  apiKey: "AIzaSyDrvgpAue0ufw2MLwEKpV6sWQU3ovw658Y",
  authDomain: "qsystem-71527.firebaseapp.com",
  databaseURL: "https://qsystem-71527.firebaseio.com",
  projectId: "qsystem-71527",
  storageBucket: "qsystem-71527.appspot.com",
  messagingSenderId: "644304111166"
};

const FirebaseApp = Firebase.initializeApp(config);

var QueueLabel = React.createClass({
  getInitialState: function() {
    return{
      Qnum: 0
    }
  },
  componentWillMount: function() {
    var firebaseRef = FirebaseApp.database().ref();
    var qtotalRef = firebaseRef.child('Qtotal');
    qtotalRef.on('value', function(snapshot){
      var qtotal = snapshot.val();
      this.setState({
        Qnum: qtotal
      });
    }.bind(this));
  },
  componentWillUnmount: function() {
    Firebase.database().ref("Qtotal").off();
    clearInterval(this.state.intervalID);
  },
  componentDidMount: function() {
    var interval = setInterval(
      () => this.setState({
        Qnum: 0
      }), 5000
    );
    this.setState({
      intervalID: interval
    });
  },
  render: function() {
    if (this.state.Qnum == 0) {
      return <Text> Welcome! </Text>
    } else {
      return <Text> Your Queue Number is {this.state.Qnum}</Text>;
    }
  }
});

export default class QsystemPrinter extends Component {

  _onPressButton(){
    var firebaseRef = FirebaseApp.database().ref();
    var userRef = firebaseRef.child('Qlist');
    var qtotalRef = firebaseRef.child('Qtotal');

    qtotalRef.once("value",function(snapshot){
      var currTotal = snapshot.val()+1;
      if (currTotal == 1 ){
        currTotal = Math.floor((6-Math.random())*100);
        firebaseRef.update({
          "baseNumber": currTotal-1,
          "Qserving": currTotal-1
        });
      }
      firebaseRef.update({
        "Qtotal":currTotal
      });
      userRef.child(currTotal).set({
        "queueNumber": currTotal,
        "servedCounter": -1
      });
    });
  }
  render() {
    return (
      <View style={styles.container}>
      <View style = {styles.buttonContainer}>
      <QueueLabel />
      <Button onPress = {this._onPressButton} title = "Queue" />
      </View>
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
  buttonContainer: {
    margin: 20
  },
});

AppRegistry.registerComponent('QsystemPrinter', () => QsystemPrinter);
