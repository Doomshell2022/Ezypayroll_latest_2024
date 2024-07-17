import React, {Component} from 'react';
import {
  ImageBackground,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import basicStyles from '../styles/BasicStyles';

// responsive
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProcessingLoader from '../components/ProcessingLoader';

// Import images
import background from '../assets/images/background.png';
import logo_black from '../assets/images/logo_black.png';
import ic_mail_black from '../assets/icons/ic_mail_black.png';

import ic_back2 from '../assets/icons/ic_back2.png';
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// import {showToast} from '../components/ToastComponent';
import {isEmailAddress} from '../validations/FormValidator';
import {colors} from '../assets/colors/colors';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {email: '', showProcessingLoader: false};
  }
  handleLogin1 = async () => {
    Keyboard.dismiss();

    const {email} = this.state;

    // Validating form
    if (!isEmailAddress(email)) {
      Alert.alert('Alert!', 'Please enter a valid email', [{text: 'OK'}]);
      return;
    }
    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // preparing request params
      const params = {
        email,
      };
      // calling api
      const response = await makeRequest(BASE_URL + 'restorePassword', params);

      // processing response
      if (response) {
        // stopping loader
        this.setState({showProcessingLoader: false});

        const {success} = response;

        if (success) {
          // navigating to Otp screen
          const {userInfo} = response;
          this.props.navigation.navigate('Login', {userInfo});
        } else {
          const {message} = response;
          Alert.alert(message);
          // showToast(message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  handleLogin = () => {
    try {
      this.props.navigation.navigate('Login');
    } catch (error) {
      return;
    }
  };

  handleEmail = changedText => {
    this.setState({email: changedText});
  };
  render() {
    const {showProcessingLoader} = this.state;
    return (
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={{flex: 1, justifyContent: 'center'}}>
        <View style={styles.container}>
          <Image
            source={logo_black}
            resizeMode="cover"
            style={styles.logoStyle}
          />
          <Text style={styles.textPinStyle}> Restore Password </Text>
        </View>
        <View style={{marginHorizontal: hp(3)}}>
          <View style={styles.inputContainer}>
            <Image
              source={ic_mail_black}
              resizeMode="cover"
              style={basicStyles.iconRow}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="#2a2a2a"
              cursorColor="#000"
              keyboardType="default"
              maxLength={150}
              value={this.state.email}
              onChangeText={this.handleEmail}
            />
          </View>
          <TouchableOpacity
            style={styles.loginButtonContainer}
            onPress={this.handleLogin1}>
            <Text style={styles.loginButtonText}>Send Reset Instruction</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleLogin}
            style={styles.signUpstyle}>
            <Image source={ic_back2} style={styles.iconStyle} />
            <Text style={styles.signupButtonStyle}> Back To Login </Text>
          </TouchableOpacity>
        </View>
        {showProcessingLoader && <ProcessingLoader />}
      </ImageBackground>
    );
  }
}
const {darkGreyPrimary} = colors;

const styles = StyleSheet.create({
  container: {
    padding: wp(5),
    justifyContent: 'center',
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
  logoStyle: {
    height: hp(10),
    aspectRatio: 2 / 1,
    alignSelf: 'center',
  },
  textPinStyle: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    color: '#0077a2',
    alignSelf: 'center',
  },
  iconStyle: {
    width: widthPercentageToDP(4.5),
    aspectRatio: 1 / 1,
  },
  input: {
    flex: 1,
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: hp(3),
    fontSize: wp(3),
    color: darkGreyPrimary,
  },
  loginButtonContainer: {
    height: 44,
    marginTop: heightPercentageToDP(3),
    backgroundColor: '#e14d4d',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signUpstyle: {
    flexDirection: 'row',
    marginTop: heightPercentageToDP(3),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  signupButtonStyle: {
    padding: 5,
    color: '#000',
    fontSize: widthPercentageToDP(3.2),
  },
});
