import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { isEmpty, validateMobileNumber } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import EditText from '../../native_theme/components/EditText'
import { CheckEmailValidation } from '../../validations/EmailValidation'
import { changeTheme, changeFocus } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import { isCurrentScreen } from '../Navigation';
import InputScrollView from 'react-native-input-scroll-view';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

class SignUpNormal extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.toast = React.createRef();

        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);
        this.mainInputTexts = {};
        this.inputs = {};

        //Define All State initial state
        this.state = {
            FirstName: '',
            LastName: '',
            MobileNumber: '',
            EmailId: '',
            url: '',

            // for select county and it's code
            cca2: 'IN',
            callingCode: '91'
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    //To Validate Mobile Number
    validateMobileNumber = (MobileNumber) => {
        if (validateMobileNumber(MobileNumber)) {
            this.setState({ MobileNumber: MobileNumber })
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        if (this.props.isPortrait !== nextProps.isPortrait) {
            return true;
        }
        //stop twice api call 
        return isCurrentScreen(nextProps);
    };

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    //Check All Validation and if validation is proper then call API
    onNextButtonPress = async () => {

        //Check First Name is Empty or Not
        if (isEmpty(this.state.FirstName)) {
            this.toast.Show(R.strings.firstNameValidate);
            return;
        }

        //Check Last Name is Empty or Not
        if (isEmpty(this.state.LastName)) {
            this.toast.Show(R.strings.lastNameValidate);
            return;
        }

        //Check countrycode is Empty or Not
        if (isEmpty(this.state.callingCode)) {
            this.toast.Show(R.strings.countryVaildate);
            return;
        }

        //Check Email is Empty or Not
        if (isEmpty(this.state.EmailId)) {
            this.toast.Show(R.strings.enterEmail);
            return;
        }

        //Check Mobile Number is Empty or Not
        if (isEmpty(this.state.MobileNumber)) {
            this.toast.Show(R.strings.Validate_MobileNo);
            return;
        }

        //To Check Mobile Number length is 10 or not
        if (this.state.MobileNumber.length != 10) {
            this.toast.Show(R.strings.phoneNumberValidation);
            return;
        }

        //Check Email is Valid or Not
        if (CheckEmailValidation(this.state.EmailId)) {
            this.toast.Show(R.strings.Enter_Valid_Email);
            return;
        }
        else {

            changeFocus(this.mainInputTexts);

            //To Redirect User To Normal Sign Sub Success Screen
            var { navigate } = this.props.navigation;
            navigate('SignUpNormalSub', {
                FirstName: this.state.FirstName,
                LastName: this.state.LastName,
                MobileNumber: this.state.MobileNumber,
                CountryCode: this.state.cca2,
                EmailId: (this.state.EmailId).toLowerCase(),
            });
        }
    }

    render() {
        return (
            <View style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                {/* For Toast */}
                <CommonToast ref={comp => this.toast = comp} />

                {/* To Set All View in ScrolView */}
                <InputScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>

                    <View style={[R.screen().isPortrait ? { height: R.screen().height } : { flex: 1 }]}>

                        {/* Background Image Header */}
                        <BackgroundImageHeaderWidget navigation={this.props.navigation} />

                        <SafeView style={{ flex: 1, justifyContent: 'space-between' }}>

                            <View style={this.styles().input_container}>

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

                                {/* EditText for Mobile no */}
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

                                {/* Button */}
                                <Button
                                    isRound={true}
                                    title={R.strings.next}
                                    onPress={this.onNextButtonPress}
                                    style={{ marginTop: R.dimens.padding_top_bottom_margin, width: R.screen().width / 2, marginBottom: R.dimens.widgetMargin }} />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: R.dimens.margin, marginTop: R.dimens.margin }}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('QuickSignUpScreen') }}>
                                    <Text style={{ marginLeft: R.dimens.LineHeight, color: R.colors.accent, fontSize: R.dimens.smallestText, fontFamily: Fonts.HindmaduraiBold, textDecorationLine: 'underline' }}>{R.strings.quickSignUp}</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeView>
                    </View>
                </InputScrollView>
            </View >
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
            input_container: {
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingTop: R.dimens.margin_top_bottom,
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        isPortrait: state.preference.dimensions.isPortrait
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpNormal)