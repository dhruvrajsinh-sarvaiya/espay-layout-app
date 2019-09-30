import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CommonToast from '../../../native_theme/components/CommonToast';
import EditText from '../../../native_theme/components/EditText';
import { changeTheme, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import Button from '../../../native_theme/components/Button';
import { clearRoleModuleData, addRoleModuleData, editRoleModuleData } from '../../../actions/account/UserManagementActions';
import { connect } from 'react-redux';
import SafeView from '../../../native_theme/components/SafeView';

class AddEditRoleModuleScreen extends Component {
    constructor(props) {
        super(props);
        let { item } = props.navigation.state.params
        let status = ''

        //set status based on status code from list screen for edit
        if (item !== undefined) {
            if (item.Status == 1)
                status = R.strings.Active
            else if (item.Status == 0)
                status = R.strings.Inactive
            else if (item.Status == 9)
                status = R.strings.select_status
        }

        //define all initial state
        this.state = {
            RoleId: item !== undefined ? item.RoleID : 0,
            RoleName: item !== undefined ? item.RoleName : '',
            RoleDescription: item !== undefined ? item.RoleDescription : '',
            Status: [
                { value: R.strings.select_status },
                { value: R.strings.Active },
                { value: R.strings.Inactive },
            ],
            selectedStatus: item !== undefined ? status : R.strings.select_status,
            item: item,
        };

        //create reference
        this.inputs = {}
        this.toast = React.createRef();
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    // Call when user press on add/edit button
    onSubmitPress = async () => {

        //input validations 
        if (isEmpty(this.state.RoleName))
            this.toast.Show(R.strings.EnterRoleName)
        else if (isEmpty(this.state.RoleDescription))
            this.toast.Show(R.strings.EnterRoleDesc)
        else if (this.state.selectedStatus === R.strings.select_status)
            this.toast.Show(R.strings.select_status)
        else {
            // Check internet connection
            if (await isInternet()) {
                // Common Request for Add and Edit Role Module
                let req = {
                    RoleId: this.state.RoleId,
                    RoleName: this.state.RoleName,
                    RoleDescription: this.state.RoleDescription,
                    Status: this.state.selectedStatus === R.strings.Active ? 1 : 0
                }

                if (this.state.item != undefined) {

                    // Edit Role Module Data Api Call 
                    this.props.editRoleModuleData(req)
                } else {

                    // Add Role Module Data Api Call 
                    this.props.addRoleModuleData(req)
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //Get All Updated field of Particular actions
        const { AddRoleModuleData, EditRoleModuleData } = this.props.AddRoleModuleResult

        // check previous props and existing props
        if (AddRoleModuleData !== prevProps.AddRoleModuleResult.AddRoleModuleData) {
            // AddRoleModuleData is not null
            if (AddRoleModuleData) {
                try {
                    if (this.state.AddRoleModuleData == null || (this.state.AddRoleModuleData != null && AddRoleModuleData !== this.state.AddRoleModuleData)) {
                        // Handle Response
                        if (validateResponseNew({ response: AddRoleModuleData })) {

                            this.setState({ AddRoleModuleData })

                            showAlert(R.strings.Success + '!', AddRoleModuleData.ReturnMsg, 0, () => {
                                //clear data
                                this.props.clearRoleModuleData()
                                this.props.navigation.goBack()
                            })
                        } else {
                            //clear data
                            this.props.clearRoleModuleData()
                            this.setState({ AddRoleModuleData: null })
                        }
                    }
                } catch (error) {
                    //clear data
                    this.props.clearRoleModuleData()
                    this.setState({ AddRoleModuleData: null })
                }
            }
        }

        // check previous props and existing props
        if (EditRoleModuleData !== prevProps.AddRoleModuleResult.EditRoleModuleData) {
            // EditRoleModuleData is not null
            if (EditRoleModuleData) {
                try {
                    if (this.state.EditRoleModuleData == null || (this.state.EditRoleModuleData != null && EditRoleModuleData !== this.state.EditRoleModuleData)) {
                        if (validateResponseNew({ response: EditRoleModuleData })) {
                            this.setState({ EditRoleModuleData })
                            // Handle Response                        
                            showAlert(R.strings.status, EditRoleModuleData.ReturnMsg, 0, () => {
                                //clear data
                                this.props.clearRoleModuleData()
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            //clear data
                            this.props.clearRoleModuleData()
                            this.setState({ EditRoleModuleData })
                        }
                    }
                } catch (error) {

                }
            }
        }
    }

    render() {
        let { AddRoleModuleLoading, EditRoleModuleLoading } = this.props.AddRoleModuleResult
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.item != undefined ? R.strings.UpdateRole : R.strings.AddRole}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Progressbar */}
                <ProgressDialog isShow={AddRoleModuleLoading || EditRoleModuleLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Input of Role Name */}
                            <EditText
                                header={R.strings.RoleName}
                                placeholder={R.strings.EnterRoleName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                maxLength={250}
                                onChangeText={(item) => this.setState({ RoleName: item })}
                                value={this.state.RoleName}
                                reference={input => { this.inputs['etRoleName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etRoleDescription') }}
                            />

                            {/* Input of Description */}
                            <EditText
                                header={R.strings.RoleDescription}
                                placeholder={R.strings.EnterRoleDesc}
                                multiline={true}
                                keyboardType='default'
                                textAlignVertical='top'
                                returnKeyType={"done"}
                                numberOfLines={4}
                                maxLength={250}
                                onChangeText={(item) => this.setState({ RoleDescription: item })}
                                value={this.state.RoleDescription}
                                reference={input => { this.inputs['etRoleDescription'] = input; }}
                            />

                            {/* dropdown for status */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.Status}
                                array={this.state.Status}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(item) => this.setState({ selectedStatus: item })} />
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={this.state.item != undefined ? R.strings.update : R.strings.add} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

// return state from saga or reducer
const mapStateToProps = (state) => {
    return {
        AddRoleModuleResult: state.RoleModuleReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //Perform addRoleModuleData action
    addRoleModuleData: (payload) => dispatch(addRoleModuleData(payload)),
    //Perform editRoleModuleData action
    editRoleModuleData: (payload) => dispatch(editRoleModuleData(payload)),
    // Clear Role Module Data
    clearRoleModuleData: () => dispatch(clearRoleModuleData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditRoleModuleScreen);