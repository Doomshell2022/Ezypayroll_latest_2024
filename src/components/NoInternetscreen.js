import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const NoInternetScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/wifi.png')}
        style={styles.image}
      />
      <Text style={styles.text}>No Internet Connection</Text>
      <Text style={styles.subtext}>
        Please check your connection and try again.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  image: {
    width: wp(40), // 40% of the screen width
    height: hp(20), // 20% of the screen height
    marginBottom: 20,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default NoInternetScreen;
