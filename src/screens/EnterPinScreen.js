import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';
// Colors
import {colors} from '../assets/colors/colors';

// Image
import logo_black from '../assets/images/logo_black.png';
import background from '../assets/images/background.png';
import ic_back from '../assets/icons/ic_back.png';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const EnterPinScreen = props => {
  const ref = React.createRef();
  const handleEnterPin = pin => {
    const {getParam, push} = props.navigation;

    const userInfo = getParam('userInfo', null);
    if (userInfo) {
      push('ConfirmPin', {info: {userInfo, pin}});
    }
  };

  const handleBackButton = () => {
    props.navigation.pop();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
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

        <View style={styles.otpMainContainer}>
          <Image
            source={logo_black}
            resizeMode="cover"
            style={styles.logoStyle}
          />

          <Text style={styles.textPinStyle}>Set PIN</Text>

          <View style={styles.mainOtpContainer}>
            <OTPInputView
              style={styles.otpContainer}
              pinCount={4}
              autoFocusOnLoad={false}
              secureTextEntry={true}
              keyboardType="number-pad"
              placeholderCharacter="*"
              placeholderTextColor={colors.lightGreyPrimary}
              codeInputFieldStyle={styles.otpInputFieldStyle}
              codeInputHighlightStyle={styles.otpInputHighlightStyle}
              onCodeFilled={handleEnterPin}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default EnterPinScreen;

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
    // height: hp(10),
  },
  otpMainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpContainer: {
    width: wp(60),
    height: hp(15),
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
