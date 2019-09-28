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

        // Define all initial state
        this.state = {
            code: '',
        };

        // Create reference
        this.toast = React.createRef();
    }

    componentDidMount = () => {
        // Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { EnableGoogleAuthData, EnableGoogleAuthFetchData } = this.props;

        if (EnableGoogleAuthData !== prevProps.EnableGoogleAuthData) {

            //To Check Enable Google Auth Data Fetch or Not
            if (!EnableGoogleAuthFetchData) {
                try {
                    if (validateResponseNew({ response: EnableGoogleAuthData })) {

                        //redirect to Security Screen
                        showAlert(R.strings.Success, EnableGoogleAuthData.ReturnMsg, 0, async () => {
                            //To update pattern to true in preference and reseting pin to false
                            setData({ [ServiceUtilConstant.KEY_GoogleAuth]: true });

                            // const { params } = this.props.navigation.state;
                            // this.props.navigation.navigate(params.screenName)
                            this.props.navigation.state.params.update()
                            this.props.navigation.navigate('Security')
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


    onSubmit = async () => {

        //To check Auth Code is Empty or Not
        if (isEmpty(this.state.code)) {

            this.toast.Show(R.strings.authentication_code_validate);
            return;
        }
        //google auth code must be 6 digits
        if (this.state.code.length != 6) {

            this.toast.Show(R.strings.authentication_code_length_validate);
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

    validateGoogleCode = (text) => {

        //Validate Google Auth Code for 6 digits.
        if (validateGoogleAuthCode(text)) {

            this.setState({ code: text })
        }
    }

    textStyle = () => {
        return {
            color: R.colors.textPrimary,
            textAlign: 'center',
            fontSize: R.dimens.smallText,
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
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* To Set All View in ScrolView */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'always'}
                >
                    <View style={{
                        paddingRight: R.dimens.activity_margin,
                        paddingLeft: R.dimens.activity_margin,
                        paddingTop: R.dimens.padding_top_bottom_margin,
                        paddingBottom: R.dimens.padding_top_bottom_margin,
                    }}>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: R.dimens.margin_top_bottom }}>
                            <Image
                                style={{
                                    tintColor: R.colors.textPrimary,
                                    justifyContent: 'center', alignItems: 'center', height: R.dimens.Verify_Image_Width_Height, width: R.dimens.Verify_Image_Width_Height
                                }}
                                source={R.images.IC_GOOGLE_AUTH}
                            />
                            <Text style={{
                                marginTop: R.dimens.widget_top_bottom_margin,
                                marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratBold
                            }}>{R.strings.PleaseEnter}</Text>
                            <TextViewHML style={{
                                marginTop: R.dimens.widgetMargin,
                                fontSize: R.dimens.smallestText, color: R.colors.textPrimary
                            }}>{R.strings.verificationCodeMessage}</TextViewHML>
                        </View>

                        {/* Edit Text for Google Authenticator code */}
                        <EditText
                            BorderStyle={{
                                borderWidth: R.dimens.pickerBorderWidth,
                                marginTop: R.dimens.widgetMargin,
                                justifyContent: 'center',
                                borderColor: R.colors.accent,
                                backgroundColor: R.colors.background,
                            }}
                            textInputStyle={{
                                color: R.colors.textPrimary,
                                fontSize: R.dimens.smallText,
                            }}
                            returnKeyType={"done"}
                            secureTextEntry={true}
                            onChangeText={(text) => this.validateGoogleCode(text)}
                            value={this.state.code}
                            multiline={false}
                            maxLength={6}
                            keyboardType='numeric'
                        />

                        {/* Submit button */}
                        <View style={{
                            marginTop: R.dimens.activity_margin
                        }}>
                            <Button
                                title={R.strings.submit}
                                onPress={() => this.onSubmit()}
                            />
                        </View>
                    </View>
                </ScrollView>
                
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
        enableGoogleAuth: (enableGoogleAuthRequest) => dispatch(enableGoogleAuth(enableGoogleAuthRequest)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(EnableGoogleAuthenticator);