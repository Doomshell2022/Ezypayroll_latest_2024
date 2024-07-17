import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
  Platform,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Permission
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

// Native Components
// import ImagePicker from 'react-native-image-picker';
import SafeAreaView from 'react-native-safe-area-view';
import DocumentPicker from 'react-native-document-picker';

// Components
import HeadersComponent from '../../components/HeadersComponent';
import Footer from '../../components/Footer';
import {showToast} from '../../components/ToastComponent';
import CustomLoader from '../../components/CustomLoader';
import ProcessingLoader from '../../components/ProcessingLoader';

// Bottom Modal
import RBSheet from 'react-native-raw-bottom-sheet';
import Modal, {ModalContent, BottomModal} from 'react-native-modals';

// Styles
import BasicStyles from '../../styles/BasicStyles';

// Icons

import ic_edit from '../../assets/icons/ic_edit.png';
import your_story from '../../assets/images/your_story.png';

// Styles
import basicStyles from '../../styles/BasicStyles';

//UserPreference
import {clearData, getData, KEYS} from '../../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../../assets/icons/internetConnectionState.gif';

export default class AdminProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isProcessing: false,
      userInfo: '',
      isListRefreshing: false,
      userImage: null,
      userPic: '',
      name: '',
      email: '',
      id: '',
      mobile: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      connectionState: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchUserProfile();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
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

        const response = await makeRequest(
          BASE_URL + 'adminViewProfile',
          params,
        );

        if (response) {
          const {success} = response;

          if (success) {
            const {data} = response;
            const {id, name, email, mobile, image} = data;

            this.setState({
              id,
              name,
              email,
              mobile,
              userImage: image,
              status: null,
              isLoading: false,
              isRefreshing: false,
            });
          } else {
            const {message} = response;

            this.setState({
              status: message,

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

  handleUpdateProfile = async () => {
    const {oldPassword, newPassword, userPic, confirmPassword, email} =
      this.state;

    if (newPassword.length > 0 || confirmPassword.length > 0) {
      if (oldPassword.trim() === '') {
        Alert.alert('Alert!', 'Please enter old password', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }

      if (newPassword.trim() === '') {
        Alert.alert('Alert!', 'Please enter new password', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }

      if (confirmPassword.trim() === '') {
        Alert.alert(
          'Alert!',
          'Please re-enter password to confirm',
          [{text: 'OK'}],
          {
            cancelable: false,
          },
        );
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Alert!', 'Password do not match', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }
    }

    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;

        this.closePopup();

        this.setState({isProcessing: true});

        // preparing params
        const params = {
          ezypayrollId,
          userId,
          password: oldPassword,
          newPassword,
          image: userPic,
          email,
        };

        const response = await makeRequest(BASE_URL + 'editProfile', params);

        this.setState({
          oldPassword: '',
          newPassword: '',
          userPic: '',
          confirmPassword: '',
        });

        if (response) {
          const {success, message} = response;

          this.setState({
            isLoading: false,
            isProcessing: false,
            isRefreshing: false,
          });

          if (success) {
            Alert.alert('Alert!', message, [{text: 'OK'}], {
              cancelable: false,
            });

            await this.fetchUserProfile();
          } else {
            Alert.alert('Alert!', message, [{text: 'OK'}], {
              cancelable: false,
            });
            this.setState({
              status: message,
            });
          }
        } else {
          showToast('Network Request Error...');
          this.setState({
            isProcessing: false,
            isLoading: false,
            isRefreshing: false,
          });
        }
      }
    } catch (error) {
      this.setState({
        isProcessing: false,
        isLoading: false,
        isRefreshing: false,
      });
      console.log(error.message);
    }
  };

  onLogoutYesPress = async () => {
    try {
      // Clearing user preferences from local storage
      await clearData();

      // Resetting Navigation to initial state for login again
      this.props.navigation.navigate('LoggedOut');

      showToast('Logged Out');
    } catch (error) {
      console.log(error.message);
    }
  };

  handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure, you want to logout?',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: this.onLogoutYesPress},
      ],
      {
        cancelable: false,
      },
    );
  };

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };

  handleMoreInfo = () => {
    this.setState({editProfilePopup: true});
  };

  closePopup = () => {
    this.setState({editProfilePopup: false});
  };

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
        extension === 'png';

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
  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('Unable to open App Settings:', error);
    }
  };
  // handleImagePick = async () => {
  //   try {
  //     ImagePicker.showImagePicker(
  //       {
  //         noData: true,
  //         mediaType: 'photo',
  //         maxWidth: 500,
  //         maxHeight: 500,
  //         quality: 0.5,
  //       },
  //       (response) => {
  //         if (response.didCancel) {
  //           console.log('User cancelled image picker');
  //         } else if (response.error) {
  //           console.log('ImagePicker Error: ', response.error);
  //         } else if (response.customButton) {
  //           console.log('User tapped custom button: ', response.customButton);
  //         } else {
  //           if (Platform.OS === 'android') {
  //             const imageData = {
  //               size: response.fileSize,
  //               type: response.type,
  //               name: response.fileName,
  //               fileCopyUri: response.uri,
  //               uri: response.uri,
  //             };

  //             this.setState(
  //               {
  //                 userPic: imageData,
  //                 userImage: response.uri,
  //                 userImageName: response.fileName,
  //               },
  //               async () => {
  //                 await this.handleUpdateProfile();
  //               },
  //             );
  //           } else if (Platform.OS === 'ios') {
  //             let imgName = response.name;

  //             if (typeof fileName === 'undefined') {
  //               const {uri} = response;
  //               // on iOS, using camera returns undefined fileName. This fixes that issue, so API can work.
  //               var getFilename = uri.split('/');
  //               imgName = getFilename[getFilename.length - 1];
  //             }

  //             const imageData = {
  //               size: response.fileSize,
  //               type: response.type,
  //               name: imgName,
  //               fileCopyUri: response.uri,
  //               uri: response.uri,
  //             };

  //             this.setState(
  //               {
  //                 userPic: imageData,
  //                 userImage: response.uri,
  //                 userImageName: imgName,
  //               },
  //               async () => {
  //                 await this.handleUpdateProfile();
  //               },
  //             );
  //           }
  //         }
  //       },
  //     );
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {userImage, name, mobile, email} = this.state;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              title="Profile"
              // navAction="HomeBack"
              nav={this.props.navigation}
              // showNotification
              // notificationCount={notificationCount}
            />
            <View
              style={[BasicStyles.container, basicStyles.whiteBackgroundColor]}>
              <View style={styles.profileContainer}>
                {userImage !== null ? (
                  <View style={styles.profileView}>
                    <Image
                      source={{uri: userImage}}
                      resizeMode="cover"
                      style={styles.userImage}
                    />
                    {/* </LinearGradient> */}
                  </View>
                ) : (
                  <View style={styles.profileView}>
                    <Image
                      source={your_story}
                      resizeMode="cover"
                      style={styles.userImage}
                    />
                  </View>
                )}

                <Text style={[basicStyles.heading, basicStyles.paddingTop]}>
                  {name}
                </Text>

                <TouchableOpacity
                  style={styles.editProfileButton}
                  onPress={this.handleMoreInfo}>
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    Edit Profile
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    height: wp(0.2),
                    width: wp(96),
                    marginVertical: hp(4),
                    backgroundColor: '#555',
                  }}
                />

                <View style={styles.infoContainer}>
                  <Text style={styles.headText}>Name</Text>
                  <Text style={styles.midText}>-</Text>
                  <Text style={styles.infoText}>{name}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.headText}>Email</Text>
                  <Text style={styles.midText}>-</Text>
                  <Text style={styles.infoText}>{email}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.headText}>Mobile</Text>
                  <Text style={styles.midText}>-</Text>
                  <Text style={styles.infoText}>
                    {mobile === null || mobile === '' ? 'N/A' : mobile}
                  </Text>
                </View>
              </View>

              {/* <TouchableOpacity
            onPress={this.handleLogout}
            style={styles.logOutStyle}>
            <Text style={[basicStyles.text, basicStyles.whiteColor]}>
              Logout
            </Text>
          </TouchableOpacity> */}
            </View>

            <BottomModal
              visible={this.state.editProfilePopup}
              onTouchOutside={() =>
                this.setState({
                  editProfilePopup: false,
                  oldPassword: '',
                  newPassword: '',
                  userPic: '',
                  confirmPassword: '',
                })
              }
              // modalStyle={{  }}
            >
              <ModalContent
                style={{
                  // flex: 1,
                  // backgroundColor: 'fff',
                  minHeight: hp(30),
                }}>
                <View style={styles.popupContainer}>
                  <ScrollView>
                    <View style={styles.profileViews}>
                      {userImage !== null ? (
                        <View
                          // onPress={this.handleProfile}
                          style={styles.profileView}>
                          <Image
                            source={{uri: userImage}}
                            resizeMode="cover"
                            style={styles.userImage}
                          />
                          {/* </LinearGradient> */}
                        </View>
                      ) : (
                        <View
                          onPress={this.handleProfile}
                          style={[
                            styles.profileView,
                            basicStyles.marginTopHalf,
                          ]}>
                          <Image
                            source={your_story}
                            resizeMode="cover"
                            style={[styles.userImage]}
                          />
                        </View>
                      )}

                      <TouchableOpacity
                        style={styles.halfCircle}
                        onPress={this.handleImagePick}>
                        <Image
                          source={ic_edit}
                          resizeMode="cover"
                          style={styles.editIcon}
                        />
                      </TouchableOpacity>
                    </View>

                    <View>
                      <Text>Old Password</Text>
                      <TextInput
                        placeholder="Enter Old Password"
                        placeholderTextColor="#333"
                        style={styles.input}
                        secureTextEntry={true}
                        value={this.state.oldPassword}
                        onChangeText={e => this.setState({oldPassword: e})}
                      />
                    </View>

                    <View>
                      <Text>New Password</Text>
                      <TextInput
                        placeholder="Enter New Password"
                        placeholderTextColor="#333"
                        secureTextEntry={true}
                        style={styles.input}
                        value={this.state.newPassword}
                        onChangeText={e => this.setState({newPassword: e})}
                      />
                    </View>

                    <View>
                      <Text>Confirm Password</Text>
                      <TextInput
                        placeholder="Re-Enter Password"
                        placeholderTextColor="#333"
                        secureTextEntry={true}
                        style={styles.input}
                        value={this.state.confirmPassword}
                        onChangeText={e => this.setState({confirmPassword: e})}
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.submitStyle}
                      onPress={this.handleUpdateProfile}>
                      <Text
                        style={[basicStyles.heading, basicStyles.whiteColor]}>
                        Save Changes
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </ModalContent>
            </BottomModal>
            {/* <Footer tab="Profile" nav={this.props.navigation} /> */}
          </>
        )}
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
        {this.state.isProcessing && <ProcessingLoader />}
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
  paymentList: {
    padding: wp(3),
    margin: wp(2),
    marginBottom: wp(0),
  },
  dot: {
    backgroundColor: '#333',
    height: 5,
    width: 5,
    borderRadius: 2.5,
    marginHorizontal: wp(2),
  },
  userImageGradient: {
    height: hp(15.7),
    borderRadius: wp(19),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileView: {
    borderRadius: hp(8.5),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: '#888',
    padding: wp(0.5),
  },
  userImage: {
    height: hp(15),
    borderRadius: hp(7.5),
    aspectRatio: 1 / 1,
  },
  profileContainer: {
    flex: 1,
    paddingBottom: wp(5),
    paddingTop: hp(5),
    alignItems: 'center',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  icon: {
    width: wp(3),
    aspectRatio: 1 / 1,
  },

  editProfileButton: {
    alignSelf: 'flex-end',
    marginHorizontal: wp(3),
    padding: wp(1.5),
    backgroundColor: '#444',
    elevation: 5,
    marginBottom: hp(-3),
  },

  profileViews: {
    height: wp(28),
    width: wp(28),
    borderRadius: wp(14),
    alignSelf: 'center',
    // borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },

  userImages: {
    height: wp(25),
    width: wp(25),
    borderRadius: wp(12.5),
  },
  halfCircle: {
    backgroundColor: '#3339',
    height: wp(15),
    width: wp(28.9),
    position: 'absolute',
    bottom: wp(-1.3),
    borderBottomLeftRadius: wp(15),
    borderBottomRightRadius: wp(15),
    // left: wp(-0.),
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
    alignSelf: 'center',
  },
  input: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    height: hp(5.5),
    fontSize: wp(3.5),
    marginTop: wp(2),
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginBottom: hp(2),
    backgroundColor: '#ccc4',
  },
  inputBig: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    height: hp(10),
    fontSize: wp(3.5),
    marginTop: wp(2),
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginBottom: hp(2),
    textAlignVertical: 'top',
    backgroundColor: '#ccc4',
  },
  logOutStyle: {
    backgroundColor: '#0077a2',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: wp(10),
    marginBottom: hp(10),
  },
  submitStyle: {
    backgroundColor: '#0077a2',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: wp(10),
    // marginBottom: wp(2),
  },
  infoContainer: {
    width: wp(95),
    marginHorizontal: wp(2),
    marginBottom: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#fff',
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(5.5),
  },
  headText: {
    flex: 0.5,
    fontSize: wp(3.2),
    color: '#555',
    fontWeight: '700',
    marginLeft: wp(4),
  },
  midText: {
    flex: 0.5,
    fontSize: wp(3.5),
    color: '#555',

    fontWeight: '700',
  },
  infoText: {
    flex: 1.8,
    fontSize: wp(3.2),
    color: '#333',
    marginRight: wp(2),
    fontWeight: '700',
  },
});
