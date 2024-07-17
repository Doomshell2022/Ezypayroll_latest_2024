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

// Image
import background from '../assets/images/background.png';
import ic_download_new from '../assets/icons/ic_download.png';
import ic_close from '../assets/icons/ic_close.png';
import ic_checked from '../assets/icons/ic_checked.png';

export default class HrPendingComponent extends Component {
  constructor(props) {
    super(props);
    const {item} = props;

    this.item = item;

    this.state = {
      isLoading: true,
      data: null,
    };
  }

  // onApprovePress = async () => {
  //   await handleApproveReject(id, 'approved');
  // };

  // onDeclinePress = async () => {
  //   await handleApproveReject(id, 'rejected');
  // };
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
    console.log(image);
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
  // handle approved and handle declined===
  handleApprove = () => {
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

  render() {
    const {showMore} = this.state;
    const {
      id,
      employee_id,
      employee_name,
      request_type,
      request_detail,
      image,
      status,
      submitted_on,
    } = this.item;
    console.log('@@@@@@@', this.item);
    return (
      <View style={styles.container}>
        {/* <Text style={[basicStyles.textSmall, basicStyles.grayColor]}>
          {submitted_on}
        </Text> */}
        <TouchableOpacity
          onPress={this.handleDetail('showMore')}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            // basicStyles.paddingHalfBottom,
          ]}>
          <View style={basicStyles.flexOne}>
            <Text style={basicStyles.heading}>{request_type}</Text>
            <Text style={basicStyles.text}>{employee_name}</Text>
            <Text style={basicStyles.text}>{submitted_on}</Text>
          </View>

          <View style={[basicStyles.directionRow]}>
            <TouchableOpacity style={basicStyles.marginRight}>
              <Image source={ic_checked} style={styles.iconColumn} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={ic_close} style={styles.iconColumn} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {showMore && (
          <View style={[basicStyles.mainContainer, basicStyles.paddingHalf]}>
            <View>
              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Name
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
                  {employee_name}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Department
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
                  Developer
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Type
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
                  {request_type}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Detail
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
                  {request_detail}
                </Text>
              </View>

              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Applied on
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
                  {submitted_on}
                </Text>
              </View>

              {/* <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Status
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
                  {status}
                </Text>
              </View> */}

              {image ? (
                <View style={styles.listContainer}>
                  <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                    Documents
                  </Text>
                  <Text
                    style={[
                      basicStyles.heading,
                      basicStyles.flexHalf,
                      basicStyles.textAlign,
                    ]}>
                    -
                  </Text>

                  <TouchableOpacity
                    onPress={this.handleDownload}
                    style={{backgroundColor: '#0077a2', borderRadius: wp(1)}}>
                    <View
                      style={[
                        // basicStyles.flexTow,
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
            </View>
            {/* <View style={[basicStyles.directionRow]}>
              <TouchableOpacity style={basicStyles.marginRight}>
                <Image source={ic_checked} style={styles.iconColumn} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={ic_close} style={styles.iconColumn} />
              </TouchableOpacity>
            </View> */}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: wp(2),
    paddingVertical: wp(3),
    backgroundColor: '#fff',
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
    paddingVertical: wp(1),
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
    height: hp(3.2),
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
});
