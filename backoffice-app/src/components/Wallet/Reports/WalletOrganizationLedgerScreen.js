import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import Button from '../../../native_theme/components/Button'
import { changeTheme, getCurrentDate, parseArray } from '../../../controllers/CommonUtils';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import DatePickerWidget from '../../widget/DatePickerWidget';
import { isCurrentScreen } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { DateValidation } from '../../../validations/DateValidation';
import SafeView from '../../../native_theme/components/SafeView';
import { AppConfig } from '../../../controllers/AppConfig';
import { getWalletType } from '../../../actions/PairListAction';
import { getOrganizationWallets, getOrganizationLedger, clearOrginizationLedger } from '../../../actions/Wallet/OrginizationLedgerAction';

class WalletOrganizationLedgerScreen extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            selectedPage: 0,
            isFirstTime: true,

            currencies: [{ value: R.strings.selectCurrency }],
            selectedCurrency: R.strings.selectCurrency,
            selectedCurrencyCode: '',

            usageTypes: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.tradingWallet, code: '0' },
                { value: R.strings.marketWallet, code: '1' },
                { value: R.strings.coldWallet, code: '2' },
                { value: R.strings.chargeCrWallet, code: '3' },
                { value: R.strings.depositionAdminWallet, code: '4' },
            ],
            selectedUsageType: R.strings.Please_Select,
            selectedUsageTypeCode: '',

            walletes: [{ value: R.strings.Please_Select }],
            selectedWallet: R.strings.Please_Select,
            selectedWalletCode: '',

            WalletData: null,
            ledgerData: null,
            currencyData: null,
        }

        // Create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //get currency 
            this.props.getWalletType();

            //Call Get Wallet List Api 
            this.props.getOrganizationWallets({});
        }
    }

    componentWillUnmount() {

        // clear orginization ledger
        this.props.clearOrginizationLedger();
    }

    shouldComponentUpdate = (nextProps, nextState) => {

        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        //chek old props 
        if (WalletOrganizationLedgerScreen.oldProps !== props) {
            WalletOrganizationLedgerScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { currencyData, WalletData } = props.data;

            // check currencyData fetch or not
            if (currencyData) {
                try {
                    //if local currencyData state is null or its not null and also different then new response then and only then validate response.
                    if (state.currencyData == null || (state.currencyData != null && currencyData !== state.currencyData)) {

                        //if  response is success then store currencyData list else store empty list
                        if (validateResponseNew({ response: currencyData, isList: true })) {
                            let res = parseArray(currencyData.Types);

                            //for add currencyData
                            for (var key in res) {
                                let item = res[key];
                                item.value = item.TypeName;
                            }

                            let currencies = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, currencyData, currencies };
                        } else {
                            return { ...state, currencyData, currencies: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, currencies: [{ value: R.strings.selectCurrency }] };
                }
            }

            // check WalletData fetch or not
            if (WalletData) {
                try {
                    //if local WalletData state is null or its not null and also different then new response then and only then validate response.
                    if (state.WalletData == null || (state.WalletData != null && currencyData !== state.WalletData)) {

                        //if  response is success then store WalletData list else store empty list
                        if (validateResponseNew({ response: WalletData, isList: true })) {
                            let res = parseArray(WalletData.Data);

                            //for add WalletData
                            for (var walletOrgKey in res) {
                                let item = res[walletOrgKey];
                                item.value = item.WalletName;
                            }

                            let walletes = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, WalletData, walletes };
                        } else {
                            return { ...state, WalletData, walletes: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, walletes: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { ledgerData } = this.props.data;

        // compare response with previous response
        if (ledgerData !== prevProps.data.ledgerData) {

            // check ledgerData fetch or not
            if (ledgerData != null) {
                try {
                    if (validateResponseNew({ response: ledgerData })) {

                        let res = parseArray(ledgerData.WalletLedgers);

                        // If get response is not null than redirect to details screen and set data to ledger screen  
                        this.props.navigation.navigate('WalletOrganizationLedgerListScreen',
                            {
                                item: res,
                                allData: ledgerData,
                                FromDate: this.state.FromDate,
                                ToDate: this.state.ToDate,
                                WalletId: this.state.selectedWalletCode,
                            })

                        //for clear Orginization ledger data from Reducer
                        this.props.clearOrginizationLedger();

                    } else {
                        //for clear Orginization ledger data from Reducer
                        this.props.clearOrginizationLedger();
                    }
                } catch (e) {
                    //for clear Orginization ledger data from Reducer F
                    this.props.clearOrginizationLedger();
                }
            }
        }
    };

    //check validation and pass data and call api and internet condition
    submitWalletOrgLedger = async () => {

        //Check All From Date Validation 
        if (DateValidation(this.state.FromDate, this.state.ToDate, true, 2)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true, 2));
            return;
        }

        // validate selected wallet is empty or not
        if (this.state.selectedWallet === R.strings.Please_Select || this.state.selectedWalletCode === '') {
            this.toast.Show(R.strings.Select_Wallet);
            return;
        }

        else {
            //Check NetWork is Available or not
            if (await isInternet()) {

                // Bind Request for ledger data
                let requestLedgerdata = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    AccWalletId: this.state.selectedWalletCode,
                    PageNo: this.state.selectedPage,
                    PageSize: AppConfig.pageSize
                }
                // call api for margin Wallet ledger
                this.props.getOrganizationLedger(requestLedgerdata)
            }
        }
    }

    OnChangeCurrency = async (index, item) => {

        try {
            //To Check User is Selected or Not
            if (index != R.strings.selectCurrency) {

                this.setState({
                    selectedCurrency: index,
                    selectedCurrencyCode: item.ID,
                    selectedWallet: R.strings.Please_Select,
                    selectedWalletCode: '',
                })

                //Check NetWork is Available or not
                if (await isInternet()) {

                    //Call Get Wallet List Api 
                    this.props.getOrganizationWallets({ WalletTypeId: item.ID, WalletUsageType: this.state.selectedUsageTypeCode });
                }
            }
            else {
                this.setState({
                    selectedCurrencyCode: '', selectedCurrency: index, selectedWallet: R.strings.Please_Select,
                    selectedWalletCode: '',
                })
            }
        }
        catch (e) {
            //Catch Code here
            this.setState({
                selectedCurrencyCode: '', selectedCurrency: index, selectedWallet: R.strings.Please_Select,
                selectedWalletCode: '',
                F
            })
        }
    }

    onChangeUsageType = async (index, item) => {
        try {
            //To Check Currecny is Selected or Not
            if (index != R.strings.Please_Select) {

                this.setState({
                    selectedUsageType: index,
                    selectedUsageTypeCode: item.code,
                    selectedWallet: R.strings.Please_Select,
                    selectedWalletCode: '',
                })

                //Check NetWork is Available or not
                if (await isInternet()) {

                    //Call Get Wallet List Api 
                    this.props.getOrganizationWallets({ WalletTypeId: this.state.selectedCurrencyCode, WalletUsageType: item.code });

                }
            }
            else {
                this.setState({
                    selectedUsageType: index, selectedUsageTypeCode: '', selectedWallet: R.strings.Please_Select,
                    selectedWalletCode: '',
                })
            }
        }
        catch (e) {
            //Catch Code here
            this.setState({
                selectedUsageType: index, selectedUsageTypeCode: '', selectedWallet: R.strings.Please_Select,
                selectedWalletCode: '',
            })
        }
    }

    render() {

        //loading bit for handling progress dialog
        const { walletLoading, ledgerLoading, currencyLoading } = this.props.data;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.organizationLedger} isBack={true} nav={this.props.navigation} />

                {/* for progress dialog */}
                <ProgressDialog isShow={walletLoading || ledgerLoading || currencyLoading} />

                {/* For Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* DatePicker for FromDate and ToDate */}
                            <DatePickerWidget
                                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                                FromDate={this.state.FromDate}
                                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                                ToDate={this.state.ToDate} />

                            {/* picker for currency */}
                            <TitlePicker
                                title={R.strings.Currency}
                                searchable={true}
                                array={this.state.currencies}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(index, object) => {
                                    this.OnChangeCurrency(index, object)
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* picker for usageType */}
                            <TitlePicker
                                title={R.strings.usageType}
                                array={this.state.usageTypes}
                                selectedValue={this.state.selectedUsageType}
                                onPickerSelect={(index, object) => {
                                    this.onChangeUsageType(index, object)
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* picker for wallet */}
                            <TitlePicker
                                title={R.strings.wallet}
                                searchable={true}
                                array={this.state.walletes}
                                selectedValue={this.state.selectedWallet}
                                onPickerSelect={(index, object) => this.setState({ selectedWallet: index, selectedWalletCode: object.AccWalletId })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.submit} onPress={this.submitWalletOrgLedger}></Button>
                    </View>

                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    //Updated Data For OrginizationLedgerReducer Data 
    let data = {
        ...state.OrginizationLedgerReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform  getWalletType Action
        getWalletType: () => dispatch(getWalletType()),
        //Perform  getOrganizationWallets Action
        getOrganizationWallets: (request) => dispatch(getOrganizationWallets(request)),
        //Perform  getOrganizationLedger Action
        getOrganizationLedger: (request) => dispatch(getOrganizationLedger(request)),
        //clear data
        clearOrginizationLedger: () => dispatch(clearOrginizationLedger()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletOrganizationLedgerScreen)