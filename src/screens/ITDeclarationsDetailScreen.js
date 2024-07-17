// import React, {Component} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   Linking,
//   Alert,
// } from 'react-native';

// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// import SafeAreaView from 'react-native-safe-area-view';
// // Styles
// import basicStyles from '../styles/BasicStyles';

// // Image
// import background from '../assets/images/background.png';
// import ic_download_new from '../assets/icons/ic_download.png';

// //  Components
// import HeadersComponent from '../components/HeadersComponent';
// // network alert
// import NetInfo from '@react-native-community/netinfo';
// //gif
// import offline from '../assets/icons/internetConnectionState.gif';
// // User Preference
// import {KEYS, getData} from '../api/UserPreference';

// export default class AddITDeclarationsScreen extends Component {
//   constructor(props) {
//     super(props);
//     const item = props.navigation.getParam('item', null);
//     this.item = item;

//     const {
//       id,
//       employee_id,
//       employee_name,
//       declaration_name,
//       financial_year,
//       section,
//       max_limit,
//       amount,
//       notes,
//       status,
//       image,
//       submitted_on,
//       verified,
//     } = item;

//     this.state = {
//       id,
//       employee_id,
//       employee_name,
//       declaration_name,
//       financial_year,
//       section,
//       max_limit,
//       amount,
//       notes,
//       status,
//       image,
//       submitted_on,
//       verified,
//       connectionState: true,
//     };
//   }
//   componentDidMount() {
//     this.unsubscribe = NetInfo.addEventListener(state => {
//       this.setState({connectionState: state.isConnected});
//     });
//   }
//   componentWillUnmount() {
//     this.unsubscribe();
//   }
//   handleRefresh = async () => {
//     this.props.navigation.pop();
//     const refreshHandler = this.props.navigation.getParam(
//       'refreshHandler',
//       null,
//     );

//     await refreshHandler();
//   };

//   handleEdit = () => {
//     this.props.navigation.navigate('EditITDeclarations', {
//       item: this.item,
//       handleRefresh: this.handleRefresh,
//     });
//   };

//   handleDownload = async () => {
//     const {image: link} = this.state;
//     try {
//       Linking.openURL(link);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   render() {
//     const {
//       id,
//       employee_id,
//       employee_name,
//       declaration_name,
//       financial_year,
//       section,
//       max_limit,
//       amount,
//       notes,
//       status,
//       image,
//       submitted_on,
//       verified,
//     } = this.state;
//     return (
//       <SafeAreaView
//         style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
//         {this.state.connectionState && (
//           <>
//             <HeadersComponent
//               title="My IT Declarations Detail"
//               nav={this.props.navigation}
//               navAction="back"
//             />
//             <View style={[basicStyles.mainContainer, basicStyles.paddingHalf]}>
//               <View style={styles.listContainer}>
//                 <Text style={[basicStyles.heading, basicStyles.flexOne]}>
//                   Employee Name
//                 </Text>
//                 <Text
//                   style={[
//                     basicStyles.heading,
//                     basicStyles.flexHalf,
//                     basicStyles.textAlign,
//                   ]}>
//                   -
//                 </Text>
//                 <Text style={[basicStyles.text, basicStyles.flexTow]}>
//                   {employee_name}
//                 </Text>
//               </View>

//               <View style={styles.listContainer}>
//                 <Text style={[basicStyles.heading, basicStyles.flexOne]}>
//                   Declaration Name
//                 </Text>
//                 <Text
//                   style={[
//                     basicStyles.heading,
//                     basicStyles.flexHalf,
//                     basicStyles.textAlign,
//                   ]}>
//                   -
//                 </Text>
//                 <Text style={[basicStyles.text, basicStyles.flexTow]}>
//                   {declaration_name}
//                 </Text>
//               </View>

//               <View style={styles.listContainer}>
//                 <Text style={[basicStyles.heading, basicStyles.flexOne]}>
//                   Section
//                 </Text>
//                 <Text
//                   style={[
//                     basicStyles.heading,
//                     basicStyles.flexHalf,
//                     basicStyles.textAlign,
//                   ]}>
//                   -
//                 </Text>
//                 <Text style={[basicStyles.text, basicStyles.flexTow]}>
//                   {section}
//                 </Text>
//               </View>

