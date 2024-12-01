import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView,
  Dimensions, Platform, StatusBar } from 'react-native';

const CustomHeader = ({ title, onBackPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Image
          source={require('../../images/MM-chevron-back.png')}
          style={{ width: 28, height: 28}}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title?.length > 40 ? title.substring(0, 40) + '..' : title}</Text>
    </View>
  );
};

const charcoal = "#36454F";
const ITEM_HEIGHT = 50;
const lightgrey = "#E5E4E2";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    height: 50,
    borderBottomColor: charcoal,
    borderBottomWidth: 0.2,
    width: screenWidth,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'white'
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomHeader;