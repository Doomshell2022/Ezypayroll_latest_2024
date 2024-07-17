import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
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

import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/ToastComponent';

// Image
import background from '../assets/images/background.png';
import logo_black from '../assets/images/logo_black.png';
import ic_back from '../assets/icons/ic_back.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class ConfirmNewPinScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProcessingLoader: false,
      connectionState: true,
    };
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleLoginPin = async confirmNewPin => {
    try {
      const info = this.props.navigation.getParam('info', null);

      if (info) {
        const {newPin, oldPin} = info;

        if (newPin === confirmNewPin) {
          // starting loader
          this.setState({showProcessingLoader: true});

          const userInfo = await getData(KEYS.USER_INFO);

          if (userInfo) {
            const {ezypayrollId, user} = userInfo;
            const {id: userId} = user;

            // preparing params

            const params = {
              ezypayrollId,
              userId,
              oldPin,
              newPin,
            };

            // calling api
            const response = await makeRequest(BASE_URL + 'changePin', params);

            // processing response
            if (response) {
              const {success, message} = response;

              if (success) {
                // stopping loader
                this.setState({showProcessingLoader: false});

                // navigating to home screen
                this.props.navigation.navigate('SecurityPin');

                Alert.alert('', message, [{text: 'OK'}], {
                  cancelable: false,
                });
              } else {
                // stopping loader
                this.setState({showProcessingLoader: false});

                Alert.alert('', message, [{text: 'OK'}], {
                  cancelable: false,
                });
              }
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
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.container}>
        {this.state.connectionState && (
          <>
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
            <View style={styles.contentContainer}>
              <Image
                source={logo_black}
                resizeMode="cover"
                style={styles.logoStyle}
              />
              <Text style={styles.textPinStyle}>Re-Enter Pin</Text>

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
                  onCodeFilled={this.handleLoginPin}
                />
              </View>
            </View>
          </>
        )}
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
        {showProcessingLoader && <ProcessingLoader />}
      </ImageBackground>
    );
  }
}

const {darkGreyPrimary, lightBluePrimary} = colors;

const styles = StyleSheet.create({
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
