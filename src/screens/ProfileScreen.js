import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';
// Colors
import {colors} from '../assets/colors/colors';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import ProfileComponent from '../components/ProfileComponent';

import CustomLoader from '../components/CustomLoader';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
// Icons
import ic_settings from '../assets/icons/ic_settings.png';
import ic_personal_detail from '../assets/icons/ic_personal_detail.png';
import ic_office_detail from '../assets/icons/ic_office_detail.png';
import ic_address_info from '../assets/icons/ic_address_info.png';
import ic_text from '../assets/icons/ic_text.png';
import ic_family_info from '../assets/icons/ic_family_info.png';
import ic_aditional_info from '../assets/icons/ic_aditional_info.png';
import ic_bank_info from '../assets/icons/ic_bank_info.png';
import ic_employment_history from '../assets/icons/ic_employment_history.png';
import ic_drivers_license from '../assets/icons/ic_drivers_license.png';
import ic_documents from '../assets/icons/ic_documents.png';
import ic_education from '../assets/icons/ic_education.png';
import ic_skills from '../assets/icons/ic_skills.png';
import ic_certificate from '../assets/icons/ic_certificate.png';
import ic_user_info from '../assets/icons/ic_user_info.png';
import ic_leave_ifo from '../assets/icons/ic_leave_ifo.png';

// import * as ImagePicker from 'react-native-image-picker';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import ic_profile_pic from '../assets/icons/ic_profile_pic.png';

// User Preference
import {KEYS, getData} from '../api/UserPreference';
import basicStyles from '../styles/BasicStyles';
import FastImage from 'react-native-fast-image';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      profile: null,
      connectionState: true,
      userPic: '',
      userImage: '',
      userImageName: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.setState({
      userName: '',
      emailId: '',
      mobileNumber: '',
      isLoading: true,
      showProcessingLoader: false,
      fName: '',
      lName: '',

      registeredOn: '29-09-2022 11:35 AM',
      dob: '23-10-1994',
      gender: '',
      value: '',
      EmailRelatedEvents: '',
      initialEmailRelatedEvents: '',
      EmailNewsletter: '',
      initialEmailNewsletter: '',
      isVerified: false,
      userPic: '',
      userImage: '',
      userImageName: '',
      ismobverify: '',
      dateOfBirth: 'Select DOB',
      isDatePickerVisible: false,
    });
    this.fetchUserProfile();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  // * Camera Permission
  // checkPermission = async () => {
  //   try {
  //     // const {userPic} = this.state;
  //     // console.log('111111', userPic);

  //     const platformPermission = Platform.select({
  //       android: PERMISSIONS.ANDROID.CAMERA,
  //       ios: PERMISSIONS.IOS.CAMERA,
  //     });
  //     const result = await check(platformPermission);
  //     switch (result) {
  //       case RESULTS.UNAVAILABLE:
  //         console.log(
  //           'This feature is not available (on this device / in this context)',
  //         );
  //         break;
  //       case RESULTS.DENIED:
  //         // console.log(
  //         //   'The permission has not been requested / is denied but requestable',
  //         // );
  //         const requestResult = await request(platformPermission);
  //         switch (requestResult) {
  //           case RESULTS.GRANTED:
  //             this.handleCamera();
  //         }
  //         break;
  //       case RESULTS.GRANTED:
  //         console.log('The permission is granted');
  //         this.handleCamera();
  //         break;
  //       case RESULTS.BLOCKED:
  //         console.log('The permission is denied and not requestable anymore');
  //         Alert.alert(
  //           'Permission Blocked',
  //           'Press OK and provide "Camera" permission in App Setting',
  //           [
  //             {
  //               text: 'Cancel',
  //               style: 'cancel',
  //             },
  //             {
  //               text: 'OK',
  //               onPress: this.handleOpenSettings,
  //             },
  //           ],
  //           {cancelable: false},
  //         );
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  // //*CAMERA
  // handleCamera = () => {
  //   console.log('camera perss');
  //   const option = {
  //     skipBackup: true,
  //     includeBase64: true,
  //     mediaType: 'photo',
  //     quality: 0.4,
  //     maxWidth: 250,
  //     maxHeight: 250,
  //   };
  //   ImagePicker.launchImageLibrary(option, response => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //     } else {
  //       if (Platform.OS === 'android') {
  //         const imageData = {
  //           size: response.assets[0].fileSize,
  //           type: response.assets[0].type,
  //           name: response.assets[0].fileName,
  //           fileCopyUri: response.assets[0].uri,
  //           uri: response.assets[0].uri,
  //         };
  //         console.log('+++++', imageData);
  //         this.setState({
  //           userPic: imageData,
  //           userImage: response.assets[0].uri,
  //           userImageName: response.assets[0].fileName,
  //         });
  //       } else if (Platform.OS === 'ios') {
  //         let imgName = response.name;
  //         if (typeof fileName === 'undefined') {
  //           const {uri} = response;
  //           // on iOS, using camera returns undefined fileName. This fixes that issue, so API can work.
  //           var getFilename = uri.split('/');
  //           console.log('___*_**_*_*_*_*_*_*', getFilename);
  //           imgName = getFilename[getFilename.length - 1];
  //         }
  //         const imageData = {
  //           size: response.fileSize,
  //           type: response.type,
  //           name: imgName,
  //           fileCopyUri: response.uri,
  //           uri: response.uri,
  //         };
  //         console.log({
  //           userPic: imageData,
  //           userImage: response.uri,
  //           userImageName: imgName,
  //         });
  //       }
  //     }
  //   });
  // };
  handlePermission = async () => {
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
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
              this.handleImagePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleImagePick();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Location" permission in App Setting',
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

  handleImagePick = async () => {
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
        extension === 'png' ||
        extension === '.jpeg';

      if (isFileAllowed) {
        this.setState({
          userPic: response,
          userImage: response.uri,
          imageName: name,
        });
      } else {
        alert(`.${extension} file not allowed`);
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };
  fetchUserProfile = async () => {
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
        const response = await makeRequest(BASE_URL + 'userProfile', params);
        if (response) {
          const {success} = response;

          if (success) {
            const {output: profile} = response;
            const {image} = profile;
            console.log('&&&&&&&&', image);
            this.setState({
              userImage: image,
            });
            this.setState({profile, isLoading: false, isRefreshing: false});
          } else {
            this.setState({isLoading: false, isRefreshing: false});
          }
        } else {
          this.setState({isLoading: false, isRefreshing: false});
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handlePersonalDetails = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('Personal', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleOfficeDetails = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('Office', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleAddressInfoDetails = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('AddressInfo', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleSalaryDetails = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('Salary', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handlePfDetails = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('Provident', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleFamilyInfo = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('FamilyInfo', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleAdditionalInfo = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('AdditionalInfo', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleBankInfo = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('BankInfo', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleEmploymentHistory = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('EmploymentHistory', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleLicenseInformation = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('LicenseInformation', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleDocumentInfo = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('DocumentInfo', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleEducationformation = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('Educationformation', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleSkillsInformation = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('SkillsInformation', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleCertificationInfo = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('CertificationInfo', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleUserInfo = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('UserInfo', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleLeaveInfo = () => {
    const {profile} = this.state;
    this.props.navigation.navigate('LeaveInfo', {
      profile,
      handleRefresh: this.fetchUserProfile,
    });
  };

  handleSettings = () => {
    this.props.navigation.navigate('OldPin');
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
  onSaveClick = async props => {
    // console.log('on save click');
    try {
      const {userPic} = this.state;
      // starting loader

      // calling api
      const userInfo = await getData(KEYS.USER_INFO);
      const {image, user} = userInfo;
      const {id: userId} = user;

      const params = {
        userId,
        image: userPic,
      };

      const response = await makeRequest(BASE_URL + 'updateProImage', params);
      if (response.success) {
        this.setState({showProcessingLoader: true});

        // stopping loader
        Alert.alert('', response.message);
        props.navigation.goBack();
        this.setState({showProcessingLoader: false, isLoading: false});
      } else {
        Alert.alert('', response.status);

        this.setState({showProcessingLoader: false, isLoading: false});
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {profile} = this.state;
    const {firstName, lastName, empId, designation, image} = profile;
    const basicProfileDetail = {firstName, lastName, empId, designation, image};

    let settingStyle = {};

    if (Platform.OS === 'android') {
      settingStyle = styles.settingButton;
    } else {
      settingStyle = styles.settingButton2;
    }
    let Imagee = ic_profile_pic;
    if (image) {
      Imagee = {uri: image};
    }
    // const {profile} = props;
    // const {firstName, lastName, empId, designation, image} = profile;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            {/* <ProfileComponent profile={basicProfileDetail} /> */}

            <HeadersComponent nav={this.props.navigation} title="My Profile" />
            <View style={styles.container2}>
              <View style={{flexDirection: 'row'}}>
                <View style={{}}>
                  <View style={styles.userLetterContainer}>
                    {this.state.userImage ? (
                      <FastImage
                        style={styles.profileImage}
                        source={{
                          uri: this.state.userImage,
                          headers: {Authorization: 'someAuthToken'},
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    ) : (
                      <Image source={Imagee} style={styles.profileIcon2} />
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={this.onSaveClick}
                    style={{
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      marginTop: wp(1),
                      padding: wp(1),
                      borderRadius: 5,
                      width: wp(12),
                      alignSelf: 'flex-start',
                      marginLeft: wp(1.5),
                    }}>
                    <Text style={{fontSize: wp(2.5), color: '#333'}}>
                      Update
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{
                    marginLeft: wp(-7),
                    marginTop: wp(9),
                    backgroundColor: '#fff',
                    borderRadius: wp(5),
                    height: wp(5),
                    width: wp(5),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  // onPress={() => {
                  //   Platform.OS === 'android'
                  //     ? this.checkPermission()
                  //     : this.props.navigation.navigate('UpdateUserPhoto');
                  // }}
                  onPress={this.handleImagePick}>
                  <Image
                    source={require('../assets/icons/pencil.png')}
                    style={{
                      height: wp(2.5),
                      aspectRatio: 1 / 1,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileNameTextStyle}>
                  {firstName} {lastName}
                </Text>
                <Text style={styles.profileTextStyle}>{empId}</Text>
                <Text style={styles.profileTextStyle}>{designation}</Text>
              </View>
              <View style={settingStyle}>
                <TouchableOpacity
                  onPress={this.handleSettings}
                  underlayColor="transparent">
                  <Text style={basicStyles.text}>Change Pin</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.mainListContainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.handleListRefresh}
                  />
                }>
                {/* 1 */}
                <TouchableOpacity
                  onPress={this.handleUserInfo}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_user_info}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>Personal Info.</Text>
                  </View>
                </TouchableOpacity>

                {/* <View style={styles.listContainer}>
                  <Image
                    source={ic_personal_detail}
                    resizeMode="cover"
                    style={styles.buttonStyle}
                  />
                  <TouchableOpacity
                    onPress={this.handlePersonalDetails}
                    underlayColor="transparent">
                    <Text style={styles.headingTextStyle}>Personal Info.</Text>
                  </TouchableOpacity>
                </View> */}

                {/*
            <View style={styles.listContainer}>
              <Image
                source={ic_office_detail}
                resizeMode="cover"
                style={styles.buttonStyle}
              />
              <TouchableOpacity
                onPress={this.handleOfficeDetails}
                underlayColor="transparent">
                <Text style={styles.headingTextStyle}>Office Details</Text>
              </TouchableOpacity>
            </View> */}

                {/* 2 */}
                <TouchableOpacity
                  onPress={this.handleAddressInfoDetails}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_address_info}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>Address Info.</Text>
                  </View>
                </TouchableOpacity>

                {/* 3 */}
                <TouchableOpacity
                  onPress={this.handleSalaryDetails}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_text}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>Salary Detail</Text>
                  </View>
                </TouchableOpacity>

                {/* 4 */}
                <TouchableOpacity
                  onPress={this.handlePfDetails}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_text}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>
                      PF/ESI/Tax Info.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* 5 */}
                <TouchableOpacity
                  onPress={this.handleFamilyInfo}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_family_info}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>Family Info.</Text>
                  </View>
                </TouchableOpacity>

                {/* 6 */}
                <TouchableOpacity
                  onPress={this.handleAdditionalInfo}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_aditional_info}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>
                      Additional Info.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* 7 */}
                <TouchableOpacity
                  onPress={this.handleBankInfo}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_bank_info}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>Bank Info.</Text>
                  </View>
                </TouchableOpacity>

                {/* 8 */}
                <TouchableOpacity
                  onPress={this.handleEmploymentHistory}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_employment_history}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>
                      Employment History
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* 9 */}
                <TouchableOpacity
                  onPress={this.handleLicenseInformation}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_drivers_license}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />
                    <Text style={styles.headingTextStyle}>License Info.</Text>
                  </View>
                </TouchableOpacity>

                {/* 10 */}
                <TouchableOpacity
                  onPress={this.handleDocumentInfo}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_documents}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>
                      Documents Detail
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* 11 */}
                <TouchableOpacity
                  onPress={this.handleEducationformation}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_education}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>Education Info.</Text>
                  </View>
                </TouchableOpacity>

                {/* 12 */}
                <TouchableOpacity
                  onPress={this.handleSkillsInformation}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_skills}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>Skills Info.</Text>
                  </View>
                </TouchableOpacity>

                {/* 13 */}
                <TouchableOpacity
                  onPress={this.handleCertificationInfo}
                  underlayColor="transparent">
                  <View style={styles.listContainer}>
                    <Image
                      source={ic_certificate}
                      resizeMode="cover"
                      style={styles.buttonStyle}
                    />

                    <Text style={styles.headingTextStyle}>Certifications</Text>
                  </View>
                </TouchableOpacity>

                {/* <View style={styles.listContainer}>
              <Image
                source={ic_leave_ifo}
                resizeMode="cover"
                style={styles.buttonStyle}
              />
              <TouchableOpacity
                onPress={this.handleLeaveInfo}
                underlayColor="transparent">
                <Text style={styles.headingTextStyle}>Leave Info.</Text>
              </TouchableOpacity>
            </View> */}
              </ScrollView>
            </View>
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

const {lightBluePrimary, lightGreyPrimary} = colors;

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
  userLetterContainer: {
    backgroundColor: '#fff',
    height: wp(14),
    width: wp(14),
    borderRadius: wp(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
    overflow: 'hidden',
  },
  profileIcon: {
    height: wp(14),
    width: wp(14),
    aspectRatio: 1 / 1,
    // marginLeft: wp(2),
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  mainListContainer: {
    flex: 1,
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: wp(3),
  },

  profileIcon2: {
    height: wp(14),
    width: wp(14),
    aspectRatio: 1 / 1,
    // marginLeft: wp(2),
  },
  listContainer: {
    padding: wp(3),
    backgroundColor: '#fff',
    // marginBottom: wp(2),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc8',
    borderBottomWidth: 1,
  },
  profileImage: {
    width: widthPercentageToDP(20),
    aspectRatio: 1 / 1,
    borderRadius: 50,
  },

  headingTextStyle: {
    fontSize: wp(3.5),
    color: '#333',
    fontWeight: '700',
  },

  infoTextStyle: {
    fontSize: wp(3),
    color: lightGreyPrimary,
  },

  settingButton: {
    // position: 'absolute',
    // alignSelf: 'flex-end',
    marginTop: hp(2),
    backgroundColor: '#fff',
    padding: wp(2),
    // right: wp(6),
    top: wp(1),
    borderRadius: 4,
  },

  settingButton2: {
    // position: 'absolute',
    // alignSelf: 'flex-end',
    marginTop: hp(2),
    backgroundColor: '#fff',
    padding: wp(2),
    // right: wp(6),
    top: wp(1),
    borderRadius: 4,
  },

  buttonStyle: {
    width: wp(7),
    marginRight: wp(3),
    aspectRatio: 1 / 1,
  },

  // settingButtonIcon: {
  //   height: wp(6),
  //   marginRight: wp(3),
  //   aspectRatio: 1 / 1,
  // },
  profileNameTextStyle: {
    fontSize: wp(4),
    color: '#fff',
    fontWeight: '700',
  },

  profileTextStyle: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  container2: {
    margin: wp(2),
    // alignItems: 'center',
    backgroundColor: '#0077a2',
    padding: wp(3),
    borderRadius: 3,
    flexDirection: 'row',
    // alignItems: 'center',
    alignItems: 'flex-start',
  },
});
