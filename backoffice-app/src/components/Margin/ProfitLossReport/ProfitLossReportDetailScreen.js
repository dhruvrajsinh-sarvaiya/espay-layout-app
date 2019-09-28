import React, { Component } from 'react';
import { View, ScrollView, FlatList, Text, } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, convertDate, convertTime, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import Separator from '../../../native_theme/components/Separator';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { validateValue } from '../../../validations/CommonValidation';
import CardView from '../../../native_theme/components/CardView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import ImageViewWidget from '../../widget/ImageViewWidget';
import SafeView from '../../../native_theme/components/SafeView';

class ProfitLossReportDetailScreen extends Component {
    constructor(props) {
        super(props);

        var { params } = props.navigation.state;

        //Define all initial state
        this.state = {
            item: params.item,
        };
    }

    componentDidMount = () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    render() {

        let resItem = this.state.item

        return (
            <SafeView style={this.styles().container}>
                {/* Statusbar of  Detail  */}
                <CommonStatusBar />

                {/* CustomToolbar */}
                <CustomToolbar
                    title={R.strings.profitLossReport} isBack={true}
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
                                borderTopRightRadius: R.dimens.margin,
                                borderRadius: 0, borderBottomLeftRadius: R.dimens.margin,
                            }} >
                                <View>
                                    {/* Holding currency with Icon and UserName , ProfitCurrencyName*/}
                                    <View style={{
                                        flexDirection: 'row', margin: R.dimens.widgetMargin,
                                    }}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <View style={{
                                                width: R.dimens.signup_screen_logo_height,
                                                height: R.dimens.signup_screen_logo_height,
                                                backgroundColor: 'transparent',
                                                borderRadius: R.dimens.paginationButtonRadious,
                                            }}>
                                                <ImageViewWidget url={this.state.item.ProfitCurrencyName ? this.state.item.ProfitCurrencyName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                            </View>
                                        </View>

                                        <View style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding, flexDirection: 'column' }}>
                                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{this.state.item.ProfitCurrencyName ? (this.state.item.ProfitCurrencyName.toUpperCase()) : '-'}</Text>
                                            <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{this.state.item.UserName ? this.state.item.UserName : '-'}</TextViewMR>
                                        </View>
                                    </View>

                                    {/* Header of Trn_No and their value */}
                                    <View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}>
                                        <TextViewHML style={[this.styles().text_style]}>
                                            {R.strings.Trn_No}
                                        </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, textAlign: 'right' }}>
                                            {this.state.item.TrnNo}
                                        </TextViewHML>
                                    </View>

                                    {/* Header of Profit and their value */}
                                    <View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}>
                                        <TextViewHML style={[this.styles().text_style]}>
                                            {R.strings.Profit}
                                        </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, textAlign: 'right' }}>
                                            {(parseFloatVal(resItem.ProfitAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(resItem.ProfitAmount).toFixed(8)) : '-') + " " + resItem.ProfitCurrencyName}
                                        </TextViewHML>
                                    </View>

                                    {/* Header of avgLandingBuy and their value */}
                                    <View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}>
                                        <TextViewHML style={[this.styles().text_style]}>
                                            {R.strings.avgLandingBuy}
                                        </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, textAlign: 'right' }}>
                                            {(parseFloatVal(resItem.AvgLandingBuy).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(resItem.AvgLandingBuy).toFixed(8)) : '-')}
                                        </TextViewHML>
                                    </View>

                                    {/* Header of avgLandingSell and their value */}
                                    <View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}>
                                        <TextViewHML style={[this.styles().text_style]}>
                                            {R.strings.avgLandingSell}
                                        </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, textAlign: 'right' }}>
                                            {(parseFloatVal(resItem.AvgLandingSell).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(resItem.AvgLandingSell).toFixed(8)) : '-')}
                                        </TextViewHML>
                                    </View>

                                    {/* Header of settledQty and their value */}
                                    <View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}>
                                        <TextViewHML style={[this.styles().text_style]}>
                                            {R.strings.settledQty}
                                        </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, textAlign: 'right' }}>
                                            {(parseFloatVal(resItem.SettledQty) !== 'NaN' ? validateValue(parseFloatVal(resItem.SettledQty)) : '-')}
                                        </TextViewHML>
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

                                    {/* CreatedDate */}
                                    <View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin }}>
                                        <TextViewHML style={[this.styles().text_style]}>{R.strings.txnDate}</TextViewHML>
                                        <TextViewHML style={{
                                            color: R.colors.textSecondary,
                                            fontSize: R.dimens.smallestText,
                                            textAlign: 'right',
                                        }}>{convertDate(this.state.item.CreatedDate) + ' ' + convertTime(this.state.item.CreatedDate)}</TextViewHML>
                                    </View>
                                </View>
                            </CardView>
                        </View>

                        <View >
                            <TextViewMR style={{
                                fontSize: R.dimens.mediumText,
                                color: R.colors.textPrimary,
                                margin: R.dimens.margin,
                                marginBottom: R.dimens.widgetMargin,
                            }}>{R.strings.Details}</TextViewMR>

                            <FlatList
                                data={this.state.item.DetailedData}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                // render all item in list 
                                renderItem={({ item, index }) =>
                                    <ProfitLossReportDetailItem
                                        index={index}
                                        item={item}
                                        size={this.state.item.length} />
                                }
                                // assign index as key value to list item
                                keyExtractor={(_item, index) => index.toString()}
                                contentContainerStyle={contentContainerStyle(this.state.item.DetailedData)}
                                // Displayed empty component when no record found 
                                ListEmptyComponent={() => <ListEmptyComponent />}
                            />
                        </View>
                    </ScrollView>
                </View>
            </SafeView>
        );
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
                fontSize: R.dimens.volumeText,
            },
        }
    }
}

