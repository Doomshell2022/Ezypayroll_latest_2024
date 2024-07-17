import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DateTimePicker from '../components/DateTimePicker';

const ComponenetDailyAttendance = props => {
  const {name, punchIn, punchOut, isPunch, isPunchOut} = props.item;

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View
          style={{
            width: wp(2.5),
            height: wp(2.5),
            borderRadius: wp(5),
            backgroundColor:
              isPunch === true
                ? isPunchOut === true
                  ? 'red'
                  : 'green'
                : 'gray',
            marginRight: wp(1),
            marginTop: wp(0.5),
          }}></View>

        <View style={{flex: 2}}>
          {/* <Text style={styles.infoHeadStyle}>Name</Text> */}
          <Text style={styles.infoHeadTextStyle}>{name}</Text>
        </View>
        <View style={styles.punchinout}>
          <Text style={styles.infoHeadStyle}>In </Text>
          <Text style={styles.infoHeadTextStyle}>{punchIn}</Text>
        </View>
        <View style={styles.punchinout}>
          <Text style={styles.infoHeadStyle}>Out </Text>
          <Text style={styles.infoHeadTextStyle}>{punchOut}</Text>
        </View>
      </View>
    </View>
  );
};
export default ComponenetDailyAttendance;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd8',
    // borderWidth: 1,
    borderRadius: wp(1.2),
    marginHorizontal: wp(1.5),
    marginBottom: wp(0.4),
    marginTop: wp(0.4),
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
  punchinout: {flex: 1, paddingLeft: wp(2)},
});
