import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {getUniqueId} from 'react-native-device-info';
import {KEYS, getData, storeData} from '../api/UserPreference';

const uploadToken = async fcmToken => {
  try {
    // fetching userInfo from local storage
    const userInfo = await getData(KEYS.USER_INFO);
    console.log('User Info:', userInfo);

    if (userInfo) {
      // Get unique device ID
      const uniqueId = await getUniqueId();
      console.log('Unique Device ID:', uniqueId);

      const {ezypayrollId, user} = userInfo;
      const {id: userId} = user;

      // preparing params
      const params = {
        ezypayrollId,
        userId,
        uniqueDeviceId: uniqueId,
        token: fcmToken,
      };

      console.log('Params:', params);

      // calling api
      const response = await makeRequest(BASE_URL + 'uploadToken', params);
      console.log('Response:', response);

      if (response.success) {
        userInfo.uniqueDeviceId = uniqueId;
        await storeData(KEYS.USER_INFO, userInfo);
      }
      return response;
    }
  } catch (error) {
    console.log('Error:', error.message);
    return null;
  }
};

export default uploadToken;
