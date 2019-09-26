import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, parseFloatVal } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { Fonts } from '../../../controllers/Constants';
import SafeView from '../../../native_theme/components/SafeView';
import RowItem from '../../../native_theme/components/RowItem';

class LevarageReportDetailScreen extends Component {

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
        let { item } = this.state
        let color = R.colors.accent;
        let statusText = ''

        //initialize 
        if (item.Status === 0) {
            statusText = R.strings.Initialize
            color = R.colors.accent
        }
        //open 
        else if (item.Status === 1) {
            color = R.colors.successGreen
            statusText = R.strings.open
        }
        //failed 
        else if (item.Status === 3) {
            statusText = R.strings.Failed
            color = R.colors.failRed
        }

        //withdraw 
        else if (item.Status === 5) {
            statusText = R.strings.withdraw
            color = R.colors.accent
        }
        //Rejected 
        else if (item.Status === 9) {
            statusText = R.strings.Rejected
            color = R.colors.failRed
        }
        else {
            statusText = 'N/A'
            color = R.colors.accent
        }

        return (
            <LinearGradient
                locations={[0, 1]} style={{ flex: 1, }}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight,
                R.colors.detailBgDark]}>

                <SafeView style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        isBack={true} nav={this.props.navigation}
                        textStyle={{ color: 'white' }}
                        title={R.strings.LeverageReport}
                    />

                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                        {/* Amount and CoinName is Merged With Toolbar using below design */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                            <TextViewMR style={
                                {
                                    color: R.colors.white,
                                    textAlign: 'left',
                                    fontSize: R.dimens.smallText,
                                }}>{R.strings.Amount}</TextViewMR>
                            <Text style={
                                {
                                    fontSize: R.dimens.largeText,
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    fontFamily: Fonts.MontserratSemiBold,
                                    color: R.colors.white,
                                }}>{((parseFloatVal((this.state.item.Amount)).toFixed(8)) !== 'NaN' ? parseFloatVal((this.state.item.Amount)).toFixed(8) : '-')}</Text>
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            margin: R.dimens.margin_top_bottom,
                            backgroundColor: R.colors.cardBackground,
                            padding: 0,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* Holding Currency with Icon and UserName */}
                            <View style={{
                                flexDirection: 'row',
                                margin: R.dimens.widget_top_bottom_margin,
                            }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <View style={{
                                        height: R.dimens.signup_screen_logo_height,
                                        width: R.dimens.signup_screen_logo_height,
                                        backgroundColor: 'transparent',
                                        borderRadius: R.dimens.paginationButtonRadious,
                                    }}>
                                        <ImageViewWidget url={this.state.item.WalletTypeName ? this.state.item.WalletTypeName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                    </View>
                                </View>

                                <View style={{ flex: 1, marginLeft: R.dimens.margin, }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{this.state.item.WalletTypeName ? (this.state.item.WalletTypeName.toUpperCase()) : '-'}</Text>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{this.state.item.UserName ? this.state.item.UserName : '-'}</TextViewMR>
                                    <TextViewMR style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{this.state.item.Email ? this.state.item.Email : '-'}</TextViewMR>
                                </View>
                            </View>

                            {/* Leverage Report Details in list */}
                            <RowItem
                                value={validateValue(item.FromWalletName)}
                                title={R.strings.FromWallet}
                            />
                            <RowItem title={R.strings.ToWallet}
                                value={validateValue(item.ToWalletName)} />
                            <RowItem title={R.strings.LeverageAmount}
                                value={(parseFloatVal(item.LeverageAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(item.LeverageAmount).toFixed(8) : '-'} />
                            <RowItem title={R.strings.ChargeAmount}
                                value={(parseFloatVal(item.ChargeAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(item.ChargeAmount).toFixed(8) : '-'} />
                            <RowItem title={R.strings.LeveragePer}
                                value={validateValue(item.LeveragePer)} />
                            <RowItem title={R.strings.MarginAmount}
                                value={(parseFloatVal(item.SafetyMarginAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(item.SafetyMarginAmount).toFixed(8) : '-'} />
                            <RowItem title={R.strings.CreditAmount}
                                value={(parseFloatVal(item.CreditAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(item.CreditAmount).toFixed(8) : '-'} />
                            <RowItem title={R.strings.remarks}
                                value={validateValue(item.SystemRemarks)} />
                            <RowItem title={R.strings.approvedBy}
                                value={validateValue(item.ApprovedByUserName)} />
                            <RowItem title={R.strings.Date}
                                value={validateValue(convertDate(item.TrnDate))} />
                            <RowItem title={R.strings.Status}
                                marginBottom={true}
                                value={statusText} color={color}
                                status={true} />

                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        )
    }
}


export default LevarageReportDetailScreen