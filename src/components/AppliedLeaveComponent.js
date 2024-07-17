import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import infomenu from '../assets/icons/infomenu.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import remove from '../assets/icons/remove.png';
import {colors} from '../assets/colors/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

const AppliedLeaveComponent = props => {
  console.log(props);
  const {
    id,
    fromDate,
    toDate,
    totalDays,
    leaveType,
    requestedOn,
    halfDayShift,
    status,
    leaveFor,
  } = props.item;
  const handleupdate = () => {
    console.log('login');

    props.leavedata('item');
  };
  const handleEdit = id => {
    console.log('edit');
    let item = 'edit';
    props.leavedata(id, item);
  };
  const handleDelete = id => {
    console.log('delte');
    let item = 'delete';
    props.leavedata(id, item);
  };

  return (
    <View style={styles.container}>
      {/* <View style={{flex: 1, alignItems: 'flex-end'}}>
        <TouchableOpacity style={{flex: 1}} onPress={handleupdate}>
          <Image source={infomenu} style={{width: 30, height: 30}} />
        </TouchableOpacity>
      </View> */}

      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>FROM</Text>
        <Text style={styles.infoHeadTextStyle}>{fromDate}</Text>
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>TO</Text>
        <Text style={styles.infoHeadTextStyle}>{toDate}</Text>
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>REQUESTED ON</Text>
        <Text style={styles.infoHeadTextStyle}>{requestedOn}</Text>
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>LEAVE TYPE</Text>
        <Text style={styles.infoHeadTextStyle}>{leaveType}</Text>
      </View>

      {leaveFor !== null ? (
        <View style={styles.listContainer}>
          <Text style={styles.infoHeadStyle}>LEAVE FOR</Text>
          <Text style={styles.infoHeadTextStyle}>{leaveFor}</Text>
        </View>
      ) : null}
      {halfDayShift === null ? (
        <View style={styles.listContainer}>
          <Text style={styles.infoHeadStyle}>TOTAL DAYS</Text>
          <Text style={styles.infoHeadTextStyle}>{totalDays}</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.infoHeadStyle}>HALF DAY SHIFT</Text>
          <Text style={styles.infoHeadTextStyle}>{halfDayShift}</Text>
        </View>
      )}
      <View style={styles.listContainer}>
        <Text
          style={{
            color: '#333',
            fontSize: wp(3.5),
            textTransform: 'capitalize',
            marginTop: wp(2),
          }}>
          STATUS
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              paddingVertical: wp(1.5),
              paddingHorizontal: wp(3),
              backgroundColor:
                status === 'Pending'
                  ? '#0077a233'
                  : status === 'Approved'
                  ? '#4a970033'
                  : '#ff3f0033',
              fontSize: wp(3),
              color:
                status === 'Pending'
                  ? '#0077a2'
                  : status === 'Approved'
                  ? 'green'
                  : 'red',
              borderRadius: 3,
              fontWeight: '900',
              marginLeft: wp(2),
              marginTop: wp(2),
            }}>
            {status}
          </Text>
          {status === 'pending' ? (
            <TouchableOpacity
              style={{flex: 1, padding: 1}}
              onPress={() => handleDelete(id)}>
              <Image
                source={remove}
                style={{width: 30, height: 30, marginLeft: 0}}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {/* 
      {status === 'pending' ? (
        <View
          style={{
            flex: 1,
            backgroundColor: '#0077a2',
            marginTop: 5,
            marginBottom: 5,
            flexDirection: 'row',
          }}> */}
      {/*  <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: 'black',
              marginTop: 10,
            }}
          /> */}
      {/*  <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity
              style={{flex: 1, padding: 10}}
              onPress={() => handleEdit(id)}>
              <Text style={{flex: 1, color: '#fff'}}>Edit</Text>
            </TouchableOpacity>
          </View> */}
      {/*  <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity
              style={{flex: 1, padding: 10}}
              onPress={() => handleDelete(id)}>
              <Text style={{flex: 1, color: '#fff'}}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null} */}
    </View>
  );
};

export default AppliedLeaveComponent;
const {lightBluePrimary, lightGreyPrimary} = colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp(2),
    backgroundColor: '#fff',
    padding: wp(3),
    borderRadius: 5,
    elevation: 3,
    margin: 0.5,
  },

  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: wp(0.5),
    alignItems: 'center',
  },

  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
  },
  infoHeadStyle: {
    color: '#333',
    fontSize: wp(3.5),
    textTransform: 'capitalize',
  },
});
