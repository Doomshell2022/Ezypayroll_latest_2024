import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ic_add from '../assets/icons/ic_add.png';

// Components
import AllTabComponent from '../components/AllTabComponent';
import ProcessingLoader from '../components/ProcessingLoader';
import CustomLoader from '../components/CustomLoader';
import {showToast} from '../components/ToastComponent';

// Popup
import AddExpensesPopup from '../components/AddExpensesPopup';
import ImagePopUpComponent from '../components/ImagePopUpComponent';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
// User Preference
import {KEYS, getData} from '../api/UserPreference';

export default class ExAllTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: null,
      status: 'No Expenses Available...',
      isRefreshing: false,
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

        // preparing params
        const params = {
          ezypayrollId,
          userId,
          status: 'all',
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
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleAddExpenses = async (title, amount, image, comment) => {
    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;

        // preparing params
        const params = {
          ezypayrollId,
          userId,
          title,
          amount,
          image,
          comment,
        };

        const response = await makeRequest(BASE_URL + 'addExpense', params);

        if (response) {
          // stopping loader
          this.setState({showProcessingLoader: false});

          const {success, message} = response;

          if (success) {
            showToast(message);
            this.componentDidMount();
          } else {
            showToast(message);
          }
        }
      } else {
        this.setState({showProcessingLoader: false});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleDeleteExpenses = async expenseId => {
    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;

        // preparing params
        const params = {
          ezypayrollId,
          userId,
          expenseId,
        };

        const response = await makeRequest(BASE_URL + 'deleteExpense', params);

        if (response) {
          // stopping loader
          this.setState({showProcessingLoader: false});

          const {success, message} = response;

          if (success) {
            showToast(message);
            await this.componentDidMount();
          } else {
            showToast(message);
          }
        }
      } else {
        this.setState({showProcessingLoader: false});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <AllTabComponent
      item={item}
      handleViewImage={this.handleViewImage}
      handleDeleteExpenses={this.handleDeleteExpenses}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(3)}} />;

  handleExpenseAddPopup = () => {
    this.setState({showExpensesPopup: true});
  };

  handleViewImage = image => {
    // this.setState({showImagePopup: true});
    console.log(image);
    Linking.openURL(image);
    this.image = image;
  };

  closePopup = () => {
    this.setState({showExpensesPopup: false, showImagePopup: false});
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
      <View style={styles.container}>
        {this.state.connectionState && (
          <>
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
            <TouchableOpacity
              style={styles.addButton}
              onPress={this.handleExpenseAddPopup}
              underlayColor="#e14c4c80">
              <Image
                source={ic_add}
                resizeMode="cover"
                style={styles.addIcon}
              />
            </TouchableOpacity>
          </>
        )}
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
        {showExpensesPopup && (
          <AddExpensesPopup
            closePopup={this.closePopup}
            nav={this.props.navigation}
            handleAddExpenses={this.handleAddExpenses}
          />
        )}

        {showImagePopup && (
          <ImagePopUpComponent
            closePopup={this.closePopup}
            nav={this.props.navigation}
            handleAddExpenses={this.handleAddExpenses}
            item={this.image}
          />
        )}
        {showProcessingLoader && <ProcessingLoader />}
      </View>
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
  addButton: {
    position: 'absolute',
    borderRadius: hp(3),
    backgroundColor: '#fff',
    bottom: wp(4),
    right: wp(4),
    zIndex: 3,
  },
  addIcon: {
    height: hp(6),
    aspectRatio: 1 / 1,
  },
});
