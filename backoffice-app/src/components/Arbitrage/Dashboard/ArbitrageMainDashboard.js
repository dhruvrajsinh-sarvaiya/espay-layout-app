import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CustomCard from '../../widget/CustomCard';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import DashboardHeader from '../../widget/DashboardHeader';

let { width } = R.screen()

export class ArbitrageMainDashboard extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            viewHeight: 0,
            isGrid: true,
            Data: [
                { title: R.strings.Reports, icon: R.images.IC_WITHDRAW_HISTORY, id: 1 },
                { title: R.strings.configurations, icon: R.images.ic_configuration, id: 2 },
                { title: R.strings.arbitragePortfolio, icon: R.images.ic_widgets, id: 3 },
            ],
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    async onPress(id) {

        // Redirect screen based on card select
        if (id == 1)
            this.props.navigation.navigate('CommonDashboard', {
                response: [
                    { title: R.strings.providerWallet, icon: R.images.IC_WALLET, id: 0, type: 1, navigate: 'ProviderWalletListScreen' },
                    { title: R.strings.arbitrageExchangeBal, icon: R.images.IC_CHART, id: 1, type: 1, navigate: 'ArbitrageExchangeBalScreen' },
                    { title: R.strings.conflictHistory, icon: R.images.IC_CHART, id: 2, type: 1, screenType: 2, navigate: 'ConflictHistoryScreen' },
                    { title: R.strings.providerLedger, icon: R.images.IC_CHART, id: 3, type: 1, navigate: 'ProviderLedgerScreen' },
                ], title: R.strings.reports
            })
        else if (id == 2)
            this.props.navigation.navigate('ArbitrageConfigurationDashboard')
        else if (id == 3)
            this.props.navigation.navigate('ArbitragePortfolioDashboard')
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
                    navigation={this.props.navigation} header={R.strings.arbitrageDashboard}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                {/* For Sub Dashboards*/}
                <View style={{ flex: 1 }}>
                    <FlatList
                        numColumns={this.state.isGrid ? 2 : 1} data={this.state.Data}
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                        // render all item in list
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    value={item.title} index={index}
                                    width={width}
                                    titleStyle={{ fontWeight: 'bold' }}
                                    icon={item.icon}
                                    size={this.state.Data.length}
                                    isGrid={this.state.isGrid}
                                    type={1} viewHeight={this.state.viewHeight}
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height });
                                    }}
                                    onPress={() => this.onPress(item.id)}
                                />

                            )
                        }}
                        // assign index as key value item
                        keyExtractor={(_item, index) => index.toString()}
                    />
                </View>
            </SafeView>
        )
    }
}

export default ArbitrageMainDashboard
