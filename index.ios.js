/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;

window.navigator.userAgent = 'react-native';

var io = require("socket.io-client/socket.io");

var SERVER_API = '46.101.157.215';
var grimlinz = React.createClass({
  getInitialState : function(){
    return {
      snippets : []
    }
  },
  componentDidMount : function(){
    this.loadSnippets();
    this.socket = io(`http://${SERVER_API}:3000`, {jsonp: false});
    this.socket.on('new-snippet', (data) => {
      console.log("Load new-snippet")
      this.loadSnippets();
    });
    console.log("componentDidMount")
  },
  loadSnippets : function(){
    fetch(`http://${SERVER_API}:3000/snippets`, {
      method : 'GET',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((json) => {
      if( this.isMounted() ){
        this.setState({
          snippets : json
        });
      }
    });
  },
  render: function() {
    return (
      <View style={styles.container}>
        {this.state.snippets.map( (snippet) => {
          return <SnippetButton snippet={snippet}/>
        })}
      </View>
    );
  },


});

var SnippetButton = React.createClass({
    getSnippetType : function(){
      return this.props.type
    },
    render : function(){
      return (
        <TouchableHighlight
          style={styles.snippet} >
          <TextSnippet snippet={this.props.snippet}/>
        </TouchableHighlight>
      )
    }
});

var TextSnippet = React.createClass({
  render : function(){
    return (
      <View
        style={styles.TextSnippet}>
        <Text>{this.props.snippet.name}</Text>
        <Text>{this.props.snippet.code}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap : 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  snippet : {
    flex: 1,
    borderStyle: 'solid',
    borderColor: '#00FF 00',
    borderWidth: 1,
    backgroundColor : '#CCCDDD',
    width : 100,
    height: 100,
    overflow: 'hidden',
    textAlign: 'center'
  },
  textSnippet : {
    flex: 1,
  }
});

AppRegistry.registerComponent('grimlinz', () => grimlinz);
