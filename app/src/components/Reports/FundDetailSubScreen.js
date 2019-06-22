import React, { Component } from 'react';
import { View, Text, ScrollView, Clipboard, } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseFloatVal } from '../../controllers/CommonUtils';
import ImageButton from '../../native_theme/components/ImageTextButton';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import Button from '../../native_theme/components/Button';
import ChartView from 'react-native-highcharts';
import { validateValue } from '../../validations/CommonValidation';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class FundDetailSubScreen extends Component {
    constructor(props) {
        super(props);

        //To Bind All Method
        this.copyAddress = this.copyAddress.bind(this);
        this.onButtonPress = this.onButtonPress.bind(this);

        //To Fetch value From Previous Screen
        this.params = this.props.navigation.state.params;
        this.isCheckValue = false;
        if (this.params.UnSettledBalance < 1 && this.params.UnClearedBalance < 1 && this.params.AvailableBalance < 1 && this.params.ShadowBalance < 1 && this.params.StackingBalance < 1) {
            this.params.UnSettledBalance = 1;
            this.isCheckValue = true;
        }

        //Define All initial State
        this.state = {
            chartdata: [
                {
                    name: R.strings.UnSettledBalance,
                    y: this.params.UnSettledBalance,
                },
                {
                    name: R.strings.UnClearedBalance,
                    y: this.params.UnClearedBalance,
                },
                {
                    name: R.strings.Ava_Bal,
                    y: this.params.AvailableBalance,
                },
                {
                    name: R.strings.ShadowBalance,
                    y: this.params.ShadowBalance,
                },
                {
                    name: R.strings.StackingBalance,
                    y: this.params.StackingBalance,
                }
            ],
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    // Copy Functionality
    copyAddress = async (Address) => {

        //Copy Address
        await Clipboard.setString(Address ? Address : '');
        this.refs.Toast.Show(R.strings.Copy_SuccessFul);
    }

    onButtonPress = async (value) => {

        var { navigate } = this.props.navigation;

        //if value = true then redirect user to withdraw Screen elase redirect user to deposit Screen
        if (value) {
            navigate('CoinSelectScreen', { isAction: ServiceUtilConstant.From_Withdraw })
        } else {
            navigate('CoinSelectScreen', { isAction: ServiceUtilConstant.From_Deposit })
        }
    }

    render() {

        //For Pie Chart Parameters
        var pia_conf = {
            chart: {
                backgroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            credits: { enabled: false },
            exporting: {
                enabled: false
            },
            title: {
                text: "",
                style: {
                    color: R.colors.textPrimary,
                    fontFamily: Fonts.MontserratRegular,
                }
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                series: {
                    boostThreshold: 500 // number of points in one series, when reaching this number, boost.js module will be used
                },
                pie: {
                    size: R.dimens.piechartHeight,
                    allowPointSelect: false,
                    cursor: 'pointer',
                    colors: ['#B2B2BE', '#B99058', '#737DBE', '#3FA0BB', '#F20E5C'],
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                        style: {
                            fontFamily: Fonts.HindmaduraiLight,
                            color: R.colors.textPrimary
                        }
                    },
                    showInLegend: false,
                }
            },
            series: [{
                innerSize: '75%',
                name: "",
                colorByPoint: true,
                data: this.state.chartdata
            }],
        };

        var pia_options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };

        return (
            <SafeView isDetail={true} style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* for display Toast */}
                <CommonToast ref="Toast" />

                {/* To set toolbar as per our theme */}
                <CustomToolbar isBack={true} nav={this.props.navigation} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            paddingLeft: R.dimens.widget_left_right_margin,
                            paddingRight: R.dimens.widget_left_right_margin,
                        }}>
                            <View style={{ justifyContent: 'flex-start', alignContent: 'flex-start', flex: 1, flexDirection: 'column' }}>

                                {/* Trn Amount And Wallet Name is Merged With Toolbar using below design */}
                                <Text style={[
                                    this.styles().contentItem,
                                    {
                                        fontSize: R.dimens.largeText,
                                        fontFamily: Fonts.MontserratBold,
                                        color: R.colors.textPrimary,
                                    }]}>{this.params.WalletName ? this.params.WalletName : '-'}</Text>

                                {/* display Available balance and type */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={[
                                        this.styles().contentItem,
                                        {
                                            fontSize: R.dimens.smallText,
                                            color: R.colors.textPrimary,
                                        }]}>{validateValue(this.params.AvailableBalance)} {this.params.TypeName ? this.params.TypeName : '-'}</TextViewHML>
                                    <TextViewHML style={[this.styles().contentItem, {
                                        color: R.colors.textSecondary,
                                        fontSize: R.dimens.smallText,
                                    }]}> {R.strings.Balance}</TextViewHML>
                                </View>

                            </View>
                        </View>

                        {this.params.PublicAddress ?
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignContent: 'center',
                                paddingBottom: R.dimens.widgetMargin,
                                paddingLeft: R.dimens.widget_left_right_margin,
                                paddingRight: R.dimens.widget_left_right_margin,
                            }}>

                                {/* To Displat Public Address  */}
                                <View style={{ width: '90%', justifyContent: 'center' }}>
                                    <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary }]}>{this.params.PublicAddress ? this.params.PublicAddress : '-'}</TextViewHML>
                                </View>

                                {/* display copy icon */}
                                <View style={{ width: '10%' }}>
                                    <ImageButton
                                        icon={R.images.COPY_ICON}
                                        onPress={() => this.copyAddress(this.params.PublicAddress)}
                                        style={{ margin: 0 }}
                                        iconStyle={{ tintColor: R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                    />
                                </View>
                            </View>
                            : <View style={{
                                paddingTop: R.dimens.widget_left_right_margin,
                            }}></View>}

                        <ScrollView showsVerticalScrollIndicator={false} >
                            <View style={{ paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding }}>

                                {/* for display Pie chart */}
                                <ChartView
                                    style={{ height: R.dimens.chartHeightSmall, backgroundColor: 'transparent', }}
                                    config={pia_conf}
                                    originWhitelist={['*']}
                                    options={pia_options} />

                                <View style={{ margin: R.dimens.widget_top_bottom_margin }}>

                                    {/* for display UnSettledBalance */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ justifyContent: 'center', alignContent: 'center', marginRight: R.dimens.widgetMargin }}>
                                            <View style={{ backgroundColor: '#B2B2BE', borderRadius: 90, height: R.dimens.smallestText, width: R.dimens.smallestText }}></View>
                                        </View>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, justifyContent: 'center' }}>{R.strings.UnSettledBalance.toUpperCase()}</TextViewHML>
                                        {
                                            this.isCheckValue ?
                                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, alignContent: 'flex-end' }}>0.00000000</TextViewHML>
                                                :
                                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, alignContent: 'flex-end' }}>{parseFloatVal(this.params.UnSettledBalance).toFixed(8) !== 'NaN' ? parseFloatVal(this.params.UnSettledBalance).toFixed(8) : '-'}</TextViewHML>
                                        }
                                    </View>

                                    {/* for display UnClearedBalance */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ justifyContent: 'center', alignContent: 'center', marginRight: R.dimens.widgetMargin }}>
                                            <View style={{ backgroundColor: '#B99058', borderRadius: 90, height: R.dimens.smallestText, width: R.dimens.smallestText }}></View>
                                        </View>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.UnClearedBalance.toUpperCase()}</TextViewHML>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, alignContent: 'flex-end' }}>{parseFloatVal(this.params.UnClearedBalance).toFixed(8) !== 'NaN' ? parseFloatVal(this.params.UnClearedBalance).toFixed(8) : '-'}</TextViewHML>
                                    </View>

                                    {/* for display ShadowBalance */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ justifyContent: 'center', alignContent: 'center', marginRight: R.dimens.widgetMargin }}>
                                            <View style={{ backgroundColor: '#3FA0BB', borderRadius: 90, height: R.dimens.smallestText, width: R.dimens.smallestText }}></View>
                                        </View>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.ShadowBalance.toUpperCase()}</TextViewHML>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, alignContent: 'flex-end' }}>{parseFloatVal(this.params.ShadowBalance).toFixed(8) !== 'NaN' ? parseFloatVal(this.params.ShadowBalance).toFixed(8) : '-'}</TextViewHML>
                                    </View>

                                    {/* for display StackingBalance */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ justifyContent: 'center', alignContent: 'center', marginRight: R.dimens.widgetMargin }}>
                                            <View style={{ backgroundColor: '#F20E5C', borderRadius: 90, height: R.dimens.smallestText, width: R.dimens.smallestText }}></View>
                                        </View>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.StackingBalance.toUpperCase()}</TextViewHML>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, alignContent: 'flex-end' }}>{parseFloatVal(this.params.StackingBalance).toFixed(8) !== 'NaN' ? parseFloatVal(this.params.StackingBalance).toFixed(8) : '-'}</TextViewHML>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>

                    {/* Button of Withdraw and Deposit */}
                    <View style={{ flexDirection: 'row', paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <View style={{ flex: 1 }}>
                            <Button
                                title={R.strings.Withdraw}
                                textStyle={{ fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratRegular }}
                                style={{
                                    height: R.dimens.ButtonHeight,
                                    margin: 0,
                                    marginRight: R.dimens.widgetMargin,
                                }}
                                onPress={() => this.onButtonPress(true)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button
                                title={R.strings.deposit}
                                textStyle={{ fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratRegular }}
                                style={{
                                    height: R.dimens.ButtonHeight,
                                    margin: 0,
                                    marginLeft: R.dimens.widgetMargin,
                                }}
                                onPress={() => this.onButtonPress(false)}
                            />
                        </View>
                    </View>
                </View>
            </SafeView >
        );
    }

    // styles for this class
    styles = () => {
        return {
            contentItem: {
                fontSize: R.dimens.listItemText,
                color: R.colors.textSecondary
            }
        }
    }
}

export default FundDetailSubScreen;