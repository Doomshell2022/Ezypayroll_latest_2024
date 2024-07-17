import React, {Component} from 'react';
import {View, FlatList, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Colors
import {colors} from '../assets/colors/colors';
import basicStyles from '../styles/BasicStyles';

// Components
import AdminAttendanceComponentData from './AdminAttendanceComponentData';

export default class AdminAttendanceComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderItem = ({item}) => <AdminAttendanceComponentData item={item} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleDetail = showMore => () => {
    this.setState(prevState => ({[showMore]: !prevState[showMore]}));
  };

  render() {
    const {showMore} = this.state;
    const {date, attendance, halfDay, absent} = this.props.item;
    return (
      <View style={styles.container}>
        <View style={styles.mainListContainer}>
          <TouchableOpacity
            style={styles.listContainerInner}
            onPress={this.handleDetail('showMore')}>
            {/*Date*/}
            <View style={basicStyles.alignCenter}>
              <Text style={styles.infoHeadStyle}>
                <Text style={styles.infoHeadStyle}>Date :</Text>
                {'  '}
                {date}
              </Text>
            </View>
            {/*Half-Day*/}
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{color: '#fff', fontSize: wp(3), fontWeight: 'bold'}}>
                Half Day :{' '}
              </Text>
              <Text style={{color: '#fff', fontSize: wp(3)}}>{halfDay}</Text>
            </View>
            {/*Absent*/}
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{color: '#fff', fontSize: wp(3), fontWeight: 'bold'}}>
                Absent :{' '}
              </Text>
              <Text style={{color: '#fff', fontSize: wp(3)}}>{absent}</Text>
            </View>
          </TouchableOpacity>

          {showMore && (
            <View>
              {attendance ? (
                <FlatList
                  data={attendance}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContentContainerStyle}
                  showsVerticalScrollIndicator={false}
                />
              ) : null}
            </View>
          )}
        </View>
      </View>
    );
  }
}

const {lightBluePrimary, lightGreyPrimary} = colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
  },

  listContainer: {
    flex: 1,
    backgroundColor: '#555',
    borderRadius: 5,
    marginBottom: hp(1),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(1),
    paddingHorizontal: wp(2.5),
  },

  listContainerInner: {
    flex: 1,
    backgroundColor: '#555',
    borderRadius: 5,
    marginBottom: hp(1),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
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
