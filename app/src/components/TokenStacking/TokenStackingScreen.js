import React, { Component } from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import Button from '../../native_theme/components/Button'
import { isCurrentScreen } from '../Navigation';
import Picker from '../../native_theme/components/Picker';
import { changeTheme, showAlert, parseIntVal, parseArray, parseFloatVal } from '../../controllers/CommonUtils';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isInternet, isEmpty, validateResponseNew } from '../../validations/CommonValidation';
import { getWalletTypeMaster } from '../../actions/PairListAction';
import ImageButton from '../../native_theme/components/ImageTextButton';
import EditText from '../../native_theme/components/EditText';
import { GetSlabList, OnDropdownChange, getPreConfirmationDetails } from '../../actions/Wallet/TockenStackingAction';
import { getWallets } from '../../actions/Wallet/WithdrawAction';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

class TokenStackingScreen extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            selectedCoin: R.strings.Please_Select,
            StackingType: 1,
            etAmount: '',
            CurrencyTypeID: '',
            SelectedPlan: '',
            WalletName: '',
            AvailableAmount: '',
            accWalletID: '',
            SlabType: 2,
            isFirstTime: true,
            walletItems: [],
            CurrencyList: [],
            Plans: [],
            AvailableAmounts: [],
            PolicyDetailIDs: [],
        }

        //To Bind All Method
        this.onWalletChange = this.onWalletChange.bind(this);
        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onStakingTypeChange = this.onStakingTypeChange.bind(this);
        this.onGetQuoteButtonPress = this.onGetQuoteButtonPress.bind(this);
        this.onPlanChange = this.onPlanChange.bind(this);
        this.RedirectTokenHistory = this.RedirectTokenHistory.bind(this);
        //----------

        //Variable used For Get Slab List Method
        this.slabListItems = [];
        //------------

    }

    //on Selection of Currency From Drop Down
    onWalletChange = async (index, object) => {
        this.props.OnDropdownChange();
        try {
            //Chcek if Item is Select From Select Wallet DropDown
            if (this.refs.spSelectWallet != null) {

                //Store Update DropDown Item and Perform Wallet Change Action For Update Item
                this.setState({ accWalletID: object.AccWalletID, WalletName: index })
            }
        }
        catch (e) { }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Currency List
            this.props.getWalletTypeMaster();
            //----------
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated fields of Particular actions
        const { PreReqData, PreReqFetchData,
            SlabListFetchData, SlabListdata } = this.props;

        // compare response with previous response
        if (PreReqData !== prevProps.PreReqData) {

            //To Check Pre Request Data Fetch or Not
            if (!PreReqFetchData) {
                try {
                    //Get Withdraw Request Api STMSG
                    if (validateResponseNew({ response: PreReqData })) {
                        if (this.state.SlabType == 1) {
                            this.props.navigation.navigate('TokenStakingDetailScreen', { Data: PreReqData, AccWalletID: this.state.accWalletID, Amount: (parseFloatVal(this.state.AvailableAmount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.AvailableAmount).toFixed(8) : '') })
                        } else {
                            this.props.navigation.navigate('TokenStakingDetailScreen', { Data: PreReqData, AccWalletID: this.state.accWalletID, Amount: this.state.etAmount })
                        }
                    }
                }
                catch (error) { }
            }
        }

        if (SlabListdata !== prevProps.SlabListdata) {
            //Check Slab List Data
            if (!SlabListFetchData) {
                try {
                    if (validateResponseNew({ response: SlabListdata, isList: true })) {
                        //IF Success then handle in getDericedStateFromProps Method
                    } else {

                        // To display failure dialog
                        showAlert(R.strings.failure + '!', SlabListdata.ReturnMsg, 1);
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
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
        if (TokenStackingScreen.oldProps !== props) {
            TokenStackingScreen.oldProps = props;
        } else {
            return null;
        }

        // Check for current Screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { WalletData, WalletFetchData,
                WalletListFetchData, WalletListData,
                SlabListFetchData, SlabListdata } = props;

            //To Check Get Get Wallet Api Data Fetch Or Not
            if (!WalletFetchData) {
                try {
                    if (validateResponseNew({ response: WalletData, isList: true })) {
                        //Store Api Response field and display in Screen.
                        let res = parseArray(WalletData.Wallets)

                        // To store response for picker
                        res.map((item, index) => {
                            res[index].value = item.WalletName + ' [' + item.Balance + ']'
                        })
                        return {
                            ...state,
                            WalletItems: res,
                            WalletName: res[0].WalletName + ' [' + res[0].Balance + ']',
                            accWalletID: res[0].AccWalletID,
                        }
                    } else {
                        return {
                            ...state,
                            WalletName: '',
                            accWalletID: '',
                            walletItems: [],
                        }
                    }
                }
                catch (error) {
                    return {
                        ...state,
                        WalletName: '',
                        accWalletID: '',
                        walletItems: [],
                    }
                }
            }

            //To Check Currency List Api Data Fetch Or Not
            if (!WalletListFetchData) {
                try {
                    if (validateResponseNew({ response: WalletListData, isList: true })) {
                        //Store Api Response Felid and display in Screen.
                        let res = parseArray(WalletListData.walletTypeMasters)

                        // Store Response for picker
                        res.map((item, index) => {
                            res[index].value = item.CoinName
                        })

                        let CurrencyList = [{ value: R.strings.Please_Select }, ...res,]

                        return { ...state, CurrencyList: CurrencyList, }
                    }
                    else {
                        return { ...state, CurrencyList: [{ value: R.strings.Please_Select }], }
                    }
                } catch (e) {
                    return { ...state, CurrencyList: [{ value: R.strings.Please_Select }], }
                    //Handle Catch and Notify User to Exception.
                }
            }

            //Check Slab List Data
            if (!SlabListFetchData) {
                try {
                    if (validateResponseNew({ response: SlabListdata, isList: true })) {

                        let PolicyDetailIDs = [];
                        let AvailableAmounts = [];
                        let SlabType = [];
                        let Plans = [];

                        // loop for slablist data details array
                        for (var i = 0; i < SlabListdata.Details.length; i++) {

                            //let item = SlabListdata.Details[i].MakerCharges + ' ' + R.strings.Marker + ' - ' + SlabListdata.Details[i].TakerCharges + ' ' + R.strings.Taker;
                            let item = [];

                            if (SlabListdata.Details[i].SlabType == 1) {
                                item = parseFloatVal(SlabListdata.Details[i].AvailableAmount).toFixed(8);
                                AvailableAmounts.push(parseFloatVal(SlabListdata.Details[i].AvailableAmount).toFixed(8));
                            } else {
                                item = parseFloatVal((SlabListdata.Details[i].AvailableAmount).split('-')[0]).toFixed(8) + '-' + parseFloatVal((SlabListdata.Details[i].AvailableAmount).split('-')[1]).toFixed(8);
                                AvailableAmounts.push(parseFloatVal((SlabListdata.Details[i].AvailableAmount).split('-')[0]).toFixed(8) + '-' + parseFloatVal((SlabListdata.Details[i].AvailableAmount).split('-')[1]).toFixed(8));
                            }

                            //Plans[i] = SlabListdata.Details[i].MakerCharges + ' ' + R.strings.Marker + ' - ' + SlabListdata.Details[i].TakerCharges + ' ' + R.strings.Taker;
                            PolicyDetailIDs.push(SlabListdata.Details[i].PolicyDetailID);
                            SlabType[i] = SlabListdata.Details[i].SlabType;
                            Plans.push({ value: item });
                        }
                        return {
                            ...state,
                            Plans: Plans,
                            SelectedPlan: PolicyDetailIDs[0],
                            AvailableAmount: AvailableAmounts[0],
                            SlabType: SlabType[0],
                            AvailableAmounts: AvailableAmounts,
                            PolicyDetailIDs: PolicyDetailIDs,
                        }
                    } else {
                        return {
                            ...state,
                            Plans: [],
                            SelectedPlan: '',
                            AvailableAmount: '',
                            etAmount: '',
                            SlabType: 2,
                            AvailableAmounts: [],
                            PolicyDetailIDs: []
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        Plans: [],
                        SelectedPlan: '',
                        AvailableAmount: '',
                        etAmount: '',
                        SlabType: 2,
                        AvailableAmounts: [],
                        PolicyDetailIDs: []
                    }
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
        return null;
    }

    //on Selection of Currency From Drop Down
    onStakingTypeChange = async (index) => {

        this.setState({ StackingType: index })

        // Check response with previous response
        if (this.state.selectedCoin !== R.strings.Please_Select) {

            try {
                //To empty Reducer
                this.props.OnDropdownChange();
                //---------

                //Check NetWork is Available or not
                if (await isInternet()) {
                    let request = {
                        StatkingTypeID: index,
                        CurrencyTypeID: this.state.CurrencyTypeID
                    }

                    //Call API to get Plan for Selected Coin and Staking Type
                    this.props.getSlabList(request);
                }
                this.setState({ Plans: [] });
            }
            catch (e) {
                //Catch Code here
            }
        }
    }
    //---------------

    //on Selection of Currency From Drop Down
    onCurrencyChange = async (index, object) => {

        try {
            if (index !== R.strings.Please_Select) {
                //To empty Reducer
                this.props.OnDropdownChange();
                //---------

                //Chcek if Item is Select From Select Currency DropDown
                if (this.refs.spCurrencyChange != null) {

                    //Store Update DropDown Item and Perform CoinChange Action For Update Item
                    if (this.state.CurrencyTypeID !== object.Id) {

                        //Check NetWork is Available or not
                        if (await isInternet()) {
                            let request = {
                                StatkingTypeID: this.state.StackingType,
                                CurrencyTypeID: object.Id
                            }

                            //Call API to get Plan for Selected Coin and Staking Type
                            this.props.getSlabList(request);

                            let walletsRequest = {
                                Coin: object.CoinName
                            }

                            //Call API To Get Wallet List Fron Coin Selection
                            this.props.getWallets(walletsRequest);
                        }
                        this.setState({ walletItems: [], Plans: [] })
                    }
                    this.setState({ selectedCoin: index, CurrencyTypeID: object.Id })
                }
            }
            else {
                this.setState({ selectedCoin: index, AvailableAmount: '', WalletName: '', etAmount: '' })
            }
        }
        catch (e) {
            //Catch Code here
        }
    }

    //on Selection of Slab List Item From Drop Down
    onPlanChange(index) {

        //To empty Reducer
        this.props.OnDropdownChange();
        //---------

        try {
            //Chcek if Item is Select From Select Currency DropDown
            if (this.refs.spPlanChange != null) {

                //Store Update DropDown Item and Perform CoinChange Action For Update Item
                var i = this.state.AvailableAmounts.indexOf(index);
                let AvailableAmount = '';
                if (this.state.SlabType == 1) {
                    AvailableAmount = parseFloatVal(index).toFixed(8);
                } else {
                    AvailableAmount = parseFloatVal((index).split('-')[0]).toFixed(8) + '-' + parseFloatVal((index).split('-')[1]).toFixed(8);
                }
                this.setState({ SelectedPlan: this.state.PolicyDetailIDs[i], AvailableAmount: AvailableAmount })
            }
        }
        catch (e) {
            //Catch Code here
        }
    }

    //Check All Validation and if validation is proper then call API
    onGetQuoteButtonPress = async () => {
        //Check Symbol is Empty or Not
        if (isEmpty(this.state.CurrencyTypeID)) {
            this.refs.Toast.Show(R.strings.selectCurrency);
            return;
        }

        //Check available amount is Empty or Not
        if (isEmpty(this.state.AvailableAmount)) {
            this.refs.Toast.Show(R.strings.Select_Plan);
            return;
        }
        //Check wallet name is Empty or Not
        if (isEmpty(this.state.WalletName)) {
            this.refs.Toast.Show(R.strings.Select_Wallet);
            return;
        }

        //Check slabtype value
        if (this.state.SlabType == 2) {
            let minAmount = parseFloatVal((this.state.AvailableAmount).split('-')[0]);
            let maxAmount = parseFloatVal((this.state.AvailableAmount).split('-')[1]);

            //Check amount is Empty or Not
            if (isEmpty(this.state.etAmount)) {
                this.refs.Toast.Show(R.strings.Enter_Amount);
                return;
            }

            //Check amount value is bigger then max amount
            if (parseFloatVal(this.state.etAmount) > maxAmount) {
                this.refs.Toast.Show(R.strings.invalidAmount);
                return;
            }

            //Check amount value is smaller then min amount
            if (parseFloatVal(this.state.etAmount) < minAmount) {
                this.refs.Toast.Show(R.strings.invalidAmount);
                return;
            } else {
                //Check NetWork is Available or not
                if (await isInternet()) {
                    let request = {};
                    if (this.state.SlabType == 1) {
                        request = {
                            PolicyDetailID: parseIntVal(this.state.SelectedPlan),
                            Amount: parseFloatVal(this.state.AvailableAmount)
                        }
                    } else {
                        request = {
                            PolicyDetailID: parseIntVal(this.state.SelectedPlan),
                            Amount: parseFloatVal(this.state.etAmount)
                        }
                    }

                    // Call api for confirmation details
                    this.props.getPreConfirmationDetails(request);

                }
            }
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {
                let request = {};
                if (this.state.SlabType == 1) {
                    request = {
                        PolicyDetailID: parseIntVal(this.state.SelectedPlan),
                        Amount: parseFloatVal(this.state.AvailableAmount)
                    }
                } else {
                    request = {
                        PolicyDetailID: parseIntVal(this.state.SelectedPlan),
                        Amount: parseFloatVal(this.state.etAmount)
                    }
                }

                // Call api for confirmation details
                this.props.getPreConfirmationDetails(request);
            }
        }
    }

    //Redirect User To Withdraw History Screen
    RedirectTokenHistory() {

        //To Redirect User To Withdraw Coin Success Screen
        var { navigate } = this.props.navigation;
        navigate('TokenStackingHistoryResult');
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { WalletListIsFetching, PreReqIsFetching, SlabListisFetching, PostReqIsFetching, WalletDataIsFetching } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Token_Stack}
                    isBack={true}
                    nav={this.props.navigation}
                    rightIcon={R.images.ic_history}
                    onRightMenuPress={this.RedirectTokenHistory} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={WalletListIsFetching || PreReqIsFetching || SlabListisFetching || PostReqIsFetching || WalletDataIsFetching} />

                {/* For Toast */}
                <CommonToast ref="Toast" />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                            {/* To Set Token Type in Dropdown */}
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.Select_Coin} : </TextViewMR>
                            <Picker
                                ref='spCurrencyChange'
                                title={R.strings.Select_Coin}
                                searchable={true}
                                withIcon={true}
                                cardStyle={{ marginBottom: 0, }}
                                data={this.state.CurrencyList}
                                value={this.state.selectedCoin ? this.state.selectedCoin : ''}
                                onPickerSelect={(index, object) => this.onCurrencyChange(index, object)}
                                displayArrow={'true'}
                                width={'100%'}
                            />

                            {/* To Set Stacking Type */}
                            <TextViewMR style={{ fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.Stacking_Type}</TextViewMR>

                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                <RenderRadioButton
                                    item={{ title: R.strings.Fixed_Deposit, selected: this.state.StackingType == 1 }}
                                    onStakingTypeChange={() => this.onStakingTypeChange(1)}>
                                </RenderRadioButton>

                                <RenderRadioButton
                                    item={{ title: R.strings.Charge, selected: this.state.StackingType == 2 }}
                                    onStakingTypeChange={() => this.onStakingTypeChange(2)}>
                                </RenderRadioButton>
                            </View>

                            {/* To Set Plan List in Dropdown */}
                            {this.state.AvailableAmount ?
                                <View>
                                    <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.Select_Plan}</TextViewMR>
                                    <Picker
                                        ref='spPlanChange'
                                        cardStyle={{ marginBottom: 0 }}
                                        data={this.state.Plans}
                                        value={this.state.AvailableAmount}
                                        onPickerSelect={(index) => this.onPlanChange(index)}
                                        displayArrow={'true'}
                                        width={'100%'}
                                    />

                                    {/* To Set Wallet List in Dropdown */}
                                    <TextViewMR style={{ fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.Select_Wallet}</TextViewMR>

                                    <Picker
                                        ref='spSelectWallet'
                                        title={R.strings.Select_Wallet}
                                        searchable={true}
                                        cardStyle={{ marginBottom: 0 }}
                                        data={this.state.WalletItems}
                                        value={this.state.WalletName ? this.state.WalletName : ''}
                                        onPickerSelect={(index, object) => this.onWalletChange(index, object)}
                                        displayArrow={'true'}
                                        width={'100%'}
                                    />

                                    {/* To Set Amount in EditText */}
                                    {this.state.SlabType == 2 ?
                                        <EditText
                                            header={R.strings.Amount}
                                            placeholder={R.strings.Amount}
                                            multiline={false}
                                            keyboardType='numeric'
                                            returnKeyType={"done"}
                                            onChangeText={(etAmount) => this.setState({ etAmount })}
                                            value={this.state.etAmount}
                                            validate={true}
                                            editable={true}
                                        /> :
                                        <EditText
                                            header={R.strings.Amount}
                                            placeholder={R.strings.Amount}
                                            multiline={false}
                                            keyboardType='numeric'
                                            returnKeyType={"done"}
                                            value={this.state.AvailableAmount}
                                            validate={true}
                                            editable={false}
                                        />}
                                </View>
                                : null}
                        </View>
                    </ScrollView>

                    {(this.state.AvailableAmount && this.state.WalletName) ?
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* To Set Get Qu0te Button */}
                            <Button title={R.strings.GetQuote} onPress={this.onGetQuoteButtonPress}></Button>
                        </View>
                        : null}
                </View>
            </SafeView>
        );
    }
}

// This Class is used for display record in list
class RenderRadioButton extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // Get required fields from props
        let item = this.props.item

        return (
            <View>
                <ImageButton
                    isHML
                    name={item.title}
                    icon={item.selected ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                    onPress={this.props.onStakingTypeChange}
                    style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
                    textStyle={{ color: R.colors.textPrimary, fontFamily: Fonts.HindmaduraiLight, marginLeft: R.dimens.widgetMargin }}
                    iconStyle={{ tintColor: item.selected ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                />
            </View>
        )
    };
}

const mapStateToProps = (state) => {
    return {
        // Update state from reducer
        PostReqData: state.TokenStackingReducer.PostReqData,
        PostReqFetchData: state.TokenStackingReducer.PostReqFetchData,
        PostReqIsFetching: state.TokenStackingReducer.PostReqIsFetching,

        SlabListdata: state.TokenStackingReducer.SlabListdata,
        SlabListFetchData: state.TokenStackingReducer.SlabListFetchData,
        SlabListisFetching: state.TokenStackingReducer.SlabListisFetching,

        PreReqData: state.TokenStackingReducer.PreReqData,
        PreReqFetchData: state.TokenStackingReducer.PreReqFetchData,
        PreReqIsFetching: state.TokenStackingReducer.PreReqIsFetching,

        WalletListData: state.TokenStackingReducer.WalletListData,
        WalletListFetchData: state.TokenStackingReducer.WalletListFetchData,
        WalletListIsFetching: state.TokenStackingReducer.WalletListIsFetching,

        WalletData: state.TokenStackingReducer.WalletData,
        WalletFetchData: state.TokenStackingReducer.WalletFetchData,
        WalletDataIsFetching: state.TokenStackingReducer.WalletDataIsFetching,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // Perform Wallet Type Master Api Action
    getWalletTypeMaster: () => dispatch(getWalletTypeMaster()),
    // Perform Slab List Api Action
    getSlabList: (request) => dispatch(GetSlabList(request)),
    // Perform Dropdown Api Action
    OnDropdownChange: () => dispatch(OnDropdownChange()),
    // Perform Wallet Api Action
    getWallets: (walletsRequest) => dispatch(getWallets(walletsRequest)),
    // Perform Pre Confirmation Detail Api Action
    getPreConfirmationDetails: (request) => dispatch(getPreConfirmationDetails(request)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenStackingScreen);