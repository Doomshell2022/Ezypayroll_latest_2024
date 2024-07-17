import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
// import {colors} from '../../assets/colors/colors';
import {colors} from '../assets/colors/colors';

//  Components
import CustomLoader from './CustomLoader';

import background from '../assets/images/background.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
import AdminLeavesRejectedComponent from './AdminLeaveRejected';
export default class AppliedLeaveDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      leavesData: null,
      status: null,
      isRefreshing: false,
      connectionState: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchLeavesRequest();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchLeavesRequest = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;
        this.setState({isLoading: true});
        // preparing params
        const params = {
          ezypayrollId,
          userId,
          status: 'rejected',
        };

        const response = await makeRequest(
          BASE_URL + 'viewLeavesRequest',
          params,
        );

        if (response) {
          const {success} = response;

          if (success) {
            const {leavesData} = response;
            this.setState({
              leavesData,
              status: null,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;

            this.setState({
              status: message,
              leavesData: null,
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

  renderItem = ({item}) => <AdminLeavesRejectedComponent item={item} />;

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
    const {isLoading, isRefreshing, leavesData, status} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.container}>
        {this.state.connectionState && (
          <>
            <View style={styles.contentContainer}>
              {leavesData ? (
                <FlatList
                  data={leavesData}
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
                  <Text style={styles.messageText}>No Leave Request...</Text>
                </View>
              )}
            </View>
          </>
        )}
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
      </ImageBackground>
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
  },
  contentContainer: {
    flex: 1,
    padding: wp(3),
  },

  homeTextStyle: {
    color: '#000',
    fontSize: wp(3.5),
    fontWeight: '400',
    marginLeft: wp(1),
  },
  separator: {
    height: wp(2),
  },
  listContentContainer: {
    paddingBottom: hp(2),
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
  // addButton: {
  //   paddingRight: wp(3),
  // },

  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 5,
    padding: wp(2),
    marginBottom: wp(2),
  },

  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077a2',
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    borderRadius: 5,
  },

  applyText: {
    fontSize: wp(3.2),
    color: '#fff',
    fontWeight: '700',
    marginRight: wp(1),
  },

  buttonStyle: {
    width: wp(3),
    aspectRatio: 1 / 1,
    borderRadius: wp(2),
  },
});
