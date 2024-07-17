// import React from 'react';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from 'react-native-safe-area-view';

// Bottom Modal
import RBSheet from 'react-native-raw-bottom-sheet';

// Colors
import {colors} from '../assets/colors/colors';

// Styles
import basicStyles from '../styles/BasicStyles';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import ProfileComponent from '../components/ProfileComponent';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/ToastComponent';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
import {isMobileNumber, isEmailAddress} from '../validations/FormValidator';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class PersonalDetailsScreen extends Component {
  constructor(props) {
    super(props);

    const {navigation} = props;
    const profile = navigation.getParam('profile', null);

    const {firstName, lastName, empId, designation, image, contectInfo} =
      profile;

    this.basicProfileDetail = {firstName, lastName, empId, designation, image};
    const {mobile, email} = contectInfo;

    this.state = {
      editProfilePopup: false,
      selectedLanguage: '',
      showProcessingLoader: false,
      mobile,
      email,
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
  handleUpdateInfo = async () => {
    const {mobile, email} = this.state;

    if (mobile === null || !isMobileNumber(mobile)) {
      Alert.alert(
        'Alert!',
        'Please Enter Valid Mobile Number.',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }
    if (email === null || !isEmailAddress(email)) {
      Alert.alert(
        'Alert!',
        'Please Enter Valid Email Address',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;

        // preparing params
        const params = {
          userId,
          ezypayrollId,
          mobile,
          email,
          father_name: '',
          mother_name: '',
          martial_status: '',
        };

        const response = await makeRequest(
          BASE_URL + 'editConatctFamilyinfo',
          params,
        );

        if (response) {
          this.setState({showProcessingLoader: false});

          const {success, message} = response;

          if (success) {
            const {pop, getParam} = this.props.navigation;

            const handleRefresh = await getParam('handleRefresh', null);

            showToast(message);
            await handleRefresh();
            this.closeButton();
            pop();
          } else {
            const {pop, getParam} = this.props.navigation;
            const handleRefresh = await getParam('handleRefresh', null);

            showToast(message);
            await handleRefresh();
            this.closeButton();
            pop();
          }
        }
      }
    } catch (error) {
      this.setState({showProcessingLoader: false});
      console.log(error.message);
    }
  };

  handleMoreInfo = () => {
    this.RBSheet.open();
  };

  closeButton = () => {
    this.RBSheet.close();
  };

  render() {
    const {editProfilePopup, mobile, email} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              nav={this.props.navigation}
              title="Personal Info."
              navAction="back"
            />

            <ProfileComponent profile={this.basicProfileDetail} />

            <View style={styles.mainListContainer}>
              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Contact No.
                </Text>
                <Text
                  style={[
                    basicStyles.heading,
                    basicStyles.flexOne,
                    basicStyles.textAlign,
                  ]}>
                  -
                </Text>
                <Text style={[basicStyles.text, basicStyles.flexTow]}>
                  {mobile ? mobile : 'N/A'}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Email ID
                </Text>
                <Text
                  style={[
                    basicStyles.heading,
                    basicStyles.flexOne,
                    basicStyles.textAlign,
                  ]}>
                  -
                </Text>
                <Text style={[basicStyles.text, basicStyles.flexTow]}>
                  {email ? email : 'N/A'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={this.handleMoreInfo}>
              <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                Edit
              </Text>
            </TouchableOpacity>

            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              closeOnDragDown={true}
              closeOnPressMask={false}
              onClose={this.closePopup}
              // height={hp(60)}
              customStyles={{
                wrapper: {
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
                container: {
                  minHeight: hp(50),
                  padding: wp(2),
                  borderTopLeftRadius: wp(4),
                  borderTopRightRadius: wp(4),
                },
                draggableIcon: {
                  backgroundColor: '#ff6000',
                },
              }}>
              <TouchableWithoutFeedback style={styles.popupContainer}>
                <ScrollView
                  contentContainerStyle={[styles.popupContainerInner]}>
                  <View style={styles.popupContainer}>
                    <View style={styles.editContainer}>
                      <Text style={basicStyles.heading}>
                        Edit Personal Info.
                      </Text>
                    </View>

                    <KeyboardAwareScrollView
                      contentContainerStyle={styles.loginScreenContainer}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      enableOnAndroid>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Contact no."
                        placeholderTextColor={lightGreyPrimary}
                        maxLength={10}
                        keyboardType="numeric"
                        value={mobile}
                        onChangeText={e => this.setState({mobile: e})}
                      />

                      <TextInput
                        style={styles.inputField}
                        placeholder="Email"
                        placeholderTextColor={lightGreyPrimary}
                        value={email}
                        onChangeText={e => this.setState({email: e})}
                      />

                      {/* <View style={styles.fromDateFieldContainer}>
                <DateTimePicker onDateChange={this.handleFromDateChange} />
              </View> */}

                      <View
                        style={[
                          basicStyles.directionRow,
                          basicStyles.alignCenter,
                        ]}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={this.closeButton}>
                          <Text
                            style={[basicStyles.text, basicStyles.whiteColor]}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.updateButton}
                          onPress={this.handleUpdateInfo}>
                          <Text
                            style={[basicStyles.text, basicStyles.whiteColor]}>
                            Update
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </KeyboardAwareScrollView>
                  </View>
                </ScrollView>
              </TouchableWithoutFeedback>
              {this.state.showProcessingLoader && <ProcessingLoader />}
            </RBSheet>
          </>
        )}
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}

const {lightGreyPrimary} = colors;

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
    flex: 1,
    backgroundColor: '#fff',
  },

  backButtonContainer: {
    marginTop: hp(1),
    marginHorizontal: wp(3),
    alignSelf: 'flex-start',
  },

  backButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icButtonStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
  },

  icDetailList: {
    width: hp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },

  buttonTextStyle: {
    paddingLeft: wp(3),
    color: '#222',
  },
  mainListContainer: {
    flex: 1,
    padding: wp(3),
  },
  headingTextStyle: {
    marginTop: hp(1),
    padding: wp(2),
    fontSize: wp(4),
    color: '#333',
    backgroundColor: '#f2f1f1',
    marginBottom: wp(2),
  },
  listContainer: {
    paddingVertical: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
  },

  infoTextStyle: {
    color: lightGreyPrimary,
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },

  informationTextStyle: {
    fontSize: wp(3),
    color: '#333',
  },

  editButton: {
    backgroundColor: '#0077a2',
    margin: wp(2),
    padding: wp(3),
    alignItems: 'center',
  },
  popCon: {
    width: wp(100),
    backgroundColor: '#fff',
    height: hp(100),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: wp(108),
    height: hp(104),
    // left: 0,
    position: 'absolute',
    top: hp(-3),
    left: wp(-9),
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
  },
  popupContainer: {
    padding: 0,
  },
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
    backgroundColor: '#f2f1f1',
    height: hp(5.5),
    alignItems: 'center',
    paddingHorizontal: wp(2),
  },

  closeButton: {
    backgroundColor: '#e14c4e',
    paddingHorizontal: wp(3),
    paddingVertical: wp(2),
    borderRadius: 3,
  },
  inputField: {
    flex: 1,
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
  },
  fromDateFieldContainer: {
    flex: 1,
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
    justifyContent: 'center',
  },

  cancelButton: {
    backgroundColor: '#e14c4e',
    flex: 1,
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },

  updateButton: {
    backgroundColor: '#0077a2',
    flex: 1,
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
});
