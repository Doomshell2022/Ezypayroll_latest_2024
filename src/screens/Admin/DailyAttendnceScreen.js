import React, {Component} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HeaderComponent from '../../components/HeadersComponent';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../../assets/icons/internetConnectionState.gif';
import CustomLoader from '../../components/CustomLoader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';
// Styles
import basicStyles from '../../styles/BasicStyles';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../api/UserPreference';
// Image
import background from '../../assets/images/background.png';
import ComponenetDailyAttendance from '../../components/DailyAttendanceComp';
import DatePicker from '../../components/Datepicker';
import ProcessingLoader from '../../components/ProcessingLoader';

export default class DailyAttendence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      date: null,
      status: null,
      isLoading: true,
      isRefreshing: true,
      connectionState: true,
      showProcessingLoader: false,
    };
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.handleLeaveHistory();
    this.leavedate();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  // handleLeaveHistory = async date1 => {
  //   console.log('@@@@@!!!!!######', date1);
  //   const date = date1.getDate();
  //   const month = date1.getMonth() + 1;
  //   const year = date1.getFullYear();
  //   const selectedDate = `${date}-${month}-${year}`;
  //   this.setState({date1: selectedDate});
  //   try {
  //     // fetching userInfo
  //     const userInfo = await getData(KEYS.USER_INFO);
  //     if (userInfo) {
  //       const {ezypayrollId, user} = userInfo;
  //       const {id: userId} = user;
  //       // preparing params
  //       const params = {
  //         ezypayrollId,
  //         userId,
  //         date1: selectedDate,
  //       };
  //       console.log('@@#!##!!#!#!@', params);
  //       const response = await makeRequest(
  //         BASE_URL + 'dailyEmpAttendance',
  //         params,
  //       );
  //       if (response) {
  //         const {success} = response;
  //         if (success) {
  //           const {output} = response;
  //           this.setState({
  //             data: output,
  //             date1: selectedDate,
  //             status: null,
  //             isLoading: false,
  //             isRefreshing: false,
  //           });
  //         } else {
  //           const {message} = response;
  //           this.setState({
  //             status: message,
  //             data: null,
  //             isLoading: false,
  //             isRefreshing: false,
  //           });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  leavedate = async date => {
    const formattedDate = date
      .toDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-');
    const userInfo = await getData(KEYS.USER_INFO);
    if (userInfo) {
      this.setState({isLoading: true});

      const {ezypayrollId, user} = userInfo;
      const {id: userId} = user;
      // preparing params

      const params = {
        ezypayrollId,
        userId,
        date: formattedDate,
      };
      const response = await makeRequest(
        BASE_URL + 'dailyEmpAttendance',
        params,
      );
      if (response) {
        const {success} = response;
        if (success) {
          const {output} = response;
          this.setState({
            data: output,
            date: formattedDate,
            status: null,
            isLoading: false,
            isRefreshing: false,
          });
        } else {
          const {message} = response;
          this.setState({
            status: message,
            data: null,
            date: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
      }
    }
  };
  handleLeaveHistory = async date => {
    console.log('@@@@@!!!!!######', date);
    try {
      // fetching userInfo
      // const formattedDate = date
      //   .toDateString('en-US', {
      //     month: '2-digit',
      //     day: '2-digit',
      //     year: 'numeric',
      //   })
      //   .replace(/\//g, '-');
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        this.setState({isLoading: true});

        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;
        // preparing params

        const params = {
          ezypayrollId,
          userId,
          // date: formattedDate,
        };
        // console.log('@@#!##!!#!#!@', params);
        const response = await makeRequest(
          BASE_URL + 'dailyEmpAttendance',
          params,
        );
        if (response) {
          const {success} = response;
          if (success) {
            const {output} = response;
            this.setState({
              data: output,
              // date: formattedDate,
              status: null,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;
            this.setState({
              status: message,
              data: null,
              date: null,
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

  renderItem = ({item}) => <ComponenetDailyAttendance item={item} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleListRefresh = async () => {
    try {
      this.setState({isRefreshing: true}, () => {
        // updating list
        this.componentDidMount();
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {data: output, status, showProcessingLoader, date} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <ImageBackground
              source={background}
              resizeMode="cover"
              style={styles.container}>
              <HeaderComponent
                title="Daily Attendance"
                // navAction="HomeBack"
                nav={this.props.navigation}
                //   showNotificationIcon
                //   notificationCount={notificationCount}
              />
              {/* <View
                style={{
                  alignSelf: 'center',
                  margin: wp(2),
                  borderWidth: 1,
                  width: hp(20),
                  height: hp(3),
                  paddingLeft: wp(2.2),
                  paddingTop: wp(1),
                  alignContent: 'center',
                  borderRadius: wp(2),
                }}>
                <DatePicker onDateChange={this.leavedate} date={date} />
              </View> */}
              <View style={styles.datePickerContainer}>
                <View style={styles.fromDateFieldContainer}>
                  <DatePicker onDateChange={this.leavedate} date={date} />
                </View>
              </View>
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
                <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>{status}</Text>
                </View>
              )}
              {showProcessingLoader && <ProcessingLoader />}
            </ImageBackground>
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
const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