//               <View style={styles.listContainer}>
//                 <Text style={[basicStyles.heading, basicStyles.flexOne]}>
//                   Max Limit
//                 </Text>
//                 <Text
//                   style={[
//                     basicStyles.heading,
//                     basicStyles.flexHalf,
//                     basicStyles.textAlign,
//                   ]}>
//                   -
//                 </Text>
//                 <Text style={[basicStyles.text, basicStyles.flexTow]}>
//                   {max_limit}
//                 </Text>
//               </View>

//               <View style={styles.listContainer}>
//                 <Text style={[basicStyles.heading, basicStyles.flexOne]}>
//                   Amount
//                 </Text>
//                 <Text
//                   style={[
//                     basicStyles.heading,
//                     basicStyles.flexHalf,
//                     basicStyles.textAlign,
//                   ]}>
//                   -
//                 </Text>
//                 <Text style={[basicStyles.text, basicStyles.flexTow]}>
//                   {amount}
//                 </Text>
//               </View>

//               <View style={styles.listContainer}>
//                 <Text style={[basicStyles.heading, basicStyles.flexOne]}>
//                   Verified
//                 </Text>
//                 <Text
//                   style={[
//                     basicStyles.heading,
//                     basicStyles.flexHalf,
//                     basicStyles.textAlign,
//                   ]}>
//                   -
//                 </Text>
//                 <Text style={[basicStyles.text, basicStyles.flexTow]}>
//                   {verified}
//                 </Text>
//               </View>

//               <View style={styles.listContainer}>
//                 <Text style={[basicStyles.heading, basicStyles.flexOne]}>
//                   Notes
//                 </Text>
//                 <Text
//                   style={[
//                     basicStyles.heading,
//                     basicStyles.flexHalf,
//                     basicStyles.textAlign,
//                   ]}>
//                   -
//                 </Text>
//                 <Text style={[basicStyles.text, basicStyles.flexTow]}>
//                   {notes}
//                 </Text>
//               </View>

//               <View style={styles.listContainer}>
//                 <Text style={[basicStyles.heading, basicStyles.flexOne]}>
//                   Submitted On
//                 </Text>
//                 <Text
//                   style={[
//                     basicStyles.heading,
//                     basicStyles.flexHalf,
//                     basicStyles.textAlign,
//                   ]}>
//                   -
//                 </Text>
//                 <Text style={[basicStyles.text, basicStyles.flexTow]}>
//                   {submitted_on}
//                 </Text>
//               </View>

//               <View style={styles.listContainer}>
//                 <Text style={[basicStyles.heading, basicStyles.flexOne]}>
//                   Status
//                 </Text>
//                 <Text
//                   style={[
//                     basicStyles.heading,
//                     basicStyles.flexHalf,
//                     basicStyles.textAlign,
//                   ]}>
//                   -
//                 </Text>
//                 <Text style={[basicStyles.text, basicStyles.flexTow]}>
//                   {status}
//                 </Text>
//               </View>

