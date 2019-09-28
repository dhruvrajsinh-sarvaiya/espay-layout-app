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
import { showAlert, changeTheme, getDeviceID, getIPAddress } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew, validateIPaddress } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import R from '../../../native_theme/R';
import { addIpRange, updateIpRange, clearIpRange } from '../../../actions/account/IpRangeAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit IP range
class AddEditAllowIp extends Component {
    constructor(props) {
        super(props);

        this.inputs = {};

        //item for edit 
        let item = props.navigation.state.params && props.navigation.state.params.item
        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit
        //if redirect from dashboard  
        let fromDashboard = props.navigation.state.params && props.navigation.state.params.fromDashboard

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,
            fromDashboard: fromDashboard,
            startIp: edit ? (item.StartIp).toString() : '',
            endIp: edit ? (item.EndIp).toString() : '',
        }

        // create reference
        this.toast = React.createRef();

        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { addIpRangeData, /* updateIpRangeData */ } = this.props.Listdata;

        //show add response
        if (addIpRangeData !== prevProps.Listdata.addIpRangeData) {
            if (addIpRangeData) {
                if (validateResponseNew({
                    response: addIpRangeData,
                })) {
                    showAlert(R.strings.Success, addIpRangeData.ReturnMsg, 0, () => {

                        //clear data
                        this.props.clearIpRange()
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
                    this.props.clearIpRange()
                }
            }
        }
    }

    onAddEditIP = async (Id) => {

        //check input validations
        if (isEmpty(this.state.startIp)) {
            this.toast.Show(R.strings.enterStartIp)
            return;
        }
        if (validateIPaddress(this.state.startIp)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.validStartIp)
            return;
        }
        if ((this.state.startIp).length > 20) {
            this.toast.Show(R.strings.startIp + ' ' + R.strings.LengthMustBeLessThanTwenty)
            return;
        }
        if (isEmpty(this.state.endIp)) {
            this.toast.Show(R.strings.enterEndIp)
            return;
        }
        if (validateIPaddress(this.state.endIp)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.validEndIp)
            return;
        }
        if ((this.state.endIp).length > 20) {
            this.toast.Show(R.strings.endIp + ' ' + R.strings.LengthMustBeLessThanTwenty)
            return;
        }
        Keyboard.dismiss();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                StartIp: this.state.startIp,
                EndIp: this.state.endIp,
                Mode: ServiceUtilConstant.Mode,
                HostName: ServiceUtilConstant.hostName,
                IPAddress: await getIPAddress(),
                DeviceId: await getDeviceID(),
            }
            //for edit ip range request 
            if (this.state.edit) {
                this.request = {
                    ...this.request,
                    Id: Id,
                }

                //call updateIpRange api
                this.props.updateIpRange(this.request)
            }
            //for add ip range request
            else {
                //call addIpRange api
                this.props.addIpRange(this.request)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {

        const { isAdd, isUpdate } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateIpRange : R.strings.allowIp}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={isAdd || isUpdate} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.padding_top_bottom_margin
                }}>

                    <View style={{ flex: 1 }}>
                        {/* Display Data in scrollview */}
                        <ScrollView showsVerticalScrollIndicator={false} >

                            {/* EditText for startip */}
                            <EditText
                                header={R.strings.enterStartIp}
                                placeholder={R.strings.enterStartIp}
                                onChangeText={(text) => this.setState({ startIp: text })}
                                value={this.state.startIp}
                                keyboardType={'numeric'}
                                multiline={false}
                                reference={input => { this.inputs['startIp'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('endIp') }}
                                blurOnSubmit={false}
                                returnKeyType={"next"}
                            />

                            {/* EditText for endip */}
                            <EditText
                                header={R.strings.enterEndIp}
                                placeholder={R.strings.enterEndIp}
                                onChangeText={(text) => this.setState({ endIp: text })}
                                value={this.state.endIp}
                                keyboardType={'numeric'}
                                multiline={false}
                                reference={input => { this.inputs['endIp'] = input; }}
                                returnKeyType={"done"}
                            />
                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddEditIP(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data ip range 
        Listdata: state.IpRangeReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for add  api data
        addIpRange: (addIpRangeRequest) => dispatch(addIpRange(addIpRangeRequest)),
        //for edit api data
        updateIpRange: (updateIpRangeRequest) => dispatch(updateIpRange(updateIpRangeRequest)),
        //for add edit data clear
        clearIpRange: () => dispatch(clearIpRange()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEditAllowIp)












