import React, { Component } from 'react';
import { View, ScrollView, Image, Text } from 'react-native';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import Button from '../../native_theme/components/Button';
import EditText from '../../native_theme/components/EditText';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { enableGoogleAuth } from '../../actions/account/EnableGoogleAuthAction';
import { isEmpty, isInternet, validateGoogleAuthCode, validateResponseNew } from '../../validations/CommonValidation';
import { changeTheme, showAlert } from '../../controllers/CommonUtils'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../Navigation';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import { setData } from '../../App';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class EnableGoogleAuthenticator extends Component {
    constructor(props) {
        super(props);

        //Define initial state
        this.state = {
            code: '',
        };
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.preference.dimensions.isPortrait !== nextProps.preference.dimensions.isPortrait) {
            return true;
        }
        // stop twice api call 
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { EnableGoogleAuthData, EnableGoogleAuthFetchData } = this.props;

        if (EnableGoogleAuthData !== prevProps.EnableGoogleAuthData) {

            //To Check Enable Google Auth Data Fetch or Not
            if (!EnableGoogleAuthFetchData) {
                try {
                    if (validateResponseNew({ response: EnableGoogleAuthData })) {

                        //redirect to Security Screen
                        showAlert(R.strings.Success + '!', EnableGoogleAuthData.ReturnMsg, 0, async () => {

                            //To update pattern to true in preference and reseting pin to false
                            setData({ [ServiceUtilConstant.KEY_GoogleAuth]: true });

                            const { params } = this.props.navigation.state;
                            this.props.navigation.navigate(params.screenName)
                        })
                    } else {
                        this.setState({ code: '' })
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
    };

    validateGoogleCode = (text) => {

        //Validate Google Auth Code for 6 digits.
        if (validateGoogleAuthCode(text)) {
            this.setState({ code: text })
        }
    }

    onSubmit = async () => {

        //To check Auth Code is Empty or Not
        if (isEmpty(this.state.code)) {
            this.refs.Toast.Show(R.strings.authentication_code_validate);
            return;
        }

        //google auth code must be 6 digits
        if (this.state.code.length != 6) {
            this.refs.Toast.Show(R.strings.authentication_code_length_validate);
            return;
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Enable Google Auth API Request
                let enableGoogleAuthRequest = {
                    Code: this.state.code
                }

                // call API validate OTP and login
                this.props.enableGoogleAuth(enableGoogleAuthRequest);
            }
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { EnableGoogleAuthIsFetching } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.EnableGoogleAuthentication}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={EnableGoogleAuthIsFetching} />

                {/* For Toast */}
                <CommonToast ref="Toast" />

                <View style={{ flex: 1 }}>

                    {/* To Set All View in ScrolView */}
                    <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} >
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: R.dimens.margin_top_bottom }}>
                                {/* google auth icon */}
                                <Image
                                    style={{ tintColor: R.colors.textPrimary, justifyContent: 'center', alignItems: 'center', height: R.dimens.Verify_Image_Width_Height, width: R.dimens.Verify_Image_Width_Height }}
                                    source={R.images.IC_GOOGLE_AUTH}
                                />
                                <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratBold }}>{R.strings.PleaseEnter}</Text>
                                <TextViewHML style={{ marginTop: R.dimens.widgetMargin, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.verificationCodeMessage}</TextViewHML>
                            </View>

                            {/* google auth Input */}
                            <EditText
                                BorderStyle={{
                                    backgroundColor: R.colors.background,
                                    borderColor: R.colors.accent,
                                    borderWidth: R.dimens.pickerBorderWidth,
                                    marginTop: R.dimens.widgetMargin,
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    width: R.screen().isPortrait ? '100%' : '75%',
                                }}
                                textInputStyle={{
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.textPrimary,
                                }}
                                multiline={false}
                                maxLength={6}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                secureTextEntry={true}
                                onChangeText={(text) => this.validateGoogleCode(text)}
                                value={this.state.code}
                            />
                            <View style={{ marginTop: R.dimens.activity_margin }}>

                                {/* Submit google auth */}
                                <Button
                                    style={{ width: R.screen().isPortrait ? '100%' : '75%', justifyContent: 'center', alignSelf: 'center', }}
                                    onPress={() => this.onSubmit()}
                                    title={R.strings.submit}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeView>
        );
    }
}

function mapStatToProps(state) {
    return {
        preference: state.preference,
        //Updates Data For Enable Google Auth Key Action
        EnableGoogleAuthFetchData: state.EnableGoogleAuthReducer.EnableGoogleAuthFetchData,
        EnableGoogleAuthData: state.EnableGoogleAuthReducer.EnableGoogleAuthData,
        EnableGoogleAuthIsFetching: state.EnableGoogleAuthReducer.EnableGoogleAuthIsFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Enable google authentication action
        enableGoogleAuth: (enableGoogleAuthRequest) => dispatch(enableGoogleAuth(enableGoogleAuthRequest)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(EnableGoogleAuthenticator);