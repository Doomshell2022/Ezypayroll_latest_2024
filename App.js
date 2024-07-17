import React, {Component} from 'react';
import {AppState, StyleSheet, NativeModules} from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import {createRootNavigator} from './src/routes/Routes';
import {
  createOnTokenRefreshListener,
  removeOnTokenRefreshListener,
  createNotificationListeners,
  removeNotificationListeners,
} from './src/firebase_api/FirebaseAPI';
import NetInfo from '@react-native-community/netinfo';
import NoInternetScreen from './src/components/NoInternetscreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootSiblingParent} from 'react-native-root-siblings';
import {createAppContainer} from 'react-navigation';

import {nsSetTopLevelNavigator} from './src/routes/NavigationService';
import {KEYS, getData} from './src/api/UserPreference';
import DeveloperModeAlert from './src/components/CustomAlertModal';

const {DeveloperMode} = NativeModules;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoggedIn: false,
      userInfo: null,
      // appState: AppState.currentState,
      isConnected: true,
      isDeveloperModeVisible: false,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    // this.DeveloperMode();
    try {
      setTimeout(this.initialSetup, 2000);
      createOnTokenRefreshListener(this);
      createNotificationListeners(this);
      // AppState.addEventListener('change', this.handleAppStateChange);
      this.unsubscribeNetInfo = NetInfo.addEventListener(state => {
        this.setState({isConnected: state.isConnected});
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  // DeveloperMode = () => {
  //   DeveloperMode.isDeveloperModeEnabled()
  //     .then(isEnabled => {
  //       if (isEnabled) {
  //         this.setState({isDeveloperModeVisible: true});
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error checking developer mode:', error);
  //     });
  // };
  componentWillUnmount() {
    removeOnTokenRefreshListener(this);
    removeNotificationListeners(this);

    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
    }
  }

  // handleAppStateChange = async nextAppState => {
  //   try {
  //     const {appState} = this.state;

  //     if (appState.match(/inactive|background/) && nextAppState === 'active') {
  //       await this.DeveloperMode(); // Handle logic when app goes from background/inactive to active
  //     }

  //     this.setState({appState: nextAppState});
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  // handleListRefresh = async () => {
  //   try {
  //     this.setState({isRefreshing: true}, () => {
  //       this.componentDidMount();
  //       this.DeveloperMode();
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  initialSetup = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const isLoggedIn = !!userInfo;

      this.setState({isLoggedIn, isLoading: false, userInfo});
    } catch (error) {
      console.log(error.message);
    }
  };

  setNavigatorRef = ref => {
    nsSetTopLevelNavigator(ref);
  };

  closeDeveloperModeAlert = () => {
    this.setState({isDeveloperModeVisible: false});
  };

  render() {
    const {isLoading, isConnected, isDeveloperModeVisible} = this.state;

    if (isLoading) {
      return <SplashScreen />;
    }

    if (!isConnected) {
      return <NoInternetScreen />;
    }

    const RootNavigator = createRootNavigator(this.state.userInfo);
    const AppContainer = createAppContainer(RootNavigator);

    return (
      <RootSiblingParent>
        <SafeAreaProvider style={styles.safeArea}>
          <AppContainer ref={this.setNavigatorRef} />
          {/* <DeveloperModeAlert
            visible={isDeveloperModeVisible}
            onClose={this.closeDeveloperModeAlert}
          /> */}
        </SafeAreaProvider>
      </RootSiblingParent>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
// import 'react-native-gesture-handler';
// import React, {Component} from 'react';

// import {createAppContainer} from 'react-navigation';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import {RootSiblingParent} from 'react-native-root-siblings';
// import {ModalPortal} from 'react-native-modals';
// // network alert
// import InternetConnectionAlert from 'react-native-internet-connection-alert';
// // Screens
// import SplashScreen from './src/screens/SplashScreen';

// // Root Navigator
// import {createRootNavigator} from './src/routes/Routes';

// // User Preference
// import {KEYS, getData} from './src/api/UserPreference';

// // Firebase API
// import {
//   createOnTokenRefreshListener,
//   removeOnTokenRefreshListener,
//   createNotificationListeners,
//   removeNotificationListeners,
// } from './src/firebase_api/FirebaseAPI';

// // Routes
// import {nsSetTopLevelNavigator} from './src/routes/NavigationService';
// import NoInternetScreen from './src/components/NoInternetscreen';
// import {NativeModules} from 'react-native';
// import DeveloperModeAlert from './src/components/CustomAlertModal';
// // import {Alert, Linking, Platform} from 'react-native';
// // import {BASE_URL, makeRequest} from './src/api/ApiInfo';
// // import deviceInfoModule from 'react-native-device-info';
// const {DeveloperMode} = NativeModules;

// export default class App extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       isLoading: true,
//       isLoggedIn: false,
//       userInfo: null,
//       isConnected: true,
//     };
//   }

//   componentDidMount() {
//     // this.update();
//     try {
//       setTimeout(this.initialSetup, 2000);

//       // Adding firebase listeners
//       createOnTokenRefreshListener(this);
//       createNotificationListeners(this);
//     } catch (error) {
//       console.log(error.message);
//     }
//   }

//   componentWillUnmount() {
//     // Removing firebase listeners
//     removeOnTokenRefreshListener(this);
//     removeNotificationListeners(this);
//   }
//   closeDeveloperModeAlert = () => {
//     this.setState({isDeveloperModeVisible: false});
//   };
//   initialSetup = async () => {
//     try {
//       // Fetching userInfo
//       const userInfo = await getData(KEYS.USER_INFO);
//       const isLoggedIn = userInfo ? true : false;

//       this.setState({isLoggedIn, isLoading: false, userInfo});
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   setNavigatorRef = ref => {
//     nsSetTopLevelNavigator(ref);
//   };
//   DeveloperMode = () => {
//     DeveloperMode.isDeveloperModeEnabled()
//       .then(isEnabled => {
//         if (isEnabled) {
//           this.setState({isDeveloperModeVisible: true});
//         }
//       })
//       .catch(error => {
//         console.error('Error checking developer mode:', error);
//       });
//   };
//   render() {
//     const {isLoading, isDeveloperModeVisible, isConnected} = this.state;
//     if (isLoading) {
//       return <SplashScreen />;
//     }
//     if (!isConnected) {
//       return <NoInternetScreen />;
//     }
//     const {userInfo} = this.state;
//     const RootNavigator = createRootNavigator(userInfo);
//     const AppContainer = createAppContainer(RootNavigator);

//     return (
//       // <InternetConnectionAlert
//       //   onChange={connectionState => {
//       //     console.log('Connection State: ', connectionState);
//       //   }}>
//       <RootSiblingParent>
//         <SafeAreaProvider style={{backgroundColor: '#fff'}}>
//           <AppContainer ref={this.setNavigatorRef} />
//           <ModalPortal />
//           <DeveloperModeAlert
//             visible={isDeveloperModeVisible}
//             onClose={this.closeDeveloperModeAlert}
//           />
//         </SafeAreaProvider>
//       </RootSiblingParent>
//       // </InternetConnectionAlert>
//     );
//   }
// }
