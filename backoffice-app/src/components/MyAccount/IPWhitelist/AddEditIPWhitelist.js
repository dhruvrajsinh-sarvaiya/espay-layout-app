
import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme, getDeviceID, showAlert } from '../../../controllers/CommonUtils';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import Button from '../../../native_theme/components/Button';
import EditText from '../../../native_theme/components/EditText';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import { AddIPToWhitelist, clearIpToWhitelist } from '../../../actions/account/IPWhitelistHistoryActions';
import { connect } from 'react-redux';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import { isCurrentScreen } from '../../Navigation';

export class AddEditIPWhitelist extends Component {

    constructor(props) {
        super(props);

        //define all initial state
        this.state = {
            AliasName: '',
            IpAddress: '',
            MobileIp: '',
        }

        this.inputs = {}

        //create reference
        this.toast = React.createRef();
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated Feild of Particular actions
        const { AddIpToWhitelistData, } = this.props.IPWhitelistResult;

        // check previous props and existing props
        if (AddIpToWhitelistData !== prevProps.IPWhitelistResult.AddIpToWhitelistData) {

            // AddIpToWhitelistData is not null
            if (AddIpToWhitelistData) {
                try {
                    if (this.state.AddIpToWhitelistData == null || (this.state.AddIpToWhitelistData != null && AddIpToWhitelistData !== this.state.AddIpToWhitelistData)) {
                        // Handle Response
                        if (validateResponseNew({ response: AddIpToWhitelistData })) {

                            this.setState({ AddIpToWhitelistData })

                            showAlert(R.strings.Success + '!', AddIpToWhitelistData.ReturnMsg, 0, () => {
                                //clear data
                                this.props.clearIpToWhitelist()
                                this.props.navigation.goBack()
                            })
                        } else {
                            //clear data
                            this.props.clearIpToWhitelist()
                            this.setState({ AddIpToWhitelistData: null })
                        }
                    }
                } catch (error) {
                    //clear data
                    this.props.clearIpToWhitelist()
                    this.setState({ AddIpToWhitelistData: null })
                }
            }
        }
    }

    //This Method Call Add Ip to WhiteList
    onSubmitPress = async () => {

        if (isEmpty(this.state.AliasName)) {
            this.toast.Show(R.strings.aliasNameValidation);
            return;
        }

        if (isEmpty(this.state.IpAddress)) {
            this.toast.Show(R.strings.Please_Enter_IpAddress);
            return;
        }

        //Check Validation IPAddress
        /* if (validateIPaddress(this.state.IpAddress)) {
            this.toast.Show(R.strings.enterValidIpAddress);
            return;
        } */

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Add Ip To Whitelist
            let req = {
                SelectedIPAddress: this.state.IpAddress,
                IpAliasName: this.state.AliasName,
                deviceId: await getDeviceID(),
                mode: ServiceUtilConstant.Mode,
                hostName: ServiceUtilConstant.hostName
                //Note : ipAddress parameter is passed in its saga.
            }
            //call api for Add Ip Address to Whitelist
            this.props.AddIPToWhitelist(req)
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { AddIpToWhitelistLoading, } = this.props.IPWhitelistResult

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.allowIp}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Custom Toast */}
                <CommonToast ref={cmp => this.toast = cmp} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={AddIpToWhitelistLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>


                            {/* To Set Alias Name Value in EditText */}
                            <EditText
                                header={R.strings.aliasName}
                                placeholder={R.strings.aliasName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(item) => this.setState({ AliasName: item })}
                                value={this.state.AliasName}
                                reference={input => { this.inputs['etAliasName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etIpAddress') }}
                            />

                            {/* To S et  Value in EditText */}
                            <EditText
                                header={R.strings.IpAddress}
                                placeholder={R.strings.IpAddress}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                onChangeText={(item) => this.setState({ IpAddress: item })}
                                value={this.state.IpAddress}
                                reference={input => { this.inputs['etIpAddress'] = input; }}
                            />
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={R.strings.add} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get api plan configuration data from reducer
        IPWhitelistResult: state.IPWhitelistHistoryReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({

    //Perform Add Ip To Whitelist Api
    AddIPToWhitelist: (payload) => dispatch(AddIPToWhitelist(payload)),

    // Perform Clear IP To Whitelist
    clearIpToWhitelist: () => dispatch(clearIpToWhitelist()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditIPWhitelist);