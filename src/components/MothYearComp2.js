import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native'; // Import ScrollView
import MonthPicker from 'react-native-month-year-picker';
import ic_calendar from '../assets/icons/ic_drawer_attendance.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MonthYearPicker2 = ({onDateChange, selectedDate}) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      const selected = new Date(selectedDate);
      setSelectedMonth(selected.getMonth());
      setSelectedYear(selected.getFullYear());
    }
  }, [selectedDate]);

  const onValueChange = (event, newDate) => {
    const selectedDate = newDate || date;
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    setShowPicker(false);
    setDate(selectedDate);
    setSelectedMonth(month);
    setSelectedYear(year);
    onDateChange(selectedDate);
  };

  const formattedDate =
    selectedMonth !== null && selectedYear !== null
      ? new Date(selectedYear, selectedMonth, 1)
          .toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })
          .replace(',', '')
      : '';

  return (
    <>
      <TouchableOpacity
        underlayColor="transparent"
        onPress={() => setShowPicker(true)}>
        <View style={styles.dateButtonContainer}>
          <Text style={styles.selectedDate}>{formattedDate}</Text>
          <Image
            source={ic_calendar}
            resizeMode="cover"
            style={styles.calendarIcon}
          />
        </View>
      </TouchableOpacity>
      {showPicker && (
        <MonthPicker
          value={date}
          onChange={onValueChange}
          locale="en"
          mode="calendar"
          containerStyle={styles.monthPickerContainer}
          itemStyle={styles.monthPickerItem}
          textStyle={styles.monthPickerText}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Allow content to expand and not be obscured by the keyboard
  },
  dateButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
    margin: 'auto',
  },
  selectedDate: {
    fontSize: wp(3),
    marginLeft: wp(0),
    color: '#000',
  },
  monthPickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  monthPickerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthPickerText: {
    fontSize: wp(3),
  },
});

export default MonthYearPicker2;
