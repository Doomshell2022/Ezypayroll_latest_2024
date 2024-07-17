import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  Image,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../../assets/colors/colors';

//  Components
import HeadersComponent from '../../components/HeadersComponent';
import AdminAttendanceComponent from '../../components/AdminAttendanceComponent';
import CustomLoader from '../../components/CustomLoader';

// Image
import ic_add from '../../assets/icons/ic_add.png';
import background from '../../assets/images/background.png';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../api/UserPreference';
import Footer from '../../components/Footer';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../../assets/icons/internetConnectionState.gif';

export default class AbsentReportScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      status: null,
      isLoading: true,
      isRefreshing: false,
      connectionState: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchAttendanceHistory();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchAttendanceHistory = async () => {
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

        const response = await makeRequest(BASE_URL + 'getAttendance', params);

        if (response) {
          const {success} = response;

          if (success) {
            const {data} = response;
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

  renderItem = ({item}) => <AdminAttendanceComponent item={item} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

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
    const {isLoading, data: output, status, isRefreshing} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <ImageBackground
              source={background}
              resizeMode="cover"
              style={styles.container}>
              <HeadersComponent
                title="Attendance"
                // navAction="HomeBack"
                nav={this.props.navigation}
                // showNotification
                // notificationCount={notificationCount}
              />

              <View style={styles.historyContainer}>
                {output ? (
                  <FlatList
                    data={output}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    contentContainerStyle={styles.listContentContainer}
                    showsVerticalScrollIndicator={false}
                    refreshing={isRefreshing}
                    onRefresh={this.handleListRefresh}
                  />
                ) : (
                  <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>{status}</Text>
                  </View>
                )}
              </View>
              {/* <Footer tab="Attendance" nav={this.props.navigation} /> */}
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

const {lightBluePrimary, whitePrimary} = colors;

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
  historyContainer: {
    flex: 1,
    padding: wp(2),
  },
  homeTextContainer: {
    marginBottom: wp(3),
  },
  homeTextStyle: {
    paddingBottom: wp(3),
    color: '#333',
    fontSize: wp(4),
    fontWeight: '400',
  },
  separator: {
    height: wp(1.8),
  },
  listContentContainer: {
    // paddingBottom: hp(0.5),
    // paddingHorizontal: wp(1),
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#000',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingRight: wp(3),
  },

  buttonStyle: {
    height: hp(4),
    aspectRatio: 1 / 1,
    backgroundColor: whitePrimary,
    borderRadius: wp(2),
  },
});
