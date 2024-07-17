import React, {Component} from 'react';
import {Text, TouchableOpacity, Image, View, StyleSheet} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
// Images
import ic_calendar from '../assets/icons/ic_drawer_attendance.png';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    const {date, isMonthPicker} = props;
    this.state = {
      isVisible: false,
      selectedDate: date ? date : 'Select Date',
      isMonthPicker,
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
    if (this.state.isMonthPicker) {
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      const selectedDate = `${month}-${year}`;
      this.setState({selectedDate, isVisible: false});
      this.props.onDateChange(dateObj);
    } else {
      const date = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      const selectedDate = `${month}-${year}`;
      this.setState({selectedDate, isVisible: false});
      this.props.onDateChange(dateObj);
    }
  };

  render() {
    const {isVisible, selectedDate, isMonthPicker} = this.state;

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
        {isMonthPicker ? (
          <DateTimePickerModal
            isVisible={isVisible}
            mode="date"
            display="spinner"
            onConfirm={this.handlePickerConfirm}
            onCancel={this.hidePicker}
          />
        ) : (
          <DateTimePickerModal
            isVisible={isVisible}
            mode="date"
            display="spinner"
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
