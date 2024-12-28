import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "./Constants";

export const settingsStyles = StyleSheet.create({
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
        marginVertical: 16,
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
});