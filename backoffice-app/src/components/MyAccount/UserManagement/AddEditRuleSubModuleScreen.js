import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { changeTheme, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CommonToast from '../../../native_theme/components/CommonToast';
import EditText from '../../../native_theme/components/EditText';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import { addRuleSubModuleData, clearRuleSubModuleData, editRuleSubModuleData } from '../../../actions/account/UserManagementActions';
import { isInternet, validateResponseNew, isEmpty, validateGuId, isHtmlTag, isScriptTag, validateURL } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import SafeView from '../../../native_theme/components/SafeView';

class AddEditRuleSubModuleScreen extends Component {
    constructor(props) {
        super(props);
        let { item } = this.props.navigation.state.params

        if (item) {

            var oldCrudTypes
            if (item.CrudTypes === '0')
                oldCrudTypes = R.strings.Add
            else if (item.CrudTypes === '1')
                oldCrudTypes = R.strings.edit
            else if (item.CrudTypes === '2')
                oldCrudTypes = R.strings.Delete
            else if (item.CrudTypes === '3')
                oldCrudTypes = R.strings.list
            else if (item.CrudTypes === '4')
                oldCrudTypes = R.strings.remove
            else if (item.CrudTypes === '5')
                oldCrudTypes = R.strings.view
            else if (item.CrudTypes === '100')
                oldCrudTypes = R.strings.none
            else
                oldCrudTypes = R.strings.Please_Select

            var oldUtlilityTypes
            if (item.UtilityTypes === '0')
                oldUtlilityTypes = R.strings.export
            else if (item.UtilityTypes === '1')
                oldUtlilityTypes = R.strings.print
            else if (item.UtilityTypes === '2')
                oldUtlilityTypes = R.strings.import
            else if (item.UtilityTypes === '3')
                oldUtlilityTypes = R.strings.filter
            else if (item.UtilityTypes === '4')
                oldUtlilityTypes = R.strings.search
            else if (item.UtilityTypes === '100')
                oldUtlilityTypes = R.strings.none
            else
                oldUtlilityTypes = R.strings.Please_Select


            var oldType
            if (item.Type == 0)
                oldType = R.strings.main
            else if (item.Type == 1)
                oldType = R.strings.card
            else if (item.Type == 2)
                oldType = R.strings.list
            else if (item.Type == 3)
                oldType = R.strings.form
            else if (item.Type == 4)
                oldType = R.strings.chart
            else if (item.Type == 5)
                oldType = R.strings.slider
            else if (item.Type == 100)
                oldType = R.strings.none
            else
                oldType = R.strings.Please_Select
        }

        //define all initial state
        this.state = {
            item: item,
            isFirstTime: true,

            parentGuid: item !== undefined ? item.ParentGUID : '',
            Guid: item !== undefined ? item.GUID : '',
            SubModuleName: item !== undefined ? item.SubModuleName : '',
            SubModuleId: item !== undefined ? item.SubModuleID : 0,
            controller: item !== undefined ? (item.Controller !== null ? item.Controller : '') : '',
            methodName: item !== undefined ? (item.MethodName !== null ? item.MethodName : '') : '',
            path: item !== undefined ? (item.Path !== null ? item.Path : '') : '',

            Status: [
                { value: R.strings.select_status, code: '' },
                { value: R.strings.Active, code: 1 },
                { value: R.strings.Inactive, code: 0 },
            ],
            selectedStatus: item !== undefined ? (item.Status == 1 ? R.strings.Active : R.strings.Inactive) : R.strings.select_status,
            selectedStatusCode: item !== undefined ? item.Status : '',

            moduleDomainTypes: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.backoffice, code: 1 },
            ],
            selectedModuleDomainType: item !== undefined ? (item.ModuleDomainType == 1 ? R.strings.backoffice : R.strings.Please_Select) : R.strings.Please_Select,
            selectedModuleDomainTypeCode: item !== undefined ? item.ModuleDomainType : '',

            crudTypes: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Add, code: '0' },
                { value: R.strings.edit, code: '1' },
                { value: R.strings.Delete, code: '2' },
                { value: R.strings.list, code: '3' },
                { value: R.strings.remove, code: '4' },
                { value: R.strings.view, code: '5' },
                { value: R.strings.none, code: '100' },
            ],
            selectedCrudType: item !== undefined ? oldCrudTypes : R.strings.Please_Select,
            selectedCrudTypeCode: item !== undefined ? item.CrudTypes : '',

            utlilityTypes: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.export, code: '0' },
                { value: R.strings.print, code: '1' },
                { value: R.strings.import, code: '2' },
                { value: R.strings.filter, code: '3' },
                { value: R.strings.search, code: '4' },
                { value: R.strings.none, code: '100' },
            ],
            selectedUtilityType: item !== undefined ? oldUtlilityTypes : R.strings.Please_Select,
            selectedUtilityTypeCode: item !== undefined ? item.UtilityTypes : '',

            Types: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.main, code: 0 },
                { value: R.strings.Card, code: 1 },
                { value: R.strings.list, code: 2 },
                { value: R.strings.form, code: 3 },
                { value: R.strings.chart, code: 4 },
                { value: R.strings.slider, code: 5 },
                { value: R.strings.none, code: 100 },
            ],
            selectedType: item !== undefined ? oldType : R.strings.Please_Select,
            selectedTypeCode: item !== undefined ? item.Type : '',
        };

        //initial request
        this.Request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            AllRecords: 1
        }

        //create initial request
        this.toast = React.createRef();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentWillUnmount() {
        this.props.clearRuleSubModuleData()
    }

    onSubmitPress = async () => {
        // Check Validation
        if (isEmpty(this.state.parentGuid))
            this.toast.Show(R.strings.enter + " " + R.strings.parentGuid)
        else if (!validateGuId(this.state.parentGuid) || (this.state.parentGuid.length != 36))
            this.toast.Show(R.strings.enterValid + " " + R.strings.parentGuid)

        else if (isEmpty(this.state.Guid))
            this.toast.Show(R.strings.enter + " " + R.strings.guid)
        else if (!validateGuId(this.state.Guid) || (this.state.Guid.length != 36))
            this.toast.Show(R.strings.enterValid + " " + R.strings.guid)

        else if (isEmpty(this.state.SubModuleName))
            this.toast.Show(R.strings.EnterRuleSubModule)
        else if (isHtmlTag(this.state.SubModuleName))
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.subModuleName)
        else if (isScriptTag(this.state.SubModuleName))
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.subModuleName)

        else if (isHtmlTag(this.state.controller))
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.controller)
        else if (isScriptTag(this.state.controller))
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.controller)

        else if (isHtmlTag(this.state.methodName))
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.methodName)
        else if (isScriptTag(this.state.methodName))
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.methodName)

        else if (isHtmlTag(this.state.path))
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.path)
        else if (isScriptTag(this.state.path))
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.path)
        else if (this.state.path.length > 0 && !validateURL(this.state.path))
            this.toast.Show(R.strings.enterValid + " " + R.strings.path)

        else if (this.state.selectedStatus === R.strings.select_status)
            this.toast.Show(R.strings.select_status)

        else if (this.state.selectedModuleDomainTypeCode === R.strings.Please_Select)
            this.toast.Show(R.strings.select + " " + R.strings.moduleDomainType)

        else if (this.state.selectedCrudType === R.strings.Please_Select)
            this.toast.Show(R.strings.select + " " + R.strings.crudTypes)

        else if (this.state.selectedUtilityType === R.strings.Please_Select)
            this.toast.Show(R.strings.select + " " + R.strings.utilityTypes)

        else if (this.state.selectedType === R.strings.Please_Select)
            this.toast.Show(R.strings.select + " " + R.strings.types)

        else {
            //Check NetWork is Available or not
            if (await isInternet()) {
                let Req = {
                    SubModuleID: this.state.SubModuleId,
                    SubModuleName: this.state.SubModuleName,
                    Status: this.state.selectedStatusCode,
                    ParentGUID: this.state.parentGuid,
                    GUID: this.state.Guid,
                    Type: this.state.selectedTypeCode,
                    ModuleDomainType: this.state.selectedModuleDomainTypeCode,
                    MethodName: this.state.methodName,
                    Path: this.state.path,
                    Controller: this.state.controller,
                    UtilityTypes: this.state.selectedUtilityTypeCode,
                    CrudTypes: this.state.selectedCrudTypeCode,
                }

                if (this.state.item == undefined) {
                    // Add Rule Sub Module Api
                    this.props.addRuleSubModuleData(Req)
                } else if (this.state.item != undefined) {
                    // Edit Rule Sub Module Api
                    this.props.editRuleSubModuleData(Req)
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { AddRuleSubModuleData, EditRuleSubModuleData } = this.props.RuleModuleListResult

        if (AddRuleSubModuleData !== prevProps.RuleModuleListResult.AddRuleSubModuleData) {
            // AddRuleSubModuleData is not null
            if (AddRuleSubModuleData) {
                try {
                    if (this.state.AddRuleSubModuleData == null || (this.state.AddRuleSubModuleData != null && AddRuleSubModuleData !== this.state.AddRuleSubModuleData)) {
                        // Handle Response
                        if (validateResponseNew({ response: AddRuleSubModuleData })) {

                            this.setState({ AddRuleSubModuleData })

                            showAlert(R.strings.Success + '!', AddRuleSubModuleData.ReturnMsg, 0, () => {
                                this.props.clearRuleSubModuleData()
                                this.props.navigation.goBack()
                            })
                        } else {
                            this.props.clearRuleSubModuleData()
                            this.setState({ AddRuleSubModuleData: null })
                        }
                    }
                } catch (error) {
                    this.props.clearRuleSubModuleData()
                    this.setState({ AddRuleSubModuleData: null })
                }
            }
        }

        if (EditRuleSubModuleData !== prevProps.RuleModuleListResult.EditRuleSubModuleData) {
            // EditRuleSubModuleData is not null
            if (EditRuleSubModuleData) {
                try {
                    if (this.state.EditRuleSubModuleData == null || (this.state.EditRuleSubModuleData != null && EditRuleSubModuleData !== this.state.EditRuleSubModuleData)) {
                        if (validateResponseNew({ response: EditRuleSubModuleData })) {
                            // Handle Response
                            this.setState({ EditRuleSubModuleData })

                            showAlert(R.strings.Success + '!', EditRuleSubModuleData.ReturnMsg, 0, () => {
                                this.props.clearRuleSubModuleData()
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            this.props.clearRuleSubModuleData()
                            this.setState({ EditRuleSubModuleData: null })
                        }
                    }
                } catch (error) {
                    this.props.clearRuleSubModuleData()
                    this.setState({ EditRuleSubModuleData: null })
                }
            }
        }
    }

    render() {
        let { AddRuleSubModuleLoading, EditRuleSubModuleLoading } = this.props.RuleModuleListResult
        let toolbarTitle = this.state.item !== undefined ? R.strings.UpdateRuleSubModule : R.strings.AddRuleSubModule
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={toolbarTitle}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Progressbar */}
                <ProgressDialog isShow={AddRuleSubModuleLoading || EditRuleSubModuleLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Input of parentGuid */}
                            < EditText
                                isRequired={true}
                                header={R.strings.parentGuid}
                                placeholder={R.strings.parentGuid}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(item) => this.setState({ parentGuid: item })}
                                value={this.state.parentGuid}
                            />

                            {/* Input of Guid */}
                            < EditText
                                isRequired={true}
                                header={R.strings.guid}
                                placeholder={R.strings.guid}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(item) => this.setState({ Guid: item })}
                                value={this.state.Guid}
                            />

                            {/* Input of SubModuleName */}
                            < EditText
                                isRequired={true}
                                header={R.strings.SubModuleName}
                                placeholder={R.strings.SubModuleName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                maxLength={250}
                                onChangeText={(item) => this.setState({ SubModuleName: item })}
                                value={this.state.SubModuleName}
                            />

                            {/* Input of controller */}
                            < EditText
                                header={R.strings.controller}
                                placeholder={R.strings.controller}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(item) => this.setState({ controller: item })}
                                value={this.state.controller}
                            />

                            {/* Input of methodName */}
                            < EditText
                                header={R.strings.methodName}
                                placeholder={R.strings.methodName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(item) => this.setState({ methodName: item })}
                                value={this.state.methodName}
                            />

                            {/* Input of path */}
                            < EditText
                                header={R.strings.path}
                                placeholder={R.strings.path}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(item) => this.setState({ path: item })}
                                value={this.state.path}
                            />

                            {/* Select Module Status */}
                            <TitlePicker
                                isRequired={true}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                title={R.strings.Status}
                                array={this.state.Status}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, selectedStatusCode: object.code })} />

                            {/* Select moduleDomainTypes */}
                            <TitlePicker
                                isRequired={true}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                title={R.strings.moduleDomainType}
                                array={this.state.moduleDomainTypes}
                                selectedValue={this.state.selectedModuleDomainType}
                                onPickerSelect={(item, object) => this.setState({ selectedModuleDomainType: item, selectedModuleDomainTypeCode: object.code })} />

                            {/* Select crudTypes */}
                            <TitlePicker
                                isRequired={true}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                title={R.strings.crudTypes}
                                array={this.state.crudTypes}
                                selectedValue={this.state.selectedCrudType}
                                onPickerSelect={(item, object) => this.setState({ selectedCrudType: item, selectedCrudTypeCode: object.code })} />

                            {/* Select utilityTypes */}
                            <TitlePicker
                                isRequired={true}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                title={R.strings.utilityTypes}
                                array={this.state.utlilityTypes}
                                selectedValue={this.state.selectedUtilityType}
                                onPickerSelect={(item, object) => this.setState({ selectedUtilityType: item, selectedUtilityTypeCode: object.code })} />

                            {/* Select type */}
                            <TitlePicker
                                isRequired={true}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.margin_top_bottom }}
                                title={R.strings.types}
                                array={this.state.Types}
                                selectedValue={this.state.selectedType}
                                onPickerSelect={(item, object) => this.setState({ selectedType: item, selectedTypeCode: object.code })} />

                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={this.state.item !== undefined ? R.strings.update : R.strings.add} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

// return state from saga or reducer
const mapStateToProps = (state) => {
    return {
        RuleModuleListResult: state.RuleSubModuleReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Add Rule Sub module
    addRuleSubModuleData: (payload) => dispatch(addRuleSubModuleData(payload)),
    // Edit Rule Sub module
    editRuleSubModuleData: (payload) => dispatch(editRuleSubModuleData(payload)),
    // Clear Rule Sub module
    clearRuleSubModuleData: () => dispatch(clearRuleSubModuleData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditRuleSubModuleScreen);