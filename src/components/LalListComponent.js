import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import remove from '../assets/icons/remove.png';
export default class LalListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleEdit = id => {
    console.log('edit');
    console.log(id);
    let item = 'edit';
    //thiusprops.leavedata(id);
  };
  handleDelete = id => {
    console.log('delte');
    console.log(id);
    let item = 'delete';
    this.props.LeaveUpdate(id, item);
  };
  render() {
    const {
      id,
      fromDate,
      toDate,
      totalDays,
      leaveType,
      narration,
      status,
      requestedOn,
    } = this.props.item;
    //console.log(this.props.item);
    return (
      <View style={styles.listContainer}>
        <View>
          <View style={styles.listContainerList}>
            <Text style={styles.text2}>Leave Date</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={[{flexDirection: 'row'}]}>
                {/* <Text style={styles.text2}>From</Text> */}
                <Text style={styles.text}>{fromDate}</Text>
              </View>
              <Text style={styles.text3}>To</Text>
              <View
                style={[
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <Text style={styles.text}>{toDate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.listContainerList}>
            <Text style={styles.text2}>Request Date</Text>
            <Text style={styles.text}>{requestedOn}</Text>
          </View>
          <View style={styles.listContainerList}>
            <Text style={styles.text2}>Leave Type</Text>
            <Text style={styles.text}>{leaveType}</Text>
          </View>
          {/* <View style={styles.listContainerList}>
            <Text style={styles.text2}>Leave Days</Text>
            <Text style={styles.text}>{totalDays}</Text>
          </View> */}
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: wp(3),
                  color: '#333',
                  fontWeight: '700',
                  marginRight: wp(4),
                  marginTop: wp(2),
                }}>
                STATUS
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
                flex: 1,
              }}>
              <Text
                style={{
                  paddingVertical: wp(1.3),
                  // paddingHorizontal: wp(3),
                  // alignItems: 'center',
                  // alignContent: 'center',
                  textAlign: 'center',
                  width: wp(20),
                  // height: wp(7),
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
              {status === 'Pending' ? (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: 1,
                  }}
                  onPress={() => this.handleDelete(id)}>
                  <Image
                    source={remove}
                    style={{width: 30, height: 30, marginLeft: 0}}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
    backgroundColor: '#fff',
    //marginBottom: wp(3),
    marginTop: 5,
  },
  listContainerList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: wp(0.5),
  },
  text: {
    fontSize: wp(3),
    color: '#333',
    fontWeight: '600',
    // textTransform: 'capitalize',
  },
  appText: {
    color: 'green',
    fontWeight: '700',
  },
  text2: {
    fontSize: wp(3),
    color: '#333',
    fontWeight: '700',
    marginRight: wp(4),
  },
  text3: {
    fontSize: wp(3),
    color: '#333',
    fontWeight: '700',
    marginHorizontal: wp(2),
  },
});
