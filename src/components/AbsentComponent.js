import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import {Picker} from '@react-native-picker/picker';
import {Picker} from '@react-native-picker/picker';

import basicStyles from '../styles/BasicStyles';
import MonthPickerComp from './MonthPicker';
import AutoScrolling from 'react-native-auto-scrolling';
import {KEYS, getData} from '../api/UserPreference';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {showToast} from './ToastComponent';
import CustomLoader from './CustomLoader';

class AbsentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: new Date(),
      modalVisible: false,
      modalVisible2: false,
      selectedItem: {}, // Store selected item details
      dropdownValue: '',
      textInputValue: '',
      selectedValue: null,
      showDropdown: false,
      isLoading: false,
      isRefreshing: true,
      id: '',
      issue: '',
    };
  }
  componentDidMount() {
    this.leavedate();
  }
  leavedate = async (
    month = new Date().toISOString(),
    year = new Date().getFullYear(),
  ) => {
    const formattedDate = new Date(month)
      .toLocaleDateString('en-US', {
        month: 'numeric',
      })
      .split(' ')
      .join('-');
    const formattedDate2 = new Date(month)
      .toLocaleDateString('en-US', {
        year: 'numeric',
      })
      .split(' ')
      .join('-');
    const userInfo = await getData(KEYS.USER_INFO);
    this.setState({isLoading: true});

    if (userInfo) {
      const {ezypayrollId, user} = userInfo;
      const {id: userId} = user;

      const params = {
        ezypayrollId,
        userId,
        month: formattedDate,
        year: formattedDate2,
      };

      const response = await makeRequest(BASE_URL + 'leavesTaken', params);

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
            month: null,
            data: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
      }
    }
  };

  handlesubmit = async () => {
    try {
      this.toggleLoading();

      const userInfo = await getData(KEYS.USER_INFO);
      const {ezypayrollId, user} = userInfo;
      const {id: userId} = user;

      if (!this.state.textInputValue) {
        alert('Please fill in your reason');
        this.toggleLoading();
        return;
      }

      const params = {
        ezypayrollId,
        userId,
        id: this.state.id,
        issue: this.state.issue,
        reason: this.state.textInputValue,
      };

      // Make API request
      const response = await makeRequest(
        BASE_URL + 'requestpunchOutIssue',
        params,
      );
      console.log('Response', response);
      const {success, message} = response;

      if (success === 'true') {
        showToast(message);
        // Navigate back to the current screen to refresh
        this.props.navigation.navigate('AbsentScreen'); // Replace 'AbsentScreen' with the name of your screen

        // Call leavedate function to refresh leave data
        this.leavedate();
      } else {
        showToast(message);
      }

      // Update state after submission
      this.setState(
        {
          textInputValue: '', // Reset text input value
          isLoading: false,
          isRefreshing: false,
        },
        () => {
          // Callback to hide modal and finalize UI updates
          this.toggleLoading(); // Hide loader
          this.setModalVisible(!this.state.modalVisible); // Hide modal
        },
      );

      // Simulate data refresh completion
      setTimeout(() => {
        this.setState({isRefreshing: false}); // Finish refreshing
      }, 1000); // Replace with actual refresh logic duration
    } catch (error) {
      console.error('Error:', error);
      this.toggleLoading(); // Hide loader on error
    }
  };

  submitButtonPress = () => {
    this.toggleLoading(); // Show loader
    // Simulate submission delay (replace with actual API call)
    setTimeout(() => {
      this.toggleLoading();
      this.setModalVisible(!this.state.modalVisible);
      this.setState({isRefreshing: true});
      setTimeout(() => {
        this.setState({isRefreshing: false});
      }, 1000);
    }, 2000);
  };

  toggleLoading = () => {
    this.setState(prevState => ({
      isLoading: !prevState.isLoading,
    }));
  };

  setModalVisible = (visible, id, issue) => {
    if (!visible) {
      this.setState({modalVisible: visible, id, issue, textInputValue: ''});
    } else {
      this.setState({modalVisible: visible, id, issue});
    }
  };
  setModalVisible2 = (visible2, item = {}) => {
    if (!visible2) {
      this.setState({modalVisible2: visible2, selectedItem: {}});
    } else {
      this.setState({modalVisible2: visible2, selectedItem: item});
    }
  };

  setDropdownValue = value => {
    this.setState({dropdownValue: value});
  };

  setTextInputValue = value => {
    this.setState({textInputValue: value});
  };
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isRefreshing: true}, () => {
        // updating list
        this.componentDidMount();
        // this.handlesubmit();
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => {
    const renderSlots = () => {
      if (item.type === 'Sunday') {
        return (
          <>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.cakeContainer}>
                <Text
                  style={[
                    styles.homeText,
                    {fontWeight: '700', color: '#000', textAlign: 'center'},
                  ]}>
                  {item.type}
                </Text>
                <Text style={{marginRight: wp(2)}}></Text>
                <Text
                  style={[
                    styles.homeTextStyle,
                    {fontWeight: '700', color: '#000'},
                  ]}>
                  {item.date}
                </Text>
              </View>
            </View>
          </>
        );
      }
    };

    let background = '#ddd8';
    let textColor = '#333';
    if (item.type === 'Sunday' || item.isHoliday === true) {
      background = item.backgroundColor;
      textColor = '#fff';
    } else if (item.type === 'A°') {
      background = '#FFFF00';
      textColor = '#fff';
    } else if (item.type === 'HF°') {
      background = '#FFA500';
      textColor = '#fff';
    }

    return (
      <View style={{flex: 1, width: '100%'}}>
        <View
          style={[
            styles.container2,
            {
              backgroundColor: item.backgroundColor
                ? item.backgroundColor
                : '#ddd8',
            },
          ]}>
          <View style={styles.listContainer2}>
            {item.type === 'Sunday' ? null : (
              <>
                <View
                  style={{
                    width: wp(2.5),
                    height: wp(2.5),
                    borderRadius: wp(5),
                    backgroundColor:
                      item.isPunch === true
                        ? item.isPunchOut === true
                          ? 'red'
                          : 'green'
                        : 'gray',
                    marginRight: wp(1),
                    marginTop: wp(0.5),
                  }}
                />
                <View style={{flex: 2}}>
                  <Text style={styles.infoHeadTextStyle2}>{item.date}</Text>
                </View>
                <View style={styles.punchinout}>
                  <Text style={styles.infoHeadStyle2}>In </Text>
                  <Text style={styles.infoHeadTextStyle2}>{item.in_time}</Text>
                </View>
                <View style={styles.punchinout}>
                  <Text style={styles.infoHeadStyle2}>Out </Text>
                  <Text style={styles.infoHeadTextStyle2}>{item.out_time}</Text>
                </View>

                {item.isApplied === false && item.isApproved === false ? (
                  <View style={styles.punchinout}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setModalVisible(true, item.id, item.issue)
                      }
                      style={styles.punchinout}>
                      <Text style={styles.infoHeadStyle2}>status</Text>
                      <Text
                        style={{
                          color:
                            item.type === 'P'
                              ? 'green'
                              : item.type === 'A' ||
                                item.type === 'HF' ||
                                item.type === 'A°' ||
                                item.type === 'HF°' ||
                                item.type === 'A*' ||
                                item.type === 'CL(A)' ||
                                item.type === 'CL(HF)'
                              ? 'red'
                              : 'black',
                          fontSize: wp(2.5),
                        }}>
                        {item.type}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.punchinout}>
                    <Text style={styles.infoHeadStyle2}>status</Text>
                    {/* <Image
                      source={require('../assets/icons/on-off-button.png')}
                      style={{width: wp(2), height: wp(2)}}
                    /> */}
                    <Text
                      style={{
                        color:
                          item.type === 'P'
                            ? 'green'
                            : item.type === 'A' ||
                              item.type === 'HF' ||
                              item.type === 'A°' ||
                              item.type === 'HF°' ||
                              item.type === 'A*' ||
                              item.type === 'CL(A)' ||
                              item.type === 'CL(HF)'
                            ? 'red'
                            : 'black',
                        fontSize: wp(2.5),
                      }}>
                      {item.type}
                      {item.isApplied === true ? (
                        <>
                          <TouchableOpacity
                            onPress={() => this.setModalVisible2(true, item)}>
                            <Image
                              source={require('../assets/icons/info1.png')}
                              style={{
                                width: wp(3),
                                height: wp(3),
                                marginLeft: wp(2),
                                marginTop: wp(1.2),
                              }}
                            />
                          </TouchableOpacity>
                        </>
                      ) : null}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
          {renderSlots()}
        </View>
      </View>
    );
  };

  keyExtractor = (item, index) => index.toString();
  itemSeparator = () => <View style={styles.separator} />;

  render() {
    // if (this.state.isLoading) {
    //   return <CustomLoader />;
    // }
    const {monthTotalHalf, monthTotal, month, details, isHoliday} =
      this.props.item;
    const {selectedValue, selectedItem} = this.state;
    console.log('====================================');
    console.log('dsdarfaere', selectedItem);
    console.log('====================================');
    return (
      <View style={styles.container}>
        {/* ScrollView for "Half Day Absent" and "Month" view */}
        <ScrollView>
          {this.state.month ? (
            <View style={styles.mainListContainer}>
              <TouchableOpacity style={styles.listContainer}>
                <View>
                  <Text style={styles.infoHeadStyle}>Month</Text>
                  <Text style={styles.infoHeadTextStyle}>{month}</Text>
                </View>
                <View>
                  <Text style={styles.infoHeadStyle}>HalfDay</Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: wp(3),
                      marginRight: wp(1),
                      textAlign: 'center',
                    }}>
                    {monthTotalHalf}
                  </Text>
                </View>
                <View style={basicStyles.alignCenter}>
                  <Text style={styles.infoHeadStyle}>Absent</Text>
                  <Text
                    style={[styles.infoHeadTextStyle, {alignSelf: 'flex-end'}]}>
                    {monthTotal}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          {/* End of ScrollView for "Half Day Absent" and "Month" view */}
          {/* FlatList for details */}
          <ScrollView style={{flex: 1, width: '100%'}}>
            {details ? (
              <FlatList
                data={details}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={this.itemSeparator}
                showsVerticalScrollIndicator={false}
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleListRefresh}
              />
            ) : null}
          </ScrollView>
        </ScrollView>
        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => this.setModalVisible(!this.state.modalVisible)} // Updated onPress handler
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.modalText}>
                Please enter reason why you are not punchout!
              </Text>
              {/* Conditional rendering to show "Pending" by default */}
              <View style={styles.pickerAndButtonContainer}>
                {/* <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    onPress={() => this.setState({showDropdown: true})}
                    style={styles.customPicker}>
                    <Text style={styles.customPickerText}>
                      {selectedValue ? selectedValue : 'Not Updated'}
                    </Text>
                  </TouchableOpacity>
                  {showDropdown && this.renderDropdown()}
                </View> */}
              </View>
              <View>
                <Text
                  style={{
                    marginBottom: wp(-4),
                    textAlign: 'left',
                    marginTop: wp(3),
                    fontSize: wp(3),
                  }}>
                  Enter Reason
                </Text>
                <TextInput
                  placeholder="Enter reason..."
                  style={styles.reasonInput}
                  onChangeText={this.setTextInputValue}
                  value={this.state.textInputValue}
                />
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={this.handlesubmit}
                disabled={this.state.isLoading} // Disable button when loading
              >
                <Text style={styles.textStyle}>
                  {this.state.isLoading ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible2}
          onRequestClose={() => {
            this.setModalVisible2(!this.state.modalVisible2);
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setModalVisible2(!this.state.modalVisible2);
            }}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    margin: 20,
                    backgroundColor: '#000', // Light black background
                    borderRadius: 20,
                    padding: 35,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    elevation: 5,
                  }}>
                  <View>
                    <Text style={{color: '#FFF'}}>
                      Date: {this.state.selectedItem.reason_date}
                    </Text>
                    <Text style={{color: '#FFF'}}>
                      Status: {this.state.selectedItem.status}
                    </Text>
                    <Text style={{color: '#FFF'}}>
                      Reason: {this.state.selectedItem.reason}
                    </Text>
                    <Text style={{color: '#FFF'}}>
                      Reason Type: {this.state.selectedItem.issue}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

