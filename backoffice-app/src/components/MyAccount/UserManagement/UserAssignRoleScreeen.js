import { View, ScrollView, Keyboard } from "react-native";
import React from "react";
import { Component } from "react";
import CommonStatusBar from "../../../native_theme/components/CommonStatusBar";
import CustomToolbar from "../../../native_theme/components/CustomToolbar";
import Button from "../../../native_theme/components/Button";
import { connect } from "react-redux";
import { isCurrentScreen } from "../../Navigation";
import { showAlert, changeTheme, parseArray } from "../../../controllers/CommonUtils";
import { isInternet, validateResponseNew, validateValue } from "../../../validations/CommonValidation";
import CommonToast from "../../../native_theme/components/CommonToast";
import ProgressDialog from "../../../native_theme/components/ProgressDialog";
import R from "../../../native_theme/R";
import { TitlePicker } from "../../widget/ComboPickerWidget";
import SafeView from "../../../native_theme/components/SafeView";
import { getUserDataList } from "../../../actions/PairListAction";
import { userRoleAssignData, clearRoleModuleData } from "../../../actions/account/UserManagementActions";
import TextCard from "../../../native_theme/components/TextCard";

//Create class for UserAssignRoleScreeen
class UserAssignRoleScreeen extends Component {
    constructor(props) {
        super(props);

        this.inputs = {};

        //item data from previous List screen
        let item =
            props.navigation.state.params && props.navigation.state.params.item;

        //Define All State initial state
        this.state = {
            itemData: item,
            userDataState: null,

            userNames: [{ value: R.strings.Please_Select }],
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: ''
        };

        // create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.props.getUserDataList();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    }

    //submitData
    submitData = async () => {
        //validations for Inputs

        if (this.state.selectedUserName === R.strings.Please_Select) {
            this.toast.Show(R.strings.select + " " + R.strings.Username);
            return;
        }

        Keyboard.dismiss();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //call userRoleAssignData api
            this.props.userRoleAssignData({
                RoleId: this.state.itemData.RoleID,
                UserId: this.state.selectedUserNameCode,
            });
        }
    };

    async componentDidUpdate(prevProps, prevState) {

        const { userAssignRoleData } = this.props.Listdata;

        if (userAssignRoleData !== prevProps.Listdata.userAssignRoleData) {
            // for show responce userAssignRoleData
            if (userAssignRoleData) {
                try {

                    if (validateResponseNew({ response: userAssignRoleData })) {
                        showAlert(R.strings.Success, R.strings.recordCreatedSuccessfully, 0, () => {
                            this.props.clearRoleModuleData();
                            this.props.navigation.state.params.onRefresh(true) // if add success call list method from back screen
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
        if (UserAssignRoleScreeen.oldProps !== props) {
            UserAssignRoleScreeen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { userData } = props.Listdata;

            if (userData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.

                    if (state.userDataState == null || (state.userDataState != null && userData !== state.userDataState)) {

                        //if  response is success then store array list else store empty list

                        if (validateResponseNew({ response: userData, isList: true })) {
                            let res = parseArray(userData.GetUserData);

                            //for add userData
                            for (var userDatakey in res) {
                                let item = res[userDatakey];

                                item.value = item.UserName;
                            }

                            let userNames = [
                                { value: R.strings.Please_Select },

                                ...res
                            ];

                            return {
                                ...state, userDataState: userData,
                                userNames
                            };
                        } else {
                            return {
                                ...state, userDataState: userData,
                                userNames: [
                                    { value: R.strings.Please_Select }
                                ]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        userNames: [
                            { value: R.strings.Please_Select }
                        ]
                    };
                }
            }
        }
        return null;
    }

    render() {
        const {
            userAssignRoleLoading,
            userDataLoading
        } = this.props.Listdata;

        let { itemData } = this.state

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.userRoleAssign}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog
                    isShow={userAssignRoleLoading || userDataLoading} />

                {/* Common Toast */}
                <CommonToast ref={component => (this.toast = component)} />

                <View style={{ flex: 1, justifyContent: "space-between" }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                    >
                        <View
                            style={{
                                paddingLeft: R.dimens.activity_margin,
                                paddingRight: R.dimens.activity_margin,
                                paddingBottom: R.dimens.widget_top_bottom_margin,
                                paddingTop: R.dimens.widget_top_bottom_margin
                            }}
                        >

                            {/* Text for RoleName */}
                            <TextCard title={R.strings.RoleName} value={validateValue(itemData.RoleName)} />

                            {/* Text for RoleDescription */}
                            <TextCard title={R.strings.RoleDescription} value={validateValue(itemData.RoleDescription)} />

                            {/* Text for status */}
                            <TextCard title={R.strings.status} value={validateValue(itemData.StrStatus)} />

                            {/* Picker for userName */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.userName}
                                array={this.state.userNames}
                                selectedValue={this.state.selectedUserName}
                                style={{
                                    marginTop: R.dimens.widget_top_bottom_margin,
                                    marginBottom: R.dimens.margin_top_bottom
                                }}
                                onPickerSelect={(item, object) =>
                                    this.setState({
                                        selectedUserName: item,
                                        selectedUserNameCode: object.Id
                                    })
                                }
                            />
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View
                        style={{
                            paddingLeft: R.dimens.activity_margin,
                            paddingRight: R.dimens.activity_margin,
                            paddingBottom: R.dimens.widget_top_bottom_margin,
                            paddingTop: R.dimens.widget_top_bottom_margin
                        }}
                    >
                        <Button
                            title={R.strings.assginRole}
                            onPress={this.submitData}
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
        //for userRoleAssignData  api data
        userRoleAssignData: (payload) => dispatch(userRoleAssignData(payload)),
        //for getAppType  api data
        getUserDataList: () => dispatch(getUserDataList()),
        //for data clear
        clearRoleModuleData: () => dispatch(clearRoleModuleData())
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAssignRoleScreeen);
