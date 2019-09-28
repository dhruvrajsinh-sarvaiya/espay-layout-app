import R from "../../../native_theme/R";
import TextCard from "../../../native_theme/components/TextCard";
import { isInternet, validateResponseNew, validateValue } from "../../../validations/CommonValidation";
import { Component } from "react";
import CustomToolbar from "../../../native_theme/components/CustomToolbar";
import React from "react";
import SafeView from "../../../native_theme/components/SafeView";
import Button from "../../../native_theme/components/Button";
import { View, ScrollView, Keyboard } from "react-native";
import { isCurrentScreen } from "../../Navigation";
import CommonStatusBar from "../../../native_theme/components/CommonStatusBar";
import CommonToast from "../../../native_theme/components/CommonToast";
import { connect } from "react-redux";
import { TitlePicker } from "../../widget/ComboPickerWidget";
import { showAlert, changeTheme, parseArray } from "../../../controllers/CommonUtils";
import ProgressDialog from "../../../native_theme/components/ProgressDialog";
import { userRoleAssignData, clearRoleModuleData, getRoleModuleList, getUserDetailByIdData } from "../../../actions/account/UserManagementActions";

//Create class for UnSignedUserRoleAssignScreen
class UnSignedUserRoleAssignScreen extends Component {
    constructor(props) {
        super(props);
        //item data from previous List screen
        let item =
            props.navigation.state.params && props.navigation.state.params.item;

        this.inputs = {};
        //Define All State initial state
        this.state = {
            userDetailByIdDataState: null,
            item: item,
            userDataState: null,

            selectedRole: R.strings.Please_Select,
            selectedRoleCode: '',
            roles: [{ value: R.strings.Please_Select }],

            LastName: '',
            Status: '',
            FirstName: '',
            Mobile: '',
            RoleName: '',
            UserName: '',
            Email: '',
        };

        // create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            this.props.getRoleModuleList({
                PageSize: 100,
                AllRecords: 1,
                PageNo: 0,
            })

            this.props.getUserDetailByIdData({
                UserId: this.state.item.Id
            })
        }
    }

    componentWillUnmount() {
        //for Data clear on Backpress
        this.props.clearRoleModuleData()
    }
    //submitData
    submitData = async () => {
        //validations for Inputs

        if (this.state.selectedRole === R.strings.Please_Select) {
            this.toast.Show(R.strings.select + " " + R.strings.Role);
            return;
        }

        /*   if (this.state.selectedRole === this.state.item.RoleName) {
              this.toast.Show('Select other role');
              return;
          }
   */
        Keyboard.dismiss();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //call userRoleAssignData api
            this.props.userRoleAssignData({
                UserId: this.state.item.Id,
                RoleId: this.state.selectedRoleCode,
            });
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    }



    async componentDidUpdate(prevProps, prevState) {

        const { userAssignRoleData } = this.props.Listdata;

        if (userAssignRoleData !== prevProps.Listdata.userAssignRoleData) {
            // for show responce userAssignRoleData
            if (userAssignRoleData) {
                try {

                    if (validateResponseNew({ response: userAssignRoleData })) {
                        showAlert(R.strings.Success, R.strings.recordCreatedSuccessfully, 0, () => {
                            this.props.clearRoleModuleData();
                            this.props.navigation.state.params.onRefresh() // if add success call list method from back screen
                            this.props.navigation.goBack();
                        });
                    } else {
                        this.props.clearRoleModuleData();
                    }
                } catch (e) {
                    this.props.clearRoleModuleData();
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
                isFirstTime: false
            };
        }

        // To Skip Render if old and new props are equal
        if (UnSignedUserRoleAssignScreen.oldProps !== props) {
            UnSignedUserRoleAssignScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { RoleModuleListData, userDetailByIdData } = props.Listdata;

            if (userDetailByIdData) {
                try {
                    //if local userDetailByIdData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userDetailByIdDataState == null || (state.userDetailByIdDataState != null && userDetailByIdData !== state.userDetailByIdDataState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: userDetailByIdData, isList: true })) {

                            let res = userDetailByIdData.Data;

                            //Set response data
                            return {
                                ...state,
                                LastName: res.LastName,
                                Email: res.Email,
                                selectedRoleCode: res.RoleId,
                                UserName: res.UserName,
                                Status: res.Status == 1 ? R.strings.active : R.strings.Inactive,
                                FirstName: res.FirstName,
                                Mobile: res.Mobile,
                                selectedRole: res.RoleName,
                                RoleName: res.RoleName,
                                PermissionGroup: res.PermissionGroup,
                                userDetailByIdDataState: userDetailByIdData,
                            };

                        } else {
                            return {
                                ...state, userDetailByIdDataState: userDetailByIdData
                            };
                        }
                    }
                }
                catch (e) {
                    return { ...state, };
                }
            }

            if (RoleModuleListData) 
             {
                try
                 {
                    //if local RoleModuleListData state is null or its not null and also different then new response then and only then validate response.
                    if (state.RoleModuleListDataState == null ||
                         (state.RoleModuleListDataState != null && 
                            RoleModuleListData !== state.RoleModuleListDataState)) 
                            {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: RoleModuleListData, isList: true })) 
                        {
                            let res = parseArray(RoleModuleListData.Details);

                            //for add RoleModuleListData
                            for (var RoleModuleListDatakey in res) 
                            {
                                let item = res[RoleModuleListDatakey];  item.value = item.RoleName;
                            }

                            let roles = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return {
                                ...state,
                                RoleModuleListDataState: RoleModuleListData,
                                roles
                            };
                        } else {
                            return { ...state, RoleModuleListDataState: RoleModuleListData, roles: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, roles: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    render() {
        const {
            userDetailByIdDataLoading,
            userAssignRoleLoading,
            RoleModuleListLoading,
        } = this.props.Listdata;


        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.update + ' ' + R.strings.assginRole}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog
                    isShow={userAssignRoleLoading || RoleModuleListLoading || userDetailByIdDataLoading} />

                {/* Common Toast */}
                <CommonToast
                    ref={component => (this.toast = component)}
                />

                <View style={{
                    flex: 1,
                    justifyContent: "space-between"
                }}>
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        showsVerticalScrollIndicator={false}
                    >
                        <View
                            style={{
                                paddingBottom: R.dimens.widget_top_bottom_margin,
                                paddingTop: R.dimens.widget_top_bottom_margin,
                                paddingLeft: R.dimens.activity_margin,
                                paddingRight: R.dimens.activity_margin,
                            }}
                        >

                            {/* Text for UserName */}
                            <TextCard
                                title={R.strings.userName}
                                value={validateValue(this.state.UserName)}
                            />

                            {/* Text for FullName */}
                            <TextCard 
                            title={R.strings.FullName} 
                            value={validateValue(this.state.FirstName) 
                            + ' ' + validateValue(this.state.LastName)}
                             />

                            {/* Text for email */}
                            <TextCard 
                            title={R.strings.email} 
                            value={validateValue(this.state.Email)} 
                            />

                            {/* Text for MobileNo */}
                            <TextCard 
                            title={R.strings.MobileNo} 
                            value={validateValue(this.state.Mobile)} 
                            />

                            {/* Picker for userName */}
                            <TitlePicker
                                selectedValue={this.state.selectedRole}
                                title={R.strings.Role}
                                style={{
                                    marginTop: R.dimens.widget_top_bottom_margin,
                                    marginBottom: R.dimens.margin_top_bottom
                                }}
                                array={this.state.roles}
                                onPickerSelect={(item, object) =>
                                    this.setState({
                                        selectedRoleCode: object.RoleID,
                                        selectedRole: item,
                                    })
                                }
                                isRequired={true}
                            />
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View
                        style={{
                            paddingTop: R.dimens.widget_top_bottom_margin,
                            paddingRight: R.dimens.activity_margin,
                            paddingBottom: R.dimens.widget_top_bottom_margin,
                            paddingLeft: R.dimens.activity_margin,
                        }}
                    >
                        <Button
                            onPress={this.submitData}
                            title={R.strings.assginRole}
                        />
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        
        //Updated UserManagementReducer data
        Listdata: state.UserManagementReducer
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // Rule module list
        getRoleModuleList: (payload) => dispatch(getRoleModuleList(payload)),
       
        //for userRoleAssignData  api data
        userRoleAssignData: (payload) => dispatch(userRoleAssignData(payload)),
      
        // getUserDetailByIdData
        getUserDetailByIdData: (payload) => dispatch(getUserDetailByIdData(payload)),
       
        //for data clear
        clearRoleModuleData: () => dispatch(clearRoleModuleData())
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UnSignedUserRoleAssignScreen);
