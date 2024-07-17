import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// icons
import ic_paylists from '../assets/icons/ic_paylists.png';

const HomeTileComponent = props => {
  const {nav, item} = props;

  const {tileIcon, tileTitle, routeName} = item;

  const handleNavigate = () => {
    nav.navigate(routeName);
  };

  return (
    <TouchableOpacity style={styles.tileContainer} onPress={handleNavigate}>
      <Image source={tileIcon} resizeMode="cover" style={styles.tileIcon} />
      <Text style={{color: '#000'}}>{tileTitle}</Text>
    </TouchableOpacity>
  );
};

export default HomeTileComponent;

const styles = StyleSheet.create({
  tileContainer: {
    borderWidth: 0.7,
    borderColor: '#0077a2',
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp(4),
  },
  tileIcon: {
    height: wp(10),
    aspectRatio: 1 / 1,
    marginBottom: wp(2),
  },
});
