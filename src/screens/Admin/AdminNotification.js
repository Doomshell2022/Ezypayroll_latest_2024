import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

import firebase from 'react-native-firebase';

// Components
import HeadersComponent from '../../components/HeadersComponent';
import NotificationListComponent from '../../components/NotificationListComponent';
import CustomLoader from '../../components/CustomLoader';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../../assets/icons/internetConnectionState.gif';
export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notifications: null,
      status: null,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchNotifications();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchNotifications = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // fetching userInfo from local storage
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
          BASE_URL + 'notificationList',
          params,
        );

        // processing response
        if (response) {
          const {success} = response;

          if (success) {
            const {output: notifications} = response;
            this.setState({notifications, status: null});

            // resetting notification count
            await this.resetNotificationCount(params);
          } else {
            const {message} = response;

            this.setState({
              status: message,
              notifications: null,
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

  resetNotificationCount = async params => {
    try {
      // calling api
      const response = await makeRequest(
        BASE_URL + 'resetNotificationCount',
        params,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          firebase.notifications().removeAllDeliveredNotifications();
          this.setState({isLoading: false, isRefreshing: false});
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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

  renderItem = ({item}) => <NotificationListComponent item={item} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {notifications, status, isRefreshing} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <View style={styles.headerContainer}>
              <HeadersComponent
                title="Notification"
                navAction="back"
                nav={this.props.navigation}
                // showNotification
                // notificationCount={notificationCount}
              />
            </View>

            {notifications ? (
              <FlatList
                data={notifications}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={this.itemSeparator}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
                refreshing={isRefreshing}
                onRefresh={this.handleListRefresh}
              />
            ) : (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{status}</Text>
              </View>
            )}
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
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#ececec',
  },
  headerContainer: {
    backgroundColor: '#096481',
  },
  listContentContainer: {
    padding: wp(2),
  },
  separator: {
    height: wp(2),
  },
  messageContainer: {
    flex: 1,
    padding: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#000',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
});
