import {StyleSheet} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const basicStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginTop1: {
    marginTop: hp(0.5),
  },
  goldColor: {
    color: '#db9058',
  },

  greenColor: {
    color: '#318956',
  },

  lightGreenColor: {
    color: '#00b8a9',
  },

  purpleColor: {
    color: '#853a77',
  },

  blackColor: {
    color: '#231f20',
  },

  grayColor: {
    color: '#334',
  },

  graysColor: {
    color: '#333',
  },

  orangeColor: {
    color: '#ff9000',
  },

  pinkColor: {
    color: '#f65e83',
  },

  pinkBgColor: {
    backgroundColor: '#f65e83',
  },

  orangeBgColor: {
    backgroundColor: '#ff9000',
  },

  goldBgColor: {
    backgroundColor: '#db9058',
  },

  greenBgColor: {
    backgroundColor: '#318956',
  },

  purpleBgColor: {
    backgroundColor: '#853a77',
  },

  blackBgColor: {
    backgroundColor: '#231f20',
  },

  themeColor: {
    color: '#f57c00',
  },

  themeBgColor: {
    backgroundColor: '#f57c00',
  },

  button: {
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAlign: {
    textAlign: 'center',
  },
  textAlignVertical: {
    textAlignVertical: 'center',
  },
  mainContainer: {
    flex: 1,
    // borderWidth: 1,
  },

  themeTextColor: {
    color: '#0077a2',
  },

  whiteColor: {
    color: '#fff',
  },

  whiteBackgroundColor: {
    backgroundColor: '#fff',
  },

  lightBackgroundColor: {
    backgroundColor: '#f2f1f1',
  },

  themeBackgroundColor: {
    backgroundColor: '#0077a2',
  },

  flexHalf: {
    flex: 0.5,
  },

  flexOne: {
    flex: 1,
  },

  flexTow: {
    flex: 2,
  },

  flexThree: {
    flex: 3,
  },

  padding: {
    padding: wp(4),
  },

  paddingHalf: {
    padding: wp(2),
  },

  paddingHorizontal: {
    paddingHorizontal: wp(4),
  },

  paddingHalfHorizontal: {
    paddingHorizontal: wp(2),
  },

  paddingVentricle: {
    paddingVertical: wp(4),
  },

  paddingHalfVentricle: {
    paddingVertical: wp(2),
  },

  paddingBottom: {
    paddingBottom: wp(4),
  },

  paddingTop: {
    paddingTop: wp(4),
  },

  paddingLeft: {
    paddingLeft: wp(4),
  },

  paddingRight: {
    paddingRight: wp(4),
  },
  margin: {
    margin: wp(4),
  },
  marginHalf: {
    margin: wp(2),
  },

  marginHorizontal: {
    marginHorizontal: wp(4),
  },

  marginVentricle: {
    marginVertical: wp(4),
  },

  marginVentricleHalf: {
    marginVertical: wp(2),
  },

  marginBottom: {
    marginBottom: wp(4),
  },

  marginBottomHalf: {
    marginBottom: wp(2),
  },

  marginTop: {
    marginTop: wp(4),
  },

  marginTopHalf: {
    marginTop: wp(2),
  },

  marginLeft: {
    marginLeft: wp(4),
  },

  marginRight: {
    marginRight: wp(4),
  },

  directionRow: {
    flexDirection: 'row',
  },

  directionColumn: {
    flexDirection: 'column',
  },

  justifyBetween: {
    justifyContent: 'space-between',
  },

  justifyAround: {
    justifyContent: 'space-around',
  },

  justifyEvenly: {
    justifyContent: 'space-evenly',
  },

  justifyEnd: {
    justifyContent: 'flex-end',
  },

  justifyCenter: {
    justifyContent: 'center',
  },

  alignCenter: {
    alignItems: 'center',
  },

  alignEnd: {
    alignItems: 'flex-end',
  },

  textSmall: {
    fontSize: wp(2.8),
    color: '#222',
  },

  text: {
    fontSize: wp(3.3),
    color: '#222',
  },

  textLarge: {
    fontSize: wp(4),
    color: '#222',
  },

  heading: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#333',
  },

  headingLarge: {
    fontSize: wp(4.2),
    fontWeight: '700',
    color: '#333',
  },

  textBold: {
    fontWeight: '700',
  },

  textCapitalize: {
    textTransform: 'capitalize',
  },

  iconRow: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },

  iconColumn: {
    height: hp(2),
    aspectRatio: 1 / 1,
  },
  input: {
    color: '#fff',
    height: hp(5.5),
    flex: 1,
    borderRadius: 4,
    fontSize: wp(3),
    lineHeight: 12,
  },
  separatorVertical: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: wp(2),
    height: '100%',
  },
  separatorHorizontal: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: wp(2),
    width: '100%',
  },
  noDataStyle: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    backgroundColor: '#fff',
    // borderBottomWidth: 0.5,
  },
  noDataTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
  border: {
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  vectorIconRow: {
    // width: hp(2.8),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },

  paddingHalfTop: {
    paddingTop: wp(2),
  },
  paddingHalfRight: {
    padding: wp(2),
  },
  paddingHalfBottom: {
    paddingBottom: wp(2),
  },
  paddingHalfLeft: {
    paddingLeft: wp(2),
  },
  paddingHalfVertical: {
    padding: wp(2),
  },
  paddingHalfLeftHorizontal: {
    padding: wp(2),
  },
});

export default basicStyles;
