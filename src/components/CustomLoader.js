import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Bubbles} from 'react-native-loader';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const CustomLoader = () => (
  <View style={styles.modalContainer}>
    <Bubbles size={wp(2)} color="#0077A2" />
  </View>
);

export default CustomLoader;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
