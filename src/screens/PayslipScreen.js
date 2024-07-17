import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';
import SafeAreaView from 'react-native-safe-area-view';
//  Components
import HeadersComponent from '../components/HeadersComponent';
import PaySlipComponent from '../components/PaySlipComponent';
import CustomLoader from '../components/CustomLoader';

// Image
import background from '../assets/images/background.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
// User Preference
import {KEYS, getData} from '../api/UserPreference';

export default class PayslipScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: null,
      status: null,
      isRefreshing: false,
      connectionState: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.handlePayslip();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handlePayslip = async () => {
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

        const response = await makeRequest(BASE_URL + 'paySlipList', params);

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
              data: null,
              isLoading: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => <PaySlipComponent item={item} />;

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
    const {isLoading, data: output, status} = this.state;

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
                title="My Pay Slips"
                // icon={ic_drawer}
                nav={this.props.navigation}
                // showNotification
                // notificationCount={notificationCount}
              />

              <View style={styles.contentContainer}>
                {/* <View style={styles.homeTextContainer}>
            <Text style={styles.homeTextStyle}>My PaySlips</Text>
          </View> */}

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
              </View>
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
  },
  contentContainer: {
    flex: 1,
    padding: wp(3),
  },
  homeTextContainer: {
    paddingBottom: wp(3),
  },
  homeTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    fontWeight: '700',
  },
  separator: {
    height: wp(2),
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
    marginTop: hp(19.4),
    paddingRight: wp(10),
  },

  buttonStyle: {
    height: wp(11),
    aspectRatio: 1 / 1,
    backgroundColor: whitePrimary,
    borderRadius: wp(10),
  },
});
