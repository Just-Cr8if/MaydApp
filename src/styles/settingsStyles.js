import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "./Constants";

export const settingsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 50
      },
      title: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 10,
        marginTop: 20,
      },
      subtitle: {
        fontSize: 14,
        color: "gray",
        marginBottom: 18,
        width: "100%",
      },
      horizontalLine: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 16,
      },
      label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
      },
      submitButtonContainer: {
        marginBottom: 50,
        marginTop: 20,
      },
      scrollViewPadding: {
        paddingHorizontal: 20,
      }
});
