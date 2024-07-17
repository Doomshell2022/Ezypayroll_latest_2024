import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ic_download from '../assets/icons/ic_download.png';

export default class LssListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleDownload = async () => {
    const {link} = this.props.item;
    console.log(this.props.item);
    try {
      Linking.openURL(link);
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {salaryMonth, fixedSalary, actualDays, leaves, netPay} =
      this.props.item;

    return (
      <View style={styles.listContainer}>
        <View>
          <View style={styles.listContainerList}>
            <Text style={styles.text}> Salary Month </Text>
            <Text style={styles.text}> {salaryMonth} </Text>
          </View>
          <View style={styles.listContainerList}>
            <Text style={styles.text}> Fixed Salary </Text>
            <Text style={styles.text}> ₹{fixedSalary} </Text>
          </View>
          <View style={styles.listContainerList}>
            <Text style={styles.text}> Actual Days </Text>
            <Text style={styles.text}> {actualDays} </Text>
          </View>
          <View style={styles.listContainerList}>
            <Text style={styles.text}> Leave(s) </Text>
            <Text style={styles.text}> {leaves} </Text>
          </View>
          <View style={styles.listContainerList}>
            <Text style={styles.textB}> Net Pay </Text>
            <Text style={styles.textB}> ₹{netPay} </Text>
          </View>
        </View>
        <View style={styles.downPDF}>
          <TouchableOpacity onPress={this.handleDownload}>
            <Image
              source={ic_download}
              resizeMode="cover"
              style={styles.downloadIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: wp(2),
    backgroundColor: '#fff',
    paddingVertical: wp(1),
    // marginBottom: wp(2),
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
  },
  textB: {
    fontSize: wp(3),
    color: '#333',
    fontWeight: '700',
  },
  downloadIcon: {
    height: hp(3.5),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    // position: 'absolute',
  },
  downPDF: {
    padding: wp(1),
    paddingHorizontal: wp(2),
    borderRadius: wp(50),
    marginRight: wp(14),
    marginTop: wp(-7),
    alignSelf: 'flex-end',
  },
  downText: {
    fontSize: wp(2.8),
    color: '#fff',
    marginLeft: wp(1),
  },
});
