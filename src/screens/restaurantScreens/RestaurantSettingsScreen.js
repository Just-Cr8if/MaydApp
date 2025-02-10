import React, { useState, useEffect } from "react";
import {
  View, Text, Button, TextInput, Image, Alert,
  StyleSheet, ScrollView
} from 'react-native';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import SettingsOptionButton from "../../components/buttons/SettingsOptionButton";
import SettingsModal from "../../components/modals/SettingsModal";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../styles/Constants";

const RestaurantSettingsScreen = () => {
  const { venue, updateVenueOrderStatus, restaurantLogout } = useRestaurantAuth();
  const [estimatedWaitTime, setEstimatedWaitTime] = useState('');
  const [additionalWaitTime, setAdditionalWaitTime] = useState('');
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const venueOrderStatus = venue?.venue_order_status;
  const nav = useNavigation();

  // Ensure venueOrderStatus exists before setting initial values
  useEffect(() => {
    if (venue?.venue_order_status) {
      console.log("Venue Order Status:", venue.venue_order_status);
      
      setEstimatedWaitTime(venue.venue_order_status.estimated_wait_time?.toString() || "");
      setAdditionalWaitTime(venue.venue_order_status.additional_wait_time?.toString() || "");
      setPickupInstructions(venue.venue_order_status.pickup_instructions || "");
    }
  }, [venue]);

  // Function to handle submission of updated wait times
  const handlePrepTimeSubmit = async () => {
    try {
      await updateVenueOrderStatus(venue.id, {
        venue_id: venue.id,
        estimated_wait_time: estimatedWaitTime,
        additional_wait_time: additionalWaitTime,
        pickup_instructions: pickupInstructions
      });

      setIsModalVisible(false);
      Alert.alert('Success', 'Prep time updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update prep time. Please try again.');
    }
  };

  // Function to render the form inside the modal
  const renderPrepTimeForm = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.label}>Estimated Wait Time (minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setEstimatedWaitTime}
        value={estimatedWaitTime}
      />
      <Text style={styles.label}>Additional Wait Time (minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setAdditionalWaitTime}
        value={additionalWaitTime}
      />
      <Text style={styles.label}>Pickup Instructions:</Text>
      <TextInput
        style={styles.inputLarge}
        onChangeText={setPickupInstructions}
        value={pickupInstructions}
        placeholder="Let the customers know where to pick up..."
        multiline
      />
      <Button title="Submit" onPress={handlePrepTimeSubmit} />
    </ScrollView>
  );

  // Function to show modal with dynamic content
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
      
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}> 
        <Image 
          source={require('../../images/QR-icon.png')}
          style={{ width: 30, height: 30 }}
        />
      </View>

      <View style={styles.horizontalLine} />
      <Text style={styles.title}>Account & Settings</Text>

      <SettingsOptionButton
        title="Set Prep Time"
        imageSource={require("../../images/prep-time-icon.png")}
        onPress={() => handleOptionPress("Set Prep Time", renderPrepTimeForm())}
      />
      <SettingsOptionButton
        title="App Photos"
        imageSource={require("../../images/photo-icon.png")}
        onPress={() => nav.navigate('AppPhotos')}
      />
      <SettingsOptionButton
        title="Venue Information"
        imageSource={require("../../images/venue-icon.png")}
        onPress={() => nav.navigate('VenueInformation')}
      />
      <SettingsOptionButton
        title="Hours of Operation"
        imageSource={require("../../images/schedule-icon.png")}
        onPress={() => nav.navigate('HoursOfOperation')}
      />
      <SettingsOptionButton
        title="Subscription"
        imageSource={require("../../images/subscription-icon.png")}
        onPress={() => nav.navigate('Subscription')}
      />
      <SettingsOptionButton
        title="Password Reset"
        imageSource={require("../../images/password-reset-icon.png")}
        onPress={() =>
          handleOptionPress(
            "Password Reset",
            <Text style={styles.content}>Reset your password securely here.</Text>
          )
        }
      />
      <SettingsOptionButton
        title="Contact Support"
        imageSource={require("../../images/support-icon.png")}
        onPress={() => nav.navigate('ContactSupport')}
      />
      <SettingsOptionButton
        title="Log Out"
        imageSource={require("../../images/logout-icon.png")}
        onPress={() =>
          handleOptionPress(
            "Sign Out",
            <View>
              <Text style={styles.content}>Are you sure you want to sign out?</Text>
              <Button title="Sign Out" onPress={restaurantLogout} color="red" />
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="gray" />
            </View>
          )
        }
      />
    </View>
  );
};

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
      color: Colors.mainFontColor
    },
    formContainer: {
      borderColor: 'blue',
      borderWidth: 10
    },
    horizontalLine: {
      height: 1,
      backgroundColor: Colors.lightgrey,
      marginVertical: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 16,
      borderRadius: 4,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    inputLarge: {
      height: 120,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      marginTop: 10,
      marginBottom: 20,
      paddingHorizontal: 10,
      fontSize: 18,
      color: '#000',
      textAlignVertical: 'top',
    },
  });

export default RestaurantSettingsScreen;