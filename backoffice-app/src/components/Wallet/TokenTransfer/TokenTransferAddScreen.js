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
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, parseFloatVal, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty, isHtmlTag, isScriptTag } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { ClearTokenTransferData } from '../../../actions/Wallet/TokenTransferAction';
import { getWalletType } from '../../../actions/PairListAction';
import LostGoogleAuthWidget from '../../widget/LostGoogleAuthWidget';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit WalletTypes
class TokenTransferAddScreen extends Component {

    constructor(props) {
        super(props);

        //Create Reference  
        this.inputs = {}

        //Define All State initial state
        this.state = {
            tblAmount: '',
            walletTypes: [{ value: R.strings.selectCurrency }],
            selectedWalletType: R.strings.selectCurrency,
            selectedWalletTypeCode: '',
            remarks: '',
            address: '',
            isFirstTime: true,
            walletTypeState: null,
            askTwoFA: false,
            addRequest: {}
        };

        // Create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (await isInternet()) {

            //to get currency list
            this.props.getWalletType();
        }
    }

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
        if (TokenTransferAddScreen.oldProps !== props) {
            TokenTransferAddScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            const { walletType } = props.Listdata;

            if (walletType) {
                try {
                    //if local walletType state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletTypeState == null || (state.walletTypeState != null && walletType !== state.walletTypeState)) {

                        //if  response is success then store walletType list else store empty list
                        if (validateResponseNew({ response: walletType, isList: true })) {
                            let res = parseArray(walletType.Types);

                            //for add transactionTypes
                            for (var key in res) {
                                let item = res[key];
                                item.value = item.TypeName;
                            }

                            let walletTypes = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, walletTypeState: walletType, walletTypes };
                        } else {
                            return { ...state, walletTypeState: walletType, walletTypes: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, walletTypes: [{ value: R.strings.selectCurrency }] };
                }
            }

        }
        return null;
    }


    async componentDidUpdate(prevProps, prevState) {

        const { addData } = this.props.Listdata;

        if (addData !== prevProps.Listdata.addData) {
            // for show responce add
            if (addData) {
                try {
                    if (validateResponseNew({
                        response: addData,
                    })) {
                        showAlert(R.strings.Success, R.strings.insertSuccessFully, 0, () => {
                            this.props.ClearTokenTransferData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.ClearTokenTransferData()
                    }
                } catch (e) {
                    this.props.ClearTokenTransferData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onPress = async () => {

        //validations for Inputs 

        if (isEmpty(this.state.tblAmount)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.Amount)
            return;
        }

        if (this.state.selectedWalletType == R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
            return;
        }

        if (isEmpty(this.state.address)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.toAddress)
            return;
        }

        if (isHtmlTag(this.state.address)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.toAddress)
            return;
        }

        if (isScriptTag(this.state.address)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.toAddress)
            return;
        }

        if (isEmpty(this.state.remarks)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.remarks)
            return;
        }

        if (isHtmlTag(this.state.remarks)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.remarks)
            return;
        }

        if (isScriptTag(this.state.remarks)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.remarks)
            return;
        }


        Keyboard.dismiss();

        if (await isInternet()) {
            //send add request to google auth Lost Widget
            this.request = {
                FromWalletTypeID: parseFloatVal(this.state.selectedWalletTypeCode),
                ToAddress: this.state.address,
                Amount: parseFloatVal(this.state.tblAmount),
                Remarks: this.state.remarks,
            }

            this.setState(
                { addRequest: this.request, askTwoFA: true, })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // stop twice api call
        return isCurrentScreen(nextProps);
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { addLoading, isWalletType } = this.props.Listdata;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.addTokenTransfer}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addLoading || isWalletType} />

                {/* for common toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.widget_top_bottom_margin
                }}>

                    <View style={{ flex: 1 }}>

                        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>

                            {/* EditText for Amount */}
                            <EditText
                                isRequired={true}
                                validate={true}
                                onlyDigit={true}
                                header={R.strings.Amount}
                                reference={input => { this.inputs['Amount'] = input; }}
                                placeholder={R.strings.Amount}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ tblAmount: Label })}
                                onSubmitEditing={() => { this.focusNextField('remark') }}
                                value={this.state.tblAmount}
                            />

                            {/* picker for Currency  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.Currency}
                                array={this.state.walletTypes}
                                selectedValue={this.state.selectedWalletType}
                                onPickerSelect={(index, object) => this.setState({ selectedWalletType: index, selectedWalletTypeCode: object.ID })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* EditText for remarks  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.remarks}
                                maxLength={150}
                                placeholder={R.strings.remarks}
                                onChangeText={(text) => this.setState({ remarks: text })}
                                value={this.state.remarks}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['remark'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('address') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for Address  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.toAddress}
                                maxLength={50}
                                placeholder={R.strings.toAddress}
                                onChangeText={(text) => this.setState({ address: text })}
                                value={this.state.address}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['address'] = input; }}
                                returnKeyType={"done"}
                            />

                            <LostGoogleAuthWidget
                                generateTokenApi={7}
                                navigation={this.props.navigation}
                                isShow={this.state.askTwoFA}
                                ApiRequest={this.state.addRequest}
                                onShow={() => this.setState({ askTwoFA: true })}
                                onCancel={() => this.setState({ askTwoFA: false })}
                            />


                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={R.strings.Add} onPress={() => this.onPress()}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated TokenTransferReducer  
        Listdata: state.TokenTransferReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for Currency list action 
        getWalletType: () => dispatch(getWalletType()),
        //for add  data clear
        ClearTokenTransferData: () => dispatch(ClearTokenTransferData()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TokenTransferAddScreen)