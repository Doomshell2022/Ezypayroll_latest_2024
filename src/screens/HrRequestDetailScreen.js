import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Styles
import basicStyles from '../styles/BasicStyles';

// Image
import background from '../assets/images/background.png';
import ic_download_new from '../assets/icons/ic_download.png';

//  Components
import HeadersComponent from '../components/HeadersComponent';
import ITListComponent from '../components/ITListComponent';
import SafeAreaView from 'react-native-safe-area-view';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';

export default class AddITDeclarationsScreen extends Component {
  constructor(props) {
    super(props);

    const item = props.navigation.getParam('item', null);
    this.item = item;

    const {
      id,
      employee_id,
      request_type,
      request_detail,
      image,
      status,
      employee_name,
      submitted_on,
    } = item;

    this.state = {
      employee_id,
      employee_name,
      submitted_on,
      id,
      request_type,
      request_detail,
      image,
      status,
      connectionState: true,
    };
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.handleLeaveHistory();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleRefresh = async () => {
    this.props.navigation.pop();
    const refreshHandler = this.props.navigation.getParam(
      'refreshHandler',
      null,
    );

    await refreshHandler();
  };

  handleEdit = () => {
    this.props.navigation.navigate('EditITDeclarations', {
      item: this.item,
      handleRefresh: this.handleRefresh,
    });
  };

  handleDownload = async () => {
    const {image: link} = this.state;
    try {
      Linking.openURL(link);
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {
      employee_id,
      employee_name,
      id,
      request_type,
      request_detail,
      image,
      status,
      submitted_on,
    } = this.state;

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              title="HR Request"
              nav={this.props.navigation}
              navAction="back"
            />

            <Text
              style={[
                basicStyles.headingLarge,
                basicStyles.marginTop,
                {marginLeft: wp(2)},
              ]}>
              HR Request Detail
            </Text>

            <View style={[basicStyles.mainContainer, basicStyles.paddingHalf]}>
              <View style={styles.listContainer}>
                <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                  Employee Name
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
                  Request Type
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
                  Request Detail
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
                  Submitted On
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

              <View style={styles.listContainer}>
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
              </View>

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

                  <View
                    style={[
                      basicStyles.flexTow,
                      basicStyles.directionRow,
                      basicStyles.alignCenter,
                    ]}>
                    <Text style={[basicStyles.text, basicStyles.marginRight]}>
                      Download Document File
                    </Text>
                    <TouchableOpacity onPress={this.handleDownload}>
                      <Image
                        source={ic_download_new}
                        style={styles.iconColumn}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          </>
        )}
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
