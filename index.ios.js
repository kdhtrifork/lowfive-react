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
        <Text>{this.props.snippet.name}</Text>
        <Text>{this.props.snippet.code}</Text>
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
        <Text style={styles.HEXSnippetFont}>{this.props.snippet.code}</Text>
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
  row : {
    flex: 1,
  },
  snippet : {
    flex: 1,
    width: 200,
    height: 200,
    overflow: 'hidden',
  },
  textSnippet : {
    backgroundColor : '#CCCDDD'
  },
  HEXSnippet : {
    flex: 1,
    alignItems : 'center',
    justifyContent: 'center',
  },
  HEXSnippetFont : {
    fontSize: 30
  }
});

AppRegistry.registerComponent('grimlinz', () => grimlinz);
