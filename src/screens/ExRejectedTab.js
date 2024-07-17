import React, {Component} from 'react';
import {View, StyleSheet, Text, FlatList, Alert} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import AllRejectedComponent from '../components/AllRejectedComponent';
import CustomLoader from '../components/CustomLoader';
// import {showToast} from '../components/ToastComponent';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';

export default class ExRejectedTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: null,
      status: 'No Data Available...',
      isLoading: true,
      isRefreshing: false,
    };
  }
  componentDidMount() {
    this.fetchAllExpenses();
  }

  fetchAllExpenses = async () => {
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
              isLoading: false,
              status: message,
              isRefreshing: false,
            });

            // Alert.alert('', message, [{text: 'OK'}], {
            //   cancelable: false,
            // });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => <AllRejectedComponent item={item} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(3)}} />;

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
    const {isLoading, isRefreshing} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <View style={styles.container}>
        {this.state.expenses ? (
          <FlatList
            data={this.state.expenses}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            refreshing={isRefreshing}
            onRefresh={this.handleListRefresh}
          />
        ) : (
          <View style={styles.noDataStyle}>
            <Text style={styles.noDataTextStyle}>{this.state.status}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    padding: wp(3),
  },
  noDataStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    // backgroundColor: '#fff',
    // borderBottomWidth: 0.5,
  },
  noDataTextStyle: {
    color: '#333',
    fontSize: wp(3.2),
    textAlign: 'center',
    width: wp(70),
    alignSelf: 'center',
  },
});
