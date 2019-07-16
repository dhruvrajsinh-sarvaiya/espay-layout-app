import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { getMarginWallets, addLeverageWithWallet, getLeverageBaseCurrency } from '../../actions/Margin/MarginWalletListAction';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, parseIntVal, parseFloatVal, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import CommonToast from '../../native_theme/components/CommonToast';
import Button from '../../native_theme/components/Button';
import R from '../../native_theme/R';
import { TitlePicker } from '../Widget/ComboPickerWidget';
import EditText from '../../native_theme/components/EditText';
import SafeView from '../../native_theme/components/SafeView';

class CreateMarginWallet extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        // data get from previous screen
        let isCreateWallet = props.navigation.state.params && props.navigation.state.params.isCreateWallet

        //Define All State initial state
        this.state = {

            CurrencyItems: [{ value: R.strings.selectCurrency }],
            selectedCurrency: isCreateWallet ? R.strings.selectCurrency : '',

            walletTypeItems: [{ value: R.strings.Select_Wallet }],
            selectedWallet: isCreateWallet ? R.strings.Select_Wallet : '',

            leverageItem: [{ value: '1X', code: 1 },
            { value: '2X', code: 2 },
            { value: '3X', code: 3 },
            { value: '4X', code: 4 },
            { value: '5X', code: 5 },
            { value: '6X', code: 6 },
            { value: '7X', code: 7 },
            { value: '8X', code: 8 },
            { value: '9X', code: 9 }],
            selectedLeverage: '1X',
            leverage: 1,

            Amount: '',
            WalletTypeId: '',
            AccWalletid: '',
            objWalletType: null,
            objeWalletItem: null,

            //This Bit is Used To check User Create Wallet Or AddBalance
            isCreateWallet: isCreateWallet,
            isFirstTime: true,
        };
        //----------
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Leverage Base Currency API
            this.props.getLeverageBaseCurrency();
            //----------
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { AddLevargeRequestFetchData, AddLevargeRequestdata } = this.props;

        // compare response with previous response
        if (AddLevargeRequestdata !== prevProps.AddLevargeRequestdata) {

            //To Check Add Leverage wallet request Data fetch or not
            if (!AddLevargeRequestFetchData) {
                try {
                    if (validateResponseNew({ response: AddLevargeRequestdata })) {
                        this.props.navigation.navigate('ConfirmMarginWalletScreen', { LeverageRequestInfo: AddLevargeRequestdata, WalletTypeId: this.state.WalletTypeId, AccWalletid: this.state.AccWalletid, Amount: this.state.Amount, Leverage: this.state.leverage })
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception
                }
            }
        }
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

        // To Skip Render if old and new props are equal
        if (CreateMarginWallet.oldProps !== props) {
            CreateMarginWallet.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { leverageBaseCoinData, leverageBaseCoinFetchData, WalletListFetchData, WalletListdata } = props;

            //To Check CoinList Api Data Fetch Or Not
            if (!leverageBaseCoinFetchData) {
                try {
                    if (validateResponseNew({ response: leverageBaseCoinData })) {

                        let CurrencyRes = parseArray(leverageBaseCoinData.Data);
                        CurrencyRes.map((item, index) => {
                            CurrencyRes[index].value = item.WalletTypeName;
                        })
                        let currencyItem = [
                            ...state.CurrencyItems,
                            ...CurrencyRes
                        ];
                        return {
                            ...state,
                            CurrencyItems: currencyItem,
                        }
                    } else {
                        return {
                            ...state,
                            CurrencyItems: [{ value: R.strings.selectCurrency }],
                            selectedCurrency: R.strings.selectCurrency,
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        CurrencyItems: [{ value: R.strings.selectCurrency }],
                        selectedCurrency: R.strings.selectCurrency,
                    }
                }
            }

            //To Check WalletList Data Fetch or Not
            if (!WalletListFetchData) {
                try {
                    if (validateResponseNew({ response: WalletListdata })) {

                        let WalletListRes = parseArray(WalletListdata.Wallets);
                        WalletListRes.map((item, index) => {
                            WalletListRes[index].value = item.WalletName + ' [' + item.Balance + ']';
                        })

                        let walletItem = [
                            { value: R.strings.Select_Wallet },
                            ...WalletListRes
                        ];
                        return {
                            ...state,
                            walletTypeItems: walletItem,
                        }
                    }
                    else {
                        return {
                            ...state,
                            walletTypeItems: [{ value: R.strings.Select_Wallet }],
                            selectedWallet: R.strings.Select_Wallet
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        walletTypeItems: [{ value: R.strings.Select_Wallet }],
                        selectedWallet: R.strings.Select_Wallet
                    }
                }
            }
        }
        return null;
    }

    onPostLeveargeRequest = async () => {

        //check for validations
        if (isEmpty(this.state.selectedCurrency) || this.state.selectedCurrency === R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency);
        }
        else if (isEmpty(this.state.selectedWallet) || this.state.selectedWallet === R.strings.Select_Wallet) {
            this.toast.Show(R.strings.Select_Wallet);
        }
        else if (isEmpty(this.state.Amount)) {
            this.toast.Show(R.strings.Enter_Amount);
        }
        else if (isEmpty(this.state.selectedLeverage)) {
            this.toast.Show(R.strings.Enter_Amount);
        }
        else if (parseFloatVal(this.state.Amount) > parseFloatVal(this.state.objeWalletItem.Balance)) {
            this.toast.Show(R.strings.WalletBalanaceValidation);
        } else {

            let WalletTypeId = this.state.objWalletType.WalletTypeId;
            let AccWalletid = this.state.objeWalletItem.AccWalletID;

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Call api for Add Margin In Partucular Wallet
                this.props.addLeverageWithWallet({
                    WalletTypeId: WalletTypeId,
                    AccWalletid: AccWalletid,
                    Amount: parseIntVal(this.state.Amount),
                    Leverage: this.state.leverage,
                });
                //----------
                this.setState({ WalletTypeId, AccWalletid })
            }
        }
    }

    //on Selection of Currency From Drop Down
    onCurrencyChange = async (index, object) => {
        try {
            //To Check Currecny is Selected or Not
            if (index != R.strings.selectCurrency) {

                if (index !== this.state.selectedCurrency) {

                    //Check NetWork is Available or not
                    if (await isInternet()) {

                        //Call Get Wallet List Api 
                        this.props.getMarginWallets({ Coin: index });
                        
                    }
                    this.setState({ selectedCurrency: index, walletTypeItems: [{ value: R.strings.Select_Wallet }], objWalletType: object, selectedWallet: R.strings.Select_Wallet })
                }
            }
            else {
                this.setState({ selectedCurrency: index, selectedWallet: R.strings.Select_Wallet, Amount: '' })
            }
        }
        catch (e) {
            //Catch Code here
            this.setState({ selectedCurrency: index, selectedWallet: R.strings.Select_Wallet, Amount: '' })
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { leverageBaseCoinIsFetching, WalletListIsFetching, AddLevargeRequestIsFetching } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.isCreateWallet ? R.strings.CreateMarginWallet : R.strings.AddLeverage}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* For Progress Dialog */}
                <ProgressDialog isShow={leverageBaseCoinIsFetching || WalletListIsFetching || AddLevargeRequestIsFetching} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{
                    flex: 1,
                    justifyContent: 'space-between',
                }}>

                    <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingTop: R.dimens.widget_top_bottom_margin, paddingBottom: R.dimens.padding_top_bottom_margin, }}>

                            {/* Picker for Wallet Transaction Type */}
                            <TitlePicker
                                style={{
                                    marginTop: R.dimens.widget_top_bottom_margin,
                                }}
                                title={R.strings.Currency}
                                searchable={true}
                                withIcon={true}
                                array={this.state.CurrencyItems}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(index, object) => this.onCurrencyChange(index, object)}
                            />

                            {/* Picker for Wallet Type */}
                            {this.state.selectedCurrency === R.strings.selectCurrency ? null :

                                < TitlePicker
                                    style={{ marginTop: R.dimens.widget_top_bottom_margin, }}
                                    title={R.strings.wallet}
                                    searchable={true}
                                    array={this.state.walletTypeItems}
                                    selectedValue={this.state.selectedWallet}
                                    onPickerSelect={(item, object) => {
                                        // if new item and old item are different
                                        if (item !== this.state.selectedWallet) {
                                            this.setState({ selectedWallet: item, Amount: '', objeWalletItem: object })
                                        }
                                    }}
                                />
                            }

                            {this.state.selectedCurrency === R.strings.selectCurrency ? null :

                                this.state.selectedWallet === R.strings.Select_Wallet ? null :
                                    <View>
                                        <EditText
                                            header={R.strings.Amount}
                                            placeholder={R.strings.Amount}
                                            multiline={false}
                                            keyboardType='numeric'
                                            returnKeyType={"done"}
                                            onChangeText={(Amount) => this.setState({ Amount })}
                                            value={this.state.Amount}
                                            validate={true}
                                        />

                                        < TitlePicker
                                            style={{ marginTop: R.dimens.widget_top_bottom_margin, }}
                                            title={R.strings.LeveragePer}
                                            searchable={false}
                                            array={this.state.leverageItem}
                                            selectedValue={this.state.selectedLeverage}
                                            onPickerSelect={(item, object) => {
                                                // if new item and old item are different
                                                if (item !== this.state.selectedLeverage) {
                                                    this.setState({ selectedLeverage: item, leverage: object.code })
                                                }
                                            }
                                            }
                                        />
                                    </View>
                            }
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Show Button */}
                        <Button title={this.state.isCreateWallet ? R.strings.create : R.strings.add} onPress={this.onPostLeveargeRequest}></Button>
                    </View>
                </View>
            </SafeView>

        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For Get Leverage Base Currency Action
        leverageBaseCoinData: state.MarginWalletListReducer.leverageBaseCoinData,
        leverageBaseCoinFetchData: state.MarginWalletListReducer.leverageBaseCoinFetchData,
        leverageBaseCoinIsFetching: state.MarginWalletListReducer.leverageBaseCoinIsFetching,

        //Updated Data For Get Wallet List
        WalletListFetchData: state.MarginWalletListReducer.WalletListFetchData,
        WalletListIsFetching: state.MarginWalletListReducer.WalletListIsFetching,
        WalletListdata: state.MarginWalletListReducer.WalletListdata,

        //Updated Data For Add Leverage Request
        AddLevargeRequestFetchData: state.MarginWalletListReducer.AddLevargeRequestFetchData,
        AddLevargeRequestIsFetching: state.MarginWalletListReducer.AddLevargeRequestIsFetching,
        AddLevargeRequestdata: state.MarginWalletListReducer.AddLevargeRequestdata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform to Get Leverage Base Currency Action
        getLeverageBaseCurrency: () => dispatch(getLeverageBaseCurrency()),

        //Perfotm Get Wallet List Action
        getMarginWallets: (walletsRequest) => dispatch(getMarginWallets(walletsRequest)),

        //Perfotm Add Leverage Request
        addLeverageWithWallet: (addLevargeRequest) => dispatch(addLeverageWithWallet(addLevargeRequest)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMarginWallet)