import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';

const LeaveTypeComponent = props => {
  Object.keys(props.item).forEach((key, index) => {
    console.log('key for leav=', key);
  });
  const {leaveType, leaveTypeId, total, balance} = props.item;

  const handleApplyLeave = () => {
    if (balance !== 0) {
      props.nav.push('ApplyLeave', {leaveTypeId: leaveTypeId});
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleApplyLeave}
      underlayColor="transparent">
      <View style={styles.blockContainer}>
        <View style={styles.linksContainer}>
          <Text style={styles.txStyle}>{total}</Text>
        </View>
        <View>
          <Text style={styles.blockTextStyle}>{leaveType}</Text>
          <Text style={styles.blockTextBStyle}>Balance: {balance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LeaveTypeComponent;

const {darkGreyPrimary, lightBluePrimary, lightGreyPrimary, whitePrimary} =
  colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  linksContainer: {
    backgroundColor: '#0077a2',
    height: hp(8),
    aspectRatio: 1 / 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },

  txStyle: {
    color: whitePrimary,
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },

  blockTextStyle: {
    fontSize: wp(3.5),
    color: darkGreyPrimary,
    fontWeight: 'bold',
  },
  blockTextBStyle: {
    color: lightGreyPrimary,
    fontSize: wp(3),
  },
});
