import React, { Component } from 'react';
import { View, } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, showAlert } from '../../controllers/CommonUtils';
import Button from '../../native_theme/components/Button'
import { isCurrentScreen } from '../Navigation';
import { isInternet, validateResponseNew, isEmpty } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { addWalletUser, clearAddUserData } from '../../actions/Wallet/MyWalletAction';
import CommonToast from '../../native_theme/components/CommonToast';
import EditText from '../../native_theme/components/EditText';
import { CheckEmailValidation } from '../../validations/EmailValidation';
import R from '../../native_theme/R';
import HorizontalPicker from '../../native_theme/components/HorizontalPicker';
import TextViewMR from '../../native_theme/components/TextViewMR';
import SafeView from '../../native_theme/components/SafeView';

class AddNewWalletUser extends Component {
    constructor(props) {
        super(props);

        // for displaying toast
        this.toast = React.createRef();

        //for focus on next field
        this.inputs = {};

        //To Fetch value From Previous Screen
        let WalletId = props.navigation.state.params && props.navigation.state.params.WalletId;

        //Define All initial State
        this.state = {
            WalletId: WalletId,
            Email: '',
            Message: '',
            roleItems: R.strings.RolesData,
            selectedRole: R.strings.RolesData[0].value
        }
    }

    componentDidUpdate = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { AddWalletUserFetchData, AddWalletUserData } = this.props;

        // compare response with previous response
        if (AddWalletUserData !== prevProps.AddWalletUserData) {

            //To Check Changes Status Of List User Wallet Wise
            if (!AddWalletUserFetchData) {
                try {

                    //handle response of API
                    if (validateResponseNew({ response: AddWalletUserData })) {

                        // Display Success Message in Dailog 
                        showAlert(R.strings.Success + '!', AddWalletUserData.ReturnMsg, 0, () => {
                            //Clear Add User Data 
                            this.props.clearAddUserData();

                            //Refresh Previous Screen
                            this.props.navigation.state.params.onRefresh(false);
                            this.props.navigation.goBack();
                        });
                    } else {
                        //Clear Add User Data 
                        this.props.clearAddUserData();
                    }
                } catch (e) {
                    //Clear Add User Data 
                    this.props.clearAddUserData();
                }
            }
        }
    };

    //To Add User To Wallet Request
    onAddNewWalletUser = async () => {

        //Check Email is Empty Or Not.
        if (isEmpty(this.state.Email)) {
            this.toast.Show(R.strings.Enter_Email_validation);
        }

        //Check Message is Empty Or Not.
        else if (isEmpty(this.state.Message)) {
            this.toast.Show(R.strings.enter_message);
        }

        //Check Email Is Valid or Not
        else if (CheckEmailValidation(this.state.Email)) {
            this.toast.Show(R.strings.Enter_Valid_Email);
        }
        else {
            //Check NetWork is Available or not 
            if (await isInternet()) {

                //Check Selected Role And Map Role valuse Based on Item
                let roleid = '';
                if (this.state.selectedRole === this.state.roleItems[0].value) {
                    roleid = 2
                } else if (this.state.selectedRole === this.state.roleItems[1].value) {
                    roleid = 3
                } else if (this.state.selectedRole === this.state.roleItems[2].value) {
                    roleid = 4
                }

                let addWalletUserRequest = {
                    WalletID: this.state.WalletId,
                    RoleId: roleid,
                    Message: this.state.Message,
                    Email: this.state.Email,
                    RequestType: 1, //Static 1 For Add User Request
                    ChannelId: 21

                }

                //Call Add User To Wallet API Request
                this.props.addWalletUser(addWalletUserRequest);
            }
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { AddWalletUserIsFetching } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.AddNewUser} isBack={true} nav={this.props.navigation} />

                {/* To Set Progress Dialog as per out theme */}
                <ProgressDialog isShow={AddWalletUserIsFetching} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                        {/* Email Address as User Input */}
                        <EditText
                            placeholderTextColor={R.colors.textSecondary}
                            style={{ marginTop: 0, }}
                            reference={input => { this.inputs['etEmailAddress'] = input; }}
                            maxLength={50}
                            value={this.state.Email}
                            header={R.strings.EmailAddress}
                            placeholder={R.strings.EmailAddress}
                            multiline={false}
                            keyboardType='default'
                            returnKeyType={"next"}
                            onChangeText={(Email) => this.setState({ Email })}
                            onSubmitEditing={() => { this.focusNextField('etMessage') }}
                        />

                        {/* Invite Message as User Input */}
                        <EditText
                            placeholderTextColor={R.colors.textSecondary}
                            reference={input => { this.inputs['etMessage'] = input; }}
                            value={this.state.Message}
                            header={R.strings.InviteMessage}
                            placeholder={R.strings.InviteMessage}
                            multiline={false}
                            keyboardType='default'
                            returnKeyType={"done"}
                            onChangeText={(Message) => this.setState({ Message })}
                        />

                        {/* To Set Role in Dropdown */}
                        <TextViewMR style={{ fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.selectRoleMsg}</TextViewMR>

                        <HorizontalPicker
                            Items={this.state.roleItems}
                            selectedItem={this.state.selectedRole}
                            onPress={(item) => this.setState({ selectedRole: item.value })} />
                    </View>

                    {/* for bottom add button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.add}
                            onPress={this.onAddNewWalletUser} />
                    </View>
                </View>
            </SafeView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        //Update Add Request For New Wallet User
        AddWalletUserFetchData: state.MyWalletReducer.AddWalletUserFetchData,
        AddWalletUserData: state.MyWalletReducer.AddWalletUserData,
        AddWalletUserIsFetching: state.MyWalletReducer.AddWalletUserIsFetching,
    }
};

const mapDispatchToProps = (dispatch) => ({

    //Perform Add New Wallet User Request
    addWalletUser: (addWalletUserRequest) => dispatch(addWalletUser(addWalletUserRequest)),

    //Clear Add User Data
    clearAddUserData: () => dispatch(clearAddUserData()),

});

export default connect(mapStateToProps, mapDispatchToProps)(AddNewWalletUser);