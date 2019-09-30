import {
    View,
    ScrollView,
    Keyboard,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import Picker from '../../../native_theme/components/Picker';
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, getDeviceID, getIPAddress } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import R from '../../../native_theme/R';
import { addSLAConfiguration, editSLAConfiguration, clearSlaConfig } from '../../../actions/account/SlaConfigPriorityAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import SafeView from '../../../native_theme/components/SafeView';


//Create Common class for Add Edit Transaction policy 
class AddEditSlaConfigPriority extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        this.inputs = {};

        //item for edit 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //chek screen is from dashboard or list
        let fromDashboard = props.navigation.state.params && props.navigation.state.params.fromDashboard

        if (edit) {
            let itemPriorityTime = item.PriorityTime;
            var splits = itemPriorityTime.split(/(\d+)/); // seprate integer
            var priorityTime = splits[1];
            var selectedPriority = itemPriorityTime.replace(/[0-9]/g, '').trim(); //seprate string 
        }

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,
            fromDashboard: fromDashboard,
            //if edit true get values in edittext else blank value in edit text for add
            priorityName: edit ? (item.Priority) : "",
            priorityTime: edit ? priorityTime : "",
            priority: [{ value: R.strings.hours }, { value: R.strings.minutes }, { value: R.strings.days }],
            selectedPriority: edit ? selectedPriority : R.strings.hours,
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = async (prevProps, prevState) => {

        const { addSlaConfigData, updateSlaConfigData } = this.props.Listdata;

        if (addSlaConfigData !== prevProps.Listdata.addSlaConfigData) {
            // for show responce add
            if (addSlaConfigData) {
                if (validateResponseNew({
                    response: addSlaConfigData,
                })) {
                    showAlert(R.strings.Success, addSlaConfigData.ReturnMsg, 0, () => {
                        //clear data
                        this.props.clearSlaConfig()
                        if (!this.state.fromDashboard) {
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        }
                        else {
                            this.props.navigation.goBack()
                        }
                    });
                } else {
                    //clear data
                    this.props.clearSlaConfig()
                }
            }
        }

        if (updateSlaConfigData !== prevProps.Listdata.updateSlaConfigData) {
            // for show responce update
            if (updateSlaConfigData) {
                if (validateResponseNew({
                    response: updateSlaConfigData
                })) {
                    showAlert(R.strings.Success, updateSlaConfigData.ReturnMsg, 0, () => {
                        this.props.clearSlaConfig()
                        this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                        this.props.navigation.goBack()
                    });
                } else {
                    this.props.clearSlaConfig()
                }
            }

        }
    }

    onAddEditSlaPriority = async (Id) => {

        //inputs validations
        if (isEmpty(this.state.priorityName)) {
            this.toast.Show(R.strings.enterPriorityName)
            return;
        }
        if ((this.state.priorityName).length > 50) {
            this.toast.Show(R.strings.priorityNameLength)
            return;
        }
        if (isEmpty(this.state.priorityTime)) {
            this.toast.Show(R.strings.enterPriorityTime)
            return;
        }
        if ((this.state.priorityTime + ' ' + this.state.selectedPriority).length > 50) {
            this.toast.Show(R.strings.priorityTimeLength)
            return;
        }

        Keyboard.dismiss();

        let priorityTime = this.state.priorityTime + ' ' + this.state.selectedPriority
        //for edit 
        if (this.state.edit) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                let updateSlaConfigRequest = {
                    Id: this.state.item.Id, // id is complalsary for edit
                    Priority: this.state.priorityName,
                    PriorityTime: priorityTime,
                }

                //call editSLAConfiguration api
                this.props.editSLAConfiguration(updateSlaConfigRequest)
            }
        }

        //for add Request 
        else {

            //Check NetWork is Available or not
            if (await isInternet()) {
                let addSlaConfigRequest = {
                    Priority: this.state.priorityName,
                    PriorityTime: priorityTime,
                    DeviceId: await getDeviceID(),
                    Mode: ServiceUtilConstant.Mode,
                    IPAddress: await getIPAddress(),
                    HostName: ServiceUtilConstant.hostName,
                }

                //call addSLAConfiguration api
                this.props.addSLAConfiguration(addSlaConfigRequest)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {

        const { isAddSlaConfig, isUpdateSlaConfig } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.UpdatePriority : R.strings.AddPriority}
                    isBack={true}
                    nav={this.props.navigation}

                />
                {/* Progress Dialog */}
                <ProgressDialog isShow={isAddSlaConfig || isUpdateSlaConfig} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.padding_top_bottom_margin
                }}>

                    <View style={{ flex: 1 }}>
                        {/* Display Data in scrollview */}
                        <ScrollView showsVerticalScrollIndicator={false} >

                            {/* Edittext for priorityName */}
                            <EditText
                                header={R.strings.priorityName}
                                placeholder={R.strings.priorityName}
                                onChangeText={(text) => this.setState({ priorityName: text })}
                                value={this.state.priorityName}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['priorityName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('priorityTime') }}
                                blurOnSubmit={false}
                                returnKeyType={"next"}
                            />

                            {/* Edittext for priorityTime */}
                            <EditText
                                header={R.strings.priorityTime}
                                placeholder={R.strings.priorityTime}
                                onChangeText={(text) => this.setState({ priorityTime: text })}
                                value={this.state.priorityTime}
                                keyboardType={'numeric'}
                                multiline={false}
                                reference={input => { this.inputs['priorityTime'] = input; }}
                                returnKeyType={"done"}
                                validate={true}
                                onlyDigit={true}
                            />

                            {/* show for type */}
                            <TextViewMR style={{
                                marginLeft: R.dimens.LineHeight,
                                color: R.colors.textPrimary, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin
                            }}>
                                {R.strings.type}</TextViewMR>

                            {/* picker for priority */}
                            <Picker
                                cardStyle={{ marginTop: R.dimens.CardViewElivation }}
                                ref='Status'
                                data={this.state.priority}
                                value={this.state.selectedPriority}
                                onPickerSelect={(index) => {
                                    this.setState({ selectedPriority: index })
                                }}
                                displayArrow={'true'}
                                width={'100%'}
                            />
                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddEditSlaPriority(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>

        );
    }

    //Common Style 
    styles = () => {
        return {
            item: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 30,
                margin: 2,
                borderColor: '#2a4944',
                borderWidth: 1,
                backgroundColor: '#d2f7f1'
            },
            boxstyle: {
                height: R.dimens.ButtonHeight,
                borderColor: R.colors.textPrimary,
                borderWidth: R.dimens.normalizePixels(1),
                justifyContent: 'center',
                marginTop: R.dimens.widgetMargin,
            },

        }
    }
}


function mapStateToProps(state) {
    return {
        //Updated Data sla config priority
        Listdata: state.SlaConfigPriorityReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for add  api data
        addSLAConfiguration: (addSlaConfigRequest) => dispatch(addSLAConfiguration(addSlaConfigRequest)),
        //for edit api data
        editSLAConfiguration: (updateSlaConfigRequest) => dispatch(editSLAConfiguration(updateSlaConfigRequest)),
        //for add edit data clear
        clearSlaConfig: () => dispatch(clearSlaConfig()),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEditSlaConfigPriority)












