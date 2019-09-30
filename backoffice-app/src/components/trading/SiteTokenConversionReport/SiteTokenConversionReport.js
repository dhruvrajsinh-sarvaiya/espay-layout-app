// SiteTokenConversionReport
// for userdata and walletcurrency use pairlist action reducer and saga for get responce
import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Image, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import Separator from '../../../native_theme/components/Separator';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation'
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import Drawer from 'react-native-drawer-menu';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import FilterWidget from '../../../components/widget/FilterWidget';
import R from '../../../native_theme/R';
import { getCurrencyList, getUserDataList, } from '../../../actions/PairListAction';
import { getTokenCurrencyData, getSiteTokenReportData } from '../../../actions/Trading/SiteTokenConversionReportAction';
import ImageViewWidget from '../../../components/widget/ImageViewWidget';
import { DateValidation } from '../../../validations/DateValidation';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class SiteTokenConversionReport extends Component {
    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();

        //Define all initial state
        this.state = {
            data: [],
            search: '',
            // filter data 
            users: [{ value: R.strings.Please_Select }],
            selectedUser: R.strings.Please_Select,
            selectedUserId: '',
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            WalletCurrency: [{ value: R.strings.Please_Select }],
            TokenCurrency: [{ value: R.strings.Please_Select }],
            selectedWalletCurrency: R.strings.Please_Select,
            selectedTokenCurrency: R.strings.Please_Select,
            refreshing: false,
            isDrawerOpen: false,
        }

        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //add current route to backpress
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // get SiteToken Responce
        let requestReportdata = {
            UserID: "",
            SourceCurrency: "",
            FromDate: this.state.FromDate,
            ToDate: this.state.ToDate,
            TargetCurrency: ""
        }

        //Check NetWork is Available or not
        if (await isInternet()) {
            // to get userlist value 
            this.props.getUserDataList();
            // to get WlletCurrency
            this.props.getCurrencyList();
            // to get Token Currency
            this.props.getTokenCurrencyData();
            // to get getSiteTokenReportData
            this.props.getSiteTokenReportData(requestReportdata);
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (await isInternet()) {
            // for get selected user id from the value 
            let requestReportdata = {
                UserID: this.state.selectedUserId,
                SourceCurrency: this.state.selectedWalletCurrency != R.strings.Please_Select ? this.state.selectedWalletCurrency : "",
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                TargetCurrency: this.state.selectedTokenCurrency != R.strings.Please_Select ? this.state.selectedTokenCurrency : ""
            }

            //call getSiteTokenReportData api
            this.props.getSiteTokenReportData(requestReportdata)
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

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
        if (SiteTokenConversionReport.oldProps !== props) {
            SiteTokenConversionReport.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { pairCurrencyList, TokenCurrencyData, userData, SiteTokenReportData, } = props;

            //To Check Currency List Fetch or Not
            if (pairCurrencyList) {
                try {
                    if (state.pairCurrencyList == null || (state.pairCurrencyList != null && pairCurrencyList !== state.pairCurrencyList)) {
                        if (validateResponseNew({ response: pairCurrencyList, isList: true })) {
                            let res = parseArray(pairCurrencyList.Response);

                            for (var smsCodeItem in res) {
                                let item = res[smsCodeItem]
                                item.value = item.SMSCode
                            }

                            let currencyItem = [
                                ...state.WalletCurrency,
                                ...res
                            ];
                            return { ...state, WalletCurrency: currencyItem, pairCurrencyList };
                        }
                        else {
                            return { ...state, WalletCurrency: [{ value: R.strings.Please_Select }], selectedWalletCurrency: R.strings.Please_Select, pairCurrencyList };
                        }
                    }
                } catch (e) {
                    return { ...state, WalletCurrency: [{ value: R.strings.Please_Select }], selectedWalletCurrency: R.strings.Please_Select, };
                }
            }

            if (TokenCurrencyData) {
                try {
                    if (state.TokenCurrencyData == null || (state.TokenCurrencyData != null && TokenCurrencyData !== state.TokenCurrencyData)) {
                        if (validateResponseNew({ response: TokenCurrencyData, isList: true })) {
                            let res = parseArray(TokenCurrencyData.Response);

                            for (var TokenCurrencyDatakey in res) {
                                let item = res[TokenCurrencyDatakey]
                                item.value = item.CurrencyName
                            }

                            let currencyItem = [
                                ...state.TokenCurrency,
                                ...res
                            ];
                            return { ...state, TokenCurrency: currencyItem, TokenCurrencyData };
                        }
                        else {
                            return { ...state, TokenCurrency: [{ value: R.strings.Please_Select }], selectedTokenCurrency: R.strings.Please_Select, TokenCurrencyData };
                        }
                    }
                } catch (e) {
                    return { ...state, TokenCurrency: [{ value: R.strings.Please_Select }], selectedTokenCurrency: R.strings.Please_Select };
                }
            }

            //if userData response is not null then handle resposne
            if (userData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userData == null || (state.userData != null && userData !== state.userData)) {
                        if (validateResponseNew({ response: userData, isList: true })) {
                            let res = parseArray(userData.GetUserData);

                            res.map((item, index) => {
                                res[index].value = item.UserName;
                                res[index].Id = item.Id;
                            })
                            let users = [
                                ...state.users,
                                ...res
                            ];
                            return { ...state, users: users, userData };
                        } else {
                            return { ...state, users: [{ value: R.strings.Please_Select }], selectedUser: R.strings.Please_Select, userData };
                        }
                    }
                } catch (e) {
                    return { ...state, users: [{ value: R.strings.Please_Select }], selectedUser: R.strings.Please_Select };
                }
            }
            //To Check Currency List Fetch or Not
            if (SiteTokenReportData) {
                try {
                    if (state.SiteTokenReportData == null || (state.SiteTokenReportData != null && SiteTokenReportData !== state.SiteTokenReportData)) {
                        if (validateResponseNew({ response: SiteTokenReportData, isList: true })) {
                            let res = parseArray(SiteTokenReportData.Response);
                            return { ...state, data: res, SiteTokenReportData, refreshing: false };
                        }
                        else {
                            return { ...state, data: [], SiteTokenReportData, refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, data: [], refreshing: false };
                }
            }

        }
        return null;
    }

    /* When user press on reset button then all values are reset */
    /* Set state to original value */
    onResetPress = async () => {
        this.drawer.closeDrawer();

        this.setState({
            selectedUser: R.strings.Please_Select,
            selectedUserId: '',
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            selectedWalletCurrency: R.strings.Please_Select,
            selectedTokenCurrency: R.strings.Please_Select,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {
            let requestReportdata = {
                UserID: '',
                SourceCurrency: '',
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                TargetCurrency: ''
            }

            //call getSiteTokenReportData api
            this.props.getSiteTokenReportData(requestReportdata);
        }
    }

    /* if press on complete button then check validation and api calling */
    onCompletePress = async () => {
        // Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        }
        // for check, if user select both currency same than display message for not select same currency
        if ((this.state.selectedWalletCurrency != R.strings.Please_Select && this.state.selectedTokenCurrency != R.strings.Please_Select) && (this.state.selectedWalletCurrency === this.state.selectedTokenCurrency)) {
            this.toast.Show(R.strings.youcannotSelectSameCurrency);
            return;
        }
        else {
            this.drawer.closeDrawer();
            let requestReportdata = {
                UserID: this.state.selectedUserId,
                SourceCurrency: this.state.selectedWalletCurrency != R.strings.Please_Select ? this.state.selectedWalletCurrency : "",
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                TargetCurrency: this.state.selectedTokenCurrency != R.strings.Please_Select ? this.state.selectedTokenCurrency : ""
            }

            //Check NetWork is Available or not
            if (await isInternet()) {

                //call getSiteTokenReportData api
                this.props.getSiteTokenReportData(requestReportdata)
            }
        }
    }

    /* Drawer Navigation */
    navigationDrawer() {

        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                FromDate={this.state.FromDate}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                ToDate={this.state.ToDate}
                toastRef={component => this.toast = component}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.userId,
                        array: this.state.users,
                        selectedValue: this.state.selectedUser,
                        onPickerSelect: (index, object) => { this.setState({ selectedUser: index, selectedUserId: object.Id }) }
                    },
                    {
                        title: R.strings.walletCurrency,
                        array: this.state.WalletCurrency,
                        selectedValue: this.state.selectedWalletCurrency,
                        onPickerSelect: (index) => { this.setState({ selectedWalletCurrency: index }) }
                    },
                    {
                        title: R.strings.tokenCurrency,
                        array: this.state.TokenCurrency,
                        selectedValue: this.state.selectedTokenCurrency,
                        onPickerSelect: (index) => { this.setState({ selectedTokenCurrency: index }) }
                    },
                ]}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
            />
        )
    }


    render() {
        const { isSiteTokenReportfetch } = this.props;

        //for search
        let finalItems = this.state.data.filter(item => (item.TargerCurrency.toLowerCase().includes(this.state.search.toLowerCase())));

        return (
            <Drawer
                drawerContent={this.navigationDrawer()} onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay} drawerPosition={Drawer.positions.Right}
                ref={cmp => this.drawer = cmp} drawerWidth={R.dimens.FilterDrawarWidth}
                easingFunc={Easing.ease}>

                <SafeView
                    style={{
                        flex: 1,
                        backgroundColor: R.colors.background
                    }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.siteTokenConversionReport}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => { this.drawer.openDrawer(); }}
                        onBackPress={this.onBackPress}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            isSiteTokenReportfetch && !this.state.refreshing ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {finalItems.length > 0 ?
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item, index }) =>
                                                <SiteTokenConversionReportItem
                                                    item={item}
                                                    index={index}
                                                    size={this.state.data.length}
                                                />
                                            }
                                            keyExtractor={(item, index) => index.toString()}
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />}
                                        />
                                        :
                                        <ListEmptyComponent />}
                                </View>
                        }
                    </View>
                </SafeView>
            </Drawer>
        )
    }

    styles = () => {
        return {
            headerContainer: {
                flexDirection: "row",
                backgroundColor: R.colors.background,
                paddingTop: R.dimens.widgetMargin,
                paddingLeft: R.dimens.WidgetPadding,
                paddingRight: R.dimens.WidgetPadding,
                paddingBottom: R.dimens.widgetMargin
            },
            contentItem: {
                flex: 1,
                fontSize: R.dimens.smallestText,
                color: R.colors.textPrimary
            }
        }
    }
}

