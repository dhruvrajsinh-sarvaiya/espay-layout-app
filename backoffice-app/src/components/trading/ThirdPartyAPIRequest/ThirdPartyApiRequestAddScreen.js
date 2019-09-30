import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText';
import { changeTheme, parseArray, showAlert, parseIntVal } from '../../../controllers/CommonUtils';
import { addThirdPartyApiRequestList, updateThirdPartyApiRequestList, clearAddData, clearUpdateData } from '../../../actions/Trading/ApiRequestConfigAction';
import { getThirdPartyAPIResponseBO } from '../../../actions/Trading/ThirdPartyAPIResponseActions';
import { isInternet, isEmpty, validateURL, validateResponseNew } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import { TitlePicker } from '../../widget/ComboPickerWidget'
import { getAppType } from '../../../actions/PairListAction';
import SafeView from '../../../native_theme/components/SafeView';
import BottomButton from '../../../native_theme/components/BottomButton';

class ThirdPartyApiRequestAddScreen extends Component {
    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        let item = props.navigation.state.params && props.navigation.state.params.ITEM;
        this.state = {

            UpdateItemId: item == undefined ? '' : item.Id,
            editableItem: item == undefined ? false : true,

            tabNames: R.strings.thirdPartyTabsName,
            apiName: item == undefined ? '' : item.APIName,
            apiSendUrl: item == undefined ? '' : item.APISendURL,
            apiValidateUrl: item == undefined ? '' : item.APIValidateURL,
            apiBalanceUrl: item == undefined ? '' : item.APIBalURL,
            apiStatusCheckUrl: item == undefined ? '' : item.APIStatusCheckURL,
            apiRequestBody: item == undefined ? '' : item.APIRequestBody,

            trnIdPrefix: item == undefined ? '' : item.TransactionIdPrefix,
            merchantCode: item == undefined ? '' : item.MerchantCode,

            successResponse: item == undefined ? '' : item.ResponseSuccess,
            failureResponse: item == undefined ? '' : item.ResponseFailure,
            holdResponse: item == undefined ? '' : item.ResponseHold,

            authHeader: item == undefined ? '' : item.AuthHeader,
            contentType: item == undefined ? '' : item.ContentType,
            methodType: item == undefined ? '' : item.MethodType,

            spinnerAppTypeData: [],
            appTypeListData: null,
            selectedAppType: item == undefined ? R.strings.select + ' ' + R.strings.app_type : item.AppTypeText,

            spinnerParsingIdData: [],
            selectedParsingId: item == undefined ? R.strings.select + ' ' + R.strings.parsing_id : item.ParsingDataID,

            isFromUpdate: item == undefined ? false : true,
            selectedAppTypeId: item == undefined ? 0 : item.AppType,

            isFirstTime: true,

        };
        this.headerText = item == undefined ? R.strings.add_third_party_api_request : R.strings.edit_third_party_api_request;
        this.buttonText = item == undefined ? R.strings.submit : R.strings.update;
        this.inputs = {};
    }
    /* Called when onPage Scrolling */
    onPageScroll = (scrollData) => {
        let { position } = scrollData
        if (position != this.state.tabPosition) {
            this.setState({ tabPosition: position, })
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps)
    };

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    componentDidMount = async () => {
        changeTheme()

        /* Check interner connection is available or not */
        if (await isInternet()) {
            /* Call app Type List Api */
            this.props.getAppType({})
            this.props.getThirdPartyAPIResponseBO();
        }
    };



    /* user press on prev page button */
    onPrevPagePress = () => {
        if (this.state.tabPosition > 0) {
            let pos = this.state.tabPosition - 1

            if (this.refs['PairConfigurationTab']) { this.refs['PairConfigurationTab'].setPage(pos) }
        }
    }
    /* user press on next page button */
    onNextPagePress = () => {
        if (this.state.tabPosition < this.state.tabNames.length - 1) {
            let pos = this.state.tabPosition + 1

            if (this.refs['PairConfigurationTab']) { this.refs['PairConfigurationTab'].setPage(pos) }
        }
    }

    onSubmitPress = async () => {

        let { apiName, apiSendUrl, apiValidateUrl, apiBalanceUrl, apiStatusCheckUrl, apiRequestBody,
            trnIdPrefix, merchantCode,
            successResponse, failureResponse, holdResponse,
            authHeader, contentType, methodType,
            UpdateItemId, selectedParsingId,
        } = this.state

        //for validations
        if (isEmpty(this.state.apiName))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.api_name)
        else if (isEmpty(this.state.apiSendUrl))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.api_send_url)
        else if (isEmpty(this.state.apiValidateUrl))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.api_validate_url)
        else if (isEmpty(this.state.apiBalanceUrl))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.api_balance_url)
        else if (isEmpty(this.state.apiStatusCheckUrl))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.api_status_check_url)
        else if (isEmpty(this.state.apiRequestBody))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.api_request_body)
        else if (isEmpty(this.state.trnIdPrefix))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.transaction_id_prefix)
        else if (isEmpty(this.state.merchantCode))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.merchant_code)
        else if (isEmpty(this.state.successResponse))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.success_response)
        else if (isEmpty(this.state.failureResponse))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.failure_response)
        else if (isEmpty(this.state.holdResponse))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.hold_response)
        else if (isEmpty(this.state.authHeader))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.authentication_header)
        else if (isEmpty(this.state.contentType))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.content_type)
        else if (isEmpty(this.state.methodType))
            this.toast.Show(R.strings.Enter + ' ' + R.strings.method_type)
        else if (isEmpty(this.state.selectedAppType) || this.state.selectedAppType === R.strings.select + ' ' + R.strings.app_type)
            this.toast.Show(R.strings.select + ' ' + R.strings.app_type)
        else if (isEmpty(this.state.selectedParsingId) || this.state.selectedParsingId === R.strings.select + ' ' + R.strings.parsing_id)
            this.toast.Show(R.strings.select + ' ' + R.strings.parsing_id)

        //validate url is entered properly or not
        else if (!validateURL(this.state.apiSendUrl))
            this.toast.Show(R.strings.enter_proper + ' ' + R.strings.api_send_url)
        else if (!validateURL(this.state.apiValidateUrl))
            this.toast.Show(R.strings.enter_proper + ' ' + R.strings.api_validate_url)
        else if (!validateURL(this.state.apiBalanceUrl))
            this.toast.Show(R.strings.enter_proper + ' ' + R.strings.api_balance_url)
        else if (!validateURL(this.state.apiStatusCheckUrl))
            this.toast.Show(R.strings.enter_proper + ' ' + R.strings.api_status_check_url)
        else {

            if (this.state.isFromUpdate) {

                //request for new record
                const requestAddThirdPartyApi = {
                    Id: UpdateItemId,
                    APIName: apiName,
                    APISendURL: apiSendUrl,
                    APIValidateURL: apiValidateUrl,
                    APIBalURL: apiBalanceUrl,
                    APIStatusCheckURL: apiStatusCheckUrl,
                    APIRequestBody: apiRequestBody,
                    TransactionIdPrefix: trnIdPrefix,
                    MerchantCode: merchantCode,
                    ResponseSuccess: successResponse,
                    ResponseFailure: failureResponse,
                    ResponseHold: holdResponse,
                    AuthHeader: authHeader,
                    ContentType: contentType,
                    MethodType: methodType,
                    AppType: this.state.selectedAppTypeId ? parseIntVal(this.state.selectedAppTypeId) : parseIntVal(0),
                    ParsingDataID: selectedParsingId ? parseIntVal(selectedParsingId) : parseIntVal(0)
                };

                //call api for updateThirdPartyApiRequest
                this.props.updateThirdPartyApiRequestList(requestAddThirdPartyApi);

            } else if (!this.state.isFromUpdate) {

                // requet for upading records
                const requestUpdateThirdPartyApi = {
                    APIName: apiName,
                    APISendURL: apiSendUrl,
                    APIValidateURL: apiValidateUrl,
                    APIBalURL: apiBalanceUrl,
                    APIStatusCheckURL: apiStatusCheckUrl,
                    APIRequestBody: apiRequestBody,
                    TransactionIdPrefix: trnIdPrefix,
                    MerchantCode: merchantCode,
                    ResponseSuccess: successResponse,
                    ResponseFailure: failureResponse,
                    ResponseHold: holdResponse,
                    AuthHeader: authHeader,
                    ContentType: contentType,
                    MethodType: methodType,
                    AppType: this.state.selectedAppTypeId ? parseIntVal(this.state.selectedAppTypeId) : parseIntVal(0),
                    ParsingDataID: selectedParsingId ? parseIntVal(selectedParsingId) : parseIntVal(0),
                };

                //call api for addThirdPartyApiRequest
                this.props.addThirdPartyApiRequestList(requestUpdateThirdPartyApi);
            }
        }

    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (ThirdPartyApiRequestAddScreen.oldProps !== props) {
            ThirdPartyApiRequestAddScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { appTypeList, thirdPartyAPIResponse } = props;

            // for spinner app type 
            if (appTypeList) {
                try {
                    if (state.appTypeList == null || (state.appTypeList != null && appTypeList !== state.appTypeList)) {
                        if (validateResponseNew({ response: appTypeList, isList: false })) {
                            let newRes = parseArray(appTypeList.Response)
                            newRes.map((item, index) => {
                                newRes[index].value = newRes[index].AppTypeName
                            })

                            let res = [{ value: R.strings.select + ' ' + R.strings.app_type }, ...newRes]
                            return { ...state, spinnerAppTypeData: res, appTypeList };
                        }
                        else {
                            return { ...state, spinnerAppTypeData: [{ value: R.strings.select + ' ' + R.strings.app_type }], };
                        }
                    }
                } catch (error) {
                    return { ...state, spinnerAppTypeData: [{ value: R.strings.select + ' ' + R.strings.app_type }], };
                }

            }

            if (thirdPartyAPIResponse) {

                //if local thirdPartyAPIResponse state is null or its not null and also different then new response then and only then validate response.
                try {
                    if (state.thirdPartyAPIResponse == null || (state.thirdPartyAPIResponse != null && thirdPartyAPIResponse !== state.thirdPartyAPIResponse)) {
                        //if thirdPartyAPIResponse response is success then store array list else store empty list
                        if (validateResponseNew({ response: thirdPartyAPIResponse, isList: true })) {
                            let res = parseArray(thirdPartyAPIResponse.Response);

                            for (var thirdPartyItem in res) {
                                let item = res[thirdPartyItem]
                                item.value = item.Id
                            }

                            let spinnerParsingIdData = [{ value: R.strings.select + ' ' + R.strings.parsing_id }, ...res]

                            return { ...state, thirdPartyAPIResponse, spinnerParsingIdData };
                        } else {
                            return { ...state, thirdPartyAPIResponse, spinnerParsingIdData: [{ value: R.strings.select }] };
                        }
                    }
                } catch (error) {
                    return { ...state, spinnerParsingIdData: [{ value: R.strings.select }] };
                }
            }

        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { addRequestList, updateRequestList } = this.props;

        if (addRequestList !== prevProps.addRequestList) {
            if (addRequestList) {
                try {
                    if (this.state.addRequestList == null || (this.state.addRequestList != null && addRequestList !== this.state.addRequestList)) {
                        if (validateResponseNew({ response: addRequestList, isList: false })) {
                            showAlert(R.strings.Status, addRequestList.ReturnMsg, 0, () => {
                                this.props.clearAddData()
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            this.props.clearAddData()
                        }
                    }
                } catch (error) {
                    this.props.clearAddData()
                }
            }
        }

        if (updateRequestList !== prevProps.updateRequestList) {
            //for show responce of editDaemon data
            if (updateRequestList) {
                try {
                    if (this.state.updateRequestList == null || (this.state.updateRequestList != null && updateRequestList !== this.state.updateRequestList)) {
                        if (validateResponseNew({ response: updateRequestList, isList: false })) {
                            showAlert(R.strings.Status, updateRequestList.ReturnMsg, 0, () => {
                                this.props.clearUpdateData()
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            this.props.clearUpdateData()
                        }
                    }
                } catch (error) {
                    this.props.clearUpdateData()
                }
            }
        }
    }

    render() {

        let { addLoading, updateLoading, loading, isLoadingthirdPartyAPIResponse } = this.props

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.headerText}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* ProgressDialog */}
                <ProgressDialog isShow={addLoading || updateLoading || loading || isLoadingthirdPartyAPIResponse} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* View Pager Indicator (Tab) */}
                    <IndicatorViewPager
                        ref='PairConfigurationTab'
                        style={{ flex: 1, flexDirection: 'column-reverse', }}
                        titles={this.state.tabNames}
                        numOfItems={3}
                        horizontalScroll={false}
                        isGradient={true}
                        style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
                        >

                        {/* First Tab */}
                        <View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flex: 1, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin }}>
                                    {/* EditText for api name */}
                                    <EditText
                                        header={R.strings.api_name}
                                        reference={input => { this.inputs['etApiName'] = input; }}
                                        placeholder={R.strings.api_name}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ apiName: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etSendUrl') }}
                                        value={this.state.apiName}
                                        style={{ marginTop: 0 }}
                                    />

                                    {/* EditText for api send url */}
                                    <EditText
                                        header={R.strings.api_send_url}
                                        reference={input => { this.inputs['etSendUrl'] = input; }}
                                        placeholder={R.strings.api_send_url}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ apiSendUrl: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etApiValidateUrl') }}
                                        value={this.state.apiSendUrl}
                                    />

                                    {/* EditText for api validate url */}
                                    <EditText
                                        header={R.strings.api_validate_url}
                                        reference={input => { this.inputs['etApiValidateUrl'] = input; }}
                                        placeholder={R.strings.api_validate_url}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ apiValidateUrl: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etBalanceUrl') }}
                                        value={this.state.apiValidateUrl}
                                    />

                                    {/* EditText for api balance url */}
                                    <EditText
                                        header={R.strings.api_balance_url}
                                        reference={input => { this.inputs['etBalanceUrl'] = input; }}
                                        placeholder={R.strings.api_balance_url}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ apiBalanceUrl: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etStatusCheckUrl') }}
                                        value={this.state.apiBalanceUrl}
                                    />

                                    {/* EditText for api status check url */}
                                    <EditText
                                        header={R.strings.api_status_check_url}
                                        reference={input => { this.inputs['etStatusCheckUrl'] = input; }}
                                        placeholder={R.strings.api_status_check_url}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ apiStatusCheckUrl: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etApiRequestBody') }}
                                        value={this.state.apiStatusCheckUrl}
                                    />

                                    {/* EditText for api request body */}
                                    <EditText
                                        header={R.strings.api_request_body}
                                        reference={input => { this.inputs['etApiRequestBody'] = input; }}
                                        placeholder={R.strings.api_request_body}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"done"}
                                        onChangeText={(Label) => this.setState({ apiRequestBody: Label })}
                                        //onSubmitEditing={() => { this.focusNextField('etBuyMinQty') }}
                                        value={this.state.apiRequestBody}
                                    />
                                </View>
                            </ScrollView>
                        </View>

                        {/* Second Tab */}
                        <View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{
                                    paddingLeft: R.dimens.activity_margin,
                                    paddingRight: R.dimens.activity_margin,
                                    paddingBottom: R.dimens.padding_top_bottom_margin,
                                    paddingTop: R.dimens.padding_top_bottom_margin
                                }}>

                                    {/* EditText for transaction id prefix */}
                                    <EditText
                                        header={R.strings.transaction_id_prefix}
                                        reference={input => { this.inputs['etTrnIdPrefix'] = input; }}
                                        placeholder={R.strings.transaction_id_prefix}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ trnIdPrefix: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etMerchantCode') }}
                                        value={this.state.trnIdPrefix}
                                        style={{ marginTop: 0 }}
                                    />

                                    {/* EditText for merchant code */}
                                    <EditText
                                        header={R.strings.merchant_code}
                                        reference={input => { this.inputs['etMerchantCode'] = input; }}
                                        placeholder={R.strings.merchant_code}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ merchantCode: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etSuccessResponse') }}
                                        value={this.state.merchantCode}
                                    />

                                    {/* EditText for success reeponse */}
                                    <EditText
                                        header={R.strings.success_response}
                                        reference={input => { this.inputs['etSuccessResponse'] = input; }}
                                        placeholder={R.strings.success_response}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ successResponse: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etFailureResponse') }}
                                        value={this.state.successResponse}
                                    />

                                    {/* EditText for failure reeponse */}
                                    <EditText
                                        header={R.strings.failure_response}
                                        reference={input => { this.inputs['etFailureResponse'] = input; }}
                                        placeholder={R.strings.failure_response}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ failureResponse: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etHoldResponse') }}
                                        value={this.state.failureResponse}
                                    />

                                    {/* EditText for hold reeponse */}
                                    <EditText
                                        header={R.strings.hold_response}
                                        reference={input => { this.inputs['etHoldResponse'] = input; }}
                                        placeholder={R.strings.hold_response}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"done"}
                                        onChangeText={(Label) => this.setState({ holdResponse: Label })}
                                        //onSubmitEditing={() => { this.focusNextField('etBuyMinQty') }}
                                        value={this.state.holdResponse}
                                    />

                                </View>
                            </ScrollView>
                        </View>

                        {/* Third Tab */}
                        <View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{
                                    paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                                    paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin
                                }}>

                                    {/* EditText for authentication header */}
                                    <EditText
                                        header={R.strings.authentication_header}
                                        reference={input => { this.inputs['etAuthHeader'] = input; }}
                                        placeholder={R.strings.authentication_header}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ authHeader: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etContentType') }}
                                        value={this.state.authHeader}
                                        style={{ marginTop: 0 }}
                                    />

                                    {/* EditText for content Type */}
                                    <EditText
                                        header={R.strings.content_type}
                                        reference={input => { this.inputs['etContentType'] = input; }}
                                        placeholder={R.strings.content_type}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ contentType: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etMethodType') }}
                                        value={this.state.contentType}
                                    />


                                    {/* EditText for method type */}
                                    <EditText
                                        header={R.strings.method_type}
                                        reference={input => { this.inputs['etMethodType'] = input; }}
                                        placeholder={R.strings.method_type}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"done"}
                                        onChangeText={(Label) => this.setState({ methodType: Label })}
                                        value={this.state.methodType}
                                    />

                                    {/* Picker for app Type */}
                                    <TitlePicker
                                        title={R.strings.app_type}
                                        array={this.state.spinnerAppTypeData}
                                        selectedValue={this.state.selectedAppType}
                                        onPickerSelect={(index, object) => this.setState({ selectedAppType: index, selectedAppTypeId: object.Id })}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                    />

                                    {/* Picker for parseing id */}
                                    {/*   <TitlePicker
                                        title={R.strings.parsing_id}
                                        array={this.state.spinnerParsingIdData}
                                        selectedValue={this.state.selectedParsingId}
                                        onPickerSelect={(item) => this.setState({ selectedParsingId: item })}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                                    /> */}

                                </View>
                            </ScrollView>
                        </View>
                    </IndicatorViewPager>

                    {/* Button for next , prev */}
                    <View style={{
                        margin: R.dimens.margin,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        {
                            this.state.tabPosition > 0 ?
                                <BottomButton
                                    title={R.strings.Prev}
                                    onPress={() => this.onPrevPagePress()} />
                                :
                                null
                        }
                        <View style={{ flex: 1 }} />
                        {
                            (this.state.tabPosition < this.state.tabNames.length - 1) ?
                                <BottomButton
                                    title={R.strings.next}
                                    onPress={() => this.onNextPagePress()} />
                                :
                                <BottomButton
                                    title={this.buttonText}
                                    onPress={() => this.onSubmitPress()} />
                        }
                    </View>
                </View>

            </SafeView>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
    }
}

