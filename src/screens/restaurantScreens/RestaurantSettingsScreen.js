import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, Animated,
    StyleSheet, Linking, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions, Modal } from 'react-native';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import { Colors } from "../../styles/Constants";
import SettingsOptionButton from "../../components/buttons/SettingsOptionButton";
import SettingsModal from "../../components/modals/SettingsModal";
import { useNavigation } from "@react-navigation/native";


const RestaurantSettingsScreen = ({navigation}) => {
    const { restaurantLogout } = useRestaurantAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState(null);

    const nav = useNavigation();

  const handleLogout = () => {
    restaurantLogout();
  };

  const handleOptionPress = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <SettingsModal 
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        modalTitle={modalTitle}
        modalContent={modalContent}
      />
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}> 
        <Image 
          source={require('../../images/QR-icon.png')}
          style={{width: 30, height: 30}}
        />
      </View>
      <View style={styles.horizontalLine} />
        <Text style={styles.title}>Account & Settings</Text>
        
        <SettingsOptionButton
          title="Set Prep Time"
          imageSource={require("../../images/prep-time-icon.png")}
          onPress={() =>
            handleOptionPress(
              "Set Prep Time",
              <Text style={styles.content}>Here you can set your prep time.</Text>
            )
          }
        />
        <SettingsOptionButton
          title="App Photos"
          imageSource={require("../../images/photo-icon.png")}
          onPress={() =>
            nav.navigate('AppPhotos')
          }
        />
        <SettingsOptionButton
          title="Venue Information"
          imageSource={require("../../images/venue-icon.png")}
          onPress={() =>
            nav.navigate('VenueInformation')
          }
        />
        <SettingsOptionButton
          title="Hours of Operation"
          imageSource={require("../../images/schedule-icon.png")}
          onPress={() =>
            nav.navigate('HoursOfOperation')
          }
        />
        <SettingsOptionButton
          title="Subscription"
          imageSource={require("../../images/subscription-icon.png")}
          onPress={() =>
            nav.navigate('Subscription')
          }
        />
        <SettingsOptionButton
          title="Password Reset"
          imageSource={require("../../images/password-reset-icon.png")}
          onPress={() =>
            handleOptionPress(
              "Password Reset",
              <Text style={styles.content}>
                Reset your password securely here.
              </Text>
            )
          }
        />
        <SettingsOptionButton
          title="Contact Support"
          imageSource={require("../../images/support-icon.png")}
          onPress={() =>
            nav.navigate('ContactSupport')
          }
        />
        <SettingsOptionButton
          title="Log Out"
          imageSource={require("../../images/logout-icon.png")}
          onPress={() =>
            handleOptionPress(
              "Sign Out",
              <View>
                <Text style={styles.content}>
                  Are you sure you want to sign out?
                </Text>
                <Button title="Sign Out" onPress={handleLogout} color="red" />
                <Button
                  title="Cancel"
                  onPress={() => setIsModalVisible(false)}
                  color="gray"
                />
              </View>
            )
          }
        />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingTop: 60
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      color: Colors.mainFontColor,
    },
    horizontalLine: {
      height: 1,
      backgroundColor: Colors.lightgrey,
      marginVertical: 16,
    },
  });

export default RestaurantSettingsScreen;