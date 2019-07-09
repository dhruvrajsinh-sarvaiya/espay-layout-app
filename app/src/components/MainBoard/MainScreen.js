import React, { Component } from 'react';
import { View, YellowBox, Platform, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { IndicatorViewPager, PagerTabIndicator } from 'rn-viewpager'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { changeTheme, addListener } from '../../controllers/CommonUtils';
import TradingDashboard from '../Trading/TradingDashboard';
import MarketListScreen from '../Trading/MarketListScreen';
import { isCurrentScreen } from '../Navigation';
import { Fonts, Events, ServiceUtilConstant } from '../../controllers/Constants';
import BuySellTradeScreen from '../Trading/BuySellTradeScreen';
import R from '../../native_theme/R';
import NavigationDrawer from './NavigationDrawer';
import DiscoverScreen from '../Discover/DiscoverScreen';
import MarginMarketListScreen from '../Margin/trading/MarginMarketListScreen';
import MarginBuySellTradeScreen from '../Margin/trading/MarginBuySellTradeScreen';
import SignalRWidget from '../Trading/SignalRWidget';
import { getData } from '../../App';
import SafeView from '../../native_theme/components/SafeView';
import { refreshToken } from '../../actions/Login/AuthorizeToken';
import DeviceInfo from 'react-native-device-info';

YellowBox.ignoreWarnings(['Setting a timer']);

class MainScreen extends Component {

    static navigationOptions = ({ navigation: { state } }) => {

        let isPortrait = state.params && state.params.isPortrait;

        return {
            drawerLockMode: isPortrait ? 'unlocked' : 'locked-closed'
        }
    }

    constructor(props) {
        super(props);

        // Reference of Views
        this.bottomMenuPager = React.createRef();

        // Bind method
        this.onPageScroll = this.onPageScroll.bind(this);

        this.setDrawer(Dimensions.get('window'));

        this.state = {
            position: 0, //Initial Bottom Menu's position to display first page
            isTablet: DeviceInfo.isTablet(),
            ...Dimensions.get('window'),
        }
    }

    // To enable and disable drawer based on orientation
    setDrawer({ width, height }) {
        // to close drawer in landscape mode
        width > height && this.props.navigation.closeDrawer();
        this.props.navigation.setParams({ isPortrait: width < height });
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //To listen for which page to display from Main Screen
        this.listenerMoveToMainScreen = addListener(Events.MoveToMainScreen, (page) => {
            if (this.bottomMenuPager) {
                this.bottomMenuPager.setPage(page)
            }
        })

        // To call Refresh token method at 13 minutes interval
        this.refreshTokenInterval = setInterval(() => this.props.refreshToken(), ServiceUtilConstant.refreshTokenInterval * 60000);

        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, (data) => {
            this.setDrawer(data);
            this.setState(Object.assign({}, this.state, data))
        });
    };

    componentWillUnmount() {

        // if move to main screen is not null then remove it on unmount screen
        if (this.listenerMoveToMainScreen) {
            this.listenerMoveToMainScreen.remove();
        }

        // if refresh token interval is not null then clear it on unmount screen
        if (this.refreshTokenInterval) {
            clearInterval(this.refreshTokenInterval);
        }

        if (this.dimensionListener) {

            // remove listener of dimensions
            this.dimensionListener.remove();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme
            || this.props.preference.locale !== nextProps.preference.locale
            || this.state.width !== nextState.width) {
            return true;
        } else {
            return isCurrentScreen(nextProps);
        }
    };

    onPageScroll(scrollData) {
        let { position } = scrollData

        // if previous and current position is different
        if (this.state.position != position) {

            // store final position in state
            this.setState({ position: position });
        }
    }

    render() {

        //Change Language Forcefully if not changed
        if (R.strings.getLanguage() !== this.props.preference.locale) {
            R.strings.setLanguage(this.props.preference.locale);
        }

        //Change Theme Forcefully if not changed
        if (R.colors.getTheme() !== this.props.preference.theme) {
            R.colors.setTheme(this.props.preference.theme);
        }

        // to set true if width is smaller than height
        let isPortrait = (!this.state.isTablet || this.state.width < this.state.height);

        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>

                {this.state.width > this.state.height && <NavigationDrawer
                    width={this.state.width * 35 / 100}
                    navigation={this.props.navigation} />}

                <SafeView style={[this.styles().container, { width: this.state.width * (isPortrait ? 100 : 65) / 100 }]}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* signalR background code */}
                    <SignalRWidget />

                    <IndicatorViewPager
                        ref={cmp => this.bottomMenuPager = cmp}
                        style={{ flex: 1 }}
                        indicator={this.renderTabIndicator()}
                        scrollEnabled={false}
                        horizontalScroll={false}
                        onPageScroll={this.onPageScroll}
                        initialPage={0}>

                        {/* Home */}
                        <View key={'0'}>
                            <TradingDashboard
                                navigation={this.props.navigation}
                                shouldDisplay={this.state.position == 0} />
                        </View>

                        {/* Market, added overflow style so nested viewpager items won't appear on main viewpager scroll */}
                        <View key={'1'} style={{ overflow: 'hidden' }}>
                            {getData(ServiceUtilConstant.KEY_IsMargin) ?
                                <MarginMarketListScreen
                                    navigation={this.props.navigation}
                                    shouldDisplay={this.state.position == 1} /> :
                                <MarketListScreen
                                    navigation={this.props.navigation}
                                    shouldDisplay={this.state.position == 1} />
                            }
                        </View>

                        {/* Trading Buy/ Sell */}
                        <View key={'2'}>
                            {getData(ServiceUtilConstant.KEY_IsMargin) ?
                                <MarginBuySellTradeScreen
                                    navigation={this.props.navigation}
                                    shouldDisplay={this.state.position == 2} /> :
                                <BuySellTradeScreen
                                    navigation={this.props.navigation}
                                    shouldDisplay={this.state.position == 2} />
                            }
                        </View>

                        {/* Discover */}
                        <View key={'3'}>
                            <DiscoverScreen
                                navigation={this.props.navigation}
                                shouldDisplay={this.state.position == 3} />
                        </View>

                    </IndicatorViewPager>
                </SafeView>
            </View>
        );
    }

    renderTabIndicator() {
        let tabs = [
            {
                text: R.strings.homeTitle,
                iconSource: R.images.IC_HOME,
                selectedIconSource: R.images.IC_HOME
            },
            {
                text: R.strings.marketTitle,
                iconSource: R.images.IC_MARKETS,
                selectedIconSource: R.images.IC_MARKETS
            },
            {
                text: R.strings.tradesTitle,
                iconSource: R.images.IC_GRADIENT_TRADE,
                selectedIconSource: R.images.IC_GRADIENT_TRADE
            },
            {
                text: R.strings.Discover,
                iconSource: R.images.IC_GRADIANT_COMPASS,
                selectedIconSource: R.images.IC_GRADIANT_COMPASS
            },
            /* {
                text: R.strings.Balance,
                iconSource: R.images.IC_GRADIANT_CARD,
                selectedIconSource: R.images.IC_GRADIANT_CARD
            } */
        ]
        return (
            <PagerTabIndicator
                style={{
                    borderTopWidth: 0,
                    height: R.dimens.ToolbarHeights,
                    paddingTop: 0,
                    paddingBottom: 0,
                    ...Platform.select({
                        ios: {
                            backgroundColor: R.colors.background,
                            shadowOffset: { width: 0, height: -R.dimens.toastElevation },
                            shadowColor: 'rgba(0,0,0,0.2)',
                            shadowOpacity: 1,
                        },
                        android: {
                            backgroundColor: R.colors.bottomMenuBackground,
                        }
                    })

                }}
                iconStyle={this.styles().tabIcon}
                selectedIconStyle={this.styles().selectedTabIcon}
                textStyle={this.styles().tabTxt}
                selectedTextStyle={this.styles().selectedTabTxt}
                itemStyle={this.styles().tabItem}
                selectedItemStyle={this.styles().selectedTabItem}
                tabs={tabs}
            />
        )
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
            tabIcon: {
                width: R.dimens.dashboardMenuIcon,
                height: R.dimens.dashboardMenuIcon,
                tintColor: R.colors.bottomMenuUnselectedIcon,
                resizeMode: 'contain'
            },
            selectedTabIcon: {
                width: R.dimens.dashboardMenuIcon,
                height: R.dimens.dashboardMenuIcon,
                resizeMode: 'contain'
            },
            tabTxt: {
                color: R.colors.bottomMenuUnselectedIcon,
                fontFamily: Fonts.MontserratSemiBold,
                marginTop: 0,
                fontSize: R.dimens.dashboardTabText
            },
            selectedTabTxt: {
                color: R.colors.accent,
                fontFamily: Fonts.MontserratSemiBold,
                marginTop: 0,
                fontSize: R.dimens.dashboardSelectedTabText
            },
            tabItem: {
                justifyContent: 'space-between',
                paddingBottom: R.dimens.widget_top_bottom_margin,
                paddingTop: R.dimens.dashboardPaddingTop
            },
            selectedTabItem: {
                justifyContent: 'space-between',
                paddingBottom: R.dimens.widget_top_bottom_margin,
                paddingTop: R.dimens.dashboardSelecetedPaddingTop
            }
        }
    }
}

const mapStateToProps = (state) => ({
    // updated state
    preference: state.preference,
})

const mapDispatchToProps = dispatch => ({
    // To perform action for refreshToken
    refreshToken: () => dispatch(refreshToken())
})

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);