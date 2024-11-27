import React, { useEffect, useRef, useContext } from 'react';
import { View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const LottieLoadingAnimation = ({ visible, position, white, customTop, relative }) => {
  
const animationRef = useRef(null);

  useEffect(() => {
    if (visible) {
      animationRef.current?.play();
    } else {
      animationRef.current?.reset();
    }
  }, [visible]);

  return (
    visible && (
      <View style={{ alignSelf: position, width: 100, height: screenHeight*.08, position: relative ? 'relative' : 'absolute', top: customTop ? customTop : 0, zIndex: 99}}>
        <LottieView
          ref={animationRef}
          loop
          source={require('../../../assets/animation_json_files/LoadingAnimation.json')}
          style={{height: screenHeight*.08, width: 100, alignSelf: 'center'}}
        />
      </View>
    )
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default LottieLoadingAnimation;