import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isInternet } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import R from '../../../native_theme/R';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import CustomCard from '../../widget/CustomCard';
import DashboardHeader from '../../widget/DashboardHeader';
import SafeView from '../../../native_theme/components/SafeView';
const { width } = R.screen()

class ManageAccountDasboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: R.strings.personal_info, icon: R.images.IC_FILL_USER, id: 1 },
                { title: R.strings.ipWhitelisting, icon: R.images.IC_GLOBE, id: 2 },
                { title: R.strings.DeviceWhitelist, icon: R.images.IC_PHONE_LOCK, id: 3 },
                { title: R.strings.UserWallets, icon: R.images.IC_WALLET, id: 4 },
                { title: R.strings.tradingHistory, icon: R.images.IC_TRADEUP, id: 5 },
                { title: R.strings.Withdraw_History, icon: R.images.ic_widgets, id: 6 },
                { title: R.strings.DepositHistory, icon: R.images.IC_DOWNLOAD, id: 7 },
                { title: R.strings.configuredLimits, icon: R.images.IC_KEYBOARD, id: 9 },
                { title: R.strings.Login_History, icon: R.images.IC_CALENDAR_FILL, id: 10 },
                { title: R.strings.marginTradingHistory, icon: R.images.IC_WITHDRAW_HISTORY, id: 12 },
                { title: R.strings.socialTradingHistory, icon: R.images.ic_list_alt, id: 14 },
            ],
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    async onPress(id) {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Redirect screen based on card select
            if (id === 1) {
                this.props.navigation.navigate('PersonalInfo')
            }
            else if (id === 2) {
                this.props.navigation.navigate('CommonDashboard', {
                    response: [
                        { id: 0, title: R.strings.ipList, icon: R.images.IC_VIEW_LIST, type: 1, navigate: 'IPWhitelistScreen' },
                        { id: 1, title: R.strings.allowIp, icon: R.images.IC_PLUS, type: 2, navigate: 'AddEditIPWhitelist' },
                    ], title: R.strings.ipWhitelisting
                })
            }
            else if (id === 3) {
                this.props.navigation.navigate('DeviceWhitelistScreen')
            }
            else if (id === 4) {
                this.props.navigation.navigate('UserWalletListScreen')
            }
            else if (id === 5) {
                this.props.navigation.navigate('UserTradingSummary')
            }
            else if (id === 6) {
                this.props.navigation.navigate('WithdrawReportScreen')
            }
            else if (id === 7) {
                this.props.navigation.navigate('DepositReportScreen')
            }
            else if (id === 9) {
                this.props.navigation.navigate('LimitConfigListScreen')
            }
            else if (id === 10) {
                this.props.navigation.navigate('LoginHistoryScreen')
            }
            else if (id === 12) {
                this.props.navigation.navigate('UserTradingSummary', { isMargin: true })
            }
            else if (id === 14) {
                this.props.navigation.navigate('SocialTradingHistoryScreen')
            }
        }
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* Statusbar */}
                <CommonStatusBar />

                {/* Set Toolbar */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.manageAccount}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    numColumns={this.state.isGrid ? 2 : 1}
                    data={this.state.response}
                    extraData={this.state}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                                value={item.title}
                                type={1}
                                icon={item.icon}
                                index={index}
                                size={this.state.response.length}
                                isGrid={this.state.isGrid}
                                viewHeight={this.state.viewHeight}
                                width={width}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                onPress={() => this.onPress(item.id)}
                            />
                        )
                    }}
                    keyExtractor={(_item, index) => index.toString()}
                />

                <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        icon={R.images.BACK_ARROW}
                        onPress={() => this.props.navigation.goBack()} />
                </View>
            </SafeView>
        );
    }
}

export default ManageAccountDasboard;