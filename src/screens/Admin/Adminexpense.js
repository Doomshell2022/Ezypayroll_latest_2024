import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//  Components
import HeadersComponent from '../../components/HeadersComponent';
import ProcessingLoader from '../../components/ProcessingLoader';
import {showToast} from '../../components/ToastComponent';

// Icons
import background from '../../assets/images/background.png';

// Tabs
import ExAllTab from '../../screens/ExAllTab';
import AdminLeavesApproved from './AdminLeavesApproved';
import AdminLeavesPending from './AdminLeavesPending';
import Footer from '../../components/Footer';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../../assets/icons/internetConnectionState.gif';
import RejectedAdminLeave from '../../components/AdminLeavesRejected';
import AdminHrequestApproved from '../../components/AdminHRrequestApproved';
import AdminHrequestPending from '../../components/AdminHrRequestPending';
import AdminHrequestRejected from '../../components/AdminHrRequestRejected';
import AdminExpensesApproved from '../../components/AdminExpensesApproved';
import AdminExpensesPending from '../../components/AdminExpensesPending';
import AdminExpensesRejected from '../../components/AdminExpensesRejected';
export default class AdminExpense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabView: {
        index: 0,
        routes: [
          {
            key: 'Pending',
            title: 'Pending',
          },
          {
            key: 'Approved',
            title: 'Approved',
          },
          {
            key: 'Rejected',
            title: 'Rejected',
          },
        ],
      },
      connectionState: true,
    };
    // configuring TabView
    const window = Dimensions.get('window');
    const {width} = window;
    this.initialLayout = {width};

    // SceneMap routes
    const {navigation} = this.props;

    const ApprovedRoute = () => (
      <AdminExpensesApproved
        nav={navigation}
        handleTabChange={this.handleTabIndexChange}
      />
    );

    const PendingRoute = () => (
      <AdminExpensesPending
        nav={navigation}
        handleTabChange={this.handleTabIndexChange}
      />
    );
    const RejectedRoute = () => (
      <AdminExpensesRejected
        nav={navigation}
        handleTabChange={this.handleTabIndexChange}
      />
    );
    this.sceneMap = SceneMap({
      Pending: PendingRoute,
      Rejected: RejectedRoute,
      Approved: ApprovedRoute,
    });
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleTabIndexChange = index => {
    const tabView = {
      ...this.state.tabView,
      index,
    };
    this.setState({tabView});
  };

  renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabBarIndicator}
      labelStyle={styles.tabBarLabel}
      style={styles.tabBarStyle}
      activeColor="#fff"
    />
  );

  render() {
    const {sceneMap, handleTabIndexChange, initialLayout, state} = this;
    const {tabView} = state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <ImageBackground
              source={background}
              resizeMode="cover"
              style={styles.container}>
              <HeadersComponent
                title="Expenses"
                // navAction="HomeBack"
                nav={this.props.navigation}
                //   showNotificationIcon
                //   notificationCount={notificationCount}
              />
              <View style={styles.mailContainer}>
                <TabView
                  initialLayout={initialLayout}
                  navigationState={tabView}
                  renderScene={sceneMap}
                  onIndexChange={handleTabIndexChange}
                  renderTabBar={this.renderTabBar}
                />
              </View>
              {/* <Footer tab="Leaves" nav={this.props.navigation} /> */}
            </ImageBackground>
          </>
        )}
        {this.state.connectionState === false ? (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  mailContainer: {
    flex: 1,
  },
  tabBarIndicator: {
    backgroundColor: '#fff',
  },
  tabBarStyle: {
    backgroundColor: '#0077a2',
  },
  tabBarLabel: {
    color: '#fff',
    fontSize: wp(3.5),
    textTransform: 'capitalize',
  },
});
