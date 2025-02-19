import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView,
  Dimensions, Platform, StatusBar } from 'react-native';
import { toTitlecase } from '../../../utils/utilityFunctions';
import { useNavigation } from '@react-navigation/native';
import { Colors, Layout, Fonts } from '../../styles/Constants';

const CustomHeader = ({ title }) => {
  const nav = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
        <Image
          source={require('../../images/MM-chevron-back.png')}
          style={{ width: 28, height: 28}}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{toTitlecase(title?.length > 40 ? title.substring(0, 40) + '..' : title)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    height: 50,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    width: Layout.screenWidth,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'white'
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontWeight: '500',
    fontSize: Fonts.sizePhoneRegular,
  },
});

export default CustomHeader;