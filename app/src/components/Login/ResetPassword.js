import React, { Component } from 'react';
import { ScrollView, View, } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import EditText from '../../native_theme/components/EditText';
import Button from '../../native_theme/components/Button';
import { changePassword } from '../../actions/Login/ResetPasswordAction'
import { changeTheme, showAlert, getPassword } from '../../controllers/CommonUtils';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { isInternet, isEmpty, validateResponseNew, validatePassword } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../Navigation'
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class ResetPasswordComponent extends Component {

    constructor(props) {
        super(props)

        //for focus on next field
        this.inputs = {};

        //Define initial state
        this.state = {
            oldPassword: null,
            password: null,
            confirmPassword: null,
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    onChangePassword = async () => {

        //if user is login then validate with old password.
        if (isEmpty(this.state.oldPassword)) {
            this.refs.Toast.Show(R.strings.old_password_validate);
            return;
        }

        //Check Old Password
        if (this.state.oldPassword !== (await getPassword())) {
            this.refs.Toast.Show(R.strings.incorrectPassword);
            return;
        }

        //validations on password
        if (isEmpty(this.state.password)) {
            this.refs.Toast.Show(R.strings.New_Password);
            return;
        }

        //To Check Password length is less then 6 or not
        if (this.state.password.length < 6) {
            this.refs.Toast.Show(R.strings.password_length_validate);
            return;
        }

        //To Check Password Validation
        if (!validatePassword(this.state.password)) {
            this.refs.Toast.Show(R.strings.Strong_Password_Validation);
            return;
        }

        //To Check confirm Password is not Empty Validation
        if (isEmpty(this.state.confirmPassword)) {
            this.refs.Toast.Show(R.strings.confirm_password_validate);
            return;
        }

        //To Check confirm Password Validation
        if (this.state.password !== this.state.confirmPassword) {
            this.refs.Toast.Show(R.strings.password_match_validate);
            return;
        }

        //To Check Old Password Validation
        if (this.state.oldPassword === this.state.password) {
            this.refs.Toast.Show(R.strings.ChangePassword_Validation_Msg);
            return;
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {
                //Bind Request For Normal Login
                let ChangePasswordRequest = {
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                }

                //call api for change password
                this.props.changePassword(ChangePasswordRequest)
            }
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        /* stop twice api call */
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate(prevProps, _prevState) {

        //Get All Updated Feild of Particular actions
        const { changepassword, loading } = this.props;

        if (changepassword !== prevProps.changepassword) {

            //To Check Normal Login Api Data Fetch or Not
            if (!loading) {
                try {
                    if (validateResponseNew({ response: changepassword })) {

                        //make changes on success responce and redirect to login screen
                        showAlert(R.strings.Success + '!', changepassword.ReturnMsg, 0, () => {
                            //This will reset to login page
                            this.props.navigation.navigate('LoginNormalScreen')
                        })
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
    };

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { loading } = this.props

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* For Toast */}
                <CommonToast ref="Toast" />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.changePassword}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView style={{ backgroundColor: R.colors.background }} keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Old password */}
                            <EditText
                                reference={input => { this.inputs['etOldPassword'] = input; }}
                                header={R.strings.old_password}
                                placeholder={R.strings.old_password}
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({ oldPassword: text })}
                                multiline={false}
                                blurOnSubmit={false}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.focusNextField('etNewPassword') }}
                            />

                            {/* New password */}
                            <EditText
                                reference={input => { this.inputs['etNewPassword'] = input; }}
                                header={R.strings.new_password}
                                placeholder={R.strings.new_password}
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({ password: text })}
                                multiline={false}
                                blurOnSubmit={false}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.focusNextField('etCNewPassword') }}
                            />

                            {/* Confirm password */}
                            <EditText
                                reference={input => { this.inputs['etCNewPassword'] = input; }}
                                header={R.strings.repeat_password}
                                placeholder={R.strings.repeat_password}
                                secureTextEntry={true}
                                multiline={false}
                                blurOnSubmit={true}
                                onChangeText={(text) => this.setState({ confirmPassword: text })}
                                returnKeyType={"done"}
                            />
                            <TextViewHML style={{
                                textAlign: 'left',
                                fontSize: R.dimens.smallestText,
                                color: R.colors.textPrimary,
                                marginTop: R.dimens.widget_top_bottom_margin,
                            }}>
                                {R.strings.reset_pswd_msg}
                            </TextViewHML>
                        </View>
                    </ScrollView>
                    <View style={{
                        paddingLeft: R.dimens.activity_margin,
                        paddingRight: R.dimens.activity_margin,
                        paddingBottom: R.dimens.padding_top_bottom_margin,
                    }}>

                        {/* Submit button for change password*/}
                        <Button
                            title={R.strings.submit}
                            onPress={this.onChangePassword}
                            style={{ marginTop: R.dimens.padding_top_bottom_margin }} />
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For changepassword Password Api Action 
        changepassword: state.ResetPasswordReducer.changepassword,
        loading: state.ResetPasswordReducer.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform changePassword action
        changePassword: (ChangePasswordRequest) => dispatch(changePassword(ChangePasswordRequest))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordComponent)