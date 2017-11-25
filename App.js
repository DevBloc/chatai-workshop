import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Button } from 'react-native';
import base64 from 'base-64';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      text: '',
      context: {},
    };
  }

  componentDidMount() {
    fetch("https://gateway.watsonplatform.net/conversation/api/v1/workspaces/ab090663-c284-4f6a-9e62-17a97ba322a0/message?version=2017-05-26", {
      method: 'POST',
      headers: {
       'Authorization': 'Basic '+ base64.encode('6a4a6520-6ce0-4bb8-b2cf-62c12b0a8942:tku7SWLkExMU'),
       'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
    })
    .then(response => response.json())
    .then(responseData => {
      const newMessages = this.addUniqueKeyToMessages(responseData.output.text);

      this.setState((previousState) => {
        return {
          messages: [...newMessages],
          text: previousState.text,
          context: responseData.context
        };
      });
    })
    .done();
  }

  handleChangeText(text) {
    this.setState((previousState) => {
      return {
        text: text,
        messages: previousState.messages,
        context: previousState.context,
      };
    });
  }

  sendMessage() {
    let m = this.state.text;
    fetch("https://gateway.watsonplatform.net/conversation/api/v1/workspaces/ab090663-c284-4f6a-9e62-17a97ba322a0/message?version=2017-05-26", {
      method: 'POST',
      headers: {
       'Authorization': 'Basic '+ base64.encode('6a4a6520-6ce0-4bb8-b2cf-62c12b0a8942:tku7SWLkExMU'),
       'Content-Type': 'application/json'
      },
      body: JSON.stringify({input: {'text': this.state.text}, context: this.state.context}),
    })
    .then(response => response.json())
    .then(responseData => {
      this.setState((previousState) => {
        const newMessages = this.addUniqueKeyToMessages([this.state.text, ...responseData.output.text]);

        this.refs['textInput'].setNativeProps({text: ''});

        return {
          messages: [...previousState.messages, ...newMessages],
          text: previousState.text,
          context: responseData.context
        };
      });
    })
    .done();
  }

  addUniqueKeyToMessages(msgs) {
    console.log(msgs)
    if (msgs.length == 0) {
      return [];
    }

    return msgs.map((msg) => {
      return {
        message: msg,
        id: Math.random().toString(35).substr(2, 10),
      };
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {
            this.state.messages.map((item) => {
              return <Text key={item.id}>{item.message}</Text>
            })
          }
        </ScrollView>
        <TextInput
          ref={'textInput'}
          placeholder="type your message here..."
          onChangeText={(txt) => this.handleChangeText(txt)}
        />
        <Button title="Send" onPress={() => this.sendMessage()}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
});
