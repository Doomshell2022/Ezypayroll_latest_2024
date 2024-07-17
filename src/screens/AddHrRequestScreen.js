import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import {Picker} from '@react-native-picker/picker';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showToast} from '../components/ToastComponent';
import DocumentPicker from 'react-native-document-picker';
import PickerModal from 'react-native-picker-modal-view';

import {Dropdown} from 'react-native-element-dropdown';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

// Styles
import basicStyles from '../styles/BasicStyles';

// Image
import background from '../assets/images/background.png';
import SafeAreaView from 'react-native-safe-area-view';
//  Components
import HeadersComponent from '../components/HeadersComponent';
import ITListComponent from '../components/ITListComponent';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

import ic_down from '../assets/icons/ic_down.png';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class AddITDeclarationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestDetail: '',
      image: null,
      imageName: 'Add File',
      HrRequestData: [],
      isLoading: true,
      showProcessingLoader: false,
      selectedRequestType: {
        Id: -1,
        Name: 'Select Request Type',
        Value: 'Select Request Type',
      },
      connectionState: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchHrRequestData();
    this.checkPermission();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleAddRequest = async () => {
    const {selectedRequestType, requestDetail, image} = this.state;

    if (selectedRequestType.Name === 'Select Request Type') {
      Alert.alert('Alert!', 'Please Select Request Type', [{text: 'OK'}], {
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
    // starting loader
    this.setState({showProcessingLoader: true});
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
          requestType: selectedRequestType.Name,
          requestDetail,
          image,
        };

        const response = await makeRequest(BASE_URL + 'HrRequest', params);

        if (response) {
          const {success, message} = response;

          if (success) {
            showToast(message);
            const {pop, getParam} = this.props.navigation;

            const handleRefresh = await getParam('handleRefresh', null);
            this.setState({showProcessingLoader: false});
            pop();
            await handleRefresh(true);
          } else {
            showToast(message);
            const {pop, getParam} = this.props.navigation;
            const handleRefresh = await getParam('handleRefresh', null);
            this.setState({showProcessingLoader: false});
            await handleRefresh();
            pop();
          }
        }
      }
    } catch (error) {
      this.setState({showProcessingLoader: false});
      console.log(error.message);
    }
  };

  fetchHrRequestData = async () => {
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

        const response = await makeRequest(BASE_URL + 'getHrRequestData');

        if (response) {
          const {success} = response;

          if (success) {
            const {HrRequestData} = response;

            var a = 1;
            const data = HrRequestData.map(item => ({
              Id: ++a,
              Name: item.name,
              Value: item.name,
            }));

            this.setState({
              HrRequestData: data,
              status: null,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;

            this.setState({
              status: message,
              HrRequestData: [],
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

  checkPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          // 'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
            // this.handleImagePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          // this.handleImagePick();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Storage" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('cannot open settings', error);
    }
  };

  handleFilePick = async () => {
    try {
      // Pick a single file
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const {name} = response;
      const extension = name.split('.').pop();
      const isFileAllowed =
        extension === 'pdf' ||
        extension === 'jpeg' ||
        extension === 'jpg' ||
        extension === 'png';

      if (isFileAllowed) {
        this.setState({image: response, imageName: name});
      } else {
        alert(`.${extension} file not allowed`);
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };

  renderStatesCategoryPicker = (disabled, selected, showModal) => {
    const {selectedRequestType} = this.state;
    const {Name} = selectedRequestType;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'Select Request Type') {
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

  handleSelectedSupport = selectedRequestType => {
    this.setState({selectedRequestType});
    return selectedRequestType;
  };

  handleSelectedSupportClose = () => {
    const {selectedRequestType} = this.state;
    this.setState({selectedRequestType});
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {
      requestDetail,
      showProcessingLoader,
      HrRequestData,
      selectedRequestType,
    } = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              title="Add HR Request"
              nav={this.props.navigation}
              navAction="back"
            />
            <View style={[basicStyles.mainContainer, basicStyles.paddingHalf]}>
              <KeyboardAwareScrollView
                contentContainerStyle={styles.loginScreenContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                enableOnAndroid>
                <View style={styles.fromDateFieldContainer}>
                  <Dropdown
                    style={{fontSize: wp(3)}}
                    placeholderStyle={{fontSize: wp(3), color: '#ccc'}}
                    selectedTextStyle={{fontSize: wp(3), color: '#000'}}
                    inputSearchStyle={{fontSize: wp(3), color: '#000'}}
                    iconStyle={styles.iconStyle}
                    data={HrRequestData}
                    search
                    maxHeight={300}
                    labelField="Name"
                    valueField="Value"
                    placeholder="Select Request Type..."
                    searchPlaceholder="Search..."
                    value={selectedRequestType}
                    onChange={this.handleSelectedSupport}
                  />
                  {/*  <PickerModal
                    items={HrRequestData}
                    requireSelection={true}
                    selected={selectedRequestType}
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
                  style={styles.inputField}
                  placeholder="Request Detail"
                  value={requestDetail}
                  onChangeText={e => {
                    this.setState({requestDetail: e});
                  }}
                  placeholderTextColor="#ccc"
                />

                <TouchableOpacity onPress={this.handleFilePick}>
                  <Text style={styles.input}>{this.state.imageName}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={this.handleAddRequest}>
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    Add
                  </Text>
                </TouchableOpacity>
              </KeyboardAwareScrollView>
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
    flex: 1,
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
    flex: 1,
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginTop: hp(2),
  },
  input: {
    backgroundColor: '#2a2a2a',
    padding: wp(2),
    fontSize: wp(3),
    width: wp(40),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
  },
  downIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
});
