import AsyncStorage from '@react-native-async-storage/async-storage';

// User Preferences Keys
export const KEYS = {
  USER_INFO: 'userInfo',
  FCM_TOKEN: 'fcmToken',
  DEVICE_UNIQUE_ID: 'deviceId',
  user_pin: 'user_pin',
  // ADMIN_ID: 'admin_id',
};
// User Preferences Methods
export const storeData = async (key, data) => {
  try {
    const info = JSON.stringify(data);
    await AsyncStorage.setItem(key, info);
    console.log('Info-->', info);
  } catch (error) {
    console.log(error.message);
  }
};

export const getData = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    const info = JSON.parse(data);
    return info;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const clearData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error.message);
  }
};
