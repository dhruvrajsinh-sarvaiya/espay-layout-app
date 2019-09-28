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
import { isCurrentScreen } from '../../../components/Navigation';
import { showAlert, changeTheme } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { updateProviderConfig, addProviderConfig, clearProviderConfig, getProviderConfigList } from '../../../actions/Trading/ProviderConfigurationAction';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget'
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit Provider configuration 
class AddEditProviderConfigurationScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        this.inputs = {};

        //item for edit from Provider configuration 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //Define All State initial state
        this.state = {
            response: [],
            edit: edit,
            item: item,

            //if edit true get values in edittext else blank value in edit text for ad
            appkey: edit ? (item.AppKey) : "",
            apiKey: edit ? (item.APIKey) : "",
            secretKey: edit ? (item.SecretKey) : "",
            userName: edit ? (item.UserName) : "",
            password: edit ? (item.Password) : "",

            Status: [
                { value: R.strings.Active, code: 1 },
                { value: R.strings.Inactive, code: 0 }
            ],
            selectedStatus: item ? item.statusStatic : R.strings.Active,
            selectedStatusCode: item ? item.status : 1,
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {
        const { addProviderConfiguration, updateProviderConfiguration } = this.props.Listdata;

        if (addProviderConfiguration !== prevProps.Listdata.addProviderConfiguration) {
            // for show responce of add provider configuration data
            if (addProviderConfiguration) {
                try {
                    if (validateResponseNew({ response: addProviderConfiguration })) {
                        //if add provider configuration succcess redirect user to provider configuration list screen
                        showAlert(R.strings.Success, R.strings.added_msg, 0, () => {
                            this.props.clearProviderConfig()
                            this.props.navigation.goBack()
                            this.props.getProviderConfigList()
                            // this.props.navigation.state.params.onRefresh();
                        });
                    }
                    else {
                        this.props.clearProviderConfig()
                    }
                } catch (e) {
                    this.props.clearProviderConfig()
                }
            }
        }

        if (updateProviderConfiguration !== prevProps.Listdata.updateProviderConfiguration) {

            // for show responce of  Update provider configuration
            if (updateProviderConfiguration) {
                try {
                    if (validateResponseNew({ response: updateProviderConfiguration })) {
                        //if  Update provider configuration succcess redirect user to provider configuration list screen
                        showAlert(R.strings.Success, R.strings.edit_msg, 0, () => {
                            this.props.clearProviderConfig()
                            this.props.navigation.goBack()
                            // this.props.navigation.state.params.onRefresh();
                            this.props.getProviderConfigList()
                        });
                    }
                    else {
                        this.props.clearProviderConfig();
                    }
                } catch (e) {
                    this.props.clearProviderConfig()
                }
            }
        }
    }

    onPress = async (Id) => {
        //validations for Inputs 
        if (isEmpty(this.state.appkey)) {
            this.toast.Show(R.strings.enterAppKeyMsg)
            return;
        }
        if (isEmpty(this.state.apiKey)) {
            this.toast.Show(R.strings.enterApiKeyMsg)
            return;
        }
        if (isEmpty(this.state.secretKey)) {
            this.toast.Show(R.strings.enterSecretKeyMsg)
            return;
        }
        if (isEmpty(this.state.userName)) {
            this.toast.Show(R.strings.enterUserNameMsg)
            return;
        }
        if (isEmpty(this.state.password)) {
            this.toast.Show(R.strings.enterPasswordMsg)
            return;
        }
 
        Keyboard.dismiss();
        //for edit Request provider configuration
        if (this.state.edit) {
            //Check NetWork is Available or not
            if (await isInternet()) {
                let updateProviderConfigRequest = {
                    Id: Id,
                    AppKey: (this.state.appkey),
                    APIKey: (this.state.apiKey),
                    SecretKey: (this.state.secretKey),
                    UserName: (this.state.userName),
                    Password: (this.state.password),
                    status: this.state.selectedStatusCode,
                    StatusText: (this.state.selectedStatus),
                }

                //Call updateProviderConfig api
                this.props.updateProviderConfig(updateProviderConfigRequest)
            }
        }
        //for add Request provider configuration
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {
                let AddProviderConfigRequest = {
                    AppKey: (this.state.appkey),
                    APIKey: (this.state.apiKey),
                    SecretKey: (this.state.secretKey),
                    UserName: (this.state.userName),
                    Password: (this.state.password),
                    status: this.state.selectedStatusCode,
                    StatusText: (this.state.selectedStatus),
                }

                //Call addProviderConfig api
                this.props.addProviderConfig(AddProviderConfigRequest)
            }
        }
    }
    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {

        const { addLoading, updateLoading } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.UpdateProviderConfigTitle : R.strings.addProviderConfigTitle}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addLoading || updateLoading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* Display Data in scrollview */}

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Inputfield for appkey */}
                            <EditText
                                header={R.strings.appkey}
                                style={{ marginTop: 0 }}
                                placeholder={R.strings.appkey}
                                onChangeText={(text) => this.setState({ appkey: text })}
                                value={this.state.appkey}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['appkey'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('apiKey') }}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                            />

                            {/* Inputfield for apiKey */}
                            <EditText
                                header={R.strings.apiKey}
                                placeholder={R.strings.apiKey}
                                onChangeText={(text) => this.setState({ apiKey: text })}
                                value={this.state.apiKey}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['apiKey'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('secretKey') }}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                            />

                            {/* Inputfield for secretKey */}
                            <EditText
                                header={R.strings.secretKey}
                                placeholder={R.strings.secretKey}
                                onChangeText={(text) => this.setState({ secretKey: text })}
                                value={this.state.secretKey}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['secretKey'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('userName') }}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                            />

                            {/* Inputfield for Username */}
                            <EditText
                                header={R.strings.Username}
                                placeholder={R.strings.Username}
                                onChangeText={(text) => this.setState({ userName: text })}
                                value={this.state.userName}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['userName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('password') }}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                            />

                            {/* Inputfield for Password */}
                            <EditText
                                header={R.strings.Password}
                                placeholder={R.strings.Password}
                                onChangeText={(text) => this.setState({ password: text })}
                                secureTextEntry={true}
                                value={this.state.password}
                                keyboardType={'default'}
                                returnKeyType={"done"}
                                multiline={false}
                                reference={input => { this.inputs['password'] = input; }}
                            />

                            {/* dropdown for status */}
                            <TitlePicker
                                title={R.strings.status}
                                array={this.state.Status}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(index, object) => {
                                    this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                            />
                        </View>
                    </ScrollView>
                </View>
                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                    {/* To Set Add or Edit Button */}
                    <Button title={this.state.edit ? R.strings.update : R.strings.add} onPress={() => this.onPress(this.state.edit ? this.state.item.Id : null)}></Button>
                </View>
            </SafeView>
        );
    }
}


function mapStateToProps(state) {
    return {
        //Updates Data For provider configuration
        Listdata: state.providerConfigureReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for add provider configuration
        addProviderConfig: (AddProviderConfigRequest) => dispatch(addProviderConfig(AddProviderConfigRequest)),
        //for edit provider configuration
        updateProviderConfig: (updateProviderConfigRequest) => dispatch(updateProviderConfig(updateProviderConfigRequest)),
        //for add edit provider configuration data clear
        clearProviderConfig: () => dispatch(clearProviderConfig()),
        //Perform provider configuration list Api Data 
        getProviderConfigList: () => dispatch(getProviderConfigList()),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEditProviderConfigurationScreen)