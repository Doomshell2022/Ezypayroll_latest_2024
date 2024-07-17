import React, {Component} from 'react';
import {View, Text, Image, ImageBackground, StyleSheet} from 'react-native';

// responsive
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Import images
import background from '../assets/images/background.png';
import logo_black from '../assets/images/logo_black.png';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.backgroundImageContainer}>
        <Image source={logo_black} resizeMode="cover" style={styles.logo} />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: hp(10),
    aspectRatio: 2 / 1,
  },
});
