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

class ReportsDashbord extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: R.strings.userSignUp, icon: R.images.IC_FILL_USER, id: 1 },
                { title: R.strings.activityLogHistory, icon: R.images.IC_TIMER, id: 2 },
                { title: R.strings.userWalletList, icon: R.images.IC_WALLET, id: 3 },
                { title: R.strings.tradingLedger, icon: R.images.ic_line_chart, id: 4 },
            ],
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    async onPress(id) {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //redirect screens based on card selected 
            if (id === 1) {
                this.props.navigation.navigate('UserSignUpReportDash')
            }
            else if (id === 2) {
                this.props.navigation.navigate('ActivityLogHistoryList')
            }
            else if (id === 3) {
                this.props.navigation.navigate('UserWalletListScreen')
            }
            else if (id === 4) {  // screentype:1 for Trading Ledger 
                this.props.navigation.navigate('TradingLedgerScreen', { screenType: 1 })
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
                    navigation={this.props.navigation}
                    header={R.strings.reportsDasboard} isGrid={this.state.isGrid}
                />

                <FlatList
                    numColumns={this.state.isGrid ? 2 : 1} data={this.state.response}  extraData={this.state}
                    showsVerticalScrollIndicator={false}
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                            viewHeight={this.state.viewHeight}
                                icon={item.icon}
                                size={this.state.response.length}  isGrid={this.state.isGrid}
                                type={1}
                                value={item.title}  index={index} width={width}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                onPress={() => this.onPress(item.id)}
                            /> 
                        )
                    }}  keyExtractor={(_item, index) => index.toString()}
                />

                <View 
                style={{ 
                    marginLeft: R.dimens.padding_left_right_margin, 
                    marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, 
                        backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, 
                        borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        icon={R.images.BACK_ARROW}
                        onPress={() => this.props.navigation.goBack()} />

                </View>
            </SafeView>
        );
    }
}

export default ReportsDashbord;