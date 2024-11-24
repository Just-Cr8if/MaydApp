import React from "react";
import { StyleSheet, Dimensions } from "react-native";

const mainColor = "#00A6FF";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const baseStyles = StyleSheet.create({
    screenWidth: {
        width: screenWidth,
    }
});
