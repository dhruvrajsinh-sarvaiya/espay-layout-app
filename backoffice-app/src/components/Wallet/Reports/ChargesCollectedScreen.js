import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Image } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages, getCurrentDate, convertDateTime, parseFloatVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget'
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import { getWalletType, getWalletTransactionType } from '../../../actions/PairListAction';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { getChargeCollectedReport, clearChargesCollected } from '../../../actions/Wallet/ChargesCollectedAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { DateValidation } from '../../../validations/DateValidation';

class ChargesCollectedScreen extends Component {

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

            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),

            transactionNumber: '',

            transactionTypes: [{ value: R.strings.Please_Select }],
            selectedTransactionType: R.strings.Please_Select,
            selectedTransactionTypeCode: '',

            currency: [{ value: R.strings.Please_Select }],
            selectedCurrency: R.strings.Please_Select,
            selectedCurrencyCode: '',

            slabTypes: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Fixed, code: '1' },
                { value: R.strings.Range, code: '2' },
            ],
            selectedSlabType: R.strings.Please_Select,
            selectedSlabTypeCode: '',

            //For pagination
            row: [],
            selectedPage: 1,

            isFirstTime: true,

            //For Drawer First Time Close
            isDrawerOpen: false,

            statuses: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Initialize, code: '0' },
                { value: R.strings.Success, code: '1' },
                { value: R.strings.Hold, code: '6' },
                { value: R.strings.Refunded, code: '5' },
                { value: R.strings.fail, code: '9' },
            ],
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',

            chargeCollectedData: null,
            walletData: null,
            walletTransactionType: null,

        };
        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //get walletlist 
            this.props.getWalletType();

            //call getWalletTransactionType api
            this.props.getWalletTransactionType();

            let request = {
                PageSize: AppConfig.pageSize,
                SlabType: this.state.selectedSlabType === R.strings.Please_Select ? '' : this.state.selectedSlabTypeCode,
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                TrnNo: this.state.transactionNumber,
                WalleTypeId: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
                PageNo: 0,
                Status: this.state.selectedStatus === R.strings.Please_Select ? '' : this.state.selectedStatusCode,
                TrnTypeID: this.state.selectedTransactionType === R.strings.Please_Select ? '' : this.state.selectedTransactionTypeCode,
            }

            //To get getChargeCollectedReport list
            this.props.getChargeCollectedReport(request);
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };
    // If drawer is open then first, it will close the drawer and after it will return to previous screen
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
    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearChargesCollected();
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
        if (ChargesCollectedScreen.oldProps !== props) {
            ChargesCollectedScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { chargeCollectedData, walletData, walletTransactionType } = props.data;

            if (chargeCollectedData) {
                try {
                    //if local chargeCollectedData state is null or its not null and also different then new response then and only then validate response.
                    if (state.chargeCollectedData == null || (state.chargeCollectedData != null && chargeCollectedData !== state.chargeCollectedData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: chargeCollectedData, isList: true })) {

                            let res = parseArray(chargeCollectedData.Data);

                            return { ...state, chargeCollectedData, response: res, refreshing: false, row: addPages(chargeCollectedData.TotalCount) };
                        } else {
                            return { ...state, chargeCollectedData, response: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, row: [] };
                }
            }

            if (walletData) {
                try {
                    //if local walletData state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletData == null ||
                        (state.walletData != null && walletData !== state.walletData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({
                            response: walletData, isList: true
                        })) {
                            let res = parseArray(walletData.Types);

                            //for add walletData
                            for (var walletDatakey in res) {
                                let item = res[walletDatakey];
                                item.value = item.TypeName;
                            }

                            let currency = [
                                {
                                    value: R.strings.Please_Select
                                },
                                ...res
                            ];

                            return {
                                ...state,
                                walletData, currency
                            };
                        } else {
                            return {
                                ...state,
                                walletData, currency: [{ value: R.strings.Please_Select }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        currency: [{ value: R.strings.Please_Select }]
                    };
                }
            }

            if (walletTransactionType) {
                try {
                    //if local walletTransactionType state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletTransactionType == null || (state.walletTransactionType != null && walletTransactionType !== state.walletTransactionType)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: walletTransactionType, isList: true })) {
                            let res = parseArray(walletTransactionType.Data);

                            //for add walletTransactionType
                            for (var walletTransactionTypeKey in res) {
                                let item = res[walletTransactionTypeKey];
                                item.value = item.TypeName;
                            }

                            let transactionTypes = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, walletTransactionType, transactionTypes };
                        } else {
                            return { ...state, walletTransactionType, transactionTypes: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, transactionTypes: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    // if press on complete button api calling
    onComplete = async () => {

        this.setState({
            selectedPage: 1,
            PageSize: AppConfig.pageSize,
        })

        //Check Validation of FromDate and ToDate
        if (DateValidation(this.state.fromDate, this.state.toDate, true)) {
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate, true));
            return;
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        let request = {
            SlabType: this.state.selectedSlabType === R.strings.Please_Select ? '' : this.state.selectedSlabTypeCode,
            FromDate: this.state.fromDate,
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            TrnNo: this.state.transactionNumber,
            WalleTypeId: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
            Status: this.state.selectedStatus === R.strings.Please_Select ? '' : this.state.selectedStatusCode,
            TrnTypeID: this.state.selectedTransactionType === R.strings.Please_Select ? '' : this.state.selectedTransactionTypeCode,
            ToDate: this.state.toDate,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getChargeCollectedReport list
            this.props.getChargeCollectedReport(request);
        } else {
            this.setState({ refreshing: false });
        }

        this.setState({ selectedPage: 1, })
    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        // Set state to original value
        this.setState({
            selectedPage: 1,
            transactionNumber: '',
            selectedCurrency: R.strings.Please_Select,
            selectedCurrencyCode: '',
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',
            selectedSlabType: R.strings.Please_Select,
            selectedSlabTypeCode: '',
            selectedTransactionType: R.strings.Please_Select,
            selectedTransactionTypeCode: '',
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
        })

        let request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,

        };

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getChargeCollectedReport list
            this.props.getChargeCollectedReport(request);
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
                Status: this.state.selectedStatus === R.strings.Please_Select ? '' : this.state.selectedStatusCode,
                TrnTypeID: this.state.selectedTransactionType === R.strings.Please_Select ? '' : this.state.selectedTransactionTypeCode,
                SlabType: this.state.selectedSlabType === R.strings.Please_Select ? '' : this.state.selectedSlabTypeCode,
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                PageSize: AppConfig.pageSize,
                TrnNo: this.state.transactionNumber,
                WalleTypeId: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
            }

            //To get getChargeCollectedReport list
            this.props.getChargeCollectedReport(request);
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
                    TrnTypeID: this.state.selectedTransactionType === R.strings.Please_Select ? '' : this.state.selectedTransactionTypeCode,
                    ToDate: this.state.toDate,
                    SlabType: this.state.selectedSlabType === R.strings.Please_Select ? '' : this.state.selectedSlabTypeCode,
                    FromDate: this.state.fromDate,
                    PageNo: pageNo - 1,
                    PageSize: AppConfig.pageSize,
                    TrnNo: this.state.transactionNumber,
                    WalleTypeId: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
                    Status: this.state.selectedStatus === R.strings.Please_Select ? '' : this.state.selectedStatusCode,
                }

                //To get getChargeCollectedReport list

                this.props.getChargeCollectedReport(request);
            } else {
                this.setState({
                    refreshing: false
                })
            }
        }
    }

    navigationDrawer() {

        return (
            <FilterWidget
                ToDate={this.state.toDate}
                toastRef={component => this.toast = component}
                comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
                sub_container={{ paddingBottom: 0, }}
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                FromDate={this.state.fromDate}
                pickers={[
                    {
                        title: R.strings.transactionType,
                        array: this.state.transactionTypes,
                        selectedValue: this.state.selectedTransactionType,
                        onPickerSelect: (index, object) => this.setState({ selectedTransactionType: index, selectedTransactionTypeCode: object.TypeId })
                    },
                    {
                        title: R.strings.Currency,
                        array: this.state.currency,
                        selectedValue: this.state.selectedCurrency,
                        onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, selectedCurrencyCode: object.ID })
                    },
                    {
                        title: R.strings.Slab_Type,
                        array: this.state.slabTypes,
                        selectedValue: this.state.selectedSlabType,
                        onPickerSelect: (index, object) => this.setState({ selectedSlabType: index, selectedSlabTypeCode: object.code })
                    },
                    {
                        title: R.strings.Status,
                        array: this.state.statuses,
                        selectedValue: this.state.selectedStatus,
                        onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                    },
                ]}
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={[
                    {
                        header: R.strings.transactionNo,
                        placeholder: R.strings.transactionNo,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "done",
                        onChangeText: (text) => { this.setState({ transactionNumber: text }) },
                        value: this.state.transactionNumber,
                    }
                ]}
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    render() {

        let filteredList = [];

        //for search all fields if response length > 0
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.WalletTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.TrnTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.SlabTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.StrStatus.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.TrnNo.toFixed(8).toString().includes(this.state.search) ||
                item.Amount.toFixed(8).toString().includes(this.state.search) ||
                item.Charge.toFixed(8).toString().includes(this.state.search)
            ));
        }

        return (
            <Drawer
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                ref={component => this.drawer = component}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView
                    style={this.styles().container}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set Progress bar as per our theme */}
                    <ProgressDialog ref={component => this.progressDialog = component} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.chargesCollected}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        onBackPress={this.onBackPress} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {(this.props.data.chargeCollectedLoading && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    renderItem={({ item, index }) =>
                                        <ChargesCollectedItem
                                            index={index}
                                            item={item}
                                            onDetailPress={() => this.props.navigation.navigate('ChargesCollectedDetailScreen', { item })}
                                            size={this.state.response.length} />
                                    }
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(_item, index) => index.toString()}
                                    refreshControl={<RefreshControl
                                        colors={[R.colors.accent]}
                                        onRefresh={this.onRefresh}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                    />}
                                />
                                :
                                <ListEmptyComponent />
                        }
                        {/*To Set Pagination View  */}
                        <View>

                            {filteredList.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>

                    </View>
                </SafeView>
            </Drawer>
        );
    }

    styles = () => {
        return {
            container: {
                backgroundColor: R.colors.background,
                flex: 1,
            },
        }
    }
}

