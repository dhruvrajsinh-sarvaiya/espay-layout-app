import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import CustomCard from '../../widget/CustomCard';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme } from '../../../controllers/CommonUtils';
import SafeView from '../../../native_theme/components/SafeView';
import DashboardHeader from '../../widget/DashboardHeader';
let { width } = R.screen()

export class ArbitrageConfigurationDashboard extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            viewHeight: 0,
            isGrid: true,
            Data: [
                // { title: R.strings.currencyConfig, icon: R.images.ic_configuration, id: 1 },
                { title: R.strings.LPChargeConfiguration, icon: R.images.ic_configuration, id: 2 },
                { title: R.strings.chargeConfig, icon: R.images.ic_configuration, id: 3 },
                { title: R.strings.topupHistory, icon: R.images.ic_configuration, id: 4 },
                { title: R.strings.providerAddress, icon: R.images.ic_configuration, id: 5 },
                { title: R.strings.arbitrageExchangeConfig, icon: R.images.ic_radar, id: 6 },
                { title: R.strings.arbitragePairConfig, icon: R.images.ic_configuration, id: 7 },
                { title: R.strings.initialBalConfig, icon: R.images.ic_map, id: 8 },
                { title: R.strings.arbitrageTradeReconcile, icon: R.images.ic_map, id: 9 },
                { title: R.strings.serviceProviderConfig, icon: R.images.ic_map, id: 10 },
            ],
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    async onPress(id) {

        // Redirect screen based on card select
        if (id === 1)
            this.props.navigation.navigate('CurrencyConfigListScreen')
        if (id === 2)
            this.props.navigation.navigate('ArbitrageLpChargeConfigListScreen')
        else if (id === 3)
            this.props.navigation.navigate('ArbitrageChargeConfigListScreen')
        else if (id === 4)
            this.props.navigation.navigate('TopupHistoryListScreen')
        else if (id === 5)
            this.props.navigation.navigate('ProviderAddressListScreen')
        else if (id === 6)
            this.props.navigation.navigate('CommonDashboard', {
                response: [
                    { title: R.strings.ServiceProvider, icon: R.images.IC_PROVIDER, id: 0, type: 1, navigate: 'ServiceProviderList' },
                    { title: R.strings.serviceProviderConfig, icon: R.images.ic_daydream_settings, id: 1, type: 1, navigate: 'ArbiServiceProviderConfigListScreen' },
                    { title: R.strings.allowOrderType, icon: R.images.IC_CHART, id: 2, type: 1, navigate: 'AllowOrderTypeListScreen' },
                ], title: R.strings.arbitrageExchangeConfig
            })
        else if (id === 7)
            this.props.navigation.navigate('CommonDashboard', {
                response: [
                    { title: R.strings.arbitragePairConfig, icon: R.images.ic_code_settings, id: 0, type: 1, navigate: 'ArbiPairConfigListScreen' },
                    { title: R.strings.arbitrageManageMarket, icon: R.images.ic_widgets, id: 1, type: 1, navigate: 'ArbitrageManageMarketListScreen' },
                    { title: R.strings.arbitrageCoinConfiguration, icon: R.images.ic_life_ring, id: 2, type: 1, navigate: 'ArbitrageCoinConfigurationListScreen' },
                ], title: R.strings.arbitragePairConfig
            })
        else if (id === 8)
            this.props.navigation.navigate('InitialBalanceConfigListScreen')
        else if (id === 9) // screenType 1 Arbitrage Trade recon
            this.props.navigation.navigate('ArbiTradeReconListScreen', { screenType: 1 })
    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.configurations} isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                {/* For Sub Dashboards*/}
                <View style={{ flex: 1 }}>
                    <FlatList
                        numColumns={this.state.isGrid ? 2 : 1}
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        data={this.state.Data}
                        extraData={this.state} showsVerticalScrollIndicator={false}
                        // render all item in list
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    value={item.title}
                                    index={index}
                                    icon={item.icon}
                                    width={width} type={1}
                                    size={this.state.Data.length} isGrid={this.state.isGrid}
                                    viewHeight={this.state.viewHeight}
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height });
                                    }}
                                    onPress={() => this.onPress(item.id)}
                                />

                            )
                        }}
                        // assign index as key value to list item
                        keyExtractor={(_item, index) => index.toString()}
                    />
                </View>
            </SafeView>
        )
    }
}

export default ArbitrageConfigurationDashboard
