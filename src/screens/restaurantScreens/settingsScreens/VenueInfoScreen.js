import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { settingsStyles } from '../../../styles/settingsStyles';
import { useRestaurantAuth } from "../../../context/RestaurantContext";
import { useNavigation } from '@react-navigation/native';
import Button from '../../../components/buttons/Button';
import CustomHeader from '../../../components/helperComponents/CustomHeader';

const VenueInfoScreen = () => {
  const { venue, updateVenue } = useRestaurantAuth();

  const [formData, setFormData] = useState({
    ordering_enabled: venue?.ordering_enabled || false,
    plant_based: venue?.plant_based || false,
    venue_name: venue?.venue_name || "",
    order_link: venue?.order_link || "",
    reservation_link: venue?.reservation_link || "",
    address: venue?.address || "",
    city: venue?.city || "",
    state: venue?.state || "",
    zipcode: venue?.zipcode || "",
    country: venue?.country || "",
    latitude: venue?.latitude || "",
    longitude: venue?.longitude || "",
    phone_number: venue?.phone_number || "",
  });

  const [formIsValid, setFormIsValid] = useState(false);
  const nav = useNavigation();

  // Validate form fields
  const validateForm = () => {
    const { venue_name, address, city, state, zipcode, country } = formData;
    return (
      venue_name.trim() !== "" &&
      address.trim() !== "" &&
      city.trim() !== "" &&
      state.trim() !== "" &&
      zipcode.trim() !== "" &&
      country.trim() !== ""
    );
  };

  useEffect(() => {
    setFormIsValid(validateForm());
  }, [formData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (keyName) => {
    setFormData((prev) => ({
      ...prev,
      [keyName]: !prev[keyName],
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateVenue(venue.id, formData);
      nav.goBack();
    } catch (error) {
      console.error("Error submitting venue:", error);
      Alert.alert("Error", "An error occurred while updating the venue.");
    }
  };

  return (
    <View style={settingsStyles.container}>
      <CustomHeader
      title={"Settings"}
        onBackPress={() => {
          nav.goBack();
        }}
      />
      <ScrollView style={settingsStyles.scrollViewPadding}>
      <Text style={settingsStyles.title}>Venue Information</Text>
      <Text style={settingsStyles.subtitle}>
        Make sure your address, links and contact information are up to date.
      </Text>

        {/* Venue Name */}
        <View style={settingsStyles.formGroup}>
          <Text style={settingsStyles.label}>Name of Venue</Text>
          <TextInput
            style={settingsStyles.input}
            value={formData.venue_name}
            onChangeText={(text) => handleChange("venue_name", text)}
            placeholder="Enter venue name"
          />
        </View>

        {/* Delivery Link */}
        <View style={settingsStyles.formGroup}>
          <Text style={settingsStyles.label}>Delivery Link</Text>
          <TextInput
            style={settingsStyles.input}
            value={formData.order_link}
            onChangeText={(text) => handleChange("order_link", text)}
            placeholder="Enter delivery link"
          />
        </View>

        {/* Reservation Link */}
        <View style={settingsStyles.formGroup}>
          <Text style={settingsStyles.label}>Reservation Link</Text>
          <TextInput
            style={settingsStyles.input}
            value={formData.reservation_link}
            onChangeText={(text) => handleChange("reservation_link", text)}
            placeholder="Enter reservation link"
          />
        </View>

        {/* Address */}
        <View style={settingsStyles.formGroup}>
          <Text style={settingsStyles.label}>Street Address</Text>
          <TextInput
            style={settingsStyles.input}
            value={formData.address}
            onChangeText={(text) => handleChange("address", text)}
            placeholder="Enter street address"
          />
        </View>

        {/* City */}
        <View style={settingsStyles.formGroup}>
          <Text style={settingsStyles.label}>City</Text>
          <TextInput
            style={settingsStyles.input}
            value={formData.city}
            onChangeText={(text) => handleChange("city", text)}
            placeholder="Enter city"
          />
        </View>

        {/* State */}
        <View style={settingsStyles.formGroup}>
          <Text style={settingsStyles.label}>State</Text>
          <TextInput
            style={settingsStyles.input}
            value={formData.state}
            onChangeText={(text) => handleChange("state", text)}
            placeholder="Enter state"
          />
        </View>

        {/* Zip Code */}
        <View style={settingsStyles.formGroup}>
          <Text style={settingsStyles.label}>Zip Code</Text>
          <TextInput
            style={settingsStyles.input}
            value={formData.zipcode}
            onChangeText={(text) => handleChange("zipcode", text)}
            placeholder="Enter zip code"
          />
        </View>

        {/* Country */}
        <View style={settingsStyles.formGroup}>
          <Text style={settingsStyles.label}>Country</Text>
          <TextInput
            style={settingsStyles.input}
            value={formData.country}
            onChangeText={(text) => handleChange("country", text)}
            placeholder="Enter country"
          />
        </View>

        {/* Phone Number */}
        <View style={settingsStyles.formGroup}>
          <Text style={settingsStyles.label}>Phone Number</Text>
          <TextInput
            style={settingsStyles.input}
            value={formData.phone_number}
            onChangeText={(text) => handleChange("phone_number", text)}
            placeholder="Enter phone number"
          />
        </View>

        {/* Submit Button */}
        <View style={settingsStyles.submitButtonContainer}>
          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={!formIsValid}
            color={formIsValid ? "#007BFF" : "#CCC"}
          />
        </View>
      </ScrollView>

    </View>
  );
};

export default VenueInfoScreen;