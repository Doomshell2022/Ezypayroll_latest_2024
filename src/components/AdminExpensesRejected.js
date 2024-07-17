import React, {Component} from 'react';
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import background from '../assets/images/background.png';
import ExpensesAdminComponent from './ExpensesAdminComponent';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from '../styles/BasicStyles';
// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif

import offline from '../assets/icons/internetConnectionState.gif';
// User Preference

import {KEYS, getData} from '../api/UserPreference';

import CustomLoader from './CustomLoader';
import ProcessingLoader from './ProcessingLoader';
export default class AdminExpensesRejected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: null,
      status: 'No Expenses Available...',
      isRefreshing: true,
      isLoading: true,
      showExpensesPopup: false,
      showImagePopup: false,
      connectionState: true,
    };
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchAllExpenses();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchAllExpenses = async () => {
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

        const response = await makeRequest(BASE_URL + 'getExpense', params);

        if (response) {
          const {success} = response;

          if (success) {
            const {expenses} = response;
            this.setState({
              expenses,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;
            // stopping loader
            this.setState({
              expenses: null,
              isLoading: false,
              status: message,
              isRefreshing: false,
            });

            // Alert.alert('', message, [{text: 'OK'}], {
            //   cancelable: false,
            // });
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
    return <ExpensesAdminComponent item={item} />;
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
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      isRefreshing,
      showExpensesPopup,
      showImagePopup,
      showProcessingLoader,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <ImageBackground
              source={background}
              resizeMode="cover"
              style={styles.container}>
              <View style={[basicStyles.mainContainer]}>
                {this.state.expenses ? (
                  <View style={basicStyles.flexOne}>
                    <FlatList
                      data={this.state.expenses}
                      renderItem={this.listItem}
                      keyExtractor={this.keyExtractor}
                      ItemSeparatorComponent={this.itemSeparator}
                      contentContainerStyle={styles.listContentContainer}
                      showsVerticalScrollIndicator={false}
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
              </View>

              {showProcessingLoader && <ProcessingLoader />}
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
export const styles = StyleSheet.create({
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
