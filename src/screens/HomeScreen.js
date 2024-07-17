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
  ScrollView,
  Platform,
  RefreshControl,
  BackHandler,
  SafeAreaView,
  NativeModules,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ic_profile_pic from '../assets/icons/ic_profile_pic.png';
import DeviceInfo from 'react-native-device-info';

import AutoScrolling from 'react-native-auto-scrolling';
// Colors
import {colors} from '../assets/colors/colors';
import deviceInfoModule from 'react-native-device-info';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import CustomLoader from '../components/CustomLoader';
import LssListComponent from '../components/LssListComponent';
import LalListComponent from '../components/LalListComponent';
import ProcessingLoader from '../components/ProcessingLoader';
import HomeTileComponent from '../components/HomeTileComponent';

// Image
import background from '../assets/images/background.png';

// Icons
import ic_leaves from '../assets/icons/ic_leaves.png';
import ic_payslips from '../assets/icons/ic_payslips.png';
import ic_drawer from '../assets/icons/ic_drawer.png';
import dobcake from '../assets/icons/dobcake.png';
import ic_paylists from '../assets/icons/ic_paylists.png';
import ic_attendance from '../assets/icons/ic_attendance.png';
import ic_hr_request from '../assets/icons/ic_hr_request.png';
import ic_leave from '../assets/icons/ic_leave.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, clearData, getData} from '../api/UserPreference';

// Styles
import basicStyles from '../styles/BasicStyles';

