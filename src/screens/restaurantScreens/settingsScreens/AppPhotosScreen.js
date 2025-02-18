import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image
 } from 'react-native';
import { Colors } from '../../../styles/Constants';
import { useRestaurantAuth } from "../../../context/RestaurantContext";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
import Button from '../../../components/buttons/Button';
import CustomHeader from '../../../components/helperComponents/CustomHeader';
import { settingsStyles } from '../../../styles/settingsStyles';

const AppPhotosScreen = () => {
  const { allTags, createVenuePhotoAndTags, updateVenuePhotoAndTags,
    getVenuePhotoAndTags
   } = useRestaurantAuth();
  const [formData, setFormData] = useState({
    dress_code: "",
    logo: null,
    picture: null,
  });
  const [preview, setPreview] = useState({
    logoPreview: null,
    picturePreview: null,
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [logo, setLogo] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [isCreating, setIsCreating] = useState(true);
  const nav = useNavigation();

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const data = await getVenuePhotoAndTags();

        const hasExistingData =
          (data.venue_tag && (data.venue_tag.dress_code || data.venue_tag.tags?.length)) ||
          (data.venue_photo && (data.venue_photo.logo || data.venue_photo.picture));

        setIsCreating(!hasExistingData);

        setFormData({
          dress_code: data.venue_tag?.dress_code || "",
          logo: null,
          picture: null,
        });

        setPreview({
          logoPreview: data.venue_photo?.logo || null,
          picturePreview: data.venue_photo?.picture || null,
        });

        setSelectedTags(data.venue_tag?.tags || []);
      } catch (error) {
        console.error("Error fetching venue data:", error);
      }
    };

    fetchVenueData();
  }, []);

  const handleImageSelect = async (setImage, previewKey) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["photo"],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0]?.uri;
      setFormData((prev) => ({ ...prev, [previewKey]: selectedImageUri }));
      setPreview((prev) => ({ ...prev, [`${previewKey}Preview`]: selectedImageUri }));
    }
  };

  const handleTagToggle = (tagName) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagName)) {
        return prev.filter((tag) => tag !== tagName);
      } else if (prev.length < 5) {
        return [...prev, tagName];
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    try {
      let changedFiles = 0;

      if (formData.logo && preview.logoPreview !== formData.logo) {
        changedFiles++;
      }
      if (formData.picture && preview.picturePreview !== formData.picture) {
        changedFiles++;
      }

      const dataToSubmit = new FormData();
      dataToSubmit.append("dress_code", formData.dress_code);
      if (formData.logo) dataToSubmit.append("logo", formData.logo);
      if (formData.picture) dataToSubmit.append("picture", formData.picture);
      selectedTags.forEach((tag) => dataToSubmit.append("tags[]", tag));

      if (isCreating) {
        await createVenuePhotoAndTags(dataToSubmit);
      } else {
        await updateVenuePhotoAndTags(dataToSubmit);
      }
      console.log("Form submitted successfully!");
      nav.goBack();
      
    } catch (error) {
      console.error("Error submitting form:", error);
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
      <Text style={settingsStyles.title}>App Photos & Tags</Text>
      <Text style={settingsStyles.subtitle}>
        This determines where & how users will see you in the app.
      </Text>
      <Text style={styles.sectionTitle}>Dress Code</Text>
      <View style={styles.pickerContainer}>
        <Picker
            selectedValue={formData.dress_code}
            onValueChange={(itemValue) =>
              setFormData((prev) => ({ ...prev, dress_code: itemValue }))
            }
        >
          <Picker.Item label="Casual" value="Casual" />
          <Picker.Item label="Smart Casual" value="Smart Casual" />
          <Picker.Item label="Business Casual" value="Business Casual" />
          <Picker.Item label="Semi-Formal" value="Semi-Formal" />
          <Picker.Item label="Jacket Required" value="Jacket Required" />
        </Picker>
      </View>
      <Text style={styles.selectedText}>Selected: {formData?.dress_code || "Casual"}</Text>
      
      <View style={settingsStyles.horizontalLine} />

      <Text style={styles.sectionTitle}>Upload Your Photos</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
        {/* Logo Upload */}
        <View style={styles.formGroup}>
          <Text style={settingsStyles.label}>Logo</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleImageSelect((uri) => setFormData({ ...formData, logo: uri }), "logo")}
          >
            {preview.logoPreview ? (
              <Image source={{ uri: preview.logoPreview }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.uploadText}>Upload Logo</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Cover Picture Upload */}
        <View style={styles.formGroup}>
          <Text style={settingsStyles.label}>Cover Picture</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() =>
              handleImageSelect(
                (uri) => setFormData({ ...formData, picture: uri }),
                "picture"
              )
            }
          >
            {preview.picturePreview ? (
              <Image source={{ uri: preview.picturePreview }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.uploadText}>Upload Cover Picture</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={settingsStyles.horizontalLine} />

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
      <View style={settingsStyles.submitButtonContainer}>
        <Button title="Submit" onPress={handleSubmit} disabled={selectedTags.length > 5} />
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: Colors.lighestGrey,
    minWidth: 160,
  },
  activeTagButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagText: {
    color: Colors.mainFontColor,
    fontWeight: "600",
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
  submitButtonContainer: {
    marginBottom: 50,
    marginTop: 20,
  }
});

export default AppPhotosScreen;