// This Class is used for display record in list
class ChargesCollectedItem extends Component {
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
        let { index, size, item, onDetailPress } = this.props;

        //To Display various Status Color in ListView
        let color = R.colors.accent;
        let statusText = item.StrStatus;

        //initialize 
        if (item.Status === 0) {
            color = R.colors.cardBalanceBlue
        }
        //success 
        else if (item.Status === 1) {
            color = R.colors.successGreen
        }
        //hold 
        else if (item.Status === 6) {
            color = R.colors.cardBalanceBlue
        }
        //refunded 
        else if (item.Status === 5) {
            color = R.colors.cardBalanceBlue
        }
        //fail 
        else if (item.Status === 9) {
            color = R.colors.failRed
        }

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1, borderRadius: 0, borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,

                    }} onPress={onDetailPress}>

                        <View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>

                                {/* WalletType Image */}
                                <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                                <View style={{ flex: 1, }}>

                                    {/* for show WalletType  and  SlabType */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                        <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletTypeName ? item.WalletTypeName : ' - '}</TextViewMR>

                                        <View style={{ flexDirection: 'row', }}>
                                            <TextViewMR style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{!isEmpty(item.SlabTypeName) ? item.SlabTypeName : ' - '}</TextViewMR>
                                            <Image
                                                source={R.images.RIGHT_ARROW_DOUBLE}
                                                style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                            />
                                        </View>
                                    </View>

                                    {/* for show TrnType */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.TrnType + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{!isEmpty(item.TrnTypeName) ? item.TrnTypeName : ' - '}</TextViewHML>
                                    </View>

                                </View>
                            </View >

                            {/* for show TrnNo, Amount and Charge */}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                                <View style={{ flex: 1, alignItems: 'center', }}>
                                    <TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.Trn_No}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>
                                        {validateValue(item.TrnNo)}
                                    </TextViewHML>
                                </View>

                                <View style={{ flex: 1, alignItems: 'center', }}>
                                    <TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Amount}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                        {(parseFloatVal(item.StrAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.StrAmount).toFixed(8)) : '-')}
                                    </TextViewHML>
                                </View>

                                <View style={{ flex: 1, alignItems: 'center', }}>
                                    <TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Charge}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                        {(parseFloatVal(item.Charge).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Charge).toFixed(8)) : '-')}
                                    </TextViewHML>

                                </View>
                            </View>

                            {/* for show status and DateTime */}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <StatusChip
                                    color={color}
                                    value={statusText}></StatusChip>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <ImageTextButton
                                        style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                        icon={R.images.IC_TIMER}
                                        iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    />
                                    <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
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
    //Updated Data For ChargesCollectedReducer Data 
    let data = {
        ...state.ChargesCollectedReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getWalletType Action 
        getWalletType: () => dispatch(getWalletType()),
        //Perform  getWalletTransactionType Api Data 
        getWalletTransactionType: () => dispatch(getWalletTransactionType()),
        //Perform getChargeCollectedReport List Action 
        getChargeCollectedReport: (payload) => dispatch(getChargeCollectedReport(payload)),
        //Perform clearChargesCollected Action 
        clearChargesCollected: () => dispatch(clearChargesCollected())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ChargesCollectedScreen);