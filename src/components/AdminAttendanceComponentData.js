import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';

const AdminAttendanceComponentData = props => {
  const {emp_name, emp_mobile, department, type, in_time, out_time} =
    props.item;

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.listContainer}>
          <Text style={styles.infoHeadStyle}>Employee Name</Text>
          <Text style={styles.infoDashStyle}>-</Text>
          <Text style={styles.infoHeadTextStyle}>{emp_name}</Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.infoHeadStyle}>Department</Text>
          <Text style={styles.infoDashStyle}>-</Text>
          <Text style={styles.infoHeadTextStyle}>{department}</Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.infoHeadStyle}>Mobile</Text>
          <Text style={styles.infoDashStyle}>-</Text>
          <Text style={styles.infoHeadTextStyle}>{emp_mobile}</Text>
        </View>
        {type === 'Half' ? (
          <View style={styles.listContainer}>
            <Text style={styles.infoHeadStyle}>In Time</Text>
            <Text style={styles.infoDashStyle}>-</Text>
            <Text style={styles.infoHeadTextStyle}>{in_time}</Text>
          </View>
        ) : null}
        {type === 'Half' ? (
          <View style={styles.listContainer}>
            <Text style={styles.infoHeadStyle}>Out Time</Text>
            <Text style={styles.infoDashStyle}>-</Text>
            <Text style={styles.infoHeadTextStyle}>{out_time}</Text>
          </View>
        ) : null}

        <View style={styles.listContainer}>
          <Text style={styles.infoHeadStyle}>Attendance Type</Text>
          <Text style={styles.infoDashStyle}>-</Text>
          <Text
            style={
              type === 'Absent'
                ? [styles.infoHeadStyle, {color: '#e14d4d'}]
                : [styles.infoHeadStyle, {color: '#0077a2'}]
            }>
            {type === 'Half' ? type + ' Day' : type}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AdminAttendanceComponentData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // borderWidth: 1,
    borderRadius: wp(1.2),
    marginHorizontal: wp(1.5),
    padding: wp(2),
    elevation: 3,
  },

  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingVertical: wp(0.5),
  },

  // listContainer: {
  //   // marginBottom: hp(0.5),
  //   justifyContent: 'space-between',
  //   padding: wp(1),
  //   paddingHorizontal: wp(3),
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },

  infoHeadTextStyle: {
    flex: 0.5,
    color: '#333',
    fontSize: wp(3),
  },
  infoHeadStyle: {
    flex: 0.5,
    color: '#333',
    fontSize: wp(3),
    // fontWeight: '700',
    textTransform: 'capitalize',
  },
  infoDashStyle: {
    flex: 0.2,
    color: '#333',
    fontSize: wp(3),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
