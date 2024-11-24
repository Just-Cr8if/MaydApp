import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/buttons/Button';
import PageLink from '../../components/links/PageLink';
import { baseStyles } from '../../styles/baseStyles';

const DriverDetailsScreen = ({ navigation }) => {
  const { driverInfo } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: 'flex-start' }}>
      <View style={styles.headerContainer}>
        <Text>Welcome, {driverInfo?.first_name}</Text>
        <Text>Your Set Home:</Text>
        <Text>{driverInfo?.location?.address}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text>{driverInfo?.location?.city}, </Text>
          <Text>{driverInfo?.location?.state_region} </Text>
          <Text>{driverInfo?.location?.zip_code}</Text>
        </View>
        <Button
          title='Change Location'
        />
      </View>
      <View style={baseStyles.screenWidth}>
        <PageLink 
          title={driverInfo?.networks?.length > 0 ? "My Hubs" : "Find A Hub"}
        />
      </View>
    </View>
  );
};

export default DriverDetailsScreen;

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 2,
    width: '100%',
    paddingBottom: 50
  }
});