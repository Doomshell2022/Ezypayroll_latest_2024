import React, {Component} from 'react';
// import background from '../../assets/images/background.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Alert,
  FlatList,
  Image,
  // ImageBackground,
  StyleSheet,
  Text,
  // TextInput,
  SafeAreaView,
  SafeAreaViewBase,
  TouchableOpacity,
  View,
  // ScrollView,
} from 'react-native';
import HeaderComponent from '../../components/HeadersComponent';
import MonthYearPicker2 from '../../components/MothYearComp2';
import NetInfo from '@react-native-community/netinfo';
import PickerModal from 'react-native-picker-modal-view';
import basicStyles from '../../styles/BasicStyles';
import ic_down from '../../assets/icons/ic_down.png';
// import EmployeeAttendanceComp from '../../components/EmployeeAttendanceComp';
import {KEYS, getData} from '../../api/UserPreference';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import AbsentEmployeeComp from '../../components/EmployeeAttendanceComp';
import CustomLoader from '../../components/CustomLoader';
import offline from '../../assets/icons/internetConnectionState.gif';
import ProcessingLoader from '../../components/ProcessingLoader';
import MonthYear from '../../components/MothYearComp2';
import MonthYearPicker from '../../components/MonthPickerComp';
// import {SafeAreaView} from 'react-native-safe-area-context';

