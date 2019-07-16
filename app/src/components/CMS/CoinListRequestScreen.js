import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCoinlistRequest, addCoinListRequest, addCoinListRequestClear } from '../../actions/CMS/CoinListRequestAction'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { View, FlatList } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { changeTheme, parseArray, showAlert } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateURL, validateMobileNumber, isEmpty } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../Navigation';
import CommonToast from '../../native_theme/components/CommonToast';
import EditText from '../../native_theme/components/EditText';
import { getData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import Picker from '../../native_theme/components/Picker';
import { CheckEmailValidation } from '../../validations/EmailValidation';
import R from '../../native_theme/R';
import Button from '../../native_theme/components/Button';
import IndicatorViewPager from '../../native_theme/components/IndicatorViewPager';
import DatePickerWidget from '../Widget/DatePickerWidget';
import ListLoader from '../../native_theme/components/ListLoader';
import TextViewMR from '../../native_theme/components/TextViewMR';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class CoinListRequestScreen extends Component {

    constructor(props) {
        super(props);

        //for focus on next field
        this.inputs = {};

        //Define All State initial state
        this.state = {
            response: [],
            tabesName: [],
            tabsSize: [],
            tabsRes: [],
            //for spinner
            SpinnerCoinTypeData: [{ value: R.strings.select + ' ' + R.strings.coin_type }, { value: 'Coin' }, { value: 'ERC20 Tokens' }],
            selectedCoinType: R.strings.select + ' ' + R.strings.coin_type,

            blockspeed: '',
            advisory: '',
            difficulty: '',
            wallet: '',
            isFirstTime: true,
            //array for mathcing with API response
            keyArray: [
                "coin_name", "coin_ticker", "date_of_issuance", "coin_logo", "coin_website", "website_faq",
                "coin_forum", "bitcoin_talk", "whitepaper_business", "whitepaper_technical", "stack_channel", "official_gitHub_repository_link", "team_contact", "team_bio", "headquarter_address",
                "wallet_source_code", "node_source_code", "official_blockchain_explorer_link", "max_coin_supply", "tx_Fee_for_transaction",
                "social_media_links", "code_review_audit_trusted_community", "deployment_process", "premined_coin_amount", "premined_coin_in_escrow",
                "number_of_addresses_coins_were_distributed", "segwit_exhibition", "blockspeed", "core_algorithm", "amount_raised_during_pre_ico",
                "advisory", "number_of_blocks_mined", "dev_language", "erc_20_compliant", "difficulty", "wallet", "usual_cost", "if_this_coin_is_a_security",
                "coin_type", "coin_description", "coin_short_name", "coin_address", "decimal", "total_supply", "circulating_supply", "first_name", "last_name",
                "address", "address_line_2", "city", "state", "postalCode", "country", "phone", "email", "project_name", "project_website_link",
                "do_you_have_an_active_community", "information_on_how_funds_were_raised", "current_listing_on_other_exchanges"],
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // for check internet connection
        if (await isInternet()) {

            //fetching list of coin
            this.props.getCoinlistRequest();
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }
        if (isCurrentScreen(props)) {

            //get coin listing data
            const { addCoinData, coinFieldsList, loading } = props.appData;

            //check loading bit for getting response
            if (!loading) {
                if (state.coinFieldsList == null || (state.coinFieldsList != null && coinFieldsList !== state.coinFieldsList)) {
                    try {
                        //Handle Success Response
                        if (validateResponseNew({ response: coinFieldsList, returnCode: coinFieldsList.responseCode, statusCode: coinFieldsList.statusCode, returnMessage: coinFieldsList.message })) {

                            //check Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            var res = parseArray(coinFieldsList.data[0].formfields)

                            let finalResponse = []
                            let tabsLength = 0

                            state.keyArray.map(item => {
                                let itemIndex = res.findIndex((resItem) => resItem.key === item);
                                if (itemIndex > -1) {
                                    let resItem = res[itemIndex];

                                    //for making size of tabs
                                    if (resItem.status == 1) { tabsLength += 1 }
                                    //-----

                                    // this.setState({ tabArray: resItem.key })
                                    if (resItem.key === "coin_type") {
                                        finalResponse.push({ name: resItem.fieldname, value: '', isEditText: false, isSpinner: true, isPhoneValidate: false, isLinkValidate: false, isEmailValidate: false, key: resItem.key, Isrequired: resItem.Isrequired, status: resItem.status == 1 })
                                    }

                                    //for date picker
                                    else if (resItem.key === 'date_of_issuance') {
                                        finalResponse.push({ name: resItem.fieldname, value: '', isDatePicker: true, key: resItem.key, Isrequired: resItem.Isrequired, status: resItem.status == 1 })
                                    }

                                    //for link validation
                                    else if (resItem.key === "coin_logo" || resItem.key === 'official_blockchain_explorer_link' || resItem.key === 'official_gitHub_repository_link' || resItem.key === 'project_website_link') {
                                        finalResponse.push({ name: resItem.fieldname, value: '', isEditText: true, isSpinner: false, isPhoneValidate: false, isLinkValidate: true, isEmailValidate: false, key: resItem.key, Isrequired: resItem.Isrequired, status: resItem.status == 1 })
                                    }

                                    // for email validation
                                    else if (resItem.key === 'email') {
                                        finalResponse.push({ name: resItem.fieldname, value: '', isEditText: true, isSpinner: false, isPhoneValidate: false, isLinkValidate: false, isEmailValidate: true, key: resItem.key, Isrequired: resItem.Isrequired, status: resItem.status == 1 })
                                    }

                                    //for phone number validation
                                    else if (resItem.key === 'phone') {
                                        finalResponse.push({ name: resItem.fieldname, value: '', isEditText: true, isSpinner: false, isPhoneValidate: true, isLinkValidate: false, isEmailValidate: false, key: resItem.key, Isrequired: resItem.Isrequired, status: resItem.status == 1 })
                                    }
                                    else {
                                        finalResponse.push({ name: resItem.fieldname, value: '', isEditText: true, isSpinner: false, isPhoneValidate: false, key: resItem.key, Isrequired: resItem.Isrequired, status: resItem.status == 1 })
                                    }
                                } else {
                                    finalResponse.push({ name: item, value: '', isEditText: false, key: item, Isrequired: 0, status: false })
                                }
                            })

                            //handle response and add dynamic tabs based on response
                            let tabsSize = Math.ceil(tabsLength / 10)
                            let tempTab = []
                            let tabesName = []
                            let lastindex = 0;

                            // to store current tab index in loop
                            let runningTab = 0;

                            //loop through number of tabs
                            for (let i = 0; i < tabsSize; i++) {

                                // current tab data, to get type of component
                                let tabData = []

                                // loop through all component
                                for (var j = 0; j < finalResponse.length; j++) {
                                    // loop untill running tab index is same
                                    if (runningTab == j) {

                                        // if last index is 0 then, insert all component in first tab
                                        if (lastindex == 0) {

                                            //insert first 10 records and store 11th index in last index
                                            if (tabData.length < 10) {

                                                //if component status is active then display component
                                                if (finalResponse.status == 1)
                                                    tabData.push(finalResponse)
                                            } else {
                                                // store 11th index and increment running tab to add other component in other tabs
                                                lastindex = j;
                                                runningTab++;
                                            }
                                        } else {
                                            // last index is greater then 0 and current index is 11 or greater then 10
                                            if (j >= lastindex) {

                                                //insert first 10 records and store 11th index in last index
                                                if (tabData.length < 10) {

                                                    //if component status is active then display component
                                                    if (finalResponse.status == 1)
                                                        tabData.push(finalResponse)
                                                } else {

                                                    // store 11th index and increment running tab to add other component in other tabs
                                                    lastindex = j;
                                                    runningTab++;
                                                }
                                            }
                                        }
                                    }
                                }

                                //for tab names with particular tab data
                                tempTab.push({
                                    name: 'test' + (i + 1),
                                    tabData,

                                })
                                tabesName.push('test' + (i + 1));
                            }
                            return { ...state, response: finalResponse, refreshing: false, tabsRes: tempTab, tabesName };
                        } else {
                            return { ...state, response: [], refreshing: false };
                        }
                    } catch (e) {
                        return { ...state, response: [], refreshing: false };
                    }
                }
            }
            //check loading bit for getting response
            if (!loading) {
                // check add coin data is not null
                if (addCoinData !== null) {
                    try {
                        if (state.addCoinData == null || (state.addCoinData != null && addCoinData !== state.addCoinData)) {

                            // Response is validate or not and if not then alert is displayed on screen
                            if (validateResponseNew({ response: addCoinData, returnCode: addCoinData.responseCode, returnMessage: addCoinData.message, statusCode: addCoinData.statusCode, })) {
                                return { ...state, addCoinData }
                            }
                        }
                    } catch (error) {
                        return { ...state }
                    }
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        let addCoinData = this.props.appData.addCoinData;

        //check response with previous response
        if (addCoinData !== prevProps.appData.addCoinData) {

            //check add coin data is not null
            if (addCoinData !== null) {
                try {
                    // Response is validate or not and if not then alert is displayed on screen
                    if (validateResponseNew({ response: addCoinData, returnCode: addCoinData.responseCode, returnMessage: addCoinData.message, statusCode: addCoinData.statusCode, })) {
                        showAlert(R.strings.Success + '!', addCoinData.message, 0, () => {
                            this.props.addCoinListRequestClear();
                        })
                    } else {
                        //check response containg validation error
                        if (addCoinData.errors) {

                            //check for lenght of error response
                            if (Object.keys(addCoinData.errors).length !== 0) {

                                //bit for displaying toast only one time
                                let isShowToast = true

                                //for getting fields from keys array
                                this.state.keyArray.map((item) => {

                                    //check for validation failed items
                                    if (addCoinData.errors[item]) {

                                        //for getting name of the field from main response
                                        this.state.response.map((responseItem) => {

                                            //check validation failed item is available in main response
                                            if (item === responseItem.key && isShowToast) {
                                                isShowToast = false
                                                this.refs.Toast.Show(R.strings.enter + ' ' + responseItem.name);
                                                return;
                                            }
                                        })
                                    }
                                })
                            }
                        }

                        //clear response after handling response when response is failure
                        this.props.clearWalletBlockTrn()
                        //------------
                    }
                } catch (error) { }
            }
        }
    };

    //on submit coin list request
    onPressSubmit = async () => {

        //check for validations
        let iscallAPI = true
        let isValidate = false
        this.state.response.map((item, index) => {
            if (item.status) {
                if (item.isEditText) {
                    if (item.value === '' && item.Isrequired == 1 && !isValidate) {
                        this.refs.Toast.Show(R.strings.enter + ' ' + item.name);
                        iscallAPI = false
                        isValidate = true
                    }
                    else if (item.isEmailValidate && CheckEmailValidation(item.value)) {
                        this.refs.Toast.Show(R.strings.email_validation);
                        iscallAPI = false
                        isValidate = true
                    }
                    if (item.isLinkValidate && !validateURL(item.value) && item.value !== '') {
                        this.refs.Toast.Show(R.strings.enter_proper + ' ' + item.name);
                        iscallAPI = false
                        isValidate = true
                    }
                    if (item.isPhoneValidate && !validateMobileNumber(item.value) && item.value !== '') {
                        this.refs.Toast.Show(R.strings.enter_proper + ' ' + item.name);
                        iscallAPI = false
                        isValidate = true
                    }
                }
                if (item.isSpinner) {
                    if (item.value === R.strings.select + ' ' + item.name && item.Isrequired == 1 && !isValidate) {
                        this.refs.Toast.Show(R.strings.select + ' ' + item.name);
                        iscallAPI = false
                        isValidate = true
                    }
                }
                if (item.isDatePicker) {
                    if (item.value === R.strings.select_date && item.Isrequired == 1 && !isValidate) {
                        this.refs.Toast.Show(R.strings.select + ' ' + item.name);
                        iscallAPI = false
                        isValidate = true
                    }
                }
            }
        })
        //check call api bit
        if (iscallAPI) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                let req = {};

                //create request for listing coin
                this.state.tabsRes.map((item, index) => {
                    item.tabData.map((itemTabData, indexTabData) => {
                        req = {
                            ...req,
                            [itemTabData.key]: itemTabData.value
                        }
                    })

                })

                //final request for listing coin
                var requestdata = {
                    coinListdata: {
                        userId: getData(ServiceUtilConstant.Email),
                        coinFields: req
                    }
                }

                // call API  for Adding countries
                this.props.addCoinListRequest(requestdata);
            }
        }
    }

    //To Validate Mobile Number
    validateMobileNumber = (MobileNumber) => {
        if (validateMobileNumber(MobileNumber)) {
            this.setState({ phone: MobileNumber })
        }
    }

    //Called when onPage Scrolling
    onPageScroll = (scrollData) => {
        let { position } = scrollData
        if (position != this.state.tabPosition) {
            this.setState({ tabPosition: position, })
        }
    }

    // user press on next page button
    onNextPagePress = () => {
        if (this.state.tabPosition < this.state.tabesName.length - 1) {
            let pos = this.state.tabPosition + 1
            if (this.refs['CoinRequestTab']) {
                this.refs['CoinRequestTab'].setPage(pos)
            }
        }
    }

    // user press on prev page button
    onPrevPagePress = () => {
        if (this.state.tabPosition > 0) {
            let pos = this.state.tabPosition - 1
            if (this.refs['CoinRequestTab']) {
                this.refs['CoinRequestTab'].setPage(pos)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }
    //---

    render() {
        //loading bit for handling progress dialog
        let { loading } = this.props.appData

        return (
            <SafeView style={this.styles().container} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.list_coin} isBack={true} nav={this.props.navigation} />

                {/* Custom Toast */}
                <CommonToast ref="Toast" />

                {loading ? <ListLoader /> :
                    <View style={{ flex: 1 }}>
                        {this.state.tabsRes && this.state.tabsRes.length ?
                            <View style={{ flex: 1 }}>

                                {/* To stop overflow of IndicatorViewPager in parent screen using overflow property in style */}
                                <View style={{ flex: 1, justifyContent: 'space-between', overflow: 'hidden' }}>

                                    <IndicatorViewPager
                                        ref='CoinRequestTab'
                                        style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
                                        titles={this.state.tabesName}
                                        onPageScroll={this.onPageScroll}
                                        isGradient={true}>
                                        {
                                            this.state.tabsRes.map((item, tabIndex) => {
                                                return <View key={tabIndex.toString()} style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                                                    <FlatList
                                                        showsVerticalScrollIndicator={false}
                                                        key={item.tabData.key}
                                                        data={item.tabData}
                                                        extraData={this.state}
                                                        renderItem={({ itemType, index }) => {
                                                            if (itemType.status) {
                                                                if (itemType.isEditText) {
                                                                    return <EditText
                                                                        reference={input => { this.inputs[itemType.name] = input; }}
                                                                        value={itemType.value}
                                                                        header={itemType.name}
                                                                        placeholder={itemType.name}
                                                                        multiline={false}
                                                                        keyboardType={(itemType.key === 'premined_coin_amount' || itemType.key === 'phone' || itemType.key === 'postalCode' || itemType.key === 'total_supply' || itemType.key === 'circulating_supply') ? 'numeric' : 'default'}
                                                                        returnKeyType={"done"}
                                                                        isRequired={itemType.Isrequired == 1}
                                                                        onChangeText={(text) => {
                                                                            let array = this.state.tabsRes;
                                                                            array[tabIndex].tabData[index].value = text;
                                                                            this.setState({ tabsRes: array })
                                                                        }}

                                                                    //onSubmitEditing={() => { !this.state.response.lastIndexOf(item) ? this.focusNextField(this.state.response[index + 1].key) : null }}
                                                                    />
                                                                }
                                                                else if (itemType.isSpinner) {
                                                                    return (
                                                                        <View>
                                                                            <TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginTop: R.dimens.widget_top_bottom_margin, }}>
                                                                                {itemType.name}
                                                                                {itemType.Isrequired == 1 && <TextViewMR style={{ color: R.colors.failRed }}> *</TextViewMR>}
                                                                            </TextViewMR>
                                                                            <Picker
                                                                                ref='spCoinType'
                                                                                data={this.state.SpinnerCoinTypeData}
                                                                                value={itemType.value ? itemType.value : R.strings.select + ' ' + itemType.name}
                                                                                onPickerSelect={(text) => {
                                                                                    let array = this.state.tabsRes;
                                                                                    array[tabIndex].tabData[index].value = text;
                                                                                    this.setState({ tabsRes: array })
                                                                                }}
                                                                                displayArrow={'true'}
                                                                                width={'100%'}
                                                                            />
                                                                        </View>
                                                                    )
                                                                }
                                                                else if (itemType.isDatePicker) {
                                                                    return (
                                                                        <DatePickerWidget
                                                                            fromTitle={itemType.name}
                                                                            isRequired={itemType.Isrequired == 1}
                                                                            FromDatePickerCall={(date) => {
                                                                                let array = this.state.tabsRes;
                                                                                array[tabIndex].tabData[index].value = date;
                                                                                this.setState({ tabsRes: array })
                                                                            }}
                                                                            FromDate={isEmpty(itemType.value) ? R.strings.select_date : itemType.value}
                                                                        //ToDatePickerCall={(date) => this.setState({ stToDate: date, isFilter: false })}
                                                                        //ToDate={this.state.stToDate}
                                                                        />
                                                                    )
                                                                }
                                                            }
                                                        }
                                                        }//}
                                                        keyExtractor={(_item, index) => index.toString()}
                                                    />
                                                </View>
                                            })
                                        }
                                    </IndicatorViewPager>
                                    <View style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, alignItems: 'center', flexDirection: 'row', marginLeft: R.dimens.margin_left_right, marginRight: R.dimens.margin_left_right }}>
                                        {
                                            this.state.tabPosition > 0 ?
                                                this.bottomButton(R.strings.Prev, this.onPrevPagePress)
                                                :
                                                null
                                        }
                                        <View style={{ flex: 1 }} />
                                        {
                                            (this.state.tabPosition < this.state.tabesName.length - 1) ?
                                                this.bottomButton(R.strings.next, this.onNextPagePress)
                                                :
                                                this.bottomButton(R.strings.submit, this.onPressSubmit)
                                        }
                                    </View>
                                </View>
                            </View> : <ListEmptyComponent />
                        }
                    </View>
                }
            </SafeView>
        );
    }
    //bottom submit button
    bottomButton = (title, onPress) => {
        return (
            <Button
                isRound={true}
                title={title}
                textStyle={{ fontSize: R.dimens.smallestText }}
                style={{ width: wp('20%'), paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding }}
                onPress={onPress} />
        )
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: R.colors.background
            },
        }
    }
}
function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
        appData: state.CoinListRequestReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    getCoinlistRequest: () => dispatch(getCoinlistRequest()),
    addCoinListRequest: (request) => dispatch(addCoinListRequest(request)),
    addCoinListRequestClear: () => dispatch(addCoinListRequestClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CoinListRequestScreen);
