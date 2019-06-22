import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import {
    addIPAddress,
    clearApikeyData
} from '../../actions/ApiKey/ApiKeyAction';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import Button from '../../native_theme/components/Button';
import EditText from '../../native_theme/components/EditText';
import { changeTheme, showAlert, getIPAddress, getCurrentDate } from '../../controllers/CommonUtils';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { isEmpty, isInternet, validateResponseNew, validateGoogleAuthCode, validateIPaddress, } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../../components/Navigation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import CommonToast from '../../native_theme/components/CommonToast';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class ApiKeyWhiteListAddScreen extends Component {

    constructor(props) {
        super(props)

        // Get Data From Previous Screen
        let PlanID = props.navigation.state.params && props.navigation.state.params.PlanID;
        let KeyId = props.navigation.state.params && props.navigation.state.params.KeyId;
        let isStatic = props.navigation.state.params && props.navigation.state.params.isStatic;
        let whitelistArray = props.navigation.state.params && props.navigation.state.params.whitelistArray;

        //for focus on next field
        this.inputs = {};

        //Define All initial State
        this.state = {
            aliasName: '',
            ipAddress: '',
            planId: PlanID,
            KeyId: KeyId,
            currentIp: '',
            isStatic,
            whitelistArray,
            isConcurrentIp: true,
            isWhiteListIp: false,
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        this.setState({ currentIp: await getIPAddress() })
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { addIPAddressData } = this.props.appData;

        if (addIPAddressData !== prevProps.addIPAddressData) {

            //To Check data is available or not
            if (addIPAddressData) {
                try {
                    if (validateResponseNew({ response: addIPAddressData })) {
                        showAlert(R.strings.Success + '!', addIPAddressData.ReturnMsg, 0, onPress = () => {
                            //clear data
                            this.props.clearApikeyData();
                            //----
                            //refresh previous screen list
                            this.props.navigation.state.params.onRefresh(true);
                            //navigate to back scrreen
                            this.props.navigation.goBack()
                        })
                    } else {
                        //clear data
                        this.props.clearApikeyData();
                        //----
                    }
                } catch (e) {
                    //clear data
                    this.props.clearApikeyData();
                    //----
                }
            }
        }
    }

    onPressSubmit = async () => {

        if (isEmpty(this.state.aliasName)) {
            this.refs.Toast.Show(R.strings.enter + ' ' + R.strings.alias_name);
        }
        else if (isEmpty(this.state.ipAddress)) {
            this.refs.Toast.Show(R.strings.enter + ' ' + R.strings.IpAddress);
        } else if (!this.state.isWhiteListIp && !this.state.isConcurrentIp) {
            this.refs.Toast.Show(R.strings.select + ' ' + R.strings.ip_type);
        }
        else if (validateIPaddress(this.state.ipAddress)) {
            this.refs.Toast.Show(R.strings.enter_proper + ' ' + R.strings.IpAddress);
        }
        else {
            if (await isInternet()) {
                //module not static then call for api otherwise handle adding whitelist at our side
                if (this.state.isStatic) {
                    showAlert(R.strings.Success + '!', R.strings.added_msg, 0, onPress = () => {
                        let generateResponse = {
                            ID: 0,
                            AliasName: this.state.aliasName,
                            IPAddress: this.state.ipAddress,
                            CreatedDate: getCurrentDate(),
                            IPType: this.state.isWhiteListIp ? 1 : 2
                        }
                        //refresh previous screen list
                        this.props.navigation.state.params.getResponseFromAdd(generateResponse);

                        //navigate to back scrreen
                        this.props.navigation.goBack()
                    })
                } else {
                    let tempArray = this.state.whitelistArray;

                    tempArray.map((item, index) => {
                        tempArray[index].ID = item.IPId;
                        delete tempArray[index].IPId
                    })
                    tempArray.push({
                        ID: 0,
                        AliasName: this.state.aliasName,
                        IPAddress: this.state.ipAddress,
                        IPType: this.state.isWhiteListIp ? 1 : 2
                    })
                    //call api for add whitelisted ip
                    const request = {
                        PlanID: this.state.planId,
                        APIKeyID: this.state.KeyId,
                        IPList: tempArray
                    }
                    this.props.addIPAddress(request)
                }
            }
        }
    }

    validateGoogleCode = (text) => {
        //Validate Google Auth Code for 6 digits.
        if (validateGoogleAuthCode(text)) {
            this.setState({ googleAuthCode: text })
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }
    //---

    render() {
        let { addIPLoading } = this.props.appData
        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.whitelist_ip_address}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* To Set ProgressDialog as per out theme */}
                <ProgressDialog isShow={addIPLoading} />

                {/* To Set CommonToast as per out theme */}
                <CommonToast ref="Toast" />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            <TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.your_current_ip_address} :
                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}> {this.state.currentIp}</TextViewHML>
                            </TextViewMR>
                            <EditText
                                reference={input => { this.inputs['etAliasName'] = input; }}
                                value={this.state.aliasName}
                                header={R.strings.alias_name}
                                placeholder={R.strings.alias_name}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(aliasName) => this.setState({ aliasName })}
                                onSubmitEditing={() => { this.focusNextField('etIpAddress') }}
                            />

                            <EditText
                                reference={input => { this.inputs['etIpAddress'] = input; }}
                                value={this.state.ipAddress}
                                header={R.strings.IpAddress}
                                placeholder={R.strings.IpAddress}
                                multiline={false}
                                keyboardType={'numeric'}
                                returnKeyType={"done"}
                                onChangeText={(ipAddress) => this.setState({ ipAddress })}
                            //onSubmitEditing={() => { this.focusNextField('etApiUserName') }}
                            />
                            <TextViewMR style={[this.styles().titleItem, { color: R.colors.textPrimary, marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.LineHeight }]}>{R.strings.ip_type}</TextViewMR>
                            <ImageButton
                                disabled={this.state.isConcurrentIp}
                                name={R.strings.concurrent_ip}
                                icon={this.state.isConcurrentIp ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                                onPress={() => this.setState({ isConcurrentIp: true, isWhiteListIp: false })}
                                style={{ marginBottom: 0, marginTop: R.dimens.CardViewElivation, marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row-reverse', alignSelf: 'flex-start', }}
                                textStyle={{ marginLeft: R.dimens.CardViewElivation, color: R.colors.textPrimary }}
                                iconStyle={{ tintColor: this.state.isConcurrentIp ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                            />
                            <ImageButton
                                disabled={this.state.isWhiteListIp}
                                name={R.strings.whitelist_ip}
                                icon={this.state.isWhiteListIp ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                                onPress={() => this.setState({ isWhiteListIp: true, isConcurrentIp: false })}
                                style={{ marginBottom: R.dimens.widgetMargin, marginTop: R.dimens.CardViewElivation, marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row-reverse', alignSelf: 'flex-start', }}
                                textStyle={{ marginLeft: R.dimens.CardViewElivation, color: R.colors.textPrimary }}
                                iconStyle={{ tintColor: this.state.isWhiteListIp ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                            />
                            <TextViewMR style={[this.styles().titleItem, { marginLeft: R.dimens.LineHeight, color: R.colors.textPrimary }]}>{R.strings.note_text} : </TextViewMR>
                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.yellow, marginLeft: R.dimens.LineHeight }}>{R.strings.add_whitelist_ip_security_message}</TextViewHML>
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.submit}
                            onPress={this.onPressSubmit} />
                    </View>
                </View >
            </SafeView >
        );
    }
    styles = () => {
        return {
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: R.colors.background
            },
            titleItem: {
                fontSize: R.dimens.smallestText,
                color: R.colors.textSecondary,
                marginTop: R.dimens.widgetMargin
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        appData: state.ApiKeyReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for generating api key
        addIPAddress: (request) => dispatch(addIPAddress(request)),
        clearApikeyData: () => dispatch(clearApikeyData()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ApiKeyWhiteListAddScreen)
