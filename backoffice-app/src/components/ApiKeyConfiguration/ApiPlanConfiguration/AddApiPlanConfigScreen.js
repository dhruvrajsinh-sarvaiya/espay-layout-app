import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme, parseFloatVal, showAlert, parseIntVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import { addApiPlanConfig, clearApiPlanConfigData } from '../../../actions/ApiKeyConfiguration/ApiPlanConfigActions';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import EditText from '../../../native_theme/components/EditText';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import BottomButton from '../../../native_theme/components/BottomButton';

export class AddApiPlanConfigScreen extends Component {

    constructor(props) {
        super(props)

        // Getting data from previous screen
        let ReadOnlyAPI = props.navigation.state.params && props.navigation.state.params.ReadOnlyAPI
        let FullAccessAPI = props.navigation.state.params && props.navigation.state.params.FullAccessAPI
        let Currency = props.navigation.state.params && props.navigation.state.params.Currency

        // Define all initial state
        this.state = {

            tabPosition: 0,
            tabsName: [R.strings.apiDetail, R.strings.planValidity, R.strings.apiSelections],

            AddApiPlanConfigDataState: null,

            Currency: Currency ? Currency : [],
            PlanValidityType: [
                { value: R.strings.Please_Select },
                { value: R.strings.day, ID: 1 },
                { value: R.strings.month, ID: 2 },
                { value: R.strings.Year, ID: 3 },
            ],

            selectedCurrency: R.strings.selectCurrency,
            selectedPlanValType: R.strings.Please_Select,

            PlanName: '',
            PlanValidity: '',
            Price: '',
            Charge: '',
            Priority: '',
            MaxPerMinute: '',
            MaxPerDay: '',
            MaxPerMonth: '',
            MaxOrderPerSec: '',
            MaxRecordPerReq: '',
            MaxReqSize: '',
            MaxResSize: '',
            WhitelistEndPoint: '',
            ConcurrenctEndPoint: '',
            HistoricalMonth: '',
            PlanDesc: '',
            PlanValTypeId: 0,
            WalletTypeId: 0,

            IsPlanRecursive: false,
            Status: true,
            isFirstTime: true,

            ReadOnlyAPI: ReadOnlyAPI ? ReadOnlyAPI : [],
            FullAccessAPI: FullAccessAPI ? FullAccessAPI : [],
        }

        this.inputs = {}

        // create reference
        this.toast = React.createRef()
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        let newReadOnlyData = [], newAccessData = []

        let keyPairs = this.state.ReadOnlyAPI;
        let fullAccessPairs = this.state.FullAccessAPI;

        for (let i = 0; i < keyPairs.length; i++) {
            newReadOnlyData.push({
                id: keyPairs[i].ID,
                title: keyPairs[i].MethodName,
                isSelected: false
            })
        }

        for (let i = 0; i < fullAccessPairs.length; i++) {
            newAccessData.push({
                id: fullAccessPairs[i].ID,
                title: fullAccessPairs[i].MethodName,
                isSelected: false
            })
        }

        this.setState({ ReadOnlyAPI: newReadOnlyData, FullAccessAPI: newAccessData })

    }
    // this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    // User checked full access method item
    onFullAccessChecked = (title) => {
        let newArray = this.state.FullAccessAPI
        newArray.map((item, index) => {
            if (item.title === title) {
                item.isSelected = !item.isSelected
            }
        })
        this.setState({ FullAccessAPI: newArray })
    }


    // user press on next page button
    onNextPagePress = () => {
        if (this.state.tabPosition < this.state.tabsName.length - 1) {
            let pos = this.state.tabPosition + 1

            if (this.refs['ApiPlanConfigTab']) {
                this.refs['ApiPlanConfigTab'].setPage(pos)
            }
        }
    }
    // user press on prev page button
    onPrevPagePress = () => {
        if (this.state.tabPosition > 0) {
            let pos = this.state.tabPosition - 1

            if (this.refs['ApiPlanConfigTab']) {
                this.refs['ApiPlanConfigTab'].setPage(pos)
            }
        }
    }

    // Called when onPage Scrolling
    onPageScroll = (scrollData) => {
        let { position } = scrollData
        if (position != this.state.tabPosition) {
            this.setState({ tabPosition: position, })
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {

        //stop twice api call
        return isCurrentScreen(nextProps)
    }


    // User checked full read only method item
    onReadOnlyChecked = (title) => {
        let newArray = this.state.ReadOnlyAPI
        newArray.map((item, index) => {
            if (item.title === title) {
                item.isSelected = !item.isSelected
            }
        })
        this.setState({ ReadOnlyAPI: newArray })
    }

    // After check all validation, call api
    onSubmitPress = async () => {
        if (isEmpty(this.state.PlanName))
            this.toast.Show(R.strings.enterPlanName)
        else if (this.state.selectedPlanValType === R.strings.Please_Select)
            this.toast.Show(R.strings.selectPlanValidityType)
        else if (isEmpty(this.state.PlanValidity))
            this.toast.Show(R.strings.enterPlanValidity)
        else if (this.state.selectedCurrency === R.strings.selectCurrency)
            this.toast.Show(R.strings.selectCurrency)
        else if (isEmpty(this.state.Priority))
            this.toast.Show(R.strings.enterPriority)
        else {

            let readOnlyId = [], fullAccessId = []
            if (this.state.ReadOnlyAPI.length > 0) {
                for (var readOnlyData in this.state.ReadOnlyAPI) {
                    let item = this.state.ReadOnlyAPI[readOnlyData]
                    if (item.isSelected)
                        readOnlyId.push(item.id)
                }
            }

            if (this.state.FullAccessAPI.length > 0) {
                for (var fullaccessApiKey in this.state.FullAccessAPI) {
                    let item = this.state.FullAccessAPI[fullaccessApiKey]
                    if (item.isSelected)
                        fullAccessId.push(item.id)
                }
            }

            // check internet connection
            if (await isInternet()) {

                let req = {
                    MaxPerMinute: isEmpty(this.state.MaxPerMinute) ? 0 : parseIntVal(this.state.MaxPerMinute),
                    MaxPerDay: isEmpty(this.state.MaxPerDay) ? 0 : parseIntVal(this.state.MaxPerDay),
                    HistoricalDataMonth: isEmpty(this.state.HistoricalMonth) ? 0 : parseIntVal(this.state.HistoricalMonth),
                    IsPlanRecursive: this.state.IsPlanRecursive ? 1 : 0,
                    PlanValidity: isEmpty(this.state.PlanValidity) ? 0 : parseIntVal(this.state.PlanValidity),
                    PlanValidityType: this.state.PlanValTypeId,
                    ConcurrentEndPoints: isEmpty(this.state.ConcurrenctEndPoint) ? 0 : parseIntVal(this.state.ConcurrenctEndPoint),
                    ReadonlyAPI: readOnlyId.length > 0 ? readOnlyId : [],
                    FullAccessAPI: fullAccessId.length > 0 ? fullAccessId : [],
                    CreatedIPAddress: '',
                    ServiceID: this.state.WalletTypeId,
                    PlanName: this.state.PlanName,
                    Price: isEmpty(this.state.Price) ? 0 : parseFloatVal(this.state.Price),
                    Status: this.state.Status ? 1 : 0,
                    Charge: isEmpty(this.state.Charge) ? 0 : parseFloatVal(this.state.Charge),
                    PlanDesc: this.state.PlanDesc,
                    MaxPerMonth: isEmpty(this.state.MaxPerMonth) ? 0 : parseIntVal(this.state.MaxPerMonth),
                    MaxOrderPerSec: isEmpty(this.state.MaxOrderPerSec) ? 0 : parseIntVal(this.state.MaxOrderPerSec),
                    MaxRecPerRequest: isEmpty(this.state.MaxRecordPerReq) ? 0 : parseIntVal(this.state.MaxRecordPerReq),
                    MaxReqSize: isEmpty(this.state.MaxReqSize) ? 0 : parseIntVal(this.state.MaxReqSize),
                    MaxResSize: isEmpty(this.state.MaxResSize) ? 0 : parseIntVal(this.state.MaxResSize),
                    WhitelistedEndPoints: isEmpty(this.state.WhitelistEndPoint) ? 0 : parseIntVal(this.state.WhitelistEndPoint),
                    Priority: isEmpty(this.state.Priority) ? 0 : parseIntVal(this.state.Priority),
                }

                // Call add api plan configuration api
                this.props.addApiPlanConfig(req)
            }
        }
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { AddApiPlanConfigData } = this.props.ApiPlanConfigResult

        // check previous props and existing props
        if (AddApiPlanConfigData !== prevProps.ApiPlanConfigResult.AddApiPlanConfigData) {
            // AddApiPlanConfigData is not null
            if (AddApiPlanConfigData) {
                try {
                    if (this.state.AddApiPlanConfigDataState == null || (this.state.AddApiPlanConfigDataState != null && AddApiPlanConfigData !== this.state.AddApiPlanConfigDataState)) {
                        // Handle Response
                        if (validateResponseNew({ response: AddApiPlanConfigData })) {

                            this.setState({ AddApiPlanConfigDataState: AddApiPlanConfigData })

                            showAlert(R.strings.Success + '!', AddApiPlanConfigData.ReturnMsg, 0, () => {
                                // Clear api plan configuration data
                                this.props.clearApiPlanConfigData()
                                // Navigate to Api Plan Configuration List Screen
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            // Clear api plan configuration data
                            this.props.clearApiPlanConfigData()
                        }
                    }
                } catch (error) {
                    // Clear api plan configuration data
                    this.props.clearApiPlanConfigData()
                    this.setState({ AddApiPlanConfigDataState: null })
                }
            }
        }
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { AddApiPlanConfigLoading, } = this.props.ApiPlanConfigResult

        let { IsPlanRecursive } = this.state
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.addApiPlanConfig}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progressbar */}
                <ProgressDialog isShow={AddApiPlanConfigLoading} />

                {/* Custom Toast for displaying message */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <IndicatorViewPager
                        ref={'ApiPlanConfigTab'}
                        isGradient={true}
                        titles={this.state.tabsName}
                        numOfItems={3}
                        horizontalScroll={false}
                        onPageScroll={this.onPageScroll}
                        style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin }}>

                        {/* Api Detail Tab */}
                        <View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flex: 1, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin }}>