//               {image ? (
//                 <View style={styles.listContainer}>
//                   <Text style={[basicStyles.heading, basicStyles.flexOne]}>
//                     Documents
//                   </Text>
//                   <Text
//                     style={[
//                       basicStyles.heading,
//                       basicStyles.flexHalf,
//                       basicStyles.textAlign,
//                     ]}>
//                     -
//                   </Text>
//                   <View
//                     style={[
//                       basicStyles.flexTow,
//                       basicStyles.directionRow,
//                       basicStyles.alignCenter,
//                     ]}>
//                     <Text style={[basicStyles.text, basicStyles.marginRight]}>
//                       Download Document File
//                     </Text>
//                     <TouchableOpacity onPress={this.handleDownload}>
//                       <Image
//                         source={ic_download_new}
//                         style={styles.iconColumn}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               ) : null}
//             </View>
//           </>
//         )}
//         {this.state.connectionState === false ? (
//           <View style={styles.offlineStyle}>
//             <Image source={offline} style={styles.networkIssue} />
//           </View>
//         ) : null}
//         {status !== 'Approved' ? (
//           <TouchableOpacity
//             style={styles.updateButton}
//             onPress={this.handleEdit}>
//             <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
//               Edit
//             </Text>
//           </TouchableOpacity>
//         ) : null}
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   networkIssue: {
//     height: hp(50),
//     aspectRatio: 1 / 1,
//   },
//   offlineStyle: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fromDateFieldContainer: {
//     height: hp(5.5),
//     paddingHorizontal: wp(3),
//     borderRadius: 5,
//     fontSize: wp(3),
//     color: '#333',
//     borderWidth: 1,
//     borderColor: '#ccc8',
//     marginBottom: wp(3),
//     justifyContent: 'center',
//   },
//   pickerInput: {
//     fontSize: wp(3),
//     width: wp(96),
//     marginHorizontal: 0,
//     left: wp(-4),
//   },
//   listContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: wp(1),
//   },
//   inputField: {
//     flex: 1,
//     height: hp(5.5),
//     paddingHorizontal: wp(4),
//     borderRadius: 5,
//     fontSize: wp(3.5),
//     color: '#333',
//     borderWidth: 1,
//     borderColor: '#ccc8',
//     marginBottom: wp(3),
//   },
//   //   updateButton: {
//   //     backgroundColor: '#0077a2',
//   //     flex: 1,
//   //     height: hp(5.5),
//   //     alignItems: 'center',
//   //     justifyContent: 'center',
//   //     borderRadius: 3,
//   //   },
//   updateButton: {
//     backgroundColor: '#0077a2',
//     height: hp(5.5),
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 3,
//     margin: wp(2),
//   },
//   iconColumn: {
//     height: hp(3.2),
//     aspectRatio: 1 / 1,
//   },
// });
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from '../styles/BasicStyles';
import ic_download_new from '../assets/icons/ic_download.png';

const ITListComponent = props => {
  const {item} = props;

  const {
    declaration_name,
    financial_year,
    status,
    id,
    employee_id,
    employee_name,
    // declaration_name,
    // financial_year,
    section,
    max_limit,
    amount,
    notes,
    // status,
    image,
    submitted_on,
    verified,
  } = item;

  const handleDetail = () => {
    props.nav.navigate('ITDeclarationsDetail', {
      item,
      refreshHandler: refreshHandler,
    });
  };

  const refreshHandler = () => {
    props.fetchDeclarationData();
  };
  const handleDownload = async () => {
    const {image: link} = item;
    try {
      Linking.openURL(link);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <View style={styles.container}>
        {/* <Text style={[basicStyles.textSmall, basicStyles.grayColor]}>
          {submitted_on}
        </Text> */}
        <View
          // onPress={this.handleDetail('showMore')}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: wp(1.5),
          }}>
          {/* <View style={basicStyles.flexOne}> */}
          {/* <Text style={basicStyles.heading}>{request_type}</Text> */}
          {/* <Text style={basicStyles.text}>{employee_name}</Text>
            <Text style={basicStyles.text}>{submitted_on}</Text> */}
          {/* </View> */}
          <View style={basicStyles.flexOne}>
            <Text style={basicStyles.heading}>{declaration_name}</Text>
          </View>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              paddingVertical: wp(1.5),
              paddingHorizontal: wp(3),
              backgroundColor:
                status === 'Pending'
                  ? '#0077a233'
                  : status === 'Approved'
                  ? '#4a970033'
                  : '#ff3f0033',
              fontSize: wp(3),
              color:
                status === 'Pending'
                  ? '#0077a2'
                  : status === 'Approved'
                  ? 'green'
                  : 'red',
              borderRadius: 3,
              fontWeight: '900',
            }}>
            {status}
          </Text>
        </View>

        <View
          style={[
            basicStyles.mainContainer,
            basicStyles.paddingHalf,
            {paddingTop: 0},
          ]}>
          <View style={styles.listContainer}>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3.5)},
              ]}>
              {notes}
            </Text>
          </View>
          {/* <View style={styles.listContainer}>
            <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Name
            </Text>
            <Text
              style={[
                {width: wp(5)},
                basicStyles.heading,
                //  basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              {employee_name}
            </Text>
          </View> */}

          {/* <View style={styles.listContainer}>
            <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Declaration
            </Text>
            <Text
              style={[
                {width: wp(5)},
                basicStyles.heading,
                //  basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              {declaration_name}
            </Text>
          </View> */}

          <View style={styles.listContainer}>
            <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Section
            </Text>
            <Text
              style={[
                {width: wp(5)},
                basicStyles.heading,
                //  basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              {section}
            </Text>
          </View>

          <View style={styles.listContainer}>
            <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Max Limit
            </Text>
            <Text
              style={[
                {width: wp(5)},
                basicStyles.heading,
                //  basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              {max_limit}
            </Text>
          </View>

          <View style={styles.listContainer}>
            <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Amount
            </Text>
            <Text
              style={[
                {width: wp(5)},
                basicStyles.heading,
                //  basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              {amount}
            </Text>
          </View>
          {/* <View style={styles.listContainer}>
            <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Verified
            </Text>
            <Text
              style={[
                {width: wp(5)},
                basicStyles.heading,
                //  basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              {verified}
            </Text>
          </View> */}
          {/* <View style={styles.listContainer}>
            <Text
              style={[basicStyles.heading, {width: wp(25), fontSize: wp(3.3)}]}>
              Notes
            </Text>
            <Text
              style={[
                {width: wp(5)},
                basicStyles.heading,
                //  basicStyles.textAlign,
              ]}>
              -
            </Text>
            <Text
              style={[
                basicStyles.text,
                basicStyles.flexTow,
                {fontSize: wp(3)},
              ]}>
              {notes}
            </Text>
          </View> */}
          {/* <View style={styles.listContainer}>
            
          </View> */}

          {image ? (
            <View style={styles.listContainer}>
              {/* <Text
                style={[
                  basicStyles.heading,
                  {width: wp(25), fontSize: wp(3.3)},
                ]}>
                Documents
              </Text>
              <Text
                style={[
                  basicStyles.heading,
                  {width: wp(5)},
                  // basicStyles.textAlign,
                ]}>
                -
              </Text> */}

              <TouchableOpacity
                onPress={handleDownload}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{backgroundColor: '#0077a2', borderRadius: wp(1)}}>
                <View
                  style={[
                    // basicStyles.flexTow,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: wp(2),
                      paddingVertical: wp(1),
                    },
                  ]}>
                  <Image
                    source={require('../assets/icons/downloadbutton.png')}
                    style={styles.iconColumn}
                  />
                  <Text
                    style={[
                      basicStyles.text,

                      // eslint-disable-next-line react-native/no-inline-styles
                      {fontSize: wp(3), color: '#fff', marginLeft: wp(1)},
                    ]}>
                    Download
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: wp(3),
            }}>
            <Text
              style={[
                styles.dateTextStyle,
                {marginBottom: wp(-1.9), fontSize: wp(3)},
              ]}>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{fontWeight: 'bold', color: '#000', fontSize: wp(3)}}>
                ID :
              </Text>{' '}
              {id}
            </Text>
            <Text
              style={[
                styles.dateTextStyle,
                {marginBottom: wp(-1.9), fontSize: wp(3)},
              ]}>
              <Text style={[basicStyles.textBold, {fontSize: wp(3)}]}>
                Applied On :
              </Text>{' '}
              {submitted_on}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};
export default ITListComponent;
const styles = StyleSheet.create({
  container: {
    padding: wp(2),
    paddingVertical: wp(3),
    backgroundColor: '#fff',
    borderRadius: 5,
    // marginBottom: wp(2),
    // flexDirection: 'row',
    // alignItems: 'center',
    elevation: 3,
  },
  // pendingBtn: {
  //   paddingVertical: wp(1.5),
  //   paddingHorizontal: wp(3),
  //   backgroundColor: '#0077a2',
  //   fontSize: wp(3),
  //   color: '#fff',
  //   borderRadius: 3,
  // },

  fromDateFieldContainer: {
    height: hp(5.5),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
    justifyContent: 'center',
  },
  pickerInput: {
    fontSize: wp(3),
    width: wp(96),
    marginHorizontal: 0,
    left: wp(-4),
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(1),
  },
  inputField: {
    flex: 1,
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3.5),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc8',
    marginBottom: wp(3),
  },

  iconColumn: {
    height: hp(2),
    width: wp(2),
  },
  editBtn: {
    marginTop: wp(2),
    paddingVertical: wp(1.5),
    paddingHorizontal: wp(5),
    backgroundColor: '#0077a2',
    borderRadius: 3,
    alignSelf: 'center',
  },
});
