// import React from 'react';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Button,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from 'react-native-safe-area-view';
import DateTimePicker from '../components/DateTimePicker';

// import Modal from 'react-native-modal';
import Modal, {ModalContent, BottomModal} from 'react-native-modals';

// Colors
import {colors} from '../assets/colors/colors';

// Styles
import basicStyles from '../styles/BasicStyles';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import ProfileComponent from '../components/ProfileComponent';
import CustomLoader from '../components/CustomLoader';

// Icons
// import ic_back from '../assets/icons/ic_back.png';

const PersonalDetailsScreen = props => {
  const {navigation} = props;
  const profile = navigation.getParam('profile', null);

  const [editProfilePopup, setEditProfilePopup, calendarPopup] =
    useState(false);

  if (!profile) {
    return <CustomLoader />;
  }

  const {
    firstName,
    lastName,
    empId,
    designation,
    image,
    department,
    officialDetails,
  } = profile;
  const basicProfileDetail = {firstName, lastName, empId, designation, image};

  const {mobile, dateOfJoining, email, jobType} = officialDetails;

  const handleBackButton = () => {
    navigation.pop();
  };

  const handleMoreInfo = () => {
    setEditProfilePopup(!editProfilePopup);
  };

  const closeButton = () => {
    setEditProfilePopup(false);
  };

  const handleFromDateChange = fromDate => {
    calendarPopup({fromDate});
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeadersComponent
        nav={navigation}
        title="Office Detail"
        navAction="back"
      />

      <ProfileComponent profile={basicProfileDetail} />

      <View style={styles.mainListContainer}>
        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>
            Joining Date
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
            {dateOfJoining ? dateOfJoining : 'N/A'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>
            Official Email
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
            {email ? email : 'N/A'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>
            Mobile No.
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
            {mobile ? mobile : 'N/A'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>
            Designation
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
            {designation ? designation : 'N/A'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>
            Department
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
            {department ? department : 'N/A'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>
            Job Type
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
            {jobType ? jobType : 'N/A'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleMoreInfo}>
        <Text style={[basicStyles.heading, basicStyles.whiteColor]}>Edit</Text>
      </TouchableOpacity>

      {/* <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text>Hello!</Text>
          <Button title="Hide modal" onPress={toggleModal} />
        </View>
      </Modal> */}

      <BottomModal
        visible={editProfilePopup}
        onTouchOutside={closeButton}
        modalStyle={{borderRadius: 5}}>
        <ModalContent
          style={{
            // flex: 1,
            // backgroundColor: 'fff',
            height: hp(100),
          }}>
          <View style={styles.popupContainer}>
            <View style={styles.editContainer}>
              <Text style={basicStyles.heading}>Official Details</Text>

              <TouchableOpacity
                onPress={closeButton}
                style={styles.closeButton}>
                <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>

            <KeyboardAwareScrollView
              contentContainerStyle={styles.loginScreenContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScroll
              Indicator={false}
              enableOnAndroid>
              <Text
                style={[basicStyles.textSmall, basicStyles.marginBottomHalf]}>
                Joining Date
              </Text>
              <View style={styles.fromDateFieldContainer}>
                <DateTimePicker onDateChange={handleFromDateChange} />
              </View>

              <Text
                style={[basicStyles.textSmall, basicStyles.marginBottomHalf]}>
                Official Email
              </Text>
              <TextInput
                style={styles.inputField}
                placeholder="ritesh@doomshell.com"
                placeholderTextColor={lightGreyPrimary}
              />

              <Text
                style={[basicStyles.textSmall, basicStyles.marginBottomHalf]}>
                Mobile No.
              </Text>
              <TextInput
                style={styles.inputField}
                placeholder="9694401207"
                placeholderTextColor={lightGreyPrimary}
              />

              <Text
                style={[basicStyles.textSmall, basicStyles.marginBottomHalf]}>
                Designation
              </Text>
              <TextInput
                style={styles.inputField}
                placeholder="Front End Developer"
                placeholderTextColor={lightGreyPrimary}
              />

              <Text
                style={[basicStyles.textSmall, basicStyles.marginBottomHalf]}>
                Department
              </Text>
              <TextInput
                style={styles.inputField}
                placeholder="Doomshell"
                placeholderTextColor={lightGreyPrimary}
              />

              <Text
                style={[basicStyles.textSmall, basicStyles.marginBottomHalf]}>
                Job Type
              </Text>
              <TextInput
                style={styles.inputField}
                placeholder="Graphic & Web Design"
                placeholderTextColor={lightGreyPrimary}
              />

              <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeButton}>
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.updateButton}>
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </ModalContent>
      </BottomModal>
    </SafeAreaView>
  );
};

export default PersonalDetailsScreen;

const {lightGreyPrimary} = colors;

const styles = StyleSheet.create({
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
    flex: 1,
    padding: wp(3),
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
    paddingVertical: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
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
});
