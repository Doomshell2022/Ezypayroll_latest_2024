import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from '../styles/BasicStyles';
import ic_close from '../assets/icons/ic_close.png';
import ic_checked from '../assets/icons/ic_checked.png';
// Image
// import background from '../assets/images/background.png';
import ic_download_new from '../assets/icons/ic_download.png';
import {getData, KEYS} from '../api/UserPreference';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import LoginScreen from '../screens/LoginScreen';
import {showToast} from './ToastComponent';

export default class HrApprovedComponent extends Component {
  constructor(props) {
    super(props);
    const {item} = props;
    this.item = item;
    this.state = {
      isLoading: true,
      data: null,
      showProcessingLoader: false,
    };
  }

  // handleDetail = () => {
  //   const {item, props} = this;
  //   props.nav.navigate('HrRequestDetail', {
  //     item,
  //     refreshHandler: this.refreshHandler,
  //   });
  // };

  handleEdit = () => {
    this.props.nav.navigate('EditITDeclarations', {
      item: this.item,
      handleRefresh: this.handleRefresh,
    });
  };

  handleDownload = async () => {
    const {image} = this.item;

    try {
      Linking.openURL(image);
    } catch (error) {
      console.log(error.message);
    }
  };

  handleRefresh = () => {
    this.props.fetchHrRequestData(true);
  };

  handleDetail = showMore => () => {
    this.setState(prevState => ({[showMore]: !prevState[showMore]}));
  };
  handleApprove = async () => {
    Alert.alert(
      'Leave Request',
      'Approve This Request!',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: this.onApprovePress},
      ],
      {
        cancelable: false,
      },
    );
  };

  handleDecline = () => {
    Alert.alert(
      'Leave Request',
      'Reject This Request!',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: this.onDeclinePress},
      ],
      {
        cancelable: false,
      },
    );
  };

  onApprovePress = async () => {
    try {
      const id = this.item.applicationId;
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        const {ezypayrollId, user} = userInfo;
        const {id: userId} = user;
        // preparing params
        const params = {
          ezypayrollId: ezypayrollId,
          userId: userId,
          requestId: id,
          status: 'approved',
        };
        const response = await makeRequest(
          BASE_URL + 'approveRejectHrRequest',
          params,
        );
        if (response) {
          const {message} = response;
          this.setState({
            showProcessingLoader: false,
          });
          showToast(message);
        } else {
          const {message} = response;
          showToast(message);
        }
        console.log('6666', response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  onDeclinePress = async () => {
    const id = this.item.applicationId;
    const userInfo = await getData(KEYS.USER_INFO);
    if (userInfo) {
      const {ezypayrollId, user} = userInfo;
      const {id: userId} = user;
      // preparing params
      const params = {
        ezypayrollId: ezypayrollId,
        userId: userId,
        requestId: id,
        status: 'rejected',
      };

      const response = await makeRequest(
        BASE_URL + 'approveRejectHrRequest',
        params,
      );
      console.log('6666', response);
    }
  };
  render() {
    const {showMore} = this.state;
    const {
      employee_id,
      employee_name,
      department,
      request_type,
      request_detail,
      verified,
      submitted_on,
      image,
      applicationId,
    } = this.item;

    return (
      <View style={styles.container}>
        {/* <Text style={[basicStyles.textSmall, basicStyles.grayColor]}>
          {submitted_on}
        </Text> */}
        <View
          // onPress={this.handleDetail('showMore')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: wp(1.5),
          }}>
          <View style={basicStyles.flexOne}>
            <Text style={basicStyles.heading}>{request_type}</Text>
            {/* <Text style={basicStyles.text}>{employee_name}</Text>
            <Text style={basicStyles.text}>{submitted_on}</Text> */}
          </View>
          <Text
            style={{
              paddingVertical: wp(1.5),
              paddingHorizontal: wp(3),
              backgroundColor:
                verified === 'Pending'
                  ? '#0077a233'
                  : verified === 'Approved'
                  ? '#4a970033'
                  : '#ff3f0033',
              fontSize: wp(3),
              color:
                verified === 'Pending'
                  ? '#0077a2'
                  : verified === 'Approved'
                  ? 'green'
                  : 'red',
              borderRadius: 3,
              textTransform: 'capitalize',
            }}>
            {verified}
          </Text>
        </View>

        <View style={[basicStyles.mainContainer, basicStyles.paddingHalf]}>
          {/* <View style={styles.listContainer}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>Id</Text>
            <Text
              style={[
                basicStyles.heading,
                basicStyles.flexHalf,
                basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text style={[basicStyles.text, basicStyles.flexTow]}>
              {applicationId}
            </Text>
          </View> */}
          {verified === 'Pending' ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={this.handleApprove}
                style={[
                  basicStyles.marginRight,
                  basicStyles.marginVentricleHalf,
                ]}>
                <Image source={ic_checked} style={styles.iconColumn2} />
              </TouchableOpacity>

              <TouchableOpacity onPress={this.handleDecline}>
                <Image source={ic_close} style={styles.iconColumn2} />
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
          <View style={styles.listContainer}>
            {/* <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Name
            </Text>
            <Text
              style={[
                basicStyles.heading,
                {width: wp(5)},
                // basicStyles.textAlign,
              ]}>
              -
            </Text> */}
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3), fontWeight: '900'},
              ]}>
              {employee_name}
            </Text>
          </View>

          <View style={styles.listContainer}>
            {/* <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Department
            </Text>
            <Text
              style={[
                basicStyles.heading,
                {width: wp(5)},
                // basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              Developer
            </Text> */}
          </View>

          <View style={styles.listContainer}>
            {/* <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Type
            </Text>
            <Text
              style={[
                basicStyles.heading,
                {width: wp(5)},
                // basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              {request_type}
            </Text> */}
          </View>

          <View style={styles.listContainer}>
            {/* <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Detail
            </Text> */}
            {/* <Text
              style={[
                basicStyles.heading,
                {width: wp(5)},
                // basicStyles.textAlign,
              ]}>
              -
            </Text> */}
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3), marginBottom: wp(2)},
              ]}>
              {request_detail}
            </Text>
          </View>

          {image ? (
            <View style={styles.listContainer}>
              {/* <Text
                style={[
                  basicStyles.heading,
                  {width: wp(25), fontSize: wp(3.3)},
                ]}>
                Documents
              </Text>
              <Text
                style={[
                  basicStyles.heading,
                  {width: wp(5)},
                  // basicStyles.textAlign,
                ]}>
                -
              </Text> */}

              {/* <View
                style={[
                  basicStyles.flexTow,
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                ]}>
                <Text
                  style={[
                    basicStyles.text,
                    basicStyles.marginRight,
                    {fontSize: wp(3)},
                  ]}>
                  Download
                </Text>
                <TouchableOpacity onPress={this.handleDownload}>
                  <Image source={ic_download_new} style={styles.iconColumn} />
                </TouchableOpacity>
              </View> */}
              <TouchableOpacity
                onPress={this.handleDownload}
                style={{backgroundColor: '#0077a2', borderRadius: wp(1)}}>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: wp(2),
                      paddingVertical: wp(1),
                    },
                  ]}>
                  <Image
                    source={require('../assets/icons/downloadbutton.png')}
                    style={styles.iconColumn}
                  />
                  <Text
                    style={[
                      basicStyles.text,

                      {fontSize: wp(3), color: '#fff', marginLeft: wp(1)},
                    ]}>
                    Download
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: wp(3),
            }}>
            <Text
              style={[
                styles.dateTextStyle,
                {marginBottom: wp(-1.9), fontSize: wp(3)},
              ]}>
              <Text
                style={{fontWeight: 'bold', color: '#000', fontSize: wp(3)}}>
                ID :
              </Text>{' '}
              {applicationId}
            </Text>
            <Text
              style={[
                styles.dateTextStyle,
                {marginBottom: wp(-1.9), fontSize: wp(3)},
              ]}>
              <Text style={[basicStyles.textBold, {fontSize: wp(3)}]}>
                Applied On :
              </Text>{' '}
              {submitted_on}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: wp(2),
    paddingVertical: wp(3),
    backgroundColor: '#fff',
    // margin: wp(1.5),
    elevation: 3,
    borderRadius: wp(1.5),
    borderLeftWidth: wp(1.2),
    borderLeftColor: '#0077a2',
    // marginBottom: wp(2),
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  pendingBtn: {
    paddingVertical: wp(1.5),
    paddingHorizontal: wp(3),
    backgroundColor: '#0077a2',
    fontSize: wp(3),
    color: '#fff',
    borderRadius: 3,
    textTransform: 'capitalize',
  },

  fromDateFieldContainer: {
    height: hp(5.5),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
    justifyContent: 'center',
  },
  pickerInput: {
    fontSize: wp(3),
    width: wp(96),
    marginHorizontal: 0,
    left: wp(-4),
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(0.5),
    paddingRight: wp(10),
  },
  inputField: {
    flex: 1,
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3.5),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
  },

  iconColumn: {
    height: hp(2),
    width: wp(2),
  },
  iconColumn2: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  editBtn: {
    marginTop: wp(2),
    paddingVertical: wp(1.5),
    paddingHorizontal: wp(5),
    backgroundColor: '#0077a2',
    borderRadius: 3,
    alignSelf: 'center',
  },
  buttonContainer: {
    // flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'flex-end',
    top: wp(0.5),
    zIndex: 2,
    // right: wp(0),
  },
});
