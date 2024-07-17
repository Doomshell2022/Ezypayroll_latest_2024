import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';

//  Components
import HeadersComponent from '../components/HeadersComponent';

// Image
import ic_drawer from '../assets/icons/ic_drawer.png';
import ic_option from '../assets/icons/ic_option.png';
import background from '../assets/images/background.png';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class LeaveBalanceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {connectionState: true};
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleCasualLeave = () => {
    this.props.navigation.navigate('CasualLeave');
  };

  render() {
    return (
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              title="Apply Leave"
              icon={ic_drawer}
              navAction="back"
              nav={this.props.navigation}
            />

            <View style={styles.homeTextContainer}>
              <Text style={styles.homeTextStyle}>Leave Balance</Text>
            </View>

            <ScrollView style={styles.mainListContainer}>
              <View style={styles.listContainer}>
                <View>
                  <Text style={styles.infoHeadTextStyle}>Rajat</Text>
                  <Text style={styles.infoHeadStyle}>EMPLOYEE NAME</Text>
                </View>
              </View>

              <View style={styles.listContainer}>
                <View>
                  <Text style={styles.infoHeadTextStyle}>Casual Leave</Text>
                  <Text style={styles.infoHeadStyle}>LEAVE TYPE</Text>
                </View>
                <View>
                  <Text style={styles.infoTextStyle}>5</Text>
                  <Text style={styles.infoTextBStyle}>OPENING BALANCE</Text>
                </View>
              </View>

              <View style={styles.listContainer}>
                <View>
                  <Text style={styles.infoHeadTextStyle}>4</Text>
                  <Text style={styles.infoHeadStyle}>UTILIZED</Text>
                </View>
                <View>
                  <Text style={styles.infoTextStyle}>1</Text>
                  <Text style={styles.infoTextBStyle}>CLOSING BALANCE</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.addButton}>
              <TouchableOpacity
                // onPress={this.handleCasualLeave}
                underlayColor="transparent">
                <Image
                  source={ic_option}
                  resizeMode="cover"
                  style={styles.buttonStyle}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
      </ImageBackground>
    );
  }
}

const {darkGreyPrimary, lightBluePrimary, lightGreyPrimary, whitePrimary} =
  colors;
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
  container: {
    flex: 1,
    alignItems: 'center',
  },
  homeTextContainer: {
    marginTop: hp(6),
    width: wp('95'),
    borderBottomWidth: 3,
    borderBottomColor: lightBluePrimary,
  },
  homeTextStyle: {
    paddingBottom: hp(3),
    marginLeft: wp(3),
    color: lightBluePrimary,
    fontSize: 24,
    fontWeight: '400',
  },

  mainListContainer: {
    marginLeft: wp(3),
    alignSelf: 'flex-start',
  },
  listContainer: {
    width: wp('95'),
    flexDirection: 'row',
    marginTop: hp(3),
    justifyContent: 'space-between',
  },

  infoHeadTextStyle: {
    color: lightGreyPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  infoHeadStyle: {
    color: lightBluePrimary,
    fontSize: 17,
  },
  infoTextStyle: {
    color: lightGreyPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  infoTextBStyle: {
    color: lightBluePrimary,
    fontSize: 17,
  },

  addButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: hp(18),
    paddingRight: wp(10),
  },

  buttonStyle: {
    height: hp(6),
    aspectRatio: 1 / 1,
    backgroundColor: whitePrimary,
    borderRadius: wp(10),
  },
});
