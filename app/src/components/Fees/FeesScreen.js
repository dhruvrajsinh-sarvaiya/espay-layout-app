import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, ScrollView } from 'react-native';
import { changeTheme, parseArray } from '../../controllers/CommonUtils';
import { getFeesLists, clearFeesCharges } from '../../actions/Fees/FeesAction';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../Navigation';
import { connect } from 'react-redux';
import R from '../../native_theme/R';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import CardView from '../../native_theme/components/CardView';
import ImageViewWidget from '../Widget/ImageViewWidget';
import Separator from '../../native_theme/components/Separator';
import { Fonts } from '../../controllers/Constants';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class FeesScreen extends Component {
    constructor(props) {
        super(props);

        //Define Initial State
        this.state = {
            response: [],
            refreshing: false,
            isFirstTime: true,
            feesData: null,
        };

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return isCurrentScreen(nextProps);
    };

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (await isInternet()) {
            let request = {}
            //call fees List Api 
            this.props.getFeesLists(request);
        }
    }

    //For Swipe to referesh Functionality
    async onRefresh() {
        this.setState({ refreshing: true });
        if (await isInternet()) {
            let request = {}
            //call fees List Api 
            this.props.getFeesLists(request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    componentWillUnmount() {
        //clear data On Backpress
        this.props.clearFeesCharges();
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (FeesScreen.oldProps !== props) {
            FeesScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            let { feesData } = props.data;
            try {

                //if  response is not null then handle resposne
                if (feesData) {

                    //if local state is null or its not null and also different then new response then and only then validate response.
                    if (state.feesData == null || (state.feesData != null && feesData !== state.feesData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: feesData, isList: true })) {
                            return Object.assign({}, state, {
                                feesData,
                                response: parseArray(feesData.Data),
                                refreshing: false,
                            })
                        } else {
                            return Object.assign({}, state, {
                                feesData: null,
                                response: [],
                                refreshing: false,
                            })
                        }
                    }
                }
            } catch (e) {
                return Object.assign({}, state, {
                    refreshing: false,
                    response: [],
                    feesData: null
                })
            }
        }
        return null;
    }

    render() {
        let { isFeesFetching } = this.props.data;

        let finalItems = this.state.response
        var chargesDetailList = [];
        let feesData = finalItems
        if (feesData !== null && feesData.length > 0) {
            feesData.map((chargeDetail, key) => {
                var coinListWithCharge = {};
                coinListWithCharge.CoinName = chargeDetail.WalletTypeName;
                coinListWithCharge.TakerCharge = 0;
                coinListWithCharge.MakerCharge = 0;
                coinListWithCharge.ChargeCurrencyName = '-';
                coinListWithCharge.WithdrawalChargeCurrencyName = '-';
                coinListWithCharge.WithdrawalCharge = 0;

                if (chargeDetail.Charges && chargeDetail.Charges.length > 0) {

                    chargeDetail.Charges.map((item, key1) => {

                        if (item.TrnTypeId === 3) { // type id 3 means trading charge
                            coinListWithCharge.TakerCharge = item.TakerCharge + '%';
                            coinListWithCharge.MakerCharge = item.MakerCharge + '%';
                            coinListWithCharge.ChargeCurrencyName = item.DeductWalletTypeName;
                        }
                        if (item.TrnTypeId === 9) { // type id 9 means withdrawal charge
                            coinListWithCharge.WithdrawalChargeCurrencyName = item.DeductWalletTypeName;
                            coinListWithCharge.WithdrawalCharge = item.ChargeValue;
                        }
                    })
                }
                chargesDetailList.push(coinListWithCharge);
            })
        }

        finalItems = chargesDetailList.length > 0 ? chargesDetailList : []

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.fees}
                    isBack={true}
                    nav={this.props.navigation}
                />

                <View style={{ flex: 1 }}>
                    {isFeesFetching && !this.state.refreshing ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>

                            {finalItems.length ?
                                <ScrollView showsVerticalScrollIndicator={false}
                                    /* For Refresh Functionality In  FlatList Item */
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    }
                                >
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 1 }}>
                                            {/* For Trading Fees */}
                                            <Text style={{ marginLeft: R.dimens.padding_left_right_margin, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.mediumText }}>
                                                {R.strings.feesForTrading}
                                            </Text>

                                            <CardView style={{
                                                flex: 1,
                                                elevation: R.dimens.listCardElevation,
                                                borderRadius: R.dimens.detailCardRadius,
                                                flexDirection: 'column',
                                                margin: R.dimens.WidgetPadding,
                                                padding: 0
                                            }}>
                                                <FlatList
                                                    style={{ margin: R.dimens.WidgetPadding, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }}
                                                    showsVerticalScrollIndicator={false}
                                                    data={finalItems}
                                                    /* render all item in list */
                                                    renderItem={({ item, index }) => {
                                                        return <TradingFeesListItem
                                                            tradingFeesIndex={index}
                                                            tradingFeesItem={item}
                                                            tradingFeesSize={finalItems.length} />
                                                    }}
                                                    /* assign index as key valye to Deposit History list item */
                                                    keyExtractor={(item, index) => index.toString()}
                                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                                />
                                            </CardView>

                                            {/* For Deposit Fees */}
                                            <Text style={{ marginLeft: R.dimens.padding_left_right_margin, fontFamily: Fonts.MontserratSemiBold, color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>
                                                {R.strings.feeForDeposit}
                                            </Text>

                                            <CardView style={{
                                                flex: 1,
                                                elevation: R.dimens.listCardElevation,
                                                borderRadius: R.dimens.detailCardRadius,
                                                flexDirection: 'column',
                                                margin: R.dimens.WidgetPadding,
                                            }}>
                                                <TextViewHML style={{ marginLeft: R.dimens.padding_left_right_margin, color: R.colors.textSecondary, fontSize: R.dimens.mediumText }}>
                                                    {R.strings.free}
                                                </TextViewHML>

                                            </CardView>

                                            {/* For Withdrawal Fees */}

                                            <Text style={{ marginLeft: R.dimens.padding_left_right_margin, fontFamily: Fonts.MontserratSemiBold, color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>
                                                {R.strings.feeForWithDrawal}
                                            </Text>

                                            <TextViewHML style={{ marginLeft: R.dimens.padding_left_right_margin, marginRight: R.dimens.padding_left_right_margin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>
                                                {R.strings.withdrwalKeyNote}
                                            </TextViewHML>

                                            <CardView style={{
                                                flex: 1,
                                                elevation: R.dimens.listCardElevation,
                                                borderRadius: R.dimens.detailCardRadius,
                                                flexDirection: 'column',
                                                margin: R.dimens.WidgetPadding,
                                                padding: 0
                                            }}>
                                                <FlatList
                                                    style={{ margin: R.dimens.WidgetPadding, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }}
                                                    showsVerticalScrollIndicator={false}
                                                    data={finalItems}
                                                    /* render all item in list */
                                                    renderItem={({ item, index }) => {
                                                        return <WithdrawalFeesListItem
                                                            withdrawalFeesIndex={index}
                                                            withdrawalFeesItem={item}
                                                            withdrawalFeesSize={finalItems.length} />
                                                    }}
                                                    /* assign index as key value  list item */
                                                    keyExtractor={(item, index) => index.toString()}
                                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                                />
                                            </CardView>
                                        </View>
                                    </View>
                                </ScrollView>
                                :
                                <ListEmptyComponent />
                            }
                        </View>
                    }
                </View>
            </SafeView>
        );
    }
}

// This Class is used for display record in list
export class TradingFeesListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.tradingFeesItem === nextProps.tradingFeesItem) {
            return false
        }
        return true
    }

    render() {
        let { tradingFeesIndex, tradingFeesSize, tradingFeesItem } = this.props;
        return (
            <AnimatableItem>
                <View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>
                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                            {/* Coin Image */}
                            <ImageViewWidget url={tradingFeesItem.CoinName ? tradingFeesItem.CoinName : ''} width={R.dimens.LARGE_MENU_ICON_SIZE} height={R.dimens.LARGE_MENU_ICON_SIZE} />
                        </View>

                        <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    {/* Coin Name */}
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{tradingFeesItem.CoinName ? tradingFeesItem.CoinName : '-'} </Text>
                                </View>

                                {(tradingFeesItem.ChargeCurrencyName != '-') &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            {/* Charge */}
                                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Charge + ' :'} </TextViewHML>
                                            {/* Charge currency Image */}
                                            <ImageViewWidget url={tradingFeesItem.ChargeCurrencyName ? tradingFeesItem.ChargeCurrencyName : ''} width={R.dimens.LARGE_MENU_ICON_SIZE} height={R.dimens.LARGE_MENU_ICON_SIZE} />
                                        </View>
                                        <View style={{ marginLeft: R.dimens.widgetMargin }}>
                                            {/* Charge currency Name */}
                                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{tradingFeesItem.ChargeCurrencyName ? tradingFeesItem.ChargeCurrencyName : ''} </TextViewHML>
                                        </View>

                                    </View>}
                            </View>

                            <View style={{ marginBottom: R.dimens.widgetMargin }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {/* Marker Fee */}
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Maker_Fee + ' :'} </TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{tradingFeesItem.MakerCharge} </TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    {/* Taker Fee */}
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Taker_Fee + ' :'} </TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{tradingFeesItem.TakerCharge} </TextViewHML>
                                </View>
                            </View>

                            {/* if not last index than show the seprator */}
                            {
                                (tradingFeesIndex != tradingFeesSize - 1) &&
                                <Separator style={{ marginLeft: 0, marginRight: 0 }} />
                            }
                        </View>
                    </View>
                </View>
            </AnimatableItem>
        )
    };
}

// This Class is used for display record in list
export class WithdrawalFeesListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.withdrawalFeesItem === nextProps.withdrawalFeesItem) {
            return false
        }
        return true
    }

    render() {
        let { withdrawalFeesIndex, withdrawalFeesSize, withdrawalFeesItem } = this.props;
        return (
            <AnimatableItem>
                <View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>
                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                            {/* Coin Image */}
                            <ImageViewWidget url={withdrawalFeesItem.CoinName ? withdrawalFeesItem.CoinName : ''} width={R.dimens.LARGE_MENU_ICON_SIZE} height={R.dimens.LARGE_MENU_ICON_SIZE} />
                        </View>

                        <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    {/* Coin Name */}
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{withdrawalFeesItem.CoinName ? withdrawalFeesItem.CoinName : '-'} </Text>
                                </View>

                                {(withdrawalFeesItem.WithdrawalChargeCurrencyName != '-') &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Charge + ' :'} </TextViewHML>
                                            {/* Withdrawal Charge currency Image */}
                                            <ImageViewWidget url={withdrawalFeesItem.WithdrawalChargeCurrencyName ? withdrawalFeesItem.WithdrawalChargeCurrencyName : ''} width={R.dimens.LARGE_MENU_ICON_SIZE} height={R.dimens.LARGE_MENU_ICON_SIZE} />
                                        </View>

                                        <View style={{ marginLeft: R.dimens.widgetMargin }}>
                                            {/* Withdrawal Charge currency Name */}
                                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{withdrawalFeesItem.WithdrawalChargeCurrencyName ? withdrawalFeesItem.WithdrawalChargeCurrencyName : ''} </TextViewHML>
                                        </View>
                                    </View>
                                }
                            </View>

                            <View style={{ flexDirection: 'row', marginBottom: R.dimens.widgetMargin, alignItems: 'center' }}>
                                {/* Withdrawal Charge  */}
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.fee + ' :'} </TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{withdrawalFeesItem.WithdrawalCharge} </TextViewHML>
                            </View>
                            {/* if not last index than show the seprator */}
                            {
                                (withdrawalFeesIndex != withdrawalFeesSize - 1) &&
                                <Separator style={{ marginLeft: 0, marginRight: 0 }} />
                            }

                        </View>
                    </View>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStatToProps(state) {
    //Updated Data For Fees List Action
    let data = {
        ...state.FeesReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Fees List  Action
        getFeesLists: (payload) => dispatch(getFeesLists(payload)),
        //Perform clear Fees List Data Action
        clearFeesCharges: () => dispatch(clearFeesCharges()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(FeesScreen);