/* return state from saga or reducer */
const mapStateToProps = (state) => {
    //Updated Data For apiRequestConfigReducer,thirdPartyAPIResponseBOReducer  Data 
    return {
        addRequestList: state.apiRequestConfigReducer.addRequestList,
        updateRequestList: state.apiRequestConfigReducer.updateRequestList,
        appTypeList: state.apiRequestConfigReducer.appTypeList,
        loading: state.apiRequestConfigReducer.loading,
        addLoading: state.apiRequestConfigReducer.addLoading,
        updateLoading: state.apiRequestConfigReducer.updateLoading,
        thirdPartyAPIResponse: state.thirdPartyAPIResponseBOReducer.thirdPartyAPIResponse,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //Perform addThirdPartyApiRequestList Action 
    addThirdPartyApiRequestList: (requestUpdateThirdPartyApi) => dispatch(addThirdPartyApiRequestList(requestUpdateThirdPartyApi)),
    //Perform getAppType Action 
    getAppType: () => dispatch(getAppType()),
    //Perform updateThirdPartyApiRequestList Action 
    updateThirdPartyApiRequestList: (requestUpdateThirdPartyApi) => dispatch(updateThirdPartyApiRequestList(requestUpdateThirdPartyApi)),
    //clear add data
    clearAddData: () => dispatch(clearAddData()),
    //clear update data
    clearUpdateData: () => dispatch(clearUpdateData()),
    //Perform getThirdPartyAPIResponseBO Action 
    getThirdPartyAPIResponseBO: () => dispatch(getThirdPartyAPIResponseBO()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ThirdPartyApiRequestAddScreen);
