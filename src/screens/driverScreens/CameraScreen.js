import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function CameraScreen({ navigation, route }) {
  const { uploadDeliveryPhoto } = useAuth();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isPermissionLoading, setIsPermissionLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  const { driverId, orderIds } = route.params;

  useEffect(() => {
    (async () => {
      if (!permission) {
        setIsPermissionLoading(true);
        await requestPermission();
        setIsPermissionLoading(false);
      }
    })();
  }, [permission]);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      return photo.uri;
    }
  };

  const handleCapture = async () => {
    try {
      const uri = await takePhoto();
      setPhotoUri(uri);
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const handleRetake = () => {
    setPhotoUri(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await uploadDeliveryPhoto(photoUri, driverId, orderIds);
      navigation.goBack();
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  if (isPermissionLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission) {
    // This should rarely happen due to the useEffect hook
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  if (isSubmitting) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Submitting photo...</Text>
      </View>
    );
  }

  if (photoUri) {
    // Display the captured photo with "Retake" and "Submit" buttons
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRetake}>
            <Text style={styles.text}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.text}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Default: Display the camera view with "Take Photo" button
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCapture}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  button: {
    marginHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});