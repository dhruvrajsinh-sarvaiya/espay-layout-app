import React, { Component } from 'react'
import { View, ScrollView, Text } from 'react-native'
import CountDown from 'react-native-countdown-component';
import CodeInput from 'react-native-code-input';
import Button from '../../native_theme/components/Button'
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';

const { height } = R.screen();

export default class OTPScreenWidget extends Component {

    clear = () => {
        this.refs.etOTP.clear();
    }

    render() {
        let props = this.props;
        return (

            <View style={{ flex: 1, justifyContent: 'space-between', }}>
                {/* To Set All View in ScrolView */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <BackgroundImageHeaderWidget />

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratBold }}>{R.strings.PleaseEnter}</Text>
                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'center' }}>{R.strings.verificationSMSMessage}</TextViewHML>
                        </View>
                        <View style={{ height: height / 10 }}>
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
                                codeInputStyle={{ borderWidth: R.dimens.pickerBorderWidth, backgroundColor: R.colors.cardBackground, elevation: R.dimens.listCardElevation, borderColor: R.colors.cardBackground, }}
                            />
                        </View>

                        {props.ctx.state.isShowTimer ?
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: R.dimens.activity_margin }}>
                                <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'right', fontFamily: Fonts.HindmaduraiSemiBold }} >{R.strings.Resend_In}  </Text>
                                <CountDown
                                    until={props.ctx.state.until}
                                    onFinish={() => {
                                        // To hide timer after 200 milliseconds because clearInterval code is under CountDown class
                                        setTimeout(() => {
                                            props.ctx.setState({ isShowTimer: false })
                                        }, 200);
                                    }}
                                    digitStyle={{ backgroundColor: R.colors.background}}
                                    digitTxtStyle={{ color: R.colors.accent,fontSize:R.dimens.mediumText }}
                                    timeToShow={['M', 'S']}
                                    timeLabels={{ m: null, s: null }}
                                    separatorStyle={{ color: R.colors.accent }}
                                    showSeparator
                                />
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center',}}>{R.strings.sec}</TextViewHML>
                            </View>
                            :
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: R.dimens.activity_margin }}>
                                <TextViewHML style={{ flex:1,fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'right' }} >{R.strings.DontReceivedCode}  </TextViewHML>
                                <View style={{flex:1,}}>
                                    <TextViewMR style={{fontSize: R.dimens.mediumText, color: R.colors.accent, textAlign: 'left',textDecorationLine:'underline' }} onPress={props.ctx.state.isShowTimer ? null : props.ctx.onResendOTP}>{R.strings.ResendOtp.toUpperCase()}</TextViewMR>
                                </View>
                            </View>
                        }

                        {/* To Set Verify Button */}
                        <Button
                            isRound={true}
                            title={R.strings.VerifyOtp}
                            onPress={props.ctx.onVerifyOTP}
                            style={{ marginTop: R.dimens.padding_top_bottom_margin, }}
                            disabled={props.ctx.state.OTP === '' ? true : false} />

                    </View>
                </ScrollView>
            </View>
        )
    }
}
