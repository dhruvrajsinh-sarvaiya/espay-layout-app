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
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, getDeviceID, getIPAddress, logger } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import R from '../../../native_theme/R';
import { addPasswordPolicy, updatePasswordPolicy, clearPasswordPolicy } from '../../../actions/account/PasswordPolicyAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit Transaction policy 
class AddEditPasswordPolicy extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.inputs = {};
        this.toast = React.createRef();

        //item for edit 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //if redirect from dashboard  
        let fromDashboard = props.navigation.state.params && props.navigation.state.params.fromDashboard

        //Define All State initial state
        this.state = {
            PwdExpiretime: edit ? (item.PwdExpiretime).toString() : "",
            maxfppwdDay: edit ? (item.MaxfppwdDay).toString() : "",
            maxfppwdMonth: edit ? (item.MaxfppwdMonth).toString() : "",
            linkExpiryTime: edit ? (item.LinkExpiryTime).toString() : "",
            otpExpiryTime: edit ? (item.OTPExpiryTime).toString() : "",
            isFirstTime: true,

            edit: edit,
            item: item,

            fromDashboard: fromDashboard,
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = async (prevProps, prevState) => {

        const { addPolicyData, updatePolicyData } = this.props.Listdata;

        if (addPolicyData !== prevProps.Listdata.addPolicyData) {
            // for show responce add
            if (addPolicyData) {
                if (validateResponseNew({
                    response: addPolicyData,
                })) {
                    showAlert(R.strings.Success, addPolicyData.ReturnMsg, 0, () => {

                        //clear data
                        this.props.clearPasswordPolicy()
                        if (!this.state.fromDashboard) {
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        }
                        else {
                            this.props.navigation.goBack()
                        }
                    });
                } else {
                    //clear data
                    this.props.clearPasswordPolicy()
                }
            }
        }

        if (updatePolicyData !== prevProps.Listdata.updatePolicyData) {
            // for show responce update
            if (updatePolicyData) {
                if (validateResponseNew({
                    response: updatePolicyData,
                })) {
                    showAlert(R.strings.Success, updatePolicyData.ReturnMsg, 0, () => {
                        //clear data
                        this.props.clearPasswordPolicy()
                        this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                        this.props.navigation.goBack()
                    });
                } else {
                    //clear data
                    this.props.clearPasswordPolicy()
                }
            }
        }
    }

    onAddEditPasswordPolicy = async (Id) => {

        //chek input validations
        if (isEmpty(this.state.PwdExpiretime)) {
            this.toast.Show(R.strings.enter + " " + R.strings.passwordExpireTime)
            return;
        }
        if ((parseInt(this.state.PwdExpiretime)) === 0) {
            this.toast.Show(R.strings.passwordExpireTime + " " + R.strings.mustBeGreaterThanZero)
            return;
        }
        if (isEmpty(this.state.maxfppwdDay)) {
            this.toast.Show(R.strings.enter + " " + R.strings.maxfppwdDay)
            return;
        }
        if ((parseInt(this.state.maxfppwdDay)) === 0) {
            this.toast.Show(R.strings.maxfppwdDay + " " + R.strings.mustBeGreaterThanZero)
            return;
        }
        if (isEmpty(this.state.maxfppwdMonth)) {
            this.toast.Show(R.strings.enter + " " + R.strings.maxfppwdMonth)
            return;
        }
        if ((parseInt(this.state.maxfppwdMonth)) === 0) {
            this.toast.Show(R.strings.maxfppwdMonth + " " + R.strings.mustBeGreaterThanZero)
            return;
        }
        if (isEmpty(this.state.linkExpiryTime)) {
            this.toast.Show(R.strings.enter + " " + R.strings.linkExpireTime)
            return;
        }
        if ((parseInt(this.state.linkExpiryTime)) === 0) {
            this.toast.Show(R.strings.linkExpireTime + " " + R.strings.mustBeGreaterThanZero)
            return;
        }
        if (isEmpty(this.state.otpExpiryTime)) {
            this.toast.Show(R.strings.enter + " " + R.strings.otpExpireTime)
            return;
        }
        if ((parseInt(this.state.otpExpiryTime)) === 0) {
            this.toast.Show(R.strings.otpExpireTime + " " + R.strings.mustBeGreaterThanZero)
            return;
        }

        Keyboard.dismiss();

        this.request = {
            DeviceId: await getDeviceID(),
            Mode: ServiceUtilConstant.Mode,
            IPAddress: await getIPAddress(),
            HostName: ServiceUtilConstant.hostName,
            PwdExpiretime: parseInt(this.state.PwdExpiretime),
            MaxfppwdDay: parseInt(this.state.maxfppwdDay),
            MaxfppwdMonth: parseInt(this.state.maxfppwdMonth),
            LinkExpiryTime: parseInt(this.state.linkExpiryTime),
            OTPExpiryTime: parseInt(this.state.otpExpiryTime),
        }
        //for edit 
        if (this.state.edit) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.request = {
                    ...this.request,
                    Id: Id,
                }

                //call updatePasswordPolicy api
                this.props.updatePasswordPolicy(this.request)
            }
        }
        //for add Request 
        else {

            //Check NetWork is Available or not
            if (await isInternet()) {

                //call addPasswordPolicy api
                this.props.addPasswordPolicy(this.request)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        logger('response', this.state.fromDashboard)
        const { isAdd, isUpdate } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updatePasswordPolicy : R.strings.addPasswordPolicy}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={isAdd || isUpdate} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.padding_top_bottom_margin
                }}>

                    <View style={{ flex: 1 }}>
                        {/* Display Data in scrollview */}
                        <ScrollView showsVerticalScrollIndicator={false} >

                            {/* EditText For expireTime */}
                            <EditText
                                style={{ marginTop: 0 }}
                                header={R.strings.expireTime}
                                placeholder={R.strings.expireTime}
                                onChangeText={(text) => this.setState({ PwdExpiretime: text })}
                                value={this.state.PwdExpiretime}
                                keyboardType={'numeric'}
                                multiline={false}
                                validate={true}
                                onlyDigit={true}
                                reference={input => { this.inputs['PwdExpiretime'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('maxfppwdDay') }}
                                blurOnSubmit={false}
                                returnKeyType={"next"}
                            />

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widget_top_bottom_margin }}>

                                {/* EditText For ForgotpasswordTitle */}
                                <EditText
                                    header={R.strings.ForgotpasswordTitle}
                                    style={{ flex: 1, marginTop: 0, marginRight: R.dimens.widgetMargin, }}
                                    placeholder={R.strings.days}
                                    onChangeText={(text) => this.setState({ maxfppwdDay: text })}
                                    value={this.state.maxfppwdDay}
                                    keyboardType={'numeric'}
                                    multiline={false}
                                    reference={input => { this.inputs['maxfppwdDay'] = input; }}
                                    onSubmitEditing={() => { this.focusNextField('maxfppwdMonth') }}
                                    returnKeyType={"next"}
                                    validate={true}
                                    onlyDigit={true}
                                    blurOnSubmit={false}
                                />

                                {/* EditText For maxfppwdMonth */}
                                <EditText
                                    header={" "}
                                    style={{ flex: 1, marginTop: 0, marginLeft: R.dimens.widgetMargin, }}
                                    placeholder={R.strings.months}
                                    onChangeText={(text) => this.setState({ maxfppwdMonth: text })}
                                    value={this.state.maxfppwdMonth}
                                    keyboardType={'numeric'}
                                    multiline={false}
                                    reference={input => { this.inputs['maxfppwdMonth'] = input; }}
                                    onSubmitEditing={() => { this.focusNextField('linkExpiryTime') }}
                                    returnKeyType={"next"}
                                    validate={true}
                                    onlyDigit={true}
                                    blurOnSubmit={false}
                                />
                            </View>

                            {/* EditText For linkExpiryTime */}
                            <EditText
                                header={R.strings.linkExpiryTime}
                                placeholder={R.strings.linkExpiryTime}
                                onChangeText={(text) => this.setState({ linkExpiryTime: text })}
                                value={this.state.linkExpiryTime}
                                keyboardType={'numeric'}
                                multiline={false}
                                reference={input => { this.inputs['linkExpiryTime'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('otpExpiryTime') }}
                                returnKeyType={"next"}
                                validate={true}
                                onlyDigit={true}
                                blurOnSubmit={false}
                            />

                            {/* EditText For otpExpireTime */}
                            <EditText
                                header={R.strings.otpExpireTime}
                                placeholder={R.strings.otpExpireTime}
                                onChangeText={(text) => this.setState({ otpExpiryTime: text })}
                                value={this.state.otpExpiryTime}
                                keyboardType={'numeric'}
                                multiline={false}
                                reference={input => { this.inputs['otpExpiryTime'] = input; }}
                                returnKeyType={"done"}
                                validate={true}
                                onlyDigit={true}
                            />
                        </ScrollView>

                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddEditPasswordPolicy(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>

        );
    }

    //Common Style 
    styles = () => {
        return {
            item: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: 2,
                padding: 30,
                borderColor: '#2a4944',
                backgroundColor: '#d2f7f1',
                borderWidth: 1,
            },
            boxstyle: {
                borderColor: R.colors.textPrimary,
                height: R.dimens.ButtonHeight,
                borderWidth: R.dimens.normalizePixels(1),
                justifyContent: 'center',
                marginTop: R.dimens.widgetMargin,
            },

        }
    }
}

function mapStateToProps(state) {
    return {
        //Updated PasswordPolicyReducer Data 
        Listdata: state.PasswordPolicyReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for add  api data
        addPasswordPolicy: (addPasswordPolicyRequest) => dispatch(addPasswordPolicy(addPasswordPolicyRequest)),
        //for edit api data
        updatePasswordPolicy: (updatePasswordPolicyRequest) => dispatch(updatePasswordPolicy(updatePasswordPolicyRequest)),
        //for add edit data clear
        clearPasswordPolicy: () => dispatch(clearPasswordPolicy()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEditPasswordPolicy)












