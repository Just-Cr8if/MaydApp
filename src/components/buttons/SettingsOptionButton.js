import React from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, Animated,
    StyleSheet, Linking, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions, TouchableWithoutFeedback} from 'react-native';
import { Colors } from "../../styles/Constants";

const SettingsOptionButton = ({ title, imageSource, onPress }) => {
  return (
    <TouchableWithoutFeedback
        onPress={onPress}
    >
        <View style={styles.optionButton}>
            <View style={styles.optionButtonImageAndTextContainer}>
                <Image 
                    source={imageSource}
                    style={{width: 25, height: 25, marginRight: 16}}
                />
                <Text style={styles.optionButtonText}>{title}</Text>
            </View>
            <View>
                <Image 
                    source={require('../../images/chevron-right.png')}
                    style={{width: 30, height: 30}}
                />
            </View>
        </View>
    </TouchableWithoutFeedback>
  );
};

export default SettingsOptionButton;

const styles = StyleSheet.create({
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16
    },
    optionButtonImageAndTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionButtonText: {
        fontSize: 16,
        color: Colors.mainFontColor,
        marginLeft: 16,
    }
});