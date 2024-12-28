import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../styles/Constants';

const SettingsModal = ({ isModalVisible, setIsModalVisible, modalTitle, modalContent }) => {

    const closeModal = () => setIsModalVisible(false);


  return (
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Image 
                    source={require('../../images/close-icon.png')}
                    style={{width: 20, height: 20}}
                />
            </TouchableOpacity>
            <Text style={styles.modalHeader}>{modalTitle}</Text>
            {modalContent}
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '95%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.mainFontColor,
    alignSelf: 'flex-start',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16
  },
});

export default SettingsModal;
