import React, { Component } from 'react';
import {
    View,
    ScrollView,
    FlatList
} from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import Separator from '../../../native_theme/components/Separator';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class TradingSummaryDetailScreen extends Component {
    constructor(props) {
        super(props);

        // get params from previous screen
        var { params } = props.navigation.state;

        //Define All initial State
        this.state = {
            item: params.item,
        };
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    render() {

        // apply color based on transaction type "buy" or "sell"
        let fColor = this.state.item.TrnType.toLowerCase().includes('buy') ? R.colors.buyerGreen : R.colors.sellerPink;

        return (
            <SafeView isDetail={true} style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.TradingSummaryDetail}
                    isBack={true}
                    nav={this.props.navigation}
                />

                <ScrollView stickyHeaderIndices={[1]} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: R.dimens.widgetMargin, }}>

                        {/* First_Currency, Second_Currency and side text */}
                        <View style={this.styles().currency_header}>
                            <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{this.state.item.PairName.replace('_', '/')}</TextViewMR>
                            <TextViewMR style={{ alignSelf: 'center', color: fColor, fontSize: R.dimens.volumeText, marginLeft: R.dimens.widget_left_right_margin, }}>{this.state.item.TrnType.toLowerCase()}</TextViewMR>
                        </View>

                        {/* Header of Type and their value */}
                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}>
                            <TextViewHML style={[this.styles().text_style]}>
                                {R.strings.TxnID}
                            </TextViewHML>

                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText, textAlign: 'right' }}>
                                {this.state.item.TrnNo}
                            </TextViewHML>
                        </View>

                        {/* Header of Filled / Amount and their value */}
                        <View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}>
                            <TextViewHML style={[this.styles().text_style]}>{R.strings.Amount}</TextViewHML>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText }}>{this.state.item.Qty}</TextViewHML>
                            </View>
                        </View>

                        {/* Header of Average/Price and their value */}
                        <View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin }}>
                            <TextViewHML style={[this.styles().text_style]}>{R.strings.price}</TextViewHML>

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText }}>{parseFloatVal(this.state.item.Price).toFixed(8)}</TextViewHML>
                            </View>
                        </View>

                        {/* Separator */}
                        <Separator
                            style={{
                                marginLeft: R.dimens.widget_left_right_margin,
                                marginRight: R.dimens.widget_left_right_margin,
                                marginTop: R.dimens.widget_top_bottom_margin,
                                marginBottom: R.dimens.widget_top_bottom_margin,
                                backgroundColor: R.colors.background,
                                height: R.dimens.blockchain_textbox_border
                            }} />

                        {/* Header of Fees, Total and their value */}
                        {/* Header of Average/Price and their value */}
                        <View style={{ flexDirection: 'row', marginBottom: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin }}>
                            <TextViewHML style={[this.styles().text_style]}>{R.strings.txnDate}</TextViewHML>
                            <TextViewHML style={{
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.smallestText,
                                textAlign: 'right',
                            }}>{convertDateTime(this.state.item.TrnDate)}</TextViewHML>
                        </View>
                    </View>

                    {/* Header Trade Detail */}
                    <View >
                        <TextViewMR style={{
                            fontSize: R.dimens.mediumText,
                            color: R.colors.textPrimary,
                            margin: R.dimens.margin
                        }}>{R.strings.tradedetail}</TextViewMR>
                    </View>

                    {this.state.item.Trades.length > 0 ? <View>
                        {/* Flatlist Detailed Items */}
                        <View>
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: R.dimens.widgetMargin,
                                marginTop: R.dimens.widgetMargin,
                                marginLeft: R.dimens.widget_left_right_margin,
                                marginRight: R.dimens.widget_left_right_margin
                            }}>
                                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{R.strings.Trn_No}</TextViewHML>
                                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{R.strings.type}</TextViewHML>
                                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{R.strings.price}</TextViewHML>
                                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{R.strings.Amount}</TextViewHML>
                            </View >
                            <Separator />

                            <FlatList
                                data={this.state.item.Trades}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    return <AnimatableItem>
                                        <View style={{ flex: 1 }}>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                marginLeft: R.dimens.widget_left_right_margin,
                                                marginRight: R.dimens.widget_left_right_margin,
                                                marginTop: (index == 0) ? R.dimens.widgetMargin : R.dimens.widgetMargin,
                                                marginBottom: (index == this.state.item.Trades.size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                                            }}>
                                                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{item.TrnNo}</TextViewHML>
                                                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{item.TrnType}</TextViewHML>
                                                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{parseFloatVal(item.Price).toFixed(8)}</TextViewHML>
                                                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{item.Qty}</TextViewHML>
                                            </View >
                                            <Separator />
                                        </View>
                                    </AnimatableItem>
                                }}
                                keyExtractor={(_item, index) => index.toString()}
                                contentContainerStyle={contentContainerStyle(this.state.item.Trades)}
                            />
                        </View>
                    </View> : <View style={{ height: R.dimens.FilterDrawarWidth }}>
                            <ListEmptyComponent />
                        </View>}
                </ScrollView>
            </SafeView>
        );
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background
            },
            currency_header: {
                flexDirection: 'row',
                marginTop: R.dimens.widget_top_bottom_margin,
                justifyContent: 'center',
            },
            text_style: {
                flex: 1,
                color: R.colors.textSecondary,
                fontSize: R.dimens.volumeText,
            },
        }
    }
}

export default TradingSummaryDetailScreen;