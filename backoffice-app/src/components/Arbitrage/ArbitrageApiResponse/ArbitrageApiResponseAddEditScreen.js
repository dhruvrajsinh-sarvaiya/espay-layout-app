// ArbitrageApiResponseAddEditScreen.js
import { View, ScrollView, Keyboard, } from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty, isHtmlTag, isScriptTag } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { addArbitrageApiResponse, updateArbitrageApiResponse, clearArbitrageApiResponseData } from '../../../actions/Arbitrage/ArbitrageApiResponseActions';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit 
class ArbitrageApiResponseAddEditScreen extends Component {

    constructor(props) {
        super(props);

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        this.inputs = {};
        let selectedStatus = "";

        if (edit) {
            if (item.Status == 1)
                selectedStatus = R.strings.Active
            if (item.Status == 0)
                selectedStatus = R.strings.Inactive
            if (item.Status == 9)
                selectedStatus = R.strings.Disable
        }

        // Create reference
        this.toast = React.createRef();

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,

            status: [{ value: R.strings.select_status, code: 99 }, { value: R.strings.Active, code: 1 }, { value: R.strings.Inactive, code: 0 }, { value: R.strings.Disable, code: 9 }],
            selectedStatus: edit ? selectedStatus : R.strings.select_status,
            statusId: edit ? item.Status : 0,

            balanceRegex: edit ? item.BalanceRegex : '',
            statusMsgRegex: edit ? item.StatusMsgRegex : '',
            responseCodeRegex: edit ? item.ResponseCodeRegex : '',
            errorCodeRegex: edit ? item.ErrorCodeRegex : '',
            trnRefNoRegex: edit ? item.TrnRefNoRegex : '',
            openTrnRefNumberRegex: edit ? item.OprTrnRefNoRegex : '',
            paramOneRegex: edit ? item.Param1Regex : '',
            paramTwoRegex: edit ? item.Param2Regex : '',
            paramThreeRegex: edit ? item.Param3Regex : '',
            statusRegex: edit ? item.StatusRegex : '',

            isFirstTime: true,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = async (prevProps, prevState) => {

        //Get All Updated field of Particular actions
        const { AddArbiApiResponse, UpdateArbiApiResponse } = this.props.ApiResponseResult;

        // check previous props and existing props
        if (AddArbiApiResponse !== prevProps.ApiResponseResult.AddArbiApiResponse) {
            // for show responce add
            if (AddArbiApiResponse) {
                try {
                    //If AddArbiApiResponse response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({ response: AddArbiApiResponse, })) {
                        showAlert(R.strings.Success, AddArbiApiResponse.ReturnMsg, 0, () => {
                            // Clear data
                            this.props.clearArbitrageApiResponseData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        // Clear data
                        this.props.clearArbitrageApiResponseData()
                    }
                } catch (e) {
                    // Clear data
                    this.props.clearArbitrageApiResponseData()
                }
            }
        }

        if (UpdateArbiApiResponse !== prevProps.ApiResponseResult.UpdateArbiApiResponse) {
            // for show responce update
            if (UpdateArbiApiResponse) {
                try {
                    //If UpdateArbiApiResponse response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({ response: UpdateArbiApiResponse })) {
                        showAlert(R.strings.Success, UpdateArbiApiResponse.ReturnMsg, 0, () => {
                            this.props.clearArbitrageApiResponseData()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearArbitrageApiResponseData()
                    }
                } catch (e) {
                    this.props.clearArbitrageApiResponseData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onAddEditResponse = async (Id) => {

        // for check validation for empty value and script tag and html tag

        if (isScriptTag(this.state.balanceRegex)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.balanceRegex)
            return;
        }
        if (isHtmlTag(this.state.balanceRegex)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.balanceRegex)
            return;
        }
        if (isHtmlTag(this.state.statusMsgRegex)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.statusMsgRegex)
            return;
        }
        if (isScriptTag(this.state.statusMsgRegex)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.statusMsgRegex)
            return;
        }
        if (isHtmlTag(this.state.responseCodeRegex)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.responseCodeRegex)
            return;
        }
        if (isScriptTag(this.state.responseCodeRegex)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.responseCodeRegex)
            return;
        }
        if (isHtmlTag(this.state.errorCodeRegex)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.errorCodeRegex)
            return;
        }
        if (isScriptTag(this.state.errorCodeRegex)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.errorCodeRegex)
            return;
        }
        if (isHtmlTag(this.state.trnRefNoRegex)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.trnRefNoRegex)
            return;
        }
        if (isScriptTag(this.state.trnRefNoRegex)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.trnRefNoRegex)
            return;
        }
        if (isHtmlTag(this.state.openTrnRefNumberRegex)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.openTrnRefNumberRegex)
            return;
        }
        if (isScriptTag(this.state.openTrnRefNumberRegex)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.openTrnRefNumberRegex)
            return;
        }
        if (isHtmlTag(this.state.paramOneRegex)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.paramOneRegex)
            return;
        }
        if (isScriptTag(this.state.paramOneRegex)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.paramOneRegex)
            return;
        }
        if (isHtmlTag(this.state.paramTwoRegex)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.paramTwoRegex)
            return;
        }
        if (isScriptTag(this.state.paramTwoRegex)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.paramTwoRegex)
            return;
        }
        if (isHtmlTag(this.state.paramThreeRegex)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.paramThreeRegex)
            return;
        }
        if (isScriptTag(this.state.paramThreeRegex)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.paramThreeRegex)
            return;
        }
        if (isHtmlTag(this.state.statusRegex)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.statusRegex)
            return;
        }
        if (isScriptTag(this.state.statusRegex)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.statusRegex)
            return;
        }
        if (isEmpty(this.state.statusMsgRegex)) {
            this.toast.Show(R.strings.enterStatusMessageRegex)
            return;
        }
        if (isEmpty(this.state.statusRegex)) {
            this.toast.Show(R.strings.enterStatusRegex)
            return;
        }
        else {
            // Check internet is Available or not
            if (await isInternet()) {

                this.request = {
                    BalanceRegex: this.state.balanceRegex,
                    StatusRegex: this.state.statusRegex,
                    StatusMsgRegex: this.state.statusMsgRegex,
                    ResponseCodeRegex: this.state.responseCodeRegex,
                    ErrorCodeRegex: this.state.errorCodeRegex,
                    TrnRefNoRegex: this.state.trnRefNoRegex,
                    OprTrnRefNoRegex: this.state.openTrnRefNumberRegex,
                    Param1Regex: this.state.paramOneRegex,
                    Param2Regex: this.state.paramTwoRegex,
                    Param3Regex: this.state.paramThreeRegex,
                    Status: this.state.selectedStatus === R.strings.select_status ? 0 : this.state.statusId
                }

                if (this.state.edit) {
                    this.request = {
                        ...this.request,
                        Id: this.state.item.Id,
                    }

                    //call update UArbitrage api response api
                    this.props.updateArbitrageApiResponse(this.request)
                }
                else {

                    //call add UArbitrage api response api
                    this.props.addArbitrageApiResponse(this.request)
                }
            }
        }

        Keyboard.dismiss();
    }

    shouldComponentUpdate(nextProps, _nextState) {
        // stop twice api call
        return isCurrentScreen(nextProps);
    }

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { AddArbiApiResponseLoading, UpdateArbiApiResponseLoading } = this.props.ApiResponseResult;
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateThirdPartyApiResponse : R.strings.addThirdPartyApiResponse}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={AddArbiApiResponseLoading || UpdateArbiApiResponseLoading} />

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

                            {/* Inputfield for Address */}
                            <EditText
                                reference={input => { this.inputs['etBalanceRegex'] = input; }}
                                header={R.strings.balanceRegex}
                                placeholder={R.strings.balanceRegex}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ balanceRegex: Label })}
                                onSubmitEditing={() => { this.focusNextField('etStatusMsgRegex') }}
                                value={this.state.balanceRegex}
                            />

                            {/* Inputfield for statusMsgRegex */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etStatusMsgRegex'] = input; }}
                                header={R.strings.statusMessageRegex}
                                placeholder={R.strings.statusMessageRegex}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ statusMsgRegex: Label })}
                                onSubmitEditing={() => { this.focusNextField('etResponseCodeRegex') }}
                                value={this.state.statusMsgRegex}
                            />

                            {/* Inputfield for responseCodeRegex */}
                            <EditText
                                reference={input => { this.inputs['etResponseCodeRegex'] = input; }}
                                header={R.strings.responseCodeRegex}
                                placeholder={R.strings.responseCodeRegex}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ responseCodeRegex: Label })}
                                onSubmitEditing={() => { this.focusNextField('etErrorCodeRegex') }}
                                value={this.state.responseCodeRegex}
                            />

                            {/* Inputfield for errorCodeRegex */}
                            <EditText
                                reference={input => { this.inputs['etErrorCodeRegex'] = input; }}
                                header={R.strings.errorCodeRegex}
                                placeholder={R.strings.errorCodeRegex}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ errorCodeRegex: Label })}
                                onSubmitEditing={() => { this.focusNextField('etTrnRefNoRegex') }}
                                value={this.state.errorCodeRegex}
                            />

                            {/* Inputfield for transactionReferenceNumberRegex */}
                            <EditText
                                reference={input => { this.inputs['etTrnRefNoRegex'] = input; }}
                                header={R.strings.transactionReferenceNumberRegex}
                                placeholder={R.strings.transactionReferenceNumberRegex}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ trnRefNoRegex: Label })}
                                onSubmitEditing={() => { this.focusNextField('etOpenTrnRefNumberRegex') }}
                                value={this.state.trnRefNoRegex}
                            />

                            {/* Inputfield for openTrnRefNumberRegex */}
                            <EditText
                                reference={input => { this.inputs['etOpenTrnRefNumberRegex'] = input; }}
                                header={R.strings.openTrnRefNumberRegex}
                                placeholder={R.strings.openTrnRefNumberRegex}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ openTrnRefNumberRegex: Label })}
                                onSubmitEditing={() => { this.focusNextField('etParamOneRegex') }}
                                value={this.state.openTrnRefNumberRegex}
                            />

                            {/* Inputfield for paramOneRegex */}
                            <EditText
                                reference={input => { this.inputs['etParamOneRegex'] = input; }}
                                header={R.strings.paramOneRegex}
                                placeholder={R.strings.paramOneRegex}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ paramOneRegex: Label })}
                                onSubmitEditing={() => { this.focusNextField('etParamTwoRegex') }}
                                value={this.state.paramOneRegex}
                            />

                            {/* Inputfield for paramTwoRegex */}
                            <EditText
                                reference={input => { this.inputs['etParamTwoRegex'] = input; }}
                                header={R.strings.paramTwoRegex}
                                placeholder={R.strings.paramTwoRegex}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ paramTwoRegex: Label })}
                                onSubmitEditing={() => { this.focusNextField('etParamThreeRegex') }}
                                value={this.state.paramTwoRegex}
                            />

                            {/* Inputfield for paramThreeRegex */}
                            <EditText
                                reference={input => { this.inputs['etParamThreeRegex'] = input; }}
                                header={R.strings.paramThreeRegex}
                                placeholder={R.strings.paramThreeRegex}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ paramThreeRegex: Label })}
                                onSubmitEditing={() => { this.focusNextField('etStatusRegex') }}
                                value={this.state.paramThreeRegex}
                            />

                            {/* Inputfield for statusRegex */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etStatusRegex'] = input; }}
                                header={R.strings.statusRegex}
                                placeholder={R.strings.statusRegex}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(Label) => this.setState({ statusRegex: Label })}
                                value={this.state.statusRegex}
                            />

                            {/* dropdown selection for status */}
                            <TitlePicker
                                title={R.strings.status}
                                array={this.state.status}
                                selectedValue={this.state.selectedStatus}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }}
                                onPickerSelect={(index, object) => this.setState({ selectedStatus: index, statusId: object.code })} />

                        </ScrollView>
                    </View>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddEditResponse(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // get Arbitrage Api Response data from reducer
        ApiResponseResult: state.ArbitrageApiResponseReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({

    // Add Arbitrage Api Response Action
    addArbitrageApiResponse: (request) => dispatch(addArbitrageApiResponse(request)),
    // Update Arbitrage Api Response Action
    updateArbitrageApiResponse: (request) => dispatch(updateArbitrageApiResponse(request)),
    // clear reducer data
    clearArbitrageApiResponseData: () => dispatch(clearArbitrageApiResponseData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageApiResponseAddEditScreen)