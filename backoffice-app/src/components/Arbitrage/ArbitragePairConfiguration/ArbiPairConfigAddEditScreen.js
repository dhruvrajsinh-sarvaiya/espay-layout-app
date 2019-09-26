import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText';
import { changeTheme, parseArray, showAlert, parseFloatVal, parseIntVal } from '../../../controllers/CommonUtils';
import { isInternet, isEmpty, validateResponseNew, isHtmlTag, isScriptTag } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import { CheckAmountValidation } from '../../../validations/AmountValidation';
import R from '../../../native_theme/R';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import { TitlePicker } from '../../widget/ComboPickerWidget'
import { getBaseMarketArbitrage } from '../../../actions/PairListAction';
import { getServiceConfiguByBaseArbitrage } from '../../../actions/ArbitrageCommonActions';
import { clearArbiPairConfigData, addArbiPairConfig, updateArbiPairConfig } from '../../../actions/Arbitrage/ArbitragePairConfigurationActions';
import SafeView from '../../../native_theme/components/SafeView';
import BottomButton from '../../../native_theme/components/BottomButton';

class ArbiPairConfigAddEditScreen extends Component {

    constructor(props) {
        super(props);

        // for focus on next field
        this.inputs = {};

        // get required params from previous screen
        let item = props.navigation.state.params && props.navigation.state.params.ITEM;

        //Define All State initial state
        this.state = {
            baseMarketDataState: null,
            serviceConfigbaseDataState: null,

            tabNames: R.strings.PairConfigTabName,
            tabPosition: 0,
            isFirstTime: true,

            MarketName: item == undefined ? '' : item.MarketName,
            Currency: [],
            selectedCurrency: item == undefined ? R.strings.SelectMarketCur : item.PairName.split('_')[1],
            PairCurrency: [],
            selectedPairCurrency: item == undefined ? R.strings.SelectPairCur : item.PairName.split('_')[0],
            Volume: item == undefined ? '' : item.Volume,

            BuyMinQty: item == undefined ? '' : item.BuyMinQty,
            BuyMaxQty: item == undefined ? '' : item.BuyMaxQty,
            SellMinQty: item == undefined ? '' : item.SellMinQty,
            SellMaxQty: item == undefined ? '' : item.SellMaxQty,
            BuyMinPrice: item == undefined ? '' : item.BuyMinPrice,
            BuyMaxPrice: item == undefined ? '' : item.BuyMaxPrice,
            SellMinPrice: item == undefined ? '' : item.SellMinPrice,
            SellMaxPrice: item == undefined ? '' : item.SellMaxPrice,

            DefaultRate: item == undefined ? '' : item.CurrentRate,
            OpenOrderExpiration: item == undefined ? '' : item.OpenOrderExpiration,
            Status: R.strings.StatusArray,
            selectedStatus: item == undefined ? R.strings.StatusArray[0].value : item.StatusText,
            StatusCode: item == undefined ? 1 : item.Status,

            PairId: item == undefined ? '' : item.Id,
            baseCurrencyId: item == undefined ? '' : item.BaseCurrencyId,
            secondaryCurrencyId: item == undefined ? '' : item.SecondaryCurrencyId,
        };

        this.activityName = props.navigation.state.params && props.navigation.state.params.activityName

        // create reference
        this.toast = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme()

        // Check interner connection is available or not
        if (await isInternet()) {

            // Call Market Currency List Api
            this.props.getBaseMarketArbitrage({})
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {

        //Get All Updated field of Particular actions
        const { pairConfigAddData, pairConfigUpdateData } = this.props.Result;

        // check previous props and existing props
        if (pairConfigAddData !== prevProps.Result.pairConfigAddData) {
            // for show responce Add
            if (pairConfigAddData) {
                try {
                    //If pairConfigAddData response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({
                        response: pairConfigAddData,
                    })) {
                        showAlert(R.strings.Success, R.strings.PairAdded, 0, () => {
                            // Clear data
                            this.props.clearArbiPairConfigData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        // Clear data
                        this.props.clearArbiPairConfigData()
                    }
                } catch (e) {
                    // Clear data
                    this.props.clearArbiPairConfigData()
                }
            }
        }

        if (pairConfigUpdateData !== prevProps.Result.pairConfigUpdateData) {
            // for show responce Update 
            if (pairConfigUpdateData) {
                try {
                    //If pairConfigUpdateData response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({
                        response: pairConfigUpdateData,
                    })) {
                        showAlert(R.strings.Success, R.strings.PairUpdated, 0, () => {
                            // Clear data
                            this.props.clearArbiPairConfigData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        // Clear data
                        this.props.clearArbiPairConfigData()
                    }
                } catch (e) {
                    // Clear data
                    this.props.clearArbiPairConfigData()
                }
            }
        }
    }

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    // Called when user select Market Currency
    onCurrencyPress = async (item) => {
        this.setState({ selectedCurrency: item })

        // Check internet connectivity
        if (await isInternet()) {

            // Call Pair Currency Api
            if (item !== R.strings.SelectMarketCur) {
                this.props.getServiceConfiguByBaseArbitrage({ Base: item })

                let marketName = ''
                let baseCurrencyId = ''
                if (this.state.Currency) {
                    this.state.Currency.map((value, index) => {
                        if (value.CurrencyName === item) {
                            marketName = value.CurrencyDesc
                            baseCurrencyId = value.ServiceID
                        }
                    })
                }

                if (this.activityName === 'Add')
                    this.setState({ baseCurrencyId: baseCurrencyId, MarketName: marketName, })
                else
                    this.setState({ MarketName: this.state.MarketName, baseCurrencyId: this.state.baseCurrencyId })
            } else {
                this.setState({ selectedPairCurrency: R.strings.SelectPairCur, PairCurrency: [], MarketName: '', })
            }
        }
    }


    // Called when user select Pair Currency
    onPairCurrencyPress = (item) => {

        let currencyId = ''
        if (this.state.PairCurrency) {
            this.state.PairCurrency.map((value, index) => {
                if (value.SMSCode === item) {
                    currencyId = value.ServiceId
                }
            })
        }
        if (this.activityName === 'Add')
            this.setState({ selectedPairCurrency: item, secondaryCurrencyId: currencyId, })
        else
            this.setState({ selectedPairCurrency: item, secondaryCurrencyId: this.state.secondaryCurrencyId, })
    }


    // Allow (10,8) digit eg: 1234567890.12345678
    isValidInput = (key, value) => {
        if (value !== '') {

            if (CheckAmountValidation(value)) {
                this.setState({ [key]: value })
            }
        } else {
            this.setState({ [key]: value })
        }
    }

    // Called when onPage Scrolling
    onPageScroll = (scrollData) => {
        let { position } = scrollData
        if (position != this.state.tabPosition) {
            this.setState({ tabPosition: position, })
        }
    }

    // user press on prev page button
    onPrevPagePress = () => {
        if (this.state.tabPosition > 0) {
            let pos = this.state.tabPosition - 1

            if (this.refs['PairConfigurationTab']) {
                this.refs['PairConfigurationTab'].setPage(pos)
            }
        }
    } 

    // Called when user change Status
    onStatusChange = (item) => {
        this.setState({ selectedStatus: item })
        if (item === R.strings.Active) {
            this.setState({ StatusCode: 1 })
        } else {
            this.setState({ StatusCode: 0 })
        }
    }

     // user press on next page button
     onNextPagePress = () => {
        if (this.state.tabPosition < this.state.tabNames.length - 1) {
            let pos = this.state.tabPosition + 1

            if (this.refs['PairConfigurationTab']) {
                this.refs['PairConfigurationTab'].setPage(pos)
            }
        }
    }

