import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//img
import ad_ic_home_active from '../assets/icons/ad_ic_home_active.png';
import ad_ic_home from '../assets/icons/ad_ic_home.png';
import ad_ic_leaves_active from '../assets/icons/ad_ic_leaves_active.png';
import ad_ic_leaves from '../assets/icons/ad_ic_leaves.png';
import ad_ic_attendance_active from '../assets/icons/ad_ic_attendance_active.png';
import ad_ic_attendance from '../assets/icons/ad_ic_attendance.png';
import ad_ic_hr_active from '../assets/icons/ad_ic_hr_active.png';
import ad_ic_hr from '../assets/icons/ad_ic_hr.png';
import ad_ic_profile_active from '../assets/icons/ad_ic_profile_active.png';
import ad_ic_profile from '../assets/icons/ad_ic_profile.png';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleHome = () => {
    this.props.nav.navigate('AdminHome');
  };

  handleLeaves = () => {
    this.props.nav.navigate('AdminLeaves');
  };
  handleAttendance = () => {
    this.props.nav.navigate('AdminAttendance');
  };

  handleHrRequests = () => {
    this.props.nav.navigate('AdminHrRequests');
  };

  handleProfile = () => {
    this.props.nav.navigate('AdminProfile');
  };

  render() {
    const {tab} = this.props;
    const activeStyle = [styles.footerMenu];
    const activeStyles = [styles.footerMenus];
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={tab === 'Home' ? activeStyle : styles.footerMenu}
          onPress={this.handleHome}>
          <Image
            source={tab === 'Home' ? ad_ic_home_active : ad_ic_home}
            style={styles.Hicons}
          />
          <Text style={tab === 'Home' ? activeStyles : styles.footerMenu}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.handleLeaves}
          // style={styles.buttonHome}
          style={tab === 'Leaves' ? activeStyle : styles.footerMenu}>
          <Image
            source={tab === 'Leaves' ? ad_ic_leaves_active : ad_ic_leaves}
            style={styles.Hicons}
          />
          <Text style={tab === 'Leaves' ? activeStyles : styles.footerMenu}>
            Leaves
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.handleAttendance}
          // style={styles.buttonHome}
          style={tab === 'Attendance' ? activeStyle : styles.footerMenu}>
          <Image
            source={
              tab === 'Attendance' ? ad_ic_attendance_active : ad_ic_attendance
            }
            style={styles.Hicons}
          />
          <Text style={tab === 'Attendance' ? activeStyles : styles.footerMenu}>
            Attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tab === 'HR' ? activeStyle : styles.footerMenu}
          onPress={this.handleHrRequests}>
          <Image
            source={tab === 'HR' ? ad_ic_hr_active : ad_ic_hr}
            style={styles.Hicons}
          />
          <Text style={tab === 'HR' ? activeStyles : styles.footerMenu}>
            HR Request
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.handleProfile}
          // style={styles.buttonHome}
          style={tab === 'Profile' ? activeStyle : styles.footerMenu}>
          <Image
            source={tab === 'Profile' ? ad_ic_profile_active : ad_ic_profile}
            style={styles.Hicons}
          />
          <Text style={tab === 'Profile' ? activeStyles : styles.footerMenu}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: wp(3),
    elevation: 10,
    padding: wp(1.8),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: wp(1),
    // height: hp(7),
  },
  buttonHome: {
    alignItems: 'center',
  },
  Hicons: {
    height: hp(3.2),
    aspectRatio: 1 / 1,
  },
  homeText: {
    fontSize: wp(2.8),
    marginTop: wp(0.1),
    fontWeight: '700',
    color: '#a6a6a6',
  },
  buttonHomeOne: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(-3.9),
  },
  HiconsOne: {
    backgroundColor: '#0077a2',
    height: wp(11),
    width: wp(11),
    borderRadius: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  HiconsOneT: {
    aspectRatio: 1 / 1,
    height: hp(3),
  },
  homeTextOne: {
    fontSize: wp(3),
    marginTop: wp(3.6),
    fontWeight: '700',
    color: '#a6a6a6',
  },
  footerMenu: {
    // flex: 1,
    alignItems: 'center',
    fontSize: wp(2.8),
    marginTop: wp(0.1),
    fontWeight: '700',
    color: '#a6a6a6',
  },
  footerMenus: {
    fontSize: wp(2.9),
    marginTop: wp(0.1),
    fontWeight: '700',
    color: '#0077a2',
    alignItems: 'center',
  },
});
