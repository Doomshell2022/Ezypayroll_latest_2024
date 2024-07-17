import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import LeaveTypeComponent from '../components/LeaveTypeComponent';
import CustomLoader from '../components/CustomLoader';

// Image
import background from '../assets/images/background.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class LeaveTypeScreen extends Component {
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
    this.handleLeaveHistory();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleLeaveHistory = async () => {
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

        console.log('userdaat==', userInfo);
        const response = await makeRequest(BASE_URL + 'leaveTypes', params);

        if (response) {
          const {success} = response;

          console.log('res levtype===', response);

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
              isRefreshing: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <LeaveTypeComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleApplyLeave = () => {
    this.props.navigation.navigate('ApplyLeave');
  };

  render() {
    const {isLoading, data: output, status} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    console.log('Data=====', output);

    return (
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              nav={this.props.navigation}
              title="Apply Leaves"
              navAction="back"
            />
            <View style={styles.contentContainer}>
              {output ? (
                <FlatList
                  data={output}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  ItemSeparatorComponent={this.itemSeparator}
                  onPress={this.handleApplyLeave}
                  contentContainerStyle={styles.listContentContainer}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>{status}</Text>
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

const {lightBluePrimary, whitePrimary, darkGreyPrimary, lightGreyPrimary} =
  colors;

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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: wp(3),
    marginBottom: wp(3),
  },
  homeTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    fontWeight: '400',
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
  separator: {
    height: wp(2),
  },
});
