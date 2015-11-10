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

var GridView = require('react-native-grid-view');

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
      this.loadSnippets();
    });
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

        if ( json.length % 3 !== 0){
          while(json.length % 3 !== 0){
            json.push([]);
          }
        }

        this.setState({
          snippets : json
        });
      }
    });
  },
  render: function() {
    return (
      <GridView
        contentContainerStyle={styles.container}
        items={this.state.snippets}
        renderItem={this._renderItem}
        itemsPerRow={3}
        />
    );
  },
  _renderItem : function(rowData){
      return (
          <View style={styles.row}>
            <SnippetButton snippet={rowData}/>
          </View>
      );
  }


});

var SnippetButton = React.createClass({
    getSnippetType : function(){
      return this.props.snippet.type
    },
    render : function(){
      var SnippetElement;
      switch (this.getSnippetType()){
        case "HEX":
          SnippetElement = <HEXSnippet snippet={this.props.snippet}/>
          break;
        default:
          SnippetElement = <TextSnippet snippet={this.props.snippet}/>
      }
      return (
        <TouchableHighlight>
          <View>
            {SnippetElement}
          </View>
        </TouchableHighlight>
      )
    }
});

var TextSnippet = React.createClass({
  render : function(){
    return (
      <View
        style={[styles.snippet, styles.textSnippet]}>
        <Text style={styles.snippetName}>{this.props.snippet.name}</Text>
        <View style={styles.nameDivider}/>
        <Text style={styles.textSnippetCode}>{this.props.snippet.code}</Text>
      </View>
    );
  }
});

var HEXSnippet = React.createClass({
  render : function(){
    return (
      <View
        style={[
          styles.snippet,
          styles.HEXSnippet,
          {
          backgroundColor : this.props.snippet.code
          }
        ]}
        >
        <Text style={styles.snippetName}>{this.props.snippet.name}</Text>
        <View style={styles.nameDivider}/>
        <Text style={styles.HEXSnippetCode}>{this.props.snippet.code}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems : 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  row: {
    flex: 1,
  },
  snippet: {
    flex: 1,
    height: 112,
    overflow: 'hidden',
    padding: 7,
  },
  textSnippet: {
    backgroundColor: '#282C35',
  },
  snippetName: {
    fontSize: 7,
    color: '#FFFFFF',
    paddingBottom: 7
  },
  textSnippetCode: {
    fontSize: 6,
    fontFamily: 'Menlo',
    color: '#ABB2C1'
  },
  HEXSnippet: {
    //flex: 1,
    //alignItems : 'center',
    //justifyContent: 'center',
  },
  HEXSnippetCode: {
    fontSize: 30,
    color: '#FFFFFF',
    marginTop: 18
  },
  nameDivider: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.30)',
    marginBottom: 7
  }
});

AppRegistry.registerComponent('grimlinz', () => grimlinz);
