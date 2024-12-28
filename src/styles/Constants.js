// styles.js
import { Dimensions, Platform } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export const Colors = {
  primary: '#00A6FF',
  primaryOpaque: 'rgba(0, 166, 255, 0.5)',
  mainFontColor: '#414552',

  white: 'white',
  lightModeLightGrey: '#EBEBEB',
  lightgrey: "#E5E4E2",
  disabledGrey: 'grey',
  buttonGrey: '#E1DFDB',

  darkModeBlack: '#151414',
  charcoal: "#36454F",

  mintColor: "#3EB489",
  red: "#C1251F",
};

export const Sizing = {
  tabIconsWidth: 30,
  tabIconsHeight: 30
}

export const LargeSizing = {
  tabIconsWidth: 30,
  tabIconsHeight: 30
}

export const Spacing = {
  small: 8,
  medium: 16,
  large: 24,
};

export const Fonts = {
  regular: 400,
  semiBold: 500,
  bold: 700,
  sizeSmall: 12,
  sizeMedium: 16,
  sizeLarge: 20,
};

export const Layout = {
  screenHeight,
  screenWidth,
};