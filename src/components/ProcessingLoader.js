import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Bubbles} from 'react-native-loader';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const ProcessingLoader = () => (
  <View style={styles.modalContainer}>
    <Bubbles size={wp(2)} color="#0077A2" />
  </View>
);

export default ProcessingLoader;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
