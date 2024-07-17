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
import SafeAreaView from 'react-native-safe-area-view';
// Colors
import {colors} from '../assets/colors/colors';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import HolidayListComponent from '../components/HolidayListComponent';
import CustomLoader from '../components/CustomLoader';

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
import {lowerFirst} from 'lodash';
import {event} from 'react-native-reanimated';
export default class AbsentReportScreen extends Component {
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
    this.fetchHolidays();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchHolidays = async () => {
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

        const response = await makeRequest(BASE_URL + 'holidayLists', params);
        if (response) {
          const {success} = response;

          if (success) {
            const {output: output} = response;
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

  renderItem = ({item}) => <HolidayListComponent item={item} />;

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
      <SafeAreaView style={{flex: 1, backgroundColor: '#f2f1f1'}}>
        {this.state.connectionState && (
          <>
            {/* <ImageBackground
              source={background}
              resizeMode="cover"
              style={styles.container}> */}
            <HeadersComponent
              title="Holidays List"
              nav={this.props.navigation}
            />
            <View style={styles.contentContainer}>
              {output ? (
                Object.keys(output).map((month, index) => (
                  <View key={index}>
                    <View>
                      <Text
                        style={{
                          fontWeight: '800',
                          marginLeft: wp(1),
                          marginBottom: wp(1),
                          color: '#0077a2',
                        }}>
                        {month}
                      </Text>
                    </View>
                    {output[month].map((event, index) => {
                      // Split dateFrom into parts
                      const dateFromParts = event.dateFrom.split('&');
                      const dateFromYear = dateFromParts[0];
                      const dateFromMonth = dateFromParts[1];
                      const dateFromDay = dateFromParts[2];

                      // Split dateTo into parts if it exists
                      let dateToYear = null;
                      let dateToMonth = null;
                      let dateToDay = null;
                      if (event.dateTo) {
                        const dateToParts = event.dateTo.split('&');
                        dateToYear = dateToParts[0];
                        dateToMonth = dateToParts[1];
                        dateToDay = dateToParts[2];
                      }

                      return (
                        <>
                          <View
                            key={index}
                            style={{
                              backgroundColor: '#fff',
                              padding: wp(3),
                              marginBottom: wp(2),
                              borderRadius: wp(1),
                            }}>
                            {/* <Text
                            style={{fontWeight: '700', paddingBottom: wp(1)}}>
                            {event.name}
                          </Text> */}

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View style={{marginRight: wp(5)}}>
                                <View>
                                  <Text
                                    style={{
                                      color: '#0077a2',
                                      marginLeft: wp(2),
                                    }}>{`${dateFromYear}`}</Text>

                                  <Text
                                    style={{
                                      color: '#0077a2',
                                      fontSize: wp(2),
                                      flexDirection: 'row',
                                    }}>{`${dateFromMonth}`}</Text>
                                </View>

                                {event.dateTo ? (
                                  <View>
                                    <Text
                                      style={{
                                        color: '#0077a2',
                                        marginLeft: wp(2),
                                      }}>{`${dateToYear}`}</Text>
                                    <Text
                                      style={{
                                        color: '#0077a2',
                                        fontSize: wp(2),
                                      }}>{`${dateToMonth}`}</Text>
                                  </View>
                                ) : (
                                  <></>
                                )}
                              </View>
                              <View>
                                <Text
                                  style={{
                                    fontWeight: '700',
                                    paddingBottom: wp(1),
                                  }}>
                                  {event.name}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </>
                      );
                    })}
                  </View>
                ))
              ) : (
                <View style={styles.noDataStyle}>
                  <Text>No Holiday to display</Text>
                </View>
              )}
            </View>

            {/* </ImageBackground> */}
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

const {lightBluePrimary} = colors;

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
    padding: wp(1.5),
  },
  homeTextContainer: {
    paddingBottom: wp(3),
  },
  homeTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    fontWeight: '700',
  },
  listContentContainer: {
    // paddingBottom: hp(2),
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
    height: wp(1),
  },
  noDataStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    // backgroundColor: '#fff',
    // borderBottomWidth: 0.5,
  },
});
