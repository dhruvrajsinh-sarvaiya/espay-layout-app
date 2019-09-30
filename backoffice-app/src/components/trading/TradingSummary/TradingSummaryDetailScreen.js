import React, { Component } from 'react';
import { View, ScrollView, Text, FlatList } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, convertDate, convertTime, parseFloatVal } from '../../../controllers/CommonUtils';
import Separator from '../../../native_theme/components/Separator';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { validateValue } from '../../../validations/CommonValidation';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';
import SafeView from '../../../native_theme/components/SafeView';

class TradingSummaryDetailScreen extends Component {
    constructor(props) {
        super(props)

        // Getting data from previous screen
        var { params } = props.navigation.state;

        //fill all the data from previous screen
        this.state = {
            item: params.item,
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    render() {
        //change color trntype 
        let fColor = this.state.item.TrnType.toLowerCase().includes('BUY'.toLowerCase()) ? R.colors.buyerGreen : R.colors.sellerPink;
        let finalItems = this.state.item.Trades;
        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.TradingSummaryDetail}
                    isBack={true}
                    nav={this.props.navigation}
                />

                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

                        <View style={{
                            marginTop: R.dimens.widgetMargin,
                            marginBottom: R.dimens.widgetMargin,
                            marginLeft: R.dimens.widget_left_right_margin,
                            marginRight: R.dimens.widget_left_right_margin,
                        }}>
                            <CardView style={{
                                elevation: R.dimens.listCardElevation,
                                borderRadius: 0,
                                borderBottomLeftRadius: R.dimens.margin,
                                borderTopRightRadius: R.dimens.margin,
                            }} >
                                <View>
                                    {/* Holding Currency with Icon and UserName , ProfitCurrencyName*/}
                                    <View style={{ flexDirection: 'row', margin: R.dimens.widgetMargin, }}>

                                        <View style={{ justifyContent: 'center' }}>
                                            <View style={{
                                                width: R.dimens.signup_screen_logo_height,
                                                height: R.dimens.signup_screen_logo_height,
                                                backgroundColor: 'transparent',
                                                borderRadius: R.dimens.paginationButtonRadious,
                                            }}>
                                                {/* for show PairName icon */}
                                                <ImageViewWidget url={this.state.item.PairName ? this.state.item.PairName.split('_')[0] : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding, flexDirection: 'column' }}>
                                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{this.state.item.PairName.replace('_', '/')}</Text>
                                            <TextViewMR style={{ color: fColor, fontSize: R.dimens.mediumText }}>{this.state.item.TrnType.toUpperCase()}</TextViewMR>
                                        </View>
                                    </View>

                                    {/* For Qty */}
                                    <RowItem
                                        style={{ marginTop: 0 }}
                                        title={R.strings.Qty}
                                        titleStyle={{ fontSize: R.dimens.smallestText, flex: 0 }}
                                        value={(parseFloatVal(this.state.item.Qty).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(this.state.item.Qty).toFixed(8)) : '-')}
                                        valueStyle={{ fontSize: R.dimens.smallestText }}
                                    />

                                    {/* For Price */}
                                    <RowItem
                                        style={{ marginTop: 0 }}
                                        title={R.strings.price}
                                        titleStyle={{ fontSize: R.dimens.smallestText, flex: 0 }}
                                        value={(parseFloatVal(this.state.item.Price).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(this.state.item.Price).toFixed(8)) : '-')}
                                        valueStyle={{ fontSize: R.dimens.smallestText }}
                                    />

                                    {/* For Trn No */}
                                    <RowItem
                                        style={{ marginTop: 0 }}
                                        title={R.strings.Trn_No}
                                        titleStyle={{ fontSize: R.dimens.smallestText, flex: 0 }}
                                        value={this.state.item.TrnNo}
                                        valueStyle={{ fontSize: R.dimens.smallestText }}
                                    />

                                    {/* Separator */}
                                    <Separator
                                        style={{
                                            marginLeft: R.dimens.widget_left_right_margin,
                                            marginRight: R.dimens.widget_left_right_margin,
                                            marginTop: R.dimens.widget_top_bottom_margin,
                                            marginBottom: R.dimens.widgetMargin,
                                            backgroundColor: R.colors.background,
                                            height: R.dimens.blockchain_textbox_border
                                        }} />

                                    {/* CreatedDate */}
                                    <View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin }}>
                                        <TextViewHML style={[this.styles().text_style]}>{R.strings.txnDate}</TextViewHML>
                                        <TextViewHML style={[this.styles().text_style, { textAlign: 'right', }]}>
                                            {convertDate(this.state.item.TrnDate) + ' ' + convertTime(this.state.item.TrnDate)}
                                        </TextViewHML>
                                    </View>
                                </View>
                            </CardView>
                        </View>

                        <View >
                            <TextViewMR style={this.styles().tradeDetailStyle}>{R.strings.tradedetail}</TextViewMR>

                            <FlatList
                                data={finalItems}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) =>
                                    <TradingSummaryDetailItem
                                        index={index}
                                        item={item}
                                        size={finalItems.length}
                                        currency={this.state.item.PairName}
                                    />
                                }
                                keyExtractor={(_item, index) => index.toString()}
                                contentContainerStyle={contentContainerStyle(finalItems)}
                                ListEmptyComponent={() => <ListEmptyComponent />}
                            />
                        </View>
                    </ScrollView>
                </View>
            </SafeView >
        )
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background
            },
            text_style: {
                flex: 1,
                color: R.colors.textSecondary,
                fontSize: R.dimens.smallestText,
            },
            tradeDetailStyle: {
                fontSize: R.dimens.mediumText,
                color: R.colors.textPrimary,
                margin: R.dimens.margin,
                marginBottom: R.dimens.widgetMargin,
            }
        }
    }
}

// This Class is used for display record in list
class TradingSummaryDetailItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        // Get required fields from props
        let { index, size, item, currency } = this.props;
        let fColor = item.TrnType.toLowerCase().includes('BUY'.toLowerCase()) ? R.colors.buyerGreen : R.colors.sellerPink;

       return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>

                                {/* for show currency logo */}
                                <ImageViewWidget url={currency ? currency.split('_')[0] : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                                {/* for show currency name , Transaction type*/}
                                <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <Text style={{
                                                color: R.colors.listSeprator, fontSize: R.dimens.smallText,
                                                fontFamily: Fonts.MontserratSemiBold,
                                            }}>{currency.replace('_', '/') + ' - '}</Text>
                                            <Text style={{
                                                color: fColor, fontSize: R.dimens.smallText,
                                                fontFamily: Fonts.MontserratSemiBold,
                                            }}>{item.TrnType ? item.TrnType : '-'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View >

                            {/* for show Price , Qty*/}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ flex: 1, alignItems: 'center', }}>
                                    <TextViewHML ellipsizeMode={'tail'} numberOfLines={1} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.price}</TextViewHML>
                                    <TextViewHML
                                        style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>
                                        {(parseFloatVal(item.Price) !== 'NaN' ? validateValue(parseFloatVal(item.Price)) : '-')}
                                    </TextViewHML>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', }}>
                                    <TextViewHML ellipsizeMode={'tail'} numberOfLines={1} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Qty}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                        {(parseFloatVal(item.Qty).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Qty).toFixed(8)) : '-')}
                                    </TextViewHML>
                                </View>
                            </View>

                            {/* for show TrnNo */}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
                                        {R.strings.Trn_No + ': '}
                                    </Text>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
                                        {item.TrnNo}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem >
        )
    }
}

export default TradingSummaryDetailScreen;