// Delegates
import {
  checkPermission,
  isAppOpenedByRemoteNotificationWhenAppClosed,
  resetIsAppOpenedByRemoteNotificationWhenAppClosed,
} from '../firebase_api/FirebaseAPI';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
import UpdateBanner from '../components/UpdateBanner';
import DeveloperModeAlert from '../components/CustomAlertModal';
// References
export let homeScreenFetchNotificationCount = null;
let currentCount = 0;
const {DeveloperMode} = NativeModules;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.end = this.end.bind(this);

    this.state = {
      geometry: '',
      currentAddressComponent: '',
      currentLocationAddress: '',
      loca: {},
      punchconfig: false,
      punch: 'in',
      punchcolor: 'red',
      curtime: '',
      image: '',
      lat: '',
      lang: '',
      add: '',
      dis: '',
      mdis: '',
      dis1: '',
      slat: 26.95192,
      slang: 75.77819,
      mlat: 26.847695,
      mlang: 75.76878,
      notiftitle: null,
      notifmessage: null,
      notifdate: null,
      isRefreshing: false,
      profile: null,
      isLoading: true,
      notificationCount: 0,
      output: null,
      name: '',
      company: '',
      advance: '',
      events: null,
      salarySlip: '',
      appliedLeaves: '',
      status: 'No Data Available',
      appState: AppState.currentState,
      isDeveloperModeVisible: false,

      punchedIn: false,
      punchedOut: false,
      showProcessingLoader: false,
      connectionState: true,
      tileData: [
        {
          tileIcon: ic_paylists,
          tileTitle: 'Payslips',
          routeName: 'My PaySlips',
        },
        {
          tileIcon: ic_attendance,
          tileTitle: 'Attendance',
          routeName: 'Attendance',
        },
        {
          tileIcon: ic_hr_request,
          tileTitle: 'HR Request',
          routeName: 'HR Request',
        },
        {
          tileIcon: ic_leave,
          tileTitle: 'Leaves',
          routeName: 'Leaves',
        },
      ],
      isUpdateVisible: false,
      isStoreUrl: null,
    };
    this.coords = null;
    this.res = false;
  }

  end() {
    console.log('end of play');
  }
  DeveloperMode = () => {
    DeveloperMode.isDeveloperModeEnabled()
      .then(isEnabled => {
        if (isEnabled) {
          this.setState({isDeveloperModeVisible: true});
        }
      })
      .catch(error => {
        console.error('Error checking developer mode:', error);
      });
  };
  componentDidMount = async () => {
    await this.checkAppVersion();
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    checkPermission();
    // await this.DeveloperMode();
    await this.checkPermission();
    // navigating to Notification screen

    this.fetchHome();
    await this.checkPermission1();
    if (isAppOpenedByRemoteNotificationWhenAppClosed) {
      resetIsAppOpenedByRemoteNotificationWhenAppClosed();
      this.props.navigation.navigate('Notification');
      return;
    }
    homeScreenFetchNotificationCount = this.fetchNotificationCount;
    AppState.addEventListener('change', this.handleAppStateChange);
    this.setState({
      curtime: new Date().toLocaleString(),
    });
  };
  checkPermission1 = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position.coords.latitude);
        this.setState(
          {
            lat: position.coords.latitude,
            lang: position.coords.longitude,
          },
          () =>
            this.getAddressFromCoordinates(
              position.coords.latitude,
              position.coords.longitude,
            ),
        );
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    this.getAddressFromCoordinates();
  };
  getAddressFromCoordinates = async (latitude, longitude) => {
    this.setState({
      dis:
        (await this.distance(
          this.state.slat,
          this.state.slang,
          this.state.lat,
          this.state.lang,
          'K',
        )) * 1000,
      mdis:
        (await this.distance(
          this.state.mlat,
          this.state.mlang,
          this.state.lat,
          this.state.lang,
          'K',
        )) * 1000,
    });
    return new Promise((resolve, reject) => {
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          latitude +
          ',' +
          longitude +
          '&key=' +
          'AIzaSyBb3j8Aiv60CadZ_wJS_5wg2KBO6081a_k',
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status === 'OK') {
            //console.log(responseJson?.results);
            this.setState({add: responseJson?.results?.[0]?.formatted_address});
            resolve(responseJson?.results?.[0]?.formatted_address);
          } else {
            reject('not found');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  distance = (lat1, lon1, lat2, lon2, unit) => {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === 'K') {
        dist = dist * 1.609344;
      }
      if (unit === 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  };

  checkPermission = async () => {
    console.log('permission');
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      const result = await check(platformPermission);
      // const result = await Geolocation.requestAuthorization('whenInUse');
      console.log(result);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          // this.isLocationPermissionBlocked = true;
          Alert.alert(
            'Location Services Not Available',
            'Press OK, then check and enable the Location Services in your Privacy Settings',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);

          switch (requestResult) {
            case RESULTS.GRANTED:
              this.fetchCurrentPosition();
          }
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          this.fetchCurrentPosition();
          break;
        case RESULTS.BLOCKED:
          // this.isLocationPermissionBlocked = true;
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Location" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('Unable to open App Settings:', error);
    }
  };

  fetchCurrentPosition = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      showLocationDialog: true,
      forceRequestLocation: true,
    };

    Geolocation.getCurrentPosition(
      this.geolocationSuccessCallback,
      this.geolocationErrorCallback,
      options,
    );
  };

  geolocationSuccessCallback = async position => {
    console.log('============', position);
    try {
      // starting loader

      // preparing info
      // const API_KEY = 'AIzaSyDUl_pPU5hrzptpnWuQQWERwe2lN_0tf8g';
      this.coords = position.coords;
      const {latitude, longitude} = this.coords;

      this.setState({isProcessing: true});
      this.res = true;

      // calling api
      // const response = await makeRequest(
      //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}&region=IN&language=hi`,
      // );

      // // processing response
      // if (response) {
      //   const {status} = response;

      //   if (status === 'OK') {
      //     const {results} = response;
      //     // filtering addresses result(taking first address only)
      //     const filteredResult = results[0];
      //     const geometry = filteredResult.geometry.location;
      //     const currentAddressComponent = filteredResult.address_components;
      //     const currentLocationAddress = filteredResult.formatted_address;
      //     this.setState({
      //       geometry,
      //       currentAddressComponent,
      //       currentLocationAddress,
      //       isProcessing: false,
      //     });
      //     this.res = true;
      //     // console.log(
      //     //   geometry,
      //     //   currentAddressComponent,
      //     //   currentLocationAddress,
      //     // );
      //   } else {
      //     this.setState({
      //       geometry: null,
      //       currentAddressComponent: null,
      //       currentLocationAddress: null,
      //       isProcessing: false,
      //     });
      //     this.res = false;
      //   }
      // } else {
      //   this.setState({
      //     isProcessing: false,
      //     isLoading: false,
      //   });
      //   // console.log('Network Request Error...');
      // }
    } catch (error) {
      console.log(error.message);
    }
  };

  geolocationErrorCallback = error => {
    if (
      error.code === 2 &&
      error.message === 'No location provider available.'
    ) {
      Alert.alert(
        '',
        "Make sure your device's Location/GPS is ON",
        [{text: 'OK'}],
        {cancelable: false},
      );
    } else {
      console.log(error.code, error.message);

      Alert.alert(
        'Error',
        "Something went wrong...\nMake sure your device's Location/GPS is ON",
        [{text: 'OK'}],
        {cancelable: false},
      );
    }
  };
  componentWillUnmount = async () => {
    this.unsubscribe();
    homeScreenFetchNotificationCount = null;
    this.fetchHome();
    await this.checkAppVersion();

    await this.checkPermission1();

    // AppState.removeEventListener('change', this.handleAppStateChange);
  };

  checkAppVersion = async () => {
    try {
      let buildNumber = null;
      let IosbuildNumber = null;
      if (Platform.OS === 'ios') {
        IosbuildNumber = Number(DeviceInfo.getBuildNumber());
      } else {
        buildNumber = Number(deviceInfoModule.getBuildNumber());
      }

      let params = {
        IosbuildNumber: IosbuildNumber,
        build_no: buildNumber,
      };

      const response = await makeRequest(BASE_URL + 'versioncheck', params);
      const {success, app_url_android, message, app_url_ios} = response;

      if (success === false) {
        this.setState({isUpdateVisible: true});
        const storeUrl = Platform.OS === 'ios' ? app_url_ios : app_url_android;
        this.setState({isStoreUrl: storeUrl});
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleCloseUpdateBanner = () => {
    this.setState({isUpdateVisible: false});
  };

  fetchHome = async () => {
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
        console.log('888', params);
        const response = await makeRequest(BASE_URL + 'fetchHome', params);
        console.log('home=', response);
        if (response) {
          const {success} = response;
          if (response.isImei) {
            await clearData();
            this.props.navigation.navigate('Login');
          }
          if (success) {
            const {
              name,
              image,
              advance,
              company,
              events,
              salarySlip,
              appliedLeaves,
              punchedIn,
              punchedOut,
            } = response;
            this.setState({
              name,
              advance,
              company,
              image,
              events,
              salarySlip,
              appliedLeaves,
              punchedIn,
              punchedOut,
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
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchUserProfile = async () => {
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
        const response = await makeRequest(BASE_URL + 'userProfile', params);
        console.log('///', response);
        if (response) {
          const {success} = response;

          if (success) {
            const {output} = response;
            this.setState({
              profile: output,
              isLoading: false,
            });
          } else {
            const {message} = response;
            // stopping loader
            this.setState({
              showProcessingLoader: false,
            });

            Alert.alert('', message, [{text: 'OK'}], {
              cancelable: false,
            });
          }
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
              isRefreshing: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handlePunchIn = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      await this.checkPermission();

      if (this.res !== true) {
        Alert.alert(
          'Location Permission',
          'Press OK and provide "Location" permission' +
            '\n' +
            'Then request again.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: this.checkPermission,
            },
          ],
          {cancelable: false},
        );
        return;
      }
      console.log('****************');
      const {latitude, longitude} = this.coords;

      this.setState({showProcessingLoader: true});

      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;

        // preparing params
        const params = {
          ezypayrollId,
          userId,
          lat: latitude,
          long: longitude,
          // address: this.state.add,
        };

        // calling api
        const response = await makeRequest(BASE_URL + 'punchIn', params);
        // processing response
        if (response) {
          const {success} = response;

          if (success) {
            const {message} = response;
            Alert.alert('Alert!', message);
            await this.fetchHome();
            this.setState({
              showProcessingLoader: false,
            });
          } else {
            const {message} = response;
            await this.fetchHome();
            Alert.alert('Alert!', message);
            this.setState({
              showProcessingLoader: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handlePunchOut = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      await this.checkPermission();

      if (this.res !== true) {
        Alert.alert(
          'Location Permission',
          'Press OK and provide "Location" permission' +
            '\n' +
            'Then request again.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: this.checkPermission,
            },
          ],
          {cancelable: false},
        );
        return;
      }

      this.setState({showProcessingLoader: true});
      console.log('**********************');

      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;

        const {latitude, longitude} = this.coords;

        // preparing params
        const params = {
          ezypayrollId,
          userId,
          lat: latitude,
          long: longitude,
          // address: this.state.add,
        };
        this.setState({loca: params, showProcessingLoader: false});
        // calling api
        const response = await makeRequest(BASE_URL + 'punchOut', params);

        // processing response
        if (response) {
          const {success} = response;

          if (success) {
            const {message} = response;
            Alert.alert('Alert!', message);
            await this.fetchHome();
            this.setState({
              showProcessingLoader: false,
            });
          } else {
            const {message} = response;
            Alert.alert('Alert!', message);
            await this.fetchHome();
            this.setState({
              showProcessingLoader: false,
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
        // await this.checkAppVersion();
        // await this.DeveloperMode();
      }

      this.setState({appState: nextAppState});
    } catch (error) {
      console.log(error.message);
    }
  };

  handleLeaves = () => {
    this.props.navigation.navigate('Leave');
  };

  handlePayslips = () => {
    this.props.navigation.navigate('Pay Slip');
  };

  renderItem = ({item}) => <LssListComponent item={item} />;

  tileItem = ({item}) => (
    <HomeTileComponent item={item} nav={this.props.navigation} />
  );
  leaveUpdate = async (id, item) => {
    console.log('get data', id);

    console.log('leave update id= ', id);
    console.log('leave update item=', item);
    if (item === 'delete') {
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
            leaveId: id,
          };

          const response = await makeRequest(
            BASE_URL + 'leaveApplicationDelete',
            params,
          );

          if (response) {
            const {success} = response;

            console.log('lev=', response);

            if (success) {
              const {message} = response;

              this.setState(
                {
                  status: message,
                  isLoading: true,
                  isRefreshing: true,
                },
                () => this.fetchHome(),
              );
            } else {
              const {message} = response;

              this.setState({
                status: message,
                isLoading: false,
                isRefreshing: false,
              });
            }
          } else {
            this.setState({
              isLoading: false,
              isRefreshing: false,
            });
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      this.props.navigation.navigate('ApplyLeaveEdit', (item = {id}));
    }
  };
  renderApplied = ({item}) => (
    <LalListComponent item={item} LeaveUpdate={this.leaveUpdate} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => (
    <View style={{borderBottomWidth: 1, borderBottomColor: '#ccc8'}} />
  );

  renderSlots = () => {
    const {events} = this.state;

    return events.map((item, index) => {
      return (
        <View style={styles.cakeContainer} key={index}>
          <Text style={[styles.homeText, {fontWeight: '700'}]}>
            {item.name} :{' '}
          </Text>
          <Text
            style={[styles.homeTextStyle, {fontWeight: '700', color: '#fff'}]}>
            {item.date}
          </Text>
        </View>
      );
    });
  };

  confirmPunchIn = async () => {
    Alert.alert(
      'Punch In',
      'Are you sure, you want to Punch In?',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Punch In', onPress: this.handlePunchIn},
      ],
      {
        cancelable: false,
      },
    );
  };

  confirmPunchOut = async () => {
    Alert.alert(
      'Punch Out',
      'Are you sure, you want to Punch Out?',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Punch Out', onPress: this.handlePunchOut},
      ],
      {
        cancelable: false,
      },
    );
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
  addpresent = async () => {
    console.log('punch');
    await this.checkPermission();
    await this.checkPermission1();
    //this.props.navigation.navigate('addpre');
    const {curtime, add, lat, lang, dis, mdis, punchconfig} = this.state;

    /* console.log(curtime);
    console.log(add);
    console.log(lat);
    console.log(lang);
    console.log(dis); */
    if (!punchconfig) {
      if (dis <= 20 || mdis <= 20) {
        this.setState({
          punchcolor: 'green',
          punch: 'Out',
          punchconfig: !punchconfig,
        });

        Alert.alert(`U  login${mdis}`);
      } else {
        Alert.alert(`U not login${dis}`);
      }
    } else {
      this.setState({punchcolor: 'red', punchconfig: !punchconfig});

      Alert.alert('U log-Out');
    }
  };
  handlepunch = async () => {
    console.log('punch in or out');
    const {latitude, longitude} = this.coords;

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
          lat: latitude,
          long: longitude,
          // address: this.state.add,
        };

        const response = await makeRequest(
          BASE_URL + 'leaveApplicationDelete1',
          params,
        );

        if (response) {
          const {success} = response;

          console.log('lev=', response);

          if (success) {
            const {message} = response;

            this.setState(
              {
                status: message,
                isLoading: true,
                isRefreshing: true,
              },
              () => this.fetchHome(),
            );
          } else {
            const {message} = response;

            this.setState({
              status: message,
              isLoading: false,
              isRefreshing: false,
            });
          }
        } else {
          this.setState({
            isLoading: false,
            isRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  closeDeveloperModeAlert = () => {
    this.setState({isDeveloperModeVisible: false});
  };
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {
      name,
      image,
      events,
      salarySlip,
      appliedLeaves,
      notificationCount,
      status,
      punchedIn,
      showProcessingLoader,
      punchedOut,
    } = this.state;
    let userImage = ic_profile_pic;
    if (image) {
      userImage = {uri: image};
    }
    return (
      <SafeAreaView style={styles.container}>
        {/* <ScrollView style={{flex: 1}}> */}
        {this.state.connectionState && (
          <>
            <HeadersComponent
              title="Home"
              icon={ic_drawer}
              nav={this.props.navigation}
              showNotificationIcon
              notificationCount={notificationCount}
            />
            {/* <DeveloperModeAlert
              visible={this.state.isDeveloperModeVisible}
              onClose={this.closeDeveloperModeAlert}
            /> */}
            <View style={styles.homeContainer}>
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
                <View style={styles.userLetterContainer}>
                  <Image
                    source={userImage}
                    resizeMode="cover"
                    style={styles.profileIcon}
                  />
                </View>
                <View style={basicStyles.flexOne}>
                  <Text style={styles.homeTextStyle2}>{name}</Text>
                  {/* <Text style={styles.homeTextStyle}>{company}</Text> */}
                </View>

                {punchedOut === false ? (
                  <View style={styles.punchContainer}>
                    {/*  <TouchableOpacity
                      style={[
                        styles.OutContainer,
                        {backgroundColor: this.state.punchcolor},
                      ]}
                      onPress={this.addpresent}>
                      <Text style={styles.punchTextStyle}>
                        Punch {this.state.punch}
                      </Text>
                    </TouchableOpacity> */}
                    {punchedIn ? (
                      <TouchableOpacity
                        style={styles.OutContainer}
                        onPress={this.confirmPunchOut}>
                        <Text style={styles.punchTextStyle}>Punch Out</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.InContainer}
                        onPress={this.confirmPunchIn}>
                        <Text style={styles.punchTextStyle}>Punch In</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null}
              </View>
              {/*    {geometry !== null ? (
                  <View style={{flex: 1}}>
                    <Text style={{}}>Address:{currentLocationAddress}</Text>
                    <Text style={{}}>lat:{geometry.lat}</Text>
                    <Text style={{}}>lng:{geometry.lng}</Text>
                  </View>
                ) : null} */}
              {/* <View style={basicStyles.separatorHorizontal} /> */}
              <View style={{}}>
                <FlatList
                  data={this.state.tileData}
                  renderItem={this.tileItem}
                  keyExtractor={this.keyExtractor}
                  numColumns="2"
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator2}
                  contentContainerStyle={styles.listContainers}
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              </View>

              {/* <View style={styles.buttonContentContainer}>
            {advance ? (
              <TouchableOpacity
                onPress={this.handlePayslips}
                underlayColor="transparent"
                style={[
                  styles.blockContainer,
                  {marginRight: wp(1), backgroundColor: '#e14d4d'},
                ]}>
                <View>
                  <Text style={[styles.textCenter]}>Advance</Text>
                  <Text style={[styles.textCenterBold]}>₹ {advance}</Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {security ? (
              <TouchableOpacity
                onPress={this.handlePayslips}
                underlayColor="transparent"
                style={[
                  styles.blockContainer,
                  {marginLeft: wp(1), backgroundColor: '#0077a2'},
                ]}>
                <View>
                  <Text style={[styles.textCenter]}>Security Amount</Text>
                  <Text style={[styles.textCenterBold]}>₹ {security}</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View> */}

              <View style={styles.lss}>
                {salarySlip ? (
                  <View>
                    <Text style={styles.lssHeading}>
                      Last 3 Months Salary Slip
                    </Text>
                    <FlatList
                      data={salarySlip}
                      renderItem={this.renderItem}
                      keyExtractor={this.keyExtractor}
                      ItemSeparatorComponent={this.itemSeparator}
                      contentContainerStyle={styles.listContentContainer}
                      showsVerticalScrollIndicator={false}
                      // refreshing={this.state.isRefreshing}
                      // onRefresh={this.handleListRefresh}
                    />
                  </View>
                ) : (
                  <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>{status}</Text>
                  </View>
                )}
              </View>

              {appliedLeaves ? (
                <View style={{flex: 1}}>
                  <Text style={styles.lssHeading}>Last 5 Applied Leaves</Text>
                  <FlatList
                    data={appliedLeaves}
                    renderItem={this.renderApplied}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    contentContainerStyle={styles.listContentContainer}
                    showsVerticalScrollIndicator={false}
                    // refreshing={this.state.isRefreshing}
                    // onRefresh={this.handleListRefresh}
                  />
                </View>
              ) : (
                <View style={styles.messageContainer}>
                  {/* <Text style={styles.messageText}>{status}</Text> */}
                </View>
              )}
            </View>
          </>
        )}
        <UpdateBanner
          isVisible={this.state.isUpdateVisible}
          onClose={this.handleCloseUpdateBanner}
          storeUrl={this.state.isStoreUrl}
        />
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
        {showProcessingLoader && <ProcessingLoader />}
        {/* </ScrollView> */}
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
  userLetterContainer: {
    // backgroundColor: '#fff',
    height: wp(14),
    width: wp(14),
    borderRadius: wp(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
    overflow: 'hidden',
  },
  profileIcon: {
    height: wp(14),
    width: wp(14),
    aspectRatio: 1 / 1,
    // marginLeft: wp(2),
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

  listContentContainer: {
    marginBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc8',
  },

  homeContainer: {
    flex: 1,
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

  quickTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    fontWeight: '900',
  },
  buttonContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  blockContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingVertical: wp(2),
  },
  blockContainerBox: {
    width: '94%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: wp(1),
    paddingVertical: hp(2),
  },
  linksContainer: {
    backgroundColor: '#0077a2',
    height: hp(10),
    aspectRatio: 1 / 1,
    borderRadius: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icStyle: {
    height: hp(4),
    aspectRatio: 1 / 1,
  },

  blockTextStyle: {
    marginTop: wp(2),
    fontSize: wp(3.5),
    color: darkGreyPrimary,
    fontWeight: 'bold',
  },
  textCenter: {
    textAlign: 'center',
    color: '#fff',
  },
  textCenterBold: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#fff',
  },
  lss: {
    marginTop: wp(2),
  },
  lssHeading: {
    fontSize: wp(4),
    fontWeight: '700',
    marginBottom: wp(2),
    color: '#0077a2',
    paddingHorizontal: wp(3),
  },
  cakeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: wp(1),
    marginHorizontal: wp(4),
  },
  cakeIcon: {
    marginRight: wp(1.5),
    width: wp(4),
    aspectRatio: 1 / 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#000',
    fontSize: wp(3),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  // punchContainer: {
  //   position: 'absolute',
  //   alignSelf: 'flex-end',
  //   right: wp(4),
  // },
  InContainer: {
    height: wp(14),
    width: wp(14),
    borderRadius: wp(7),
    backgroundColor: '#0077a2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  OutContainer: {
    height: wp(14),
    width: wp(14),
    borderRadius: wp(7),
    backgroundColor: '#e14d4d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  punchTextStyle: {
    color: '#fff',
    fontSize: wp(2.8),
    fontWeight: '700',
    margin: wp(0.8),
    textAlign: 'center',
  },
  listContainers: {
    borderTopWidth: 0.5,
    borderTopColor: '#ccc8',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc8',
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
});
