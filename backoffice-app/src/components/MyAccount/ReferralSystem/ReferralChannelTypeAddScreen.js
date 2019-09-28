import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { updateReferralChannelType, addReferralChannelType, clearData } from '../../../actions/account/ReferralChannelTypeAction';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import Button from '../../../native_theme/components/Button';
import EditText from '../../../native_theme/components/EditText';
import { changeTheme } from '../../../controllers/CommonUtils';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isEmpty, isInternet, validateResponseNew, } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { showAlert } from '../../../controllers/CommonUtils';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';

class ReferralChannelTypeAddScreen extends Component {

    constructor(props) {
        super(props)

        // create reference
        this.toast = React.createRef();

        //fill item from previous screen
        let item = props.navigation.state.params && props.navigation.state.params.ITEM;

        this.headerText = item == undefined ? R.strings.add_referral_channel_type : R.strings.edit_referral_channel_type;
        this.buttonText = item == undefined ? R.strings.add : R.strings.update;

        //for focus on next field
        this.inputs = {};
        this.state = {
            isFromUpdate: item == undefined ? false : true,
            id: item == undefined ? '' : item.Id,
            channelTypeName: item == undefined ? '' : item.ChannelTypeName,
            hourlyLimit: item == undefined ? '' : item.HourlyLimit.toString(),
            dailyLimit: item == undefined ? '' : item.DailyLimit.toString(),
            weeklyLimit: item == undefined ? '' : item.WeeklyLimit.toString(),
            monthlyLimit: item == undefined ? '' : item.MonthlyLimit.toString(),
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };
    componentWillMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { loading, addReferralChannelTypeData, editReferralChannelTypeData } = this.props.appData;
        if (addReferralChannelTypeData !== prevProps.appData.addReferralChannelTypeData) {
            if (!loading) {
                if (addReferralChannelTypeData != null) {
                    if (validateResponseNew({ response: addReferralChannelTypeData })) {
                        showAlert(R.strings.status, addReferralChannelTypeData.ReturnMsg, 0, () => {
                            //clear add data
                            this.props.clearData()
                            //----
                            if (this.props.navigation.state.params && this.props.navigation.state.params.onRefresh !== undefined) {
                                //refresh previous screen list
                                this.props.navigation.state.params.onRefresh(true)
                            }
                            //navigate to back scrreen
                            this.props.navigation.goBack()
                        })
                    } else {
                        //clear add data
                        this.props.clearData()
                        //----
                    }
                }
            }
        }

        if (editReferralChannelTypeData !== prevProps.appData.editReferralChannelTypeData) {
            if (!loading) {
                if (editReferralChannelTypeData != null) {
                    if (validateResponseNew({ response: editReferralChannelTypeData })) {
                        showAlert(R.strings.status, editReferralChannelTypeData.ReturnMsg, 0, () => {
                            //clear update data
                            this.props.clearData()
                            //--
                            if (this.props.navigation.state.params && this.props.navigation.state.params.onRefresh !== undefined) {
                                //refresh previous screen list
                                this.props.navigation.state.params.onRefresh(true)
                            }
                            //navigate to back scrreen
                            this.props.navigation.goBack()
                        })
                    } else {
                        //clear add data
                        this.props.clearData()
                        //----
                    }
                }
            }
        }

    }

