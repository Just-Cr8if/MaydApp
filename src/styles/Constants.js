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
  lighestGrey: "#F2F2F2",
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
  safeAreaSpacing: 60
};

export const Fonts = {
  regular: 400,
  semiBold: 500,
  bold: 700,
  sizePhoneSmall: 12,
  sizeIpadSmall: 16,
  sizePhoneSmallMedium: 14,
  sizeIpadSmallMedium: 18,
  sizePhoneRegular: 16,
  sizeIpadRegular: 20,
  sizePhoneAA: 18,
  sizeIpadAA: 22,
  sizePhoneLarge: 20,
  sizeIpadLarge: 24,
  sizePhoneExtraLarge: 24,
  sizeIpadExtraLarge: 28,
  sizePhoneSuper: 26,
  sizeIpadSuper: 32
};

export const Layout = {
  screenHeight,
  screenWidth,
};