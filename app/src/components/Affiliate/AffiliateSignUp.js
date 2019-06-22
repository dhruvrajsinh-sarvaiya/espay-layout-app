import React, { Component } from 'react';
import { View } from 'react-native';
import { removeLoginData } from '../../actions/SignUpProcess/signUpAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { isEmpty, validateMobileNumber } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import EditText from '../../native_theme/components/EditText'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { CheckEmailValidation } from '../../validations/EmailValidation'
import { changeTheme, changeFocus, sendEvent } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import InputScrollView from 'react-native-input-scroll-view';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Events } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

class AffiliateSignUp extends Component {

    constructor(props) {
        super(props);

        this.mainInputTexts = {};
        this.inputs = {};

        //Define initial state
        this.state = {
            FirstName: '',
            LastName: '',
            MobileNumber: '',
            EmailId: '',
            // for select county and it's code
            cca2: 'IN',
            callingCode: '91'
        }

        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);
        this.RedirecLoginScreen = this.RedirecLoginScreen.bind(this)
    }

    //Redirect User To Login Screen
    RedirecLoginScreen() {
        this.props.removeLoginData();
        //This will reset to login page
        sendEvent(Events.SessionLogout, true);
        //----------
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    //To Validate Mobile Number
    validateMobileNumber = (MobileNumber) => {
        if (validateMobileNumber(MobileNumber)) {
            this.setState({ MobileNumber: MobileNumber })
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    //Check All Validation and if validation is proper then call API
    onNextButtonPress = async () => {

        //Check First Name is Empty or Not
        if (isEmpty(this.state.FirstName)) {
            this.refs.Toast.Show(R.strings.firstNameValidate);
            return;
        }
        //Check Last Name is Empty or Not
        if (isEmpty(this.state.LastName)) {
            this.refs.Toast.Show(R.strings.lastNameValidate);
            return;
        }
        //Check Email is Empty or Not
        if (isEmpty(this.state.EmailId)) {
            this.refs.Toast.Show(R.strings.enterEmail);
            return;
        }
        if (CheckEmailValidation(this.state.EmailId)) {
            this.refs.Toast.Show(R.strings.Enter_Valid_Email);
            return;
        }
        //Check countrycode is Empty or Not
        if (isEmpty(this.state.callingCode)) {
            this.refs.Toast.Show(R.strings.countryVaildate);
            return;
        }
        //Check Mobile Number is Empty or Not
        if (isEmpty(this.state.MobileNumber)) {
            this.refs.Toast.Show(R.strings.Validate_MobileNo);
            return;
        }
        //To Check Mobile Number length is 10 or not
        if (this.state.MobileNumber.length != 10) {
            this.refs.Toast.Show(R.strings.phoneNumberValidation);
            return;
        }

        else {
            changeFocus(this.mainInputTexts);

            //To Redirect User To Normal Affiliate main Screen
            var { navigate } = this.props.navigation;
            navigate('AffiliateSignUpMain', {
                FirstName: this.state.FirstName,
                LastName: this.state.LastName,
                MobileNumber: this.state.MobileNumber,
                CountryCode: this.state.cca2,
                EmailId: (this.state.EmailId).toLowerCase(),
            });
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { NormalSignUpIsFetching } = this.props;
        //----------

        return (
            <View style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                {/* To Set Progress Dialog as per out theme */}
                <ProgressDialog isShow={NormalSignUpIsFetching} />

                {/* For Toast as per out theme */}
                <CommonToast ref="Toast" />


                {/* To Set All View in ScrolView */}
                <InputScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' >
                    <View style={[R.screen().isPortrait ? { height: R.screen().height } : { flex: 1 }]}>

                        {/* Background Image Header */}
                        <BackgroundImageHeaderWidget navigation={this.props.navigation} />

                        <SafeView style={this.styles().input_container}>

                            {/* Your Profile Detail Text */}
                            <TextViewHML style={{ textAlign: 'center', color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText, }}>{R.strings.signUpWithProfile}</TextViewHML>

                            {/* To Set First Name in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etFirstName'] = input; }}
                                isRound={true}
                                reference={input => { this.inputs['etFirstName'] = input; }}
                                placeholder={R.strings.firstName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(FirstName) => this.setState({ FirstName })}
                                onSubmitEditing={() => { this.focusNextField('etLastName') }}
                                value={this.state.FirstName}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etFirstName')}
                            />

                            {/* To Set Last Name in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etLastName'] = input; }}
                                isRound={true}
                                reference={input => { this.inputs['etLastName'] = input; }}
                                placeholder={R.strings.lastName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(LastName) => this.setState({ LastName })}
                                onSubmitEditing={() => { this.focusNextField('etEmailId') }}
                                value={this.state.LastName}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etLastName')}
                            />

                            {/* To Set Email Id in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etEmailId'] = input; }}
                                isRound={true}
                                reference={input => { this.inputs['etEmailId'] = input; }}
                                placeholder={R.strings.EmailId}
                                multiline={false}
                                maxLength={50}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(EmailId) => this.setState({ EmailId })}
                                value={this.state.EmailId}
                                onSubmitEditing={() => { this.focusNextField('etMobileNo') }}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etEmailId')}
                            />

                            {/* To Set MobileNo in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etMobileNo'] = input; }}
                                reference={input => { this.inputs['etMobileNo'] = input; }}
                                placeholder={R.strings.MobileNo}
                                returnKeyType={"done"}
                                multiline={false}
                                keyboardType={'numeric'}
                                value={this.state.MobileNumber}
                                onChangeText={(MobileNumber) => this.validateMobileNumber(MobileNumber)}
                                maxLength={10}
                                isRound={true}
                                countryPicker={true}
                                onCountryChange={(value) => { this.setState({ cca2: value.cca2, callingCode: value.callingCode }) }}
                                contryPickerValue={this.state.cca2}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etMobileNo')}
                            />

                            {/* Next Button */}
                            <Button
                                isRound={true}
                                title={R.strings.next}
                                onPress={this.onNextButtonPress}
                                style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.widgetMargin }} />
                        </SafeView>
                    </View>
                </InputScrollView>
            </View >
        );
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
            input_container: {
                justifyContent: 'center',
                marginLeft: R.dimens.activity_margin,
                marginRight: R.dimens.activity_margin,
                marginTop: R.dimens.margin_left_right,
            },
        }
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {

    return {
        //To Remove Login Data
        removeLoginData: () => dispatch(removeLoginData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateSignUp)