import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
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
import HeadersComponent from '../components/HeadersComponent';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/ToastComponent';

// Icons
import ic_drawer from '../assets/icons/ic_drawer.png';
// Tabs
import ExAllTab from '../screens/ExAllTab';
import ExApprovedTab from '../screens/ExApprovedTab';
import ExRejectedTab from '../screens/ExRejectedTab';
// network alert
import NetInfo from '@react-native-community/netinfo';
//gif
import offline from '../assets/icons/internetConnectionState.gif';
export default class ExpensesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionState: true,
      tabView: {
        index: 0,
        routes: [
          {
            key: 'All',
            title: 'All',
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
    };
    // configuring TabView
    const window = Dimensions.get('window');
    const {width} = window;
    this.initialLayout = {width};

    // SceneMap routes
    const {navigation} = this.props;

    const allRoute = () => (
      <ExAllTab
        nav={navigation}
        handleTabChange={this.handleTabIndexChange}
        toggleProcessingLoader={this.toggleProcessingLoader}
      />
    );

    const ApprovedRoute = () => (
      <ExApprovedTab
        nav={navigation}
        handleTabChange={this.handleTabIndexChange}
      />
    );

    const RejectedRoute = () => (
      <ExRejectedTab
        nav={navigation}
        handleTabChange={this.handleTabIndexChange}
      />
    );

    this.sceneMap = SceneMap({
      All: allRoute,
      Approved: ApprovedRoute,
      Rejected: RejectedRoute,
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
      inactiveColor="#ccc"
    />
  );

  render() {
    const {sceneMap, handleTabIndexChange, initialLayout, state} = this;
    const {tabView} = state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeadersComponent
              title="Expenses"
              icon={ic_drawer}
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
    backgroundColor: '#f2f1f1',
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
