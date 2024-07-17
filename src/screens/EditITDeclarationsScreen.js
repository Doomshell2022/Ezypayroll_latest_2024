import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Picker} from '@react-native-picker/picker';

import {Dropdown} from 'react-native-element-dropdown';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PickerModal from 'react-native-picker-modal-view';
// Styles
import basicStyles from '../styles/BasicStyles';

// Image
import background from '../assets/images/background.png';
import ic_down from '../assets/icons/ic_down.png';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import ITListComponent from '../components/ITListComponent';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/ToastComponent';

import DocumentPicker from 'react-native-document-picker';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import SafeAreaView from 'react-native-safe-area-view';
// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class AddITDeclarationsScreen extends Component {
  constructor(props) {
    super(props);

    const item = props.navigation.getParam('item', null);

    const {
      id,
      employee_id,
      declaration_name,
      financial_year,
      section,
      max_limit,
      amount,
      notes,
      status,
      image,
    } = item;

    this.state = {
      declarationID: id,
      financialYear: financial_year,
      declarationName: declaration_name,
      section: section,
      maxLimit: max_limit,
      amount: amount,
      notes: notes,
      image: null,
      imageName: 'Add File',
      financialYearData: [],
      declarationNameData: [],
      isLoading: true,
      showProcessingLoader: false,
      selectedFinancial: {
        Id: -1,
        Name: 'Select Financial Year',
        Value: 'Select Financial Year',
      },
      selectedDeclaration: {
        Id: -1,
        Name: 'Select Declaration Name',
        Value: 'Select Declaration Name',
      },
      connectionState: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchDeclarationData();
    this.checkPermission();
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

        // preparing params
        const params = {
          ezypayrollId,
          userId,
        };

        const response = await makeRequest(BASE_URL + 'getItDeclarationData');

        if (response) {
          const {success} = response;

          if (success) {
            const {finacialYear, declarationName} = response;

            var a = 1;
            const data = finacialYear.map(item => ({
              Id: ++a,
              Name: item.year,
              Value: item.year,
            }));

            var b = 1;
            const decData = declarationName.map(item => ({
              Id: ++b,
              Name: item.name,
              Value: item.maxLimit,
            }));

            this.setState({
              financialYearData: data,
              declarationNameData: decData,
              status: null,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;

            this.setState({
              status: message,
              financialYearData: [],
              declarationNameData: [],
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

  handleEditDeclaration = async () => {
    const {
      declarationID,
      selectedFinancial,
      selectedDeclaration,
      section,
      maxLimit,
      amount,
      notes,
      image,
    } = this.state;

    if (selectedFinancial === 'Select Financial Year') {
      Alert.alert('Alert!', 'Please select Year', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (selectedDeclaration.Name === 'Select Declaration Name') {
      Alert.alert('Alert!', 'Please select Declaration Name', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (section.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Section', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (amount.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Amount', [{text: 'OK'}], {
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
          declarationID,
          ezypayrollId,
          userId,
          financialYear: selectedFinancial.Name,
          declarationName: selectedDeclaration.Name,
          section,
          maxLimit,
          amount,
          notes,
        };

        const response = await makeRequest(
          BASE_URL + 'editDeclarations',
          params,
        );

        if (response) {
          this.setState({showProcessingLoader: false});

          const {success, message} = response;

          if (success) {
            showToast(message);
            const {pop, getParam} = this.props.navigation;

            const handleRefresh = await getParam('handleRefresh', null);

            await handleRefresh();
            pop();
          } else {
            showToast(message);
            const {pop, getParam} = this.props.navigation;
            const handleRefresh = await getParam('handleRefresh', null);

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

  renderFinancialPicker = (disabled, selected, showModal) => {
    const {selectedFinancial} = this.state;
    const {Name} = selectedFinancial;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'Select Financial Year') {
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

  handleFinancial = selectedFinancial => {
    this.setState({selectedFinancial});
    return selectedFinancial;
  };

  handleFinancialClose = () => {
    const {selectedFinancial} = this.state;
    this.setState({selectedFinancial});
  };

  renderDeclarationPicker = (disabled, selected, showModal) => {
    const {selectedDeclaration} = this.state;
    const {Name} = selectedDeclaration;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'Select Declaration Name') {
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

  handleDeclaration = async selectedDeclaration => {
    const {Name, Value} = selectedDeclaration;
    this.setState({selectedDeclaration, maxLimit: Value});
    return selectedDeclaration;
  };

  handleDeclarationClose = () => {
    const {selectedDeclaration} = this.state;
    this.setState({selectedDeclaration});
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    const {
      section,
      maxLimit,
      amount,
      notes,
      showProcessingLoader,
      financialYearData,
      selectedFinancial,
      declarationNameData,
      selectedDeclaration,
    } = this.state;

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              title="Edit IT Declarations"
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
                    placeholderStyle={{fontSize: wp(3)}}
                    selectedTextStyle={{fontSize: wp(3)}}
                    inputSearchStyle={{fontSize: wp(3)}}
                    iconStyle={styles.iconStyle}
                    data={financialYearData}
                    search
                    maxHeight={300}
                    labelField="Name"
                    valueField="Value"
                    placeholder="Select Financial Year"
                    searchPlaceholder="Search..."
                    value={selectedFinancial}
                    onChange={this.handleFinancial}
                  />
                  {/*  <PickerModal
                    items={financialYearData}
                    requireSelection={true}
                    selected={selectedFinancial}
                    onSelected={this.handleFinancial}
                    onClosed={this.handleFinancialClose}
                    backButtonDisabled
                    showToTopButton={true}
                    showAlphabeticalIndex={true}
                    autoGenerateAlphabeticalIndex={false}
                    searchPlaceholderText="Search"
                    renderSelectView={this.renderFinancialPicker}
                  /> */}
                </View>

                <View style={styles.fromDateFieldContainer}>
                  <Dropdown
                    style={{fontSize: wp(3)}}
                    placeholderStyle={{fontSize: wp(3)}}
                    selectedTextStyle={{fontSize: wp(3)}}
                    inputSearchStyle={{fontSize: wp(3)}}
                    iconStyle={styles.iconStyle}
                    data={declarationNameData}
                    search
                    maxHeight={300}
                    labelField="Name"
                    valueField="Value"
                    placeholder="Select Declaration Name"
                    searchPlaceholder="Search..."
                    value={selectedDeclaration}
                    onChange={this.handleDeclaration}
                  />
                  {/*  <PickerModal
                    items={declarationNameData}
                    requireSelection={true}
                    selected={selectedDeclaration}
                    onSelected={this.handleDeclaration}
                    onClosed={this.handleDeclarationClose}
                    backButtonDisabled
                    showToTopButton={true}
                    showAlphabeticalIndex={true}
                    autoGenerateAlphabeticalIndex={false}
                    searchPlaceholderText="Search"
                    renderSelectView={this.renderDeclarationPicker}
                  /> */}
                </View>

                <TextInput
                  style={styles.inputField}
                  placeholder="Section"
                  value={section}
                  onChangeText={e => {
                    this.setState({section: e});
                  }}
                />
                {/* <TextInput
              style={styles.inputField}
              placeholder="Max Limit"
              value={maxLimit}
              onChangeText={(e) => {
                this.setState({maxLimit: e});
              }}
            /> */}
                <Text style={[styles.inputField2]}>{maxLimit}</Text>

                <TextInput
                  style={styles.inputField}
                  placeholder="Amount"
                  value={amount}
                  keyboardType="numeric"
                  maxLength={6}
                  onChangeText={e => {
                    if (e > maxLimit) {
                      Alert.alert('Alert!', 'Amount Exceeded The Max Limit');
                      return;
                    }
                    this.setState({amount: e});
                  }}
                />

                <TextInput
                  style={[styles.textareaInput, {height: hp(14)}]}
                  placeholder="Notes"
                  value={notes}
                  multiline={true}
                  numberOfLines={7}
                  onChangeText={e => {
                    this.setState({notes: e});
                  }}
                />

                {/* <TouchableOpacity onPress={this.handleFilePick}>
              <Text style={styles.input}>{this.state.imageName}</Text>
            </TouchableOpacity> */}

                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={this.handleEditDeclaration}>
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    Edit
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
    elevation: 5,
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
    height: hp(6.8),
    backgroundColor: '#2a2a2a',
    padding: wp(2),
    fontSize: wp(3),
    marginBottom: wp(2),
    width: wp(40),
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
  },
  inputField2: {
    backgroundColor: '#9994',
    paddingVertical: wp(3),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3.5),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
  },
  textareaInput: {
    height: hp(18),
    textAlignVertical: 'top',
    flex: 1,
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3.5),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
  },
  downIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
});