    onPressSubmit = async () => {
        //check for validations
        if (isEmpty(this.state.channelTypeName)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.channel_type);
        }
        else if (isEmpty(this.state.hourlyLimit)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.hourly_limit);
        }
        else if (isEmpty(this.state.dailyLimit)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.daily_limit);
        }
        else if (isEmpty(this.state.weeklyLimit)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.weekly_limit);
        }
        else if (isEmpty(this.state.monthlyLimit)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.monthly_limit);
        }
        else {
            if (this.state.isFromUpdate) {
                //for edit
                //Check NetWork is Available or not
                if (await isInternet()) {

                    let request = {
                        Id: this.state.id,
                        ChannelTypeName: this.state.channelTypeName,
                        HourlyLimit: parseInt(this.state.hourlyLimit),
                        DailyLimit: parseInt(this.state.dailyLimit),
                        WeeklyLimit: parseInt(this.state.weeklyLimit),
                        MonthlyLimit: parseInt(this.state.monthlyLimit)
                    }
                    // call API  for Updating API
                    this.props.updateReferralChannelType(request);
                }
            } else {
                //for add
                //Check NetWork is Available or not
                if (await isInternet()) {
                    let request = {
                        ChannelTypeName: this.state.channelTypeName,
                        HourlyLimit: parseInt(this.state.hourlyLimit),
                        DailyLimit: parseInt(this.state.dailyLimit),
                        WeeklyLimit: parseInt(this.state.weeklyLimit),
                        MonthlyLimit: parseInt(this.state.monthlyLimit)
                    }
                    // call API  for Adding API
                    this.props.addReferralChannelType(request);
                }
            }
        }
    }
    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }
    //---
    render() {

        let { loading } = this.props.appData
        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={this.headerText} isBack={true} nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* EditText for channelTypeName */}
                            <EditText style={{ marginTop: R.dimens.widgetMargin }}
                                reference={input => { this.inputs['etChannelType'] = input; }}
                                value={this.state.channelTypeName}
                                header={R.strings.channel_type}
                                placeholder={R.strings.channel_type}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(channelTypeName) => this.setState({ channelTypeName })}
                                onSubmitEditing={() => { this.focusNextField('etHourlyLimit') }}
                            />

                            {/* EditText for hourlyLimit */}
                            <EditText
                                reference={input => { this.inputs['etHourlyLimit'] = input; }}
                                value={this.state.hourlyLimit}
                                header={R.strings.hourly_limit}
                                placeholder={R.strings.hourly_limit}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                validate={true}
                                onlyDigit={true}
                                onChangeText={(hourlyLimit) => this.setState({ hourlyLimit })}
                                onSubmitEditing={() => { this.focusNextField('etDailyLimit') }}
                            />

                            {/* EditText for dailyLimit */}
                            <EditText
                                reference={input => { this.inputs['etDailyLimit'] = input; }}
                                value={this.state.dailyLimit}
                                header={R.strings.daily_limit}
                                placeholder={R.strings.daily_limit}
                                keyboardType='numeric'
                                validate={true}
                                onlyDigit={true}
                                returnKeyType={"next"}
                                onChangeText={(dailyLimit) => this.setState({ dailyLimit })}
                                onSubmitEditing={() => { this.focusNextField('etWeeklyLimit') }}
                            />

                            {/* EditText for weeklyLimit */}
                            <EditText
                                reference={input => { this.inputs['etWeeklyLimit'] = input; }}
                                value={this.state.weeklyLimit}
                                header={R.strings.weekly_limit}
                                placeholder={R.strings.weekly_limit}
                                keyboardType='numeric'
                                validate={true}
                                onlyDigit={true}
                                returnKeyType={"next"}
                                onChangeText={(weeklyLimit) => this.setState({ weeklyLimit })}
                                onSubmitEditing={() => { this.focusNextField('etMonthlyLimit') }}
                            />

                            {/* EditText for monthlyLimit */}
                            <EditText
                                reference={input => { this.inputs['etMonthlyLimit'] = input; }}
                                value={this.state.monthlyLimit}
                                header={R.strings.monthly_limit}
                                placeholder={R.strings.monthly_limit}
                                keyboardType='numeric'
                                validate={true}
                                onlyDigit={true}
                                returnKeyType={"done"}
                                onChangeText={(monthlyLimit) => this.setState({ monthlyLimit })}
                            //onSubmitEditing={() => { this.focusNextField('etCallLimit') }}
                            />
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                        {/* Button for submit */}
                        <Button title={this.buttonText}
                            onPress={this.onPressSubmit} />
                    </View>
                </View >
            </SafeView>
        );
    }
    styles = () => {
        return {
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: R.colors.background
            },
        }
    }
}

function mapStateToProps(state) {
    //Updated Data For ReferralChannelTypeReducer Data 
    return {
        appData: state.ReferralChannelTypeReducer,
    }

}

function mapDispatchToProps(dispatch) {
    return {
        //Perform clearData Action 
        clearData: () => dispatch(clearData()),
        //Perform addReferralChannelType Action 
        addReferralChannelType: (request) => dispatch(addReferralChannelType(request)),
        //Perform updateReferralChannelTypes Action 
        updateReferralChannelType: (request) => dispatch(updateReferralChannelType(request)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReferralChannelTypeAddScreen)
