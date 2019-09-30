import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import { addThirdpartyAPIResponseBO, updateThirdpartyAPIResponseBO, cleanAddUpdateThirdPartyResponse } from '../../../actions/Trading/ThirdPartyAPIResponseActions';
import Button from '../../../native_theme/components/Button';
import EditText from '../../../native_theme/components/EditText';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';

class AddThirdPartyAPIResponseScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.progressDialog = React.createRef();
        this.toast = React.createRef();
        this.inputs = {};

        //data from previous screen 
        let { item, isEdit } = props.navigation.state.params;

        //Define all initial state
        this.state = {
            title: (isEdit ? R.strings.update : R.strings.add) + ' ' + R.strings.thirdPartyAPIResponse,
            isEdit,
            Id: (item && item.Id != undefined) ? item.Id : '',
            BalanceRegex: this.getValue(item, 'BalanceRegex'),
            StatusRegex: this.getValue(item, 'StatusRegex'),
            StatusMsgRegex: this.getValue(item, 'StatusMsgRegex'),
            ResponseCodeRegex: this.getValue(item, 'ResponseCodeRegex'),
            ErrorCodeRegex: this.getValue(item, 'ErrorCodeRegex'),
            TrnRefNoRegex: this.getValue(item, 'TrnRefNoRegex'),
            OprTrnRefNoRegex: this.getValue(item, 'OprTrnRefNoRegex'),
            Param1Regex: this.getValue(item, 'Param1Regex'),
            Param2Regex: this.getValue(item, 'Param2Regex'),
            Param3Regex: this.getValue(item, 'Param3Regex')
        };
    }

    getValue(item, name) {
        let content = '';
        if (item && item[name]) {
            //if content is empty then replace with Empty string otherwise return original data
            content = isEmpty(item[name]) ? '' : item[name];

            //If content is still having spaces then with check with trimming and replace it with empty string otherwise return data
            content = !isEmpty(content) ? (isEmpty(content.trim()) ? '' : content) : content;
        }
        return content;
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {
        const { addThirdPartyAPIResponse, updateThirdPartyAPIResponse } = this.props.data;

        if (addThirdPartyAPIResponse !== prevProps.data.addThirdPartyAPIResponse) {
            if (addThirdPartyAPIResponse) {
                try {
                    if (this.state.addThirdPartyAPIResponse == null || (this.state.addThirdPartyAPIResponse != null && addThirdPartyAPIResponse !== this.state.addThirdPartyAPIResponse)) {
                        //add ThirdPartyAPIResponse handle
                        if (validateResponseNew({ response: addThirdPartyAPIResponse })) {
                            showAlert(R.strings.status, addThirdPartyAPIResponse.ReturnMsg, 0, async () => {
                                this.props.cleanAddUpdateThirdPartyAPIResponse();
                                this.props.navigation.state.params.onSuccess();
                                this.props.navigation.goBack();
                            });

                        } else {
                            this.props.cleanAddUpdateThirdPartyAPIResponse();
                        }
                    }
                } catch (error) {
                    this.props.cleanAddUpdateThirdPartyAPIResponse();
                }
            }
        }

        if (updateThirdPartyAPIResponse !== prevProps.data.updateThirdPartyAPIResponse) {
            if (updateThirdPartyAPIResponse) {
                try {
                    //if local updateThirdPartyAPIResponse state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.updateThirdPartyAPIResponse == null || (this.state.updateThirdPartyAPIResponse != null && updateThirdPartyAPIResponse !== this.state.updateThirdPartyAPIResponse)) {
                        //update ThirdPartyAPIResponse handle
                        if (validateResponseNew({ response: updateThirdPartyAPIResponse })) {
                            showAlert(R.strings.status, updateThirdPartyAPIResponse.ReturnMsg, 0, async () => {
                                this.props.cleanAddUpdateThirdPartyAPIResponse();
                                this.props.navigation.state.params.onSuccess();
                                this.props.navigation.goBack();
                            });

                        } else {
                            this.props.cleanAddUpdateThirdPartyAPIResponse();
                        }
                    }
                } catch (error) {
                    this.props.cleanAddUpdateThirdPartyAPIResponse()
                }
            }
        }

    }

    onSumbit = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Check all validations
            if (isEmpty(this.state.BalanceRegex)) {
                this.toast.Show(R.strings.balanceRegexValidate);
                return;
            }
            if (isEmpty(this.state.StatusRegex)) {
                this.toast.Show(R.strings.statusRegexValidate);
                return;
            }
            if (isEmpty(this.state.StatusMsgRegex)) {
                this.toast.Show(R.strings.statusMessageRegexValidate);
                return;
            }
            if (isEmpty(this.state.ResponseCodeRegex)) {
                this.toast.Show(R.strings.responseCodeRegexValidate);
                return;
            }
            if (isEmpty(this.state.ErrorCodeRegex)) {
                this.toast.Show(R.strings.errorCodeRegexValidate);
                return;
            }
            if (isEmpty(this.state.TrnRefNoRegex)) {
                this.toast.Show(R.strings.trnRefNoRegexValidate);
                return;
            }
            if (isEmpty(this.state.OprTrnRefNoRegex)) {
                this.toast.Show(R.strings.opTrnRefNoRegexValidate);
                return;
            }
            if (isEmpty(this.state.Param1Regex)) {
                this.toast.Show(R.strings.param1RegexValidate);
                return;
            }
            if (isEmpty(this.state.Param2Regex)) {
                this.toast.Show(R.strings.param2RegexValidate);
                return;
            }
            if (isEmpty(this.state.Param3Regex)) {
                this.toast.Show(R.strings.param3RegexValidate);
                return;
            }

            this.progressDialog.show();

            let request = {
                BalanceRegex: this.state.BalanceRegex,
                StatusRegex: this.state.StatusRegex,
                StatusMsgRegex: this.state.StatusMsgRegex,
                ResponseCodeRegex: this.state.ResponseCodeRegex,
                ErrorCodeRegex: this.state.ErrorCodeRegex,
                TrnRefNoRegex: this.state.TrnRefNoRegex,
                OprTrnRefNoRegex: this.state.OprTrnRefNoRegex,
                Param1Regex: this.state.Param1Regex,
                Param2Regex: this.state.Param2Regex,
                Param3Regex: this.state.Param3Regex,
            };

            if (this.state.isEdit) {

                //call updateThirdpartyAPIResponse api
                this.props.updateThirdpartyAPIResponseBO({
                    Id: this.state.Id,
                    ...request
                });
            } else {

                //call addThirdpartyAPIResponse api
                this.props.addThirdpartyAPIResponseBO(request);
            }
        }
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* Set statusbar */}
                <CommonStatusBar />

                {/* Set Toolbar */}
                <CustomToolbar
                    title={this.state.title}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog ref={(component) => this.progressDialog = component} />

                {/* For Toast */}
                <CommonToast ref={(component) => this.toast = component} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingBottom: R.dimens.padding_top_bottom_margin,
                    paddingTop: R.dimens.padding_top_bottom_margin
                }}>

                    <View style={{ flex: 1, }}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* Inputfield for balanceRegex */}
                            <EditText
                                reference={input => { this.inputs['etBalanceRegex'] = input; }}
                                value={this.state.BalanceRegex}
                                header={R.strings.balanceRegex}
                                placeholder={R.strings.balanceRegex}
                                onChangeText={(text) => this.setState({ BalanceRegex: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etStatusMessageRegex'].focus() }} />

                            {/* Inputfield for StatusMsgRegex */}
                            <EditText
                                reference={input => { this.inputs['etStatusMessageRegex'] = input; }}
                                value={this.state.StatusMsgRegex}
                                header={R.strings.statusMessageRegex}
                                placeholder={R.strings.statusMessageRegex}
                                onChangeText={(text) => this.setState({ StatusMsgRegex: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etResponseCodeRegex'].focus() }} />

                            {/* Inputfield for responseCodeRegex */}
                            <EditText
                                reference={input => { this.inputs['etResponseCodeRegex'] = input; }}
                                value={this.state.ResponseCodeRegex}
                                header={R.strings.responseCodeRegex}
                                placeholder={R.strings.responseCodeRegex}
                                onChangeText={(text) => this.setState({ ResponseCodeRegex: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etErrorCodeRegex'].focus() }} />

                            {/* Inputfield for errorCodeRegex */}
                            <EditText
                                reference={input => { this.inputs['etErrorCodeRegex'] = input; }}
                                value={this.state.ErrorCodeRegex}
                                header={R.strings.errorCodeRegex}
                                placeholder={R.strings.errorCodeRegex}
                                onChangeText={(text) => this.setState({ ErrorCodeRegex: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etTrnRefNoRegex'].focus() }} />

                            {/* Inputfield for trnRefNoRegex */}
                            <EditText
                                reference={input => { this.inputs['etTrnRefNoRegex'] = input; }}
                                value={this.state.TrnRefNoRegex}
                                header={R.strings.trnRefNoRegex}
                                placeholder={R.strings.trnRefNoRegex}
                                onChangeText={(text) => this.setState({ TrnRefNoRegex: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etOpTrnRefNoRegex'].focus() }} />

                            {/* Inputfield for opTrnRefNoRegex */}
                            <EditText
                                reference={input => { this.inputs['etOpTrnRefNoRegex'] = input; }}
                                value={this.state.OprTrnRefNoRegex}
                                header={R.strings.opTrnRefNoRegex}
                                placeholder={R.strings.opTrnRefNoRegex}
                                onChangeText={(text) => this.setState({ OprTrnRefNoRegex: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etParam1Regex'].focus() }} />

                            {/* Inputfield for param1Regex */}
                            <EditText
                                reference={input => { this.inputs['etParam1Regex'] = input; }}
                                value={this.state.Param1Regex}
                                header={R.strings.param1Regex}
                                placeholder={R.strings.param1Regex}
                                onChangeText={(text) => this.setState({ Param1Regex: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etParam2Regex'].focus() }} />

                            {/* Inputfield for param2Regex */}
                            <EditText
                                reference={input => { this.inputs['etParam2Regex'] = input; }}
                                value={this.state.Param2Regex}
                                header={R.strings.param2Regex}
                                placeholder={R.strings.param2Regex}
                                onChangeText={(text) => this.setState({ Param2Regex: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etParam3Regex'].focus() }} />

                            {/* Inputfield for param3Regex */}
                            <EditText
                                reference={input => { this.inputs['etParam3Regex'] = input; }}
                                value={this.state.Param3Regex}
                                header={R.strings.param3Regex}
                                placeholder={R.strings.param3Regex}
                                onChangeText={(text) => this.setState({ Param3Regex: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etStatusRegex'].focus() }} />

                            {/* Inputfield for statusRegex */}
                            <EditText
                                reference={input => { this.inputs['etStatusRegex'] = input; }}
                                value={this.state.StatusRegex}
                                header={R.strings.statusRegex}
                                placeholder={R.strings.statusRegex}
                                onChangeText={(text) => this.setState({ StatusRegex: text })}
                                multiline={false}
                                returnKeyType={"done"} />
                        </ScrollView>
                    </View>

                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set submit Button */}
                        <Button title={R.strings.submit} onPress={this.onSumbit} />
                    </View>
                </View>

            </SafeView>
        );
    }
}

function mapStatToProps(state) {
    //Updated Data For thirdPartyAPIResponseBOReducer Data 
    return { data: state.thirdPartyAPIResponseBOReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform addThirdpartyAPIResponseBO Action 
        addThirdpartyAPIResponseBO: (payload) => dispatch(addThirdpartyAPIResponseBO(payload)),
        //Perform updateThirdpartyAPIResponseBO Action 
        updateThirdpartyAPIResponseBO: (payload) => dispatch(updateThirdpartyAPIResponseBO(payload)),
        //clear data
        cleanAddUpdateThirdPartyAPIResponse: () => dispatch(cleanAddUpdateThirdPartyResponse())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(AddThirdPartyAPIResponseScreen);