// ArbitrageApiRequestAddEditScreen
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
import { showAlert, changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty, validateURL, isHtmlTag, isScriptTag } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { addArbitrageApiRequest, updateArbitrageApiRequest, clearArbitrageApiRequestData } from '../../../actions/Arbitrage/ArbitrageApiRequestActions';
import { getArbitrageThirdPartyResponse } from '../../../actions/ArbitrageCommonActions';
import { getAppType } from '../../../actions/PairListAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit
class ArbitrageApiRequestAddEditScreen extends Component {

    constructor(props) {
        super(props);

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,

            apiName: edit ? item.APIName : '',
            apiSendUrl: edit ? item.APISendURL : '',
            apiValidateURL: edit ? item.APIValidateURL : '',
            apiBalanceURL: edit ? item.APIBalURL : '',
            apiStatusCheckURL: edit ? item.APIStatusCheckURL : '',
            apiRequestBody: edit ? item.APIRequestBody : '',
            transactionIdPrefix: edit ? item.TransactionIdPrefix : '',
            merchantCode: edit ? item.MerchantCode : '',
            successResponse: edit ? item.ResponseSuccess : '',
            failureResponse: edit ? item.ResponseFailure : '',
            holdResponse: edit ? item.ResponseHold : '',
            authenticationHeader: edit ? item.AuthHeader : '',
            contentType: edit ? item.ContentType : '',
            methodType: edit ? item.MethodType : '',

            AppType: [],
            AppTypeListState: null,
            selectedAppType: edit ? item.AppTypeText : R.strings.selectAppType,
            AppTypeId: edit ? item.AppType : 0,

            parsingIds: [],
            parseIdListState: null,
            selectedparsingId: edit ? item.ParsingDataID : R.strings.selectParsingId,
            parseId: edit ? item.ParsingDataID : 0,

            status: [{ value: R.strings.select_status }, { value: R.strings.Active }, { value: R.strings.Inactive }],
            selectedStatus: edit ? item.Status == 1 ? R.strings.Active : R.strings.Inactive : R.strings.select_status,

            isFirstTime: true,
        }

