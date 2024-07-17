import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// Styles
import basicStyles from '../styles/BasicStyles';

// Image
import background from '../assets/images/background.png';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import HRListComponent from '../components/HRListComponent';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/ToastComponent';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
// User Preference
import {KEYS, getData} from '../api/UserPreference';

export default class MyITDeclarationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      data: null,
      connectionState: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchHrRequestData();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchHrRequestData = async loadNow => {
    try {
      if (loadNow) {
        this.setState({isLoading: true});
      }
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

        const response = await makeRequest(BASE_URL + 'viewHrRequest', params);

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

  listItem = ({item}) => (
    <HRListComponent
      item={item}
      nav={this.props.navigation}
      fetchHrRequestData={this.fetchHrRequestData}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(2)}} />;

  handleDetail = () => {
    this.props.navigation.navigate('AddHrRequest', {
      handleRefresh: this.fetchHrRequestData,
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

    const {data} = this.state;
    return (
      <SafeAreaView style={basicStyles.container}>
        {this.state.connectionState && (
          <>
            <ImageBackground
              source={background}
              resizeMode="cover"
              style={basicStyles.container}>
              <HeadersComponent
                title="Hr Request"
                nav={this.props.navigation}
              />
              <View style={[basicStyles.mainContainer]}>
                {/* <Text style={[basicStyles.heading, basicStyles.paddingHalf]}>
            HR Request
          </Text> */}
                {data ? (
                  <View style={basicStyles.flexOne}>
                    <FlatList
                      data={data}
                      renderItem={this.listItem}
                      keyExtractor={this.keyExtractor}
                      showsVerticalScrollIndicator={false}
                      ItemSeparatorComponent={this.itemSeparator}
                      contentContainerStyle={basicStyles.paddingHalf}
                      refreshing={this.state.isRefreshing}
                      onRefresh={this.handleListRefresh}
                    />
                  </View>
                ) : (
                  <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
                    <Text style={basicStyles.noDataTextStyle}>
                      No Data Available.
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={this.handleDetail}>
                  <Image
                    source={require('../assets/icons/addplus.png')}
                    style={{
                      width: wp(4.5),
                      height: wp(4.5),
                      marginRight: wp(3),
                    }}
                  />
                  <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                    Create HR Request
                  </Text>
                </TouchableOpacity>
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
  editButton: {
    backgroundColor: '#0077a2',
    margin: wp(2),
    padding: wp(3),
    alignItems: 'center',
  },
  updateButton: {
    flexDirection: 'row',
    backgroundColor: '#666',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    margin: wp(2),
  },
});
