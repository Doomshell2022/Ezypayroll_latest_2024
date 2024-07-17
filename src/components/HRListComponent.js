import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from '../styles/BasicStyles';

// Image
import background from '../assets/images/background.png';
import ic_download_new from '../assets/icons/ic_download.png';

export default class HRListComponent extends Component {
  constructor(props) {
    super(props);
    const {item} = props;

    this.item = item;

    this.state = {
      isLoading: true,
      data: null,
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

    let statusColor = {
      color: 'red',
    };

    if (status === 'Approved') {
      statusColor.color = 'green';
    }

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
            paddingHorizontal: wp(1.5),
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
                status === 'Pending'
                  ? '#0077a233'
                  : status === 'Approved'
                  ? '#4a970033'
                  : '#ff3f0033',
              fontSize: wp(3),
              color:
                status === 'Pending'
                  ? '#0077a2'
                  : status === 'Approved'
                  ? 'green'
                  : 'red',
              borderRadius: 3,
              fontWeight: '900',
            }}>
            {status}
          </Text>
        </View>

        <View
          style={[
            basicStyles.mainContainer,
            basicStyles.paddingHalf,
            {paddingTop: 0},
          ]}>
          {/* <View style={styles.listContainer}>
            <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Name
            </Text>
            <Text
              style={[
                {width: wp(5)},
                basicStyles.heading,
                //  basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              {employee_name}
            </Text>
          </View> */}

          {/* <View style={styles.listContainer}>
            <Text
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
            </Text>
          </View> */}

          <View style={styles.listContainer}>
            {/* <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Detail
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
                // basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              {request_detail}
            </Text>
          </View>

          {/* <View style={styles.listContainer}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>
              Applied On
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
          </View> */}

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
            <Text style={[basicStyles.text, basicStyles.flexTow, statusColor]}>
              {status}
            </Text>
          </View> */}

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
              {id}
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
    borderRadius: 5,
    // marginBottom: wp(2),
    // flexDirection: 'row',
    // alignItems: 'center',
    elevation: 3,
  },
  // pendingBtn: {
  //   paddingVertical: wp(1.5),
  //   paddingHorizontal: wp(3),
  //   backgroundColor: '#0077a2',
  //   fontSize: wp(3),
  //   color: '#fff',
  //   borderRadius: 3,
  // },

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
    height: hp(2),
    width: wp(2),
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
