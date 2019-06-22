import React from 'react'
import { Component } from 'react';
import { View, ScrollView, Text, } from 'react-native'
import CountDown from '../../native_theme/components/CountDownComponent';
import CodeInput from 'react-native-code-input';
import Button from '../../native_theme/components/Button'
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts, ServiceUtilConstant } from '../../controllers/Constants';
import { getCardStyle } from '../../native_theme/components/CardView';
import { setData } from '../../App';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

class OTPScreenWidget extends Component {

    constructor(props) {
        super(props)

        // To bind method with component
        this.turnOffTimer = this.turnOffTimer.bind(this);
    }

    clear = () => {
        this.refs.etOTP.clear();
    }

    turnOffTimer = () => {
        setTimeout(() => {

            // clear screen name and interval
            setData({
                timerScreen: '',
                [ServiceUtilConstant.timerEndTime]: '00:00:00'
            });
            // To hide timer after 100 milliseconds because clearInterval code is under CountDown class
            this.props.ctx.setState({ isShowTimer: false })
        }, 100);
    }

    render() {

        // get required field from props
        let props = this.props;

        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} >
                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratBold }}>{R.strings.PleaseEnter}</Text>
                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'center' }}>{R.strings.verificationSMSMessage}</TextViewHML>
                    </View>
                    <View style={{ height: hp('10%') }}>
                        <CodeInput
                            ref="etOTP"
                            secureTextEntry
                            activeColor={R.colors.accent}
                            inactiveColor={R.colors.imageBorder}
                            autoFocus={false}
                            codeLength={6}
                            inputPosition='center'
                            borderType='square'
                            size={R.dimens.normalizePixels(42)}
                            cellBorderWidth={R.dimens.normalizePixels(1.0)}
                            onFulfill={(OTP) => { props.ctx.setState({ OTP, }) }}
                            containerStyle={{ marginTop: R.dimens.widget_top_bottom_margin }}
                            codeInputStyle={{
                                borderWidth: R.dimens.pickerBorderWidth,
                                backgroundColor: R.colors.cardBackground,
                                borderColor: R.colors.cardBackground,
                                ...getCardStyle(R.dimens.listCardElevation),
                            }}
                        />
                    </View>

                    {props.ctx.state.isShowTimer ?
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: R.dimens.activity_margin }}>
                            <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'right', fontFamily: Fonts.HindmaduraiSemiBold }} >{R.strings.Resend_In}  </Text>
                            <CountDown
                                until={props.ctx.state.until}
                                onFinish={this.turnOffTimer}
                                onChange={(until) => parseInt(until) == 0 && this.turnOffTimer()}
                                digitStyle={{ backgroundColor: R.colors.background }}
                                digitTxtStyle={{ color: R.colors.accent, fontSize: R.dimens.mediumText }}
                                timeToShow={['M', 'S']}
                                timeLabels={{ m: null, s: null }}
                                separatorStyle={{ color: R.colors.accent }}
                                showSeparator
                            />
                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center', }}>{R.strings.sec}</TextViewHML>
                        </View>
                        :
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: R.dimens.activity_margin }}>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'right' }} >{R.strings.DontReceivedCode}  </TextViewHML>
                            <View style={{ flex: 1, }}>
                                <TextViewMR style={{ fontSize: R.dimens.mediumText, color: R.colors.accent, textAlign: 'left', textDecorationLine: 'underline' }} onPress={props.ctx.state.isShowTimer ? null : props.ctx.onResendOTP}>{R.strings.ResendOtp.toUpperCase()}</TextViewMR>
                            </View>
                        </View>
                    }

                    {/* To Set Verify Button */}
                    <Button
                        isRound={true}
                        title={R.strings.VerifyOtp}
                        onPress={props.ctx.onVerifyOTP}
                        style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.widgetMargin }}
                        disabled={props.ctx.state.OTP === '' ? true : false} />
                </View>
            </ScrollView>
        )
    }
}

export default OTPScreenWidget;