                                    {/* To Set Plan Name in EditText */}
                                    <EditText
                                        isRequired={true}
                                        reference={input => { this.inputs['etPlanName'] = input; }}
                                        header={R.strings.plan_name}
                                        placeholder={R.strings.plan_name}
                                        multiline={false}
                                        onChangeText={(PlanName) => this.setState({ PlanName })}
                                        value={this.state.PlanName}
                                        style={{ marginTop: 0 }}
                                        maxLength={50}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.focusNextField('etPlanValidity') }}
                                    />

                                    {/* Picker for Plan Validity Type */}
                                    <TitlePicker
                                        style={{ marginTop: R.dimens.margin }}
                                        isRequired={true}
                                        title={R.strings.planValidityType}
                                        array={this.state.PlanValidityType}
                                        selectedValue={this.state.selectedPlanValType}
                                        onPickerSelect={(item, object) => this.setState({ selectedPlanValType: item, PlanValTypeId: object.ID })} />


                                    {/* To Set Plan Validity in EditText */}
                                    <EditText
                                        isRequired={true}
                                        maxLength={10}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.focusNextField('etPrice') }}
                                        onChangeText={(PlanValidity) => this.setState({ PlanValidity })}
                                        value={this.state.PlanValidity}
                                        validate={true}
                                        onlyDigit={true}
                                        reference={input => { this.inputs['etPlanValidity'] = input; }}
                                        header={R.strings.planValidity}
                                        placeholder={R.strings.planValidity}
                                        multiline={false}
                                    />

                                    {/* Picker for Currency */}
                                    <TitlePicker
                                        style={{ marginTop: R.dimens.margin }}
                                        isRequired={true}
                                        title={R.strings.Currency}
                                        array={this.state.Currency}
                                        selectedValue={this.state.selectedCurrency}
                                        onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, WalletTypeId: object.ServiceId })} />

                                    {/* To Set Price in EditText */}
                                    <EditText
                                        onSubmitEditing={() => { this.focusNextField('etCharge') }}
                                        onChangeText={(Price) => this.setState({ Price })}
                                        value={this.state.Price}
                                        validate={true}
                                        reference={input => { this.inputs['etPrice'] = input; }}
                                        header={R.strings.price}
                                        placeholder={R.strings.price}
                                        multiline={false}
                                        maxLength={10}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                    />

                                    {/* To Set Charge in EditText */}
                                    <EditText
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        reference={input => { this.inputs['etCharge'] = input; }}
                                        header={R.strings.Charge}
                                        placeholder={R.strings.Charge}
                                        multiline={false}
                                        onChangeText={(Charge) => this.setState({ Charge })}
                                        value={this.state.Charge}
                                        validate={true}
                                        maxLength={10}
                                        onSubmitEditing={() => { this.focusNextField('etPriority') }}
                                    />

                                    {/* To Set Priority in EditText */}
                                    <EditText
                                        maxLength={10}
                                        blurOnSubmit={false}
                                        validate={true}
                                        isRequired={true}
                                        reference={input => { this.inputs['etPriority'] = input; }}
                                        header={R.strings.priority}
                                        placeholder={R.strings.priority}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => { this.focusNextField('etPlanDescription') }}
                                        onChangeText={(Priority) => this.setState({ Priority })}
                                        value={this.state.Priority}
                                        multiline={false}
                                        />

                                    {/* To Set Plan Description in EditText */}
                                    <EditText
                                        reference={input => { this.inputs['etPlanDescription'] = input; }}
                                        header={R.strings.planDesc}
                                        placeholder={R.strings.planDesc}
                                        multiline={true}
                                        numberOfLines={4}
                                        maxLength={300}
                                        textAlignVertical={'top'}
                                        keyboardType='default'
                                        returnKeyType={"done"}
                                        onChangeText={(PlanDesc) => this.setState({ PlanDesc })}
                                        value={this.state.PlanDesc}
                                        blurOnSubmit={true}
                                    />
                                </View>
                            </ScrollView>
                        </View>

                        {/* Plan Validity Tab */}
                        <View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flex: 1, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin }}>

                                    {/* To Set Max.Per Minute in EditText */}
                                    <EditText
                                        style={{ marginTop: 0 }}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => { this.focusNextField('etMaxPerDay') }}
                                        onChangeText={(MaxPerMinute) => this.setState({ MaxPerMinute })}
                                        value={this.state.MaxPerMinute}
                                        validate={true}
                                        reference={input => { this.inputs['etMaxPerMinute'] = input; }}
                                        header={R.strings.maxPerMin}
                                        placeholder={R.strings.maxPerMin}
                                        multiline={false}
                                        keyboardType='numeric'
                                        onlyDigit={true}
                                        blurOnSubmit={false}
                                    />

                                    {/* To Set Max.Per Day in EditText */}
                                    <EditText
                                        header={R.strings.maxPerDay}
                                        placeholder={R.strings.maxPerDay}
                                        multiline={false}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => { this.focusNextField('etMaxPerMonth') }}
                                        onChangeText={(MaxPerDay) => this.setState({ MaxPerDay })}
                                        value={this.state.MaxPerDay}
                                        validate={true}
                                        reference={input => { this.inputs['etMaxPerDay'] = input; }}
                                        onlyDigit={true}
                                        keyboardType='numeric'
                                        blurOnSubmit={false}
                                    />

                                    {/* To Set Max.Per Month in EditText */}
                                    <EditText
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => { this.focusNextField('etMaxOrderPerSec') }}
                                        onChangeText={(MaxPerMonth) => this.setState({ MaxPerMonth })}
                                        value={this.state.MaxPerMonth}
                                        reference={input => { this.inputs['etMaxPerMonth'] = input; }}
                                        header={R.strings.maxPerMonth}
                                        validate={true}
                                        placeholder={R.strings.maxPerMonth}
                                        multiline={false}
                                        keyboardType='numeric'
                                        onlyDigit={true}
                                        blurOnSubmit={false}
                                    />

                                    {/* To Set Max.Order Per Second in EditText */}
                                    <EditText
                                        onSubmitEditing={() => { this.focusNextField('etMaxRecordPerReq') }}
                                        onChangeText={(MaxOrderPerSec) => this.setState({ MaxOrderPerSec })}
                                        value={this.state.MaxOrderPerSec}
                                        validate={true}
                                        header={R.strings.maxOrderPerSec}
                                        reference={input => { this.inputs['etMaxOrderPerSec'] = input; }}
                                        returnKeyType={"next"}
                                        placeholder={R.strings.maxOrderPerSec}
                                        multiline={false}
                                        keyboardType='numeric'
                                        onlyDigit={true}
                                        blurOnSubmit={false}
                                    />

                                    {/* To Set Max.Record Per Request in EditText */}
                                    <EditText
                                        reference={input => { this.inputs['etMaxRecordPerReq'] = input; }}
                                        header={R.strings.maxRecPerRequest}
                                        validate={true}
                                        onlyDigit={true}
                                        blurOnSubmit={false}
                                        placeholder={R.strings.maxRecPerRequest}
                                        multiline={false}
                                        keyboardType='numeric'
                                        onChangeText={(MaxRecordPerReq) => this.setState({ MaxRecordPerReq })}
                                        value={this.state.MaxRecordPerReq}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => { this.focusNextField('etMaxReqSize') }}
                                    />

                                    {/* To Set Max. Request Size in EditText */}
                                    <EditText
                                        reference={input => { this.inputs['etMaxReqSize'] = input; }}
                                        validate={true}
                                        onlyDigit={true}
                                        placeholder={R.strings.maxRequestSize}
                                        multiline={false}
                                        keyboardType='numeric'
                                        onChangeText={(MaxReqSize) => this.setState({ MaxReqSize })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => { this.focusNextField('etMaxResSize') }}
                                        blurOnSubmit={false}
                                        value={this.state.MaxReqSize}
                                        header={R.strings.maxRequestSize}
                                    />

                                    {/* To Set Max. Response Size in EditText */}
                                    <EditText
                                        placeholder={R.strings.maxResponseSize}
                                        multiline={false}
                                        value={this.state.MaxResSize}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => { this.focusNextField('etWhitelistEndPoint') }}
                                        onChangeText={(MaxResSize) => this.setState({ MaxResSize })}
                                        validate={true}
                                        reference={input => { this.inputs['etMaxResSize'] = input; }}
                                        blurOnSubmit={false}
                                        header={R.strings.maxResponseSize}
                                        onlyDigit={true}
                                    />

                                    {/* To Set Whitelist End Point in EditText */}
                                    <EditText
                                        onSubmitEditing={() => { this.focusNextField('etConcurrenctEndPoint') }}
                                        onChangeText={(WhitelistEndPoint) => this.setState({ WhitelistEndPoint })}
                                        value={this.state.WhitelistEndPoint}
                                        validate={true}
                                        reference={input => { this.inputs['etWhitelistEndPoint'] = input; }}
                                        header={R.strings.whitelistEndPoint}
                                        placeholder={R.strings.whitelistEndPoint}
                                        multiline={false}
                                        maxLength={10}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        onlyDigit={true}
                                        blurOnSubmit={false}
                                    />

                                    {/* To Set Concurrent End Point in EditText */}
                                    <EditText
                                        value={this.state.ConcurrenctEndPoint}
                                        validate={true}
                                        onlyDigit={true}
                                        blurOnSubmit={false}
                                        reference={input => { this.inputs['etConcurrenctEndPoint'] = input; }}
                                        header={R.strings.concurrenctEndPoint}
                                        placeholder={R.strings.concurrenctEndPoint}
                                        multiline={false}
                                        maxLength={10}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => { this.focusNextField('etHistoricalData') }}
                                        onChangeText={(ConcurrenctEndPoint) => this.setState({ ConcurrenctEndPoint })}
                                    />

                                    {/* To Set Historical Data in EditText */}
                                    <EditText
                                        reference={input => { this.inputs['etHistoricalData'] = input; }}
                                        header={R.strings.historicalDataMonth}
                                        keyboardType='numeric'
                                        returnKeyType={"done"}
                                        onChangeText={(ConcurrenctEndPoint) => this.setState({ ConcurrenctEndPoint })}
                                        placeholder={R.strings.historicalDataMonth}
                                        multiline={false}
                                        maxLength={10}
                                        value={this.state.ConcurrenctEndPoint}
                                        validate={true}
                                        onlyDigit={true}
                                    />
                                </View>
                            </ScrollView>
                        </View>

                        {/* API Selections Tab */}
                        <View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flex: 1, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin }}>

                                    {/* for status switch */}
                                    <FeatureSwitch
                                        isGradient={true}
                                        title={R.strings.Status}
                                        isToggle={this.state.Status}
                                        onValueChange={() => {
                                            this.setState({
                                                Status: !this.state.Status
                                            })
                                        }}
                                        textStyle={{ color: R.colors.white }}
                                    />

                                    {/* Selection for Plan Recursive */}
                                    <View style={{ flex: 1, marginTop: R.dimens.margin, flexDirection: 'row', alignItems: 'center', }}>
                                        <TextViewHML style={{ color: R.colors.textPrimary, flex: 1, fontSize: R.dimens.smallText }}>{R.strings.planRecursive}</TextViewHML>
                                        <ImageTextButton
                                            icon={IsPlanRecursive ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                            onPress={() => this.setState({ IsPlanRecursive: !IsPlanRecursive })}
                                            style={{ margin: 0, flexDirection: 'row-reverse' }}
                                            iconStyle={{ tintColor: IsPlanRecursive ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                        />
                                    </View>

                                    {/* Read Only Method List */}
                                    {
                                        Object.values(this.state.ReadOnlyAPI).length > 0 &&
                                        <View style={{ marginTop: R.dimens.margin, }}>
                                            <Text style={{ color: R.colors.textPrimary, fontFamily: Fonts.HindmaduraiBold, fontSize: R.dimens.smallText, marginLeft: R.dimens.LineHeight }}>{R.strings.readOnlyApiMethods}</Text>
                                            {
                                                Object.values(this.state.ReadOnlyAPI).map((item, index) => {
                                                    return (
                                                        <View key={index} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.LineHeight, marginRight: R.dimens.LineHeight }}>
                                                            <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.title}</TextViewHML>
                                                            <ImageTextButton
                                                                style={{ margin: 0, flexDirection: 'row-reverse', }}
                                                                onPress={() => this.onReadOnlyChecked(item.title)}
                                                                iconStyle={{ tintColor: item.isSelected ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                                                icon={item.isSelected ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                                            />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    }

                                    {/* Full Access Method List */}
                                    {
                                        Object.values(this.state.FullAccessAPI).length > 0 &&
                                        <View style={{ marginTop: R.dimens.margin }}>
                                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.HindmaduraiBold, marginLeft: R.dimens.LineHeight }}>{R.strings.fullAccessApiMethods}</Text>
                                            {
                                                Object.values(this.state.FullAccessAPI).map((item, index) => {
                                                    return (
                                                        <View key={index} style={{ flex: 1, marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.LineHeight, flexDirection: 'row', alignItems: 'center', marginRight: R.dimens.LineHeight }}>
                                                            <TextViewHML style={{ color: R.colors.textPrimary, flex: 1, fontSize: R.dimens.smallText }}>{item.title}</TextViewHML>
                                                            <ImageTextButton
                                                                icon={item.isSelected ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                                                onPress={() => this.onFullAccessChecked(item.title)}
                                                                style={{ margin: 0, flexDirection: 'row-reverse' }}
                                                                iconStyle={{ tintColor: item.isSelected ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                                            />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    }

                                </View>
                            </ScrollView>
                        </View>
                    </IndicatorViewPager>

                    <View style={{ alignItems: 'center', flexDirection: 'row', margin: R.dimens.margin }}>
                        {
                            this.state.tabPosition > 0 ?
                                <BottomButton title={R.strings.Prev} onPress={() => this.onPrevPagePress()} />
                                :
                                null
                        }
                        <View style={{ flex: 1 }} />
                        {
                            (this.state.tabPosition < this.state.tabsName.length - 1) ?
                                <BottomButton title={R.strings.next} onPress={() => this.onNextPagePress()} />
                                :
                                <BottomButton title={R.strings.add} onPress={() => this.onSubmitPress()} />
                        }
                    </View>
                </View>
            </SafeView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get api plan configuration data from reducer
        ApiPlanConfigResult: state.ApiPlanConfigReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Clear Api Plan Configuration
    clearApiPlanConfigData: () => dispatch(clearApiPlanConfigData()),
    // Perform Add Api Plan Configuration Action
    addApiPlanConfig: (payload) => dispatch(addApiPlanConfig(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddApiPlanConfigScreen)