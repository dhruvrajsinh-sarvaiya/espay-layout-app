import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Image,
    Text
} from 'react-native';
import { resendConfirmationLink } from '../../actions/SignUpProcess/signUpAction'
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isInternet, validateResponseNew } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import { isCurrentScreen } from '../Navigation'
import { changeTheme, getDeviceID, showAlert, sendEvent, } from '../../controllers/CommonUtils';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { ServiceUtilConstant, Fonts, Events } from '../../controllers/Constants';
import CountDown from '../../native_theme/components/CountDownComponent';
import R from '../../native_theme/R';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class VerifyEmailScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.progressDialog = React.createRef();

        //Data From Previous Screen
        let item = props.navigation.state.params && props.navigation.state.params.ITEM;

        //Define All State initial state
        this.state = {
            isShowTimer: false,
            firstName: item && item.FirstName,
            lastName: item && item.LastName,
            userEmail: item && item.EmailId,
            isFirstTime: true,
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        /* stop twice api call  */
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, _prevState) => {

        let { ResendConfirmEmailisFetchData, ResendConfirmEmailData } = this.props

        //Show response of Resend Confirm Email
        if (ResendConfirmEmailData !== prevProps.ResendConfirmEmailData) {
            if (!ResendConfirmEmailisFetchData) {
                try {
                    showAlert(R.strings.Success + '!', ResendConfirmEmailData.ReturnMsg, 0)
                } catch (error) {

                }
            }
        }
    }

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return Object.assign({}, state, {
                isFirstTime: false,
            });
        }

        if (isCurrentScreen(props)) {

            let { ResendConfirmEmailisFetchData, ResendConfirmEmailData } = props

            //Set The response of Resend Confirm Email 
            if (!ResendConfirmEmailisFetchData) {
                try {
                    if (validateResponseNew({ response: ResendConfirmEmailData })) {

                        return Object.assign({}, state, {
                            ResendConfirmEmailData,
                            isShowTimer: true
                        })
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        isShowTimer: false
                    })
                }
            }
        }
        return null
    }

    //Check All Validation and if validation is proper then call API
    _onPressVerifyEmail = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            try {
                this.progressDialog.show();

                //Bind Request For Normal SignUp
                let registerRequest = {
                    email: this.state.userEmail,
                    deviceId: await getDeviceID(),
                    mode: ServiceUtilConstant.Mode,
                    PreferedLanguage: R.strings.getLanguage(),
                    hostName: ServiceUtilConstant.hostName,
                    //Note : ipAddress parameter is passed in its saga.
                }

                //call Normal SignUp API
                this.props.resendConfirmationLink(registerRequest);
            } catch (error) {
                this.progressDialog.dismiss();
                showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
            }
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { ResendConfirmEmailisFetchData } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.Confirm_Email} isBack={true} nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={ResendConfirmEmailisFetchData} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* To Set All View in ScrollView */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            <View style={{ marginTop: R.dimens.margin_top_bottom }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                    <Image
                                        style={{ tintColor: R.colors.textPrimary, justifyContent: 'center', alignItems: 'center', height: R.dimens.Verify_Image_Width_Height, width: R.dimens.Verify_Image_Width_Height }}
                                        source={R.images.IC_USER_NEW}
                                    />
                                    <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratBold }}>{R.strings.get_started_text.toUpperCase()}</Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <TextViewHML style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center' }}>{R.strings.hey} {this.state.firstName} {this.state.lastName},</TextViewHML>
                                    <TextViewHML style={{ textAlign: 'center', marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.account_created_text} {this.state.userEmail}</TextViewHML>
                                </View>
                            </View>
                            {
                                this.state.isShowTimer ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: R.dimens.activity_margin }}>
                                        <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'right', fontFamily: Fonts.HindmaduraiSemiBold }} >{R.strings.Resend_In}  </Text>
                                        <CountDown style={{ alignItems: 'center' }}
                                            until={ServiceUtilConstant.ResendOTP_Timer}
                                            onFinish={() => {
                                                /* To hide timer after 200 milliseconds because clearInterval code is under CountDown class */
                                                setTimeout(() => {
                                                    this.setState({ isShowTimer: false })
                                                }, 200);
                                            }}
                                            digitStyle={{ backgroundColor: R.colors.background, }}
                                            digitTxtStyle={{ color: R.colors.accent, fontSize: R.dimens.mediumText }}
                                            timeToShow={['M', 'S']}
                                            timeLabels={{ m: null, s: null }}
                                            separatorStyle={{ color: R.colors.accent }}
                                            showSeparator
                                        />
                                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center', }}>{R.strings.sec}</TextViewHML>
                                    </View>
                                    :
                                    /* Button */
                                    <Button
                                        isRound={true}
                                        title={R.strings.resend_main_text}
                                        onPress={this._onPressVerifyEmail}
                                        style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.widgetMargin }}
                                    />
                            }

                        </View>
                    </ScrollView>

                    {/* Back to login */}
                    <ImageTextButton
                        onPress={() => {
                            //This will reset to login page
                            sendEvent(Events.SessionLogout, true);
                        }}
                        name={R.strings.backToLogin}
                        textStyle={{ color: R.colors.accent, fontSize: R.dimens.smallText }}
                        isMR={true}
                    />
                </View>
            </SafeView >
        );
    }
}

function mapStateToProps(state) {
    return {
        isPortrait: state.preference.dimensions.isPortrait,
        //Updated Data For Normal SignUp Api Action
        ResendConfirmEmailisFetchData: state.SignUpReducer.ResendConfirmEmailisFetchData,
        ResendConfirmEmailData: state.SignUpReducer.ResendConfirmEmailData,
    }
}

function mapDispatchToProps(dispatch) {

    return {
        //Perform Resend Confirmation link
        resendConfirmationLink: (request) => dispatch(resendConfirmationLink(request)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailScreen)