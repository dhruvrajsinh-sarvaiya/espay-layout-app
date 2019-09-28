import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme } from '../../controllers/CommonUtils';
import { isInternet } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../Navigation';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import ThemeToolbarWidget from '../widget/ThemeToolbarWidget';
import CustomCard from '../widget/CustomCard';
import DashboardHeader from '../widget/DashboardHeader';
import { getData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';
const { width } = R.screen()

class MyAccountDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: R.strings.Customers, icon: R.images.IC_ACCOUNT_MULTIPLE_PLUS, id: 1 },
                { title: R.strings.Reports, icon: R.images.IC_CHART, id: 2 },
                { title: R.strings.listKycVerify, icon: R.images.IC_VIEW_LIST, id: 3 },
                { title: R.strings.HelpAndSupport, icon: R.images.IC_QUESTION, id: 4 },
                { title: R.strings.slaConfiguration, icon: R.images.IC_ADJUST_FILLED, id: 5 },
                { title: R.strings.passwordPolicyConfiguration, icon: R.images.IC_LOCK, id: 6 },
                { title: R.strings.ipProfiling, icon: R.images.IC_LOCATION, id: 7 },
                { title: R.strings.socialTradingConfiguration, icon: R.images.IC_SHARE, id: 8 },
                { title: R.strings.profileConfiguration, icon: R.images.IC_FILL_USER, id: 9 },
                { title: R.strings.Security, icon: R.images.IC_SECURITY, id: 10 },
                { title: R.strings.manageAccount, icon: R.images.IC_USER, id: 11 },
                { title: R.strings.referralSystem, icon: R.images.IC_FILL_ROLES, id: 12 },
                { title: R.strings.affiliateManagement, icon: R.images.IC_DOLLAR, id: 13 },
                { title: R.strings.UserManagement, icon: R.images.IC_ACCOUNT_GROUP, id: 14 },
                { title: R.strings.enableDisable2fa, icon: R.images.IC_QRCODE, id: 15 },
                { title: R.strings.providerBalanceCheck, icon: R.images.ic_briefcase, id: 16 },
                { title: R.strings.conflictHistory, icon: R.images.IC_CHART, id: 17 },
            ],
        };
    }

    componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //chek current screen
        return isCurrentScreen(nextProps);
    }

    async onPress(id) {
        //To get the current feature state from preference
        let isGoogleAuth = getData(ServiceUtilConstant.KEY_GoogleAuth);

        //redirect screens based on card selected 
        //Check NetWork is Available or not
        if (await isInternet()) {
            if (id === 1) {
                this.props.navigation.navigate('CustomerDashboard')
            }
            else if (id === 2) {
                this.props.navigation.navigate('ReportsDashbord')
            }
            else if (id === 3) {
                this.props.navigation.navigate('KYCVerifyListScreen')
            }
            else if (id === 4) {
                this.props.navigation.navigate('HelpAndSupportDashboard')
            }
            else if (id === 5) {
                this.props.navigation.navigate('SlaSettingDash')
            }
            else if (id === 6) {
                this.props.navigation.navigate('PasswordPolicyDashboard')
            }
            else if (id === 7) {
                this.props.navigation.navigate('IpProfilingDash')
            }
            else if (id === 8) {
                this.props.navigation.navigate('CommonDashboard', {
                    response: [
                        { title: R.strings.leaderProfileConfig, icon: R.images.IC_FILL_CAP_USER, id: 0, type: 1, navigate: 'LeaderProfileConfigScreen' },
                        { title: R.strings.followerProfileConfig, icon: R.images.IC_USER, id: 1, type: 1, navigate: 'FollowerProfileConfigScreen' },
                    ], title: R.strings.socialTradPolicy
                })
            }
            else if (id === 9) {
                this.props.navigation.navigate('ProfileConfigDashboard')
            }
            else if (id === 10) {
                this.props.navigation.navigate('SecurityDashboard')
            }
            else if (id === 11) {
                this.props.navigation.navigate('ManageAccountDasboard')
            }
            else if (id === 12) {
                this.props.navigation.navigate('ReferralSystemDashboard')
            }
            else if (id === 13) {
                this.props.navigation.navigate('AffliateManagementDashboard')
            }
            else if (id === 14) {
                this.props.navigation.navigate('UserManagementDashboard')
            }
            else if (id === 15) {
                isGoogleAuth ?
                    this.props.navigation.navigate('DisableGoogleAuthenticator', { fromMyAccountDashboard: true }) : this.props.navigation.navigate('GoogleAuthenticatorDownloadApp', { screenName: 'MyAccountDashboard' })
            }
            else if (id === 16) {
                this.props.navigation.navigate('ProviderBalCheckScreen')
            }
            else if (id === 17) {
                this.props.navigation.navigate('ConflictHistoryScreen', { screenType: 1 })
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
                    isGrid={this.state.isGrid}
                    navigation={this.props.navigation} header={R.strings.myAccountTitle}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    numColumns={this.state.isGrid ? 2 : 1} data={this.state.response}  extraData={this.state}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                            width={width}
                                icon={item.icon}
                                value={item.title}
                                index={index}
                                isGrid={this.state.isGrid}
                                type={1}
                                viewHeight={this.state.viewHeight}
                                size={this.state.response.length}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                onPress={() => this.onPress(item.id)}
                            />

                        )
                    }} keyExtractor={(_item, index) => index.toString()}
                />

                <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        icon={R.images.BACK_ARROW} iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        onPress={() => this.props.navigation.goBack()} />

                </View>
            </SafeView>
        );
    }
}

export default MyAccountDashboard;