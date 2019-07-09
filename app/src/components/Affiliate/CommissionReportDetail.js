import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, parseFloatVal } from '../../controllers/CommonUtils';
import { validateValue } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../Widget/ImageViewWidget';
import { isCurrentScreen } from '../Navigation';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

class CommissionReportDetail extends Component {

    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

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

                {/* To Set StatusBar as per our theme */}
                <CommonStatusBar />

                <SafeView isDetail={true}>
                    {/* To Set ToolBar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        textStyle={{ color: 'white' }}
                        title={R.strings.commissionReportDetail}
                        isBack={true} nav={this.props.navigation} />


                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                        {/* Amount and CoinName is Merged With Toolbar using below design */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                            <Text style={
                                {
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                    fontFamily: Fonts.MontserratSemiBold,
                                }}>{R.strings.Amount}</Text>

                            <Text style={
                                {
                                    fontSize: R.dimens.mediumText,
                                    fontFamily: Fonts.HindmaduraiSemiBold,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                }}>{((parseFloatVal(this.state.item.Amount).toFixed(8)) !== 'NaN' ? parseFloatVal(this.state.item.Amount).toFixed(8) : '-') + ' ' + (this.state.item.TrnWalletTypeName ? (this.state.item.TrnWalletTypeName.toUpperCase()) : '')}</Text>
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            padding: 0,
                            margin: R.dimens.margin_top_bottom,
                            backgroundColor: R.colors.cardBackground,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* Holding Currency with Icon and Balance */}
                            <View style={{
                                flexDirection: 'row', margin: R.dimens.widget_top_bottom_margin,
                            }}>
                                <View style={{ width: wp('25%'), }}>
                                    <View style={{
                                        borderRadius: R.dimens.paginationButtonRadious,
                                        width: R.dimens.signup_screen_logo_height,
                                        height: R.dimens.signup_screen_logo_height,
                                        backgroundColor: 'transparent',
                                    }}>
                                        <ImageViewWidget url={this.state.item.TrnWalletTypeName ? this.state.item.TrnWalletTypeName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                    </View>
                                </View>
                                <View style={{ width: wp('75%'), flexDirection: 'column' }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold, }}>{this.state.item.TrnWalletTypeName ? (this.state.item.TrnWalletTypeName.toUpperCase()) : '-'}</Text>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{this.state.item.AffiliateUserName ? this.state.item.AffiliateUserName : '-'}</TextViewMR>
                                </View>
                            </View>

                            {this.rowItem(R.strings.trnRefno, this.state.item.TrnRefNo ? this.state.item.TrnRefNo : '-')}
                            {this.rowItem(R.strings.cronRefNo, this.state.item.CronRefNo ? this.state.item.CronRefNo : '-')}
                            {this.rowItem(R.strings.FromWallet, this.state.item.FromWalletName ? this.state.item.FromWalletName : '-')}
                            {this.rowItem(R.strings.ToWallet, this.state.item.ToWalletName ? this.state.item.ToWalletName : '-')}
                            {this.rowItem(R.strings.affliateUserId, this.state.item.AffiliateUserId ? this.state.item.AffiliateUserId : '-')}
                            {this.rowItem(R.strings.affliateEmail, this.state.item.affiliateemail ? this.state.item.affiliateemail : '-')}
                            {this.rowItem(R.strings.schemeMapping, this.state.item.SchemeMappingName ? this.state.item.SchemeMappingName : '-')}
                            {this.rowItem(R.strings.trnUserId, this.state.item.TrnUserId ? this.state.item.TrnUserId : '-')}
                            {this.rowItem(R.strings.trnUserName, this.state.item.TrnUserName ? this.state.item.TrnUserName : '-')}
                            {this.rowItem(R.strings.trnEmail, this.state.item.trnemail ? this.state.item.trnemail : '-')}
                            {this.rowItem(R.strings.remarks, this.state.item.Remarks ? this.state.item.Remarks : '-')}
                            {this.rowItem(R.strings.commission, (parseFloatVal(this.state.item.CommissionPer) !== 'NaN' ? validateValue(parseFloatVal(this.state.item.CommissionPer) + '%') : '-'))}
                            {this.rowItem(R.strings.level, this.state.item.Level ? this.state.item.Level : '-')}
                            {this.rowItem(R.strings.trnAmount, (parseFloatVal(this.state.item.TransactionAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(this.state.item.TransactionAmount).toFixed(8)) : '-'))}
                            {this.rowItem(R.strings.Trn_Date, this.state.item.TrnDate ? convertDate(this.state.item.TrnDate) : '-')}
                            {this.rowItem(R.strings.status, this.state.item.Status ? (this.state.item.Status === 1 ? R.strings.Success : R.strings.Failed) : '-', true, this.state.item.Status === 1 ? R.colors.successGreen : R.colors.failRed)}
                        </CardView>

                    </ScrollView>
                </SafeView>
            </LinearGradient >
        );
    }

    rowItem = (title, value, marginBottom, color) => {

        if (typeof marginBottom === 'undefined') {
            marginBottom = false;
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
            <TextViewHML style={[this.styles().contentItem, { color: color ? color : R.colors.textPrimary, fontWeight: 'normal', textAlign: 'right' }]}>{value}</TextViewHML>
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
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(CommissionReportDetail)