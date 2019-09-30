import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CommonToast from '../../../native_theme/components/CommonToast';
import EditText from '../../../native_theme/components/EditText';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import { getRuleSubModuleList, addRuleToolData, editRuleToolData, clearRuleToolModuleData } from '../../../actions/account/UserManagementActions';
import { AppConfig } from '../../../controllers/AppConfig';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import SafeView from '../../../native_theme/components/SafeView';

export class AddEditRuleToolModuleScreen extends Component {
    constructor(props) {
        super(props)
        let { item } = props.navigation.state.params

        // Define all initial state
        this.state = {
            SubModuleName: [],
            selectedSubModule: R.strings.SelectSubModule,
            ToolName: item !== undefined ? item.ToolName : '',
            SubModuleId: item !== undefined ? item.SubModuleID : 0,
            ToolId: item !== undefined ? item.ToolID : 0,
            isEdit: item !== undefined ? true : false,
            isFirstTime: true,
            Status: [
                { value: R.strings.select_status },
                { value: R.strings.Active },
                { value: R.strings.Inactive },
            ],
            selectedStatus: item !== undefined ? (item.Status == 1 ? R.strings.Active : R.strings.Inactive) : R.strings.select_status,
        }

        this.inputs = {}
        // Create reference
        this.toast = React.createRef();
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check internet connection
        if (await isInternet()) {

            let req = {
                PageNo: 0,
                PageSize: AppConfig.pageSize,
                AllRecords: 1,
            }

            // Call Rule Sub Module List
            this.props.getRuleSubModuleList(req)
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    onSubmitPress = async () => {
        // ModuleName and Status validation
        if (this.state.selectedSubModule === R.strings.SelectSubModule)
            this.toast.Show(R.strings.SelectSubModule)
        else if (isEmpty(this.state.ToolName))
            this.toast.Show(R.strings.EnterToolName)
        else {

            let flag = true
            if (this.state.isEdit) {
                if (this.state.selectedStatus === R.strings.select_status) {
                    flag = false
                    this.toast.Show(R.strings.select_status)
                }
            }

            if (flag) {
                // Check internet connection
                if (await isInternet()) {
                    // Common Request for Add and Edit Rule Module
                    let req = {
                        SubModuleID: this.state.SubModuleId,
                        ToolID: this.state.ToolId,
                        ToolName: this.state.ToolName,
                        Status: this.state.selectedStatus !== R.strings.select_status ? 1 : 0
                    }

                    if (this.state.isEdit) {
                        // Edit Rule Tool Module Api Call
                        this.props.editRuleToolData(req)

                    } else {
                        // Add Rule Tool Module Api Call
                        this.props.addRuleToolData(req)
                    }
                }
            }
        }
    }

    componentDidUpdate(prevProps, _prevState) {

        //Get All Updated field of Particular actions
        const { AddRuleToolData, EditRuleToolData } = this.props.RuleModuleListResult

        if (AddRuleToolData !== prevProps.RuleModuleListResult.AddRuleToolData) {
            // AddRuleToolData is not null
            if (AddRuleToolData) {
                try {
                    if (this.state.AddRuleToolData == null || (this.state.AddRuleToolData != null && AddRuleToolData !== this.state.AddRuleToolData)) {
                        // Handle Response
                        if (validateResponseNew({ response: AddRuleToolData })) {
                            showAlert(R.strings.Success + '!', AddRuleToolData.ReturnMsg, 0, () => {
                                this.props.clearRuleToolModuleData()
                                this.props.navigation.goBack()
                            })
                            this.setState({ AddRuleToolData })
                        } else {
                            this.props.clearRuleToolModuleData()
                            this.setState({ AddRuleToolData: null })
                        }
                    }
                } catch (error) {
                    this.props.clearRuleToolModuleData()
                    this.setState({ AddRuleToolData: null })
                }
            }
        }

        if (EditRuleToolData !== prevProps.RuleModuleListResult.EditRuleToolData) {
            // AddRuleToolData is not null
            if (EditRuleToolData) {
                try {
                    if (this.state.EditRuleToolData == null || (this.state.EditRuleToolData != null && EditRuleToolData !== this.state.EditRuleToolData)) {
                        // Handle Response
                        if (validateResponseNew({ response: EditRuleToolData })) {

                            showAlert(R.strings.Success + '!', EditRuleToolData.ReturnMsg, 0, () => {
                                this.props.clearRuleToolModuleData()
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })

                            this.setState({ EditRuleToolData })
                        } else {
                            this.props.clearRuleToolModuleData()
                            this.setState({ EditRuleToolData: null })
                        }
                    }
                } catch (error) {
                    this.props.clearRuleToolModuleData()
                    this.setState({ EditRuleToolData: null })
                }
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
        if (AddEditRuleToolModuleScreen.oldProps !== props) {
            AddEditRuleToolModuleScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { RuleSubModuleListData } = props.RuleModuleListResult

            // RuleSubModuleListData is not null
            if (RuleSubModuleListData) {
                try {
                    if (state.RuleSubModuleListData == null || (state.RuleSubModuleListData != null && RuleSubModuleListData !== state.RuleSubModuleListData)) {
                        if (validateResponseNew({ response: RuleSubModuleListData, isList: true })) {

                            // Store Api Response Field and display in Screen.
                            let res = parseArray(RuleSubModuleListData.Result);

                            let result = res, subModule = R.strings.SelectSubModule
                            if (state.isEdit) {

                                for (var ruleSubModuleKey in result) {
                                    let item = result[ruleSubModuleKey]
                                    if (item.SubModuleID == state.SubModuleId)
                                        subModule = item.SubModuleName
                                }
                            }

                            // Select Sub Module Name Column from whole list
                            for (var dataItemRes in res) {
                                let item = res[dataItemRes]
                                item.value = item.SubModuleName
                            }

                            let subModuleItem = [
                                { value: R.strings.SelectSubModule },
                                ...res
                            ];

                            return { ...state, RuleSubModuleListData, SubModuleName: subModuleItem, selectedSubModule: subModule }
                        } else {
                            return { ...state, RuleSubModuleListData: null, SubModuleName: [] }
                        }
                    }
                } catch (error) {
                    return { ...state, RuleSubModuleListData: null, SubModuleName: [] }
                }
            }
        }

        return null
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { RuleSubModuleListLoading, AddRuleToolLoading, EditRuleToolLoading } = this.props.RuleModuleListResult;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.isEdit ? R.strings.UpdateRuleTool : R.strings.AddRuleTool}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Progress bar */}
                <ProgressDialog isShow={RuleSubModuleListLoading || AddRuleToolLoading || EditRuleToolLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Picker for Sub Module */}
                            <TitlePicker
                                title={R.strings.SubModuleName}
                                array={this.state.SubModuleName}
                                selectedValue={this.state.selectedSubModule}
                                onPickerSelect={(item, object) => this.setState({ selectedSubModule: item, SubModuleId: object.SubModuleID })} />

                            {/* Input of Tool Name */}
                            <EditText
                                header={R.strings.ToolName}
                                placeholder={R.strings.ToolName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={'done'}
                                maxLength={250}
                                onChangeText={(item) => this.setState({ ToolName: item })}
                                value={this.state.ToolName}
                            />

                            {/* dropdown for status */}
                            {
                                this.state.isEdit &&
                                <TitlePicker
                                    style={{ marginTop: R.dimens.margin }}
                                    title={R.strings.Status}
                                    array={this.state.Status}
                                    selectedValue={this.state.selectedStatus}
                                    onPickerSelect={(item) => this.setState({ selectedStatus: item })} />
                            }
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={this.state.isEdit ? R.strings.update : R.strings.add} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get updated data from reducer
        RuleModuleListResult: state.UserManagementReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // To Perform Rule Sub Module List Action
    getRuleSubModuleList: (payload) => dispatch(getRuleSubModuleList(payload)),
    // To Perform Add Rule Sub Module Data Action
    addRuleToolData: (payload) => dispatch(addRuleToolData(payload)),
    // To Perform Edit Rule Sub Module Data Action
    editRuleToolData: (payload) => dispatch(editRuleToolData(payload)),
    // To clear Rule Tool Data Action
    clearRuleToolModuleData: (payload) => dispatch(clearRuleToolModuleData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEditRuleToolModuleScreen);