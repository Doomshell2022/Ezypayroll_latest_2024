import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  ImageBackground,
  BackHandler,
  SafeAreaView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OTPInputView from '@twotalltotems/react-native-otp-input';
// import OtpInputs from 'react-native-otp-inputs';

// Colors
import {colors} from '../assets/colors/colors';

//  Components
import ProcessingLoader from '../components/ProcessingLoader';

// Image
import background from '../assets/images/background.png';
import logo_black from '../assets/images/logo_black.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';

export default class SecurityPinScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProcessingLoader: false,
    };
  }

  componentDidMount() {
    console.log('did mount');
  }
  componentWillUnmount() {}
  handleLoginPin = async pin => {
    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId, role} = user;

        // preparing params
        const params = {
          ezypayrollId,
          userId,
          pin,
        };

        // calling api
        const response = await makeRequest(BASE_URL + 'pinLogin', params);

        // processing response
        if (response) {
          // stopping loader
          this.setState({showProcessingLoader: false});

          const {success, message} = response;

          if (success) {
            // navigating to home screen

            if (role === 'admin') {
              this.props.navigation.navigate('LoggedInAdmin');
            } else {
              this.props.navigation.navigate('LoggedIn');
            }
          } else {
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

  render() {
    const {showProcessingLoader} = this.state;

    return (
      // <ImageBackground
      //   source={background}
      //   resizeMode="cover"
      //   style={styles.container}>
      //   <View style={styles.contentContainer}>
      //     <Image
      //       source={logo_black}
      //       resizeMode="cover"
      //       style={styles.logoStyle}
      //     />
      //     <Text style={styles.textPinStyle}>Security PIN </Text>
      //     <OTPInputView
      //       style={{width: wp(60)}}
      //       pinCount={4}
      //       autoFocusOnLoad
      //       secureTextEntry={true}
      //       placeholderCharacter="*"
      //       // style={styles.otpContainer}
      //       placeholderTextColor={colors.lightGreyPrimary}
      //       codeInputFieldStyle={styles.otpInputFieldStyle}
      //       codeInputHighlightStyle={styles.otpInputHighlightStyle}
      //       onCodeFilled={this.handleLoginPin}
      //     />
      //   </View>

      //   {showProcessingLoader && <ProcessingLoader />}
      // </ImageBackground>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.container}>
        <View style={styles.contentContainer}>
          <Image
            source={logo_black}
            resizeMode="cover"
            style={styles.logoStyle}
          />
          <Text style={styles.textPinStyle}>Security PIN </Text>
          <View style={styles.mainOtpContainer}>
            <OTPInputView
              style={styles.otpContainer}
              pinCount={4}
              // autoFocusOnLoad={false}
              keyboardType="number-pad"
              placeholderCharacter="*"
              secureTextEntry={true}
              placeholderTextColor={colors.lightGreyPrimary}
              codeInputFieldStyle={styles.otpInputFieldStyle}
              codeInputHighlightStyle={styles.otpInputHighlightStyle}
              onCodeFilled={this.handleLoginPin}
            />
            {/* <OtpInputs
              handleChange={this.handleLoginPin}
              numberOfInputs={4}
              placeholderCharacter="*"
              style={styles.otpContainer}
              placeholderTextColor={colors.lightGreyPrimary}
              codeInputHighlightStyle={styles.otpInputHighlightStyle}
            /> */}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const {darkGreyPrimary, lightBluePrimary} = colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainOtpContainer: {
    height: hp(10),
  },
  logoStyle: {
    height: hp(10),
    aspectRatio: 2 / 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  textPinStyle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#0077a2',
  },
  otpContainer: {
    width: wp(60),
    // height: hp(10),
    // marginTop: hp(2),
    // borderWidth: 1,
  },
  otpInputFieldStyle: {
    fontSize: wp(5),
    color: '#0077a2',
    borderColor: '#000',
    borderWidth: 1,
    // paddingTop: wp(1),
    height: hp(6),
    width: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    margingTop: hp(-2),
    // borderBottomColor: darkGreyPrimary,
  },
  otpInputHighlightStyle: {
    borderColor: '#0077a2',
  },
});
