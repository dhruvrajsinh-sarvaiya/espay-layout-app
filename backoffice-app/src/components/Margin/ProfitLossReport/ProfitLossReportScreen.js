import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Text, Image } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget'
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import { getUserDataList, getWalletType, getPairList } from '../../../actions/PairListAction';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { clearProfitLossData, getProfitLossList } from '../../../actions/Margin/ProfitLossReportAction';

class ProfitLossReportScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],
            isFirstTime: true,

            userNames: [{ value: R.strings.Please_Select }],
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',

            currencyPairs: [{ value: R.strings.all }],
            selectedCurrencyPair: R.strings.all,
            selectedCurrencyPairCode: '',

            currency: [{ value: R.strings.selectCurrency }],
            selectedCurrency: R.strings.selectCurrency,

            //For pagination
            row: [],
            selectedPage: 1,

            //For Drawer First Time Close
            isDrawerOpen: false,
            ProfitLossReport: null,
            walletData: null,
            userData: null,
            pairList: null,
        };

        //Bind all methods
        this.onComplete = this.onComplete.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onPageChange = this.onPageChange.bind(this);

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({
            onBackPress: this.onBackPress
        });
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //to get pair list
            this.props.getCurrencyPairs({ IsMargin: 1 });

            //to getUserDataList list
            this.props.getUserDataList();

            //get walletlist
            this.props.getWalletType();

            let request = {
                PageNo: 0,
                PageSize: AppConfig.pageSize,
                PairId: this.state.selectedCurrencyPair === R.strings.all ? '' : this.state.selectedCurrencyPairCode,
                WalletType: this.state.selectedCurrency === R.strings.selectCurrency ? '' : this.state.selectedCurrency,
                UserID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
            }

            //To get getProfitLossList list
            this.props.getProfitLossList(request);
        }
    };

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

    shouldComponentUpdate = (nextProps, nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearProfitLossData();
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
        if (ProfitLossReportScreen.oldProps !== props) {
            ProfitLossReportScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { ProfitLossReport, userData, walletData, pairList } = props.data;

            if (ProfitLossReport) {
                try {
                    //if local ProfitLossReport state is null or its not null and also different then new response then and only then validate response.
                    if (state.ProfitLossReport == null || (state.ProfitLossReport != null && ProfitLossReport !== state.ProfitLossReport)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ProfitLossReport, isList: true })) {

                            let res = parseArray(ProfitLossReport.Data);

                            return { ...state, ProfitLossReport, response: res, refreshing: false, row: addPages(ProfitLossReport.TotalCount) };
                        } else {
                            return { ...state, ProfitLossReport, response: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, row: [] };
                }
            }

            if (userData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userData == null || (state.userData != null && userData !== state.userData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: userData, isList: true })) {
                            let res = parseArray(userData.GetUserData);

                            for (var itemUsers in res) {
                                let item = res[itemUsers]

                                item.value = item.UserName
                            }

                            let userNames = [
                                {
                                    value: R.strings.Please_Select
                                },
                                ...res
                            ];

                            return {
                                ...state,
                                userData, userNames
                            };
                        }
                        else {
                            return {
                                ...state, userData,
                                userNames: [{ value: R.strings.Please_Select }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        userNames: [{ value: R.strings.Please_Select }]
                    };
                }
            }

            if (walletData) {
                try {
                    //if local walletData state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletData == null || (state.walletData != null && walletData !== state.walletData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: walletData, isList: true })) {
                            let res = parseArray(walletData.Types);

                            for (var walletDataKey in res) {
                                let item = res[walletDataKey]
                                item.value = item.TypeName
                            }

                            let currency = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, walletData, currency };
                        } else {
                            return { ...state, walletData, currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, currency: [{ value: R.strings.selectCurrency }] };
                }
            }

            if (pairList) {
                try {
                    //if local pairList state is null or its not null and also different then new response then and only then validate response.
                    if (state.pairList == null || (state.pairList != null && pairList !== state.pairList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: pairList, isList: true })) {
                            let res = parseArray(pairList.Response);

                            for (var pairKey in res) {
                                let item = res[pairKey]
                                item.value = item.PairName

                            }

                            let currencyPairs = [
                                {
                                    value: R.strings.all
                                },
                                ...res
                            ];

                            return {
                                ...state,
                                pairList, currencyPairs
                            };
                        } else {
                            return {
                                ...state, pairList, currencyPairs: [{
                                    value: R.strings.all
                                }]
                            };
                        }
                    }
                }
                catch (e) {
                    return { ...state, currencyPairs: [{ value: R.strings.all }] };
                }
            }
        }
        return null;
    }

    // if press on complete button then check validation and api calling
    onComplete = async () => {

        let request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            PairId: this.state.selectedCurrencyPair === R.strings.all ? '' : this.state.selectedCurrencyPairCode,
            WalletType: this.state.selectedCurrency === R.strings.selectCurrency ? '' : this.state.selectedCurrency,
            UserID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getProfitLossList list
            this.props.getProfitLossList(request);
        } else {
            this.setState({ refreshing: false });
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();
        this.setState({ selectedPage: 1, })
    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        // Set state to original value
        this.setState({
            selectedPage: 1,
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',
            selectedCurrencyPair: R.strings.all,
            selectedCurrencyPairCode: '',
            selectedCurrency: R.strings.selectCurrency,
        })

        let request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            PairId: '',
            WalletType: '',
            UserID: '',
        };

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getProfitLossList list
            this.props.getProfitLossList(request);
        } else {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                PageNo: this.state.selectedPage - 1,
                PageSize: AppConfig.pageSize,
                PairId: this.state.selectedCurrencyPair === R.strings.all ? '' : this.state.selectedCurrencyPairCode,
                WalletType: this.state.selectedCurrency === R.strings.selectCurrency ? '' : this.state.selectedCurrency,
                UserID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
            }

            //To get getProfitLossList list
            this.props.getProfitLossList(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // this method is called when page change and also api call
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                let request = {
                    PageNo: pageNo - 1,
                    PageSize: AppConfig.pageSize,
                    PairId: this.state.selectedCurrencyPair === R.strings.all ? '' : this.state.selectedCurrencyPairCode,
                    WalletType: this.state.selectedCurrency === R.strings.selectCurrency ? '' : this.state.selectedCurrency,
                    UserID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                }

                //To get getProfitLossList list
                this.props.getProfitLossList(request);
            } else {
                this.setState({ refreshing: false })
            }
        }
    }

    navigationDrawer() {

        return (
            <FilterWidget
                toastRef={component => this.toast = component}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.User,
                        array: this.state.userNames,
                        selectedValue: this.state.selectedUserName,
                        onPickerSelect: (index, object) => this.setState({ selectedUserName: index, selectedUserNameCode: object.Id })
                    },
                    {
                        title: R.strings.currencyPair,
                        array: this.state.currencyPairs,
                        selectedValue: this.state.selectedCurrencyPair,
                        onPickerSelect: (index, object) => this.setState({ selectedCurrencyPair: index, selectedCurrencyPairCode: object.PairId })
                    },
                    {
                        title: R.strings.Currency,
                        array: this.state.currency,
                        selectedValue: this.state.selectedCurrency,
                        onPickerSelect: (index) => this.setState({ selectedCurrency: index })
                    }
                ]}
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    render() {

        let filteredList = [];
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.ProfitCurrencyName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.ProfitAmount.toFixed(8).toString().toLowerCase().includes(this.state.search) ||
                item.AvgLandingBuy.toFixed(8).toString().toLowerCase().includes(this.state.search) ||
                item.AvgLandingSell.toFixed(8).toString().toLowerCase().includes(this.state.search) ||
                item.SettledQty.toString().toLowerCase().includes(this.state.search) ||
                item.CreatedDate.toLowerCase().includes(this.state.search)
            ));
        }

        return (
            <Drawer
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                ref={component => this.drawer = component}
                easingFunc={Easing.ease}>


                <SafeView
                    style={this.styles().container}>

                    {/* To set status bar as per our theme */}

                    <CommonStatusBar />

                    {/* To set Progress bar as per our theme */}
                    <ProgressDialog ref={component =>
                        this.progressDialog = component} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.profitLossReport}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        onBackPress={this.onBackPress} />

                    <View
                        style={{ flex: 1, justifyContent: 'space-between' }}>

                        {(this.props.data.loading
                            && !this.state.refreshing)
                            ?
                            <ListLoader /> :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) =>
                                        <ProfitLossReportItem
                                            onPress={() => this.props.navigation.navigate('ProfitLossReportDetailScreen', { item })}
                                            index={index}
                                            item={item}
                                            size={this.state.response.length} />
                                    }
                                    // assign index as key value to list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // Refresh functionality in list
                                    refreshControl={<RefreshControl
                                        refreshing={this.state.refreshing}
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        onRefresh={this.onRefresh}
                                    />}
                                />
                                :
                                // Displayed empty component when no record found 
                                <ListEmptyComponent />
                        }
                        {/*To Set Pagination View  */}
                        <View>
                            {filteredList.length >
                                 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>
                    </View>
                </SafeView>

            </Drawer>
        );
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

