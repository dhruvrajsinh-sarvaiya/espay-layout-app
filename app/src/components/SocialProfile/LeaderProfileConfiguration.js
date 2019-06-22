import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { changeTheme, getDeviceID, showAlert, parseIntVal, } from '../../controllers/CommonUtils';
import EditText from '../../native_theme/components/EditText';
import Button from '../../native_theme/components/Button';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import CommonToast from '../../native_theme/components/CommonToast';
import { addLeaderConfig, clearLeaderConfig, getLeaderConfig } from '../../actions/SocialProfile/SocialProfileActions';
import { ServiceUtilConstant } from '../../controllers/Constants';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import { TitlePicker } from '../Widget/ComboPickerWidget';
import SafeView from '../../native_theme/components/SafeView';

class LeaderProfileConfiguration extends Component {
    constructor(props) {
        super(props);

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //bind all Methods
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        let { params } = props.navigation.state

        //initial State
        this.state = {
            ProfileId: params && params.ProfileId,
            ProfileVisibilty: R.strings.ProfileVisibilityArray,
            selectedProfileVis: R.strings.ProfileVisibilityArray[0].value,
            MaxFollower: '',
            MinFollower: '',
            oldMaxFollower: '',
            oldMinFollwer: '',
            AddLeaderConfigData: null,
            leaderConfigData: null,
            isFirstTime: true,
        };

        //create Reference
        this.inputs = {};
        this.toast = React.createRef();
        this.Request = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        /* stop twice api call  */
        return isCurrentScreen(nextProps);
    };

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        // Check internet connection
        if (await isInternet()) {

            //get leader Api Call
            this.props.getLeaderConfig()
        }
    };

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    /* Called when user press on save button */
    onSavePress = async () => {
        //validations for Inputs
        /* EditText are empty or not */
        if (this.state.selectedProfileVis === R.strings.ProfileVisibilityArray[0].value)
            this.toast.Show(R.strings.Please_Select + ' ' + R.strings.ProfileVisibility)

        else if (isEmpty(this.state.MaxFollower))
            this.toast.Show(R.strings.EnterMaxFollowerAllow)
        else if (parseIntVal(this.state.MaxFollower) < parseIntVal(this.state.oldMinFollwer))
            this.toast.Show(R.strings.formatString(R.strings.follwerLimit, { minValue: this.state.oldMinFollwer, maxValue: this.state.oldMaxFollower }))
        else if (parseIntVal(this.state.MaxFollower) > parseIntVal(this.state.oldMaxFollower))
            this.toast.Show(R.strings.formatString(R.strings.follwerLimit, { minValue: this.state.oldMinFollwer, maxValue: this.state.oldMaxFollower }))
        else {
            // Api call
            this.Request = {
                Default_Visibility_of_Profile: this.state.selectedProfileVis === this.state.ProfileVisibilty[1].value ? 1 : 2,
                Max_Number_Followers_can_Follow: parseIntVal(this.state.MaxFollower),
                DeviceId: await getDeviceID(),
                Mode: ServiceUtilConstant.Mode,
                HostName: ServiceUtilConstant.hostName
                //Note : ipAddress parameter is passed in its saga.
            }
            // Check internet connection
            if (await isInternet()) {
                /* Called Add Leader Profile Configuration Api */
                this.props.addLeaderConfig(this.Request)
            }
        }
    }

    onBackPress() {
        //call previuos screen method
        this.props.navigation.state.params.onProgress()
        //go to previous screen
        this.props.navigation.goBack();
    }

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {

            //Get All Updated field of Particular actions
            const { leaderConfigData } = props.LeaderConfigResult
            // Leader config data for edit
            if (leaderConfigData) {
                try {
                    if (state.leaderConfigData == null || (state.leaderConfigData != null && leaderConfigData !== state.leaderConfigData)) {
                        // Handle Response
                        if (validateResponseNew({ response: leaderConfigData, isList: true })) {
                            let response = leaderConfigData.LeaderFrontConfiguration
                            return {
                                ...state,
                                selectedProfileVis: response.Default_Visibility_of_Profile === 1 ? state.ProfileVisibilty[1].value : state.ProfileVisibilty[2].value,
                                MaxFollower: (response.Max_Number_Followers_can_Follow).toString(),
                                oldMaxFollower: (response.Max_Number_Followers_can_Follow).toString(),
                                MinFollower: (response.Min_Number_of_Followers_can_Follow).toString(),
                                oldMinFollwer: (response.Min_Number_of_Followers_can_Follow).toString(),
                                leaderConfigData
                            }
                        } else {
                            return {
                                ...state,
                                leaderConfigData: leaderConfigData,
                            }
                        }
                    }
                } catch (error) {
                    return {
                        ...state,
                    }
                }
            }
        }
        return null
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated field of Particular actions
        const { AddLeaderConfigData } = this.props.LeaderConfigResult

        if (AddLeaderConfigData !== prevProps.LeaderConfigResult.AddLeaderConfigData) {

            /* AddLeaderConfigData is not null */
            if (AddLeaderConfigData) {
                try {
                    /* Response is validate or not and if not then alert is displayed on screen */
                    if (validateResponseNew({ response: AddLeaderConfigData })) {
                        showAlert(R.strings.Success + '!', AddLeaderConfigData.ReturnMsg, 0, () => {
                            this.props.clearLeaderConfig()
                            this.props.navigation.state.params.onProgress()
                            this.props.navigation.goBack()
                        })
                    }
                    else {
                        this.props.clearLeaderConfig()
                    }
                } catch (error) {
                    this.props.clearLeaderConfig()
                }
            }
        }
    }

    render() {

        // get loading value from reducer which are used for progress bar and list loader
        let { leaderConfigLoading, AddLeaderConfigLoading } = this.props.LeaderConfigResult

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.LeaderProfileConfig}
                    isBack={true}
                    nav={this.props.navigation}
                    onBackPress={this.onBackPress}
                />

                {/* Progress bar */}
                <ProgressDialog isShow={leaderConfigLoading || AddLeaderConfigLoading} />

                {/* Custom Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ marginTop: R.dimens.padding_top_bottom_margin, marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, marginBottom: R.dimens.padding_top_bottom_margin }}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* Picker for Profile Visibilty */}
                            <TitlePicker
                                title={R.strings.ProfileVisibility}
                                array={this.state.ProfileVisibilty}
                                selectedValue={this.state.selectedProfileVis}
                                onPickerSelect={(item) => this.setState({ selectedProfileVis: item })} />

                            {/* To set Maximum No of Followers can Allow in EditText */}
                            <EditText
                                header={R.strings.MaxNoFollowerAllow}
                                reference={input => { this.inputs['etMaxFollower'] = input; }}
                                placeholder={R.strings.formatString(R.strings.follwerLimitShortMsg, { minValue: this.state.oldMinFollwer, maxValue: this.state.oldMaxFollower })}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                maxLength={5}
                                onChangeText={(val) => this.setState({ MaxFollower: val })}
                                value={this.state.MaxFollower}
                                validate={true}
                                onlyDigit={true}
                            />
                        </ScrollView>
                    </View>
                </View>

                {/* Save Button */}
                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                    <Button title={R.strings.Save} onPress={this.onSavePress}></Button>
                </View>
            </SafeView>
        );
    }
}

// return state from saga or reducer 
const mapStateToProps = (state) => {
    return {
        //Updated Data For Leader Configuration Action
        LeaderConfigResult: state.SocialProfileReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //Perform Add Leader Action
    addLeaderConfig: (payload) => dispatch(addLeaderConfig(payload)),
    //Perform Clear Leader Data Action
    clearLeaderConfig: () => dispatch(clearLeaderConfig()),
    //Perform get Leader Action Action
    getLeaderConfig: () => dispatch(getLeaderConfig()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LeaderProfileConfiguration);