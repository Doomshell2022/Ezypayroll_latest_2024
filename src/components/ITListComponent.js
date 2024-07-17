// import React, {Component} from 'react';
// import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import basicStyles from '../styles/BasicStyles';

// const ITListComponent = (props) => {
//   const {item} = props;

//   const {declaration_name, financial_year, status} = item;

//   const handleDetail = () => {
//     props.nav.navigate('ITDeclarationsDetail', {
//       item,
//       refreshHandler: refreshHandler,
//     });
//   };

//   const refreshHandler = () => {
//     props.fetchDeclarationData();
//   };

//   return (
//     <TouchableOpacity style={styles.listContainer} onPress={handleDetail}>
//       <View style={basicStyles.flexOne}>
//         <Text style={basicStyles.heading}>{declaration_name}</Text>
//         <Text style={basicStyles.text}>{financial_year}</Text>
//       </View>
//       <Text style={styles.pendingBtn}>{status}</Text>
//     </TouchableOpacity>
//   );
// };

// export default ITListComponent;

// const styles = StyleSheet.create({
//   listContainer: {
//     padding: wp(2),
//     paddingVertical: wp(3),
//     backgroundColor: '#fff',
//     // marginBottom: wp(2),
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 3,
//   },
//   pendingBtn: {
//     paddingVertical: wp(1.5),
//     paddingHorizontal: wp(3),
//     backgroundColor: '#0077a2',
//     fontSize: wp(3),
//     color: '#fff',
//     borderRadius: 3,
//   },
// });
