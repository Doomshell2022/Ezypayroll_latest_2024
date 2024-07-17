import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';

const PaySlipComponent = props => {
  const {date, name} = props.item.output;
  const {January} = props.item.output;
  console.log('@@!~~~Khush', January);
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>OCCASION</Text>
        <Text style={styles.infoHeadTextStyle}>{name}</Text>
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>DATE</Text>
        <Text style={styles.infoHeadTextStyle}>{date}</Text>
      </View>
    </View>
  );
};

export default PaySlipComponent;

const {lightBluePrimary, lightGreyPrimary} = colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp(2),
    backgroundColor: '#fff',
    padding: wp(3),
    borderRadius: wp(1),
    margin: wp(1),
    elevation: 3,
  },

  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: wp(1),
  },

  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
  },
  infoHeadStyle: {
    color: '#333',
    fontSize: wp(3.5),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
