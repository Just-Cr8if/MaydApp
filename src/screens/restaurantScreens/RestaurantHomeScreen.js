import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, Animated,
    StyleSheet, Linking, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions } from 'react-native';
import { useRestaurantAuth } from "../../context/RestaurantContext";


const RestaurantHomeScreen = ({navigation}) => {
    const { venue } = useRestaurantAuth();
    const [emailAddress, setEmailAddress] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { width } = Dimensions.get('window');
    const isLargeScreen = width >= 768;

    return (
        <SafeAreaView style={styles.container}>

        </SafeAreaView>
    )
}

export default RestaurantHomeScreen;

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
      alignItems: 'center',
    },

});