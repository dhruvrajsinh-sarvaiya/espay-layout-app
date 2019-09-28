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

class WalletReportDashboard extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: null, value: R.strings.withdrawalReport, icon: R.images.IC_CHART, id: 1 },
                { title: null, value: R.strings.deposit_report, icon: R.images.IC_CHART, id: 2 },
                { title: null, value: R.strings.transfer_in, icon: R.images.ic_tradedown, id: 3 },
                { title: null, value: R.strings.transfer_out, icon: R.images.IC_TRADEUP, id: 4 },
                { title: null, value: R.strings.Org_Ledger, icon: R.images.IC_PAGES, id: 5 },
                { title: null, value: R.strings.ChargeColloected, icon: R.images.IC_TERMS_CONDITION, id: 6 },
                { title: null, value: R.strings.admin_asset, icon: R.images.ic_fill_usd, id: 7 },
                { title: null, value: R.strings.daemon_addresses, icon: R.images.ic_confirmation_number, id: 8 },
                { title: null, value: R.strings.serviceProviderBalance, icon: R.images.ic_confirmation_number, id: 9 },
                { title: null, value: R.strings.stackingHistoryReport, icon: R.images.ic_confirmation_number, id: 10 },
                { title: null, value: R.strings.withdrawalApproval, icon: R.images.ic_confirmation_number, id: 11 },
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
        if (await isInternet()) {
            if (id === 1) {
                this.props.navigation.navigate('WithdrawReportScreen')
            }
            else if (id === 2) {
                this.props.navigation.navigate('DepositReportScreen')
            }
            else if (id === 3) {
                this.props.navigation.navigate('TransferInOutListScreen', { transferIn: true })
            }
            else if (id === 4) {
                this.props.navigation.navigate('TransferInOutListScreen', { transferIn: false })
            }
            else if (id === 5) {
                this.props.navigation.navigate('WalletOrganizationLedgerScreen')
            }
            else if (id === 6) {
                this.props.navigation.navigate('ChargesCollectedScreen')
            }
            else if (id === 7) {
                this.props.navigation.navigate('AdminAssetsListScreen')
            }
            else if (id === 8) {
                this.props.navigation.navigate('DaemonAddressScreen')
            }
            else if (id === 9) {
                this.props.navigation.navigate('ServiceProviderBalanceScreen')
            }
            else if (id === 10) {
                this.props.navigation.navigate('StackingHistoryScreen')
            }
            else if (id === 11) {
                this.props.navigation.navigate('WithdrawalApprovalListScreen')
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
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                    header={R.strings.reports}
                    isGrid={this.state.isGrid}
                    navigation={this.props.navigation}
                />

                <FlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={this.state.isGrid ? 2 : 1}
                    data={this.state.response}
                    extraData={this.state}
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                                icon={item.icon}
                                viewHeight={this.state.viewHeight}
                                index={index}
                                width={width}
                                title={item.title}
                                size={this.state.response.length}
                                isGrid={this.state.isGrid}
                                type={1}
                                value={item.value}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                onPress={() => this.onPress(item.id)}
                            />  )
                    }}
                    keyExtractor={(_item, index) => index.toString()}
                />

                <View style={{ marginLeft: R.dimens.padding_left_right_margin, 
                    marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton  icon={R.images.BACK_ARROW}
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.navigation.goBack()} />

                </View>
            </SafeView>
        );
    }
}

export default WalletReportDashboard;