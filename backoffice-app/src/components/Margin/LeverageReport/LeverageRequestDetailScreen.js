import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme, parseFloatVal, convertDate } from '../../../controllers/CommonUtils';
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { Fonts } from '../../../controllers/Constants';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { validateValue } from '../../../validations/CommonValidation';
import RowItem from '../../../native_theme/components/RowItem';

export class LeverageRequestDetailScreen extends Component {
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

        //To Display various Status Color in ListView
        let color = R.colors.accent;
        if (item.Status === 0)
            color = R.colors.textPrimary

        if (item.Status === 1)
            color = R.colors.successGreen

        if (item.Status == 3 || item.Status == 9)
            color = R.colors.failRed

        if (item.Status === 6)
            color = R.colors.yellow

        return (
            <LinearGradient style={{ flex: 1, }}
                locations={[0, 1]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <View style={{ flex: 1 }}>
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        textStyle={{ color: 'white' }}
                        title={R.strings.leverageRequests}
                        isBack={true} nav={this.props.navigation} />

                    <ScrollView contentContainerStyle={{
                        paddingBottom: R.dimens.margin_top_bottom
                    }}
                        keyboardShouldPersistTaps={'always'}
                        showsVerticalScrollIndicator={false}
                    >

                        {/* Amount and CoinName is Merged With Toolbar using below design */}
                        <View style={{
                            marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin,
                            marginLeft: (R.dimens.margin_top_bottom * 2),
                        }}>
                            <TextViewMR style={
                                {
                                    textAlign: 'left', color: R.colors.white,
                                    fontSize: R.dimens.smallText,
                                }}>{R.strings.Amount}</TextViewMR>
                            <Text style={
                                {
                                    fontWeight: 'bold',
                                    fontSize: R.dimens.largeText, textAlign: 'left',
                                    fontFamily: Fonts.MontserratSemiBold,
                                    color: R.colors.white,
                                }}>{((parseFloatVal((item.Amount)).toFixed(8)) !== 'NaN' ? parseFloatVal((item.Amount)).toFixed(8) : '-')}</Text>
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{margin: R.dimens.margin_top_bottom,
                            padding: 0,
                            backgroundColor: R.colors.cardBackground,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* Holding Currency with Icon and UserName */}
                            <View style={{ flexDirection: 'row',
                             margin: R.dimens.widget_top_bottom_margin, }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <View style={{height: R.dimens.signup_screen_logo_height,
                                        width: R.dimens.signup_screen_logo_height,
                                        backgroundColor: 'transparent',
                                        borderRadius: R.dimens.paginationButtonRadious,
                                    }}>
                                        <ImageViewWidget 
                                        url={item.WalletTypeName ? item.WalletTypeName : ''} 
                                        height={R.dimens.signup_screen_logo_height} 
                                        width={R.dimens.signup_screen_logo_height} 
                                        />
                                    </View>
                                </View>

                                <View style={{ flex: 1,
                                     marginLeft: R.dimens.margin }}>
                                    <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{item.WalletTypeName ? (item.WalletTypeName.toUpperCase()) : '-'}</Text>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>
                                        {item.UserName ? item.UserName : '-'}
                                    </TextViewMR>
                                    <TextViewMR style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{item.Email ? item.Email : '-'}</TextViewMR>
                                </View>
                            </View>

                            {/* Leverage Report Details in list */}
                            <RowItem title={R.strings.FromWallet} value={validateValue(item.FromWalletName)} />
                            <RowItem title={R.strings.ToWallet} value={validateValue(item.ToWalletName)} />
                            <RowItem title={R.strings.LeverageAmount} value={(parseFloatVal(item.LeverageAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(item.LeverageAmount).toFixed(8) : '-'} />
                            <RowItem title={R.strings.ChargeAmount} value={(parseFloatVal(item.ChargeAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(item.ChargeAmount).toFixed(8) : '-'} />
                            <RowItem title={R.strings.LeveragePer} value={validateValue(item.LeveragePer)} />
                            <RowItem title={R.strings.MarginAmount} value={(parseFloatVal(item.SafetyMarginAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(item.SafetyMarginAmount).toFixed(8) : '-'} />
                            <RowItem title={R.strings.CreditAmount} value={(parseFloatVal(item.CreditAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(item.CreditAmount).toFixed(8) : '-'} />
                            <RowItem title={R.strings.remarks} value={validateValue(item.SystemRemarks)} />
                            <RowItem title={R.strings.Date} value={validateValue(convertDate(item.TrnDate))} />
                            <RowItem title={R.strings.Status} value={item.StrStatus} color={color} marginBottom={true} status={true} />

                        </CardView>
                    </ScrollView>
                </View>
            </LinearGradient>
        )
    }
}

export default LeverageRequestDetailScreen
