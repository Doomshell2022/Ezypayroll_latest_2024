import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  AppState,
  // ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ScrollView} from 'react-native-virtualized-view';
// Colors
import {colors} from '../../assets/colors/colors';
import AutoScrolling from 'react-native-auto-scrolling';
// import SafeAreaView from 'react-native-safe-area-view';
//  Components
import HeadersComponent from '../../components/HeadersComponent';
import CustomLoader from '../../components/CustomLoader';
import ProcessingLoader from '../../components/ProcessingLoader';
import AdminLeavesPendingHome from '../../components/AdminLeavesPendingHome';
import AdminLeavesApprovedHome from '../../components/AdminLeavesApprovedHome';
import Footer from '../../components/Footer';

// Image
import background from '../../assets/images/background.png';

// Icons
import ic_leaves from '../../assets/icons/ic_leaves.png';
import ic_payslips from '../../assets/icons/ic_payslips.png';
import ic_drawer from '../../assets/icons/ic_drawer.png';
import dobcake from '../../assets/icons/dobcake.png';
import ic_paylists from '../../assets/icons/ic_paylists.png';
import ic_attendance from '../../assets/icons/ic_attendance.png';
import ic_hr_request from '../../assets/icons/ic_hr_request.png';
import ic_leave from '../../assets/icons/ic_leave.png';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../api/UserPreference';

// Styles
import basicStyles from '../../styles/BasicStyles';

// Delegates
import {
  checkPermission,
  isAppOpenedByRemoteNotificationWhenAppClosed,
  resetIsAppOpenedByRemoteNotificationWhenAppClosed,
} from '../../firebase_api/FirebaseAPI';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../../assets/icons/internetConnectionState.gif';
// References
export let homeScreenFetchNotificationCount = null;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.end = this.end.bind(this);

    this.state = {
      profile: null,
      isLoading: true,
      notificationCount: 0,
      output: null,
      name: '',
      connectionState: true,
      events: null,

      status: 'No Data Available',
      appState: AppState.currentState,

      showProcessingLoader: false,
      leavesData: null,
      approvedLeavesData: null,
      isRefreshing: false,
    };

    this.coords = null;
  }

  end() {
    console.log('end of play');
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchHome();

    if (isAppOpenedByRemoteNotificationWhenAppClosed) {
      resetIsAppOpenedByRemoteNotificationWhenAppClosed();
      this.props.navigation.navigate('Notification');
      return;
    }

    homeScreenFetchNotificationCount = this.fetchNotificationCount;
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
    homeScreenFetchNotificationCount = null;
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  fetchHome = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;

        this.setState({
          isLoading: true,
        });

        // preparing params
        const params = {
          ezypayrollId,
          userId,
        };

        const response = await makeRequest(BASE_URL + 'adminHome', params);

        if (response) {
          const {success} = response;

          if (success) {
            const {name, company, events, leavesData, approvedLeavesData} =
              response;
            this.setState({
              name,
              company,
              events,
              leavesData,
              approvedLeavesData,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;
            // stopping loader
            this.setState({
              showProcessingLoader: false,
              isRefreshing: false,
            });

            Alert.alert('', message, [{text: 'OK'}], {
              cancelable: false,
            });
          }
        } else {
          this.setState({
            isRefreshing: false,
            isLoading: false,
            showProcessingLoader: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchNotificationCount = async () => {
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
        // calling api
        const response = await makeRequest(
          BASE_URL + 'getNotificationCount',
          params,
        );

        // processing response
        if (response) {
          const {success} = response;

          if (success) {
            const {notificationCount} = response;
            this.setState({
              notificationCount,
              isLoading: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleAppStateChange = async nextAppState => {
    try {
      const {appState} = this.state;
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        await this.fetchNotificationCount();
      }

      this.setState({appState: nextAppState});
    } catch (error) {
      console.log(error.message);
    }
  };

  tileItem = ({item}) => {
    const {tileIcon, tileTitle, routeName} = item;
    const handleNavigate = () => {
      this.props.navigation.navigate(routeName);
    };
    return (
      <TouchableOpacity style={styles.tileContainer} onPress={handleNavigate}>
        <Image source={tileIcon} resizeMode="cover" style={styles.tileIcon} />
        <Text>{tileTitle}</Text>
      </TouchableOpacity>
    );
  };

  handleApproveReject = async (applicationId, status) => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;

        this.setState({showProcessingLoader: true});

        // preparing params
        const params = {
          ezypayrollId,
          userId,
          applicationId,
          status,
        };

        const response = await makeRequest(
          BASE_URL + 'approveDeclineLeave',
          params,
        );

        if (response) {
          const {success, message} = response;

          if (success) {
            Alert.alert('Alert!', message, [{text: 'OK'}], {
              cancelable: false,
            });

            await this.fetchHome();

            this.setState({
              status: null,
              showProcessingLoader: false,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            Alert.alert('Alert!', message, [{text: 'OK'}], {
              cancelable: false,
            });
            await this.fetchHome();

            this.setState({
              leavesData: null,
              showProcessingLoader: false,
              isLoading: false,
              isRefreshing: false,
            });
          }
        } else {
          await this.fetchHome();
          this.setState({
            isLoading: false,
            showProcessingLoader: false,
            isRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <AdminLeavesPendingHome
      item={item}
      handleApproveReject={this.handleApproveReject}
    />
  );

  renderApproved = ({item}) => <AdminLeavesApprovedHome item={item} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(0.5)}} />;

  renderSlots = () => {
    const {events} = this.state;

    return events.map((item, index) => {
      return (
        <View style={styles.cakeContainer} key={index}>
          <Text style={[styles.homeText, {fontWeight: '700'}]}>
            {item.name} :
          </Text>
          <Text
            style={[styles.homeTextStyle, {fontWeight: '700', color: '#fff'}]}>
            {' '}
            {item.date}
          </Text>
        </View>
      );
    });
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
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    const {
      name,
      events,
      notificationCount,
      showProcessingLoader,
      isRefreshing,
      leavesData,
      status,
      company,
      approvedLeavesData,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <ImageBackground
              source={background}
              resizeMode="cover"
              style={styles.container}>
              <HeadersComponent
                title="Home"
                icon={ic_drawer}
                navType="Admin"
                nav={this.props.navigation}
                showNotificationIcon
                notificationCount={notificationCount}
              />
              <View style={styles.mainContainer}>
                <ScrollView
                  style={styles.homeContainer}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.isRefreshing}
                      onRefresh={this.handleListRefresh}
                    />
                  }>
                  {events ? (
                    <View style={styles.eventStyle}>
                      <AutoScrolling style={styles.scrolling1}>
                        <View style={{flexDirection: 'row'}}>
                          {this.renderSlots()}
                        </View>
                      </AutoScrolling>
                    </View>
                  ) : null}

                  <View style={styles.homeTextContainer}>
                    <View style={basicStyles.flexOne}>
                      <Text style={styles.homeTextStyle2}>{name}</Text>
                      <Text style={styles.homeTextStyle}>{company}</Text>
                    </View>
                  </View>

                  {leavesData ? (
                    <View
                      style={[basicStyles.flexOne, basicStyles.paddingHalf]}>
                      <Text
                        style={[
                          basicStyles.headingLarge,
                          {color: '#666', marginBottom: wp(2)},
                        ]}>
                        Leave Requests
                      </Text>
                      <FlatList
                        data={leavesData}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                        ItemSeparatorComponent={this.itemSeparator}
                        contentContainerStyle={styles.listContentContainer}
                        showsVerticalScrollIndicator={false}
                        // refreshing={isRefreshing}
                        // onRefresh={this.handleListRefresh}
                      />
                    </View>
                  ) : (
                    <View style={styles.messageContainer}>
                      {/* <Text style={styles.messageText}>{status}</Text> */}
                    </View>
                  )}

                  {approvedLeavesData ? (
                    <View
                      style={[basicStyles.flexOne, basicStyles.paddingHalf]}>
                      <Text
                        style={[
                          basicStyles.headingLarge,
                          {color: '#666', marginBottom: wp(2)},
                        ]}>
                        Approved Leave Request
                      </Text>
                      <FlatList
                        data={approvedLeavesData}
                        renderItem={this.renderApproved}
                        keyExtractor={this.keyExtractor}
                        ItemSeparatorComponent={this.itemSeparator}
                        contentContainerStyle={styles.listContentContainer}
                        showsVerticalScrollIndicator={false}
                        // refreshing={isRefreshing}
                        // onRefresh={this.handleListRefresh}
                      />
                    </View>
                  ) : (
                    <View style={styles.messageContainer}>
                      {/* <Text style={styles.messageText}>{status}</Text> */}
                    </View>
                  )}
                </ScrollView>
                {/* <Footer tab="Home" nav={this.props.navigation} /> */}
              </View>
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
    flex: 1,
  },

  mainContainer: {
    flex: 1,
    // backgroundColor: '#fff5',
  },
  eventStyle: {
    height: 26,
    width: wp(100),
    backgroundColor: '#0077a2',
    alignItems: 'center',
    marginBottom: wp(2),
    // borderRadius: wp(1),
    // marginTop: wp(2),
    elevation: 3,
  },
  homeContainer: {
    flex: 1,
    // backgroundColor: '#ddd',
  },
  homeTextContainer: {
    // backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    // elevation: 5,
    // marginBottom: wp(3),
    flexDirection: 'row',
    padding: wp(3),
  },
  homeText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '400',
    // margin: wp(1),
  },
  homeTextStyle: {
    color: '#333',
    fontSize: wp(3),
    fontWeight: '400',
  },
  homeTextStyle2: {
    color: '#333',
    fontSize: wp(4),
    fontWeight: '700',
  },

  icStyle: {
    height: hp(4),
    aspectRatio: 1 / 1,
  },

  textCenter: {
    textAlign: 'center',
    color: '#fff',
  },

  cakeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: wp(1),
    marginHorizontal: wp(4),
  },

  listContainers: {
    borderTopWidth: 0.5,
    borderTopColor: '#ccc8',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc8',
  },

  tileContainer: {
    borderWidth: 0.5,
    borderColor: '#0077a2',
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp(4),
    height: hp(20),
  },
  tileIcon: {
    height: wp(10),
    aspectRatio: 1 / 1,
    marginBottom: wp(2),
  },
});
