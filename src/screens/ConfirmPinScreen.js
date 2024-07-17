import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import SafeAreaView from 'react-native-safe-area-view';
// Colors
import {colors} from '../assets/colors/colors';

//  Components
import ProcessingLoader from '../components/ProcessingLoader';

// Image
import background from '../assets/images/background.png';
import ic_back from '../assets/icons/ic_back.png';
import logo_black from '../assets/images/logo_black.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, storeData} from '../api/UserPreference';

// Firebase API
import {checkPermission} from '../firebase_api/FirebaseAPI';

export default class ConfirmPinScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProcessingLoader: false,
    };
  }

  handleSavePin = async confirmPin => {
    try {
      const info = this.props.navigation.getParam('info', null);

      if (info) {
        const {pin} = info;

        if (pin === confirmPin) {
          // starting loader
          this.setState({showProcessingLoader: true});

          // preparing params
          const {userInfo} = info;
          const {ezypayrollId, user} = userInfo;
          const {id: userId, role} = user;

          const params = {
            ezypayrollId,
            userId,
            pin,
          };

          // calling api
          const response = await makeRequest(BASE_URL + 'setPin', params);

          // processing response
          if (response) {
            const {success, message} = response;

            if (success) {
              // persisting userInfo
              await storeData(KEYS.USER_INFO, userInfo);

              // checking firebase messaging permission
              // await checkPermission();

              // stopping loader
              this.setState({showProcessingLoader: false});

              // navigating to home screen
              if (role === 'admin') {
                this.props.navigation.navigate('LoggedInAdmin');
              } else {
                this.props.navigation.navigate('LoggedIn');
              }
            } else {
              // stopping loader
              this.setState({showProcessingLoader: false});

              Alert.alert('', message, [{text: 'OK'}], {
                cancelable: false,
              });
            }
          }
        } else {
          Alert.alert('Error', "PIN doesn't match", [{text: 'OK'}], {
            cancelable: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleBackButton = () => {
    this.props.navigation.pop();
  };

  render() {
    const {showProcessingLoader} = this.state;

    return (
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.container}>
          <TouchableOpacity
            onPress={this.handleBackButton}
            underlayColor="transparent"
            style={styles.backButtonContainer}>
            <View style={styles.backButtonStyle}>
              <Image
                source={ic_back}
                resizeMode="cover"
                style={styles.icButtonStyle}
              />
              <Text style={styles.buttonTextStyle}>Back</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.otpMainContainer}>
            <Image
              source={logo_black}
              resizeMode="cover"
              style={styles.logoStyle}
            />

            <Text style={styles.textPinStyle}> Confirm PIN </Text>

            <View style={styles.mainOtpContainer}>
              <OTPInputView
                style={styles.otpContainer}
                pinCount={4}
                autoFocusOnLoad
                secureTextEntry={true}
                placeholderCharacter="*"
                placeholderTextColor={colors.lightGreyPrimary}
                codeInputFieldStyle={styles.otpInputFieldStyle}
                codeInputHighlightStyle={styles.otpInputHighlightStyle}
                onCodeFilled={this.handleSavePin}
              />
            </View>
          </View>
          {showProcessingLoader && <ProcessingLoader />}
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const {darkGreyPrimary, lightBluePrimary} = colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoStyle: {
    height: hp(10),
    aspectRatio: 2 / 1,
  },
  textPinStyle: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    color: '#0077a2',
  },
  mainOtpContainer: {
    height: hp(10),
  },
  otpMainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpContainer: {
    width: wp(60),
    alignItems: 'center',
  },

  otpInputFieldStyle: {
    fontSize: wp(5),
    color: '#0077a2',
    borderColor: '#000',
    borderWidth: 1,
    // borderBottomColor: darkGreyPrimary,
  },

  otpInputHighlightStyle: {
    borderColor: '#0077a2',
  },

  backButtonContainer: {
    marginTop: hp(2),
    marginHorizontal: wp(4),
    alignSelf: 'flex-start',
  },
  backButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icButtonStyle: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
  },
  buttonTextStyle: {
    paddingLeft: wp(3),
    color: '#333',
  },
});
