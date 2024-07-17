import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';

const LeaveHistoryComponent = props => {
  const {type, date, in_time, out_time} = props.item;
  // console.log('@#@@@@@@@'.p);

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View>
          <Text style={styles.infoHeadStyle}>Date</Text>
          <Text style={styles.infoHeadTextStyle}>{date}</Text>
        </View>
        {type === 'Half Day' ? (
          <View>
            <Text style={styles.infoHeadStyle}>In Time</Text>
            <Text style={styles.infoHeadTextStyle}>{in_time}</Text>
          </View>
        ) : null}

        {type === 'Half Day' ? (
          <View>
            <Text style={styles.infoHeadStyle}>Out Time</Text>
            <Text style={styles.infoHeadTextStyle}>{out_time}</Text>
          </View>
        ) : null}
        <View>
          <Text style={styles.infoHeadStyle}>Leave Type</Text>
          <Text
            style={
              type === 'Absent'
                ? [styles.infoHeadStyle, {color: '#e14d4d'}]
                : [styles.infoHeadStyle, {color: '#0077a2'}]
            }>
            {type}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LeaveHistoryComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd8',
    // borderWidth: 1,
    borderRadius: wp(1.2),
    marginHorizontal: wp(1.5),
  },

  listContainer: {
    // marginBottom: hp(0.5),
    justifyContent: 'space-between',
    padding: wp(1),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(3),
  },
  infoHeadStyle: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
  },
});
