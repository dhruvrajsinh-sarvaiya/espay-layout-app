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
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import { getPersonalInfoData, editPersonalInfoData, PersonalInfoClear } from '../../../actions/account/PersonalInfoAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit Exchange banks
class PersonalInfo extends Component {

    constructor(props) {
        super(props);
        this.inputs = {};

        // create reference
        this.toast = React.createRef();

        //define all initial state
        this.state = {
            firstName: '',
            lastName: '',
            Username: '',
            Email: '',
            mobile: '',
            isFirstTime: true,
            flag: false,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Buy Currency API
            this.props.getPersonalInfoData({});
            //----------
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

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
        if (PersonalInfo.oldProps !== props) {
            PersonalInfo.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ProfileData } = props.Listdata;

            if (ProfileData) {
                try {
                    if (state.ProfileData == null || (state.ProfileData != null && ProfileData !== state.ProfileData)) {
                        if (validateResponseNew({ response: ProfileData, isList: true, })) {
                            //Set State For Api response 
                            let res = ProfileData.UserData;

                            return {
                                ...state,
                                ProfileData,
                                firstName: res.FirstName,
                                lastName: res.LastName,
                                Username: res.Username,
                                Email: res.Email,
                                mobile: res.MobileNo,
                                flag: true
                            }
                        }
                        else {
                            return {
                                ...state,
                                flag: false,
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        flag: false,
                    }
                }
            }
        }
        return null;
    }


    onPress = async () => {

        //check input validations 
        if (isEmpty(this.state.firstName)) {
            this.toast.Show(R.strings.enterFirstName)
            return;
        }
        if (isEmpty(this.state.lastName)) {
            this.toast.Show(R.strings.enterLastName)
            return;
        }

        Keyboard.dismiss();

        //Check NetWork is Available or not
        if (await isInternet()) {
            let request = {
                FirstName: this.state.firstName,
                LastName: this.state.lastName,
            }

            //call editPersonalInfoData api
            this.props.editPersonalInfoData(request)
        }

    }
    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { EditProfileData } = this.props.Listdata;
        if (EditProfileData !== prevProps.Listdata.EditProfileData) {
            // for show responce update
            if (EditProfileData) {
                if (validateResponseNew({
                    response: EditProfileData
                })) {
                    showAlert(R.strings.Success, EditProfileData.ReturnMsg, 0, () => {
                        //clear data
                        this.props.PersonalInfoClear()
                        this.props.navigation.goBack()
                    });
                } else {
                    //clear data
                    this.props.PersonalInfoClear()
                }
            }
        }
    }


    render() {

        const { getProfileLoading, editProfileLoading } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.personal_info}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* To Set ProgressDialog as per out theme */}
                <ProgressDialog isShow={getProfileLoading || editProfileLoading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* Display Data in scrollview */}

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Input for firstName */}
                            <EditText
                                header={R.strings.firstName}
                                placeholder={R.strings.firstName}
                                value={this.state.firstName}
                                onChangeText={(text) => this.setState({ firstName: text })}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['firstName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etlastname') }}
                                blurOnSubmit={false}
                                returnKeyType={"next"}
                                onPressRight={() => { this.focusNextField('firstName') }}
                            />

                            {/* Input for lastName */}
                            <EditText
                                header={R.strings.lastName}
                                placeholder={R.strings.lastName}
                                onChangeText={(text) => this.setState({ lastName: text })}
                                value={this.state.lastName}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['etlastname'] = input; }}
                                returnKeyType={"done"}
                                onPressRight={() => { this.focusNextField('etlastname') }}
                            />

                            {/* Input for userName */}
                            <EditText
                                header={R.strings.userName}
                                placeholder={R.strings.userName}
                                value={this.state.Username}
                                editable={false}
                            />

                            {/* Input for Email */}
                            <EditText
                                header={R.strings.Email}
                                placeholder={R.strings.Email}
                                value={this.state.Email}
                                editable={false}
                            />

                            {/* Input for Mobile no */}
                            <EditText
                                header={R.strings.Mobile}
                                placeholder={R.strings.Mobile}
                                value={this.state.mobile}
                                editable={false}
                            />
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set update Button */}
                        <Button title={R.strings.update} onPress={() => this.onPress()}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated PersonalInfoReducer Data
        Listdata: state.PersonalInfoReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform  getPersonalInfoData action
        getPersonalInfoData: () => dispatch(getPersonalInfoData()),
        //clear data
        PersonalInfoClear: () => dispatch(PersonalInfoClear()),
        //Perform  editPersonalInfoData action
        editPersonalInfoData: (request) => dispatch(editPersonalInfoData(request)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PersonalInfo)