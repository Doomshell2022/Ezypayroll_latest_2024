import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  ImagePickerIOS,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
// import * as ImagePicker from 'react-native-image-picker';

// Colors
import {colors} from '../assets/colors/colors';

// Images
import ic_profile_pic from '../assets/icons/ic_profile_pic.png';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
const ProfileComponent = props => {
  const {profile} = props;
  const {firstName, lastName, empId, designation, image} = profile;
  let userImage = ic_profile_pic;
  if (image) {
    userImage = {uri: image};
  }
  return (
    <View style={styles.container}>
      <View style={styles.userLetterContainer}>
        <Image
          source={userImage}
          resizeMode="cover"
          style={styles.profileIcon}
        />
      </View>
      <View style={styles.profileTextContainer}>
        <Text style={styles.profileNameTextStyle}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.profileTextStyle}>{empId}</Text>
        <Text style={styles.profileTextStyle}>{designation}</Text>
      </View>
    </View>
  );
};

export default ProfileComponent;

const {darkGreyPrimary, lightBluePrimary, lightGreyPrimary} = colors;

const styles = StyleSheet.create({
  container: {
    margin: wp(2),
    // alignItems: 'center',
    backgroundColor: '#0077a2',
    padding: wp(3),
    borderRadius: 3,
    flexDirection: 'row',
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

  userLetter: {
    color: '#0077a2',
  },

  profileTextContainer: {
    flex: 1,
  },

  profileIcon: {
    height: wp(14),
    width: wp(14),
    aspectRatio: 1 / 1,
    // marginLeft: wp(2),
  },

  profileNameTextStyle: {
    fontSize: wp(4),
    color: '#fff',
    fontWeight: '700',
  },

  profileTextStyle: {
    fontSize: wp(3.5),
    color: '#fff',
  },
});
