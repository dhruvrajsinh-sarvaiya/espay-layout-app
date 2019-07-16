import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, parseFloatVal } from '../../controllers/CommonUtils';
import { validateValue } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../Widget/ImageViewWidget';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { Fonts } from '../../controllers/Constants';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

class LeverageReportDetail extends Component {

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

        return (
            <LinearGradient style={{ flex: 1, }}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView isDetail={true} style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        textStyle={{ color: 'white' }}
                        title={R.strings.LeverageReport}
                        isBack={true} nav={this.props.navigation} />

                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                        {/* Amount and CoinName is Merged With Toolbar using below design */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                            <TextViewMR style={
                                {
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                }}>{R.strings.Amount}</TextViewMR>
                            <Text style={
                                {
                                    fontSize: R.dimens.largeText,
                                    fontWeight: 'bold',
                                    color: R.colors.white,
                                    textAlign: 'left',
                                    fontFamily: Fonts.MontserratSemiBold,
                                }}>{((parseFloatVal((this.state.item.Amount)).toFixed(8)) !== 'NaN' ? parseFloatVal((this.state.item.Amount)).toFixed(8) : '-')}</Text>
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            margin: R.dimens.margin_top_bottom,
                            padding: 0,
                            backgroundColor: R.colors.cardBackground,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* Holding Currency with Icon and UserName */}
                            <View style={{
                                flexDirection: 'row',
                                margin: R.dimens.widget_top_bottom_margin,
                            }}>
                                <View style={{ width: wp('25%'), justifyContent: 'center' }}>
                                    <View style={{
                                        width: R.dimens.signup_screen_logo_height,
                                        height: R.dimens.signup_screen_logo_height,
                                        backgroundColor: 'transparent',
                                        borderRadius: R.dimens.paginationButtonRadious,
                                    }}>
                                        <ImageViewWidget url={this.state.item.WalletTypeName ? this.state.item.WalletTypeName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                    </View>
                                </View>

                                <View style={{ width: wp('75%'), flexDirection: 'column' }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{this.state.item.WalletTypeName ? (this.state.item.WalletTypeName.toUpperCase()) : '-'}</Text>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{this.state.item.UserName ? this.state.item.UserName : '-'}</TextViewMR>
                                    <TextViewMR style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{this.state.item.Email ? this.state.item.Email : '-'}</TextViewMR>
                                </View>
                            </View>

                            {/* Leverage Report Details in list */}
                            {this.rowItem(R.strings.FromWallet, this.state.item.FromWalletName ? this.state.item.FromWalletName : '-')}
                            {this.rowItem(R.strings.ToWallet, this.state.item.ToWalletName ? this.state.item.ToWalletName : '-')}
                            {this.rowItem(R.strings.LeverageAmount, ((parseFloatVal((this.state.item.LeverageAmount)).toFixed(8)) !== 'NaN' ? parseFloatVal((this.state.item.LeverageAmount)).toFixed(8) : '-'))}
                            {this.rowItem(R.strings.ChargeAmount, ((parseFloatVal((this.state.item.ChargeAmount)).toFixed(8)) !== 'NaN' ? parseFloatVal((this.state.item.ChargeAmount)).toFixed(8) : '-'))}
                            {this.rowItem(R.strings.LeveragePer, (validateValue(this.state.item.LeveragePer)))}
                            {this.rowItem(R.strings.MarginAmount, ((parseFloatVal((this.state.item.SafetyMarginAmount)).toFixed(8)) !== 'NaN' ? parseFloatVal((this.state.item.SafetyMarginAmount)).toFixed(8) : '-'))}
                            {this.rowItem(R.strings.CreditAmount, ((parseFloatVal((this.state.item.CreditAmount)).toFixed(8)) !== 'NaN' ? parseFloatVal((this.state.item.CreditAmount)).toFixed(8) : '-'))}
                            {this.rowItem(R.strings.remarks, this.state.item.SystemRemarks ? this.state.item.SystemRemarks : '-')}
                            {this.rowItem(R.strings.Date, this.state.item.TrnDate ? convertDate(this.state.item.TrnDate) : '-')}
                            {this.rowItem(R.strings.Status, this.state.item.StrStatus ? this.state.item.StrStatus : '-', true, true)}
                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        );
    }

    // for displaying title and value horizontally 
    rowItem = (title, value, marginBottom = false, status = false) => {

        let color = R.colors.accent;

        //To Display various Status Color in ListView
        if (this.state.item.Status === 0) {
            color = R.colors.textPrimary
        }
        if (this.state.item.Status === 1) {
            color = R.colors.successGreen
        }
        if (this.state.item.Status === 3) {
            color = R.colors.failRed
        }
        if (this.state.item.Status === 6) {
            color = R.colors.accent
        }
        if (this.state.item.Status === 9) {
            color = R.colors.failRed
        }
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: R.dimens.widgetMargin,
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,

        }}>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.styles().contentItem, { color: status ? color : R.colors.textPrimary, textAlign: 'right' }]}>{value}</TextViewHML>
        </View>
    }

    // style for this class
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

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LeverageReportDetail)