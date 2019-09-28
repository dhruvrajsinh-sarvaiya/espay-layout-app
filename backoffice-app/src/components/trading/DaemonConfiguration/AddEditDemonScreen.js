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
import { addDaemonData, AddEditDaemonClear, getDaemonData, editDaemonData } from '../../../actions/Trading/DaemonConfigureAction';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../../components/Navigation';
import { showAlert, changeTheme } from '../../../controllers/CommonUtils';
import { isEmpty, validateResponseNew, isInternet, validateNumeric, validateIPaddress, validateURL } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R'
import { TitlePicker } from '../../widget/ComboPickerWidget'
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit Daemon 
class AddEditDemonConfigurationScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        this.inputs = {};

        //item for edit from demonconfigurescreen
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,
            //if edit true get values in edittext else blank value in edit text for add
            ipAddressTitle: edit ? (item.IPAdd) : "",
            port: edit ? (item.PortAdd).toString() : "",
            url: edit ? item.Url : "",

            Status: [
                { value: R.strings.Active, code: 1 },
                { value: R.strings.Inactive, code: 0 }
            ],
            selectedStatus: item ? item.statusStatic : R.strings.Active,
            selectedStatusCode: item ? item.Status : 1,
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

    componentDidUpdate = (prevProps, prevState) => {
        const { addDaemon, editDaemon } = this.props.Listdata;

        if (addDaemon !== prevProps.Listdata.addDaemon) {

            if (addDaemon) {
                try {
                    if (validateResponseNew({ response: addDaemon })) {
                        //if add daemon succcess redirect user to daemon configuration list screen
                        showAlert(R.strings.Success, R.strings.added_msg, 0, () => {
                            this.props.AddEditDaemonClear()
                            this.props.navigation.goBack()
                            this.props.getDaemonData()
                        });
                    } else {
                        this.props.AddEditDaemonClear()
                    }
                } catch (error) {
                    this.props.AddEditDaemonClear()
                }
            }
        }

        if (editDaemon !== prevProps.Listdata.editDaemon) {
            //for show responce of editDaemon data
            if (editDaemon) {
                try {
                    if (validateResponseNew({ response: editDaemon })) {
                        showAlert(R.strings.Success, R.strings.edit_msg, 0, () => {
                            this.props.AddEditDaemonClear()
                            this.props.navigation.goBack()
                            this.props.getDaemonData()
                        });
                    } else {
                        this.props.AddEditDaemonClear()
                    }
                } catch (error) {
                    this.props.AddEditDaemonClear()
                }
            }
        }
    }

    onPress = async (Id) => {
        //validations for Inputs ADD And Edit Daemon
        if (isEmpty(this.state.ipAddressTitle)) {
            this.toast.Show(R.strings.enterIpAddressMsg)
            return;
        }
        if (validateIPaddress(this.state.ipAddressTitle)) {
            this.toast.Show(R.strings.enterValidIpAddress)
            return;
        }
        if (isEmpty(this.state.port)) {
            this.toast.Show(R.strings.enterPort)
            return;
        }
        if (isEmpty(this.state.url)) {
            this.toast.Show(R.strings.enterUrlMsg)
            return;
        }
        if (!validateURL(this.state.url)) {
            this.toast.Show(R.strings.enterValidUrl)
            return;
        }
        Keyboard.dismiss();
        //for edit Request Daemon
        if (this.state.edit) {
            //Check NetWork is Available or not
            if (await isInternet()) {
                let RequestEditDemon = {
                    IPAdd: this.state.ipAddressTitle,
                    PortAdd: this.state.port,
                    Url: this.state.url,
                    Status: this.state.selectedStatusCode,
                    Id: Id
                }

                //call editDaemonData api
                this.props.editDaemonData(RequestEditDemon)
            }
        }
        //for add Request Daemon
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {
                let RequestAddDemon = {
                    IPAdd: this.state.ipAddressTitle,
                    PortAdd: this.state.port,
                    Url: this.state.url,
                    Status: this.state.selectedStatusCode,
                }

                //call addDaemonData api
                this.props.addDaemonData(RequestAddDemon)
            }
        }
    }
    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    //method used to enter only valid numeric port number
    validatePortNumber = (text) => {
        if (text === '') {
            this.setState({ port: '' })
        } else {
            if (validateNumeric(text)) {
                this.setState({ port: text })
            }
        }
    }

    render() {

        const { isAddDaemon, isEditDaemon } = this.props.Listdata;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateDemonTitle : R.strings.AddDaemon}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={isAddDaemon || isEditDaemon} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* Display Data in scrollview */}

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Inputfield for IpAddress */}
                            <EditText
                                isRequired={true}
                                header={R.strings.ipAddressTitle}
                                placeholder={R.strings.ipAddressTitle}
                                onChangeText={(text) => this.setState({ ipAddressTitle: text })}
                                value={this.state.ipAddressTitle}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['ipAddressTitle'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('port') }}
                                blurOnSubmit={false}
                                returnKeyType={"next"}
                            />

                            {/* Inputfield for Port No */}
                            <EditText
                                isRequired={true}
                                header={R.strings.port}
                                placeholder={R.strings.port}
                                onChangeText={(text) => this.validatePortNumber(text)}
                                value={this.state.port}
                                keyboardType={'numeric'}
                                multiline={false}
                                reference={input => { this.inputs['port'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('url') }}
                                blurOnSubmit={false}
                                returnKeyType={"next"}
                            />

                            {/* Inputfield for url */}
                            <EditText
                                isRequired={true}
                                header={R.strings.url}
                                placeholder={R.strings.url}
                                onChangeText={(text) => this.setState({ url: text })}
                                value={this.state.url}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['url'] = input; }}
                                returnKeyType={"done"}
                            />

                            {/* dropdown for status */}
                            <TitlePicker
                                title={R.strings.status}
                                array={this.state.Status}
                                selectedValue={this.state.SelectedStatus}
                                onPickerSelect={(index, object) => {
                                    this.setState({ SelectedStatus: index, selectedStatusCode: object.code })
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                            />
                        </View>
                    </ScrollView>
                </View>
                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                    {/* To Set Add or Edit Button */}
                    <Button title={this.state.edit ? R.strings.update : R.strings.add} onPress={() => this.onPress(this.state.edit ? this.state.item.Id : null)}></Button>
                </View>

            </SafeView>

        );
    }

    //Common Style For From Date and To Date
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
                borderWidth: R.dimens.pickerBorderWidth,
                justifyContent: 'center',
                marginTop: R.dimens.widgetMargin,
            },

        }
    }
}

function mapStateToProps(state) {
    return {
        //Updates Data For daemon configuration
        Listdata: state.daemonConfigureReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for adddaemon api data
        addDaemonData: (RequestAddDemon) => dispatch(addDaemonData(RequestAddDemon)),
        //for editdaemon api data
        editDaemonData: (RequestEditDemon) => dispatch(editDaemonData(RequestEditDemon)),
        //for add edit daemon data clear
        AddEditDaemonClear: () => dispatch(AddEditDaemonClear()),
        //Perform Daemon configuration list Api Data 
        getDaemonData: () => dispatch(getDaemonData()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEditDemonConfigurationScreen)