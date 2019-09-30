import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    Image
} from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, parseFloatVal } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import { isEmpty } from '../../../validations/CommonValidation';
import ImageViewWidget from '../../widget/ImageViewWidget';

class ConvertsListDetailScreen extends Component {

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
        let item = this.state.item;
        let formatedDateChganged = convertDate(this.state.item.CreatedDate)

        return (
            <LinearGradient style={{ flex: 1 }}
                locations={[0, 10]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    backIconStyle={{ tintColor: 'white' }} toolbarColor={'transparent'}
                    textStyle={{ color: 'white' }}
                    title={R.strings.convertsDetail}
                    isBack={true} nav={this.props.navigation} />

                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    {/* show user name */}
                    <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text style={
                            {
                                fontSize: R.dimens.smallText,
                                fontFamily: Fonts.MontserratSemiBold,
                                color: R.colors.white, textAlign: 'left',
                            }}>{R.strings.userName}</Text>

                        <Text style={{
                            fontSize: R.dimens.mediumText,
                            color: R.colors.white, fontFamily: Fonts.HindmaduraiSemiBold,
                            textAlign: 'left',
                        }}>{item.UserName ? item.UserName : ' - '}</Text>
                    </View>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom,
                        padding: 0, backgroundColor: R.colors.cardBackground,
                    }}
                        cardRadius={R.dimens.detailCardRadius}>


                        {/* CurrencyName icon ,CurrencyName, TransactionCurrecyName  */}
                        <View style={{
                            flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin,
                            justifyContent: 'flex-start',
                            paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <ImageViewWidget url={item.CurrencyName ? item.CurrencyName : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />
                                <Text style={{
                                    marginLeft: R.dimens.widgetMargin, color: R.colors.listSeprator, fontSize: R.dimens.smallText,
                                    fontFamily: Fonts.MontserratSemiBold,
                                }}>{item.CurrencyName ? item.CurrencyName : '-'}</Text>
                            </View>

                            <Image style={{
                                marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                                tintColor: R.colors.textPrimary, width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight
                            }} source={R.images.IC_TRANSFER} />

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <ImageViewWidget url={item.TransactionCurrecyName ? item.TransactionCurrecyName : ''}
                                    width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />
                                <Text style={{
                                    marginLeft: R.dimens.widgetMargin, color: R.colors.listSeprator, fontSize: R.dimens.smallText,
                                    fontFamily: Fonts.MontserratSemiBold,
                                }}>{item.TransactionCurrecyName ? item.TransactionCurrecyName : '-'}</Text>
                            </View>
                        </View>

                        {/*  row items */}
                        {this.rowItem(R.strings.referral_pay_type, this.state.item.ReferralPayTypeName ? this.state.item.ReferralPayTypeName : '-', false, true)}
                        {this.rowItem(R.strings.reward, this.state.item.ReferralPayRewards + ' ' + this.state.item.CommissionCurrecyName)}
                        {this.rowItem(R.strings.transaction + ' ' + R.strings.Username, this.state.item.TrnUserName ? this.state.item.TrnUserName : '-')}
                        {this.rowItem(R.strings.totalReferralUser, ((parseFloatVal((this.state.item.LifeTimeUserCount))) !== 'NaN' ? parseFloatVal((this.state.item.LifeTimeUserCount)) : '-'))}
                        {this.rowItem(R.strings.new + ' ' + R.strings.User, ((parseFloatVal((this.state.item.NewUserCount))) !== 'NaN' ? parseFloatVal((this.state.item.NewUserCount)) : '-'))}
                        {this.rowItem(R.strings.sumCharges + ' ' + R.strings.Amount, ((parseFloatVal((this.state.item.SumChargeAmount))) !== 'NaN' ? parseFloatVal((this.state.item.SumChargeAmount)) : '-'))}
                        {this.rowItem(R.strings.sum + ' ' + R.strings.transaction, ((parseFloatVal((this.state.item.SumOfTransaction))) !== 'NaN' ? parseFloatVal((this.state.item.SumOfTransaction)) : '-'))}
                        {this.rowItem(R.strings.FromWallet, this.state.item.FromWalletName ? this.state.item.FromWalletName : '-')}
                        {this.rowItem(R.strings.ToWallet, this.state.item.ToWalletName ? this.state.item.ToWalletName : '-')}
                        {this.rowItem(R.strings.Date, this.state.item.CreatedDate ? formatedDateChganged : '-')}
                        {this.rowItem(R.strings.transaction + ' ' + R.strings.Date, !isEmpty(this.state.item.TrnDate) ? convertDate(this.state.item.TrnDate) : '-')}
                        {this.rowItem(R.strings.commission + ' ' + R.strings.Amount, ((parseFloatVal((this.state.item.CommissionAmount))) !== 'NaN' ? parseFloatVal((this.state.item.CommissionAmount)) : '-'))}
                        {this.rowItem(R.strings.transaction + ' ' + R.strings.Amount, ((parseFloatVal((this.state.item.TransactionAmount))) !== 'NaN' ? parseFloatVal((this.state.item.TransactionAmount)) : '-'))}

                        {/*  description */}
                        <View style={{
                            marginTop: R.dimens.widgetMargin,
                            paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,
                            marginBottom: R.dimens.widget_top_bottom_margin
                        }}>
                            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{R.strings.description + ': '}</TextViewHML>
                            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary }]}>{this.state.item.ReferralServiceDescription ? this.state.item.ReferralServiceDescription : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </ScrollView>
            </LinearGradient >
        );
    }

    rowItem = (title, value, marginBottom) => {
        if (typeof marginBottom === 'undefined') { marginBottom = false; }
        return <View style={{
            paddingRight: R.dimens.padding_left_right_margin,
            marginTop: R.dimens.widgetMargin,
            flexDirection: 'row',
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
            justifyContent: 'space-between',
            paddingLeft: R.dimens.padding_left_right_margin,

        }}>
            <TextViewHML style={[this.styles().contentItem,
            { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary, fontWeight: 'normal', textAlign: 'right' }]}>{value}</TextViewHML>
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

export default ConvertsListDetailScreen