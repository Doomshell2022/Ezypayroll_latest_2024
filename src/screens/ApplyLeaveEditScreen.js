import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// Colors
import {colors} from '../assets/colors/colors';
import SafeAreaView from 'react-native-safe-area-view';

import get from 'lodash/get';
//  Components
import HeadersComponent from '../components/HeadersComponent';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';
import DateTimePicker from '../components/DateTimePicker';
import {showToast} from '../components/ToastComponent';
import PickerModal from 'react-native-picker-modal-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import RadioButtonRN from 'radio-buttons-react-native';

// Image
import ic_calendar from '../assets/icons/ic_drawer_attendance.png';
import ic_down from '../assets/icons/ic_down.png';
import ic_drawer from '../assets/icons/ic_drawer.png';
import background from '../assets/images/background.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';

// Styles
import basicStyles from '../styles/BasicStyles';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';

const data1 = [
  {
    label: 'Half Day',
    value: '0',
  },
  {
    label: 'Full Day',
    value: '1',
  },
];
const halfDayShift = [
  {
    label: 'Pre Lunch',
    value: '0',
  },
  {
    label: 'Post Lunch',
    value: '1',
  },
];

const data2 = [
  {id: 1, label: 'Item 1', value: '1'},
  {id: 2, label: 'Item 2', value: '2'},
];
export default class ApplyLeaveEditScreen extends Component {
  constructor(props) {
    super(props);
    const id = props.navigation.state.params;
    console.log('id===', id.id);
    this.state = {
      isLoading: true,
      output: null,
      status: null,
      isRefreshing: false,
      data: null,
      fromDate: '14-11-2022',
      toDate: '14-11-2022',
      narration: '',
      leaveTypeId: -0,
      openingBalance: 0,
      leavesTaken: 0,
      closingBalance: 0,
      showProcessingLoader: false,
      selectedMinDate: null,
      isVisible: false,
      selectedDate: 'Select Date',
      connectionState: true,
      halfday: false,
      halfdayshift: false,
      daystatus: '',
      shiftstatus: '',
      selectedSupport: {
        Id: -1,
        Name: 'Select Leave Type',
        Value: 'Select Leave Type',
      },
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchLeaveTypes();
    // this.handleLeaveData();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchLeaveTypes = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;

        // preparing params
        const params = {
          ezypayrollId,
          userId,
        };

        const response = await makeRequest(BASE_URL + 'leaveTypes', params);

        if (response) {
          const {success} = response;

          if (success) {
            const {output} = response;

            const data = output.map(item => ({
              Id: item.leaveTypeId,
              Name: item.leaveType,
              Value: item.total,
              Balance: item.balance,
            }));

            this.setState({
              data,
              status: null,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;

            this.setState({
              status: message,
              data: null,
              isLoading: false,
              isRefreshing: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleLeaveData = async () => {
    const {leaveTypeId} = this.state;
    //const leaveTypeId = 2;
    if (leaveTypeId === -0) {
      Alert.alert('', 'Please select Leave Type', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
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
          leaveTypeId,
        };

        const response = await makeRequest(
          BASE_URL + 'leaveApplicationForm',
          params,
        );

        this.setState({showProcessingLoader: false});
        if (response) {
          const {success} = response;

          if (success) {
            const {output} = response;

            const {openingBalance, leavesTaken, closingBalance} = output;

            this.setState({
              output,
              openingBalance,
              leavesTaken,
              closingBalance,
              status: null,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;

            this.setState({
              openingBalance: 0,
              leavesTaken: 0,
              closingBalance: 0,
              status: message,
              output: null,
              isLoading: false,
              isRefreshing: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  handleLeaveApply = async () => {
    const {fromDate, toDate, narration, leaveTypeId, daystatus, shiftstatus} =
      this.state;

    let date = fromDate.getDate();
    let month = fromDate.getMonth() + 1;
    let year = fromDate.getFullYear();
    let fromDate1 = `${date}-${month}-${year}`;
    /* // validations
    if (leaveTypeId === -0) {
      Alert.alert('Alert!', 'Please select Leave Type', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (fromDate.trim() === '') {
      Alert.alert('Alert!', 'Please select From date', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (toDate.trim() === '') {
      Alert.alert('Alert!', 'Please select To date', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (narration.trim() === '') {
      Alert.alert('', 'Please enter Reason', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    } */

    try {
      // starting loader

      this.setState({showProcessingLoader: true});

      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo && leaveTypeId) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;

        // preparing params

        const params = {
          ezypayrollId: ezypayrollId,
          userId: userId,
          leaveTypeId: leaveTypeId,
          fromDate: fromDate1,
          toDate: toDate,
          narration: narration,
          leaveType: daystatus,
          halfDayShif: shiftstatus,
        };

        const response = await makeRequest(
          BASE_URL + 'leaveApplication',
          params,
        );

        if (response) {
          // stopping loader
          this.setState({showProcessingLoader: false});

          const {success, message} = response;

          console.log('aplly=', response);

          if (success) {
            showToast(message);
            const {pop, getParam} = this.props.navigation;

            const handleRefresh = await getParam('handleRefresh', null);

            await handleRefresh();
            pop();
          } else {
            showToast(message);
            const {pop, getParam} = this.props.navigation;
            const handleRefresh = await getParam('handleRefresh', null);

            await handleRefresh();
            pop();
          }
        }
      }
    } catch (error) {
      console.log('error==', error.message);
    }
  };

  handleFromDateChange = (fromDate, selectedMinDate) => {
    this.setState({fromDate, selectedMinDate});
  };

  handleToDateChange = toDate => {
    this.setState({toDate});
  };

  handleNarrationChange = narration => {
    this.setState({narration});
  };

  renderStatesCategoryPicker = (disabled, selected, showModal) => {
    const {selectedSupport} = this.state;
    const {Name} = selectedSupport;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'Select Leave Type') {
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

  handleSelectedSupport = async selectedSupport => {
    const {Id, Value, Balance} = selectedSupport;
    this.setState({selectedSupport, leaveTypeId: Id}, () =>
      this.handleLeaveData(),
    );

    return selectedSupport;
  };

  handleSelectedSupportClose = () => {
    const {selectedSupport} = this.state;
    this.setState({selectedSupport});
  };

  showPicker = () => {
    this.setState({
      isVisible: true,
    });
  };

  hidePicker = () => {
    this.setState({
      isVisible: false,
    });
  };

  handlePickerConfirm = dateObj => {
    try {
      const date = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      const selectedDate = `${date}-${month}-${year}`;
      this.setState({toDate: selectedDate, selectedDate, isVisible: false});

      let from = this.state.fromDate;
      let date1 = from.getDate();
      let month1 = from.getMonth();
      let year1 = from.getFullYear();

      let d1 = new Date(year, month - 1, date);
      let d2 = new Date(year1, month1, date1);
      let bool = d1.getTime() === d2.getTime();

      if (bool) {
        this.setState({halfday: bool});
      } else {
        this.setState({halfday: false});
      }
    } catch (error) {
      console.log('error=', error);
    }
  };
  handleDayShift = e => {
    this.setState({shiftstatus: e.label});
  };
  handleDays = e => {
    console.log('day', e);
    if (e.label === 'Half Day') {
      this.setState({halfdayshift: true});
    } else {
      this.setState({halfdayshift: false});
    }

    this.setState({daystatus: e.label});
  };
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {
      showProcessingLoader,
      openingBalance,
      leavesTaken,
      closingBalance,
      selectedSupport,
      data,
      isVisible,
      selectedDate,

      selectedMinDate,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              nav={this.props.navigation}
              title="Apply Leave Edit"
              navAction="back"
            />
            <View style={styles.contentContainer}>
              <KeyboardAwareScrollView
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.mainListContainer}>
                <View style={styles.mainListContainer}>
                  <View style={styles.fromDateFieldContainer}>
                    <Dropdown
                      style={{fontSize: wp(3)}}
                      placeholderStyle={{fontSize: wp(3)}}
                      selectedTextStyle={{fontSize: wp(3)}}
                      inputSearchStyle={{fontSize: wp(3)}}
                      iconStyle={styles.iconStyle}
                      data={data}
                      search
                      maxHeight={300}
                      labelField="Name"
                      valueField="Value"
                      placeholder="Select Leave Type..."
                      searchPlaceholder="Search..."
                      value={selectedSupport}
                      onChange={this.handleSelectedSupport}
                    />
                    {/* <PickerModal
                      items={data}
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
                    /> */}
                  </View>

                  <View style={styles.listContainer}>
                    <Text style={styles.infoHeadStyle}>Opening Balance</Text>
                    <Text style={styles.infoTextStyle}>{openingBalance}</Text>
                  </View>

                  <View style={styles.listContainer}>
                    <Text style={styles.infoHeadStyle}>Leaves Taken</Text>
                    <Text style={styles.infoHeadTextStyle}>{leavesTaken}</Text>
                  </View>

                  <View style={styles.listContainer}>
                    <Text style={styles.infoHeadStyle}>Closing Balance</Text>
                    <Text style={styles.infoTextStyle}>{closingBalance}</Text>
                  </View>
                </View>

                <View style={styles.datePickerContainer}>
                  <Text style={styles.fromDateTxt}>From</Text>
                  <View style={styles.fromDateFieldContainer}>
                    <DateTimePicker
                      onDateChange={this.handleFromDateChange}
                      isMinDate={true}
                    />
                  </View>
                </View>

                <View style={styles.datePickerContainer}>
                  <Text style={styles.fromDateTxt}>To</Text>
                  <View style={styles.fromDateFieldContainer}>
                    <TouchableOpacity
                      underlayColor="transparent"
                      onPress={this.showPicker}>
                      <View style={styles.dateButtonContainer}>
                        <Text style={styles.selectedDate}>{selectedDate}</Text>
                        <Image
                          source={ic_calendar}
                          resizeMode="cover"
                          style={styles.calendarIcon}
                        />
                      </View>
                    </TouchableOpacity>

                    <DateTimePickerModal
                      isVisible={isVisible}
                      mode="date"
                      minimumDate={
                        selectedMinDate === null
                          ? new Date()
                          : new Date(
                              selectedMinDate.year,
                              selectedMinDate.month,
                              selectedMinDate.date,
                            )
                      }
                      onConfirm={this.handlePickerConfirm}
                      onCancel={this.hidePicker}
                    />
                  </View>
                </View>

                {this.state.halfday && (
                  <View style={{flex: 1}}>
                    <RadioButtonRN
                      data={data1}
                      selectedBtn={e => this.handleDays(e)}
                    />
                  </View>
                )}

                {this.state.halfdayshift && (
                  <View style={{flex: 1}}>
                    <Text>Half Day Shift</Text>
                    <RadioButtonRN
                      data={halfDayShift}
                      selectedBtn={e => this.handleDayShift(e)}
                    />
                  </View>
                )}
                <View style={styles.textareaContainer}>
                  <TextInput
                    style={styles.textareaInput}
                    placeholder="Type Reason Here ..."
                    placeholderTextColor="#777"
                    multiline={true}
                    numberOfLines={7}
                    value={this.state.narration}
                    onChangeText={this.handleNarrationChange}
                  />
                </View>

                {/*   <Text style={styles.reasonStyle}>Reason</Text> */}

                <View style={styles.applyButtonContainer}>
                  <TouchableOpacity
                    onPress={this.handleLeaveApply}
                    style={styles.applyButton}>
                    <Text style={styles.buttonText}>Apply To Update</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>

              {showProcessingLoader && <ProcessingLoader />}
            </View>
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

const {darkGreyPrimary, lightBluePrimary, lightGreyPrimary, whitePrimary} =
  colors;

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
    backgroundColor: '#fff',
    flex: 1,
  },
  homeTextContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: wp(3),
    marginBottom: wp(3),
  },
  contentContainer: {
    flex: 1,
    padding: wp(3),
  },
  homeTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    fontWeight: '400',
    marginRight: wp(3),
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
    fontSize: wp(3),
    width: wp(94),
    marginHorizontal: 0,
    left: wp(-5),
  },
  toDateFieldContainer: {
    marginTop: hp(2),
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: lightGreyPrimary,
    height: hp(6),
    justifyContent: 'center',
  },
  calendarStyle: {
    height: hp(4.5),
    aspectRatio: 1 / 1,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fromDateTxt: {
    color: '#333',
    fontSize: wp(3.5),
    fontWeight: '600',
    marginRight: wp(3),
    marginTop: wp(-1),
    width: wp(10),
  },

  listContainer: {
    flexDirection: 'row',
    paddingRight: wp(3),
    justifyContent: 'space-between',
    paddingVertical: wp(2),
  },

  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
  },
  infoHeadStyle: {
    color: '#333',
    fontSize: wp(3.5),
    textTransform: 'capitalize',
  },
  infoTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
  },
  infoTextBStyle: {
    color: '#333',
    fontSize: wp(3.5),
  },
  textareaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: hp(2),
  },
  textareaInput: {
    fontSize: wp(3.2),
    color: darkGreyPrimary,
    height: hp(15),
    textAlignVertical: 'top',
    flex: 1,
  },
  reasonStyle: {
    color: '#0077a2',
    paddingTop: hp(1.5),
    fontSize: wp(3.5),
    fontWeight: '600',
  },
  applyButtonContainer: {
    marginTop: hp(2),
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#0077a2',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    width: '100%',
  },
  buttonText: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  downIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  dateButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
    // marginRight: wp(2),
  },
  selectedDate: {
    fontSize: wp(3),
    marginLeft: wp(0),
  },
});
