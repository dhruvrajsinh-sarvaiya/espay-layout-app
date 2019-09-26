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
import { showAlert, changeTheme } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew, isHtmlTag, isScriptTag, validateAlphaNumericWithSpace, validateGuId } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { addRuleField, editRuleField, clearRuleFieldData } from '../../../actions/account/RuleFieldsAction';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit Transaction policy 
class AddEditRuleFieldScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //to chek whether user is from list screen or Dashboard Screen
        let fromDashboard = props.navigation.state.params && props.navigation.state.params.fromDashboard

        if (edit) {
            var OldaccessRight
            if (item.AccressRight == 0)
                OldaccessRight = R.strings.readOnly
            else if (item.AccressRight == 1)
                OldaccessRight = R.strings.write
            else
                OldaccessRight = R.strings.Please_Select

            var oldStatus
            if (item.Status == 0)
                oldStatus = R.strings.hideText
            else if (item.Status == 1)
                oldStatus = R.strings.showText
            else
                oldStatus = R.strings.Please_Select

            var oldRequired
            if (item.Required == 0)
                oldRequired = R.strings.no
            else if (item.Required == 1)
                oldRequired = R.strings.yes_text
            else
                oldRequired = R.strings.Please_Select
        }

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,
            fromDashboard: fromDashboard,

            isFirstTime: true,

            fieldName: edit ? item.FieldName : '',
            Guid: edit ? item.GUID : '',
            modulleGUID: edit ? item.ModulleGUID : '',

            accessRights: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.readOnly, code: 0 }, { value: R.strings.write, code: 1 }],
            selectedAccessRight: edit ? OldaccessRight : R.strings.Please_Select,
            selectedAccessRightCode: edit ? item.AccressRight : '',

            required: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.no, code: 0 }, { value: R.strings.yes_text, code: 1 }],
            selectedRequired: edit ? oldRequired : R.strings.Please_Select,
            selectedRequiredCode: edit ? item.Required : '',

            statuses: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.hideText, code: 0 }, { value: R.strings.showText, code: 1 }],
            selectedStatus: edit ? oldStatus : R.strings.Please_Select,
            selectedStatusCode: edit ? item.Status : '',
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { ruleFieldAddData, ruleFieldUpdateData, } = this.props.Listdata;

        if (ruleFieldAddData !== prevProps.Listdata.ruleFieldAddData) {
            // for show responce add
            if (ruleFieldAddData) {
                try {
                    if (validateResponseNew({
                        response: ruleFieldAddData,
                    })) {
                        showAlert(R.strings.Success, ruleFieldAddData.ReturnMsg, 0, () => {
                            this.props.clearRuleFieldData()
                            if (!this.state.fromDashboard) {
                                this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                                this.props.navigation.goBack()
                            }
                            else {
                                this.props.navigation.goBack()
                            }
                        });
                    } else {
                        this.props.clearRuleFieldData()
                    }
                } catch (e) {
                    this.props.clearRuleFieldData()
                }
            }
        }

        if (ruleFieldUpdateData !== prevProps.Listdata.ruleFieldUpdateData) {
            // for show responce update
            if (ruleFieldUpdateData) {
                try {
                    if (validateResponseNew({
                        response: ruleFieldUpdateData
                    })) {
                        showAlert(R.strings.Success, ruleFieldUpdateData.ReturnMsg, 0, () => {
                            this.props.clearRuleFieldData()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearRuleFieldData()
                    }
                } catch (e) {
                    this.props.clearRuleFieldData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onAddEditRulePress = async (Id) => {
        // Validations For Input Fields 
        if (isEmpty(this.state.fieldName)) {
            this.toast.Show(R.strings.enter + " " + R.strings.fieldName)
            return;
        }
        if (!validateAlphaNumericWithSpace(this.state.fieldName)) {
            this.toast.Show(R.strings.fieldName + " " + R.strings.containsOnlyLettersAndNumbers)
            return;
        }
        if (this.state.fieldName.length < 2 || this.state.fieldName.length > 30) {
            this.toast.Show(R.strings.fieldName + " " + R.strings.lengthShouldBeBetween2to30)
            return;
        }
        if (isHtmlTag(this.state.fieldName)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.fieldName)
            return;
        }
        if (isScriptTag(this.state.fieldName)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.fieldName)
            return;
        }
        if (isEmpty(this.state.Guid)) {
            this.toast.Show(R.strings.enter + " " + R.strings.guid)
            return;
        }
        if (!validateGuId(this.state.Guid)) {
            this.toast.Show(R.strings.enterValid + " " + R.strings.guid)
            return;
        }
        if (isEmpty(this.state.modulleGUID)) {
            this.toast.Show(R.strings.enter + " " + R.strings.moduleGuid)
            return;
        }
        if (!validateGuId(this.state.modulleGUID)) {
            this.toast.Show(R.strings.enterValid + " " + R.strings.moduleGuid)
            return;
        }
        if (this.state.selectedAccessRight === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select + " " + R.strings.accessRight)
            return;
        }
        if (this.state.selectedRequired === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select + " " + R.strings.required)
            return;
        }
        if (this.state.selectedStatus === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select + " " + R.strings.status)
            return;
        }

        Keyboard.dismiss();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                ModulleGUID: this.state.modulleGUID,
                FieldID: 0,
                FieldName: this.state.fieldName,
                Status: this.state.selectedStatusCode,
                Required: this.state.selectedRequiredCode,
                AccressRight: this.state.selectedAccessRightCode,
                GUID: this.state.Guid
            }
            if (this.state.edit) {
                this.request = {
                    ...this.request,
                    FieldID: this.state.item.FieldID,
                }

                //call editRuleField api
                this.props.editRuleField(this.request)
            }
            else {

                //call addRuleField api
                this.props.addRuleField(this.request)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        const { ruleFieldAddLoading, ruleFieldUpdateLoading, subModuleLoading } = this.props.Listdata;
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateRuleField : R.strings.addRuleField}
                    isBack={true}
                    nav={this.props.navigation}

                />
                {/* Progress Dialog */}
                <ProgressDialog isShow={ruleFieldAddLoading || ruleFieldUpdateLoading || subModuleLoading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                }}>

                    <View style={{ flex: 1 }}>
                        {/* Display Data in scrollview */}
                        <ScrollView showsVerticalScrollIndicator={false} >

                            {/* EditText for fieldName */}
                            <EditText
                                style={{ marginTop: R.dimens.widget_top_bottom_margin + R.dimens.CardViewElivation }}
                                isRequired={true}
                                header={R.strings.fieldName}
                                placeholder={R.strings.fieldName}
                                maxLength={30}
                                onChangeText={(text) => this.setState({ fieldName: text })}
                                value={this.state.fieldName}
                                keyboardType={'default'}
                            />

                            {/* Input of Guid */}
                            <EditText
                                isRequired={true}
                                header={R.strings.guid}
                                placeholder={R.strings.guid}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(item) => this.setState({ Guid: item })}
                                value={this.state.Guid}
                            />

                            {/* Input of moduleGuid */}
                            <EditText
                                isRequired={true}
                                header={R.strings.moduleGuid}
                                placeholder={R.strings.moduleGuid}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(item) => this.setState({ modulleGUID: item })}
                                value={this.state.modulleGUID}
                            />

                            {/* dropdown for accessRight */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                //    headerStyle={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                pickerStyle={{
                                    borderWidth: 0,
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                title={R.strings.accessRight}
                                array={this.state.accessRights}
                                selectedValue={this.state.selectedAccessRight}
                                onPickerSelect={(item, object) => this.setState({ selectedAccessRight: item, selectedAccessRightCode: object.code })} />

                            {/* dropdown for required */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                //    headerStyle={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                pickerStyle={{
                                    borderWidth: 0,
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                title={R.strings.required}
                                array={this.state.required}
                                selectedValue={this.state.selectedRequired}
                                onPickerSelect={(item, object) => this.setState({ selectedRequired: item, selectedRequiredCode: object.code })} />

                            {/* dropdown for status */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    borderWidth: 0,
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                title={R.strings.Status}
                                array={this.state.statuses}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, selectedStatusCode: object.code })} />
                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button
                            title={this.state.edit ? R.strings.update : R.strings.Add}
                            onPress={() => this.onAddEditRulePress(this.state.edit ? this.state.item.Id : null)} />
                    </View>
                </View>
            </SafeView>

        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data rule fields 
        Listdata: state.RuleFieldsBoReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //perform action addRuleField
        addRuleField: (add) => dispatch(addRuleField(add)),
        //perform action editRuleField 
        editRuleField: (edit) => dispatch(editRuleField(edit)),
        //perform action clearRuleFieldData
        clearRuleFieldData: () => dispatch(clearRuleFieldData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditRuleFieldScreen)