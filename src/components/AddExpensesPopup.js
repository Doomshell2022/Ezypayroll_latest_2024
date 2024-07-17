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

class EditTemplatePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      amount: '',
      selectedFile: null,
      imageName: 'Upload File',
      comment: '',
    };

    this.parentView = null;
  }
  componentDidMount() {
    this.checkPermission();
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

  handleTitle = changedText => {
    this.setState({title: changedText});
  };
  handleAmount = changedText => {
    this.setState({amount: changedText});
  };
  handleDescription = changedText => {
    this.setState({comment: changedText});
  };

  checkPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          // 'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
            // this.handleImagePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          // this.handleImagePick();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Storage" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('cannot open settings', error);
    }
  };

  handleFilePick = async () => {
    try {
      // Pick a single file
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const {name} = response;
      const extension = name.split('.').pop();
      const isFileAllowed =
        extension === 'pdf' ||
        extension === 'jpeg' ||
        extension === 'jpg' ||
        extension === 'png';

      if (isFileAllowed) {
        this.setState({selectedFile: response, imageName: name});
      } else {
        alert(`.${extension} file not allowed`);
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };

  handleApply = async () => {
    const {title, amount, selectedFile, comment} = this.state;

    // Validations
    if (title.trim() === '') {
      Alert.alert('Alert!', 'Please enter title!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (amount.trim() === '') {
      Alert.alert('Alert!', 'Please enter amount!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (comment.trim() === '') {
      Alert.alert('Alert!', 'Please enter description!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    const {handleAddExpenses} = this.props;
    await handleAddExpenses(title, amount, selectedFile, comment);
    this.handleClose();
  };

  render() {
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text style={styles.popupHeading}>Add Expenses</Text>
          <KeyboardAwareScrollView>
            <TextInput
              placeholder="Enter Title"
              placeholderTextColor="#333"
              style={styles.input}
              value={this.state.title}
              onChangeText={this.handleTitle}
            />
            <TextInput
              placeholder="Enter Amount"
              placeholderTextColor="#333"
              style={styles.input}
              value={this.state.amount}
              onChangeText={this.handleAmount}
              maxLength={6}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={this.handleFilePick}>
              <Text style={styles.input}>{this.state.imageName}</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Description"
              placeholderTextColor="#333"
              style={styles.textArea}
              value={this.state.comment}
              onChangeText={this.handleDescription}
              multiline
            />
            <TouchableOpacity
              onPress={this.handleApply}
              underlayColor="transparent"
              style={styles.submitButton}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>

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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: wp(90),
    backgroundColor: 'white',
    padding: wp(5),
  },
  heading: {
    fontSize: wp(4),
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: wp(2),
  },
  closeButton: {
    position: 'absolute',
    top: wp(2),
    right: wp(2),
  },
  applyButtonText: {
    color: '#fff',
    fontSize: wp(3.2),
  },
  input: {
    height: hp(5.5),
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    // borderWidth: 1,
    // borderColor: '#ccc',
    // textAlignVertical: 'top',
    fontSize: wp(3),
    marginBottom: wp(2),
  },
  textArea: {
    height: hp(10),
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    // borderWidth: 1,
    // borderColor: '#ccc',
    textAlignVertical: 'top',
    fontSize: wp(3),
    marginBottom: wp(2),
  },
  submitButton: {
    backgroundColor: '#0077a2',
    alignSelf: 'center',
    paddingVertical: wp(2),
    paddingHorizontal: wp(8),
    marginTop: wp(3),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '700',
  },
  popupHeading: {
    fontSize: wp(3.5),
    fontWeight: '700',
    marginBottom: wp(3),
    textAlign: 'center',
  },
  closeIcon: {
    height: hp(3.5),
    aspectRatio: 1 / 1,
  },
});

export default EditTemplatePopup;