        // Create reference
        this.toast = React.createRef();
        this.inputs = {};
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check NetWork is Available or not
        if (await isInternet()) {
            // for app type list
            this.props.getAppType()
            // for third party list
            this.props.getArbitrageThirdPartyResponse()
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            }
        }

        // To Skip Render if old and new props are equal
        if (ArbitrageApiRequestAddEditScreen.oldProps !== props) {
            ArbitrageApiRequestAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { AppTypeList, ThirdpartyResponseList } = props.ArbiApiRequestResult

            // AppTypeList is not null
            if (AppTypeList) {
                try {
                    //if local AppTypeList state is null or its not null and also different then new response then and only then validate response.
                    if (state.AppTypeListState == null || (AppTypeList !== state.AppTypeListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: AppTypeList, isList: true })) {
                            let res = parseArray(AppTypeList.Response);

                            res.map((item, index) => {
                                res[index].value = item.AppTypeName;
                            })

                            let appTypeNames = [
                                { value: R.strings.selectAppType },
                                ...res
                            ];

                            return { ...state, AppTypeListState: AppTypeList, AppType: appTypeNames };
                        } else {
                            return { ...state, AppTypeListState: AppTypeList, AppType: [{ value: R.strings.selectAppType }] };
                        }
                    }
                } catch (e) {
                    return { ...state, AppType: [{ value: R.strings.selectAppType }] };
                }
            }

            if (ThirdpartyResponseList) {
                try {
                    //if local ThirdpartyResponseList state is null or its not null and also different then new response then and only then validate response.
                    if (state.parseIdListState == null || (ThirdpartyResponseList !== state.parseIdListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ThirdpartyResponseList, isList: true })) {
                            let res = parseArray(ThirdpartyResponseList.Response);

                            res.map((item, index) => {
                                res[index].value = item.Id;
                            })

                            let responseId = [
                                { value: R.strings.selectParsingId },
                                ...res
                            ];

                            return { ...state, parseIdListState: ThirdpartyResponseList, parsingIds: responseId };
                        } else {
                            return { ...state, parseIdListState: ThirdpartyResponseList, parsingIds: [{ value: R.strings.selectParsingId }] };
                        }
                    }
                } catch (e) {
                    return { ...state, parsingIds: [{ value: R.strings.selectParsingId }] };
                }
            }
        }
        return null;
    }


    componentDidUpdate = async (prevProps, prevState) => {

        //Get All Updated field of Particular actions
        const { AddArbiApiRequest, UpdateArbiApiRequest } = this.props.ArbiApiRequestResult;

        // check previous props and existing props
        if (AddArbiApiRequest !== prevProps.ArbiApiRequestResult.AddArbiApiRequest) {
            // for show responce add
            if (AddArbiApiRequest) {
                try {

                    //If AddArbiApiRequest response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({
                        response: AddArbiApiRequest,
                    })) {
                        showAlert(R.strings.Success, AddArbiApiRequest.ReturnMsg, 0, () => {

                            // Clear data
                            this.props.clearArbitrageApiRequestData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {

                        // Clear data
                        this.props.clearArbitrageApiRequestData()
                    }
                } catch (e) {

                    // Clear data
                    this.props.clearArbitrageApiRequestData()
                }
            }
        }

        if (UpdateArbiApiRequest !== prevProps.ArbiApiRequestResult.UpdateArbiApiRequest) {
            // for show responce update
            if (UpdateArbiApiRequest) {
                try {
                    //If UpdateArbiApiRequest response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({
                        response: UpdateArbiApiRequest
                    })) {
                        showAlert(R.strings.Success, UpdateArbiApiRequest.ReturnMsg, 0, () => {

                            // Clear data
                            this.props.clearArbitrageApiRequestData()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {

                        // Clear data
                        this.props.clearArbitrageApiRequestData()
                    }
                } catch (e) {

                    // Clear data
                    this.props.clearArbitrageApiRequestData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onRequestButtonPress = async (Id) => {

        // for check validation for empty value and valid url
        if (isEmpty(this.state.apiName)) {
            this.toast.Show(R.strings.enterApiname)
            return;
        }

        if (isEmpty(this.state.apiSendUrl)) {
            this.toast.Show(R.strings.enterApiSendurl)
            return;
        }

        if (isEmpty(this.state.apiValidateURL)) {
            this.toast.Show(R.strings.enterApiValidateUrl)
            return;
        }

        if (isEmpty(this.state.apiBalanceURL)) {
            this.toast.Show(R.strings.enterApiBalanceUrl)
            return;
        }

        if (isEmpty(this.state.apiStatusCheckURL)) {
            this.toast.Show(R.strings.enterApiStatusCheckUrl)
            return;
        }

        if (!validateURL(this.state.apiSendUrl)) {
            this.toast.Show(R.strings.enterValidApiSendUrl)
            return;
        }

        if (!validateURL(this.state.apiValidateURL)) {
            this.toast.Show(R.strings.enterValidApiValidateUrl)
            return;
        }

        if (!validateURL(this.state.apiBalanceURL)) {
            this.toast.Show(R.strings.enterValidApiBalanceUrl)
            return;
        }

        if (!validateURL(this.state.apiStatusCheckURL)) {
            this.toast.Show(R.strings.enterValidApiStatusCheckUrl)
            return;
        }

        if (isHtmlTag(this.state.apiName)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.apiName)
            return;
        }

        if (isScriptTag(this.state.apiName)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.apiName)
            return;
        }

        if (this.state.selectedAppType === R.strings.selectAppType) {
            this.toast.Show(R.strings.selectAppType)
            return;
        }

        else {
            // Check NetWork is Available or not
            if (await isInternet()) {

                this.request = {
                    APIName: this.state.apiName,
                    APISendURL: this.state.apiSendUrl,
                    APIValidateURL: this.state.apiValidateURL,
                    APIBalURL: this.state.apiBalanceURL,
                    APIStatusCheckURL: this.state.apiStatusCheckURL,
                    APIRequestBody: this.state.apiRequestBody,
                    TransactionIdPrefix: this.state.transactionIdPrefix,
                    MerchantCode: this.state.merchantCode,
                    ResponseSuccess: this.state.successResponse,
                    ResponseFailure: this.state.failureResponse,
                    ResponseHold: this.state.holdResponse,
                    AuthHeader: this.state.authenticationHeader,
                    ContentType: this.state.contentType,
                    MethodType: this.state.methodType,
                    AppType: this.state.AppTypeId,
                    ParsingDataID: this.state.parseId,
                    Status: this.state.selectedStatus === R.strings.Active ? 1 : 0
                }

                if (this.state.edit) {
                    this.request = {
                        ...this.request,
                        Id: this.state.item.Id,
                    }

                    //call update Arbitrage api request api
                    this.props.updateArbitrageApiRequest(this.request)
                }
                else {
                    //call add Arbitrage api request api
                    this.props.addArbitrageApiRequest(this.request)
                }
            }
        }

        Keyboard.dismiss();
    }

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    shouldComponentUpdate(nextProps, nextState) {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { AppTypeDataLoading, ThirdpartyResponseLoading, AddArbiApiRequestLoading, UpdateArbiApiRequestLoading } = this.props.ArbiApiRequestResult;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateThirdPartyApiRequest : R.strings.addThirdPartyApiRequest}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={AppTypeDataLoading || ThirdpartyResponseLoading || AddArbiApiRequestLoading || UpdateArbiApiRequestLoading} />

                {/* for common toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.widget_top_bottom_margin
                }}>

                    <View style={{ flex: 1 }}>

                        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>

                            {/* EditText for apiName */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etArbiApiName'] = input; }}
                                header={R.strings.apiName}
                                maxLength={30}
                                placeholder={R.strings.apiName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ apiName: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiApiSendUrl') }}
                                value={this.state.apiName}
                            />

                            {/* EditText for apiSendUrl */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etArbiApiSendUrl'] = input; }}
                                header={R.strings.apiSendUrl}
                                placeholder={R.strings.apiSendUrl}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ apiSendUrl: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiApiValidateURL') }}
                                value={this.state.apiSendUrl}
                            />

                            {/* EditText for apiValidateURL */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etArbiApiValidateURL'] = input; }}
                                header={R.strings.apiValidateURL}
                                placeholder={R.strings.apiValidateURL}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ apiValidateURL: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiApiBalanceURL') }}
                                value={this.state.apiValidateURL}
                            />

                            {/* EditText for apiBalanceURL */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etArbiApiBalanceURL'] = input; }}
                                header={R.strings.apiBalanceURL}
                                placeholder={R.strings.apiBalanceURL}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ apiBalanceURL: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiApiStatusCheckURL') }}
                                value={this.state.apiBalanceURL}
                            />

                            {/* EditText for apiStatusCheckURL */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etArbiApiStatusCheckURL'] = input; }}
                                header={R.strings.apiStatusCheckURL}
                                placeholder={R.strings.apiStatusCheckURL}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ apiStatusCheckURL: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiApiRequestBody') }}
                                value={this.state.apiStatusCheckURL}
                            />

                            {/* EditText for apiRequestBody */}
                            <EditText
                                reference={input => { this.inputs['etArbiApiRequestBody'] = input; }}
                                header={R.strings.apiRequestBody}
                                placeholder={R.strings.apiRequestBody}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ apiRequestBody: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiTransactionIdPrefix') }}
                                value={this.state.apiRequestBody}
                            />

                            {/* EditText for transactionIdPrefix */}
                            <EditText
                                reference={input => { this.inputs['etArbiTransactionIdPrefix'] = input; }}
                                header={R.strings.transactionIdPrefix}
                                placeholder={R.strings.transactionIdPrefix}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ transactionIdPrefix: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiMerchantCode') }}
                                value={this.state.transactionIdPrefix}
                            />

                            {/* EditText for merchantCode */}
                            <EditText
                                reference={input => { this.inputs['etArbiMerchantCode'] = input; }}
                                header={R.strings.merchantCode}
                                placeholder={R.strings.merchantCode}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ merchantCode: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiSuccessResponse') }}
                                value={this.state.merchantCode}
                            />

                            {/* EditText for successResponse */}
                            <EditText
                                reference={input => { this.inputs['etArbiSuccessResponse'] = input; }}
                                header={R.strings.successResponse}
                                placeholder={R.strings.successResponse}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ successResponse: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiFailureResponse') }}
                                value={this.state.successResponse}
                            />

                            {/* EditText for failureResponse */}
                            <EditText
                                reference={input => { this.inputs['etArbiFailureResponse'] = input; }}
                                header={R.strings.failureResponse}
                                placeholder={R.strings.failureResponse}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ failureResponse: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiHoldResponse') }}
                                value={this.state.failureResponse}
                            />

                            {/* EditText for holdResponse */}
                            <EditText
                                reference={input => { this.inputs['etArbiHoldResponse'] = input; }}
                                header={R.strings.holdResponse}
                                placeholder={R.strings.holdResponse}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ holdResponse: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiAuthenticationHeader') }}
                                value={this.state.holdResponse}
                            />

                            {/* EditText for authenticationHeader */}
                            <EditText
                                reference={input => { this.inputs['etArbiAuthenticationHeader'] = input; }}
                                header={R.strings.authenticationHeader}
                                placeholder={R.strings.authenticationHeader}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ authenticationHeader: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiContentType') }}
                                value={this.state.authenticationHeader}
                            />

                            {/* EditText for contentType */}
                            <EditText
                                reference={input => { this.inputs['etArbiContentType'] = input; }}
                                header={R.strings.contentType}
                                placeholder={R.strings.contentType}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ contentType: Label })}
                                onSubmitEditing={() => { this.focusNextField('etArbiMethodType') }}
                                value={this.state.contentType}
                            />

                            {/* EditText for methodType */}
                            <EditText
                                reference={input => { this.inputs['etArbiMethodType'] = input; }}
                                header={R.strings.methodType}
                                placeholder={R.strings.methodType}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(Label) => this.setState({ methodType: Label })}
                                value={this.state.methodType}
                            />

                            {/* Dropdown selection for AppType */}
                            <TitlePicker
                                title={R.strings.appType}
                                isRequired={true}
                                array={this.state.AppType}
                                selectedValue={this.state.selectedAppType}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                onPickerSelect={(index, object) => this.setState({ selectedAppType: index, AppTypeId: object.Id })} />

                            {/* Dropdown selection for parsingId */}
                            <TitlePicker
                                title={R.strings.parsingId}
                                array={this.state.parsingIds}
                                selectedValue={this.state.selectedparsingId}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                onPickerSelect={(index, object) => this.setState({ selectedparsingId: index, parseId: object.Id })} />

                            {/* Dropdown selection for status */}
                            <TitlePicker
                                title={R.strings.status}
                                array={this.state.status}
                                selectedValue={this.state.selectedStatus}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }}
                                onPickerSelect={(index) => this.setState({ selectedStatus: index, })} />

                        </ScrollView>
                    </View>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onRequestButtonPress(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // get Arbitrage Api Request data from reducer
        ArbiApiRequestResult: state.ArbitrageApiRequestReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({

    // Add Arbitrage Api Request Action
    addArbitrageApiRequest: (request) => dispatch(addArbitrageApiRequest(request)),
    // Update Arbitrage Api Request Action
    updateArbitrageApiRequest: (request) => dispatch(updateArbitrageApiRequest(request)),
    // get app type
    getAppType: () => dispatch(getAppType()),
    // get third party api response
    getArbitrageThirdPartyResponse: () => dispatch(getArbitrageThirdPartyResponse()),
    // clear data
    clearArbitrageApiRequestData: () => dispatch(clearArbitrageApiRequestData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageApiRequestAddEditScreen)