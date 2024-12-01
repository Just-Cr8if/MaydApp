import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity,
    StyleSheet, FlatList, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import CustomHeader from "../../components/helperComponents/CustomHeader";
import { useNavigation } from '@react-navigation/native';
import Button from "../../components/buttons/Button";

const RestaurantMenuScreen = ({ route, navigation }) => {
    const { menu, venue } = route.params || {};
    const { createMenu, updateMenu } = useRestaurantAuth();
    const [name, setName] = useState(menu?.name || '');
    const [menuNote, setMenuNote] = useState(menu?.menu_note || '');
    const [mainMenu, setMainMenu] = useState(menu?.main_menu || false);
    const nav = useNavigation();
  
    const [isFormValid, setIsFormValid] = useState(false);
  
    useEffect(() => {
      const isValid = name.length > 0 && name.length <= 100;
      setIsFormValid(isValid);
    }, [name]);
  
    const handleSave = async () => {
      const formData = {
        name,
        menu_note: menuNote,
        main_menu: mainMenu,
      };
  
      try {
        if (menu) {
          // Update menu
          await updateMenu(menu.id, formData);
          console.log("Menu updated:", formData);
        } else {
          // Create new menu
          await createMenu(formData);
          console.log("Menu created:", formData);
        }
        navigation.goBack();
      } catch (error) {
        console.error("Error saving menu:", error);
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
            title={venue?.venue_name}
            onBackPress={() => {
            nav.goBack();
            }}
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.label}>Menu Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter menu name"
          />
  
          <Text style={styles.label}>Menu Note</Text>
          <TextInput
            style={styles.inputNote}
            value={menuNote}
            onChangeText={setMenuNote}
            placeholder="Enter menu note"
            multiline
          />
  
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, mainMenu && styles.checkboxChecked]}
              onPress={() => setMainMenu(!mainMenu)}
            />
            <Text style={styles.checkboxLabel}>Set as Main Menu</Text>
          </View>
  
          <Button title="Save Menu" onPress={handleSave} disabled={!isFormValid} />
        </ScrollView>
      </SafeAreaView>
    );
  };

  const mainColor = "#00A6FF"
  const mainColorO = "rgba(0, 166, 255, 0.5)";
  const mint = "#3EB489";
  const darkColor = "#202124";
  const charcoal = "#36454F";
  const lightgrey = "#E5E4E2";
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff'
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 16,
      borderRadius: 4,
    },
    inputNote: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 16,
      borderRadius: 4,
    },
    image: {
      width: '100%',
      height: 200,
      marginBottom: 16,
    },
    button: {
      backgroundColor: mainColor,
      padding: 12,
      borderRadius: 4,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    button: {
      backgroundColor: mainColor,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    checkboxOuterContainer: {
      flexDirection: 'column',
    },
    checkboxRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10, 
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 3,
      marginRight: 10,
    },
    checkboxChecked: {
      backgroundColor: '#007BFF',
    },
    checkboxLabel: {
      fontSize: 14,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 20
    }
  });

export default RestaurantMenuScreen;