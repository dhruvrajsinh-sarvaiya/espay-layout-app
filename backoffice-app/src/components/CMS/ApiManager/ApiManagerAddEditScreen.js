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
import { showAlert, changeTheme, parseArray, parseIntVal } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew, validateURL } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import SafeView from '../../../native_theme/components/SafeView';
import { clearApiManagerData, getAllRequestFormat, addEmailApiManager, editEmailApiManager } from '../../../actions/CMS/ApiManagerActions';
import { getThirdPartyApiResponse } from '../../../actions/PairListAction';

//Create Common class for ApiManagerAddEditScreen
class ApiManagerAddEditScreen extends Component {

    constructor(props) {
        super(props);

        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //Define All State initial state
        this.state = {
            item: item,
            isEdit: item ? true : false,
            screenType: props.navigation.state.params && props.navigation.state.params.screenType,
            requestFormatDataState: null,
            thirdPartyApiResponseDataState: null,

            SenderID: item ? item.SenderID : '',
            SendURL: item ? item.SendURL : '',
            Priority: item ? (item.Priority).toString() : '',

            requestFormats: [{ value: R.strings.Please_Select }],
            selectedrequestFormat: item ? item.RequestName : R.strings.Please_Select,
            selectedrequestFormatCode: item ? item.RequestID : '',

            ServiceName: item ? item.ServiceName : '',

            responseTypes: [{ value: R.strings.Please_Select }],
            selectedresponseType: R.strings.Please_Select,
            selectedresponseTypeCode: item ? item.ParsingDataID : '',

            SerproName: item ? item.SerproName : '',

            UserID: item ? item.UserID : '',
            password: item ? item.Password : '',

            statuses: [
                { value: R.strings.select_status, code: '' },
                { value: R.strings.Enable, code: 1 },
                { value: R.strings.Disable, code: 0 },
            ],
            selectedStatus: item ? (item.status == 1 ? R.strings.Enable : R.strings.Disable) : R.strings.select_status,
            selectedStatusCode: item ? item.status : '',
        };
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check Internet is Available or not
        if (await isInternet()) {
            this.props.getThirdPartyApiResponse()
            this.props.getAllRequestFormat()
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //For stop twice api call
        return isCurrentScreen(nextProps)
    }

    //submitData
    submitData = async () => {

        //validations for Inputs 
        if (isEmpty(this.state.SenderID)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.senderId)
            return;
        }
        if (isEmpty(this.state.SendURL)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.sendUrl)
            return;
        }
        if (!validateURL(this.state.SendURL)) {
            this.toast.Show(R.strings.enterValid + ' ' + R.strings.sendUrl)
            return;
        }
        if (isEmpty(this.state.Priority)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.priority)
            return;
        }
        if (this.state.selectedrequestFormat === R.strings.Please_Select) {
            this.toast.Show(R.strings.select + ' ' + R.strings.requestFormat)
            return;
        }
        if (isEmpty(this.state.ServiceName)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.serviceName)
            return;
        }
        if (this.state.selectedresponseType === R.strings.Please_Select) {
            this.toast.Show(R.strings.select + ' ' + R.strings.responseType)
            return;
        }
        if (isEmpty(this.state.SerproName)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.ServiceProvider)
            return;
        }
        if (isEmpty(this.state.UserID)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.userid)
            return;
        }
        if (isEmpty(this.state.password)) {
            this.toast.Show(R.strings.enterPasswordMsg)
            return;
        }
        if (this.state.selectedStatus === R.strings.select_status) {
            this.toast.Show(R.strings.select_status)
            return;
        }

        Keyboard.dismiss();

        // Check Internet is Available or not
        if (await isInternet()) {

            this.request = {
                ServiceTypeID: parseIntVal(this.state.screenType),
                RequestID: parseIntVal(this.state.selectedrequestFormatCode),
                ParsingDataID: parseIntVal(this.state.selectedresponseTypeCode),
                SenderID: this.state.SenderID,
                SendURL: this.state.SendURL,
                Priority: parseIntVal(this.state.Priority),
                ServiceName: this.state.ServiceName,
                SerproName: this.state.SerproName,
                UserID: this.state.UserID,
                Password: this.state.password,
                Status: parseIntVal(this.state.selectedStatusCode),
            }

            if (this.state.isEdit) {
                this.request = {
                    ...this.request,
                    APID: parseIntVal(this.state.item.APID),
                    ServiceID: parseIntVal(this.state.item.ServiceID),
                    SerproID: parseIntVal(this.state.item.SerproID),
                }

                //call editEmailApiManager api
                this.props.editEmailApiManager(this.request)
            }
            else {
                //call addEmailApiManager api
                this.props.addEmailApiManager(this.request)
            }

        }
    }

    async componentDidUpdate(prevProps, prevState) {

        const { addEmailApiData, editEmailApiData } = this.props.Listdata;

        if (addEmailApiData !== prevProps.Listdata.addEmailApiData) {
            // for show responce  Add
            if (addEmailApiData) {
                try {
                    if (validateResponseNew({
                        response: addEmailApiData,
                    })) {
                        showAlert(R.strings.Success, addEmailApiData.ReturnMsg, 0, () => {

                            //clear data
                            this.props.clearApiManagerData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {

                        //clear data
                        this.props.clearApiManagerData()
                    }
                } catch (e) {

                      //clear dataF
                    this.props.clearApiManagerData()
                }
            }
        }

        if (editEmailApiData !== prevProps.Listdata.editEmailApiData) {
            // for show responce Update 
            if (editEmailApiData) {
                try {
                    if (validateResponseNew({
                        response: editEmailApiData,
                    })) {
                        showAlert(R.strings.Success, editEmailApiData.ReturnMsg, 0, () => {

                            //clear data 
                            this.props.clearApiManagerData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {

                        //clear data
                        this.props.clearApiManagerData()
                    }
                } catch (e) {

                    //clear data
                    this.props.clearApiManagerData()
                }
            }
        }
    }

    static oldProps = {};

    //handle reponse 
    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (ApiManagerAddEditScreen.oldProps !== props) {
            ApiManagerAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { requestFormatData, thirdPartyApiResponseData } = props.Listdata;

            if (requestFormatData) {
                try {
                    //if local currencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.requestFormatDataState == null || (state.requestFormatDataState != null && requestFormatData !== state.requestFormatDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: requestFormatData, isList: true })) {
                            let res = parseArray(requestFormatData.Result);

                            //for add keyrequestFormatData
                            for (var keyrequestFormatData in res) {
                                let item = res[keyrequestFormatData];
                                item.value = item.RequestName;
                            }

                            let requestFormats = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, requestFormats, requestFormatDataState: requestFormatData };
                        } else {
                            return { ...state, requestFormats: [{ value: R.strings.Please_Select }], requestFormatDataState: requestFormatData };
                        }
                    }
                } catch (e) {
                    return { ...state, requestFormats: [{ value: R.strings.Please_Select }] };
                }
            }

            if (thirdPartyApiResponseData) {
                try {
                    //if local currencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.thirdPartyApiResponseDataState == null || (state.thirdPartyApiResponseDataState != null && thirdPartyApiResponseData !== state.thirdPartyApiResponseDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: thirdPartyApiResponseData, isList: true })) {
                            let res = parseArray(thirdPartyApiResponseData.Response);

                            let res1 = []
                            //for add thirdPartyApiResponseData
                            for (var keythirdPartyApiResponseData in res) {
                                let item = res[keythirdPartyApiResponseData];
                                item.value = item.ResponseCodeRegex
                                res1.push(item)
                            }

                            let selectedresponseType = R.strings.Please_Select

                            if (state.isEdit) {
                                //for add thirdPartyApiResponseData
                                for (let i = 0; i < res1.length; i++) {
                                    let item = res[i];
                                    if (item.Id == state.item.ParsingDataID)
                                        selectedresponseType = item.ResponseCodeRegex
                                }
                            }

                            let responseTypes = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, selectedresponseType, responseTypes, thirdPartyApiResponseDataState: thirdPartyApiResponseData };
                        } else {
                            return { ...state, responseTypes: [{ value: R.strings.Please_Select }], thirdPartyApiResponseDataState: thirdPartyApiResponseData };
                        }
                    }
                } catch (e) {
                    return { ...state, responseTypes: [{ value: R.strings.Please_Select }] };
                }
            }

        }
        return null;
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        const { thirdPartyApiResponseDataFetching, requestFormatDataFetching, editEmailApiDataFetching, addEmailApiDataFetching } = this.props.Listdata;
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.isEdit ? (this.state.screenType == 2 ? R.strings.updateEmailApiManager : R.strings.updateSmsApiManager) : (this.state.screenType == 1 ? R.strings.addSmsApiManager : R.strings.addEmailApiManager)}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={thirdPartyApiResponseDataFetching || requestFormatDataFetching || editEmailApiDataFetching || addEmailApiDataFetching} />

                {/* Common Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* To Set senderId in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etSenderId'] = input; }}
                                header={R.strings.senderId}
                                placeholder={R.strings.senderId}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusNextField('etSendUrl') }}
                                onChangeText={(SenderID) => this.setState({ SenderID })}
                                value={this.state.SenderID}
                            />

                            {/* To Set sendUrl in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etSendUrl'] = input; }}
                                header={R.strings.sendUrl}
                                placeholder={R.strings.sendUrl}
                                textAlignVertical={'top'}
                                multiline={true}
                                numberOfLines={4}
                                keyboardType='default'
                                returnKeyType={"done"}
                                blurOnSubmit={false}
                                onChangeText={(SendURL) => this.setState({ SendURL })}
                                value={this.state.SendURL}
                            />

                            {/* To Setpriority in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etPriority'] = input; }}
                                header={R.strings.priority}
                                placeholder={R.strings.priority}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusNextField('etServiceName') }}
                                onChangeText={(Priority) => this.setState({ Priority })}
                                value={this.state.Priority}
                                validate={true}
                                onlyDigit={true}
                            />

                            {/* Picker for requestFormat */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.requestFormat}
                                array={this.state.requestFormats}
                                selectedValue={this.state.selectedrequestFormat}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                onPickerSelect={(item, object) => this.setState({ selectedrequestFormat: item, selectedrequestFormatCode: object.RequestID })} />

                            {/* To Set serviceName in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etServiceName'] = input; }}
                                header={R.strings.serviceName}
                                placeholder={R.strings.serviceName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusNextField('etServiceProvider') }}
                                onChangeText={(ServiceName) => this.setState({ ServiceName })}
                                value={this.state.ServiceName}
                            />

                            {/* Picker for responseType */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.responseType}
                                array={this.state.responseTypes}
                                selectedValue={this.state.selectedresponseType}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                onPickerSelect={(item, object) => this.setState({ selectedresponseType: item, selectedresponseTypeCode: object.Id })} />

                            {/* To Set serviceName in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etServiceProvider'] = input; }}
                                header={R.strings.serivce_provider}
                                placeholder={R.strings.serivce_provider}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusNextField('etUserName') }}
                                onChangeText={(SerproName) => this.setState({ SerproName })}
                                value={this.state.SerproName}
                            />

                            {/* EditText for userId  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.userId}
                                placeholder={R.strings.userId}
                                onChangeText={(text) => this.setState({ UserID: text })}
                                value={this.state.UserID}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['etUserName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('password') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for password  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.Password}
                                placeholder={R.strings.Password}
                                onChangeText={(text) => this.setState({ password: text })}
                                keyboardType={'default'}
                                secureTextEntry={true}
                                returnKeyType={"done"}
                                multiline={false}
                                value={this.state.password}
                                reference={input => { this.inputs['password'] = input; }}
                            />

                            {/* Picker for status */}
                            <TitlePicker
                                isRequired={true}
                                array={this.state.statuses}
                                title={R.strings.status}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.padding_top_bottom_margin, }}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, selectedStatusCode: object.code })} />
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={this.state.isEdit ? R.strings.update : R.strings.add} onPress={this.submitData}></Button>
                    </View>
                </View>
            </SafeView >
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated ApiManagerReducer data
        Listdata: state.ApiManagerReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for addEmailApiManager  api data
        addEmailApiManager: (request) => dispatch(addEmailApiManager(request)),
        //for editEmailApiManager  api data
        editEmailApiManager: (request) => dispatch(editEmailApiManager(request)),
        //for getThirdPartyApiResponse  api data
        getThirdPartyApiResponse: () => dispatch(getThirdPartyApiResponse()),
        //for getAllRequestFormat  api data
        getAllRequestFormat: () => dispatch(getAllRequestFormat()),
        //for data clear
        clearApiManagerData: () => dispatch(clearApiManagerData()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ApiManagerAddEditScreen)

