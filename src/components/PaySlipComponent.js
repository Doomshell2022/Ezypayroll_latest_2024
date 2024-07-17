import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';

// Image
import ic_download from '../assets/icons/ic_download.png';

const PaySlipComponent = props => {
  const {
    salaryMonth,
    fixedSalary,
    actualDays,
    leaves,
    deductions,
    netPay,
    link,
  } = props.item;

  const handlePaySilpDownload = async () => {
    try {
      Linking.openURL(link);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>SALARY MONTH</Text>
        <Text style={styles.infoHeadTextStyle}>{salaryMonth}</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>ACTUAL DAYS</Text>
        <Text style={styles.infoHeadTextStyle}>{actualDays}</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>FIXED SALARY</Text>
        <Text style={styles.infoHeadTextStyle}>{fixedSalary}</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>Leaves </Text>
        <Text style={styles.infoHeadTextStyle}>{leaves}</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>DEDUCTIONS</Text>
        <Text style={styles.infoHeadTextStyle}>{deductions}</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.infoHeadStyle}>NET PAY</Text>
        <Text style={styles.infoHeadTextStyle}>{netPay}</Text>
      </View>

      <TouchableOpacity
        underlayColor="transparent"
        onPress={handlePaySilpDownload}>
        <View style={styles.linkContainer}>
          <Text style={styles.infoHeadStyle}>DOWNLOAD</Text>
          <Image source={ic_download} style={styles.infoHeadImgStyle} />
        </View>
      </TouchableOpacity>
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
    borderRadius: 5,
    elevation: 3,
  },

  mainListContainer: {
    marginLeft: wp(2),
    alignSelf: 'flex-start',
    marginBottom: hp(3),
  },
  listContainer: {
    flexDirection: 'row',
    paddingBottom: wp(0.5),
    justifyContent: 'space-between',
  },

  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(3.2),
    textTransform: 'capitalize',
  },
  infoHeadStyle: {
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  infoHeadImgStyle: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(1),
  },
});
