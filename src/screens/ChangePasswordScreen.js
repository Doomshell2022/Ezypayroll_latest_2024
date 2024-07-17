import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableHighlight,
  KeyboardAvoidingView,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Icons
import background from '../assets/images/background.png';
import logo_black from '../assets/images/logo_black.png';
import ic_login_password from '../assets/icons/login.png';
import ic_mail_black from '../assets/icons/ic_mail_black.png';
//  Components
import HeadersComponent from '../components/HeadersComponent';
import LeaveHistoryComponent from '../components/LeaveHistoryComponent';
import CustomLoader from '../components/CustomLoader';

// User Preference
import {clearData} from '../api/UserPreference';
// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
class StudentChangePasswordScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  handleCurrentPasswordChange = changedText => {
    this.setState({currentPassword: changedText});
  };

  handleNewPasswordChange = changedText => {
    this.setState({newPassword: changedText});
  };

  handleConfirmPasswordChange = changedText => {
    this.setState({confirmPassword: changedText});
  };

  onOkPress = async () => {
    try {
      // Clearing user preferences from local storage
      clearData();

      // Resetting Navigation to initial state for login again
      this.props.navigation.navigate('LoggedOut');
    } catch (error) {
      console.log(error.message);
    }
  };

  resetInputFields = () => {
    this.setState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  handleChangePassword = async () => {
    const {newPassword, confirmPassword} = this.state;

    if (newPassword !== '') {
      if (confirmPassword !== '') {
        if (newPassword === confirmPassword) {
          this.setState({isLoading: true});
          // starting loader
          const userInfo = await getData(KEYS.USER_INFO);
          const {id: userId} = userInfo.user;
          console.log(userInfo);
          const params = {
            userId,
            password: newPassword,
            C_Password: confirmPassword,
          };
          const response = await makeRequest(
            BASE_URL + 'changePassword',
            params,
            true,
            false,
          );

          // stopping loader
          this.setState({isLoading: false});

          if (response.success === 1) {
            Alert.alert(
              '',
              'Password changed successfully!',
              [{text: 'OK', onPress: this.onOkPress}],
              {cancelable: false},
            );
          } else if (response.success === 0) {
            Alert.alert(
              '',
              response.message,
              [{text: 'OK', onPress: this.resetInputFields}],
              {cancelable: false},
            );
          }
        } else {
          Alert.alert(
            '',
            'New and Confirm Password do not match!',
            [{text: 'OK'}],
            {cancelable: false},
          );
        }
      } else {
        Alert.alert('', 'Please enter Confirm Password!', [{text: 'OK'}], {
          cancelable: false,
        });
      }
    } else {
      Alert.alert('', 'Please enter New Password!', [{text: 'OK'}], {
        cancelable: false,
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <HeadersComponent title="Change Password" nav={this.props.navigation} />

        <ImageBackground
          style={styles.backgroundImageContainer}
          source={background}
          resizeMode="cover">
          <ScrollView contentContainerStyle={styles.otpMainContainer}>
            <Image
              source={logo_black}
              resizeMode="cover"
              style={styles.logoStyle}
            />

            <Text style={styles.textPinStyle}> Change Password </Text>

            <KeyboardAvoidingView
              behavior="padding"
              style={styles.contentContainer}>
              <View style={styles.loginInputView}>
                <Image
                  source={ic_login_password}
                  resizeMode="cover"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.loginInput}
                  placeholder="New Password"
                  placeholderTextColor="#ccc"
                  secureTextEntry
                  value={this.state.newPassword}
                  onChangeText={this.handleNewPasswordChange}
                />
              </View>

              <View style={styles.loginInputView}>
                <Image
                  source={ic_login_password}
                  resizeMode="cover"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.loginInput}
                  placeholder="Confirm Password"
                  placeholderTextColor="#ccc"
                  secureTextEntry
                  value={this.state.confirmPassword}
                  onChangeText={this.handleConfirmPasswordChange}
                />
              </View>

              <TouchableHighlight
                underlayColor={'#333'}
                onPress={this.handleChangePassword}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Change Password</Text>
              </TouchableHighlight>
            </KeyboardAvoidingView>
          </ScrollView>
        </ImageBackground>

        {this.state.isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default StudentChangePasswordScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImageContainer: {
    flex: 1,
  },
  contentContainer: {
    margin: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginInputView: {
    flexDirection: 'row',
    padding: wp(2),
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    height: 40,
    // paddingBottom: 5,
    marginBottom: 30,
    alignItems: 'center',
    borderRadius: wp(5),
    // elevation: wp(2),
  },
  inputIcon: {
    borderRightWidth: 2,
    borderRightColor: '#ccc',
    paddingRight: 10,
    color: '#fff',
    width: wp(5),
    aspectRatio: 1 / 1,
  },
  loginInput: {
    fontSize: 16,
    margin: 15,
    color: '#999',
    height: hp(10),
    width: wp(75),
  },
  loginButton: {
    width: 200,
    height: 42,
    alignSelf: 'center',
    backgroundColor: '#1ba2de',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loaderContentContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  logoStyle: {
    marginTop: hp(25),
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpContainer: {
    width: wp(60),
  },

  otpInputHighlightStyle: {
    borderBottomColor: '#0077a2',
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
