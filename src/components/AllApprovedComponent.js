import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class LalListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {title, amount, description, image, date} = this.props.item;
    return (
      <View style={styles.listContainer}>
        <View style={styles.inline}>
          <View style={styles.flexOne}>
            <View style={styles.listContainerList}>
              <Text style={styles.text2}>{title}</Text>
            </View>
            <View style={styles.listContainerList}>
              <Text style={styles.text2}>₹ {amount}</Text>
            </View>
          </View>
          <View style={styles.alignment}>
            <View style={styles.listContainerList}>
              <Text style={styles.text2}>{date}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.text}>{description}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  listContainer: {
    padding: wp(2),
    backgroundColor: '#fff',
    // marginBottom: wp(2),
  },
  listContainerList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: wp(0.5),
  },
  text: {
    fontSize: wp(3),
    color: '#333',
    textTransform: 'capitalize',
    marginTop: wp(1),
  },
  appText: {
    color: 'green',
    fontWeight: '700',
  },
  text2: {
    fontSize: wp(3),
    color: '#333',
    fontWeight: '700',
  },
  inline: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  alignment: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  approved: {
    fontSize: wp(3),
    color: 'green',
    fontWeight: '700',
  },
});
