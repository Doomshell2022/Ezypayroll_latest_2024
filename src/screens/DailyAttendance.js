import React, {Component} from 'react';
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import background from '../assets/images/background.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import basicStyles from '../styles/BasicStyles';

import HeaderComponent from '../components/HeadersComponent';
// import MonthPickerComp from '../components/MonthPicker';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {getData, KEYS} from '../api/UserPreference';
// import DatePicker2 from '../components/MonthPickerComp';
// import MonthPickerSelect from '../components/MonthPickerComp';
import MonthYearPicker from '../components/MonthPickerComp';
import AbsentComponent from '../components/AbsentComponent';
// import DatePicker from '../components/Datepicker';
import NetInfo from '@react-native-community/netinfo';
import CustomLoader from '../components/CustomLoader';
import basicStyles from '../styles/BasicStyles';

export default class DailyAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: new Date(),
      data: null,
      status: null,
      isLoading: true,
      isRefreshing: true,
    };
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.handleLeavedata();
    this.leavedate();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  renderItem = ({item}) => <AbsentComponent item={item} />;
  // renderItem2 = ({item}) => <MonthPickerComp item={item} />;

  keyExtractor = (item, index) => index.toString();
  itemSeparator = () => <View style={styles.separator} />;
  submitPunchOutIssue = async params => {
    try {
      const response = await makeRequest(
        BASE_URL + 'requestpunchOutIssue',
        params,
      );
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow error for handling in component
    }
  };
  leavedate = async (
    month = new Date().toISOString(),
    year = new Date().getFullYear(),
  ) => {
    const formattedDate = new Date(month)
      .toLocaleDateString('en-US', {
        month: 'numeric',
      })
      .split(' ')
      .join('-');
    const formattedDate2 = new Date(month)
      .toLocaleDateString('en-US', {
        year: 'numeric',
      })
      .split(' ')
      .join('-');
    const userInfo = await getData(KEYS.USER_INFO);
    this.setState({isLoading: true});

    if (userInfo) {
      const {ezypayrollId, user} = userInfo;
      const {id: userId} = user;

      const params = {
        ezypayrollId,
        userId,
        month: formattedDate,
        year: formattedDate2,
      };

      const response = await makeRequest(BASE_URL + 'leavesTaken', params);

      if (response) {
        const {success} = response;
        if (success) {
          const {output} = response;
          this.setState({
            data: output,
            status: null,
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
  };

  handleLeavedata = async month => {
    console.log('"#######', month);
    const formattedDate = new Date(month)
      .toLocaleDateString('en-US', {
        month: 'short',
        // year: 'numeric',
      })
      .split(' ')
      .join('-');
    const formattedDate2 = new Date(month)
      .toLocaleDateString('en-US', {
        // month: 'short',
        year: 'numeric',
      })
      .split(' ')
      .join('-');
    const userInfo = await getData(KEYS.USER_INFO);
    if (userInfo) {
      const {ezypayrollId, user} = userInfo;
      const {id: userId} = user;
      // preparing params
      const params = {
        ezypayrollId,
        userId,
        month: formattedDate,
        year: formattedDate2,
      };
      const response = await makeRequest(BASE_URL + 'leavesTaken', params);
      this.setState({
        isLoading: true,
        isProcessing: false,
        isRefreshing: false,
      });
      if (response) {
        const {success} = response;
        if (success) {
          const {output} = response;
          this.setState({
            data: output,
            month: formattedDate,
            status: null,
            isLoading: false,
            isRefreshing: false,
          });
        } else {
          const {message} = response;
          this.setState({
            status: message,
            month: null,
            data: null,
            date: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
      }
    }
  };

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isRefreshing: true}, () => {
        // updating list
        this.componentDidMount();
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  render() {
    const {data: output, month, status} = this.state;
    // console.log('khush', this.state.month);
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        {/* <View style={styles.container}> */}
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.container}>
          <HeaderComponent
            title="Attendance"
            // navAction="HomeBack"
            nav={this.props.navigation}
            //   showNotificationIcon
            //   notificationCount={notificationCount}
          />
          <View style={styles.datePickerContainer}>
            <View style={styles.fromDateFieldContainer}>
              {/* <DatePicker2
                onDatechange={this.leavedate}
                // date={date}
                mode={'month'}
              /> */}
              <MonthYearPicker
                onDateChange={this.leavedate}
                selectedDate={month}
              />
            </View>
          </View>
          <View style={styles.historyContainer}>
            {output ? (
              <View>
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
              </View>
            ) : (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{status}</Text>
              </View>
            )}
          </View>
        </ImageBackground>
        {/* </View> */}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f2f1f1',
  },
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
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
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#f2f1f1',
  // },
  historyContainer: {
    // flex: 1,
    padding: wp(2),
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp(0.2),
  },
  editButton: {
    backgroundColor: '#0077a2',
    margin: wp(2),
    padding: wp(3),
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#0077a2',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    margin: wp(2),
  },
  container1: {
    flex: 1,
    backgroundColor: '#ddd8',
    // borderWidth: 1,
    borderRadius: wp(1.2),
    marginHorizontal: wp(1.5),
  },

  listContainer: {
    // marginBottom: hp(0.5),
    justifyContent: 'space-between',
    padding: wp(1),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(3),
  },
  infoHeadStyle: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
  },
  container2: {
    flex: 1,
    backgroundColor: '#ddd8',
    // borderWidth: 1,
    borderRadius: wp(1.2),
    marginHorizontal: wp(1.5),
    marginBottom: wp(0.4),
    marginTop: wp(0.4),
  },

  listContainer2: {
    // marginBottom: hp(0.5),
    justifyContent: 'space-between',
    padding: wp(1),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoHeadTextStyle2: {
    color: '#333',
    fontSize: wp(3),
  },
  infoHeadStyle2: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
  },
  punchinout: {flex: 1, paddingLeft: wp(2)},
  listContainer3: {
    flex: 1,
    backgroundColor: '#0077a2',
    borderRadius: 5,
    marginBottom: hp(1),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(1),
    paddingHorizontal: wp(2.5),
  },

  listContentContainerStyle: {
    paddingHorizontal: wp(5),
  },

  infoHeadTextStyle3: {
    color: '#fff',
    fontSize: wp(3),
    marginRight: wp(1),
  },
  infoHeadStyle3: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
    marginLeft: wp(1),
  },
  separator: {
    height: hp(0.5),
  },
});
