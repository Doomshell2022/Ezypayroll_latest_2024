import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// Colors
import {colors} from '../assets/colors/colors';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import ProfileComponent from '../components/ProfileComponent';
import CustomLoader from '../components/CustomLoader';

import background from '../assets/images/background.png';

import ic_back from '../assets/icons/ic_back.png';

import basicStyles from '../styles/BasicStyles';

const SalaryDetailsScreen = (props) => {
  const {navigation} = props;
  const profile = navigation.getParam('profile', null);

  if (!profile) {
    return <CustomLoader />;
  }

  const {firstName, lastName, empId, designation, image, salaryDetails} =
    profile;

  const basicProfileDetail = {firstName, lastName, empId, designation, image};
  // const {jobType} = officialDetails;

  const {
    PFA,
    ESI,
    total,
    netpay,
    specialAllowance,
    medicalAllowance,
    basic,
    da,
    hra,
    cca,
  } = salaryDetails;

  const handleBackButton = () => {
    props.navigation.pop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeadersComponent
        nav={navigation}
        title="Salary Detail"
        navAction="back"
      />
      <ProfileComponent profile={basicProfileDetail} />

      <View style={styles.mainListContainer}>
        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>PFA</Text>
          <Text
            style={[
              basicStyles.heading,
              basicStyles.flexHalf,
              basicStyles.textAlign,
            ]}>
            -
          </Text>
          <Text style={[basicStyles.text, basicStyles.flexTow]}>
            {PFA ? 'Rs. ' + PFA : 'N/A'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>ESI</Text>
          <Text
            style={[
              basicStyles.heading,
              basicStyles.flexHalf,
              basicStyles.textAlign,
            ]}>
            -
          </Text>
          <Text style={[basicStyles.text, basicStyles.flexTow]}>
            {ESI ? 'Rs. ' + ESI : 'N/A'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>
            Net Pay
          </Text>
          <Text
            style={[
              basicStyles.heading,
              basicStyles.flexHalf,
              basicStyles.textAlign,
            ]}>
            -
          </Text>
          <Text style={[basicStyles.text, basicStyles.flexTow]}>
            {netpay ? 'Rs. ' + netpay : 'N/A'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>Total</Text>
          <Text
            style={[
              basicStyles.heading,
              basicStyles.flexHalf,
              basicStyles.textAlign,
            ]}>
            -
          </Text>
          <Text style={[basicStyles.text, basicStyles.flexTow]}>
            {total ? 'Rs. ' + total : 'N/A'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );

  // return (
  //   <View style={styles.container}>
  //     <HeadersComponent
  //       nav={navigation}
  //       title="Salary Detail"
  //       navAction="back"
  //     />
  //     <ProfileComponent profile={basicProfileDetail} />

  //     <ScrollView showsVerticalScrollIndicator={false}>
  //       <View style={styles.mainListContainer}>
  //         <View style={styles.listContainer}>
  //           <Text style={styles.infoHeadTextStyle}>BASIC</Text>
  //           <Text style={styles.infoTextStyle}>{basic}</Text>
  //         </View>
  //         <View style={styles.listContainer}>
  //           <Text style={styles.infoHeadTextStyle}>DEARNESS ALLOWANCE</Text>
  //           <Text style={styles.infoTextStyle}>{da}</Text>
  //         </View>
  //         <View style={styles.listContainer}>
  //           <Text style={styles.infoHeadTextStyle}>HOUSE RENT ALLOWANCE</Text>
  //           <Text style={styles.infoTextStyle}>{hra}</Text>
  //         </View>
  //         <View style={styles.listContainer}>
  //           <Text style={styles.infoHeadTextStyle}>CONVEYANCE ALLOWANCE</Text>
  //           <Text style={styles.infoTextStyle}>{cca}</Text>
  //         </View>
  //         <View style={styles.listContainer}>
  //           <Text style={styles.infoHeadTextStyle}>SPECIAL ALLOWANCE</Text>
  //           <Text style={styles.infoTextStyle}>{specialAllowance}</Text>
  //         </View>
  //         <View style={styles.listContainer}>
  //           <Text style={styles.infoHeadTextStyle}>MEDICAL ALLOWANCE</Text>
  //           <Text style={styles.infoTextStyle}>{medicalAllowance}</Text>
  //         </View>
  //         <View style={styles.listContainer}>
  //           <Text style={styles.infoHeadTextStyle}>PFA</Text>
  //           <Text style={styles.infoTextStyle}>{PFA}</Text>
  //         </View>
  //         <View style={styles.listContainer}>
  //           <Text style={styles.infoHeadTextStyle}>ESI</Text>
  //           <Text style={styles.infoTextStyle}>{ESI}</Text>
  //         </View>
  //         <View style={styles.listContainer}>
  //           <Text style={styles.infoHeadTextStyle}>NET PAY</Text>
  //           <Text style={styles.infoTextStyle}>{netpay}</Text>
  //         </View>
  //         <View style={styles.listContainer}>
  //           <Text style={styles.infoHeadTextStyle}>TOTAL</Text>
  //           <Text style={styles.infoTextStyle}>{total}</Text>
  //         </View>
  //       </View>
  //     </ScrollView>
  //   </View>
  // );
};

export default SalaryDetailsScreen;

const {lightBluePrimary, lightGreyPrimary} = colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  backButtonContainer: {
    marginTop: hp(2),
    marginHorizontal: wp(3),
    alignSelf: 'flex-start',
  },

  backButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icButtonStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
  },

  buttonTextStyle: {
    paddingLeft: wp(3),
    color: '#222',
  },

  headingContainerStyle: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginLeft: wp(4),
    marginTop: hp(3),
  },

  headingTextStyle: {
    marginTop: hp(1),
    padding: wp(2),
    fontSize: wp(4),
    color: '#333',
    backgroundColor: '#f2f1f1',
    marginBottom: wp(2),
  },

  mainListContainer: {
    flex: 1,
    paddingHorizontal: wp(3),
  },

  listContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: wp(2),
    justifyContent: 'space-between',
    borderRadius: 5,
  },

  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    textTransform: 'capitalize',
  },

  infoTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },
});
