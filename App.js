import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      text: '',
      context: {},
    };
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

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
        </ScrollView>
        <TextInput
          placeholder="type your message here..."
          onChangeText={() => this.handleChangeText()}
        />
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
  },
});
