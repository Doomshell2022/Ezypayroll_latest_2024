import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DocumentPicker from 'react-native-document-picker';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
import ic_close from '../assets/icons/ic_close.png';

class ImagePopUpComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.parentView = null;
  }

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleClose = () => {
    this.props.closePopup();
  };

  render() {
    console.log(this.props.item);
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <View style={styles.imgContainer}>
            <Image
              source={{uri: this.props.item}}
              resizeMode="cover"
              style={styles.imageStyle}
            />
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={this.handleClose}
            underlayColor="#transparent">
            <Image
              source={ic_close}
              resizeMode="cover"
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: wp(90),
    padding: wp(5),
  },

  closeButton: {
    position: 'absolute',
    top: wp(2),
    right: wp(10),
  },

  closeIcon: {
    height: hp(3.5),
    aspectRatio: 1 / 1,
  },
  imgContainer: {
    alignItems: 'center',
  },
  imageStyle: {
    height: hp(76),
    margin: 'auto',
    aspectRatio: 2 / 4.2,
  },
});

export default ImagePopUpComponent;
