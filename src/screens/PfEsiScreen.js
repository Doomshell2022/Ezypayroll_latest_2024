import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';
import SafeAreaView from 'react-native-safe-area-view';
//  Components
import HeadersComponent from '../components/HeadersComponent';
import ProfileComponent from '../components/ProfileComponent';
import CustomLoader from '../components/CustomLoader';

import background from '../assets/images/background.png';

import ic_back from '../assets/icons/ic_back.png';

// Styles
import basicStyles from '../styles/BasicStyles';

const PfEsiScreen = (props) => {
  const {navigation} = props;
  const profile = navigation.getParam('profile', null);

  if (!profile) {
    return <CustomLoader />;
  }

  const {firstName, lastName, empId, designation, image, pfEsiDetails} =
    profile;
  const basicProfileDetail = {firstName, lastName, empId, designation, image};

  const {pf, esi} = pfEsiDetails;
  const handleBackButton = () => {
    navigation.pop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeadersComponent
        nav={navigation}
        title="PF/ESI/Tax Info."
        navAction="back"
      />

      <ProfileComponent profile={basicProfileDetail} />

      <View style={styles.mainListContainer}>
        <View style={styles.listContainer}>
          <Text style={[basicStyles.heading, basicStyles.flexOne]}>PF</Text>
          <Text
            style={[
              basicStyles.heading,
              basicStyles.flexHalf,
              basicStyles.textAlign,
            ]}>
            -
          </Text>
          <Text style={[basicStyles.text, basicStyles.flexTow]}>
            {pf ? pf : 'N/A'}
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
            {esi ? esi : 'N/A'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PfEsiScreen;

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
  headingTextStyle: {
    marginTop: hp(1),
    padding: wp(2),
    fontSize: wp(4),
    color: '#333',
    backgroundColor: '#f2f1f1',
    marginBottom: wp(2),
  },
  mainListContainer: {
    padding: wp(3),
  },
  listContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: wp(2),
    justifyContent: 'space-between',
    borderRadius: 5,
  },

  infoTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
  },

  informationTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    textTransform: 'capitalize',
  },
});
