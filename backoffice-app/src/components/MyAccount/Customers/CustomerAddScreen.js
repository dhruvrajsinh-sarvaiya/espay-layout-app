import {
    View,
    ScrollView,
    Keyboard,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { showAlert, changeTheme, changeFocus, getDeviceID, getIPAddress } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew, validateMobileNumber } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import { CheckEmailValidation } from '../../../validations/EmailValidation';
import { AddCustomerClear, AddCustomerData } from '../../../actions/CMS/CustomerListAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit Exchange banks
class CustomerAddScreen extends Component {

    constructor(props) {
        super(props);

         // create reference
         this.toast = React.createRef();

        //for focus on next field
        this.mainInputTexts = {};
        this.inputs = {};

        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);

        //Define initial state
        this.state = {
            firstName: '',
            lastName: '',
            Username: '',
            Email: '',
            mobile: '',
            isFirstTime: true,

            // for select county and it's code
            cca2: 'IN',
            callingCode: '91'
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    onPress = async () => {

        //Validations for Inputs
        //Check First Name is Empty or Not
        if (isEmpty(this.state.firstName)) {
            this.toast.Show(R.strings.firstNameValidate);
            return;
        }

        //Check Last Name is Empty or Not
        if (isEmpty(this.state.lastName)) {
            this.toast.Show(R.strings.lastNameValidate);
            return;
        }

        //Check Userr Name is Empty or Not
        if (isEmpty(this.state.Username)) {
            this.toast.Show(R.strings.enterUserName);
            return;
        }

        //Check Email is Empty or Not
        if (isEmpty(this.state.Email)) {
            this.toast.Show(R.strings.enterEmail);
            return;
        }

        //Check Email is Valid or Not
        if (CheckEmailValidation(this.state.Email)) {
            this.toast.Show(R.strings.Enter_Valid_Email);
            return;
        }

        //Check countrycode is Empty or Not
        if (isEmpty(this.state.callingCode)) {
            this.toast.Show(R.strings.countryVaildate);
            return;
        }

        //Check Mobile Number is Empty or Not
        if (isEmpty(this.state.mobile)) {
            this.toast.Show(R.strings.Validate_MobileNo);
            return;
        }

        //To Check Mobile Number length is 10 or not
        if (this.state.mobile.length != 10) {
            this.toast.Show(R.strings.phoneNumberValidation);
            return;
        }

        Keyboard.dismiss();

        // Check NetWork is Available or not
        if (await isInternet()) {

            //Bind request for customer add api
            let request = {
                Email: this.state.Email,
                Mobile: this.state.mobile,
                Username: this.state.Username,
                Firstname: this.state.firstName,
                Lastname: this.state.lastName,
                CountryCode: this.state.cca2,
                DeviceId: await getDeviceID(),
                Mode: ServiceUtilConstant.Mode,
                IPAddress: await getIPAddress(),
                HostName: ServiceUtilConstant.hostName,
            }

            //call customer add api
            this.props.AddCustomerData(request)
        }

    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    //To Validate Mobile Number
    validateMobileNumber = (MobileNumber) => {
        if (validateMobileNumber(MobileNumber)) {
            this.setState({ mobile: MobileNumber })
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const { AddCustomerdata } = this.props.Listdata;
        if (AddCustomerdata !== prevProps.Listdata.AddCustomerdata) {
            // for show responce update
            if (AddCustomerdata) {
                if (validateResponseNew({
                    response: AddCustomerdata
                })) {
                    showAlert(R.strings.Success, AddCustomerdata.ReturnMsg, 0, () => {
                        this.props.AddCustomerClear()
                        this.props.navigation.goBack()
                    });
                } else {
                    this.props.AddCustomerClear()
                }
            }
        }
    }


    render() {

        const { isAddCustomer } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.customerAdd}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* To Set ProgressDialog */}
                <ProgressDialog isShow={isAddCustomer} />

               {/* Common Toast */}
              <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* Display Data in scrollview */}

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* To Set First Name in EditText */}
                            <EditText
                                header={R.strings.firstName}
                                ref={input => { this.mainInputTexts['etFirstName'] = input; }}
                                reference={input => { this.inputs['etFirstName'] = input; }}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etFirstName')}
                                placeholder={R.strings.firstName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(firstName) => this.setState({ firstName })}
                                onSubmitEditing={() => { this.focusNextField('etLastName') }}
                                value={this.state.firstName}
                                focusable={true}
                            />

                            {/* To Set Last Name in EditText */}
                            <EditText
                                header={R.strings.lastName}
                                ref={input => { this.mainInputTexts['etLastName'] = input; }}
                                reference={input => { this.inputs['etLastName'] = input; }}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etLastName')}
                                placeholder={R.strings.lastName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(lastName) => this.setState({ lastName })}
                                onSubmitEditing={() => { this.focusNextField('etUserName') }}
                                value={this.state.lastName}
                                focusable={true}
                            />


                            {/* To Set User Name in EditText */}
                            <EditText
                                header={R.strings.userName}
                                ref={input => { this.mainInputTexts['etUserName'] = input; }}
                                reference={input => { this.inputs['etUserName'] = input; }}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etUserName')}
                                placeholder={R.strings.userName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(Username) => this.setState({ Username })}
                                onSubmitEditing={() => { this.focusNextField('etEmailId') }}
                                value={this.state.Username}
                                focusable={true}
                            />

                            {/* To Set Email Id in EditText */}
                            <EditText
                                header={R.strings.email}
                                ref={input => { this.mainInputTexts['etEmailId'] = input; }}
                                reference={input => { this.inputs['etEmailId'] = input; }}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etEmailId')}
                                placeholder={R.strings.email}
                                multiline={false}
                                maxLength={50}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(Email) => this.setState({ Email })}
                                value={this.state.Email}
                                onSubmitEditing={() => { this.focusNextField('etMobileNo') }}
                                focusable={true}
                            />

                            {/* EditText for Mobile no */}
                            <EditText
                                header={R.strings.MobileNo}
                                ref={input => { this.mainInputTexts['etMobileNo'] = input; }}
                                reference={input => { this.inputs['etMobileNo'] = input; }}
                                placeholder={R.strings.MobileNo}
                                returnKeyType={"done"}
                                multiline={false}
                                keyboardType={'numeric'}
                                value={this.state.mobile}
                                onChangeText={(MobileNumber) => this.validateMobileNumber(MobileNumber)}
                                maxLength={10}
                                countryPicker={true}
                                onCountryChange={(value) => { this.setState({ cca2: value.cca2, callingCode: value.callingCode }) }}
                                contryPickerValue={this.state.cca2}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etMobileNo')}
                            />
                        </View>

                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add Customer Button */}
                        <Button title={R.strings.Add} onPress={() => this.onPress()}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data  add customer action
        Listdata: state.CustomerListReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform add customer action
        AddCustomerData: (request) => dispatch(AddCustomerData(request)),
        //Perform clear customer data action
        AddCustomerClear: () => dispatch(AddCustomerClear()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerAddScreen)












