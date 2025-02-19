import React from 'react';
import { View, Text } from 'react-native';
import { settingsStyles } from '../../../styles/settingsStyles';
import CustomHeader from '../../../components/helperComponents/CustomHeader';
import { useNavigation } from '@react-navigation/native';

const ContactSupportScreen = () => {
  const nav = useNavigation();
  return (
    <View style={settingsStyles.container}>
      <CustomHeader
        title={"Settings"}
        onBackPress={() => {
          nav.goBack();
        }}
      />
      <Text>ContactSupportScreen</Text>
    </View>
  );
};

export default ContactSupportScreen;