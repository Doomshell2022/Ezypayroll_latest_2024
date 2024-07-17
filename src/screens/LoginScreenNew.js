import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  ScrollView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// responsive
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import firebase from 'react-native-firebase';

// Components
import ProcessingLoader from '../components/ProcessingLoader';
import {colors} from '../assets/colors/colors';
import {showToast} from '../components/ToastComponent';

// Image
import logo_black from '../assets/images/logo_black.png';
import background from '../assets/images/background.png';

// import background from '../assets/images/background.png';
import ic_mail_black from '../assets/icons/ic_mail_black.png';
import ic_password_black from '../assets/icons/ic_password_black.png';
import ic_google from '../assets/icons/ic_google.png';
import ic_linkedin from '../assets/icons/ic_linkedin.png';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

//Styles
import basicStyles from '../styles/BasicStyles';

// Validations
import {isEmailAddress} from '../validations/FormValidator';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {KEYS, storeData} from '../api/UserPreference';
import {getUniqueId} from 'react-native-device-info';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showProcessingLoader: false,
    };
  }

  componentDidMount() {
    //initial configuratio

    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId generated from Firebase console
      webClientId:
        '974529444732-ijt0edq0mu77konvd98ap58re25hv8u4.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
    //Check if user is already signed in
    this._isSignedIn();
  }

  handleLogin = async () => {
    Keyboard.dismiss();
    const fcmToken = await firebase.messaging().getToken();
    const uniqueId = await getUniqueId();

    const {email, password} = this.state;

    // Validating form
    if (!isEmailAddress(email)) {
      Alert.alert('Alert!', 'Please enter a valid email', [{text: 'OK'}]);
      return;
    }

    // Validating form
    if (password.trim() === '') {
      Alert.alert('Alert!', 'Please enter Password', [{text: 'OK'}]);
      return;
    }

    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // preparing request params
      const params = {
        email,
        password,
        token: fcmToken,
        imei: uniqueId,
      };
      // calling api
      const response = await makeRequest(BASE_URL + 'userLogin', params);

      // processing response
      if (response) {
        // stopping loader
        this.setState({showProcessingLoader: false});
        const {request} = response;
        if (request === true) {
          const {message} = response;
          showToast(message);
          Alert.alert(
            '',
            'Are you sure you want to Register new device to use Ezypayroll',
            [
              {
                text: 'No',
                onPress: () => console.log('No Pressed'),
                style: 'cancel',
              },
              {text: 'Yes', onPress: () => this.onsendhrrequest()},
            ],
          );
        }
        const {success} = response;
        if (success) {
          // navigating to Otp screen
          const {userInfo} = response;

          this.props.navigation.navigate('EnterPin', {userInfo});
        } else {
          const {message} = response;
          showToast(message);
          // Alert.alert('', message, [{text: 'OK'}], {
          //   cancelable: false,
          // });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  onsendhrrequest = async () => {
    const {email, password} = this.state;
    this.setState({showProcessingLoader: true});

    // preparing request params
    const params = {
      email,
      password,
    };
    // calling api
    const response = await makeRequest(BASE_URL + 'changeDeviceReq', params);
    // console.log('646464646', response);
    if (response.success) {
      const {message} = response;
      this.setState({showProcessingLoader: false});
      showToast(message);
    } else {
      const {message} = response;
      this.setState({showProcessingLoader: false});
      showToast(message);
    }
  };
  handleEmail = changedText => {
    this.setState({email: changedText});
  };

  handlePassword = changedText => {
    this.setState({password: changedText});
  };

  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();

    if (isSignedIn) {
      Alert.alert('User is already signed in');
      //Get the User details as user is already signed in
      // this._getCurrentUserInfo();
    } else {
      //alert("Please Login");
      // console.log('Please Login');
    }
    this.setState({gettingLoginStatus: false});
  };

  _getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log('User Info --> ', userInfo);
      this.props.navigation.navigate('Home');
      this.setState({userInfo: userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        Alert.alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        Alert.alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

  _signIn = async () => {
    //Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });

      let data = await GoogleSignin.signIn();

      const credential = firebase.auth.GoogleAuthProvider.credential(
        data.idToken,
        data.accessToken,
      );
      // login with credential
      const firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);

      const userInfo = await GoogleSignin.signIn();
      console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
      // this.props.navigation.navigate('LoggedIn');
      //this.setState({ userInfo: userInfo });
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  _signOut = async () => {
    //Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({userInfo: null}); // Remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  // onLogout = () => {
  //   //Clear the state after logout
  //   this.setState({user_name: null, token: null, profile_pic: null});
  // };
  handleForgetPassword = () => {
    try {
      this.props.navigation.navigate('ForgotPassword');
    } catch (error) {
      return;
    }
  };
  render() {
    const {showProcessingLoader} = this.state;
    const {lightGreyPrimary} = colors;

    return (
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={{flex: 1, justifyContent: 'center'}}>
        <View style={styles.container}>
          <View style={styles.loginContainer}>
            <KeyboardAwareScrollView
              enableOnAndroid
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{height: hp(70), justifyContent: 'center'}}
              showsVerticalScrollIndicator={false}>
              <Image
                source={logo_black}
                resizeMode="cover"
                style={styles.logoStyle}
              />
              <View style={styles.inputContainer}>
                <Image
                  source={ic_mail_black}
                  resizeMode="cover"
                  style={basicStyles.iconRow}
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="Email"
                  placeholderTextColor={lightGreyPrimary}
                  value={this.state.email}
                  onChangeText={this.handleEmail}
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={ic_password_black}
                  resizeMode="cover"
                  style={basicStyles.iconRow}
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="Password"
                  value={this.state.password}
                  secureTextEntry={true}
                  placeholderTextColor={lightGreyPrimary}
                  onChangeText={this.handlePassword}
                />
              </View>

              {/* <TouchableOpacity
              // onPress={this.handleLogin}
              style={styles.forgotButton}
              underlayColor="transparent">
              <Text style={styles.forgotButtonText}>Forgot Password?</Text>
            </TouchableOpacity> */}

              {/* <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginTop,
              ]}>
              <View
                style={[
                  basicStyles.separatorHorizontal,
                  basicStyles.marginRight,
                  basicStyles.flexOne,
                ]}
              />
              <Text>Login With</Text>
              <View
                style={[
                  basicStyles.separatorHorizontal,
                  basicStyles.marginLeft,
                  basicStyles.flexOne,
                ]}
              />
            </View> */}

              {/* <TouchableOpacity
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                styles.googleButton,
              ]}>
              <Image
                source={ic_google}
                resizeMode="cover"
                style={basicStyles.iconRow}
              />
              <Text style={[basicStyles.flexOne, basicStyles.textAlign]}>
                Sign in with Google
              </Text>
            </TouchableOpacity> */}

              {/* <GoogleSigninButton
              style={{width: wp(90), height: hp(6.5), marginTop: hp(2)}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={this._signIn}
            /> */}

              {/* <TouchableOpacity
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                styles.linkedinButton,
              ]}>
              <Image
                source={ic_linkedin}
                resizeMode="cover"
                style={basicStyles.iconRow}
              />
              <Text
                style={[
                  basicStyles.flexOne,
                  basicStyles.textAlign,
                  basicStyles.whiteColor,
                ]}>
                Sign in with LinkedIn
              </Text>
            </TouchableOpacity> */}
              <TouchableOpacity onPress={this.handleForgetPassword}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: wp(2),
                  }}>
                  <Text style={{color: darkGreyPrimary}}>Forgot Password?</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleLogin}
                style={styles.loginButton}
                underlayColor="transparent">
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </View>
          {showProcessingLoader && <ProcessingLoader />}
        </View>
      </ImageBackground>
    );
  }
}

