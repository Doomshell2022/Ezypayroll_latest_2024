import React, {Component} from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  FlatList,
  Text,
  Image,
  SafeAreaView,
  // ScrollView,
  // RefreshControl,
  // ScrollViewBase,
} from 'react-native';
import HeaderComponent from '../../components/HeadersComponent';
import background from '../../assets/images/background.png';
import basicStyles from '../../styles/BasicStyles';
import ItDeclarationComp from '../../components/ItDeclarationComp';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';

import NetInfo from '@react-native-community/netinfo';
//gif
// import offline from '../assets/icons/internetConnectionState.gif';
//  Components
// import HeadersComponent from '../components/HeadersComponent';
// import ITListComponent from '../components/ITListComponent';
// import ITListComponent from './ITDeclarationsDetailScreen';
// import CustomLoader from '../components/CustomLoader';
import CustomLoader from '../../components/CustomLoader';
// import ProcessingLoader from '../components/ProcessingLoader';\
import ProcessingLoader from '../../components/ProcessingLoader';
// import {showToast} from '../components/ToastComponent';

// API
// import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
// import {KEYS, getData} from '../api/UserPreference';
import {KEYS, getData} from '../../api/UserPreference';
export default class ItDeclarationRequest extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      // date: null,
      // status: null,
      isLoading: true,
      isRefreshing: true,
      // isListRefreshing: false,
      connectionState: true,
    };
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchDeclarationData();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchDeclarationData = async () => {
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
        };

        const response = await makeRequest(
          BASE_URL + 'viewDeclarations',
          params,
        );

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

  listItem = ({item}) => {
    return <ItDeclarationComp item={item} />;
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(2)}} />;
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

    // console.log('sererere', isRefreshing);
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <ImageBackground
              source={background}
              resizeMode="cover"
              style={styles.container}>
              <HeaderComponent
                title="IT Declarations "
                // navAction="HomeBack"
                nav={this.props.navigation}
                //   showNotificationIcon
                //   notificationCount={notificationCount}
              />
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
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
});
