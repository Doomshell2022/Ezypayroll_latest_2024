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

// Colors
import {colors} from '../assets/colors/colors';

//  Components
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/ToastComponent';

// Image
import background from '../assets/images/background.png';
import ic_back from '../assets/icons/ic_back.png';
import logo_black from '../assets/images/logo_black.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class OtpScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProcessingLoader: false,
    };
  }

  handleOTP = async otp => {
    try {
      const info = this.props.navigation.getParam('info', null);

      if (info) {
        // starting loader
        this.setState({showProcessingLoader: true});

        // preparing params
        const {mobile, otpId} = info;

        const params = {
          mobile,
          otpId,
          otp,
        };

        // calling api
        const response = await makeRequest(BASE_URL + 'appUserVerify', params);

        // processing response
        if (response) {
          const {success, userInfo, message} = response;

          if (success) {
            // stopping loader
            this.setState({showProcessingLoader: false});

            // navigating to Enter Pin
            this.props.navigation.navigate('EnterPin', {userInfo});
          } else {
            // stopping loader
            this.setState({showProcessingLoader: false});

            Alert.alert('', message, [{text: 'OK'}], {
              cancelable: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleResendOTP = async () => {
    try {
      const info = this.props.navigation.getParam('info', null);

      if (info) {
        // starting loader
        this.setState({showProcessingLoader: true});

        const {otpId} = info;

        // preparing params
        const params = {
          otpId,
        };

        // calling API
        const response = await makeRequest(BASE_URL + 'resendOtp', params);

        // processing response
        if (response) {
          // stopping loader
          this.setState({showProcessingLoader: false});

          const {success, message} = response;

          if (success) {
            showToast(message);
          }
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

          <Text style={styles.textPinStyle}>Enter OTP</Text>

          <View style={styles.mainOtpContainer}>
            <OTPInputView
              style={styles.otpContainer}
              pinCount={4}
              autoFocusOnLoad
              placeholderCharacter="0"
              secureTextEntry={true}
              placeholderTextColor={colors.lightGreyPrimary2}
              codeInputFieldStyle={styles.otpInputFieldStyle}
              codeInputHighlightStyle={styles.otpInputHighlightStyle}
              onCodeFilled={this.handleOTP}
            />
          </View>

          <Text style={styles.receiveOTP}>
            Didn't Received OTP ?{' '}
            <Text style={styles.resendOTPText} onPress={this.handleResendOTP}>
              Resend OTP
            </Text>
          </Text>
        </View>

        {showProcessingLoader && <ProcessingLoader />}
      </ImageBackground>
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
  },
  otpInputFieldStyle: {
    fontSize: wp(3.5),
    color: '#444',

    borderBottomWidth: 2,
    borderBottomColor: '#999',
  },

  otpInputHighlightStyle: {
    borderBottomColor: '#444',
  },

  backButtonContainer: {
    marginTop: hp(2),
    marginHorizontal: wp(2),
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

  receiveOTP: {
    marginTop: hp(3),
    fontSize: wp(3.5),
  },
  resendOTPText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#0077a2',
  },
});
