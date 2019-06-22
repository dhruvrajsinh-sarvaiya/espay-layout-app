import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate } from '../../controllers/CommonUtils';
import R from '../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../Widget/ImageViewWidget';
import { validateValue } from '../../validations/CommonValidation';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

class PortfolioListDetail extends Component {
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
    };

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
                        title={R.strings.portfolioDetail}
                        isBack={true} nav={this.props.navigation} />

                    {/* Details of Withdrawal Report Detail Screen*/}
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                        {/* Amount and CoinName is Merged With Toolbar using below design */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                            <TextViewMR style={[
                                this.styles().contentItem,
                                {
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                    marginTop: R.dimens.margin
                                }]}>{R.strings.yourPrice}</TextViewMR>
                            <Text style={[
                                this.styles().contentItem,
                                {
                                    fontSize: R.dimens.largeText,
                                    fontFamily: Fonts.MontserratSemiBold,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                    marginBottom: R.dimens.widgetMargin,
                                }]}>{validateValue(this.state.item.Price)} {this.state.item.PairName ? this.state.item.PairName.split('_')[1] : '-'}</Text>
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
                                <View style={{ width: wp('20%'), }}>
                                    <View style={{
                                        width: R.dimens.signup_screen_logo_height,
                                        height: R.dimens.signup_screen_logo_height,
                                        backgroundColor: 'transparent',
                                        borderRadius: R.dimens.paginationButtonRadious,
                                    }}>
                                        <ImageViewWidget url={this.state.item.currencySymbol ? this.state.item.currencySymbol : '-'} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                    </View>
                                </View>

                                <View style={{ width: wp('80%'), flexDirection: 'column' }}>
                                    <Text style={[this.styles().contentItem, { fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold }]}>{this.state.item.PairName ? this.state.item.PairName.replace('_', '/') : '-'} </Text>
                                    <TextViewMR style={[this.styles().contentItem, { fontSize: R.dimens.mediumText, color: R.colors.textSecondary }]}> {validateValue(this.state.item.Amount)}</TextViewMR>
                                </View>
                            </View>

                            {/*  list */}
                            {this.rowItem(R.strings.transactionNo, this.state.item.TrnNo ? this.state.item.TrnNo : '-')}
                            {this.rowItem(R.strings.type, this.state.item.Type ? this.state.item.Type : '-')}
                            {this.rowItem(R.strings.orderType, this.state.item.OrderType ? this.state.item.OrderType : '-')}
                            {this.rowItem(R.strings.Charge, validateValue(this.state.item.ChargeRs))}
                            {this.rowItem(R.strings.Total, validateValue(this.state.item.Total))}
                            {this.rowItem(R.strings.isCencel, this.state.item.IsCancel === 0 ? R.strings.no : R.strings.yes_text)}
                            {this.rowItem(R.strings.Date, convertDate(this.state.item.DateTime))}
                            {this.rowItem(R.strings.status, this.state.item.StatusText ? this.state.item.StatusText : '-', color = this.state.item.Status === 1 ? R.colors.successGreen : R.colors.failRed, marginBottom = true)}
                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient >
        );
    }

    rowItem = (title, value, color, marginBottom = false) => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: R.dimens.marginTop ? R.dimens.widget_top_bottom_margin : 0,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
        }}>
            <TextViewHML style={{
                flex: 1,
                fontSize: R.dimens.smallText,
                color: R.colors.textSecondary
            }}>{title}</TextViewHML>
            <TextViewHML style={{
                flex: 1,
                fontSize: R.dimens.smallText,
                color: color ? color : R.colors.textPrimary,
                textAlign: 'right'
            }}>{value}</TextViewHML>
        </View >
    }
    styles = () => {
        return {
            contentItem: {
                fontSize: R.dimens.smallestText,
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
)(PortfolioListDetail)