export default AbsentComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    marginBottom: hp(15),
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#0077a2',
    borderRadius: 5,
    marginBottom: hp(1),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(1),
    paddingHorizontal: wp(2.5),
  },
  listContentContainerStyle: {
    paddingHorizontal: wp(5),
  },
  infoHeadTextStyle: {
    color: '#fff',
    fontSize: wp(3),
    marginRight: wp(1),
  },
  infoHeadStyle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
    marginLeft: wp(1),
  },
  separator: {
    height: hp(0.5),
  },
  container2: {
    flex: 1,
    backgroundColor: '#ddd8',
    borderRadius: wp(1.2),
    marginHorizontal: wp(1.5),
    marginBottom: wp(0.4),
    marginTop: wp(0.5),
  },
  listContainer2: {
    justifyContent: 'space-between',
    padding: wp(1),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoHeadTextStyle2: {
    color: '#333',
    fontSize: wp(2.5),
  },
  infoHeadStyle2: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
  },
  punchinout: {flex: 1, paddingLeft: wp(2)},
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
  },
  homeTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: wp(3),
  },
  homeText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '400',
  },
  homeTextStyle: {
    color: '#333',
    fontSize: wp(3),
    fontWeight: '400',
  },
  homeTextStyle2: {
    color: '#333',
    fontSize: wp(4),
    fontWeight: '700',
  },
  icStyle: {
    height: hp(4),
    aspectRatio: 1 / 1,
  },
  textCenter: {
    textAlign: 'center',
    color: '#fff',
  },
  cakeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    marginHorizontal: wp(4),
    margin: wp(2),
    textAlign: 'center',
    marginTop: wp(-0),
    marginLeft: hp(18),
  },
  listContainers: {
    borderTopWidth: 0.5,
    borderTopColor: '#ccc8',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc8',
  },
  tileContainer: {
    borderWidth: 0.5,
    borderColor: '#0077a2',
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp(4),
    height: hp(20),
  },
  tileIcon: {
    height: wp(10),
    aspectRatio: 1 / 1,
    marginBottom: wp(2),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    padding: wp(5),
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: wp(80), // Adjust width as needed
  },

  // button: {
  //   borderRadius: 10,
  //   padding: 10,
  //   elevation: 2,
  // },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: wp(2),
    borderRadius: 5,
    width: wp(30),
    alignItems: 'center',
  },
  // buttonClose: {
  //   backgroundColor: '#2196F3',
  // },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  picker: {
    height: 40, // Adjusted height
    width: 200, // Increased width for better text visibility
  },
  picker2: {
    height: 40, // Adjusted height
    width: 200, // Increased width for better text visibility
    borderWidth: 1, // Reduced border width
    borderColor: '#000',
    borderRadius: wp(1),
    justifyContent: 'center', // Center the Picker
    alignItems: 'center', // Center the Picker
    overflow: 'hidden', // Ensure text is not cut off
  },
  reasonInput: {
    width: wp(70),
    borderWidth: 1,
    borderColor: '#000',
    padding: wp(2),
    marginBottom: wp(4),
    marginTop: wp(5),
  },
  pickerAndButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligns items to the right
    marginTop: wp(2),
    marginLeft: 'auto', // Pushes the container to the right edge of the parent
  },
  customPicker: {
    borderWidth: 1,
    height: 40,
    width: wp(70), // Adjusted width to match reasonInput
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(-3.5),
  },

  customPickerText: {
    fontSize: wp(3.5),
  },
  dropdownOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    position: 'relative',
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 22,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    // width: wp(80),
    padding: wp(5),
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: wp(4),
  },
  // reasonInput: {
  //   width: wp(70),
  //   borderWidth: 1,
  //   borderColor: '#000',
  //   padding: wp(2),
  //   marginBottom: wp(4),
  // },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(70),
  },
});
