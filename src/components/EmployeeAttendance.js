import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class EmployeeAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible2: false,
      selectedItem: {},
    };
  }

  setModalVisible2 = (visible2, item = {}) => {
    if (!visible2) {
      this.setState({modalVisible2: visible2, selectedItem: {}});
    } else {
      this.setState({modalVisible2: visible2, selectedItem: item});
    }
  };

  renderSlots = () => {
    const {type, date} = this.props.item;
    if (type === 'Sunday') {
      return (
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <View style={styles.cakeContainer}>
            <Text
              style={[
                styles.homeText,
                {
                  fontWeight: '700',
                  color: '#000',
                  textAlign: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                },
              ]}>
              {type}
            </Text>
            <Text style={{marginRight: wp(2)}}></Text>
            <Text
              style={[
                styles.homeTextStyle,
                {
                  fontWeight: '700',
                  color: '#000',
                  textAlign: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                },
              ]}>
              {date}
            </Text>
          </View>
        </View>
      );
    }
  };

  render() {
    const {
      date,
      in_time,
      out_time,
      isPunch,
      isPunchOut,
      type,
      isHoliday,
      backgroundColor,
      isApplied,
    } = this.props.item;

    let background = backgroundColor;
    if (type === 'Sunday' || isHoliday === true) {
      background = backgroundColor;
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: backgroundColor ? backgroundColor : '#ddd8',
            },
          ]}>
          <View style={styles.listContainer}>
            {type === 'Sunday' ? null : (
              <>
                <View
                  style={{
                    width: wp(2.5),
                    height: wp(2.5),
                    borderRadius: wp(5),
                    backgroundColor:
                      isPunch === true
                        ? isPunchOut === true
                          ? 'red'
                          : 'green'
                        : 'gray',
                    marginRight: wp(1),
                    marginTop: wp(0.5),
                  }}></View>

                <View style={{flex: 2}}>
                  <Text style={styles.infoHeadTextStyle}>{date}</Text>
                </View>
                <View style={styles.punchinout}>
                  <Text style={styles.infoHeadStyle}>In </Text>
                  <Text style={styles.infoHeadTextStyle}>{in_time}</Text>
                </View>
                <View style={styles.punchinout}>
                  <Text style={styles.infoHeadStyle}>Out </Text>
                  <Text style={styles.infoHeadTextStyle}>{out_time}</Text>
                </View>

                <View style={styles.punchinout}>
                  <Text style={styles.infoHeadStyle}>status</Text>
                  <Text
                    style={{
                      color:
                        type === 'P'
                          ? 'green'
                          : type === 'A' ||
                            type === 'HF' ||
                            type === 'A°' ||
                            type === 'HF°' ||
                            type === 'A*' ||
                            type === 'CL(A)' ||
                            type === 'CL(HF)'
                          ? 'red'
                          : 'black',
                      fontSize: wp(2.5),
                    }}>
                    {type}
                    {isApplied === true ? (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            this.setModalVisible2(true, this.props.item)
                          }>
                          <Image
                            source={require('../assets/icons/info1.png')}
                            style={{
                              width: wp(3),
                              height: wp(3),
                              marginLeft: wp(2),
                              marginTop: wp(1.2),
                            }}
                          />
                        </TouchableOpacity>
                      </>
                    ) : null}
                  </Text>
                </View>
              </>
            )}
          </View>
          <View style={{alignContent: 'center', alignSelf: 'center'}}>
            {this.renderSlots()}
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible2}
            onRequestClose={() => {
              this.setModalVisible2(!this.state.modalVisible2);
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setModalVisible2(!this.state.modalVisible2);
              }}>
              <View style={styles.centeredView}>
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      margin: 20,
                      backgroundColor: '#000', // Light black background
                      borderRadius: 20,
                      padding: 35,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      elevation: 5,
                    }}>
                    <View>
                      <Text style={{color: '#FFF'}}>
                        Date: {this.state.selectedItem.reason_date}
                      </Text>
                      <Text style={{color: '#FFF'}}>
                        Status: {this.state.selectedItem.status}
                      </Text>
                      <Text style={{color: '#FFF'}}>
                        Reason: {this.state.selectedItem.reason}
                      </Text>
                      <Text style={{color: '#FFF'}}>
                        Reason Type: {this.state.selectedItem.issue}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </ScrollView>
    );
  }
}

export default EmployeeAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd8',
    borderRadius: wp(1.2),
    marginHorizontal: wp(1.5),
    marginTop: wp(0.5),
    marginBottom: wp(1),
  },
  listContainer: {
    justifyContent: 'space-between',
    padding: wp(1),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(2.5),
  },
  infoHeadStyle: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
  },
  punchinout: {
    flex: 1,
    paddingLeft: wp(2),
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
  },
  homeTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: wp(3),
  },
  homeText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '400',
    textAlign: 'center',
  },
  homeTextStyle: {
    color: '#333',
    fontSize: wp(3),
    fontWeight: '400',
  },
  homeTextStyle2: {
    color: '#333',
    fontSize: wp(4),
    fontWeight: '700',
  },
  icStyle: {
    height: hp(4),
    aspectRatio: 1 / 1,
  },
  textCenter: {
    textAlign: 'center',
    color: '#fff',
  },
  cakeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    marginHorizontal: wp(4),
    margin: wp(2),
    textAlign: 'center',
    marginTop: wp(0),
    marginLeft: hp(18),
  },
  listContainers: {
    borderTopWidth: 0.5,
    borderTopColor: '#ccc8',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc8',
  },
  tileContainer: {
    borderWidth: 0.5,
    borderColor: '#0077a2',
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp(4),
    height: hp(20),
  },
  tileIcon: {
    height: wp(10),
    aspectRatio: 1 / 1,
    marginBottom: wp(2),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    padding: wp(5),
  },
});