// This Class is used for display record in list
class ProfitLossReportItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // Get required fields from props
        let { index, size, item, onPress } = this.props;

        return (
            <AnimatableItem>
                <View style={{
                    marginRight: R.dimens.widget_left_right_margin,
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        flexDirection: 'column',
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                    }} onPress={onPress}>

                        <View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>

                                {/* ProfitCurrency Image */}
                                <ImageViewWidget url={item.ProfitCurrencyName ? item.ProfitCurrencyName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                                <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                    {/* for show username and  ProfitAmount */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.UserName ? item.UserName : ' - '}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
                                                {(parseFloatVal(item.ProfitAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.ProfitAmount).toFixed(8)) : '-') + " " + item.ProfitCurrencyName}
                                            </Text>
                                            <Image
                                                source={R.images.RIGHT_ARROW_DOUBLE}
                                                style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View >

                            {/* for show AvgLandingBuy, AvgLandingSell and SettledQty */}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                                <View style={{ width: '30%', alignItems: 'center', }}>
                                    <TextViewHML ellipsizeMode={'tail'} numberOfLines={1} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.avgLandingBuy}</TextViewHML>
                                    <TextViewHML

                                        style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>
                                        {(parseFloatVal(item.AvgLandingBuy).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.AvgLandingBuy).toFixed(8)) : '-')}
                                    </TextViewHML>
                                </View>

                                <View style={{ width: '40%', alignItems: 'center', }}>
                                    <TextViewHML ellipsizeMode={'tail'} numberOfLines={1} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.avgLandingSell}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                        {(parseFloatVal(item.AvgLandingSell).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.AvgLandingSell).toFixed(8)) : '-')}
                                    </TextViewHML>
                                </View>

                                <View style={{ width: '30%', alignItems: 'center', }}>
                                    <TextViewHML ellipsizeMode={'tail'} numberOfLines={1} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.settledQty}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                        {(parseFloatVal(item.SettledQty) !== 'NaN' ? validateValue(parseFloatVal(item.SettledQty)) : '-')}
                                    </TextViewHML>
                                </View>
                            </View>

                            {/* for show DateTime */}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <ImageTextButton
                                        style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                        icon={R.images.IC_TIMER}
                                        iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    />
                                    <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem >
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For ProfitLossReportReducer Data 
    let data = {
        ...state.ProfitLossReportReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getProfitLossList Action 
        getProfitLossList: (payload) => dispatch(getProfitLossList(payload)),
        //Perform getUserDataList Action 
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform getWalletType Action 
        getWalletType: () => dispatch(getWalletType()),
        //Perform getCurrencyPairs Action 
        getCurrencyPairs: (payload) => dispatch(getPairList(payload)),
        //Perform cleargetProfitLossList Action 
        clearProfitLossData: () => dispatch(clearProfitLossData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ProfitLossReportScreen);