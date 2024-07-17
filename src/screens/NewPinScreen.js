import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OTPInputView from '@twotalltotems/react-native-otp-input';

// Colors
import {colors} from '../assets/colors/colors';

// Image
import logo_black from '../assets/images/logo_black.png';
import background from '../assets/images/background.png';
import ic_back from '../assets/icons/ic_back.png';

const NewPinScreen = props => {
  const handleEnterPin = newPin => {
    const {getParam, push} = props.navigation;

    const oldPin = getParam('oldPin', null);
    if (oldPin) {
      push('ConfirmNewPin', {info: {oldPin, newPin}});
      console.log(newPin);
    }
  };

  const handleBackButton = () => {
    props.navigation.pop();
  };

  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={styles.container}>
      <TouchableOpacity
        onPress={handleBackButton}
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

      <View style={styles.contentContainer}>
        <Image
          source={logo_black}
          resizeMode="cover"
          style={styles.logoStyle}
        />
        <Text style={styles.textPinStyle}> New PIN </Text>
        <View style={styles.mainOtpContainer}>
          <OTPInputView
            style={styles.otpContainer}
            pinCount={4}
            autoFocusOnLoad
            placeholderCharacter="*"
            secureTextEntry={true}
            placeholderTextColor={colors.lightGreyPrimary}
            codeInputFieldStyle={styles.otpInputFieldStyle}
            codeInputHighlightStyle={styles.otpInputHighlightStyle}
            onCodeFilled={handleEnterPin}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default NewPinScreen;

const {darkGreyPrimary, lightBluePrimary} = colors;

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkGreyPrimary,
    flex: 1,
    alignItems: 'center',
  },
  logoStyle: {
    height: hp(10),
    aspectRatio: 2 / 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPinStyle: {
    marginTop: hp(3),
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#0077a2',
  },
  mainOtpContainer: {
    height: hp(10),
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
    borderColor: lightBluePrimary,
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
  },
  backButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
  },
  icButtonStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
  },
  buttonTextStyle: {
    paddingLeft: wp(3),
    color: '#333',
    fontSize: wp(3.5),
  },
});
