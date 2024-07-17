import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ic_gallery from '../assets/icons/ic_gallery.png';
import ic_delete from '../assets/icons/ic_delete.png';

export default class LalListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleImageOpen = () => {
    const {handleViewImage} = this.props;
    const {image} = this.props.item;
    handleViewImage(image);
  };

  handleDelete = () => {
    Alert.alert(
      'Remove',
      'Confirm Delete?',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: this.handleRemove},
      ],
      {
        cancelable: false,
      },
    );
  };

  handleRemove = () => {
    const {handleDeleteExpenses} = this.props;
    const {expenseId} = this.props.item;
    handleDeleteExpenses(expenseId);
  };

  render() {
    const {title, amount, description, date, status} = this.props.item;
    let approved = {
      fontSize: wp(3),
      fontWeight: '700',
    };
    if (status === 'Approved') {
      approved.color = 'green';
    } else if (status === 'Rejected') {
      approved.color = 'red';
    } else if (status === 'Pending') {
      approved.color = 'orange';
    }
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
              <Text
                style={{
                  paddingVertical: wp(1.1),
                  paddingHorizontal: wp(2),
                  fontSize: wp(3),
                  fontWeight: '700',
                  backgroundColor:
                    status === 'Pending'
                      ? '#0077a233'
                      : status === 'Approved'
                      ? '#4a970033'
                      : '#ff3f0033',
                  color:
                    status === 'Pending'
                      ? '#0077a2'
                      : status === 'Approved'
                      ? 'green'
                      : 'red',
                  borderRadius: 3,
                }}>
                {status}
              </Text>
            </View>
            <View style={styles.listContainerList}>
              <Text style={styles.text2}>{date}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.text}>{description}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={this.handleImageOpen}>
            <Image
              source={ic_gallery}
              resizeMode="cover"
              style={styles.closeIcon}
            />
          </TouchableOpacity>
          {status === 'Pending' ? (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={this.handleDelete}>
              <Image
                source={ic_delete}
                resizeMode="cover"
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          ) : null}
        </View>
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
  closeIcon: {
    height: hp(3.5),
    aspectRatio: 1 / 1,
  },
  closeButton: {
    zIndex: 5,
    alignSelf: 'flex-end',
    marginHorizontal: wp(0.5),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
