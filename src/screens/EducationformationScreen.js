// import React from 'react';
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
import PickerModal from 'react-native-picker-modal-view';

import ic_down from '../assets/icons/ic_down.png';
// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class PersonalDetailsScreen extends Component {
  constructor(props) {
    super(props);

    const {navigation} = props;
    const profile = navigation.getParam('profile', null);

    const {firstName, lastName, empId, designation, image, educationInfo} =
      profile;

    this.basicProfileDetail = {firstName, lastName, empId, designation, image};

    const {educationLevel, area, university, city, yearPassed} = educationInfo;

    this.state = {
      editProfilePopup: false,
      showProcessingLoader: false,
      education_level: educationLevel,
      area,
      university,
      city,
      yearPassed,
      listData: [
        {
          Id: 1,
          Name: 'Primary',
          Value: 'Primary',
        },
        {
          Id: 2,
          Name: 'Secondary',
          Value: 'Secondary',
        },
        {
          Id: 3,
          Name: 'Bachelors',
          Value: 'Bachelors',
        },
        {
          Id: 4,
          Name: 'Masters',
          Value: 'Masters',
        },
        {
          Id: 5,
          Name: 'P.HD',
          Value: 'P.HD',
        },
        {
          Id: 6,
          Name: 'Others',
          Value: 'Others',
        },
      ],
      connectionState: true,
      selectedData: {
        Id: -1,
        Name: educationLevel ? educationLevel : 'Select Educational Level',
        Value: educationLevel ? educationLevel : 'Select Educational Level',
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
    const {selectedData, area, university, city, yearPassed} = this.state;

    if (selectedData.Name === 'Select Educational Level') {
      Alert.alert(
        'Alert!',
        'Please Select Educational Level.',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }
    if (area === null || area.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Education Area', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (university === null || university.trim() === '') {
      Alert.alert('Alert!', 'Please Enter University', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (yearPassed === null || yearPassed.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Passed Out', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (city === null || city.trim() === '') {
      Alert.alert('Alert!', 'Please Enter City', [{text: 'OK'}], {
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
          education_level: selectedData.Name,
          area,
          university,
          city,
          yearPassed,
          skills: '',
          address_type: '',
          emp_address: '',
          emp_city: '',
          state: '',
          pincode: '',
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
    this.RBSheet.open();
  };

  closeButton = () => {
    this.RBSheet.close();
  };

  renderStatesCategoryPicker = (disabled, selected, showModal) => {
    const {selectedData} = this.state;
    const {Name} = selectedData;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'Select Educational Level') {
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

  handleSelectedData = selectedData => {
    this.setState({selectedData});
    return selectedData;
  };

  handleSelectedDataClose = () => {
    const {selectedData} = this.state;
    this.setState({selectedData});
  };

  render() {
    const {
      editProfilePopup,
      education_level,
      area,
      university,
      city,
      yearPassed,
      listData,
      selectedData,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              nav={this.props.navigation}
              title="Education Info."
              navAction="back"
            />

            <ProfileComponent profile={this.basicProfileDetail} />

            <View style={styles.mainListContainer}>
              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Level
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
                  {education_level ? education_level : 'N/A'}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Education Area
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
                  {area ? area : 'N/A'}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  University
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
                  {university ? university : 'N/A'}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Passed Year
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
                  {yearPassed ? yearPassed : 'N/A'}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  City
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
                  {city ? city : 'N/A'}
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
              customStyles={{
                wrapper: {
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
                container: {
                  minHeight: hp(65),
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
                        Edit Education Info.
                      </Text>
                    </View>

                    <KeyboardAwareScrollView
                      contentContainerStyle={styles.loginScreenContainer}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      enableOnAndroid>
                      <View style={styles.fromDateFieldContainer}>
                        <PickerModal
                          items={listData}
                          searchInputTextColor="#000"
                          requireSelection={true}
                          selected={selectedData}
                          onSelected={this.handleSelectedData}
                          onClosed={this.handleSelectedDataClose}
                          // backButtonDisabled
                          showToTopButton={true}
                          showAlphabeticalIndex={true}
                          autoGenerateAlphabeticalIndex={false}
                          searchPlaceholderText="Search"
                          renderSelectView={this.renderStatesCategoryPicker}
                        />
                      </View>

                      <TextInput
                        style={styles.inputField}
                        placeholder="Education Area"
                        placeholderTextColor={lightGreyPrimary}
                        value={area}
                        onChangeText={e => this.setState({area: e})}
                      />

                      <TextInput
                        style={styles.inputField}
                        placeholder="University"
                        placeholderTextColor={lightGreyPrimary}
                        value={university}
                        onChangeText={e => this.setState({university: e})}
                      />

                      {/* <Text
                style={[basicStyles.textSmall, basicStyles.marginBottomHalf]}>
                Issued Date
              </Text>
              <View style={styles.fromDateFieldContainer}>
                <DateTimePicker onDateChange={handleFromDateChange} />
              </View>

              <Text
                style={[basicStyles.textSmall, basicStyles.marginBottomHalf]}>
                Expiry Date
              </Text>
              <View style={styles.fromDateFieldContainer}>
                <DateTimePicker onDateChange={handleFromDateChange} />
              </View> */}

                      <TextInput
                        style={styles.inputField}
                        placeholder="Passed Year"
                        placeholderTextColor={lightGreyPrimary}
                        maxLength={4}
                        keyboardType="numeric"
                        value={yearPassed}
                        onChangeText={e => this.setState({yearPassed: e})}
                      />

                      <TextInput
                        style={styles.inputField}
                        placeholder="City"
                        placeholderTextColor={lightGreyPrimary}
                        value={city}
                        onChangeText={e => this.setState({city: e})}
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
  pickerInput: {
    fontSize: wp(3),
    width: wp(94),
    marginHorizontal: 0,
    left: wp(-5),
  },
  downIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
});
