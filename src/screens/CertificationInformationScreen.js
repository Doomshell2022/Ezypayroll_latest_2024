// import React from 'react';
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Linking,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import PickerModal from 'react-native-picker-modal-view';

// Bottom Modal
import RBSheet from 'react-native-raw-bottom-sheet';

// Colors
import {colors} from '../assets/colors/colors';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
import DocumentPicker from 'react-native-document-picker';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

// Styles
import basicStyles from '../styles/BasicStyles';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import ProfileComponent from '../components/ProfileComponent';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/ToastComponent';

// Icons
import ic_down from '../assets/icons/ic_down.png';
import ic_downlaod from '../assets/icons/ic_download.png';
import SafeAreaView from 'react-native-safe-area-view';
// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';

export default class PersonalDetailsScreen extends Component {
  constructor(props) {
    super(props);

    const {navigation} = props;
    const profile = navigation.getParam('profile', null);

    const {firstName, lastName, empId, designation, image, certificationInfo} =
      profile;

    this.basicProfileDetail = {firstName, lastName, empId, designation, image};

    this.state = {
      editProfilePopup: false,
      showProcessingLoader: false,
      certificationInfo,
      month: '',
      year: '',
      title: '',
      description: '',
      document: null,
      documentName: 'Upload Document',
      SupportData: [
        {
          Id: 1,
          Name: 'January',
          Value: 'January',
        },
        {
          Id: 2,
          Name: 'February',
          Value: 'February',
        },
        {
          Id: 3,
          Name: 'March',
          Value: 'March',
        },
        {
          Id: 4,
          Name: 'April',
          Value: 'April',
        },
        {
          Id: 5,
          Name: 'May',
          Value: 'May',
        },
        {
          Id: 6,
          Name: 'June',
          Value: 'June',
        },
        {
          Id: 7,
          Name: 'July',
          Value: 'July',
        },
        {
          Id: 8,
          Name: 'August',
          Value: 'August',
        },
        {
          Id: 9,
          Name: 'September',
          Value: 'September',
        },
        {
          Id: 10,
          Name: 'October',
          Value: 'October',
        },
        {
          Id: 11,
          Name: 'November',
          Value: 'November',
        },
        {
          Id: 12,
          Name: 'December',
          Value: 'December',
        },
      ],
      selectedSupport: {
        Id: -1,
        Name: 'Select Month',
        Value: 'Select Month',
      },
      connectionState: true,
    };
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  handleUpdateInfo = async () => {
    const {document, year, title, description, selectedSupport} = this.state;

    if (selectedSupport.Name === 'Select Month') {
      Alert.alert('Alert!', 'Please Select Month.', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (year === null || year.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Year', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (title === null || title.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Title', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (description === null || description.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Description', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (document === null) {
      Alert.alert(
        'Alert!',
        'Please Select Document To Upload.',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
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
          month: selectedSupport.Name,
          year,
          title,
          description,
          type: 'certificate',
          document,
        };

        const response = await makeRequest(BASE_URL + 'addDocument', params);

        if (response) {
          this.setState({showProcessingLoader: false});

          const {success, message} = response;

          if (success) {
            showToast(message);
            const {pop, getParam} = this.props.navigation;

            const handleRefresh = await getParam('handleRefresh', null);

            await handleRefresh();
            this.closeButton();
            pop();
          } else {
            showToast(message);
            const {pop, getParam} = this.props.navigation;
            const handleRefresh = await getParam('handleRefresh', null);

            await handleRefresh();
            this.closeButton();
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
              this.handleFilePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleFilePick();
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
        this.setState({document: response, documentName: name});
      } else {
        alert(`.${extension} file not allowed`);
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };

  handleDownloadFile = async link => {
    try {
      Linking.openURL(link);
    } catch (error) {
      console.log(error.message);
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({item}) => {
    const {month, year, title, description, status, document, createdOn} = item;
    const handleDownload = () => {
      this.handleDownloadFile(document);
    };

    return (
      <View style={styles.mainListContainer}>
        <View style={basicStyles.flexOne}>
          <View style={styles.listContainer}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>
              Month
            </Text>
            <Text
              style={[
                basicStyles.heading,
                basicStyles.flexOne,
                basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text style={[basicStyles.text, basicStyles.flexTow]}>
              {month ? month : 'N/A'}
            </Text>
          </View>

          <View style={styles.listContainer}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>Year</Text>
            <Text
              style={[
                basicStyles.heading,
                basicStyles.flexOne,
                basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text style={[basicStyles.text, basicStyles.flexTow]}>
              {year ? year : 'N/A'}
            </Text>
          </View>

          <View style={styles.listContainer}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>
              Title
            </Text>
            <Text
              style={[
                basicStyles.heading,
                basicStyles.flexOne,
                basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text style={[basicStyles.text, basicStyles.flexTow]}>
              {title ? title : 'N/A'}
            </Text>
          </View>

          <View style={styles.listContainer}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>
              Description
            </Text>
            <Text
              style={[
                basicStyles.heading,
                basicStyles.flexOne,
                basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text style={[basicStyles.text, basicStyles.flexTow]}>
              {description ? description : 'N/A'}
            </Text>
          </View>

          <View style={styles.listContainer}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>
              Created On
            </Text>
            <Text
              style={[
                basicStyles.heading,
                basicStyles.flexOne,
                basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text style={[basicStyles.text, basicStyles.flexTow]}>
              {createdOn ? createdOn : 'N/A'}
            </Text>
          </View>
        </View>

        <View style={[basicStyles.alignCenter]}>
          {document ? (
            <TouchableOpacity
              style={styles.downloadIc}
              onPress={handleDownload}>
              <Image source={ic_downlaod} style={styles.iconColumn} />
            </TouchableOpacity>
          ) : null}
          <Text style={styles.pendingBtn}>{status}</Text>
        </View>
      </View>
    );
  };

  handleMoreInfo = () => {
    this.RBSheet.open();
  };

  closeButton = () => {
    this.RBSheet.close();
  };

  renderStatesCategoryPicker = (disabled, selected, showModal) => {
    const {selectedSupport} = this.state;
    const {Name} = selectedSupport;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'Select Month') {
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
    const {
      editProfilePopup,
      certificationInfo,
      documentName,
      year,
      title,
      description,
      selectedSupport,
      SupportData,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              nav={this.props.navigation}
              title="Certification Info."
              navAction="back"
            />
            <ProfileComponent profile={this.basicProfileDetail} />
            {certificationInfo ? (
              <FlatList
                data={certificationInfo.allCertificates}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContentContainer}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={[styles.noDataStyle]}>
                <Text style={styles.noDataTextStyle}>No Data Available.</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={this.handleMoreInfo}>
              <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                Add New Certificate
              </Text>
            </TouchableOpacity>
            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              closeOnDragDown={true}
              closeOnPressMask={false}
              onClose={this.closePopup}
              // height={hp(60)}
              customStyles={{
                wrapper: {
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
                container: {
                  minHeight: hp(65),
                  padding: wp(2),
                  borderTopLeftRadius: wp(4),
                  borderTopRightRadius: wp(4),
                },
                draggableIcon: {
                  backgroundColor: '#ff6000',
                },
              }}>
              <TouchableWithoutFeedback style={styles.popupContainer}>
                <ScrollView
                  contentContainerStyle={[styles.popupContainerInner]}>
                  <View style={styles.popupContainer}>
                    <View style={styles.editContainer}>
                      <Text style={basicStyles.heading}>
                        Add New Certificate
                      </Text>
                    </View>

                    <KeyboardAwareScrollView
                      contentContainerStyle={styles.loginScreenContainer}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      enableOnAndroid>
                      <View style={styles.fromDateFieldContainer}>
                        <PickerModal
                          items={SupportData}
                          // string="light"
                          requireSelection={true}
                          selected={selectedSupport}
                          onSelected={this.handleSelectedSupport}
                          onClosed={
                            (this.handleSelectedSupportClose,
                            item => console.log('llllllll', item))
                          }
                          // backButtonDisabled
                          textColor="#000"
                          showToTopButton={true}
                          showAlphabeticalIndex={true}
                          autoGenerateAlphabeticalIndex={false}
                          searchPlaceholderText="Search"
                          renderSelectView={this.renderStatesCategoryPicker}
                        />
                      </View>

                      <TextInput
                        style={styles.inputField}
                        placeholder="Year"
                        placeholderTextColor={lightGreyPrimary}
                        maxLength={4}
                        keyboardType="numeric"
                        value={year}
                        onChangeText={e => this.setState({year: e})}
                      />

                      <TextInput
                        style={styles.inputField}
                        placeholder="Title"
                        placeholderTextColor={lightGreyPrimary}
                        value={title}
                        onChangeText={e => this.setState({title: e})}
                      />

                      <TextInput
                        style={styles.inputField}
                        placeholder="Description"
                        placeholderTextColor={lightGreyPrimary}
                        value={description}
                        onChangeText={e => this.setState({description: e})}
                      />

                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={this.checkPermission}>
                        <Text
                          style={[basicStyles.text, basicStyles.whiteColor]}>
                          {documentName}
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={[
                          basicStyles.directionRow,
                          basicStyles.alignCenter,
                        ]}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={this.closeButton}>
                          <Text
                            style={[basicStyles.text, basicStyles.whiteColor]}>
                            Cancel
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.updateButton}
                          onPress={this.handleUpdateInfo}>
                          <Text
                            style={[basicStyles.text, basicStyles.whiteColor]}>
                            Update
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </KeyboardAwareScrollView>
                  </View>
                </ScrollView>
              </TouchableWithoutFeedback>
              {this.state.showProcessingLoader && <ProcessingLoader />}
            </RBSheet>
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

const {lightGreyPrimary} = colors;

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
    backgroundColor: '#fff',
  },

  backButtonContainer: {
    marginTop: hp(1),
    marginHorizontal: wp(3),
    alignSelf: 'flex-start',
  },

  backButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icButtonStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
  },

  icDetailList: {
    width: hp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },

  buttonTextStyle: {
    paddingLeft: wp(3),
    color: '#222',
  },
  mainListContainer: {
    // flex: 1,
    margin: wp(2),
    padding: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd7',
    borderRadius: 5,
  },
  headingTextStyle: {
    marginTop: hp(1),
    padding: wp(2),
    fontSize: wp(4),
    color: '#333',
    backgroundColor: '#f2f1f1',
    marginBottom: wp(2),
  },
  listContainer: {
    paddingVertical: wp(0.5),
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoTextStyle: {
    color: lightGreyPrimary,
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },

  informationTextStyle: {
    fontSize: wp(3),
    color: '#333',
  },

  editButton: {
    backgroundColor: '#0077a2',
    margin: wp(2),
    padding: wp(3),
    alignItems: 'center',
  },
  popCon: {
    width: wp(100),
    backgroundColor: '#fff',
    height: hp(100),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: wp(108),
    height: hp(104),
    // left: 0,
    position: 'absolute',
    top: hp(-3),
    left: wp(-9),
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
  },
  popupContainer: {
    padding: 0,
  },
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
    backgroundColor: '#f2f1f1',
    height: hp(5.5),
    alignItems: 'center',
    paddingHorizontal: wp(2),
  },

  closeButton: {
    backgroundColor: '#e14c4e',
    paddingHorizontal: wp(3),
    paddingVertical: wp(2),
    borderRadius: 3,
  },
  inputField: {
    flex: 1,
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
  },
  fromDateFieldContainer: {
    flex: 1,
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    // backgroundColor: '#000',
    marginBottom: wp(3),
    justifyContent: 'center',
  },

  cancelButton: {
    backgroundColor: '#e14c4e',
    flex: 1,
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },

  updateButton: {
    backgroundColor: '#0077a2',
    flex: 1,
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
  pickerInput: {
    fontSize: wp(3),
    width: wp(94),
    marginHorizontal: 0,
    left: wp(-5),
  },
  noDataStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    backgroundColor: '#fff',
    // borderBottomWidth: 0.5,
  },
  noDataTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#444',
    flex: 1,
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
    marginBottom: hp(2),
  },
  iconColumn: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
  },
  downloadIc: {
    // marginRight: wp(2),
    borderWidth: 1.5,
    borderRadius: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#0077a2',
    height: hp(4.2),
    aspectRatio: 1 / 1,
    marginBottom: hp(2.5),
    alignSelf: 'flex-end',
  },
  pendingBtn: {
    paddingVertical: wp(1.5),
    paddingHorizontal: wp(3),
    backgroundColor: '#0077a2',
    fontSize: wp(3),
    color: '#fff',
    borderRadius: 3,
  },
  downIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
});
