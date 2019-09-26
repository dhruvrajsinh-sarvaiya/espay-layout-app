import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text
} from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, parseFloatVal } from '../../../controllers/CommonUtils';
import { isEmpty } from '../../../validations/CommonValidation';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';

class SocialTradingHistoryDetailScreen extends Component {

    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    render() {

        //set color based on type
        let fColor = this.state.item.Type.toLowerCase().includes(R.strings.buy.toLowerCase()) ? R.colors.buyerGreen : R.colors.sellerPink;
        return (
            <LinearGradient colors={[R.colors.detailBgLight, R.colors.detailBgDark]}
                style={{ flex: 1 }}
                locations={[0, 10]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
            >
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    backIconStyle={{ tintColor: 'white' }}
                    toolbarColor={'transparent'}
                    textStyle={{ color: 'white' }}
                    isBack={true} nav={this.props.navigation} title={R.strings.socialTradingHistory} />

                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom, padding: 0,
                        backgroundColor: R.colors.cardBackground,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        {/* PairName with Icon ,Type */}
                        <View style={{
                            flexDirection: 'row',
                            margin: R.dimens.widget_top_bottom_margin,
                        }}>
                            <View>
                                <View style={{ height: R.dimens.signup_screen_logo_height,
                                    width: R.dimens.signup_screen_logo_height,
                                    backgroundColor: 'transparent',
                                    borderRadius: R.dimens.paginationButtonRadious,
                                }}>
                                    <ImageViewWidget url={this.state.item.PairName ? this.state.item.PairName.split('_')[0] : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column', paddingLeft: R.dimens.WidgetPadding }}>
                                <Text style={{
                                    color: R.colors.textPrimary, fontSize: R.dimens.mediumText,
                                    fontFamily: Fonts.MontserratSemiBold,
                                }}>{this.state.item.PairName ? this.state.item.PairName.replace('_', '/') : '-'} </Text>
                                <TextViewMR style={{ color: fColor, fontSize: R.dimens.mediumText }}>{this.state.item.Type.toLowerCase().includes(R.strings.buy.toLowerCase()) ? R.strings.buy : R.strings.sell}</TextViewMR>
                            </View>
                        </View>

                        {/*  list */}
                        {this.rowItem(R.strings.Trn_No, this.state.item.TrnNo ? this.state.item.TrnNo : '-')}
                        {this.rowItem(R.strings.Amount, ((parseFloatVal((this.state.item.Amount))) !== 'NaN' ? parseFloatVal((this.state.item.Amount)).toFixed(8) : '-'))}
                        {this.rowItem(R.strings.price, ((parseFloatVal((this.state.item.Price))) !== 'NaN' ? parseFloatVal((this.state.item.Price)).toFixed(8) : '-'))}
                        {this.rowItem(R.strings.Total, ((parseFloatVal((this.state.item.Total))) !== 'NaN' ? parseFloatVal((this.state.item.Total)).toFixed(8) : '-'))}
                        {this.rowItem(R.strings.Charge, ((parseFloatVal((this.state.item.ChargeRs))) !== 'NaN' ? parseFloatVal((this.state.item.ChargeRs)).toFixed(8) : '-'))}
                        {this.rowItem(R.strings.socialTradeType, !isEmpty(this.state.item.OrderType) ? this.state.item.OrderType : '-')}
                        {this.rowItem(R.strings.isCencel, this.state.item.IsCancel == 0 ? R.strings.no : R.strings.yes_text)}
                        {this.rowItem(R.strings.status, !isEmpty(this.state.item.StatusText) ? this.state.item.StatusText : '-', this.state.item.Status)}
                        {this.rowItem(R.strings.txnDate, convertDate(this.state.item.DateTime), '-1', true)}

                    </CardView>
                </ScrollView>
            </LinearGradient >
        );
    }

    rowItem = (title, value, code, marginBottom) => {

        if (typeof marginBottom === 'undefined') {
            marginBottom = false;
        }

        let statusColor = ''

        //set status color based on code
        if (code === 1)
            statusColor = R.colors.successGreen
        else if (code === 2)
            statusColor = R.colors.failRed
        else
            statusColor = R.colors.textPrimary

        return <View style={{marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: R.dimens.widgetMargin,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,
        }}>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.styles().contentItem, { color: statusColor, fontWeight: 'normal', textAlign: 'right' }]}>{value}</TextViewHML>
        </View>
    }

    styles = () => {
        return {
            contentItem: {
                flex: 1,
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary
            }
        }
    }
}

export default SocialTradingHistoryDetailScreen