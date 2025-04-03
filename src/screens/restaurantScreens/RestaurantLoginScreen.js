import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, Animated,
    StyleSheet, Linking, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import LottieLoadingAnimation from '../../components/animations/LottieLoadingAnimation';
import LargeButton from "../../components/buttons/LargeButton";
import { PageContainer, PageBody } from "../../components/helperComponents/PageElements";


const RestaurantLoginScreen = ({navigation}) => {
  const { restaurantLogin, restaurantIsLoggingIn, errorMessage, 
    setErrorMessage} = useRestaurantAuth();
  const [emailAddress, setEmailAddress] = useState(null);
  const [password, setPassword] = useState(null);
  const [venueId, setVenueId] = useState(null);
  const { width } = Dimensions.get('window');
  const isLargeScreen = width >= 768;

  const openLink = async (url) => {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    };

    useEffect(() => {
      const timeoutId = setTimeout(() => {
          setErrorMessage(null);
      }, 2000);

      return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  const renderLoginForm = () => (
      <Animated.View>
        <Text style={styles.pageHeader}>Sign In</Text>
        <View style={{ width: '100%'}}>
          <View style={{ height: 40 }}>
              {errorMessage &&
              <Text style={styles.error}>
                  {errorMessage}
              </Text>}
          </View>
          <Text style={styles.fieldHeader}>EMAIL</Text>
          <TextInput
            placeholder="Enter Email Address"
            value={emailAddress}
            style={styles.input}
            onChangeText={(text) => setEmailAddress(text.toLocaleLowerCase())}
            placeholderTextColor={'grey'}
          />
        </View>
        <View style={{ width: '100%'}}>
          <Text style={styles.fieldHeader}>PASSWORD</Text>
          <TextInput
            placeholder="Enter Password"
            value={password}
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            placeholderTextColor={'grey'}
          />
        </View>
        <View style={{ width: '100%' }}>
          <Text style={styles.fieldHeader}>VENUE ID - OWNER ONLY</Text>
          <TextInput
            placeholder="Venue ID"
            value={venueId}
            style={styles.smallInput}
            onChangeText={(text) => setVenueId(text)}
            placeholderTextColor={'grey'}
          />
        </View>
        <TouchableOpacity
          onPress={() => openLink('https://www.mobylmenu.com/password-reset/')}
          style={{ marginVertical: 10, alignSelf: 'flex-end' }}
        >
          <Text style={[styles.link]}>FORGOT PASSWORD?</Text>
        </TouchableOpacity>
        <LargeButton
          title="Sign In"
          isLoading={restaurantIsLoggingIn}
          onPress={async () => {
              await restaurantLogin(emailAddress, password, venueId);
          }}
        />
        <View style={styles.subContainer}>
        <View style={styles.row}>
          <View style={styles.line} />
          <Text style={styles.text}>NEW TO MOBYLMENU?</Text>
          <View style={styles.line} />
        </View>
        </View>
        <LargeButton title="Register" alternateColor={'#4C4B50'}/>
      </Animated.View>
    );

    return (
        <PageContainer>
          <StatusBar style="auto" backgroundColor={"white"} foregroundColor={"black"} />
          <PageBody>
            <LottieLoadingAnimation visible={restaurantIsLoggingIn} position={'flex-start'} customTop={25}/>
            <Image style={styles.mobylMenuLogo} source={require('../../images/mobylmenu-app.png')} />
            {renderLoginForm()}
          </PageBody>
        </PageContainer>
    )
}

export default RestaurantLoginScreen;

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
    logo: {
        width: 75,
        height: 75,
        borderRadius: 50,
    },
    mobylMenuLogo: {
        width: 200,
        height: 56,
        marginVertical: 35,
        alignSelf: 'flex-start',
        marginLeft: 20
    },
    title: {
        color: mainColor,
        marginBottom: 50,
        fontSize: 30,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 10,
        paddingLeft: 15,
        height: 50,
        width: '100%',
        fontSize: 18
    },
    darkInput: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: mainColorO,
        borderRadius: 10,
        paddingLeft: 15,
        height: 60,
        color: 'white',
        width: '100%',
        fontSize: 18,
        backgroundColor: darkColor
    },
    smallInput: {
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#000000',
      borderRadius: 10,
      paddingLeft: 15,
      height: 50,
      width: 180,
      fontSize: 18
    },
    pageHeaderDark: {
      color: 'white',
      fontSize: 30,
      fontWeight: '700',
      marginBottom: 55,
      alignSelf: 'flex-start'
    },
    pageHeader: {
      fontSize: 30,
      fontWeight: '700',
      marginBottom: 15,
      alignSelf: 'flex-start'
    },
    fieldHeaderDark: {
      color: 'grey',
      marginBottom: 10,
      marginLeft: 5,
      alignSelf: 'flex-start',
      fontWeight: 700
    },
    fieldHeader: {
      color: 'grey',
      marginBottom: 10,
      marginLeft: 5,
      alignSelf: 'flex-start',
      fontWeight: 700
    },
    text: {
        color: '#202124',
    },
    darkText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600'
    },
    link: {
        color: mint,
        fontSize: 13,
        fontWeight: '600'
    },
    row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10
  },
  line: {
    flex: .75,
    height: 1,
    backgroundColor: lightgrey,
    marginHorizontal: 10,
  },
  lineDark: {
    flex: .75,
    height: 1,
    backgroundColor: charcoal, 
    marginHorizontal: 10,
  },
    smallLink: {
        color: mint,
        fontSize: 15,
        fontWeight: '500'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600'
    },
    button: {
        color: mainColor,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        height: 30,
    },
    subContainer: {
        marginTop: 10,
        alignItems: 'center'
    },
    hint: {
        color: 'grey',
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 18
    },
    hintDark: {
        color: 'lightgrey',
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 18
    },

});