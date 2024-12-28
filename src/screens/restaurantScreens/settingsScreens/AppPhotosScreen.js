import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../../styles/Constants';
import { useRestaurantAuth } from "../../../context/RestaurantContext";
import * as ImagePicker from "expo-image-picker";

const AppPhotosScreen = () => {
  const { allTags } = useRestaurantAuth(); // Assuming `allTags` is an array of tag objects with `id` and `name`.
  const [selectedTags, setSelectedTags] = useState([]);
  const [logo, setLogo] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);

  const handleTagToggle = (tagName) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagName)) {
        return prev.filter((tag) => tag !== tagName); // Remove if already selected
      } else if (prev.length < 5) {
        return [...prev, tagName]; // Add if less than 5 selected
      }
      return prev; // Prevent adding more than 5 tags
    });
  };

const handleImageSelect = async (setImage) => {
  // Request permissions
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (!permissionResult.granted) {
    alert("Permission to access the gallery is required!");
    return;
  }

  console.log("Permission granted. Launching image library...");

  // Launch image library
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'], // Use 'photo' for images only
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log("ImagePicker result:", result);

  if (!result.canceled) {
    const selectedImageUri = result.assets[0]?.uri;
    console.log("Selected Image URI:", selectedImageUri);
    setImage(selectedImageUri);
  } else {
    console.log("ImagePicker was canceled.");
  }
};


  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.title}>App Photos & Tags</Text>
      <Text style={styles.subtitle}>
        This determines where & how users will see you in the app.
      </Text>
      <View style={styles.horizontalLine} />
      
      <Text style={styles.sectionTitle}>Upload Your Photos</Text>

      {/* Logo Upload */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Logo</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleImageSelect(setLogo)}
        >
          {logo ? (
            <Image source={{ uri: logo }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.uploadText}>Upload Logo</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Cover Picture Upload */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Cover Picture</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleImageSelect(setCoverPicture)}
        >
          {coverPicture ? (
            <Image source={{ uri: coverPicture }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.uploadText}>Upload Cover Picture</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Tag Selection */}
      <View>
        <Text style={styles.sectionTitle}>Select your most relevant tags (Up to 5)</Text>
        <View style={styles.tagContainer}>
          {allTags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagButton,
                selectedTags.includes(tag.name) && styles.activeTagButton,
              ]}
              onPress={() => handleTagToggle(tag.name)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedTags.includes(tag.name) && styles.activeTagText,
                ]}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text
          style={[
            styles.tagInfoText,
            selectedTags.length > 5 && { color: "red" },
          ]}
        >
          {selectedTags.length > 5
            ? "You can only select up to 5 tags."
            : `Selected ${selectedTags.length}/5 tags.`}
        </Text>
      </View>
      </ScrollView>
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
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
    width: "80%",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.mainFontColor,
    fontWeight: 600,
    marginBottom: 30,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
  tagButton: {
    borderWidth: 1,
    borderColor: Colors.lighestGrey,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: Colors.lighestGrey,
  },
  activeTagButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagText: {
    color: Colors.mainFontColor,
    fontWeight: "bold",
  },
  activeTagText: {
    color: "white",
  },
  tagInfoText: {
    fontSize: 12,
    marginTop: 10,
    color: "gray",
  },
  uploadButton: {
    height: 150,
    width: 150,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  uploadText: {
    fontSize: 14,
    color: "#888",
  },
  imagePreview: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
});

export default AppPhotosScreen;
