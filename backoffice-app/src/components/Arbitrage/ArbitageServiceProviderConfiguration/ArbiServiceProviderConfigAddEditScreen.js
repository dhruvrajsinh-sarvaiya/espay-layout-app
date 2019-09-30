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
import { showAlert, changeTheme, parseIntVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty, isHtmlTag, isScriptTag } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { addArbitageServiceProvider, clearArbitageServiceProviderData, updateArbitageServiceProvider } from '../../../actions/Arbitrage/ArbitrageServiceProviderConfigurationAction';
import { getData } from '../../../App';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit ArbiServiceProviderConfigAddEditScreen
class ArbiServiceProviderConfigAddEditScreen extends Component {

    constructor(props) {
        super(props);

        let loginUserName = getData(ServiceUtilConstant.LOGINUSERNAME);
        let loginPassword = getData(ServiceUtilConstant.LOGINPASSWORD);

        //for focus next field 
        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //create refrence
        this.toast = React.createRef();

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,
            appkey: edit ? item.AppKey : '',
            apikey: edit ? item.APIKey : '',
            secretkey: edit ? item.APISecret : '',
            username: edit ? item.UserName : loginUserName,
            password: edit ? item.Password : loginPassword,
            statuses: [
                { value: R.strings.active, code: 1 },
                { value: R.strings.inActive, code: 0 }
            ],
            selectedStatus: edit ? item.statusText : R.strings.active,
            selectedStatusCode: edit ? item.Status : 1,
            isFirstTime: true,
        };

        //Bind all methods
        this.focusNextField = this.focusNextField.bind(this);
    }

    componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate(prevProps, prevState) {

        //Get All Updated field of Particular actions
        const { addProvderData, updateProvderData } = this.props.Listdata;

        // check previous props and existing props
        if (addProvderData !== prevProps.Listdata.addProvderData) {
            // for show responce add
            if (addProvderData) {
                try {

                    //If addProvder response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({
                        response: addProvderData,
                    })) {
                        showAlert(R.strings.Success, R.strings.insertSuccessFully, 0, () => {

                            // Clear data
                            this.props.clearArbitageServiceProviderData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {

                        // Clear data
                        this.props.clearArbitageServiceProviderData()
                    }
                } catch (e) {
                    // Clear data
                    this.props.clearArbitageServiceProviderData()
                }
            }
        }

        if (updateProvderData !== prevProps.Listdata.updateProvderData) {
            // for show responce update
            if (updateProvderData) {
                try {

                    //If updateProvder response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({
                        response: updateProvderData
                    })) {
                        showAlert(R.strings.Success, R.strings.updatedSuccessFully, 0, () => {
                            // Clear data
                            this.props.clearArbitageServiceProviderData()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        // Clear data
                        this.props.clearArbitageServiceProviderData()
                    }
                } catch (e) {
                    // Clear data
                    this.props.clearArbitageServiceProviderData()
                }
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    //Add Or Update Button Presss
    onPress = async () => {

        //validations for Inputs 
        if (isEmpty(this.state.appkey)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.appkey)
            return;
        }
        if (isHtmlTag(this.state.appkey)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.appkey)
            return;
        }
        if (isScriptTag(this.state.appkey)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.appkey)
            return;
        }
        if (isEmpty(this.state.apikey)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.apiKey)
            return;
        }
        if (isHtmlTag(this.state.apikey)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.apiKey)
            return;
        }
        if (isScriptTag(this.state.apikey)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.apiKey)
            return;
        }
        if (isEmpty(this.state.secretkey)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.secretKey)
            return;
        }
        if (isHtmlTag(this.state.secretkey)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.secretKey)
            return;
        }
        if (isScriptTag(this.state.secretkey)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.secretKey)
            return;
        }
        if (isEmpty(this.state.username)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.userName)
            return;
        }
        if (isHtmlTag(this.state.username)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.userName)
            return;
        }
        if (isScriptTag(this.state.username)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.userName)
            return;
        }
        if (isEmpty(this.state.password)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.Password)
            return;
        }
        if (isHtmlTag(this.state.password)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.Password)
            return;
        }
        if (isScriptTag(this.state.password)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.Password)
            return;
        }

        Keyboard.dismiss();

        // Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                Id: parseIntVal(this.state.edit ? this.state.item.Id : 0),
                UserName: this.state.username,
                Password: this.state.password,
                AppKey: this.state.appkey,
                APISecret: this.state.secretkey,
                APIKey: this.state.apikey,
                Status: parseIntVal(this.state.selectedStatusCode)
            }

            if (this.state.edit) {
                //call updateArbitageServiceProvider api
                this.props.updateArbitageServiceProvider(request)
            }
            else {
                //call addArbitageServiceProvider api
                this.props.addArbitageServiceProvider(request)
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // stop twice api call
        return isCurrentScreen(nextProps);
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { addProvderFetching, updateProvderFetching } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? (R.strings.updatedArbitrageProviderConfiguration) : (R.strings.adddArbitrageProviderConfiguration)}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addProvderFetching || updateProvderFetching} />

                {/* for common toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={{
                            flex: 1, paddingLeft: R.dimens.activity_margin,
                            paddingRight: R.dimens.activity_margin,
                            paddingTop: R.dimens.padding_top_bottom_margin,
                            paddingBottom: R.dimens.padding_top_bottom_margin,
                        }}>

                            {/* EditText for appkey  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.appkey}
                                placeholder={R.strings.appkey}
                                onChangeText={(text) => this.setState({ appkey: text })}
                                value={this.state.appkey}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['appkey'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('apikey') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for apikey  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.apiKey}
                                placeholder={R.strings.apiKey}
                                onChangeText={(text) => this.setState({ apikey: text })}
                                value={this.state.apikey}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['apikey'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('secretKey') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for secretKey  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.secretKey}
                                placeholder={R.strings.secretKey}
                                onChangeText={(text) => this.setState({ secretkey: text })}
                                value={this.state.secretkey}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['secretKey'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('userName') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for userName  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.userName}
                                placeholder={R.strings.userName}
                                onChangeText={(text) => this.setState({ username: text })}
                                value={this.state.username}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['userName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('password') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for password  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.Password}
                                placeholder={R.strings.Password}
                                onChangeText={(text) => this.setState({ password: text })}
                                value={this.state.password}
                                keyboardType={'default'}
                                secureTextEntry={true}
                                multiline={false}
                                reference={input => { this.inputs['password'] = input; }}
                                returnKeyType={"done"}
                            />

                            {/* Picker for status */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.status}
                                array={this.state.statuses}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.padding_left_right_margin, }}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, selectedStatusCode: object.code })} />
                        </View>
                    </ScrollView>
                </View>
                <View style={{
                    paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin
                }}>
                    {/* To Set Add or Edit Button */}
                    <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onPress()}></Button>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated ArbiServiceProviderConfigReducer  
        Listdata: state.ArbiServiceProviderConfigReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for add  api data
        addArbitageServiceProvider: (addRequest) => dispatch(addArbitageServiceProvider(addRequest)),
        //for add  api data
        updateArbitageServiceProvider: (updateRequest) => dispatch(updateArbitageServiceProvider(updateRequest)),
        //for add edit data clear
        clearArbitageServiceProviderData: () => dispatch(clearArbitageServiceProviderData()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArbiServiceProviderConfigAddEditScreen)