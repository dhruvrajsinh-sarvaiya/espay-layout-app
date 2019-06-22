import React, { Component } from 'react';
import { View, Text, FlatList, Easing, RefreshControl } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import Separator from '../../native_theme/components/Separator';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation'
import { connect } from 'react-redux';
import ListLoader from '../../native_theme/components/ListLoader';
import CommonToast from '../../native_theme/components/CommonToast';
import Drawer from 'react-native-drawer-menu';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import FilterWidget from '../Widget/FilterWidget';
import R from '../../native_theme/R';
import { getMarginWalletLedgerData } from '../../actions/Margin/MarginWalletLedgerAction';
import PaginationWidget from '../Widget/PaginationWidget';
import { DateValidation } from '../../validations/DateValidation';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import { AppConfig } from '../../controllers/AppConfig';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class MarginWalletLedgerDetails extends Component {
    constructor(props) {
        super(props);

        // data get from revious screen
        const { params } = this.props.navigation.state;

        //Define All initial State
        this.state = {
            data: params.item != undefined ? params.item : [],
            search: '',
            // filter data 
            wallet: params.wallet != undefined ? params.wallet : [],
            selectedWallet: params.selectedWallet != undefined ? params.selectedWallet : '',
            FromDate: params.FromDate != undefined ? params.FromDate : getCurrentDate(),
            ToDate: params.ToDate != undefined ? params.ToDate : getCurrentDate(),
            PageSize: AppConfig.pageSize,
            selectedPage: 0,
            row: params.allData != undefined ? addPages(params.allData.TotalCount) : [],
            refreshing: false,
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
            WalletId: params.WalletId != undefined ? params.WalletId : '',
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // Bind all methods
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();
    }

    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //going back screen
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind Request for marginWallet Ledger
            let requestLedgerdata = {
                FromDate: this.state.FromDate != '' ? this.state.FromDate : "",
                ToDate: this.state.ToDate != '' ? this.state.ToDate : "",
                WalletId: this.state.WalletId,
                Page: this.state.selectedPage,
                PageSize: this.state.PageSize
            }
            //call api for get MarginWalletledger detail
            this.props.getMarginWalletLedgerData(requestLedgerdata)
        } else {
            this.setState({ refreshing: false });
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
        if (MarginWalletLedgerDetails.oldProps !== props) {
            MarginWalletLedgerDetails.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { marginWalletLedgerData } = props;

            //To Check marginWalletLedger Data Data Fetch or Not
            if (marginWalletLedgerData) {
                try {
                    if (state.marginWalletLedgerData == null || (state.marginWalletLedgerData != null && marginWalletLedgerData !== state.marginWalletLedgerData)) {
                        if (validateResponseNew({ response: marginWalletLedgerData, isList: true })) {
                            let res = parseArray(marginWalletLedgerData.WalletLedgers);
                            return Object.assign({}, state, {
                                data: res,
                                refreshing: false,
                                marginWalletLedgerData,
                                row: addPages(marginWalletLedgerData.TotalCount)
                            })
                        }
                        else {
                            return Object.assign({}, state, {
                                data: [],
                                refreshing: false,
                                marginWalletLedgerData
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        data: [],
                        refreshing: false,
                    })
                }
            }
        }
        return null;
    }

    // When user press on reset button then all values are reset
    onResetPress = async () => {
        this.drawer.closeDrawer();

        // set Intial state value
        this.setState({
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            selectedWallet: this.state.wallet[0].value,
            PageSize: AppConfig.pageSize,
            selectedPage: 0,
            WalletId: this.state.wallet[0].ID
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind Request for marginWallet Ledger
            let requestLedgerdata = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                WalletId: this.state.wallet[0].ID,
                Page: 0,
                PageSize: AppConfig.pageSize
            }
            //call api for get MarginWalletledger detail
            this.props.getMarginWalletLedgerData(requestLedgerdata)
        }
    }

    // if press on complete button then check validation and api calling
    onCompletePress = async () => {

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        }
        // validate selected wallet is empty or not
        if (this.state.selectedWallet === '') {
            this.toast.Show(R.strings.Select_Wallet);
            return;
        }
        else {
            this.drawer.closeDrawer();
            this.setState({ selectedPage: 0 })

            //Check NetWork is Available or not
            if (await isInternet()) {

                // Bind Request for marginWallet Ledger
                let requestLedgerdata = {
                    FromDate: this.state.FromDate != '' ? this.state.FromDate : "",
                    ToDate: this.state.ToDate != '' ? this.state.ToDate : "",
                    WalletId: this.state.WalletId,
                    Page: 0,
                    PageSize: this.state.PageSize
                }
                //call api for get MarginWalletledger detail
                this.props.getMarginWalletLedgerData(requestLedgerdata)
            }
        }
    }

    // this method is called when page change and also api call
    onPageChange = async (pageNo) => {

        if (!(pageNo - 1) == this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo - 1 });

                // Bind Request for marginWallet Ledger
                let requestLedgerdata = {
                    FromDate: this.state.FromDate != '' ? this.state.FromDate : "",
                    ToDate: this.state.ToDate != '' ? this.state.ToDate : "",
                    WalletId: this.state.WalletId,
                    Page: this.state.selectedPage,
                    PageSize: this.state.PageSize
                }
                //call api for get MarginWalletledger detail
                this.props.getMarginWalletLedgerData(requestLedgerdata);
            } else {
                this.setState({ refreshing: false })
            }
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* for display Toast */}
                <CommonToast ref={cmp => this.toast = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* filterwidget for display fromdate, todate,Wallet data */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    FromDate={this.state.FromDate}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    ToDate={this.state.ToDate}
                    comboPickerStyle={{ marginTop: 0 }}
                    pickers={[
                        {
                            title: R.strings.wallet,
                            array: this.state.wallet,
                            selectedValue: this.state.selectedWallet,
                            onPickerSelect: (index, object) => { this.setState({ selectedWallet: index, WalletId: object.ID }) }
                        },
                    ]}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                />
            </SafeView>
        )
    }

    render() {

        //loading bit for handling progress dialog
        const { isLoadingLedgerData } = this.props;

        //for final items from search input (validate on Remarks)
        //default searchInput is empty so it will display all records.
        let list = this.state.data;
        let finalItems = list.filter(item => (item.Remarks.toLowerCase().includes(this.state.search.toLowerCase())));

        return (
            //filter for margin Wallet ledger
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.marginWalletLedger}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => { this.drawer.openDrawer() }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if isLoadingLedgerData = true then display progress bar else display List*/}
                        {
                            isLoadingLedgerData && !this.state.refreshing ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {finalItems.length > 0 ?
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={finalItems}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item, index }) =>
                                                    <FlatlistItem
                                                        item={item}
                                                        index={index}
                                                        size={this.state.data.length}
                                                    />}
                                                keyExtractor={(item, index) => index.toString()}
                                                /* for refreshing data of flatlist */
                                                refreshControl={
                                                    <RefreshControl
                                                        colors={[R.colors.accent]}
                                                        progressBackgroundColor={R.colors.background}
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={this.onRefresh}
                                                    />}
                                            />
                                        </View>
                                        :
                                        <ListEmptyComponent />}
                                </View>
                        }
                    </View>

                    {/*To Set Pagination View  */}
                    <View>
                        {finalItems.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage + 1} onPageChange={(item) => { this.onPageChange(item) }} />}
                    </View>
                </SafeView>
            </Drawer>
        )
    }

}

// This Class is used for display record in list
class FlatlistItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // Get required fields from props
        let { index, size, item } = this.props;

        let crColor = ''
        let drColor = ''

        // Cr amount color
        if (item.CrAmount != 0)
            crColor = R.colors.successGreen
        else
            crColor = R.colors.textSecondary

        // Dr amount color
        if (item.DrAmount != 0)
            drColor = R.colors.failRed
        else
            drColor = R.colors.textSecondary

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View>
                            {/* for show trn id and Amount */}
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>
                                    {R.strings.TrnId + " : " + item.LedgerId}
                                </Text>
                                <TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.yellow, textAlign: 'right' }}>
                                    {parseFloatVal(item.Amount).toFixed(8).toString()}
                                </TextViewMR>
                            </View>

                            {/* for show Remarks */}
                            <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{item.Remarks}</TextViewHML>

                            {/* for show pre and post Balance */}
                            <View style={{ flexDirection: 'row' }}>

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Pre_Bal}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.PreBal.toFixed(8)}</TextViewHML>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Post_Bal}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.PostBal.toFixed(8)}</TextViewHML>
                                </View>
                            </View>

                            {/* for show horizontal line */}
                            <Separator style={{ marginTop: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0 }} />

                            {/* for show CR Amount*/}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', }}>
                                    <StatusChip
                                        color={crColor}
                                        value={R.strings.Cr}></StatusChip>

                                    <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: crColor, fontSize: R.dimens.smallText }}>{parseFloatVal(item.CrAmount).toFixed(8).toString()}</TextViewHML>
                                </View>
                            </View>

                            {/* for show DR Amount and Date*/}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center' }}>
                                <View style={{ width: wp('50%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <StatusChip
                                        color={drColor}
                                        value={R.strings.Dr}></StatusChip>

                                    <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: drColor, fontSize: R.dimens.smallText }}>{parseFloatVal(item.DrAmount).toFixed(8).toString()}</TextViewHML>
                                </View>

                                <View style={{ justifyContent: 'flex-end', width: wp('50%') }}>
                                    <TextViewHML style={{ textAlign: 'right', color: R.colors.textSecondary, fontSize: R.dimens.secondCurrencyText, textAlign: 'right' }}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };

}

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
        // Updated Data for Margin Wallet Ledger
        isLoadingLedgerData: state.MarginWalletLedgerReducer.isLoadingLedgerData,
        marginWalletLedgerData: state.MarginWalletLedgerReducer.marginWalletLedgerData,
        fetchMarginWalletLedgerData: state.MarginWalletLedgerReducer.fetchMarginWalletLedgerData,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //Perform  Margin Wallet Ledger Action
        getMarginWalletLedgerData: (requestLedgerData) => dispatch(getMarginWalletLedgerData(requestLedgerData)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarginWalletLedgerDetails)