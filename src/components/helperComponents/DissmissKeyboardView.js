import React from 'react';
import { Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <ScrollView style={{ flex: 1 }}>
      {children}
    </ScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;