import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import Button from '../../../native_theme/components/Button';
import EditText from '../../../native_theme/components/EditText';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getGroupList, addUserData, clearUserData, editUserData } from '../../../actions/account/UserManagementActions';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, isEmpty, validateMobileNumber, validatePassword } from '../../../validations/CommonValidation';
import { CheckEmailValidation } from '../../../validations/EmailValidation';
import SafeView from '../../../native_theme/components/SafeView';

export class AddEditUserScreen extends Component {
    constructor(props) {
        super(props);

        let { item } = props.navigation.state.params

        let statusText = ''

        if (item) {
            if (item.Status == 0)
                statusText = R.strings.inActive
            else if (item.Status == 1)
                statusText = R.strings.Active
            else if (item.Status == 2)
                statusText = R.strings.Confirmed
            else if (item.Status == 3)
                statusText = R.strings.Unconfirmed
            else
                statusText = R.strings.select_status
            /*  else if (item.Status == 4)
                 statusText = R.strings.Unassigned
             else if (item.Status == 5)
                 statusText = R.strings.Suspended
             else if (item.Status == 6)
                 statusText = R.strings.Blocked
             else if (item.Status == 7)
                 statusText = R.strings.ReqDeleted
             else if (item.Status == 8)
                 statusText = R.strings.Suspicious
             else if (item.Status == 9)
                 statusText = R.strings.Delete
             else if (item.Status == 10)
                 statusText = R.strings.PolicyViolated */
        }

        // Define all initial state
        this.state = {
            UserId: item !== undefined ? item.UserId : 0,
            RoleId: item !== undefined ? item.RoleId : 0,
            isEdit: item !== undefined ? true : false,
            UserName: item !== undefined ? item.UserName : '',
            FirstName: item !== undefined ? item.FirstName : '',
            LastName: item !== undefined ? item.LastName : '',
            Email: item !== undefined ? item.Email : '',
            MobileNo: item !== undefined ? item.Mobile : '',

            GroupIdArray: [],
            GroupId: item !== undefined ? item.GroupID : 0,
            selectedGroupId: item !== undefined ? item.PermissionGroup : R.strings.SelectGroup,

            Password: '',
            ConfirmPassword: '',
            Status: [
                { value: R.strings.select_status },
                { code: 0, value: R.strings.inActive },
                { code: 1, value: R.strings.Active },
                { code: 2, value: R.strings.Confirmed },
                { code: 3, value: R.strings.Unconfirmed },
                /*  { code: 4, value: R.strings.Unassigned },
                 { code: 5, value: R.strings.Suspended },
                 { code: 6, value: R.strings.Blocked },
                 { code: 7, value: R.strings.ReqDeleted },
                 { code: 8, value: R.strings.Suspicious },
                 { code: 9, value: R.strings.Delete },
                 { code: 10, value: R.strings.PolicyViolated }, */
            ],
            selectedStatus: item !== undefined ? statusText : R.strings.select_status,
            StatusId: item !== undefined ? item.Status : 0,

            userTypes: [
                { code: 0, value: R.strings.User },
                { code: 1, value: R.strings.Admin },
            ],
            selectedUserType: item !== undefined ? (item.IsAdmin == 1 ? R.strings.Admin : R.strings.user) : R.strings.user,
            selectedUserTypeCode: item !== undefined ? item.IsAdmin : 0,

            lockStatuses: [
                { code: 0, value: R.strings.no },
                { code: 1, value: R.strings.yes_text },
            ],
            selectedLockStatus: item !== undefined ? (item.IsLockOut == 1 ? R.strings.yes_text : R.strings.no) : R.strings.no,
            selectedLockStatusCode: item !== undefined ? item.IsLockOut : 0,

            twoFaStatuses: [
                { code: 0, value: R.strings.Disable },
                { code: 1, value: R.strings.Enable },
            ],
            selectedTwoFaStatus: item !== undefined ? (item.TwoFactorEnabled == 1 ? R.strings.Enable : R.strings.Disable) : R.strings.Disable,
            selectedTwoFaStatusCode: item !== undefined ? item.TwoFactorEnabled : 0,

            isFirstTime: true,
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
            // Call Group List Api
            this.props.getGroupList()
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    //To Validate Mobile Number
    validateMobileNumber = (MobileNumber) => {
        if (validateMobileNumber(MobileNumber)) {
            this.setState({ MobileNo: MobileNumber })
        }
    }

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    onAddEditPress = async () => {

        // check validation
        if (isEmpty(this.state.UserName))
            this.toast.Show(R.strings.enterUserName)
        else if (isEmpty(this.state.FirstName))
            this.toast.Show(R.strings.enterFirstName)
        else if (isEmpty(this.state.LastName))
            this.toast.Show(R.strings.enterLastName)
        else if (isEmpty(this.state.Email))
            this.toast.Show(R.strings.enterEmail)
        else if (CheckEmailValidation(this.state.Email))
            this.toast.Show(R.strings.Enter_Valid_Email);
        else if (isEmpty(this.state.MobileNo))
            this.toast.Show(R.strings.Enter_mobile_no)
        else if (this.state.selectedGroupId === R.strings.SelectGroup)
            this.toast.Show(R.strings.SelectGroup);

        else if (!this.state.isEdit && isEmpty(this.state.Password))
            this.toast.Show(R.strings.enterPasswordMsg)
        //To Check Password length is 10 or not
        else if (!this.state.isEdit && this.state.Password.length < 6)
            this.toast.Show(R.strings.password_length_validate);
        //To Check Password Validation
        else if (!this.state.isEdit && !validatePassword(this.state.Password))
            this.toast.Show(R.strings.Strong_Password_Validation)
        else if (!this.state.isEdit && isEmpty(this.state.ConfirmPassword))
            this.toast.Show(R.strings.confirm_password_validate)
        else if (!this.state.isEdit && this.state.Password != this.state.ConfirmPassword)
            this.toast.Show(R.strings.password_match_validate);

        else if (this.state.selectedStatus === R.strings.select_status)
            this.toast.Show(R.strings.select_status);

        else {
            // check internet connection
            if (await isInternet()) {
                this.request = {
                    Firstname: this.state.FirstName,
                    Lastname: this.state.LastName,
                    Status: this.state.StatusId,
                    GroupID: this.state.GroupId,
                    IsAdmin: this.state.selectedUserTypeCode,
                }

                if (this.state.isEdit) {
                    this.request = {
                        ...this.request,
                        UserId: this.state.UserId,
                        RoleId: this.state.RoleId,
                        TwoFactorEnabled: this.state.selectedTwoFaStatusCode,
                        IsLockOut: this.state.selectedLockStatusCode,
                    }

                    // Edit User Api Call
                    this.props.editUserData(this.request)
                }
                else {
                    this.request = {
                        ...this.request,
                        Username: this.state.UserName,
                        Email: this.state.Email,
                        Password: this.state.Password,
                        Mobile: this.state.MobileNo,
                        PreferedLanguage: R.strings.getLanguage(),
                    }

                    // Add User Api Call
                    this.props.addUserData(this.request)
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
        if (AddEditUserScreen.oldProps !== props) {
            AddEditUserScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { GroupListData, } = props.UsersListResult;

            //To Check  Data Fetch or Not
            if (GroupListData) {
                try {
                    if (state.GroupListData == null || (state.GroupListData != null && GroupListData !== state.GroupListData)) {

                        //succcess response fill the list 
                        if (validateResponseNew({ response: GroupListData, isList: true })) {

                            let res = parseArray(GroupListData.GroupListData)

                            // Select GroupName Column from whole list
                            for (var groupNameKey in res) {
                                let item = res[groupNameKey]
                                item.value = item.GroupName
                            }

                            let groupNameItem = [
                                { value: R.strings.SelectGroup },
                                ...res
                            ];

                            return Object.assign({}, state, {
                                GroupListData,
                                GroupIdArray: groupNameItem,
                                refreshing: false,
                            })

                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                GroupListData: null,
                                refreshing: false,
                                GroupIdArray: [],
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        GroupListData: null,
                        refreshing: false,
                        GroupIdArray: [],
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { AddUserRespone, EditUserResponse } = this.props.UsersListResult

        // check previous props and existing props
        if (AddUserRespone !== prevProps.UsersListResult.AddUserRespone) {
            // AddUserRespone is not null
            if (AddUserRespone) {
                try {

                    // Handle Response
                    if (validateResponseNew({ response: AddUserRespone })) {
                        showAlert(R.strings.status, AddUserRespone.ReturnMsg, 0, () => {
                            this.props.clearUserData()
                            this.props.navigation.goBack()
                        })
                    } else {
                        this.props.clearUserData()
                    }
                } catch (error) {
                    this.props.clearUserData()
                }
            }
        }

        // check previous props and existing props
        if (EditUserResponse !== prevProps.UsersListResult.EditUserResponse) {
            // EditUserResponse is not null
            if (EditUserResponse) {
                try {
                    // Handle Response
                    if (validateResponseNew({ response: EditUserResponse })) {
                        showAlert(R.strings.status, EditUserResponse.ReturnMsg, 0, () => {
                            this.props.clearUserData()
                            this.props.navigation.state.params.onRefresh(true)
                            this.props.navigation.goBack()
                        })
                    } else {
                        this.props.clearUserData()
                    }
                } catch (error) {
                    this.props.clearUserData()
                }
            }
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { GroupListLoading, AddUserLoading, EditUserLoading } = this.props.UsersListResult;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.isEdit ? R.strings.UpdateUser : R.strings.AddUser}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Progress bar */}
                <ProgressDialog isShow={GroupListLoading || AddUserLoading || EditUserLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Input of User Name */}
                            <EditText
                                header={R.strings.UserName}
                                placeholder={R.strings.UserName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                maxLength={50}
                                onChangeText={(item) => this.setState({ UserName: item })}
                                value={this.state.UserName}
                                reference={input => { this.inputs['etUserName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etFirstName') }}
                                editable={this.state.isEdit ? false : true}
                            />

                            {/* Input of First Name */}
                            <EditText
                                header={R.strings.firstName}
                                placeholder={R.strings.firstName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                maxLength={50}
                                onChangeText={(item) => this.setState({ FirstName: item })}
                                value={this.state.FirstName}
                                reference={input => { this.inputs['etFirstName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etLastName') }}
                            />

                            {/* Input of Last Name */}
                            <EditText
                                header={R.strings.lastName}
                                placeholder={R.strings.lastName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                maxLength={50}
                                onChangeText={(item) => this.setState({ LastName: item })}
                                value={this.state.LastName}
                                reference={input => { this.inputs['etLastName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etEmail') }}
                            />

                            {/* Input of Email */}
                            <EditText
                                header={R.strings.email}
                                placeholder={R.strings.email}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                maxLength={50}
                                onChangeText={(item) => this.setState({ Email: item })}
                                value={this.state.Email}
                                reference={input => { this.inputs['etEmail'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etMobileNo') }}
                                editable={this.state.isEdit ? false : true}
                            />

                            {/* Input of Mobile */}
                            <EditText
                                header={R.strings.MobileNo}
                                placeholder={R.strings.MobileNo}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                maxLength={10}
                                onChangeText={(MobileNumber) => this.validateMobileNumber(MobileNumber)}
                                value={this.state.MobileNo}
                                reference={input => { this.inputs['etMobileNo'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etPassword') }}
                                editable={this.state.isEdit ? false : true}
                            />

                            {/* Picker for UserType */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.UserType}
                                array={this.state.userTypes}
                                selectedValue={this.state.selectedUserType}
                                onPickerSelect={(item, object) => this.setState({ selectedUserType: item, selectedUserTypeCode: object.code })} />

                            {/* Picker for lockUser */}
                            {
                                this.state.isEdit &&
                                <TitlePicker
                                    style={{ marginTop: R.dimens.margin }}
                                    title={R.strings.lockUser}
                                    array={this.state.lockStatuses}
                                    selectedValue={this.state.selectedLockStatus}
                                    onPickerSelect={(item, object) => this.setState({ selectedLockStatus: item, selectedLockStatusCode: object.code })} />
                            }

                            {/* Picker for twoFaStatuses */}
                            {
                                this.state.isEdit &&
                                <TitlePicker
                                    style={{ marginTop: R.dimens.margin }}
                                    title={R.strings.twoFa_status}
                                    array={this.state.twoFaStatuses}
                                    selectedValue={this.state.selectedTwoFaStatus}
                                    onPickerSelect={(item, object) => this.setState({ selectedTwoFaStatus: item, selectedTwoFaStatusCode: object.code })} />
                            }

                            {/* Picker for Group Id */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.GroupId}
                                array={this.state.GroupIdArray}
                                selectedValue={this.state.selectedGroupId}
                                onPickerSelect={(item, object) => this.setState({ selectedGroupId: item, GroupId: object.GroupID })} />

                            {/* Input of Password */}
                            {
                                !this.state.isEdit &&
                                <View>
                                    <EditText
                                        header={R.strings.Password}
                                        placeholder={R.strings.Password}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        secureTextEntry={true}
                                        maxLength={50}
                                        onChangeText={(item) => this.setState({ Password: item })}
                                        value={this.state.Password}
                                        reference={input => { this.inputs['etPassword'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('etConfirmPassword') }}
                                    />

                                    {/* Input of Confirm Password */}
                                    <EditText
                                        header={R.strings.Confirm_Password}
                                        placeholder={R.strings.Confirm_Password}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"done"}
                                        secureTextEntry={true}
                                        maxLength={50}
                                        onChangeText={(item) => this.setState({ ConfirmPassword: item })}
                                        value={this.state.ConfirmPassword}
                                        reference={input => { this.inputs['etConfirmPassword'] = input; }}
                                    />
                                </View>
                            }

                            {/* Picker for Status */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin, marginBottom: R.dimens.margin_top_bottom }}
                                title={R.strings.Status}
                                array={this.state.Status}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, StatusId: object.code })} />
                        </View>

                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={this.state.isEdit ? R.strings.update : R.strings.add}
                            onPress={this.onAddEditPress}>
                        </Button>
                    </View>
                </View>
            </SafeView >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get updated data from reducer
        UsersListResult: state.UserListReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // To Perform Group List Action
    getGroupList: () => dispatch(getGroupList()),
    // To Add User Data Action
    addUserData: (payload) => dispatch(addUserData(payload)),
    // To Add User Data Action
    editUserData: (payload) => dispatch(editUserData(payload)),
    // To Clear USer Data Action
    clearUserData: () => dispatch(clearUserData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEditUserScreen);