import React, {useState} from 'react';
import {
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RNCamera} from 'react-native-camera';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProcessingLoader from '../components/ProcessingLoader';
import ic_cross_white from '../assets/icons/ic_cross_white.png';
import ic_camera_snap from '../assets/icons/ic_camera_snap.png';
import {getData, KEYS} from '../api/UserPreference';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
const UpdateUserPhoto = props => {
  const [isLoading, setLoading] = useState(false);
  const {navigation} = props;
  let cameraRef = null;
  const setCameraRef = ref => {
    cameraRef = ref;
  };
  const handleClose = () => {
    navigation.pop();
  };
  const handleSnap = async () => {
    // const userInfo = await getData(KEYS.USER_INFO);

    // const {ezypayrollId, user} = userInfo;
    // const {id: userId} = user;

    // // preparing params
    // const params = {
    //   ezypayrollId,
    //   userId,
    // };
    // const response = await makeRequest(BASE_URL + 'userProfile', params);

    // console.log('snap data', response);
    // const {profile} = props.isProfileget;
    // const {fName, lName, dob, emailNewsLetter, emailRelatedEvents, gender} =
    //   profile;
    try {
      if (cameraRef) {
        const options = {quality: 0.5};
        cameraRef.resumePreview();
        const data = await cameraRef.takePictureAsync(options);

        setLoading(true);
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        const photo = data;
        const visitorPhoto = {
          uri: photo.uri,
          type: 'image/jpeg',
          name: 'visitor_photo.jpg',
          size: 100,
        };
        // calling api
        const userInfo = props.userInfo;
        // const userInfo = await getData(KEYS.USER_INFO);
        // const formData = new FormData();

        // formData.append('userId', userInfo.userId);
        // formData.append('fName', fName);
        // formData.append('lName', lName);
        // formData.append('gender', gender);
        // formData.append('dob', dob);
        // formData.append('image', visitorPhoto);
        // formData.append('emailRelatedEvents', emailRelatedEvents);
        // formData.append('emailNewsLetter', emailNewsLetter);
        const params = {
          userId: userInfo.userId,
          image: visitorPhoto,
        };
        console.log('params', params);
        const response = await makeRequest(BASE_URL + 'updateProImage', params);
        if (response.success) {
          // Updating user info in local persistence
          // props.saveLoggedInUser(isProfileUpdated.profile);
          // stopping loader
          Alert.alert('', response.message);
          props.navigation.goBack();
          this.setState({showProcessingLoader: false});
        }
      } else {
        this.setState({showProcessingLoader: false});
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return isLoading ? (
    <ProcessingLoader />
  ) : (
    <SafeAreaView style={styles.container}>
      <RNCamera
        ref={setCameraRef}
        style={styles.cameraPreview}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
      />

      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Image
          source={ic_cross_white}
          resizeMode="cover"
          style={styles.closeButtonIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSnap} style={styles.snapButton}>
        <Image
          source={ic_camera_snap}
          resizeMode="cover"
          style={styles.snapButtonIcon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UpdateUserPhoto;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  cameraPreview: {
    height: Dimensions.get('window').height,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: wp(5),
    right: wp(4),
  },
  closeButtonIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
    marginTop: hp(6),
  },
  snapButton: {
    position: 'absolute',
    bottom: hp(2.5),
    alignSelf: 'center',
  },
  snapButtonIcon: {
    height: wp(14),
    aspectRatio: 1 / 1,
  },
});
