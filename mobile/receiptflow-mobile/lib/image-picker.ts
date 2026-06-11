const ImagePicker = require('expo-image-picker') as typeof import('expo-image-picker');

export default ImagePicker;

export const {
  MediaTypeOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} = ImagePicker;