// This Class is used for display record in list
class SiteTokenConversionReportItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) 
        {
            return false
        }
        return true
    }

    render() {
        let item = this.props.item;  let { index, size } = this.props;
        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        borderRadius: 0,  borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1,
                    }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            <View style={{ flex: 1, flexDirection: 'column' }}>

                                {/* Source Currecny and Token Price */}
                                <View style={{ flexDirection: 'row' }}>
                                    <ImageViewWidget url={item.SourceCurrency ? item.SourceCurrency : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />
                                    <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                        <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.SourceCurrency ? item.SourceCurrency : '-'}</Text>
                                        {/* seprator */}
                                        <Separator style={{ width: '30%', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: 0, marginRight: 0 }} />
                                    </View>
                                </View>

                                {/* Source Qty and Price */}
                                <View style={{ flex: 1, }}>
                                    <View style={{ marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{R.strings.Qty} : </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{validateValue(parseFloatVal(item.SourceCurrencyQty).toFixed(8))}</TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{R.strings.Price} : </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{validateValue(parseFloatVal(item.SourceToBasePrice).toFixed(8))}</TextViewHML>
                                    </View>
                                </View>

                            </View>

                            <Image style={{ marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, tintColor: R.colors.textPrimary, width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight }} source={R.images.IC_TRANSFER} />

                            <View style={{ flex: 1, flexDirection: 'column', }}>
                                {/* Target Currency*/}
                                <View style={{ flexDirection: 'row' }}>
                                    <ImageViewWidget url={item.TargerCurrency ? item.TargerCurrency : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />
                                    <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                        <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.TargerCurrency ? item.TargerCurrency : '-'}</Text>
                                        {/* seprator */}
                                        <Separator style={{ width: '30%', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: 0, marginRight: 0 }} />
                                    </View>
                                </View>

                                {/* Source Qty and Price */}
                                <View style={{ flex: 1, }}>
                                    <View style={{ marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{R.strings.Qty} : </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{validateValue(parseFloatVal(item.TargetCurrencyQty).toFixed(8))}</TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{R.strings.Price} : </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{validateValue(parseFloatVal(item.SourceToBaseQty).toFixed(8))}</TextViewHML>
                                    </View>
                                </View>

                            </View>
                        </View>

                        {/* Date and Time */}
                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between', }}>
                            <TextViewHML style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, }}>{validateValue(parseFloatVal(item.TokenPrice).toFixed(8))}</TextViewHML>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image style={{ tintColor: R.colors.textSecondary, width: R.dimens.etHeaderImageHeightWidth, height: R.dimens.etHeaderImageHeightWidth }} source={R.images.IC_TIMER} />
                                <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss A', false)}</TextViewHML>
                            </View>
                        </View>

                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    //Updated SiteTokenConversionReportReducer Data 
    return {
        isTokenCurrencyfetch: state.SiteTokenConversionReportReducer.isTokenCurrencyfetch,
        TokenCurrencyData: state.SiteTokenConversionReportReducer.TokenCurrencyData,
        TokenCurrencyDataFetch: state.SiteTokenConversionReportReducer.TokenCurrencyDataFetch,

        isSiteTokenReportfetch: state.SiteTokenConversionReportReducer.isSiteTokenReportfetch,
        SiteTokenReportData: state.SiteTokenConversionReportReducer.SiteTokenReportData,
        SiteTokenReportDataFetch: state.SiteTokenConversionReportReducer.SiteTokenReportDataFetch,

        userData: state.pairListReducer.userData,
        isLoadingUserData: state.pairListReducer.isLoadingUserData,

        pairCurrencyList: state.pairListReducer.pairCurrencyList,
        isLoadingPairCurrency: state.pairListReducer.isLoadingPairCurrency,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //Perform getUserDataList Action 
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform getCurrencyList Action 
        getCurrencyList: () => dispatch(getCurrencyList()),
        //Perform getTokenCurrencyData Action 
        getTokenCurrencyData: () => dispatch(getTokenCurrencyData()),
        //Perform clear data Action 
        getSiteTokenReportData: (requestReportdata) => dispatch(getSiteTokenReportData(requestReportdata)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteTokenConversionReport) 