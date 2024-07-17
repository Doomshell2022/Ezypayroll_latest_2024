import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Dropdown} from 'react-native-element-dropdown';

// Components
import HeadersComponent from '../components/HeadersComponent';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showToast} from '../components/ToastComponent';
import DocumentPicker from 'react-native-document-picker';
import SafeAreaView from 'react-native-safe-area-view';
import PickerModal from 'react-native-picker-modal-view';

// Styles
import basicStyles from '../styles/BasicStyles';

// Icons
import ic_down from '../assets/icons/ic_down.png';
import ic_profile_phone from '../assets/icons/ic_profile_phone.png';
import ic_profile_mail from '../assets/icons/ic_profile_mail.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class SupportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SupportData: [],
      subject: '',
      requestDetail: '',
      showProcessingLoader: false,
      isLoading: true,
      email: '',
      mobile: '',
      connectionState: true,
      selectedSupport: {
        Id: -1,
        Name: 'Select Subject',
        Value: 'Select Subject',
      },
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.getSupportData();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleSendRequest = async () => {
    Keyboard.dismiss();
    const {selectedSupport, requestDetail} = this.state;

    if (selectedSupport.Name === 'Select Subject') {
      Alert.alert('Alert!', 'Please Select Subject', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (requestDetail.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Request  Detail', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

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
          subject: selectedSupport.Name,
          requestDetail,
        };

        const response = await makeRequest(BASE_URL + 'help', params);

        if (response) {
          this.setState({showProcessingLoader: false});

          const {success, message} = response;

          if (success) {
            showToast(message);
          } else {
            showToast(message);
          }
        }
      }
    } catch (error) {
      this.setState({showProcessingLoader: false});
      console.log(error.message);
    }
  };

  getSupportData = async () => {
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

        const response = await makeRequest(BASE_URL + 'getSupportData');

        if (response) {
          const {success} = response;

          if (success) {
            const {SupportData, email, mobile} = response;
            var a = 1;
            const data = SupportData.map(item => ({
              Id: ++a,
              Name: item.name,
              Value: item.name,
              Color: item.Color,
            }));

            this.setState({
              email,
              mobile,
              SupportData: data,
              status: null,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;

            this.setState({
              status: message,
              SupportData: [],
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

  renderStatesCategoryPicker = (disabled, selected, showModal) => {
    const {selectedSupport} = this.state;
    const {Name} = selectedSupport;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'Select Subject') {
      labelStyle.color = '#777';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={labelStyle}>{Name}</Text>
          <Image source={ic_down} resizeMode="cover" style={styles.downIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  handleSelectedSupport = selectedSupport => {
    this.setState({selectedSupport});
    return selectedSupport;
  };

  handleSelectedSupportClose = () => {
    const {selectedSupport} = this.state;
    this.setState({selectedSupport});
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {
      requestDetail,
      showProcessingLoader,
      email,
      mobile,
      selectedSupport,
      SupportData,
    } = this.state;

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        {this.state.connectionState && (
          <>
            <HeadersComponent title="Support" nav={this.props.navigation} />
            <View style={[basicStyles.mainContainer, basicStyles.paddingHalf]}>
              <Text style={basicStyles.headingLarge}>Need Help?</Text>
              <View style={basicStyles.separatorHorizontal} />
              <View style={styles.fromDateFieldContainer}>
                <Dropdown
                  style={{color: '#000', fontSize: wp(3)}}
                  placeholderStyle={{fontSize: wp(3), color: '#ccc'}}
                  selectedTextStyle={{fontSize: wp(3), color: '#000'}}
                  inputSearchStyle={{fontSize: wp(3), color: '#000'}}
                  iconStyle={styles.iconStyle}
                  data={SupportData}
                  search
                  maxHeight={300}
                  labelField="Name"
                  valueField="Value"
                  placeholder="Select Subject..."
                  searchPlaceholder="Search..."
                  value={selectedSupport}
                  onChange={this.handleSelectedSupport}
                />
                {/*  <PickerModal
                  items={SupportData}
                  requireSelection={true}
                  selected={selectedSupport}
                  onSelected={this.handleSelectedSupport}
                  onClosed={this.handleSelectedSupportClose}
                  backButtonDisabled
                  showToTopButton={true}
                  showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={false}
                  searchPlaceholderText="Search"
                  renderSelectView={this.renderStatesCategoryPicker}
                /> */}
              </View>

              <TextInput
                style={[styles.inputField, , {color: '#000'}]}
                placeholder="Request Detail"
                placeholderTextColor="#ccc"
                value={requestDetail}
                onChangeText={e => {
                  this.setState({requestDetail: e});
                }}
              />

              <TouchableOpacity
                onPress={this.handleSendRequest}
                style={[styles.updateButton, basicStyles.marginBottom]}>
                <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                  Send
                </Text>
              </TouchableOpacity>

              <Text
                style={[
                  basicStyles.headingLarge,
                  basicStyles.marginBottomHalf,
                ]}>
                Support Information
              </Text>

              <View style={basicStyles.paddingHalf}>
                <Text style={[basicStyles.heading, basicStyles.marginBottom]}>
                  EZY Payroll Support
                </Text>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.marginBottom,
                  ]}>
                  <Image
                    source={ic_profile_mail}
                    resizeMode="cover"
                    style={basicStyles.iconRow}
                  />
                  <Text style={[basicStyles.text]}>Email: {email}</Text>
                </View>
                <View
                  style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                  <Image
                    source={ic_profile_phone}
                    resizeMode="cover"
                    style={basicStyles.iconRow}
                  />
                  <Text style={[basicStyles.text]}>Call: {mobile}</Text>
                </View>
              </View>
            </View>
          </>
        )}
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
        {showProcessingLoader && <ProcessingLoader />}
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
  fromDateFieldContainer: {
    height: hp(5.5),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
    justifyContent: 'center',
  },
  pickerInput: {
    fontSize: wp(3),
    width: wp(96),
    marginHorizontal: 0,
    left: wp(-4),
  },

  inputField: {
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3.5),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
  },
  updateButton: {
    backgroundColor: '#0077a2',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  downIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
});
