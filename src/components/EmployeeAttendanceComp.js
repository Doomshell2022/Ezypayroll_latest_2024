import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from '../styles/BasicStyles';
import EmployeeAttendance from './EmployeeAttendance';
class AbsentEmployeeComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      month: new Date(),
    };
  }
  renderItem = ({item}) => <EmployeeAttendance item={item} />;
  // renderItem2 = ({item}) => <MonthPickerComp item={item} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  render() {
    const {monthTotalHalf, monthTotal, month, details} = this.props.item;

    return (
      <>
        <View>
          <View style={styles.container}>
            {this.state.month ? (
              <View>
                <View style={styles.listContainer}>
                  <View>
                    <Text style={styles.infoHeadStyle}>Month</Text>
                    <Text style={styles.infoHeadTextStyle}>{month}</Text>
                  </View>
                  <View>
                    <Text style={styles.infoHeadStyle}>HalfDay</Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: wp(3),
                        marginRight: wp(1),
                        textAlign: 'center',
                      }}>
                      {monthTotalHalf}
                    </Text>
                  </View>
                  <View style={basicStyles.alignCenter}>
                    <Text style={styles.infoHeadStyle}>Absent</Text>
                    <Text
                      style={[
                        styles.infoHeadTextStyle,
                        {alignSelf: 'flex-end'},
                      ]}>
                      {monthTotal}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </View>
        {details ? (
          <FlatList
            data={details}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            refreshing={this.state.isRefreshing}
            onRefresh={this.handleListRefresh}
          />
        ) : null}
      </>
    );
  }
}
export default AbsentEmployeeComp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    marginTop: wp(2),
    marginHorizontal: wp(1.5),
    // position: 'absol',
    // zIndex: -2,
  },

  listContainer: {
    flex: 1,
    backgroundColor: '#0077a2',
    borderRadius: 5,
    marginBottom: hp(1),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(1),
    paddingHorizontal: wp(2.5),
  },

  listContentContainerStyle: {
    paddingHorizontal: wp(5),
  },

  infoHeadTextStyle: {
    color: '#fff',
    fontSize: wp(3),
    marginRight: wp(1),
  },
  infoHeadStyle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
    marginLeft: wp(1),
  },
  separator: {
    height: hp(0.5),
  },
});