const {darkGreyPrimary, lightBluePrimary, whitePrimary} = colors;

const styles = StyleSheet.create({
  container: {
    padding: wp(5),
    justifyContent: 'center',
  },
  loginContainer: {
    // flexDirection: 'row',
    // flex: 1,
    // borderWidth: 5,
    // paddingVertical: hp(5),
  },

  logoStyle: {
    height: hp(10),
    aspectRatio: 2 / 1,
    alignSelf: 'center',
  },

  inputContainer: {
    marginTop: hp(3),
    flexDirection: 'row',
    height: hp(5.8),
    paddingLeft: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc8',
    alignItems: 'center',
  },

  inputTextStyle: {
    color: '#0077a2',
    paddingTop: hp(2.5),
    paddingLeft: wp(1),
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },

  inputField: {
    flex: 1,
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: hp(3),
    fontSize: wp(3),
    color: darkGreyPrimary,
  },

  loginButton: {
    marginTop: hp(2),
    backgroundColor: '#e14d4d',
    height: hp(5.5),
    paddingHorizontal: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(3),
  },
  buttonText: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  forgotButtonText: {
    color: '#e14d4d',
    textAlign: 'center',
    marginVertical: hp(2),
  },
  googleButton: {
    marginTop: hp(3),
    borderWidth: 1,
    borderColor: '#ccc8',
    height: hp(6),
    paddingHorizontal: wp(3),
    borderRadius: 3,
  },
  linkedinButton: {
    marginTop: hp(3),
    backgroundColor: '#0077b7',
    height: hp(6),
    paddingHorizontal: wp(3),
    borderRadius: 3,
  },
});
