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
import {colors} from '../assets/colors/colors';
import SafeAreaView from 'react-native-safe-area-view';
//  Components
import HeadersComponent from '../components/HeadersComponent';
import AppliedLeaveComponent from '../components/AppliedLeaveComponent';
import CustomLoader from '../components/CustomLoader';

// Image
import ic_drawer from '../assets/icons/ic_drawer.png';
import ic_plus from '../assets/icons/ic_plus.png';
import background from '../assets/images/background.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';

import basicStyles from '../styles/BasicStyles';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class AppliedLeaveDetailScreen extends Component {
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
    this.handleApplicationHistory();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleApplicationHistory = async () => {
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

        const response = await makeRequest(
          BASE_URL + 'leaveApplicationHistory',
          params,
        );

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
  handleleaveUpdate = async (id, item) => {
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
            if (success) {
              const {message} = response;

              this.setState(
                {
                  status: message,
                  isLoading: true,
                  isRefreshing: true,
                },
                () => this.handleApplicationHistory(),
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
      this.props.navigation.navigate('ApplyLeaveEdit', {id});
    }

    // this.handleApplicationHistory();
  };
  renderItem = ({item}) => (
    <AppliedLeaveComponent item={item} leavedata={this.handleleaveUpdate} />
  );

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

  handleAddButton = () => {
    this.setState({
      isLoading: false,
      isRefreshing: false,
    });
    this.props.navigation.navigate('ApplyLeave', {
      handleRefresh: this.handleApplicationHistory,
    });
  };

  render() {
    const {isLoading, isRefreshing, data: output, status} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={basicStyles.container}>
        {this.state.connectionState && (
          <>
            <ImageBackground
              source={background}
              resizeMode="cover"
              style={styles.container}>
              <HeadersComponent
                title="Leaves"
                icon={ic_drawer}
                nav={this.props.navigation}
              />
              <View style={styles.contentContainer}>
                <View style={styles.headingContainer}>
                  <View style={styles.homeTextContainer}>
                    <Text style={styles.homeTextStyle}>Applied Leaves</Text>
                  </View>
                  <View style={styles.addButton}>
                    <TouchableOpacity
                      // onPressIn={this.handleAddButton}
                      onPressOut={this.handleAddButton}
                      // onLongPress={this.handleAddButton}
                      style={styles.applyButton}>
                      <Text style={styles.applyText}>Apply</Text>
                      <Image
                        source={ic_plus}
                        resizeMode="cover"
                        style={styles.buttonStyle}
                      />
                    </TouchableOpacity>
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
                    refreshing={isRefreshing}
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
    elevation: 2,
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
