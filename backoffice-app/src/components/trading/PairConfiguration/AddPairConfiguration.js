import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText';
import { changeTheme, parseArray, showAlert, parseFloatVal, parseIntVal } from '../../../controllers/CommonUtils';
import { getMarketCurrencyList, getPairCurrencyList, addPairConfiguration, clearNewPairData, editPairConfiguration } from '../../../actions/Trading/PairConfigurationActions';
import { isInternet, isEmpty, validateResponseNew } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import { CheckAmountValidation } from '../../../validations/AmountValidation';
import R from '../../../native_theme/R';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import { TitlePicker } from '../../widget/ComboPickerWidget'
import SafeView from '../../../native_theme/components/SafeView';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import BottomButton from '../../../native_theme/components/BottomButton';

class AddPairConfiguration extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        // for focus on next field
        this.inputs = {};

        // for binding request
        this.Request = {};

        // get required params from previous screen
        let item = props.navigation.state.params && props.navigation.state.params.ITEM;
        let isMargin = props.navigation.state.params && props.navigation.state.params.isMargin;
        this.activityName = props.navigation.state.params && props.navigation.state.params.activityName;

        //Define All State initial state
        this.state = {
            marketCurrencyData: null,
            pairCurrencyData: null,
            editPairSuccessData: null,
            addPairSuccessData: null,

            tabNames: R.strings.PairConfigTabName,
            MarketName: item == undefined ? '' : item.MarketName,
            DefaultRate: item == undefined ? '' : item.CurrentRate,
            PairId: item == undefined ? '' : item.Id,

            BuyMinQty: item == undefined ? '' : item.BuyMinQty,
            BuyMaxQty: item == undefined ? '' : item.BuyMaxQty,
            SellMinQty: item == undefined ? '' : item.SellMinQty,
            SellMaxQty: item == undefined ? '.' : item.SellMaxQty,

            BuyPrice: item == undefined ? '' : item.BuyPrice,
            SellPrice: item == undefined ? '' : item.SellPrice,
            BuyMinPrice: item == undefined ? '' : item.BuyMinPrice,
            BuyMaxPrice: item == undefined ? '' : item.BuyMaxPrice,
            SellMinPrice: item == undefined ? '' : item.SellMinPrice,
            SellMaxPrice: item == undefined ? '' : item.SellMaxPrice,

            BuyFees: item == undefined ? '' : item.BuyFees,
            SellFees: item == undefined ? '' : item.SellFees,
            FeesCurrency: item == undefined ? '' : item.FeesCurrency,

            Volume: item == undefined ? '' : item.Volume,
            CurrencyPrice: item == undefined ? '' : item.CurrencyPrice,
            OpenOrderExpiration: item == undefined ? '' : item.OpenOrderExpiration,
            Currency: [],
            selectedCurrency: item == undefined ? R.strings.SelectMarketCur : item.PairName.split('_')[1],
            PairCurrency: [],
            selectedPairCurrency: item == undefined ? R.strings.SelectPairCur : item.PairName.split('_')[0],
            tabPosition: 0,
            isCheck: true,
            Status: R.strings.StatusArray,
            selectedStatus: item == undefined ? R.strings.StatusArray[0].value : item.StatusText,
            baseCurrencyId: item == undefined ? '' : item.BaseCurrencyId,
            secondaryCurrencyId: item == undefined ? '' : item.SecondaryCurrencyId,
            StatusCode: item == undefined ? 1 : item.Status,
            isFirstTime: true,
            isMargin: isMargin
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps)
    };

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme()

        // Check interner connection is available or not
        if (await isInternet()) {

            if (this.state.isMargin) {

                // Call Market Currency List Api
                this.props.getMarketCurrencyList({ IsMargin: 1 })
            } else {

                // Call Market Currency List Api
                this.props.getMarketCurrencyList()
            }
        }
    };

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

                if (this.state.isMargin)
                    this.props.getPairCurrencyList({ Base: item, IsMargin: 1 })
                else
                    this.props.getPairCurrencyList({ Base: item })

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
                    this.setState({ MarketName: marketName, baseCurrencyId: baseCurrencyId })
                else
                    this.setState({ MarketName: this.state.MarketName, baseCurrencyId: this.state.baseCurrencyId })
            } else {
                this.setState({ PairCurrency: [], selectedPairCurrency: R.strings.SelectPairCur, MarketName: '' })
            }
        }
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
            this.setState({ secondaryCurrencyId: currencyId, selectedPairCurrency: item })
        else
            this.setState({ secondaryCurrencyId: this.state.secondaryCurrencyId, selectedPairCurrency: item })
    }

    // Called when onPage Scrolling
    onPageScroll = (scrollData) => {
        let { position } = scrollData
        if (position != this.state.tabPosition) {
            this.setState({ tabPosition: position, })
        }
    }

    // user press on next page button
    onNextPagePress = () => 
    {
        if (this.state.tabPosition < this.state.tabNames.length - 1)
         {
            let pos = this.state.tabPosition + 1

            if (this.refs['PairConfigurationTab']) 
            {
                this.refs['PairConfigurationTab'].setPage(pos)
            }
        }
    }

    // Called when user change Status
    onStatusChange = (item) => 
    {
        this.setState({ selectedStatus: item })
        if (item === R.strings.Active) 
        {
            this.setState({ StatusCode: 1 })
        } else 
        {
            this.setState({ StatusCode: 0 })
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

    // on submit check validation and call api for add or update
    onSubmitPress = async () => {

        let { DefaultRate, BuyMinQty, BuyMaxQty, SellMinQty, SellMaxQty,
            BuyPrice, SellPrice, BuyMinPrice, BuyMaxPrice, SellMinPrice, SellMaxPrice,
            BuyFees, SellFees, FeesCurrency, Volume, CurrencyPrice, OpenOrderExpiration,
            baseCurrencyId, secondaryCurrencyId, StatusCode, PairId
        } = this.state

        let ChargeType = this.state.isCheck ? 0 : 1

        //all validations
        if (isEmpty(this.state.MarketName))
            this.toast.Show(R.strings.enter + ' ' + R.strings.MarketName)
        else if (this.state.selectedCurrency === R.strings.SelectMarketCur)
            this.toast.Show(R.strings.SelectMarketCur)
        else if (this.state.selectedPairCurrency === R.strings.SelectPairCur)
            this.toast.Show(R.strings.SelectPairCur)
        else if (isEmpty(this.state.Volume))
            this.toast.Show(R.strings.enter + ' ' + R.strings.volume)
        else if (isEmpty(this.state.CurrencyPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.currencyPrice)
        else if (isEmpty(this.state.BuyMinQty))
            this.toast.Show(R.strings.enter + ' ' + R.strings.BuyMinQty)
        else if (isEmpty(this.state.BuyMaxQty))
            this.toast.Show(R.strings.enter + ' ' + R.strings.BuyMaxQty)
        else if (isEmpty(this.state.SellMinQty))
            this.toast.Show(R.strings.enter + ' ' + R.strings.SellMinQty)
        else if (isEmpty(this.state.SellMaxQty))
            this.toast.Show(R.strings.enter + ' ' + R.strings.SellMaxQty)
        else if (isEmpty(this.state.BuyMinPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.BuyMinPrice)
        else if (isEmpty(this.state.BuyMaxPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.BuyMaxPrice)
        else if (isEmpty(this.state.SellMinPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.SellMinPrice)
        else if (isEmpty(this.state.SellMaxPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.SellMaxPrice)
        else if (isEmpty(this.state.SellPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.SellPrice)
        else if (isEmpty(this.state.BuyPrice))
            this.toast.Show(R.strings.enter + ' ' + R.strings.BuyPrice)
        else if (isEmpty(this.state.SellFees))
            this.toast.Show(R.strings.enter + ' ' + R.strings.SellFees)
        else if (isEmpty(this.state.BuyFees))
            this.toast.Show(R.strings.enter + ' ' + R.strings.BuyFees)
        else if (isEmpty(this.state.DefaultRate))
            this.toast.Show(R.strings.enter + ' ' + R.strings.DefaultRate)
        else if (isEmpty(this.state.FeesCurrency))
            this.toast.Show(R.strings.enter + ' ' + R.strings.FeesCurrency)
        else if (isEmpty(this.state.OpenOrderExpiration))
            this.toast.Show(R.strings.EnterDays)
        else if (this.state.selectedStatus === R.strings.select_status)
            this.toast.Show(R.strings.select_status)
        else {
            this.Request = {
                SecondaryCurrencyId: secondaryCurrencyId ? parseIntVal(secondaryCurrencyId) : parseIntVal(0),
                BaseCurrencyId: baseCurrencyId ? parseIntVal(baseCurrencyId) : parseIntVal(0),
                CurrentRate: DefaultRate ? parseFloatVal(DefaultRate) : parseFloatVal(0),
                BuyMinQty: BuyMinQty ? parseFloatVal(BuyMinQty) : parseFloatVal(0),
                BuyMaxQty: BuyMaxQty ? parseFloatVal(BuyMaxQty) : parseFloatVal(0),
                SellMinQty: SellMinQty ? parseFloatVal(SellMinQty) : parseFloatVal(0),
                SellMaxQty: SellMaxQty ? parseFloatVal(SellMaxQty) : parseFloatVal(0),
                CurrencyPrice: CurrencyPrice ? parseFloatVal(CurrencyPrice) : parseFloatVal(0),
                Volume: Volume ? parseFloatVal(Volume) : parseFloatVal(0),
                SellPrice: SellPrice ? parseFloatVal(SellPrice) : parseFloatVal(0),
                BuyPrice: BuyPrice ? parseFloatVal(BuyPrice) : parseFloatVal(0),
                BuyMinPrice: BuyMinPrice ? parseFloatVal(BuyMinPrice) : parseFloatVal(0),
                BuyMaxPrice: BuyMaxPrice ? parseFloatVal(BuyMaxPrice) : parseFloatVal(0),
                SellMinPrice: SellMinPrice ? parseFloatVal(SellMinPrice) : parseFloatVal(0),
                SellMaxPrice: SellMaxPrice ? parseFloatVal(SellMaxPrice) : parseFloatVal(0),
                BuyFees: BuyFees ? parseFloatVal(BuyFees) : parseFloatVal(0),
                SellFees: SellFees ? parseFloatVal(SellFees) : parseFloatVal(0),
                FeesCurrency: FeesCurrency,
                Status: StatusCode ? parseIntVal(StatusCode) : parseIntVal(0),
                ChargeType: ChargeType ? parseIntVal(ChargeType) : parseIntVal(0),
                OpenOrderExpiration: OpenOrderExpiration ? parseIntVal(OpenOrderExpiration) : parseIntVal(0)
            }

            if (this.activityName === 'Add') {

                if (this.state.isMargin) {
                    this.Request = {
                        ...this.Request,
                        IsMargin: 1
                    }
                    //call add Pair Configuration api
                    this.props.addPairConfiguration(this.Request)
                } else {

                    //call add Pair Configuration api
                    this.props.addPairConfiguration(this.Request)
                }
            } else {
                if (this.state.isMargin) {
                    this.Request = {
                        ...this.Request,
                        Id: PairId ? PairId : parseIntVal(0),
                        IsMargin: 1
                    }

                    //call edit Pair Configuration api
                    this.props.editPairConfiguration(this.Request)
                } else {
                    this.Request = {
                        ...this.Request,
                        Id: PairId ? PairId : parseIntVal(0),
                    }

                    //call edit Pair Configuration api
                    this.props.editPairConfiguration(this.Request)
                }
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
        if (AddPairConfiguration.oldProps !== props) {
            AddPairConfiguration.oldProps = props;
        } else {
            return null;
        }

        // check for currenct screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { marketCurrencyData } = props.Result;

            // check response is available or not
            if (marketCurrencyData) {
                try {
                    if (state.marketCurrencyData == null || (state.marketCurrencyData != null && marketCurrencyData !== state.marketCurrencyData)) {
                        if (validateResponseNew({ response: marketCurrencyData, isList: true })) {
                            let newRes = parseArray(marketCurrencyData.Response)
                            newRes.map((item, index) => {
                                newRes[index].value = newRes[index].CurrencyName
                            })
                            let res = [{ value: R.strings.SelectMarketCur }, ...newRes]
                            return { ...state, Currency: res }
                        } else {
                            return { ...state, Currency: [{ value: R.strings.SelectMarketCur }] }
                        }
                    }
                } catch (error) {
                    return { ...state, Currency: [{ value: R.strings.SelectMarketCur }] }
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { addPairSuccessData, editPairSuccessData, pairCurrencyData } = this.props.Result;

        // compare response with previous response
        if (pairCurrencyData !== prevProps.Result.pairCurrencyData) {
            //if pairCurrencyData response is not null then handle resposne
            if (pairCurrencyData) {
                if (this.state.pairCurrencyData == null || (this.state.pairCurrencyData != null && pairCurrencyData !== this.state.pairCurrencyData)) {
                    try {
                        if (validateResponseNew({ response: pairCurrencyData, isList: true })) {
                            let newRes = parseArray(pairCurrencyData.Response)
                            newRes.map((item, index) => {
                                newRes[index].value = newRes[index].SMSCode
                            })
                            let res = [{ value: R.strings.SelectPairCur }, ...newRes]
                            this.setState({ PairCurrency: res, })
                        }
                    } catch (error) {
                        this.setState({ PairCurrency: [{ value: R.strings.SelectPairCur }] })
                    }
                }
            }
        }

        // compare response with previous response
        if (addPairSuccessData !== prevProps.Result.addPairSuccessData) {

            //if addPairSuccessData response is not null then handle resposne
            if (addPairSuccessData) {
                try {
                    if (this.state.editPairSuccessData == null || (this.state.editPairSuccessData != null && editPairSuccessData !== this.state.editPairSuccessData)) {
                        if (validateResponseNew({ response: addPairSuccessData })) {
                            showAlert(R.strings.Status, R.strings.PairAdded, 0, () => {
                                this.props.clearNewPairData()
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            // clear data when response is failed
                            this.props.clearNewPairData()
                        }
                    }
                } catch (error) {
                    this.props.clearNewPairData()
                }
            }
        }

        // compare response with previous response
        if (editPairSuccessData !== prevProps.Result.editPairSuccessData) {

            // check response is available or not
            if (editPairSuccessData) {
                try {
                    if (this.state.addPairSuccessData == null || (this.state.addPairSuccessData != null && addPairSuccessData !== this.state.addPairSuccessData)) {
                        if (validateResponseNew({ response: editPairSuccessData })) {

                            showAlert(R.strings.Status, R.strings.PairUpdated, 0, () => {
                                this.props.clearNewPairData()
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        }
                        else {
                            this.props.clearNewPairData()
                        }
                    }
                } catch (error) {
                    this.props.clearNewPairData()
                }
            }
        }
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { marketCurrencyLoading, pairCurrencyLoading, addPairSuccessLoading, editPairSuccessLoading, deletePairSuccessLoading } = this.props.Result

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
                <ProgressDialog isShow={marketCurrencyLoading || pairCurrencyLoading || addPairSuccessLoading || editPairSuccessLoading || deletePairSuccessLoading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* View Pager Indicator (Tab) */}
                    <IndicatorViewPager
                        ref='PairConfigurationTab'
                        titles={this.state.tabNames}
                        numOfItems={3}
                        horizontalScroll={false}
                        isGradient={true}
                        style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
                        onPageScroll={this.onPageScroll.bind(this)}>

                        {/* First Tab */}
                        <View>
                            <View style={{
                                flex: 1,
                                paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                                paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin
                            }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {/* EditText for Market Name */}
                                    <EditText
                                        style={{ marginTop: 0 }}
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
                                    />

                                    {/* Picker for Market Currency */}
                                    <TitlePicker
                                        title={R.strings.Currency}
                                        array={this.state.Currency}
                                        selectedValue={this.state.selectedCurrency}
                                        onPickerSelect={(value) => this.onCurrencyPress(value)}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                    />

                                    {/* Picker for Pair Currency */}
                                    <TitlePicker
                                        title={R.strings.PairCurrency}
                                        array={this.state.PairCurrency}
                                        selectedValue={this.state.selectedPairCurrency}
                                        onPickerSelect={(value) => this.onPairCurrencyPress(value)}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                    />

                                    {/* EditText for Volume */}
                                    <EditText
                                        header={R.strings.volume}
                                        reference={input => { this.inputs['etVolume'] = input; }}
                                        placeholder={R.strings.volume}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.isValidInput('Volume', Label)}
                                        onSubmitEditing={() => { this.focusNextField('etCurrencyPrice') }}
                                        value={this.state.Volume.toString()}
                                    />

                                    {/* EditText for Volume */}
                                    <EditText
                                        header={R.strings.currencyPrice}
                                        reference={input => { this.inputs['etCurrencyPrice'] = input; }}
                                        placeholder={R.strings.currencyPrice}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.isValidInput('CurrencyPrice', Label)}
                                        onSubmitEditing={() => { this.focusNextField('etBuyMinQty') }}
                                        value={this.state.CurrencyPrice.toString()}
                                    />
                                </ScrollView>
                            </View>
                        </View>

                        {/* Second Tab */}
                        <View>
                            <View style={{
                                paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                                paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin - R.dimens.widgetMargin
                            }}>
                                <ScrollView showsVerticalScrollIndicator={false}>

                                    {this.CommonSplitItem(
                                        R.strings.BuyQty,
                                        R.strings.BuyMinQty,
                                        R.strings.BuyMaxQty,
                                        'etBuyMinQty',
                                        'etBuyMaxQty',
                                        () => this.focusNextField('etBuyMaxQty'),
                                        () => this.focusNextField('etSellMinQty'),
                                        this.state.BuyMinQty,
                                        this.state.BuyMaxQty,
                                        (Label) => this.isValidInput('BuyMinQty', Label),
                                        (Label) => this.isValidInput('BuyMaxQty', Label),
                                        true,
                                    )}

                                    {this.CommonSplitItem(
                                        R.strings.SellQty,
                                        R.strings.SellMinQty,
                                        R.strings.SellMaxQty,
                                        'etSellMinQty',
                                        'etSellMaxQty',
                                        () => this.focusNextField('etSellMaxQty'),
                                        () => this.focusNextField('etBuyMinPrice'),
                                        this.state.SellMinQty,
                                        this.state.SellMaxQty,
                                        (Label) => this.isValidInput('SellMinQty', Label),
                                        (Label) => this.isValidInput('SellMaxQty', Label),
                                        true
                                    )}

                                    {this.CommonSplitItem(
                                        R.strings.BuyPrice,
                                        R.strings.BuyMinPrice,
                                        R.strings.BuyMaxPrice,
                                        'etBuyMinPrice',
                                        'etBuyMaxPrice',
                                        () => this.focusNextField('etBuyMaxPrice'),
                                        () => this.focusNextField('etSellMinPrice'),
                                        this.state.BuyMinPrice,
                                        this.state.BuyMaxPrice,
                                        (Label) => this.isValidInput('BuyMinPrice', Label),
                                        (Label) => this.isValidInput('BuyMaxPrice', Label),
                                        true,
                                    )}

                                    {this.CommonSplitItem(
                                        R.strings.SellPrice,
                                        R.strings.SellMinPrice,
                                        R.strings.SellMaxPrice,
                                        'etSellMinPrice',
                                        'etSellMaxPrice',
                                        () => this.focusNextField('etSellMaxPrice'),
                                        () => this.focusNextField('etSellPrice'),
                                        this.state.SellMinPrice,
                                        this.state.SellMaxPrice,
                                        (Label) => this.isValidInput('SellMinPrice', Label),
                                        (Label) => this.isValidInput('SellMaxPrice', Label),
                                        true,
                                    )}

                                    {this.CommonSplitItem(
                                        R.strings.Price,
                                        R.strings.SellPrice,
                                        R.strings.BuyPrice,
                                        'etSellPrice',
                                        'etBuyPrice',
                                        () => this.focusNextField('etBuyPrice'),
                                        () => this.focusNextField('etSellFees'),
                                        this.state.SellPrice,
                                        this.state.BuyPrice,
                                        (Label) => this.isValidInput('SellPrice', Label),
                                        (Label) => this.isValidInput('BuyPrice', Label),
                                        false,
                                    )}

                                    {this.CommonSplitItem(
                                        R.strings.Fees,
                                        R.strings.SellFees,
                                        R.strings.BuyFees,
                                        'etSellFees',
                                        'etBuyFees',
                                        () => this.focusNextField('etBuyFees'),
                                        () => this.focusNextField('etBuyFees'),
                                        this.state.SellFees,
                                        this.state.BuyFees,
                                        (Label) => this.isValidInput('SellFees', Label),
                                        (Label) => this.isValidInput('BuyFees', Label),
                                        false,
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
                                        header={R.strings.DefaultRate}
                                        reference={input => { this.inputs['etDefaultRate'] = input; }}
                                        placeholder={R.strings.DefaultRate}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.isValidInput('DefaultRate', Label)}
                                        onSubmitEditing={() => { this.focusNextField('etFeesCurrency') }}
                                        value={this.state.DefaultRate + ""}
                                        style={{ marginTop: 0 }}
                                    />

                                    {/* EditText for Fees Currency */}
                                    <EditText
                                        header={R.strings.FeesCurrency}
                                        reference={input => { this.inputs['etFeesCurrency'] = input; }}
                                        placeholder={R.strings.FeesCurrency}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ FeesCurrency: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etOpenOrderExp') }}
                                        value={this.state.FeesCurrency}
                                    />

                                    <View style={{ marginTop: R.dimens.widgetMargin }}>
                                        <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{R.strings.TxnChargeType}</TextViewMR>
                                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                            <ImageTextButton
                                                name={R.strings.Percentage}
                                                icon={this.state.isCheck ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                                                onPress={() => this.setState({ isCheck: true })}
                                                style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
                                                textStyle={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textPrimary, fontSize: R.dimens.smallText }}
                                                iconStyle={{ tintColor: this.state.isCheck ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                            />
                                            <ImageTextButton
                                                name={R.strings.Fixed}
                                                icon={!this.state.isCheck ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                                                onPress={() => this.setState({ isCheck: false })}
                                                style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
                                                textStyle={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textPrimary, fontSize: R.dimens.smallText }}
                                                iconStyle={{ tintColor: !this.state.isCheck ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                            />
                                        </View>
                                    </View>

                                    {/* EditText for Open Order Expiration */}
                                    <EditText
                                        header={R.strings.OpenOrderExp}
                                        reference={input => { this.inputs['etOpenOrderExp'] = input; }}
                                        placeholder={R.strings.EnterDays}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"done"}
                                        onChangeText={(Label) => this.setState({ OpenOrderExpiration: Label })}
                                        value={this.state.OpenOrderExpiration + ""}
                                    />

                                    {/* Picker for Status */}
                                    <TitlePicker
                                        title={R.strings.Status}
                                        array={this.state.Status}
                                        selectedValue={this.state.selectedStatus}
                                        onPickerSelect={(value) => this.onStatusChange(value)}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                                    />

                                </ScrollView>
                            </View>
                        </View>
                    </IndicatorViewPager>

                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: R.dimens.margin }}>
                        {
                            this.state.tabPosition > 0 ?
                                <BottomButton title={R.strings.Prev} onPress={() => this.onPrevPagePress()} />
                                :
                                null
                        }
                        <View style={{ flex: 1 }} />
                        {
                            (this.state.tabPosition < this.state.tabNames.length - 1) ?
                                <BottomButton title={R.strings.next} onPress={() => this.onNextPagePress()} />
                                :
                                <BottomButton
                                    title={this.activityName === 'Add' ? R.strings.add : R.strings.update}
                                    onPress={() => this.onSubmitPress()}
                                />
                        }
                    </View>

                </View>
            </SafeView>
        );
    }

    CommonSplitItem = (title, placeHolder1, placeHolder2, ref1, ref2, submitText1, submitText2, value1, value2, onChangeText1, onChangeText2, flag) => {
        return (
            <View style={{ marginTop: R.dimens.widgetMargin, }}>
                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{title}</TextViewMR>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: R.dimens.widgetMargin }}>
                    <EditText
                        style={{ flex: 1, justifyContent: 'center', marginTop: 0 }}
                        reference={input => { this.inputs[ref1] = input; }}
                        placeholder={placeHolder1}
                        multiline={false}
                        keyboardType='numeric'
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onChangeText={onChangeText1}
                        onSubmitEditing={submitText1}
                        value={value1 + ""}
                        maxLength={10}
                    />

                    {
                        flag ?
                            <Text style={{ marginLeft: R.dimens.widgetMargin, marginRight: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.To}</Text>
                            :
                            <View style={{ marginLeft: R.dimens.volumeText, marginRight: R.dimens.volumeText, }} />
                    }

                    <EditText
                        style={{ flex: 1, justifyContent: 'center', marginTop: 0 }}
                        reference={input => { this.inputs[ref2] = input; }}
                        placeholder={placeHolder2}
                        multiline={false}
                        keyboardType='numeric'
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onChangeText={onChangeText2}
                        onSubmitEditing={submitText2}
                        value={value2 + ""}
                        maxLength={10}
                    />
                </View>
            </View>
        )
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
    }
}

/* return state from saga or resucer */
const mapStateToProps = (state) => {
    // data from pair configuration reducer
    return {
        Result: state.pairConfigurationReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({

    // action for get market list
    getMarketCurrencyList: (payload) => dispatch(getMarketCurrencyList(payload)),

    // action for clear pair data from reducer
    clearNewPairData: () => dispatch(clearNewPairData()),

    // action for pair currency list
    getPairCurrencyList: (payload) => dispatch(getPairCurrencyList(payload)),

    // action for Add record pair configuration
    addPairConfiguration: (payload) => dispatch(addPairConfiguration(payload)),

    // action for Edit record pair configuration
    editPairConfiguration: (payload) => dispatch(editPairConfiguration(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddPairConfiguration);
