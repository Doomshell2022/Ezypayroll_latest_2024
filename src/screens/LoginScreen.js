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
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// responsive
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import ProcessingLoader from '../components/ProcessingLoader';
import {colors} from '../assets/colors/colors';
import {showToast} from '../components/ToastComponent';

// Image
import logo_black from '../assets/images/logo_black.png';
import background from '../assets/images/background.png';

// Validations
import {isMobileNumber} from '../validations/FormValidator';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: '',
      showProcessingLoader: false,
    };
  }

  handleLogin = async () => {
    const {mobile} = this.state;

    /*  // Validating form
    if (!isEmailAddress(email)) {
      Alert.alert('', 'Please enter a valid email', [{text: 'OK'}]);
      return;
    } */

    // Validating form
    if (!isMobileNumber(mobile)) {
      Alert.alert('', 'Please enter a valid mobile number', [{text: 'OK'}]);
      return;
    }

    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // preparing request params
      const params = {
        mobile,
      };

      // calling api
      const response = await makeRequest(BASE_URL + 'userLogin', params);

      // processing response
      if (response) {
        // stopping loader
        this.setState({showProcessingLoader: false});

        const {success} = response;

        if (success) {
          // navigating to Otp screen
          const {otpId} = response;
          this.props.navigation.navigate('Otp', {info: {mobile, otpId}});
        } else {
          const {message} = response;
          Alert.alert('', message, [{text: 'OK'}], {
            cancelable: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleMobile = changedText => {
    this.setState({mobile: changedText});
  };

  render() {
    const {showProcessingLoader} = this.state;
    const {lightGreyPrimary} = colors;

    return (
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.container}>
        <Text style={styles.loginText}>Login</Text>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.loginScreenContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid>
          <Image
            source={logo_black}
            resizeMode="cover"
            style={styles.logoStyle}
          />
          <View style={styles.inputContainer}>
            {/* <Text style={styles.inputTextStyle}>Mobile Number</Text> */}
            <TextInput
              style={styles.inputField}
              placeholder="Enter mobile no."
              placeholderTextColor={lightGreyPrimary}
              value={this.state.mobile}
              keyboardType="number-pad"
              maxLength={10}
              onChangeText={this.handleMobile}
            />
          </View>
          <TouchableOpacity
            onPress={this.handleLogin}
            style={styles.loginButton}
            underlayColor="transparent">
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>

        {showProcessingLoader && <ProcessingLoader />}
      </ImageBackground>
    );
  }
}

const {darkGreyPrimary, lightBluePrimary, whitePrimary} = colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginContainer: {
    // marginTop: hp(30),
    // alignItems: 'center',
    // justifyContent: 'centesr',
  },
  loginScreenContainer: {
    // flex: 1,
  },
  logoStyle: {
    marginTop: hp(5),
    height: hp(10),
    aspectRatio: 2 / 1,
  },

  inputContainer: {
    marginTop: hp(2),
  },
  inputTextStyle: {
    color: '#0077a2',
    paddingTop: hp(2.5),
    paddingLeft: wp(1),
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },

  inputField: {
    width: wp('80%'),
    backgroundColor: 'rgba(0,0, 0, .1)',
    height: hp(6),
    paddingHorizontal: wp(4),
    borderRadius: hp(3),
    fontSize: wp(3),
    color: darkGreyPrimary,
  },

  loginButton: {
    marginTop: hp(2),
    backgroundColor: '#e14d4d',
    height: hp(6),
    paddingHorizontal: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(3),
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: wp(3.5),
    color: whitePrimary,
  },
});
