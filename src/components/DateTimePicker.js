import React, {Component} from 'react';
import {Text, TouchableOpacity, Image, View, StyleSheet} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Images
import ic_calendar from '../assets/icons/ic_drawer_attendance.png';

export default class DateTimePicker extends Component {
  constructor(props) {
    super(props);

    const {date, isMinDate} = props;

    this.state = {
      isVisible: false,
      selectedDate: date ? date : 'Select Date',
      isMinDate,
    };
  }

  showPicker = () => {
    this.setState({
      isVisible: true,
    });
  };

  hidePicker = () => {
    this.setState({
      isVisible: false,
    });
  };

  handlePickerConfirm = dateObj => {
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const selectedDate = `${date}-${month}-${year}`;
    // const selectedMinDate = `${year}, ${month - 1}, ${date}`;
    const selectedMinDate = {year, month: month - 1, date};

    this.setState({selectedDate, isVisible: false});
    this.props.onDateChange(dateObj, selectedMinDate);
  };

  render() {
    const {isVisible, selectedDate, isMinDate} = this.state;

    return (
      <View>
        <TouchableOpacity underlayColor="transparent" onPress={this.showPicker}>
          <View style={styles.dateButtonContainer}>
            <Text style={styles.selectedDate}>{selectedDate}</Text>
            <Image
              source={ic_calendar}
              resizeMode="cover"
              style={styles.calendarIcon}
            />
          </View>
        </TouchableOpacity>
        {isMinDate ? (
          <DateTimePickerModal
            isVisible={isVisible}
            mode="date"
            minimumDate={new Date()}
            onConfirm={this.handlePickerConfirm}
            onCancel={this.hidePicker}
          />
        ) : (
          <DateTimePickerModal
            isVisible={isVisible}
            mode="date"
            onConfirm={this.handlePickerConfirm}
            onCancel={this.hidePicker}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
    // marginRight: wp(2),
  },
  selectedDate: {
    fontSize: wp(3),
    marginLeft: wp(0),
    color: '#000',
  },
});
