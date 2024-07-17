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
// Styles
import basicStyles from '../styles/BasicStyles';

// Image
// import background from '../../assets/images/background.png';
import background from '../assets/images/background.png';
//  Components
import HrApprovedComponent from './HrApprovedComponent';
import CustomLoader from './CustomLoader';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class AdminHrequestApproved extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: true,
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
          status: 'approved',
        };

        const response = await makeRequest(BASE_URL + 'getHrRequests', params);
        console.log('response', response);

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
    <HrApprovedComponent
      item={item}
      nav={this.props.navigation}
      props={this.approveRejectHrRequest}
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

    const {data, isRefreshing} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <ImageBackground
              source={background}
              resizeMode="cover"
              style={styles.container}>
              <View style={[basicStyles.mainContainer]}>
                {data ? (
                  <View style={basicStyles.flexOne}>
                    <FlatList
                      data={data}
                      renderItem={this.listItem}
                      keyExtractor={this.keyExtractor}
                      showsVerticalScrollIndicator={false}
                      ItemSeparatorComponent={this.itemSeparator}
                      contentContainerStyle={basicStyles.paddingHalf}
                      refreshing={isRefreshing}
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
              </View>
              {/* <Footer tab="HR" nav={this.props.navigation} />s */}
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
  container: {
    flex: 1,
    // backgroundColor: '#f2f1f1',
  },
  editButton: {
    backgroundColor: '#0077a2',
    margin: wp(2),
    padding: wp(3),
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#0077a2',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    margin: wp(2),
  },
});
