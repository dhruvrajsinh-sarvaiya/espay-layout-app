import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { changeTheme, convertDate, parseFloatVal, } from '../../controllers/CommonUtils';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import R from '../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../Widget/ImageViewWidget';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import Button from '../../native_theme/components/Button';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

class MarginWalletListDetail extends Component {
    constructor(props) {
        super(props);

        //fill all the data from previous screen to state
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.MarginWalletInfo,
        };
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    render() {

        // set color Based on Status value 1=green else red
        let color = this.state.item.Status == 1 ? R.colors.successGreen : R.colors.failRed;

        return (
            <LinearGradient
                style={{ flex: 1, }}
                start={{ x: 0, y: 0 }}
                locations={[0, 1]}
                end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView isDetail={true} style={{ flex: 1 ,}}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        textStyle={{ color: 'white' }}
                        title={R.strings.MarginWallets}
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        isBack={true} nav={this.props.navigation} />

                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                        {/* Amount and CoinName is Merged With Toolbar using below design */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>

                            <TextViewMR style={[
                                this.styles().contentItem,
                                {
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                }]}>{R.strings.Txn_Amount}</TextViewMR>
                            <Text style={[
                                this.styles().contentItem,
                                {
                                    fontSize: R.dimens.largeText,
                                    fontFamily: Fonts.MontserratSemiBold,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                }]}>{(parseFloatVal(this.state.item.Balance).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.item.Balance).toFixed(8) : '-')} {this.state.item.CoinName ? this.state.item.CoinName : '-'}</Text>
                        </View>

                        {/* Details of Margin Wallet List Detail Screen*/}
                        {/* Card for rest details to display item */}
                        <CardView style={{
                            margin: R.dimens.margin_top_bottom,
                            padding: 0,
                            backgroundColor: R.colors.cardBackground,
                            paddingBottom: R.dimens.margin_top_bottom,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* Amount ,Currency with Icon and Balance */}
                            <View style={{
                                flexDirection: 'row',
                                margin: R.dimens.widget_top_bottom_margin,
                            }}>
                                <View style={{ width: wp('20%') }}>
                                    <View style={{
                                        width: R.dimens.signup_screen_logo_height,
                                        height: R.dimens.signup_screen_logo_height,
                                        borderRadius: R.dimens.paginationButtonRadious,
                                        backgroundColor: 'transparent',
                                    }}>
                                        <ImageViewWidget url={this.state.item.CoinName ? this.state.item.CoinName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                    </View>
                                </View>

                                <View style={{ width: wp('80%'), justifyContent: 'center' }}>
                                    <Text style={[this.styles().contentItem, { fontSize: R.dimens.largeText, fontFamily: Fonts.MontserratSemiBold, }]}>{this.state.item.CoinName}</Text>
                                </View>
                            </View>

                            <View style={{ marginBottom: R.dimens.widget_top_bottom_margin }} >
                                {/* History Details in list */}
                                {this.rowItem(R.strings.WalletName, this.state.item.WalletName ? this.state.item.WalletName : '-', true)}
                                {this.rowItem(R.strings.WalletUsageType, this.state.item.WalletUsageTypeName ? this.state.item.WalletUsageTypeName : '-', true)}
                                {this.rowItem(R.strings.OutBoundBalance, (parseFloatVal(this.state.item.OutBoundBalance).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.item.OutBoundBalance).toFixed(8) : '-'), true)}
                                {this.rowItem(R.strings.InBoundBalance, (parseFloatVal(this.state.item.InBoundBalance).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.item.InBoundBalance).toFixed(8) : '-'), true)}
                                {this.rowItem(R.strings.RoleName, this.state.item.RoleName ? this.state.item.RoleName : '-', true)}
                                {this.rowItem(R.strings.ExpiryDate, this.state.item.ExpiryDate ? convertDate(this.state.item.ExpiryDate) : '-', true)}
                                {this.rowItem(R.strings.status, this.state.item.StrStatus ? this.state.item.StrStatus : '-', true, color, true)}
                            </View>
                        </CardView>

                        {/* Deleverage Button */}
                        <View>
                            <Button
                                title={R.strings.Deleverage}
                                isRound={true}
                                isAlert={true}
                                onPress={() => this.props.navigation.navigate('Deleverage', { Currency: this.state.item.CoinName ? this.state.item.CoinName : '' })}
                                style={{ position: 'absolute', bottom: -0, elevation: (R.dimens.CardViewElivation * 2) }}
                                textStyle={{ color: R.colors.white }} />
                        </View>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        );
    }

    // title and value display in single row
    rowItem = (title, value, marginTop, fontColor, fontWeight) => {
        return <View style={{
            flexDirection: 'row',
            marginTop: marginTop ? R.dimens.widgetMargin : 0,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,
        }}>
            <View style={{ flex: 1 }}>
                <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            </View>
            <View style={{ flex: 1, }}>
                {fontWeight ?
                    <Text style={[this.styles().contentItem, { textAlign: 'right', color: fontColor ? fontColor : R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }]}>{value}</Text>
                    :
                    <TextViewHML style={[this.styles().contentItem, { textAlign: 'right', color: fontColor ? fontColor : R.colors.textPrimary, }]}>{value}</TextViewHML>
                }
            </View>
        </View>
    }

    styles = () => {
        return {
            contentItem: {
                fontSize: R.dimens.listItemText,
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

export default connect(mapStateToProps, mapDispatchToProps)(MarginWalletListDetail)