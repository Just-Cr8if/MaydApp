import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, Image, Alert,
  StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import SettingsOptionButton from "../../components/buttons/SettingsOptionButton";
import SettingsModal from "../../components/modals/SettingsModal";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../styles/Constants";
import Button from "../../components/buttons/Button";
import { settingsStyles } from "../../styles/settingsStyles";


const RestaurantSettingsScreen = () => {
  const { venue, updateVenueOrderStatus, restaurantLogout, restaurantInfo,
    teamMemberRole
   } = useRestaurantAuth();
  const [estimatedWaitTime, setEstimatedWaitTime] = useState('');
  const [additionalWaitTime, setAdditionalWaitTime] = useState('');
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const venueOrderStatus = venue?.venue_order_status;
  const nav = useNavigation();

  console.log('teamMemberRole', teamMemberRole);

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
      <Text style={styles.content}>Let your customers know how long it will take for pickup orders to be ready.</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Estimated Wait Time (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={setEstimatedWaitTime}
          value={estimatedWaitTime}
          placeholder="Enter estimated wait time..."
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Additional Wait Time (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={setAdditionalWaitTime}
          value={additionalWaitTime}
          placeholder="Enter additional wait time..."
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pickup Instructions:</Text>
        <TextInput
          style={styles.inputLarge}
          onChangeText={setPickupInstructions}
          value={pickupInstructions}
          placeholder="Let the customers know where to pick up..."
          multiline
        />
      </View>
      <Button 
        title="Submit" 
        onPress={handlePrepTimeSubmit}
      />

    </ScrollView>
  );

  const renderResetPasswordForm = () => (
    <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
      <Text style={styles.content}>Reset your password securely here.</Text>
  
      {/* Current Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your current password"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>
  
      {/* New Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a new password"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>
  
      {/* Confirm New Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your new password"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>
  
      {/* Submit Button */}
      <Button 
        title="Submit" 
        onPress={handlePrepTimeSubmit}
      />
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
        disabled={teamMemberRole && teamMemberRole === 'team_member'}
      />
      
      <SettingsOptionButton
        title="App Photos"
        imageSource={require("../../images/photo-icon.png")}
        onPress={() => nav.navigate('AppPhotos')}
        disabled={teamMemberRole && teamMemberRole === 'team_member'}
      />
      <SettingsOptionButton
        title="Venue Information"
        imageSource={require("../../images/venue-icon.png")}
        onPress={() => nav.navigate('VenueInformation')}
        disabled={teamMemberRole && teamMemberRole === 'team_member'}
      />
      <SettingsOptionButton
        title="Hours of Operation"
        imageSource={require("../../images/schedule-icon.png")}
        onPress={() => nav.navigate('HoursOfOperation')}
        disabled={teamMemberRole && teamMemberRole === 'team_member'}
      />
      <SettingsOptionButton
        title="Subscription"
        imageSource={require("../../images/subscription-icon.png")}
        onPress={() => nav.navigate('Subscription')}
        disabled={teamMemberRole && teamMemberRole === 'team_member'}
      />
      <SettingsOptionButton
        title="Password Reset"
        imageSource={require("../../images/password-reset-icon.png")}
        onPress={() => handleOptionPress("Password Reset", renderResetPasswordForm())}
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
      fontWeight: '600',
      marginBottom: 16,
      color: Colors.mainFontColor
    },
    horizontalLine: {
      height: 1,
      backgroundColor: Colors.lightgrey,
      marginVertical: 16,
    },
    inputLarge: {
      height: 120,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 20,
      paddingHorizontal: 10,
      fontSize: 14,
      color: '#555',
      textAlignVertical: 'top',
    },
    formContainer: {
      padding: 20,
      backgroundColor: "#fff",
      width: "95%",
    },
    content: {
      fontSize: 14,
      color: "#767676",
      marginBottom: 20,
      textAlign: "left",
    },
    inputContainer: {
      marginBottom: 15,
    },
    label: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#555",
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: "#333",
      backgroundColor: "#f9f9f9",
    },
  });

export default RestaurantSettingsScreen;