    // on submit check validation and call api for add or update
    onSubmitPress = async () => {
        let {
            BuyMinQty, BuyMaxQty, SellMinQty, SellMaxQty,
            MarketName, baseCurrencyId, secondaryCurrencyId, Volume,
            BuyMinPrice, BuyMaxPrice, SellMinPrice, SellMaxPrice,
            DefaultRate, OpenOrderExpiration, StatusCode, PairId
        } = this.state

        if (isEmpty(MarketName))
            this.toast.Show(R.strings.enter + ' ' + R.strings.MarketName)
        else if (this.state.selectedCurrency === R.strings.SelectMarketCur)
            this.toast.Show(R.strings.SelectMarketCur)
        else if (this.state.selectedPairCurrency === R.strings.SelectPairCur)
            this.toast.Show(R.strings.SelectPairCur)
        else if (isEmpty(Volume))
            this.toast.Show(R.strings.enter + ' ' + R.strings.volume)
        else if (isHtmlTag(Volume))
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.volume)
        else if (isScriptTag(Volume))
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.volume)
        else if (isEmpty(BuyMinQty))
            this.toast.Show(R.strings.enter + ' ' + R.strings.BuyMinQty)
        else if (isEmpty(BuyMaxQty))
            this.toast.Show(R.strings.enter + ' ' + R.strings.BuyMaxQty)
        else if (BuyMinQty > BuyMaxQty)
            this.toast.Show(R.strings.BuyMinQty + ' ' + R.strings.canNotGraterthan + ' ' + R.strings.BuyMaxQty)
        else if (isEmpty(SellMinQty))
            this.toast.Show(R.strings.enter + ' ' + R.strings.SellMinQty)
        else if (isEmpty(SellMaxQty))
            this.toast.Show(R.strings.enter + ' ' + R.strings.SellMaxQty)
        else if (SellMinQty > SellMaxQty)
            this.toast.Show(R.strings.SellMinQty + ' ' + R.strings.canNotGraterthan + ' ' + R.strings.SellMaxQty)
        else if (isEmpty(BuyMinPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.BuyMinPrice)
        else if (isEmpty(BuyMaxPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.BuyMaxPrice)
        else if (BuyMinPrice > BuyMaxPrice)
            this.toast.Show(R.strings.BuyMinPrice + ' ' + R.strings.canNotGraterthan + ' ' + R.strings.BuyMaxPrice)
        else if (isEmpty(SellMinPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.SellMinPrice)
        else if (isEmpty(SellMaxPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.SellMaxPrice)
        else if (SellMinPrice > SellMaxPrice)
            this.toast.Show(R.strings.SellMinPrice + ' ' + R.strings.canNotGraterthan + ' ' + R.strings.SellMaxPrice)
        else if (isEmpty(DefaultRate))
            this.toast.Show(R.strings.enter + ' ' + R.strings.Rate)
        else if (isHtmlTag(DefaultRate))
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.Rate)
        else if (isScriptTag(DefaultRate))
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.Rate)
        else if (isEmpty(OpenOrderExpiration))
            this.toast.Show(R.strings.enterDays)
        else if (this.state.selectedStatus === R.strings.select_status)
            this.toast.Show(R.strings.select_status)
        else {
            let Request = {
                Id: PairId ? PairId : parseIntVal(0),
                MarketName: MarketName,
                SecondaryCurrencyId: secondaryCurrencyId ? parseIntVal(secondaryCurrencyId) : parseIntVal(0),
                BaseCurrencyId: baseCurrencyId ? parseIntVal(baseCurrencyId) : parseIntVal(0),
                Volume: Volume ? parseFloatVal(Volume) : parseFloatVal(0),

                BuyMinQty: BuyMinQty ? parseFloatVal(BuyMinQty) : parseFloatVal(0),
                BuyMaxQty: BuyMaxQty ? parseFloatVal(BuyMaxQty) : parseFloatVal(0),
                SellMinQty: SellMinQty ? parseFloatVal(SellMinQty) : parseFloatVal(0),
                SellMaxQty: SellMaxQty ? parseFloatVal(SellMaxQty) : parseFloatVal(0),
                BuyMinPrice: BuyMinPrice ? parseFloatVal(BuyMinPrice) : parseFloatVal(0),
                BuyMaxPrice: BuyMaxPrice ? parseFloatVal(BuyMaxPrice) : parseFloatVal(0),
                SellMinPrice: SellMinPrice ? parseFloatVal(SellMinPrice) : parseFloatVal(0),
                SellMaxPrice: SellMaxPrice ? parseFloatVal(SellMaxPrice) : parseFloatVal(0),

                CurrentRate: DefaultRate ? parseFloatVal(DefaultRate) : parseFloatVal(0),
                OpenOrderExpiration: OpenOrderExpiration ? parseIntVal(OpenOrderExpiration) : parseIntVal(0),
                Status: StatusCode ? parseIntVal(StatusCode) : parseIntVal(0),

                IsMargin: 0,
                CurrencyPrice: DefaultRate ? parseFloatVal(DefaultRate) : parseFloatVal(0),
                SellPrice: 0,
                BuyPrice: 0,
                BuyFees: 0,
                SellFees: 0,
                ChargeType: 0,
                QtyLength: 0,
                PriceLength: 0,
                AmtLength: 0,
                FeesCurrency: 'INR'
            }

            if (this.activityName === 'Add') {
                this.props.addArbiPairConfig(Request)
            } else {
                this.props.updateArbiPairConfig(Request)
            }
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
        if (ArbiPairConfigAddEditScreen.oldProps !== props) {
            ArbiPairConfigAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        // check for currenct screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { baseMarketData, serviceConfigbaseData } = props.Result;

            if (baseMarketData) {
                try {
                    //if local currencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.baseMarketDataState == null || (state.baseMarketDataState != null && baseMarketData !== state.baseMarketDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: baseMarketData, isList: true })) {
                            let res = parseArray(baseMarketData.Response);

                            //for add pairCurrencyList
                            for (var key in res) {
                                let item = res[key];
                                item.value = item.CurrencyName;
                            }

                            let Currency = [
                                { value: R.strings.SelectMarketCur },
                                ...res
                            ];

                            return { ...state, Currency, baseMarketDataState: baseMarketData };
                        } else {
                            return { ...state, Currency: [{ value: R.strings.SelectMarketCur }], baseMarketDataState: baseMarketData };
                        }
                    }
                } catch (e) {
                    return { ...state, Currency: [{ value: R.strings.SelectMarketCur }] };
                }
            }

            if (serviceConfigbaseData) {
                try {
                    //if local currencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.serviceConfigbaseDataState == null || (state.serviceConfigbaseDataState != null && serviceConfigbaseData !== state.serviceConfigbaseDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: serviceConfigbaseData, isList: true })) {
                            let res = parseArray(serviceConfigbaseData.Response);

                            //for add pairCurrencyList
                            for (var SMSCodekey in res) {
                                let item = res[SMSCodekey];
                                item.value = item.SMSCode;
                            }

                            let PairCurrency = [
                                { value: R.strings.SelectPairCur },
                                ...res
                            ];

                            return { ...state, PairCurrency, serviceConfigbaseDataState: baseMarketData };
                        } else {
                            return { ...state, PairCurrency: [{ value: R.strings.SelectPairCur }], serviceConfigbaseDataState: baseMarketData };
                        }
                    }
                } catch (e) {
                    return { ...state, PairCurrency: [{ value: R.strings.SelectPairCur }] };
                }
            }
        }
        return null;
    }


    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { pairConfigAddDataFetching, pairConfigUpdateDataFetching, serviceConfigbaseFetching, baseMarketFetching } = this.props.Result

        return (
            <SafeView style={this.styles().container}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.activityName === 'Add' ? R.strings.AddNewPair : R.strings.UpdatePair}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Common progress dialog */}
                <ProgressDialog isShow={pairConfigAddDataFetching || pairConfigUpdateDataFetching || serviceConfigbaseFetching || baseMarketFetching} />

                {/* Common Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* View Pager Indicator (Tab) */}
                    <IndicatorViewPager
                        ref='PairConfigurationTab'
                        titles={this.state.tabNames}
                        numOfItems={3}
                        horizontalScroll={false}
                        isGradient={true}
                        style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
                        onPageScroll={this.onPageScroll}>

                        {/* First Tab */}
                        <View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{
                                    flex: 1,
                                    paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                                    paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin
                                }}>

                                    {/* Picker for Market Currency */}
                                    <TitlePicker
                                        isRequired={true}
                                        title={R.strings.MarketCurrency}
                                        array={this.state.Currency}
                                        selectedValue={this.state.selectedCurrency}
                                        onPickerSelect={(value) => this.onCurrencyPress(value)}
                                        style={{ marginTop: 0 }}
                                    />

                                    {/* EditText for Market Name */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.MarketName}
                                        reference={input => { this.inputs['etMarketName'] = input; }}
                                        placeholder={R.strings.MarketName}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ MarketName: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etVolume') }}
                                        value={this.state.MarketName}
                                        editable={false}
                                    />

                                    {/* Picker for Pair Currency */}
                                    <TitlePicker
                                        isRequired={true}
                                        title={R.strings.PairCurrency}
                                        array={this.state.PairCurrency}
                                        selectedValue={this.state.selectedPairCurrency}
                                        onPickerSelect={(value) => this.onPairCurrencyPress(value)}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                    />

                                    {/* EditText for Volume */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.volume}
                                        reference={input => { this.inputs['etVolume'] = input; }}
                                        placeholder={R.strings.volume}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ Volume: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etBuyMinQty') }}
                                        value={this.state.Volume.toString()}
                                        validate={true}
                                    />
                                </View>
                            </ScrollView>
                        </View>

                        {/* Second Tab */}
                        <View>
                            <View style={{
                                paddingRight: R.dimens.activity_margin, paddingLeft: R.dimens.activity_margin,
                                paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin - R.dimens.widgetMargin
                            }}>
                                <ScrollView showsVerticalScrollIndicator={false}>

                                    {this.CommonSplitItem(
                                        R.strings.BuyQty,
                                        R.strings.BuyMaxQty,
                                        R.strings.BuyMinQty,
                                        'etBuyMinQty',
                                        'etBuyMaxQty',
                                        () => this.focusNextField('etBuyMaxQty'),
                                        () => this.focusNextField('etSellMinQty'),
                                        this.state.BuyMaxQty,
                                        this.state.BuyMinQty,
                                        (Label) => this.isValidInput('BuyMaxQty', Label),
                                        (Label) => this.isValidInput('BuyMinQty', Label),
                                        true,
                                    )}

                                    {this.CommonSplitItem(
                                        R.strings.SellMinQty,
                                        R.strings.SellMaxQty,
                                        R.strings.SellQty,
                                        'etSellMinQty', 'etSellMaxQty',
                                        () => this.focusNextField('etSellMaxQty'),
                                        () => this.focusNextField('etBuyMinPrice'),
                                        this.state.SellMinQty, this.state.SellMaxQty,
                                        (Label) => this.isValidInput('SellMinQty', Label),
                                        (Label) => this.isValidInput('SellMaxQty', Label),
                                        true
                                    )}

                                    {this.CommonSplitItem(
                                        R.strings.BuyMinPrice,
                                        R.strings.BuyPrice,
                                        R.strings.BuyMaxPrice, 'etBuyMinPrice',
                                        'etBuyMaxPrice',
                                        () => this.focusNextField('etBuyMaxPrice'),
                                        () => this.focusNextField('etSellMinPrice'),
                                        this.state.BuyMinPrice,
                                        this.state.BuyMaxPrice, (Label) => this.isValidInput('BuyMinPrice', Label),
                                        (Label) => this.isValidInput('BuyMaxPrice', Label),
                                        true,
                                    )}

                                    {this.CommonSplitItem(
                                        R.strings.SellMinPrice, R.strings.SellMaxPrice,
                                        R.strings.SellPrice,
                                        'etSellMinPrice',
                                        'etSellMaxPrice',
                                        () => this.focusNextField('etSellMaxPrice'), () => this.focusNextField('etDefaultRate'),
                                        this.state.SellMinPrice,
                                        this.state.SellMaxPrice,
                                        (Label) => this.isValidInput('SellMinPrice', Label),
                                        (Label) => this.isValidInput('SellMaxPrice', Label), true,
                                    )}

                                </ScrollView>
                            </View>
                        </View>

                        {/* Third Tab */}
                        <View>
                            <View style={{
                                paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                                paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin
                            }}>
                                <ScrollView showsVerticalScrollIndicator={false}>

                                    {/* EditText for Default Rate */}
                                    <EditText
                                        style={{ marginTop: 0 }}
                                        isRequired={true}
                                        header={R.strings.Rate}
                                        reference={input => { this.inputs['etDefaultRate'] = input; }}
                                        placeholder={R.strings.Rate}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ DefaultRate: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etOpenOrderExp') }}
                                        value={this.state.DefaultRate + ""}
                                        validate={true}
                                    />

                                    {/* EditText for Open Order Expiration */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.OpenOrderExp}
                                        reference={input => { this.inputs['etOpenOrderExp'] = input; }}
                                        placeholder={R.strings.EnterDays}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"done"}
                                        onChangeText={(Label) => this.setState({ OpenOrderExpiration: Label })}
                                        value={this.state.OpenOrderExpiration + ""}
                                        validate={true}
                                        onlyDigit={true}
                                    />

                                    {/* Picker for Status */}
                                    <TitlePicker
                                        isRequired={true}
                                        title={R.strings.Status}
                                        array={this.state.Status}
                                        selectedValue={this.state.selectedStatus}
                                        onPickerSelect={(value) => this.onStatusChange(value)}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin }}
                                    />

                                </ScrollView>
                            </View>
                        </View>
                    </IndicatorViewPager>

                    <View style={{ alignItems: 'center', flexDirection: 'row', margin: R.dimens.margin, }}>
                        {
                            this.state.tabPosition > 0 ?
                                <BottomButton
                                    title={R.strings.Prev}
                                    onPress={() => this.onPrevPagePress()} />
                                :
                                null
                        }
                        <View style={{ flex: 1 }} />
                        {
                            (this.state.tabPosition < this.state.tabNames.length - 1) ?
                                <BottomButton
                                    title={R.strings.next}
                                    onPress={() => this.onNextPagePress()} />
                                :
                                <BottomButton
                                    title={this.activityName === 'Add' ? R.strings.add : R.strings.update}
                                    onPress={() => this.onSubmitPress()} />
                        }
                    </View>
                </View>
            </SafeView>
        )
    }

    CommonSplitItem = (title, placeHolder1, placeHolder2, ref1, ref2, submitText1, submitText2, value1, value2, onChangeText1, onChangeText2, flag) => {
        return (
            <View style={{ marginTop: R.dimens.widgetMargin, }}>
                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{title}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: R.dimens.widgetMargin }}>
                    <EditText
                        reference={input => { this.inputs[ref1] = input; }}
                        style={{ flex: 1, justifyContent: 'center', marginTop: 0 }}
                        keyboardType='numeric' returnKeyType={"next"}
                        blurOnSubmit={false}
                        onChangeText={onChangeText1}
                        onSubmitEditing={submitText1}
                        placeholder={placeHolder1} multiline={false}
                        value={value1 + ""}
                        maxLength={10}
                    />

                    {
                        flag ?
                            <Text style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginRight: R.dimens.widgetMargin, }}>{R.strings.To}</Text>
                            :
                            <View style={{ marginLeft: R.dimens.volumeText, marginRight: R.dimens.volumeText, }} />
                    }

                    <EditText
                        reference={input => { this.inputs[ref2] = input; }}
                        placeholder={placeHolder2} multiline={false}
                        keyboardType='numeric'
                        returnKeyType={"next"} blurOnSubmit={false}
                        onChangeText={onChangeText2}
                        onSubmitEditing={submitText2}
                        value={value2 + ""}
                        style={{ flex: 1, justifyContent: 'center', marginTop: 0 }}
                        maxLength={10}
                    />
                </View>
            </View>
        )
    }

    styles = () => {
        return {
            container: {
                flex: 1, backgroundColor: R.colors.background,
            },
        }
    }
}

/* return state from reducer */
const mapStateToProps = (state) => {
    // data from ArbitragePairConfigurationReducer 
    return {
        Result: state.ArbitragePairConfigurationReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // action for get market list
    getBaseMarketArbitrage: (request) => dispatch(getBaseMarketArbitrage(request)),
    // action for get market list
    getServiceConfiguByBaseArbitrage: (request) => dispatch(getServiceConfiguByBaseArbitrage(request)),
    // action for addArbiPairConfig
    addArbiPairConfig: (request) => dispatch(addArbiPairConfig(request)),
    // action for updateArbiPairConfig
    updateArbiPairConfig: (request) => dispatch(updateArbiPairConfig(request)),
    //Perform clearArbiPairConfigData Action 
    clearArbiPairConfigData: () => dispatch(clearArbiPairConfigData())
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbiPairConfigAddEditScreen);
