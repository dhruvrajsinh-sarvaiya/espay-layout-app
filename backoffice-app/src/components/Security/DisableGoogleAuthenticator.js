import React, { Component } from 'react';
import { View, ScrollView, Image, Text } from 'react-native';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import Button from '../../native_theme/components/Button';
import EditText from '../../native_theme/components/EditText';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { disableGoogleauth } from '../../actions/account/DisableGoogleAuthAction';
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

class DisableGoogleAuthenticator extends Component {
    constructor(props) {
        super(props);

        //item for edit from List screen 
        let fromMyAccountDashboard = props.navigation.state.params && props.navigation.state.params.fromMyAccountDashboard

        // Define all initial state
        this.state = {
            code: '',
            fromMyAccountDashboard
        };

        // Create reference
        this.toast = React.createRef();
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { DisableGoogleAuthData, DisableGoogleAuthFetchData } = this.props;

        if (DisableGoogleAuthData !== prevProps.DisableGoogleAuthData) {

            //To Check Disabke Google Auth Data Fetch or Not
            if (!DisableGoogleAuthFetchData) {
                try {
                    if (validateResponseNew({ response: DisableGoogleAuthData })) {

                        //redirect to Security Screen
                        showAlert(R.strings.Success, DisableGoogleAuthData.ReturnMsg, 0, async () => {

                            //To update google auth to false in preference
                            setData({ [ServiceUtilConstant.KEY_GoogleAuth]: false });

                            if (this.state.fromMyAccountDashboard !== undefined) {
                                this.props.navigation.navigate('MyAccountDashboard', {})
                            }
                            else {
                                this.props.navigation.state.params.update()
                                this.props.navigation.navigate('Security')
                            }
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
    }

    validateGoogleCode = (text) => {

        //Validate Google Auth Code for 6 digits.
        if (validateGoogleAuthCode(text)) {
            this.setState({ code: text })
        }
    }

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
                let disableGoogleAuthRequest = {
                    Code: this.state.code
                }
                // call API validate OTP and login
                this.props.disableGoogleauth(disableGoogleAuthRequest);
            }
        }
    }

    textStyle = () => {
        return {
            textAlign: 'center',
            fontSize: R.dimens.smallText,
            color: R.colors.textPrimary,
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { DisableGoogleAuthIsFetching } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.disableGoogleAuthentication}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={DisableGoogleAuthIsFetching} />

                {/* For Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* To Set All View in ScrolView */}
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: R.dimens.margin_top_bottom }}>
                            <Image
                                style={{ tintColor: R.colors.textPrimary, justifyContent: 'center', alignItems: 'center', height: R.dimens.Verify_Image_Width_Height, width: R.dimens.Verify_Image_Width_Height }}
                                source={R.images.IC_GOOGLE_AUTH}
                            />
                            <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratBold }}>{R.strings.PleaseEnter}</Text>
                            <TextViewHML style={{ marginTop: R.dimens.widgetMargin, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.verificationCodeMessage}</TextViewHML>
                        </View>

                        {/* Edit Text for Google Authenticator code */}
                        <EditText
                            BorderStyle={{
                                backgroundColor: R.colors.background,
                                borderColor: R.colors.accent,
                                borderWidth: R.dimens.pickerBorderWidth,
                                marginTop: R.dimens.widgetMargin,
                                justifyContent: 'center',
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

                        {/* Submit button */}
                        <View style={{ marginTop: R.dimens.activity_margin }}>
                            <Button
                                onPress={() => this.onSubmit()}
                                title={R.strings.submit}
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
        DisableGoogleAuthFetchData: state.DisableGoogleAuthReducer.DisableGoogleAuthFetchData,
        DisableGoogleAuthData: state.DisableGoogleAuthReducer.DisableGoogleAuthData,
        DisableGoogleAuthIsFetching: state.DisableGoogleAuthReducer.DisableGoogleAuthIsFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        disableGoogleauth: (disableGoogleAuthRequest) => dispatch(disableGoogleauth(disableGoogleAuthRequest)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(DisableGoogleAuthenticator);