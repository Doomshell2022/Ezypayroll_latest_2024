import React from 'react';
import {View, Image, ScrollView, StyleSheet, Alert} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import SafeAreaView from 'react-native-safe-area-view';

// Colors
import {colors} from '../assets/colors/colors';

// Screens
import LoginScreen from '../screens/LoginScreen';
import LoginScreenNew from '../screens/LoginScreenNew';
import OtpScreen from '../screens/OtpScreen';
import EnterPinScreen from '../screens/EnterPinScreen';
import ConfirmPinScreen from '../screens/ConfirmPinScreen';
import HomeScreen from '../screens/HomeScreen';
import PayslipScreen from '../screens/PayslipScreen';
import HolidaysListScreen from '../screens/HolidaysListScreen';
import SecurityPinScreen from '../screens/SecurityPinScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

// Profile Navigator
import ProfileScreen from '../screens/ProfileScreen';
import PersonalDetailsScreen from '../screens/PersonalDetailsScreen';
import OfficialDetailsScreen from '../screens/OfficialDetailsScreen';
import AddressInfoScreen from '../screens/AddressInfoScreen';
import SalaryDetailsScreen from '../screens/SalaryDetailsScreen';
import PfEsiScreen from '../screens/PfEsiScreen';
import FamilyInfoScreen from '../screens/FamilyInfoScreen';
import AdditionalInfoScreen from '../screens/AdditionalInfoScreen';
import BankInfoScreen from '../screens/BankInfoScreen';
import EmploymentHistoryScreen from '../screens/EmploymentHistoryScreen';
import LicenseInformationScreen from '../screens/LicenseInformationScreen';
import DocumentInfoScreen from '../screens/DocumentInfoScreen';
import EducationformationScreen from '../screens/EducationformationScreen';
import SkillsInformationScreen from '../screens/SkillsInformationScreen';
import CertificationInformationScreen from '../screens/CertificationInformationScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import LeaveInfoScreen from '../screens/LeaveInfoScreen';

// Leaves Holidays Navigator
import AbsentReportScreen from '../screens/AbsentReportScreen';
import LeaveTypeScreen from '../screens/LeaveTypeScreen';
import ApplyLeaveScreen from '../screens/ApplyLeaveScreen';
import ApplyLeaveEditScreen from '../screens/ApplyLeaveEditScreen';
import AppliedLeaveDetailScreen from '../screens/AppliedLeaveDetailScreen';
import LeaveBalanceScreen from '../screens/LeaveBalanceScreen';

// Leaves Holidays Navigator
import OldPinScreen from '../screens/OldPinScreen';
import NewPinScreen from '../screens/NewPinScreen';
import ConfirmNewPinScreen from '../screens/ConfirmNewPinScreen';

// Expenses Screens
import ExpensesScreen from '../screens/ExpensesScreen';
import ExpensesHistoryScreen from '../screens/ExpensesHistoryScreen';
import AddMap from '../screens/AddMap';

// Images
import logo_all_white from '../assets/images/logo_black.png';
import drawer_ic_dashboard from '../assets/icons/ic_drawer_home.png';
import drawer_ic_leave from '../assets/icons/ic_drawer_leaves.png';
import drawer_ic_holiday from '../assets/icons/ic_drawer_holidays.png';
import drawer_ic_payslip from '../assets/icons/ic_drawer_payslips.png';
import drawer_ic_profile from '../assets/icons/ic_drawer_profile.png';
import drawer_ic_logout from '../assets/icons/ic_drawer_logout.png';
import drawer_ic_notification from '../assets/icons/ic_notification_black.png';
import applied_leaves from '../assets/icons/ic_drawer_attendance.png';
import ic_expensese from '../assets/icons/ic_drawer_expenses.png';
import ic_exp_list from '../assets/icons/ic_drawer_expenses_report.png';
import ic_hr_request2 from '../assets/icons/ic_hr_request2.png';
import ic_IT from '../assets/icons/ic_IT.png';
import ic_support from '../assets/icons/ic_support.png';
import padlock from '../assets/icons/padlock.png';

// Drawer
import ad_ic_home_active from '../assets/icons/ad_ic_home_active.png';
import ad_ic_home from '../assets/icons/ad_ic_home.png';
import ad_ic_leaves_active from '../assets/icons/ad_ic_leaves_active.png';
import ad_ic_leaves from '../assets/icons/ad_ic_leaves.png';
import ad_ic_attendance_active from '../assets/icons/ad_ic_attendance_active.png';
import ad_ic_attendance from '../assets/icons/ad_ic_attendance.png';
import ic_calendar1 from '../assets/icons/ic_calendar1.png';
import ad_ic_hr_active from '../assets/icons/ad_ic_hr_active.png';
import ad_ic_hr from '../assets/icons/ad_ic_hr.png';
import ad_ic_profile_active from '../assets/icons/ad_ic_profile_active.png';
import ad_ic_profile from '../assets/icons/ad_ic_profile.png';

// My IT Declarations
import MyITDeclarationsScreen from '../screens/MyITDeclarationsScreen';
import AddITDeclarationsScreen from '../screens/AddITDeclarationsScreen';
import ITDeclarationsDetailScreen from '../screens/ITDeclarationsDetailScreen';
import EditITDeclarationsScreen from '../screens/EditITDeclarationsScreen';

// HR Request
import HrRequestScreen from '../screens/HrRequestScreen';
import AddHrRequestScreen from '../screens/AddHrRequestScreen';
import HrRequestDetailScreen from '../screens/HrRequestDetailScreen';
import AddPresent from '../screens/AddPresent';

// Admin Screens
import AdminHomeScreen from '../screens/Admin/AdminHome';
import AdminHrRequests from '../screens/Admin/AdminHrRequestsCompleted';
import AdminLeaves from '../screens/Admin/AdminLeaves';
import AdminAttendanceReport from '../screens/Admin/AdminAttendanceReport';
import AdminProfile from '../screens/Admin/AdminProfile';
import AdminNotification from '../screens/Admin/AdminNotification';

// Support
import SupportScreen from '../screens/SupportScreen';

// User Preference
import {clearData} from '../api/UserPreference';
import ForgotPassword from '../screens/ForgotPasswordScreen';
import UpdateUserPhoto from '../screens/UpdateUserPhoto';
import HrPendingComponent from '../components/HrPendingComponent';
import DailyAttendence from '../screens/Admin/DailyAttendnceScreen';
import DailyAttendance from '../screens/DailyAttendance';
import ItDeclarationRequest from '../screens/Admin/ItDeclarationRequest';
import AdminExpenses from '../screens/Admin/AdminExpenses';
import EmployeeAttendance from '../screens/Admin/EmployeeAttendance';
import AdminAttendanceEmployee from '../screens/Admin/adminEmployeeAttendance';
import AdminHrRequest from '../screens/Admin/AdminHrRequest';
import AdminExpense from '../screens/Admin/Adminexpense';

// Style Sheet
const {lightBluePrimary} = colors;

// Style Sheet
const styles = StyleSheet.create({
  drawerItemIcon: {
    height: wp(4.5),
    aspectRatio: 1 / 1,
  },
  drawerContentContainer: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#f2f1f1',
    alignItems: 'center',
    padding: wp(2),
  },
  headerLogo: {
    height: wp(15),
    aspectRatio: 2 / 1,
  },

  drawerLabel: {
    fontSize: wp(3.5),
    fontWeight: '400',
    color: '#424242',
    marginLeft: wp(3),
  },
});

const setDrawerItemIcon = itemIcon => ({
  drawerIcon: (
    <Image source={itemIcon} resizeMode="cover" style={styles.drawerItemIcon} />
  ),
});

const drawerContentContainerInset = {
  top: 'always',
  horizontal: 'never',
};

const onLogoutYesPress = navigation => async () => {
  try {
    // Clearing user preferences from local storage
    await clearData();

    // Resetting Navigation to initial state for login again
    navigation.navigate('LoggedOut');
  } catch (error) {
    console.log(error.message);
  }
};

const onDrawerItemPress = props => route => {
  if (route.route.routeName !== 'Logout') {
    props.onItemPress(route);
    return;
  }
  // If 'Logout' route pressed
  props.navigation.closeDrawer();

  Alert.alert(
    'Logout',
    'Are you sure, you want to logout?',
    [
      {text: 'NO', style: 'cancel'},
      {text: 'YES', onPress: onLogoutYesPress(props.navigation)},
    ],
    {
      cancelable: false,
    },
  );
};

const CustomDrawerContentComponent = props => (
  <ScrollView>
    <SafeAreaView
      forceInset={drawerContentContainerInset}
      style={styles.drawerContentContainer}>
      <View style={styles.drawerHeader}>
        <Image source={logo_all_white} style={styles.headerLogo} />
      </View>

      <DrawerItems
        {...props}
        onItemPress={onDrawerItemPress(props)}
        activeTintColor="#fff"
        labelStyle={styles.drawerLabel}
      />
    </SafeAreaView>
  </ScrollView>
);

const LoggedOutNavigator = createStackNavigator(
  {
    Login: LoginScreenNew,
    ForgotPassword: ForgotPassword,
    Otp: OtpScreen,
    EnterPin: EnterPinScreen,
    ConfirmPin: ConfirmPinScreen,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
    detachInactiveScreens: true,
  },
);

const AppliedLeaveNavigator = createStackNavigator(
  {
    // Leave: AbsentReportScreen,
    AppliedLeave: AppliedLeaveDetailScreen,
    ApplyLeave: ApplyLeaveScreen,
    LeavesType: LeaveTypeScreen,
    LeaveBalance: LeaveBalanceScreen,
    ApplyLeaveEdit: ApplyLeaveEditScreen,
  },
  {
    initialRouteName: 'AppliedLeave',
    headerMode: 'none',
    detachInactiveScreens: true,
  },
);

const ExpensesNavigator = createStackNavigator(
  {
    Expenses: ExpensesScreen,
    ExpensesHistory: ExpensesHistoryScreen,
  },
  {
    initialRouteName: 'Expenses',
    headerMode: 'none',
    detachInactiveScreens: true,
  },
);

const MyProfileNavigator = createStackNavigator(
  {
    Profile: ProfileScreen,
    UpdateUserPhoto: UpdateUserPhoto,
    Personal: PersonalDetailsScreen,
    Office: OfficialDetailsScreen,
    AddressInfo: AddressInfoScreen,
    Salary: SalaryDetailsScreen,
    Provident: PfEsiScreen,
    FamilyInfo: FamilyInfoScreen,
    AdditionalInfo: AdditionalInfoScreen,
    BankInfo: BankInfoScreen,
    EmploymentHistory: EmploymentHistoryScreen,
    LicenseInformation: LicenseInformationScreen,
    DocumentInfo: DocumentInfoScreen,
    Educationformation: EducationformationScreen,
    SkillsInformation: SkillsInformationScreen,
    CertificationInfo: CertificationInformationScreen,
    UserInfo: UserInfoScreen,
    LeaveInfo: LeaveInfoScreen,
    OldPin: OldPinScreen,
    NewPin: NewPinScreen,
    ConfirmNewPin: ConfirmNewPinScreen,
  },
  {
    initialRouteName: 'Profile',
    headerMode: 'none',
    detachInactiveScreens: true,
  },
);

const MyITNavigator = createStackNavigator(
  {
    MyITDeclarations: MyITDeclarationsScreen,
    AddITDeclarations: AddITDeclarationsScreen,
    ITDeclarationsDetail: ITDeclarationsDetailScreen,
    EditITDeclarations: EditITDeclarationsScreen,
  },
  {
    initialRouteName: 'MyITDeclarations',
    headerMode: 'none',
    detachInactiveScreens: true,
  },
);

const HrRequestNavigator = createStackNavigator(
  {
    HrRequest: HrRequestScreen,
    AddHrRequest: AddHrRequestScreen,
    HrRequestDetail: HrRequestDetailScreen,
  },
  {
    initialRouteName: 'HrRequest',
    headerMode: 'none',
    detachInactiveScreens: true,
  },
);

const SupportNavigator = createStackNavigator(
  {
    Support: SupportScreen,
  },
  {
    initialRouteName: 'Support',
    headerMode: 'none',
    detachInactiveScreens: true,
  },
);

const AdminHomeNavigator = createStackNavigator(
  {
    AdminHomes: AdminHomeScreen,
    AdminNotification,
  },
  {
    initialRouteName: 'AdminHomes',
    headerMode: 'none',
    detachInactiveScreens: true,
  },
);

const LoggedInNavigator = createDrawerNavigator(
  {
    Dashboard: {
      screen: HomeScreen,
      navigationOptions: setDrawerItemIcon(drawer_ic_dashboard),
    },

    'My Profile': {
      screen: MyProfileNavigator,
      navigationOptions: setDrawerItemIcon(drawer_ic_profile),
    },

    'My PaySlips': {
      screen: PayslipScreen,
      navigationOptions: setDrawerItemIcon(drawer_ic_payslip),
    },

    'My IT Declarations': {
      screen: MyITNavigator,
      navigationOptions: setDrawerItemIcon(ic_IT),
    },

    Attendance: {
      screen: DailyAttendance,
      navigationOptions: setDrawerItemIcon(applied_leaves),
    },

    // Attendance: {
    //   screen: AbsentReportScreen,
    //   navigationOptions: setDrawerItemIcon(applied_leaves),
    // },

    Leaves: {
      screen: AppliedLeaveNavigator,
      navigationOptions: setDrawerItemIcon(drawer_ic_leave),
    },

    'HR Request': {
      screen: HrRequestNavigator,
      navigationOptions: setDrawerItemIcon(ic_hr_request2),
    },

    Holidays: {
      screen: HolidaysListScreen,
      navigationOptions: setDrawerItemIcon(drawer_ic_holiday),
    },
    Expenses: {
      screen: ExpensesNavigator,
      navigationOptions: setDrawerItemIcon(ic_expensese),
    },
    // 'Expenses Report': {
    //   screen: ExpensesHistoryScreen,
    //   navigationOptions: setDrawerItemIcon(ic_exp_list),
    // },
    Notification: {
      screen: NotificationScreen,
      navigationOptions: setDrawerItemIcon(drawer_ic_notification),
    },
    Support: {
      screen: SupportNavigator,
      navigationOptions: setDrawerItemIcon(ic_support),
    },
    'Change Password': {
      screen: ChangePasswordScreen,
      navigationOptions: setDrawerItemIcon(padlock),
    },
    Logout: {
      screen: 'No Screen',
      navigationOptions: setDrawerItemIcon(drawer_ic_logout),
    },
    /*  addpre: {
      screen: AddPresent,
      navigationOptions: setDrawerItemIcon(drawer_ic_logout),
    },
    addmap: {
      screen: AddMap,
      navigationOptions: setDrawerItemIcon(drawer_ic_logout),
    }, */
  },
  {
    initialRouteName: 'Dashboard',
    unmountInactiveRoutes: true,
    detachInactiveScreens: true,
    contentComponent: CustomDrawerContentComponent,
  },
);

const AdminNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AdminHomeNavigator,
      navigationOptions: setDrawerItemIcon(ad_ic_home),
    },

    'HR Requests': {
      screen: AdminHrRequest,
      navigationOptions: setDrawerItemIcon(ad_ic_hr),
    },

    Leaves: {
      screen: AdminLeaves,
      navigationOptions: setDrawerItemIcon(ad_ic_leaves),
    },

    // Attendance: {
    //   screen: AdminAttendanceReport,
    //   navigationOptions: setDrawerItemIcon(ad_ic_attendance),
    // },

    'IT Declarations': {
      screen: ItDeclarationRequest,
      navigationOptions: setDrawerItemIcon(ic_IT),
    },
    'Daily Attendance': {
      screen: DailyAttendence,
      navigationOptions: setDrawerItemIcon(ic_calendar1),
    },
    'Employee Attendance': {
      screen: AdminAttendanceEmployee,
      navigationOptions: setDrawerItemIcon(ic_calendar1),
    },
    Notification: {
      screen: AdminNotification,
      navigationOptions: setDrawerItemIcon(drawer_ic_notification),
    },
    Expenses: {
      // screen: AdminExpenses,
      screen: AdminExpense,
      navigationOptions: setDrawerItemIcon(ic_expensese),
    },
    Holidays: {
      screen: HolidaysListScreen,
      navigationOptions: setDrawerItemIcon(drawer_ic_holiday),
    },
    Profile: {
      screen: AdminProfile,
      navigationOptions: setDrawerItemIcon(ad_ic_profile),
    },
    'Change Password': {
      screen: ChangePasswordScreen,
      navigationOptions: setDrawerItemIcon(padlock),
    },
    Logout: {
      screen: 'No Screen',
      navigationOptions: setDrawerItemIcon(drawer_ic_logout),
    },
  },
  {
    initialRouteName: 'Home',
    unmountInactiveRoutes: true,
    detachInactiveScreens: true,
    contentComponent: CustomDrawerContentComponent,
  },
);

// const AdminNavigators = createSwitchNavigator(
//   {
//     AdminHome: AdminHomeScreen,
//     AdminHrRequests,
//     AdminLeaves,
//     AdminAttendance: AdminAttendanceReport,
//     AdminProfile,
//     AdminNotification,
//   },
//   {
//     initialRouteName: 'AdminHome',
//     headerMode: 'none',
//   },
// );

const StartNavigator = createStackNavigator(
  {
    SecurityPin: SecurityPinScreen,
    LoggedIn: LoggedInNavigator,
  },
  {
    initialRouteName: 'SecurityPin',
    headerMode: 'none',
    detachInactiveScreens: true,
  },
);

export const createRootNavigator = userInfo => {
  const ROUTES = {
    LoggedOut: LoggedOutNavigator,
    StartNavigator: StartNavigator,
    LoggedInAdmin: AdminNavigator,
  };

  let initialRouteName = 'LoggedOut';

  if (userInfo) {
    initialRouteName = 'StartNavigator';
  }

  return createSwitchNavigator(ROUTES, {initialRouteName});
};
