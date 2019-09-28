import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import EditText from '../../../native_theme/components/EditText';
import CommonToast from '../../../native_theme/components/CommonToast';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import { getWalletType } from '../../../actions/PairListAction';
import { getBlockUnblockUserAddress, clearUserAddressData } from '../../../actions/Wallet/UserAddressAction';


class UserAddressAddScreen extends Component {
    constructor(props) {
        super(props);

        this.inputs = {}

        this.state = {

            currency: [{ value: R.strings.Please_Select }],
            selectedCurrency: R.strings.Please_Select,
            selectedCurrencyCode: '',

            address: '',
            remark: '',

            statuses: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Block, code: '1' },
                { value: R.strings.UnBlock, code: '2' },
            ],
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',

            blockUnblockData: null,
            walletData: null,
            isFirstTime: true,
        };

        // Create reference
        this.toast = React.createRef();
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //get walletlist 
            this.props.getWalletType();
        }
    };

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
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
        if (UserAddressAddScreen.oldProps !== props) {
            UserAddressAddScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { walletData } = props.data;

            if (walletData) {
                try {
                    //if local walletData state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletData == null || (state.walletData != null && walletData !== state.walletData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: walletData, isList: true })) {
                            let res = parseArray(walletData.Types);

                            //for add walletData
                            for (var walletDatakey in res) {
                                let item = res[walletDatakey];
                                item.value = item.TypeName;
                            }

                            let currency = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, walletData, currency };
                        } else {
                            return { ...state, walletData, currency: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, currency: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { blockUnblockData } = this.props.data
        if (blockUnblockData !== prevProps.data.blockUnblockData) {
            // blockUnblockData is not null
            if (blockUnblockData) {

                try {
                    if (this.state.blockUnblockData == null || (this.state.blockUnblockData != null && blockUnblockData !== this.state.blockUnblockData)) {

                        // Handle Response
                        if (validateResponseNew({ response: blockUnblockData, isList: true })) {
                            // Show success dialog
                            showAlert(R.strings.status, blockUnblockData.ReturnMsg, 0, async () => {

                                this.props.clearUserAddressData()
                                this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                                this.props.navigation.goBack()

                            })
                            this.setState({ blockUnblockData })
                        } else {
                            // Show success dialog
                            showAlert(R.strings.status, R.strings[`apiDestroyErrorCode.${blockUnblockData.ErrorCode}`], 1, () => {
                                this.props.clearUserAddressData()
                            })
                            this.setState({ blockUnblockData: null })
                        }
                    }
                } catch (error) {
                    // clear reducer data
                    this.props.clearUserAddressData()
                    this.setState({ blockUnblockData: null })
                }
            }
        }
    }

    submitData = async () => {

        // validate selected currency is empty or not
        if (this.state.selectedCurrency === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectCurrency);
            return;
        }
        //validation for Input address empty or not 
        if (isEmpty(this.state.address)) {
            this.toast.Show(R.strings.Enter_Address)
            return;
        }
        //validation for Input remark empty or not 
        if (isEmpty(this.state.remark)) {
            this.toast.Show(R.strings.enterRemarks)
            return;
        }
        // validate selected status is empty or not
        if (this.state.selectedStatus === R.strings.Please_Select) {
            this.toast.Show(R.strings.select_status);
            return;
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {

                // Bind Request for block unblock address
                this.request = {
                    ID: 0,
                    Address: this.state.address,
                    WalletTypeId: this.state.selectedCurrencyCode,
                    Status: this.state.selectedStatusCode,
                    Remarks: this.state.remark,
                }
                /*  if (this.state.selectedStatusCode === '2') {
                     this.request = {
                         ...this.request,
                         ID: 0
                     }
                 } */

                // call api getBlockUnblockUserAddress
                this.props.getBlockUnblockUserAddress(this.request)
            }
        }
    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.addUserAddress} isBack={true} nav={this.props.navigation} />

                {/* for progress dialog */}
                <ProgressDialog isShow={this.props.data.walletLoading || this.props.data.blockUnblockLoading} />

                {/* For Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* picker for Currency  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.Currency}
                                searchable={true}
                                array={this.state.currency}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(index, object) => this.setState({ selectedCurrency: index, selectedCurrencyCode: object.ID })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* EditText for Address  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.Address}
                                placeholder={R.strings.Address}
                                onChangeText={(text) => this.setState({ address: text })}
                                value={this.state.address}
                                maxLength={50}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['address'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('remark') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for remarks  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.remarks}
                                maxLength={150}
                                placeholder={R.strings.remarks}
                                onChangeText={(text) => this.setState({ remark: text })}
                                value={this.state.remark}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['remark'] = input; }}
                                returnKeyType={"done"}
                            />

                            {/* picker for status  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.status}
                                array={this.state.statuses}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.add} onPress={this.submitData}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStatToProps(state) {
    //Updated Data For UserAddressReducer Data 
    let data = {
        ...state.UserAddressReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getWalletType Action 
        getWalletType: () => dispatch(getWalletType()),
        // to getBlockUnblockUserAddress
        getBlockUnblockUserAddress: (payload) => dispatch(getBlockUnblockUserAddress(payload)),
        //Perform clearUserAddressData Action 
        clearUserAddressData: () => dispatch(clearUserAddressData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(UserAddressAddScreen);