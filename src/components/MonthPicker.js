import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AutoScrolling from 'react-native-auto-scrolling';

const MonthPickerComp = props => {
  const {date, in_time, out_time, isPunch, isPunchOut, type} = props.item;
  const renderSlots = () => {
    if (type === 'Sunday') {
      return (
        <View>
          {/* <AutoScrolling style={styles.scrolling1}> */}
          <View style={{flexDirection: 'row'}}>
            <View style={styles.cakeContainer}>
              <Text
                style={[styles.homeText, {fontWeight: '700', color: '#000'}]}>
                {type}
              </Text>
              <Text style={{marginRight: wp(2)}}></Text>
              <Text
                style={[
                  styles.homeTextStyle,
                  {fontWeight: '700', color: '#000'},
                ]}>
                {date}
              </Text>
            </View>
          </View>
          {/* </AutoScrolling> */}
        </View>
      );
    } else {
      // return (
      //   <View style={styles.punchinout}>
      //     <Text style={styles.infoHeadStyle}>status</Text>
      //     <Text style={styles.infoHeadTextStyle}>{type}</Text>
      //   </View>
      // );
    }
  };

  let background = '#ddd8';
  let textColor = '#333';
  if (type === 'Sunday') {
    background = '#FFCCCB';
    textColor = '#fff';
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.container, {backgroundColor: background}]}>
        <View style={styles.listContainer}>
          {type === 'Sunday' ? null : (
            <>
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
                <Text style={styles.infoHeadTextStyle}>{date}</Text>
              </View>
              <View style={styles.punchinout}>
                <Text style={styles.infoHeadStyle}>In </Text>
                <Text style={styles.infoHeadTextStyle}>{in_time}</Text>
              </View>
              <View style={styles.punchinout}>
                <Text style={styles.infoHeadStyle}>Out </Text>
                <Text style={styles.infoHeadTextStyle}>{out_time}</Text>
              </View>

              <View style={styles.punchinout}>
                <Text style={styles.infoHeadStyle}>status</Text>
                <Text style={styles.infoHeadTextStyle}>{type}</Text>
              </View>
            </>
          )}
        </View>
        {renderSlots()}
      </View>
    </SafeAreaView>
  );
};

export default MonthPickerComp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd8',
    // borderWidth: 1,
    borderRadius: wp(1.2),
    marginHorizontal: wp(1.5),
    marginBottom: wp(0.4),
    marginTop: wp(0.5),
  },

  listContainer: {
    // marginBottom: hp(0.5),
    justifyContent: 'space-between',
    padding: wp(1),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(2.5),
  },
  infoHeadStyle: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
  },
  punchinout: {flex: 1, paddingLeft: wp(2)},
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainContainer: {
    flex: 1,
    // backgroundColor: '#fff5',
  },
  // eventStyle: {
  //   height: 26,
  //   width: wp(100),
  //   backgroundColor: '#0077a2',
  //   alignItems: 'center',
  //   marginBottom: wp(2),
  //   // borderRadius: wp(1),
  //   // marginTop: wp(2),
  //   elevation: 3,
  // },
  homeContainer: {
    flex: 1,
    // backgroundColor: '#ddd',
  },
  homeTextContainer: {
    // backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    // elevation: 5,
    // marginBottom: wp(3),
    flexDirection: 'row',
    padding: wp(3),
  },
  homeText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '400',
    // margin: wp(1),
  },
  homeTextStyle: {
    color: '#333',
    fontSize: wp(3),
    fontWeight: '400',
  },
  homeTextStyle2: {
    color: '#333',
    fontSize: wp(4),
    fontWeight: '700',
  },

  icStyle: {
    height: hp(4),
    aspectRatio: 1 / 1,
  },

  textCenter: {
    textAlign: 'center',
    color: '#fff',
  },

  cakeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: wp(1),
    marginHorizontal: wp(4),
    margin: wp(2),
    marginTop: wp(-0),
  },

  listContainers: {
    borderTopWidth: 0.5,
    borderTopColor: '#ccc8',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc8',
  },

  tileContainer: {
    borderWidth: 0.5,
    borderColor: '#0077a2',
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp(4),
    height: hp(20),
  },
  tileIcon: {
    height: wp(10),
    aspectRatio: 1 / 1,
    marginBottom: wp(2),
  },
});
