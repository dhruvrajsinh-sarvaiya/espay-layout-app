import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { changeTheme, parseFloatVal, } from '../../controllers/CommonUtils';
import ImageButton from '../../native_theme/components/ImageTextButton';
import Separator from '../../native_theme/components/Separator';
import { OrderHistoryBit } from './OrderHistory/OrderHistory';
import R from '../../native_theme/R';
import ImageViewWidget from '../Widget/ImageViewWidget';
import Button from '../../native_theme/components/Button';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import CardView from '../../native_theme/components/CardView';

class BuySellTradeSuccessScreen extends Component {
    constructor(props) {
        super(props);

        // Bit to turn on or off static response bit for testing purpose
        let isStatic = false;

        // fields to use in state
        let item, isMargin;

        // if isStatic is true then use static response
        if (isStatic) {

            // to set margin response true/false
            isMargin = false;
            // Check this response for static testing. for limit
            if (isMargin) {
                item = { "CurrencyPairID": 10021001, "DebitWalletID": "9160962048001721", "CreditWalletID": "8936293486001721", "FeePer": "0", "Fee": 0, "Price": 0.00000375, "Amount": "0.1", "Total": "0.00000038", "OrderType": 4, "OrderSide": 4, "StopPrice": 0.1, "dateTime": "2019-04-05 04:55:44 PM", "pair": "INR_BTC", "childCurrency": "INDIAN CURRENCY", "trnID": "d02c11b2-b452-4d3d-b9c1-2cad13f3a8ca", "status": 0, "message": "Order Created" };
            } else {
                item = { "CurrencyPairID": 10051001, "DebitWalletID": "9160962048001721", "CreditWalletID": "9310860157001721", "FeePer": "0", "Fee": 0, "Price": 0.0022, "Amount": "1", "Total": "0.00220000", "OrderType": 1, "OrderSide": 4, "StopPrice": 0, "dateTime": "2019-03-30 05:48:05 PM", "pair": "XRP_BTC", "childCurrency": "RIPPLE XRP COIN", "trnID": "a76554c0-5462-43f4-9d03-4ca15c432fec", "status": 1, "message": "Order Created" };
            }
        } else {
            // Get required field from previous screen
            item = props.navigation.state.params.item !== undefined ? props.navigation.state.params.item : {};
            isMargin = props.navigation.state.params.isMargin !== undefined ? props.navigation.state.params.isMargin : false;
        }

        //Define All initial State
        this.state = {
            trnID: (item.trnID) ? item.trnID : '',
            status: (item.status != undefined) ? item.status : 1,
            childCurrency: (item.childCurrency) ? item.childCurrency : '',
            dateTime: (item.dateTime) ? item.dateTime : '',
            pairName: (item.pair) ? item.pair : '-',
            orderSide: (item.OrderSide) ? (item.OrderSide == 4 ? R.strings.buy : R.strings.sell) : '',
            orderType: (item.OrderType) ? item.OrderType : 1,
            orderTypeText: [R.strings.Limit, R.strings.market, R.strings.spot, R.strings.stopLimit],
            amount: (item.Amount) ? item.Amount : '0',
            price: (item.Price) ? item.Price : '0',
            total: (item.Total) ? item.Total : '0',
            feesPer: (item.FeePer) ? item.FeePer : '0',
            fees: (item.Fee) ? item.Fee : '0',
            stop: (item.StopPrice) ? item.StopPrice : '0',
            isMargin,
        };
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    render() {
        // To get second currency
        let secondCurrency = this.state.pairName.split('_')[1];

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <ImageButton
                        icon={R.images.IC_HOME}
                        style={{
                            margin: 0,
                            paddingTop: R.dimens.WidgetPadding,
                            paddingBottom: R.dimens.WidgetPadding,
                            paddingRight: R.dimens.WidgetPadding,
                            paddingLeft: R.dimens.WidgetPadding
                        }}
                        iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                        onPress={() => {
                            this.props.navigation.navigate('MainScreen')
                        }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 1 }} >

                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                        <TextViewMR style={{ textAlign: 'center', color: R.colors.textPrimary, fontSize: R.dimens.mediumText, marginBottom: R.dimens.margin }}> {(this.state.orderSide === R.strings.buy ? R.strings.bought : R.strings.sold)} {this.state.status != 0 && ' ' + R.strings.Failed.toUpperCase()} {this.state.childCurrency}</TextViewMR>

                        <ImageViewWidget url={secondCurrency} width={R.dimens.Verify_Image_Width_Height} height={R.dimens.Verify_Image_Width_Height} style={{ marginBottom: R.dimens.widgetMargin, }} />

                        <TextViewMR
                            style={{
                                textAlign: 'center',
                                color: R.colors.textPrimary,
                                fontSize: R.dimens.largeText,
                                marginBottom: R.dimens.widgetMargin,
                            }}>{parseFloatVal(this.state.amount).toFixed(8)} {secondCurrency}</TextViewMR>
                        <TextViewHML
                            style={{
                                textAlign: 'center',
                                color: R.colors.textPrimary,
                                fontSize: R.dimens.smallestText,
                                fontWeight: '300',
                                marginBottom: R.dimens.widget_top_bottom_margin
                            }}>{this.state.dateTime}</TextViewHML>
                    </View>

                    <CardView style={{
                        marginBottom: R.dimens.widget_top_bottom_margin,
                        marginLeft: R.dimens.padding_left_right_margin,
                        marginRight: R.dimens.padding_left_right_margin,
                        padding: R.dimens.padding_left_right_margin,
                        paddingBottom: R.dimens.ButtonHeight,
                        borderRadius: R.dimens.cardBorderRadius,
                    }}>
                        {this.renderHeader({ module: this.state.orderSide + ' - ' + this.state.orderTypeText[this.state.orderType - 1], pairName: this.state.pairName.replace('_', '/') })}
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            marginTop: R.dimens.widgetMargin,
                            marginBottom: 0,
                            marginLeft: R.dimens.widgetMargin + R.dimens.LineHeight
                        }}>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.txnid}</TextViewHML>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{this.state.trnID ? this.state.trnID : '-'}</TextViewHML>
                        </View>
                        {this.renderKeyValues({ key: R.strings.Amount, value: parseFloatVal(this.state.amount).toFixed(8) })}
                        {this.state.orderType == 4 && this.renderKeyValues({ key: R.strings.stop, value: parseFloatVal(this.state.stop).toFixed(8) })}
                        {this.renderKeyValues({ key: this.state.orderType == 4 ? R.strings.limit : R.strings.price, value: parseFloatVal(this.state.price).toFixed(8) })}
                        {this.renderKeyValues({ key: R.strings.total, value: parseFloatVal(this.state.total).toFixed(8) })}
                        {this.renderKeyValues({ key: R.strings.status, status: this.state.status != 0 ? (' ' + R.strings.Failed.toUpperCase()) : R.strings.orderCreated })}
                    </CardView>

                    <View style={{ marginBottom: R.dimens.margin_top_bottom }}>
                        <Button
                            title={R.strings.history}
                            onPress={() => {
                                this.props.navigation.navigate(this.state.isMargin ? 'MarginTradingHistory' : 'OrderHistory', { PairName: this.state.pairName, from: OrderHistoryBit.BuySellTradeSuccess })
                            }}
                            isRound={true}
                            isAlert={true}
                            style={{ position: 'absolute', bottom: - R.dimens.widget_top_bottom_margin, elevation: (R.dimens.CardViewElivation * 2) }}
                            textStyle={{ color: R.colors.white }} />
                    </View>
                </ScrollView>
            </SafeView >
        );
    }

    renderHeader(props) {
        let color = this.state.orderSide === R.strings.buy ? R.colors.successGreen : R.colors.failRed;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Separator width={R.dimens.statusIndicatorWidth} height={R.dimens.statusIndicatorHeight} style={{ marginLeft: 0, marginRight: R.dimens.widgetMargin }} color={color} />
                <TextViewMR style={{ width: '70%', color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{props.module}</TextViewMR>
                <TextViewMR style={{ width: '30%', textAlign: 'right', color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: '200' }}>{props.pairName}</TextViewMR>
            </View>
        )
    }

    renderKeyValues(props) {

        return (
            <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widgetMargin + R.dimens.LineHeight }}>
                {/* Key Name */}
                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{props.key}</TextViewHML>

                {/* If Value is not null then display value */}
                {props.value && <TextViewHML style={{ flex: 1, textAlign: 'right', color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{props.value}</TextViewHML>}

                {/* If Status is not null then display status */}
                {props.status != undefined && <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: this.state.status != 0 ? R.colors.failRed : R.colors.successGreen, fontSize: R.dimens.smallText }}>{props.status}</TextViewHML>
                </View>}
            </View>
        )
    }
}

export default BuySellTradeSuccessScreen;