export default class EmployeeAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: new Date(),
      emplyList: [],
      data: null,
      empId: null,
      choosemonth: new Date(),
      selectedData: {
        Id: -1,
        Name: 'Select Name',
        Value: '',
      },
      isLoading: true,
      isRefreshing: true,
      connectionState: true,
      showProcessingLoader: false,
      status: null,
    };
    // console.log('####', this.state.data);
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchemployee();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchemployee = async () => {
    const {selectedData} = this.state;
    if (!selectedData.Name) {
      Alert.alert('Please Select a Name');
      return;
    }
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;
        // prepairing params
        const params = {
          ezypayrollId,
          userId,
        };
        const response = await makeRequest(BASE_URL + 'getEmpList', params);
        if (response) {
          const {success} = response;
          if (success) {
            const {data} = response;
            this.setState({
              emplyList: data,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;
            this.setState({
              status: message,
              emplyList: null,
              isLoading: false,
              isRefreshing: false,
            });
          }
        } else {
          this.setState({
            isRefreshing: false,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  handleSelectedData = emplyList => {
    this.setState({selectedData: emplyList});
  };

  handleSelectedDataClose = () => {
    const {selectedData} = this.state;
    this.setState({selectedData});
  };
  renderStatesCategoryPicker = (disabled, selected, showModal, props) => {
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
      <View>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
            {marginTop: wp(2.5), marginLeft: wp(1), marginRight: wp(1)},
          ]}>
          <Text style={labelStyle}>{Name}</Text>
          <Image source={ic_down} resizeMode="cover" style={styles.downIcon} />
        </TouchableOpacity>
      </View>
    );
  };
  renderItem = ({item}) => <AbsentEmployeeComp item={item} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  searchemployee = async (month = new Date().toISOString()) => {
    // const name = this.state.selectedData?.Text;
    const choosemonth = this.state.choosemonth;
    const selectedData = this.state.selectedData.Value;
    // Validating form
    if (!selectedData) {
      Alert.alert('', 'Please select a Employee', [{text: 'OK'}]);
      return;
    }
    try {
      const formattedDate = new Date(month)
        .toLocaleDateString('en-US', {
          month: 'numeric',
          // year: 'numeric',
        })
        .split(' ')
        .join('-');

      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        // const {selectedData, choosemonth} = this.state;
        const selectedmonth = new Date(choosemonth)
          .toLocaleDateString('en-US', {
            month: 'numeric',
            // year: 'numeric',
          })
          .split(' ')
          .join('-');
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;
        this.setState({isLoading: true});
        const params = {
          ezypayrollId,
          userId,
          empId: selectedData,
          month: selectedmonth,
        };
        const response = await makeRequest(
          BASE_URL + 'getMonthWiseEmpAttendance',
          params,
        );
        console.log('@@###', response);
        if (response) {
          const {success} = response;
          if (success) {
            const {output} = response;
            this.setState({
              data: output,
              message: null,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;
            this.setState({
              status: message,
              month: null,
              data: null,
              isLoading: false,
              isRefreshing: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  searchemployee2 = async (month = new Date().toISOString()) => {
    try {
      const formattedDate = new Date(month)
        .toLocaleDateString('en-US', {
          month: 'numeric',
          // year: 'numeric',
        })
        .split(' ')
        .join('-');
      this.setState({
        choosemonth: month,
      });
    } catch (error) {}
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {
      month,
      emplyList,
      selectedData,
      data: output,
      showProcessingLoader,
      // status,
    } = this.state;
    // console.log('aaa', status);
    return (
      // <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {this.state.connectionState && (
          <>
            {/* <ImageBackground
              source={background}
              resizeMode="cover"
              style={styles.container}> */}
            <HeaderComponent
              title="Employee Attendance"
              // navAction="HomeBack"
              nav={this.props.navigation}
              // showNotificationIcon
            />
            {/* <View style={styles.datePickerContainer}> */}
            <View
              style={{
                margin: wp(2),
                // width: hp(18.5),
                height: hp(5),
                borderRadius: wp(1),
                borderWidth: 1,
                borderColor: '#ccc',
              }}>
              {emplyList && (
                <PickerModal
                  items={emplyList}
                  searchInputTextColor="#000"
                  requireSelection={true}
                  selected={selectedData}
                  onSelected={this.handleSelectedData}
                  onClosed={this.handleSelectedDataClose}
                  showToTopButton={true}
                  showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={false}
                  searchPlaceholderText="Search"
                  renderSelectView={this.renderStatesCategoryPicker}
                />
              )}
            </View>
            {/* <View style={styles.fromDateFieldContainer}> */}

            {/* </View> */}
            {/* </View> */}

            <View
              style={{
                margin: wp(2),
                // width: hp(18.5),
                // height: hp(5),
                borderRadius: wp(1),
                borderWidth: 1,
                borderColor: '#ccc',
              }}>
              <MonthYearPicker2
                onDateChange={this.searchemployee2}
                selectedDate={month}
              />
              <TouchableOpacity
                style={{
                  marginRight: wp(2),
                  backgroundColor: '#0077a2',
                  // padding: wp(3),
                  width: hp(5),
                  borderRadius: wp(1),
                  height: hp(5),
                }}
                // style={styles.updateButton}
                onPress={this.searchemployee}>
                <Image
                  source={require('../../assets/icons/ic_search.png')}
                  style={{
                    width: wp(4),
                    height: wp(4),
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: wp(2.8),
                  }}
                />
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
                style={styles.updateButton}
                onPress={this.searchemployee}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/icons/search-interface-symbol.png')}
                    style={{width: wp(4), height: wp(4)}}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: wp(3.5),
                      marginLeft: wp(2),
                    }}>
                    Search
                  </Text>
                </View>
              </TouchableOpacity> */}
            <View>
              {output ? (
                <FlatList
                  data={output}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContentContainer}
                  showsVerticalScrollIndicator={false}
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: hp(10),
                  }}>
                  <Text>No Employee Attendance</Text>
                </View>
              )}
            </View>
            {showProcessingLoader && <ProcessingLoader />}
            {/* </ImageBackground> */}
          </>
        )}
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
    marginBottom: hp(18),
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp(4),
    marginLeft: wp(2),
    marginRight: wp(2),
  },
  fromDateFieldContainer: {
    flex: 1,
    //     width: hp(5.5),
    height: hp(5.5),
    width: hp(10),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(2),
    marginTop: wp(1.5),
    marginRight: wp(3),
    justifyContent: 'center',
    // paddingTop: hp(20),
  },
  updateButton: {
    backgroundColor: '#0077a2',
    height: hp(5.5),
    width: hp(13),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginTop: hp(2),
    alignSelf: 'center',
    marginBottom: wp(5),
  },
  fromDateFieldContainer2: {
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
  fontSizee: {
    fontSize: wp(2),
    color: '#ccc',
  },
  downIcon: {
    width: wp(2),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
});
