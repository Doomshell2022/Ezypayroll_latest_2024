// import React from 'react';
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  // ImageBackground,
  // Button,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';
// import {Picker} from '@react-native-picker/picker';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import RBSheet from 'react-native-raw-bottom-sheet';

// Colors
import {colors} from '../assets/colors/colors';

// Styles
import basicStyles from '../styles/BasicStyles';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import ProfileComponent from '../components/ProfileComponent';
// import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/ToastComponent';
import PickerModal from 'react-native-picker-modal-view';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
import ic_down from '../assets/icons/ic_down.png';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class PersonalDetailsScreen extends Component {
  constructor(props) {
    super(props);

    const {navigation} = props;
    const profile = navigation.getParam('profile', null);

    const {firstName, lastName, empId, designation, image, addressInfo} =
      profile;

    this.basicProfileDetail = {firstName, lastName, empId, designation, image};

    const {type, address, city, state, pincode} = addressInfo;

    this.state = {
      editProfilePopup: false,
      showProcessingLoader: false,
      address_type: type,
      emp_address: address,
      emp_city: city,
      state,
      pincode,
      SupportData: [
        {
          Id: 1,
          Name: 'Home',
          Value: 'Home',
        },
        {
          Id: 2,
          Name: 'Office',
          Value: 'Office',
        },
      ],
      connectionState: true,
      selectedSupport: {
        Id: -1,
        Name: type ? type : 'Select Address Type',
        Value: type ? type : 'Select Address Type',
      },
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
    const {selectedSupport, emp_address, emp_city, state, pincode} = this.state;

    if (
      selectedSupport.Name === null ||
      selectedSupport.Name.trim() === '' ||
      selectedSupport.Name === 'Select Address Type'
    ) {
      Alert.alert('Alert!', 'Please Select Address Type.', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (emp_address === null || emp_address.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Address', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (emp_city === null || emp_city.trim() === '') {
      Alert.alert('Alert!', 'Please Enter City', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (state === null || state.trim() === '') {
      Alert.alert('Alert!', 'Please Enter State', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (pincode === null || pincode.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Pin Code', [{text: 'OK'}], {
        cancelable: false,
      });
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
          ezypayrollId,
          userId,
          voter_id: '',
          ration_card: '',
          blood_group: '',
          license_number: '',
          name_on_dl: '',
          date_issued: '',
          expiry_date: '',
          address: '',
          education_level: '',
          area: '',
          university: '',
          city: '',
          yearPassed: '',
          skills: '',
          address_type: selectedSupport.Name,
          emp_address,
          emp_city,
          state,
          pincode,
        };

        const response = await makeRequest(
          BASE_URL + 'editLicenceAdditionalinfoEducationSkills',
          params,
        );

        if (response) {
          this.setState({showProcessingLoader: false});

          const {success, message} = response;

          if (success) {
            showToast(message);
            const {pop, getParam} = this.props.navigation;

            const handleRefresh = await getParam('handleRefresh', null);

            await handleRefresh();
            this.closeButton();
            pop();
          } else {
            showToast(message);
            const {pop, getParam} = this.props.navigation;
            const handleRefresh = await getParam('handleRefresh', null);

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
    // this.setState({editProfilePopup: true});
    this.RBSheet.open();
  };

  closeButton = () => {
    // this.setState({editProfilePopup: false});
    this.RBSheet.close();
  };

  renderStatesCategoryPicker = (disabled, selected, showModal) => {
    const {selectedSupport} = this.state;
    const {Name} = selectedSupport;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'Select Address Type') {
      labelStyle.color = '#777';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={labelStyle}>{Name}</Text>
          <Image source={ic_down} resizeMode="cover" style={styles.downIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  handleSelectedSupport = selectedSupport => {
    this.setState({selectedSupport});
    return selectedSupport;
  };

  handleSelectedSupportClose = () => {
    const {selectedSupport} = this.state;
    this.setState({selectedSupport});
  };

  render() {
    const {
      editProfilePopup,
      address_type,
      emp_address,
      emp_city,
      state,
      pincode,
      selectedSupport,
      SupportData,
    } = this.state;
    console.log('!!~~~', SupportData);
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              nav={this.props.navigation}
              navAction="back"
              title="Address Info."
            />

            <ProfileComponent profile={this.basicProfileDetail} />

            <View style={styles.mainListContainer}>
              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Type
                </Text>
                <Text
                  style={[
                    basicStyles.heading,
                    basicStyles.flexHalf,
                    basicStyles.textAlign,
                  ]}>
                  -
                </Text>
                <Text style={[basicStyles.text, basicStyles.flexTow]}>
                  {address_type ? address_type : 'N/A'}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Address
                </Text>
                <Text
                  style={[
                    basicStyles.heading,
                    basicStyles.flexHalf,
                    basicStyles.textAlign,
                  ]}>
                  -
                </Text>
                <Text style={[basicStyles.text, basicStyles.flexTow]}>
                  {emp_address ? emp_address : 'N/A'}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  City
                </Text>
                <Text
                  style={[
                    basicStyles.heading,
                    basicStyles.flexHalf,
                    basicStyles.textAlign,
                  ]}>
                  -
                </Text>
                <Text style={[basicStyles.text, basicStyles.flexTow]}>
                  {emp_city ? emp_city : 'N/A'}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  State
                </Text>
                <Text
                  style={[
                    basicStyles.heading,
                    basicStyles.flexHalf,
                    basicStyles.textAlign,
                  ]}>
                  -
                </Text>
                <Text style={[basicStyles.text, basicStyles.flexTow]}>
                  {state ? state : 'N/A'}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Pin Code
                </Text>
                <Text
                  style={[
                    basicStyles.heading,
                    basicStyles.flexHalf,
                    basicStyles.textAlign,
                  ]}>
                  -
                </Text>
                <Text style={[basicStyles.text, basicStyles.flexTow]}>
                  {pincode ? pincode : 'N/A'}
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
                  minHeight: hp(72),
                  padding: wp(2),
                  borderTopLeftRadius: wp(4),
                  borderTopRightRadius: wp(4),
                },
                draggableIcon: {
                  backgroundColor: '#ff6000',
                },
              }}>
              <TouchableWithoutFeedback style={styles.popupContainer}>
                <ScrollView>
                  <View style={styles.popupContainer}>
                    <View style={styles.editContainer}>
                      <Text style={basicStyles.heading}>
                        Edit Address Info.
                      </Text>
                    </View>

                    <KeyboardAwareScrollView
                      contentContainerStyle={styles.loginScreenContainer}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScroll
                      showsVerticalScrollIndicator={false}
                      Indicator={false}
                      enableOnAndroid>
                      <Text
                        style={[
                          basicStyles.text,
                          basicStyles.marginBottomHalf,
                        ]}>
                        Type
                      </Text>

                      <View style={styles.fromDateFieldContainer}>
                        <PickerModal
                          items={SupportData}
                          requireSelection={true}
                          selected={selectedSupport}
                          selectPlaceholderText="#0000"
                          onSelected={this.handleSelectedSupport}
                          onClosed={this.handleSelectedSupportClose}
                          // backButtonDisabled
                          showToTopButton={true}
                          showAlphabeticalIndex={true}
                          autoGenerateAlphabeticalIndex={false}
                          searchPlaceholderText="Search"
                          searchInputTextColor="#000"
                          renderSelectView={this.renderStatesCategoryPicker}
                        />
                      </View>

                      <Text
                        style={[
                          basicStyles.text,
                          basicStyles.marginBottomHalf,
                        ]}>
                        Address
                      </Text>

                      <TextInput
                        style={styles.inputField}
                        placeholder="Address"
                        placeholderTextColor={lightGreyPrimary}
                        value={emp_address}
                        onChangeText={e => this.setState({emp_address: e})}
                      />

                      <Text
                        style={[
                          basicStyles.text,
                          basicStyles.marginBottomHalf,
                        ]}>
                        City
                      </Text>

                      <TextInput
                        style={styles.inputField}
                        placeholder="City"
                        placeholderTextColor={lightGreyPrimary}
                        value={emp_city}
                        onChangeText={e => this.setState({emp_city: e})}
                      />

                      <Text
                        style={[
                          basicStyles.text,
                          basicStyles.marginBottomHalf,
                        ]}>
                        State
                      </Text>

                      <TextInput
                        style={styles.inputField}
                        placeholder="State"
                        placeholderTextColor={lightGreyPrimary}
                        value={state}
                        onChangeText={e => this.setState({state: e})}
                      />

                      <Text
                        style={[
                          basicStyles.text,
                          basicStyles.marginBottomHalf,
                        ]}>
                        Pin Code
                      </Text>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Pin Code"
                        placeholderTextColor={lightGreyPrimary}
                        value={pincode}
                        maxLength={6}
                        keyboardType="numeric"
                        onChangeText={e => this.setState({pincode: e})}
                      />

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

            {/* <BottomModal
          visible={editProfilePopup}
          onTouchOutside={this.closeButton}
          modalStyle={{borderRadius: 5}}>
          <ModalContent
            style={{
              // backgroundColor: 'fff',
              minHeight: hp(75),
            }}>
            <View style={styles.popupContainer}>
              <View style={styles.editContainer}>
                <Text style={basicStyles.heading}>Edit Address Info.</Text>
              </View>

              <KeyboardAwareScrollView
                contentContainerStyle={styles.loginScreenContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScroll
                showsVerticalScrollIndicator={false}
                Indicator={false}
                enableOnAndroid>
                <Text style={[basicStyles.text, basicStyles.marginBottomHalf]}>
                  Type
                </Text>

                <View style={styles.fromDateFieldContainer}>
                  <PickerModal
                    items={SupportData}
                    requireSelection={true}
                    selected={selectedSupport}
                    onSelected={this.handleSelectedSupport}
                    onClosed={this.handleSelectedSupportClose}
                    backButtonDisabled
                    showToTopButton={true}
                    showAlphabeticalIndex={true}
                    autoGenerateAlphabeticalIndex={false}
                    searchPlaceholderText="Search"
                    renderSelectView={this.renderStatesCategoryPicker}
                  />
                </View>

                <Text style={[basicStyles.text, basicStyles.marginBottomHalf]}>
                  Address
                </Text>

                <TextInput
                  style={styles.inputField}
                  placeholder="Address"
                  placeholderTextColor={lightGreyPrimary}
                  value={emp_address}
                  onChangeText={(e) => this.setState({emp_address: e})}
                />

                <Text style={[basicStyles.text, basicStyles.marginBottomHalf]}>
                  City
                </Text>

                <TextInput
                  style={styles.inputField}
                  placeholder="City"
                  placeholderTextColor={lightGreyPrimary}
                  value={emp_city}
                  onChangeText={(e) => this.setState({emp_city: e})}
                />

                <Text style={[basicStyles.text, basicStyles.marginBottomHalf]}>
                  State
                </Text>

                <TextInput
                  style={styles.inputField}
                  placeholder="State"
                  placeholderTextColor={lightGreyPrimary}
                  value={state}
                  onChangeText={(e) => this.setState({state: e})}
                />

                <Text style={[basicStyles.text, basicStyles.marginBottomHalf]}>
                  Pin Code
                </Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Pin Code"
                  placeholderTextColor={lightGreyPrimary}
                  value={pincode}
                  maxLength={6}
                  keyboardType="numeric"
                  onChangeText={(e) => this.setState({pincode: e})}
                />

                <View
                  style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={this.closeButton}>
                    <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={this.handleUpdateInfo}>
                    <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                      Update
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </View>
            {this.state.showProcessingLoader && <ProcessingLoader />}
          </ModalContent>
        </BottomModal> */}
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
    paddingVertical: wp(1),
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
    fontSize: wp(3.5),
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

  pickerInput: {
    height: 50,
    fontSize: wp(3),
    width: wp(94),
    marginHorizontal: 0,
    left: wp(-5),
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

  downIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  textcolor: {
    color: '#000',
  },
});
