import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { isInternet, isEmpty, validateResponseNew } from '../../../validations/CommonValidation';
import { changeTheme, getDeviceID, getIPAddress, parseFloatVal, parseIntVal, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { CheckAmountValidation } from '../../../validations/AmountValidation';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import EditText from '../../../native_theme/components/EditText';
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { getLeaderTradingPolicy, editLeaderTradingPolicy, clearLedgerFollowerData } from '../../../actions/account/SocialTradingPolicyActions';
import { ServiceUtilConstant } from '../../../controllers/Constants';

export class LeaderProfileConfigScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Leader
            ProfileVisibilty: [{ value: R.strings.Please_Select }, { value: R.strings.Public }, { value: R.strings.Private }],
            selectedProfileVis: R.strings.Please_Select,
            MaxFollower: '',
            MinBalance: '',

            isFirstTime: true,
            LedgerTradingDataState: null,
        }

        this.inputs = {}
        this.toast = React.createRef()
    }

    componentDidMount = async () => {
        changeTheme()

        // Check internet connection is avaialable or not
        if (await isInternet()) {

            // Called Ledger Trading Policy Api
            this.props.getLeaderTradingPolicy()
        }
    }

    componentWillUnmount() {
        this.props.clearLedgerFollowerData()
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    }

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    // Allow (10,8) digit eg: 1234567890.12345678
    isValidInput = (key, value) => {
        if (value !== '') {
            if (CheckAmountValidation(value)) {
                this.setState({ [key]: value })
            }
        } else {
            this.setState({ [key]: value })
        }
    }

    // when user press on edit button of Leader Tab
    onLeaderChange = async () => {

        // Check validation
        if (this.state.selectedProfileVis === R.strings.Please_Select)
            this.toast.Show(R.strings.PleaseSelectProfileVisibility)
        else if (isEmpty(this.state.MaxFollower))
            this.toast.Show(R.strings.EnterMaxFollowerAllow)
        else if (isEmpty(this.state.MinBalance))
            this.toast.Show(R.strings.EnterMinBalReq)
        else {

            // Check internet connection
            if (await isInternet()) {

                let req = {
                    Default_Visibility_of_Profile: this.state.selectedProfileVis === R.strings.Public ? 1 : 2,
                    Max_Number_Followers_can_Follow: parseIntVal(this.state.MaxFollower),
                    Min_Number_of_Followers_can_Follow: parseFloatVal(this.state.MinBalance),
                    DeviceId: await getDeviceID(),
                    Mode: ServiceUtilConstant.Mode,
                    IPAddress: await getIPAddress(),
                    HostName: ServiceUtilConstant.hostName
                }

                // Called Set Leader Trading Policy Api
                this.props.editLeaderTradingPolicy(req)
            }
        }
    }

    // When user press on ok button of Edit Ledger Trading Success Dialog
    onEditLedgerSuccess = async () => {
        // Check internet connection
        if (await isInternet()) {
            // Clear Ledger Follower Data
            this.props.clearLedgerFollowerData()
            // Called Ledger Trading Policy Api
            this.props.getLeaderTradingPolicy()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { EditLedgerTradingData } = this.props.SocialTradingPolicyResult

        if (EditLedgerTradingData !== prevProps.SocialTradingPolicyResult.EditLedgerTradingData) {
            // EditLedgerTradingData is not null
            if (EditLedgerTradingData) {
                try {
                    if (this.state.EditLedgerTradingData == null || (this.state.EditLedgerTradingData != null && EditLedgerTradingData !== this.state.EditLedgerTradingData)) {

                        if (validateResponseNew({ response: EditLedgerTradingData })) {
                            // on success response 
                            showAlert(R.strings.status, EditLedgerTradingData.ReturnMsg, 0, () => this.onEditLedgerSuccess())
                        } else {
                            this.setState({ EditLedgerTradingData: null })
                        }
                    }
                } catch (error) {
                    this.setState({ EditLedgerTradingData: null })
                }
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, }
        }

        // To Skip Render if old and new props are equal
        if (LeaderProfileConfigScreen.oldProps !== props) {
            LeaderProfileConfigScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated field of Particular actions
            const { LedgerTradingData } = props.SocialTradingPolicyResult

            // LedgerTradingData is not null
            if (LedgerTradingData) {

                try {
                    if (state.LedgerTradingDataState == null || (state.LedgerTradingDataState != null && LedgerTradingData !== state.LedgerTradingDataState)) {

                        if (validateResponseNew({ response: LedgerTradingData })) {

                            let response = LedgerTradingData.LeaderAdminPolicy

                            // get 1 for Public and 2 for private 
                            let profVis = R.strings.Please_Select
                            if (response.Default_Visibility_of_Profile == 1)
                                profVis = R.strings.Public
                            else if (response.Default_Visibility_of_Profile == 2)
                                profVis = R.strings.Private

                            return Object.assign({}, state, {
                                LedgerTradingDataState: LedgerTradingData,
                                selectedProfileVis: profVis,
                                MaxFollower: response.Max_Number_Followers_can_Follow.toString(),
                                MinBalance: response.Min_Number_of_Followers_can_Follow.toString(),
                            })
                        } else {
                            return Object.assign({}, state, {
                                LedgerTradingDataState: null,
                                selectedProfileVis: R.strings.Please_Select,
                                MaxFollower: '',
                                MinBalance: '',
                            })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        LedgerTradingDataState: null,
                        selectedProfileVis: R.strings.Please_Select,
                        MaxFollower: '',
                        MinBalance: '',
                    })
                }
            }
        }
        return null
    }
    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { LedgerTradingLoading, EditLedgerTradingLoading, } = this.props.SocialTradingPolicyResult

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.leaderProfileConfig}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                <ProgressDialog isShow={EditLedgerTradingLoading || LedgerTradingLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* Picker for Profile Visibilty */}
                            <TitlePicker
                                disable={true}
                                title={R.strings.DefaultProfileVisibility}
                                array={this.state.ProfileVisibilty}
                                selectedValue={this.state.selectedProfileVis}
                                onPickerSelect={(item) => this.setState({ selectedProfileVis: item })} />

                            {/* To set Maximum No of Followers can Allow in EditText */}
                            <EditText
                                header={R.strings.MaxNoFollowerAllow}
                                reference={input => { this.inputs['etMaxFollower'] = input; }}
                                placeholder={R.strings.MaxNoFollowerAllow}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                onChangeText={(Text) => this.setState({ MaxFollower: Text })}
                                onSubmitEditing={() => { this.focusNextField('etMinBalance') }}
                                value={this.state.MaxFollower}
                            />

                            {/* To set Minimum Balance Require to Follower Account to Follow in EditText */}
                            <EditText
                                header={R.strings.MinBalReqFollower}
                                reference={input => { this.inputs['etMinBalance'] = input; }}
                                placeholder={R.strings.EnterMinBal}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                onChangeText={(Label) => this.isValidInput('MinBalance', Label)}
                                value={this.state.MinBalance}
                            />

                        </ScrollView>
                    </View>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={R.strings.update} onPress={this.onLeaderChange}></Button>
                    </View>
                </View>
            </SafeView >
        )
    }
}

// return state from saga or resucer
const mapStateToProps = (state) => {
    return {
        SocialTradingPolicyResult: state.SocialTradingPolicyReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Ledger Trading Policy 
    getLeaderTradingPolicy: () => dispatch(getLeaderTradingPolicy()),
    // Edit Ledger Trading Policy 
    editLeaderTradingPolicy: (payload) => dispatch(editLeaderTradingPolicy(payload)),
    // Clear Ledger Follower Trading Data
    clearLedgerFollowerData: () => dispatch(clearLedgerFollowerData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LeaderProfileConfigScreen);