// This Class is used for display record in list
class ProfitLossReportDetailItem extends Component {
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
        let { index, size, item, onPress } = this.props;
        let fColor = item.OrderType.toLowerCase().includes(R.strings.buy.toLowerCase()) ? R.colors.buyerGreen : R.colors.sellerPink;

        return (
            // for flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation, flex: 1,
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                        borderBottomLeftRadius: R.dimens.margin,
                    }} onPress={onPress}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {/* for Show PairName Icon */}
                            <ImageViewWidget url={item.PairName ? item.PairName.split('_')[0] : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                {/* for Show PairName and  OrderType */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{
                                            color: R.colors.listSeprator, fontSize: R.dimens.smallText,
                                            fontFamily: Fonts.MontserratSemiBold,
                                        }}>{item.PairName.replace('_', '/') + ' - '}</Text>
                                        <Text style={{ color: fColor, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.OrderType ? item.OrderType : '-'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View >

                        {/* for show Qty, BidPrice and LandingPrice */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <TextViewHML ellipsizeMode={'tail'} numberOfLines={1} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.Qty}</TextViewHML>
                                <TextViewHML

                                    style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>
                                    {(parseFloatVal(item.Qty) !== 'NaN' ? validateValue(parseFloatVal(item.Qty)) : '-')}
                                </TextViewHML>
                            </View>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <TextViewHML ellipsizeMode={'tail'} numberOfLines={1} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.bidPrice}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                    {(parseFloatVal(item.BidPrice).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.BidPrice).toFixed(8)) : '-')}
                                </TextViewHML>
                            </View>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <TextViewHML ellipsizeMode={'tail'} numberOfLines={1} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.landingPrice}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                    {(parseFloatVal(item.LandingPrice).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.LandingPrice).toFixed(8)) : '-')}
                                </TextViewHML>
                            </View>
                        </View>

                        {/* for show TrnNo */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
                                    {R.strings.Trn_No + ': '}
                                </Text>

                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
                                    {(parseFloatVal(item.TrnNo) !== 'NaN' ? validateValue(parseFloatVal(item.TrnNo)) : '-')}
                                </Text>
                            </View>

                            {/* For date time */}
                            <View style={{
                                alignItems: 'center', justifyContent: 'flex-end',
                                flexDirection: 'row',
                            }}>
                                <ImageTextButton style={{
                                    margin: 0,
                                    paddingRight: R.dimens.LineHeight,
                                }}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    icon={R.images.IC_TIMER}
                                />
                                <TextViewHML style={{
                                    alignSelf: 'center',
                                    fontSize: R.dimens.smallestText,
                                    color: R.colors.textSecondary,
                                }}>
                                    {convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}
                                </TextViewHML>
                            </View>
                        </View>

                    </CardView>
                </View >

            </AnimatableItem >
        )
    }
}

export default ProfitLossReportDetailScreen;
