import React from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';

// Images
import logo_black from '../assets/images/logo_black.png';

// Icons
import ic_back_black from '../assets/icons/ic_back_black.png';
import ic_drawer_home from '../assets/icons/ic_drawer_home.png';
import ic_notification_black from '../assets/icons/ic_notification_black.png';
import ic_drawer_menu from '../assets/icons/ic_drawer_menu.png';
import basicStyles from '../styles/BasicStyles';

const HeaderComponent = props => {
  const {
    navAction,
    nav,
    showNotificationIcon,
    notificationCount,
    navType,
    title,
  } = props;

  const toggleDrawer = () => {
    props.nav.openDrawer();
  };

  const handleBack = () => {
    nav.goBack();
  };

  const handleHomeBack = () => {
    nav.navigate('AdminHome');
  };

  // header icon configuration
  let handleNavAction = toggleDrawer;
  let navIcon = ic_drawer_menu;

  if (navAction === 'back') {
    handleNavAction = handleBack;
    navIcon = ic_back_black;
  } else if (navAction === 'HomeBack') {
    handleNavAction = handleHomeBack;
    navIcon = ic_back_black;
  }

  const handleNotification = () => {
    if (navType === 'Admin') {
      props.nav.navigate('AdminNotification');
    } else {
      props.nav.navigate('Notification');
    }
  };

  const showNotificationBadge = notificationCount > 0;
  const isNotificationCountTwoDigit = notificationCount < 100;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.menuPart}>
        <TouchableOpacity underlayColor="transparent" onPress={handleNavAction}>
          <Image source={navIcon} resizeMode="cover" style={styles.menuIcon} />
        </TouchableOpacity>

        <Text style={{marginLeft: wp(4), color: '#000'}}>{title}</Text>
      </View>

      <Image source={logo_black} resizeMode="cover" style={styles.logoStyle} />

      {showNotificationIcon && (
        <TouchableOpacity
          style={styles.notificationIconContainer}
          onPress={handleNotification}>
          <Image
            source={ic_notification_black}
            resizeMode="cover"
            style={styles.notificationIcon}
          />

          {showNotificationBadge && (
            <View style={styles.notificationBadgeContainer}>
              {isNotificationCountTwoDigit ? (
                <Text style={styles.notificationBadge}>
                  {notificationCount}
                </Text>
              ) : (
                <Text style={styles.notificationBadge}>99+</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HeaderComponent;

const {darkGreyPrimary, lightBluePrimary, whitePrimary} = colors;

const styles = StyleSheet.create({
  headerContainer: {
    height: hp(7),
    flexDirection: 'row',
    // backgroundColor: darkGreyPrimary,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    elevation: 8,
    // borderWidth: 1,
    // borderBottomColor: '#ccc',
  },
  menuPart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    height: wp(4.5),
    aspectRatio: 1 / 1,
    // marginHorizontal: wp(2),
    zIndex: 9,
  },
  logoStyle: {
    aspectRatio: 2 / 1,
    width: hp(12),
    alignSelf: 'center',
  },

  notificationIconContainer: {
    paddingRight: wp(1),
  },

  notificationIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  notificationBadgeContainer: {
    width: wp(4),
    aspectRatio: 1 / 1,
    backgroundColor: 'red',
    borderRadius: wp(1.7),
    justifyContent: 'center',
    alignItems: 'center',
    top: wp(0),
    left: wp(3.5),
  },
  notificationBadge: {
    color: whitePrimary,
    fontSize: wp(2.2),
    textAlign: 'center',
  },
});
