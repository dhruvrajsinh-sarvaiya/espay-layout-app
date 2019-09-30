import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text
} from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, parseFloatVal } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { isCurrentScreen } from '../../Navigation';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';


class ReferralRewardListDetail extends Component {

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

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };
    
    render() {
        let item = this.state.item;
        return (
            <LinearGradient style={{ flex: 1 }}
                locations={[0, 10]}
                end={{ x: 0, y: 1 }}
                start={{ x: 0, y: 0 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    backIconStyle={{ tintColor: 'white' }} toolbarColor={'transparent'}
                    textStyle={{ color: 'white' }} title={R.strings.referralDetail}
                    isBack={true} nav={this.props.navigation} />


                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                    {/* reward and CoinName is Merged With Toolbar using below design */}
                    <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text style={
                            {
                                fontSize: R.dimens.smallText,
                                color: R.colors.white,
                                textAlign: 'left',
                                fontFamily: Fonts.MontserratSemiBold,
                            }}>{R.strings.reward}</Text>

                        <Text style={
                            {
                                fontSize: R.dimens.mediumText,
                                fontFamily: Fonts.HindmaduraiSemiBold,
                                color: R.colors.white,
                                textAlign: 'left',
                            }}>{((parseFloatVal(this.state.item.RewardsPay).toFixed(8)) !== 'NaN' ? parseFloatVal(this.state.item.RewardsPay).toFixed(8) : '-') + ' ' + (this.state.item.CurrencyName ? (this.state.item.CurrencyName.toUpperCase()) : '')}</Text>
                    </View>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom,
                        padding: 0,
                        backgroundColor: R.colors.cardBackground,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        {/* Holding Currency with Icon and RewardsPay */}
                        <View style={{
                            flexDirection: 'row',
                            margin: R.dimens.widget_top_bottom_margin,
                        }}>
                            <View style={{ width: '25%', }}>
                                <View style={{
                                    width: R.dimens.signup_screen_logo_height,
                                    height: R.dimens.signup_screen_logo_height,
                                    backgroundColor: 'transparent',
                                    borderRadius: R.dimens.paginationButtonRadious,
                                }}>
                                    <ImageViewWidget url={this.state.item.CurrencyName ? this.state.item.CurrencyName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                </View>
                            </View>
                            <View style={{ width: '75%', flexDirection: 'column' }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.reward}</Text>
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{((parseFloatVal(this.state.item.RewardsPay).toFixed(8)) !== 'NaN' ? parseFloatVal(this.state.item.RewardsPay).toFixed(8) : '-') + ' ' + (this.state.item.CurrencyName ? (this.state.item.CurrencyName.toUpperCase()) : '')}</TextViewMR>
                            </View>
                        </View>

                        {/*  list */}
                        {this.rowItem(R.strings.referralSlab, validateValue(item.ReferMinCount) + " TO " + validateValue(item.ReferMaxCount))}
                        {this.rowItem(R.strings.pay + " " + R.strings.type, item.ReferralPayTypeName)}
                        {this.rowItem(R.strings.service + " " + R.strings.type, item.ReferralServiceTypeName)}
                        {this.rowItem(R.strings.Active + " " + R.strings.Date, convertDate(item.ActiveDate))}
                        {this.rowItem(R.strings.expire + " " + R.strings.Date, convertDate(item.ExpireDate))}
                        {this.rowItem(R.strings.createdDate, convertDate(item.CreatedDate))}
                        {this.rowItem(R.strings.description, item.Description ? item.Description : ' - ')}
                        {this.rowItem(R.strings.status, item.Status === 1 ? R.strings.Active : R.strings.Inactive, true)}
                    </CardView>

                </ScrollView>
            </LinearGradient >
        );
    }


    rowItem = (title, value, marginBottom) => {

        if (typeof marginBottom === 'undefined') {
            marginBottom = false;
        }

        //set status color
        let statusColor
        if (value === R.strings.Active)
            statusColor = R.colors.buyerGreen
        else if (value === R.strings.Inactive)
            statusColor = R.colors.failRed
        else
            statusColor = R.colors.textPrimary
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: R.dimens.widgetMargin,
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,

        }}>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.styles().contentItem, { color: statusColor ? statusColor : R.colors.textPrimary, fontWeight: 'normal', textAlign: 'right' }]}>{value}</TextViewHML>
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

export default ReferralRewardListDetail