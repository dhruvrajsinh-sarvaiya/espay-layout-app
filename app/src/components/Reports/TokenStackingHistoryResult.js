import React, { Component } from 'react';
import { View, FlatList, Image, RefreshControl, Easing, Text } from 'react-native';
import { changeTheme, parseArray, addPages, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { DateValidation } from '../../validations/DateValidation';
import FilterWidget from '../Widget/FilterWidget';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import Separator from '../../native_theme/components/Separator';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import CommonToast from '../../native_theme/components/CommonToast';
import Drawer from 'react-native-drawer-menu';
import { onTokenStackingHistory } from '../../actions/Wallet/TockenStackingAction'
import PaginationWidget from '../Widget/PaginationWidget';
import R from '../../native_theme/R';
import ImageViewWidget from '../Widget/ImageViewWidget';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class TokenStackingHistoryResult extends Component {

    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            FromDate: '',
            ToDate: '',
            Page: 0,
            PageSize: 10,
            stackingType: [{ value: R.strings.Please_Select }, { value: R.strings.Fixed_Deposit }, { value: R.strings.Charge }],
            SelectedStackingType: R.strings.Please_Select,

            slabType: [{ value: R.strings.Please_Select }, { value: R.strings.Fixed }, { value: R.strings.Range }],
            SelectedSlabType: R.strings.Please_Select,

            SelectedType: R.strings.Please_Select,
            Type: [{ value: R.strings.Please_Select }, { value: R.strings.Staking }, { value: R.strings.UnStaking }],

            row: [],
            totalCount: 0,
            isFirstTime: true,
        };

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //To Bind All Method
        this.onBackPress = this.onBackPress.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onResetPress = this.onResetPress.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onViewPress = this.onViewPress.bind(this);

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

    onViewPress = (item) => {
        this.props.navigation.navigate('TokenStackingHistoryDetail', { item, onRefresh: this.onRefresh })
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        //if user selecte other page number then and only then API Call elase no need to call API
        this.setState({ Page: (pageNo - 1), });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Token History
            let stakingHistoryRequest = {
                PageSize: this.state.PageSize,
                Page: this.state.Page,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Type: this.state.SelectedType === R.strings.Please_Select ? '' : (this.state.SelectedType === R.strings.Staking ? 1 : 2),
                Slab: this.state.SelectedSlabType === R.strings.Please_Select ? '' : (this.state.SelectedSlabType === R.strings.Fixed ? 1 : 2),
                StakingType: this.state.SelectedStackingType === R.strings.Please_Select ? '' : (this.state.SelectedStackingType === R.strings.Fixed_Deposit ? 1 : 2),
            }
            //Call Get Token staking History API
            this.props.onTokenStackingHistory(stakingHistoryRequest);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Token History
            let stakingHistoryRequest = {
                PageSize: this.state.PageSize,
                Page: this.state.Page,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Type: this.state.SelectedType === R.strings.Please_Select ? '' : (this.state.SelectedType === R.strings.Staking ? 1 : 2),
                Slab: this.state.SelectedSlabType === R.strings.Please_Select ? '' : (this.state.SelectedSlabType === R.strings.Fixed ? 1 : 2),
                StakingType: this.state.SelectedStackingType === R.strings.Please_Select ? '' : (this.state.SelectedStackingType === R.strings.Fixed_Deposit ? 1 : 2),
            }
            //Call Get Token staking History API
            this.props.onTokenStackingHistory(stakingHistoryRequest);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async (fromSelf = true) => {

        if (fromSelf) {
            this.setState({ refreshing: true });
        } else {
            this.setState({ Page: 0 });
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Token History
            let stakingHistoryRequest = {
                PageSize: this.state.PageSize,
                Page: fromSelf ? this.state.Page : 0,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Type: this.state.SelectedType === R.strings.Please_Select ? '' : (this.state.SelectedType === R.strings.Staking ? 1 : 2),
                Slab: this.state.SelectedSlabType === R.strings.Please_Select ? '' : (this.state.SelectedSlabType === R.strings.Fixed ? 1 : 2),
                StakingType: this.state.SelectedStackingType === R.strings.Please_Select ? '' : (this.state.SelectedStackingType === R.strings.Fixed_Deposit ? 1 : 2),
            }
            //Call Get Token staking History API
            this.props.onTokenStackingHistory(stakingHistoryRequest);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
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
        if (TokenStackingHistoryResult.oldProps !== props) {
            TokenStackingHistoryResult.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { TokenStackingHistorydata, TokenStackingHistoryFetchData } = props;

            //To Check Token History Data Fetch or Not
            if (!TokenStackingHistoryFetchData) {

                try {
                    if (validateResponseNew({ response: TokenStackingHistorydata, isList: true })) {
                        //check Token History Response is an Array Or not
                        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                        var res = TokenStackingHistorydata.Stakings;
                        var resArr = parseArray(res);

                        //Set State For Api response , Selected Item and Refershing Bit
                        return {
                            ...state,
                            response: resArr,
                            refreshing: false,
                            row: addPages(TokenStackingHistorydata.TotalCount)
                        }
                    } else {
                        return {
                            ...state,
                            response: [],
                            refreshing: false,
                            row: [],
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false,
                        row: [],
                    }
                }
            }
        }
        return null;
    }

    // Reset FromDate and ToDate
    onResetPress = async () => {

        this.drawer.closeDrawer();

        // set initial state
        this.setState({
            FromDate: '',
            ToDate: '',
            Page: 0,
            searchInput: '',
            SelectedSlabType: R.strings.Please_Select,
            SelectedStackingType: R.strings.Please_Select,
            SelectedType: R.strings.Please_Select
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Token History
            let stakingHistoryRequest = {
                PageSize: this.state.PageSize,
                Page: this.state.Page,
                FromDate: '',
                ToDate: '',
                Type: '',
                Slab: '',
                StakingType: '',
            }
            //Call Get Token staking History API
            this.props.onTokenStackingHistory(stakingHistoryRequest);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Api Call when press on complete button
    onCompletePress = async () => {

        // check fromdate and todate both are selected or not
        if (this.state.FromDate == "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate == "") {
            this.toast.Show(R.strings.bothDateRequired);
            return
        }

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        }
        else {
            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();

            this.setState({ Page: 0 })

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For Token History
                let stakingHistoryRequest = {
                    PageSize: this.state.PageSize,
                    Page: this.state.Page,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    Type: this.state.SelectedType === R.strings.Please_Select ? '' : (this.state.SelectedType === R.strings.Staking ? 1 : 2),
                    Slab: this.state.SelectedSlabType === R.strings.Please_Select ? '' : (this.state.SelectedSlabType === R.strings.Fixed ? 1 : 2),
                    StakingType: this.state.SelectedStackingType === R.strings.Please_Select ? '' : (this.state.SelectedStackingType === R.strings.Fixed_Deposit ? 1 : 2),
                }
                //Call Get Token staking History API
                this.props.onTokenStackingHistory(stakingHistoryRequest);
                //----------
            } else {
                this.setState({ refreshing: false });
            }

            //If Filter from Complete Button Click then empty searchInput
            this.setState({ searchInput: '' })
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* for display Toast */}
                <CommonToast ref={cmp => this.toast = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* filterwidget for display fromdate, todate,type, stacing type and slab type data */}
                <FilterWidget
                    isCancellable
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    FromDate={this.state.FromDate}
                    ToDate={this.state.ToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                    comboPickerStyle={{ marginTop: 0 }}
                    pickers={[
                        {
                            title: R.strings.Stacking_Type,
                            array: this.state.stackingType,
                            selectedValue: this.state.SelectedStackingType,
                            onPickerSelect: (index) => this.setState({ SelectedStackingType: index })
                        },
                        {
                            title: R.strings.Slab_Type,
                            array: this.state.slabType,
                            selectedValue: this.state.SelectedSlabType,
                            onPickerSelect: (index) => this.setState({ SelectedSlabType: index })
                        },
                        {
                            title: R.strings.Type,
                            array: this.state.Type,
                            selectedValue: this.state.SelectedType,
                            onPickerSelect: (index) => this.setState({ SelectedType: index })
                        },
                    ]}
                ></FilterWidget>
            </SafeView>
        )
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { TokenStackingIsFetching } = this.props;
        //----------

        //Filter Functionality on Stacking Currency
        let finalItems = this.state.response.filter(item => ((item.StakingCurrency).toLowerCase().includes(this.state.searchInput.toLowerCase())));

        return (

            //DrawerLayout for Token History Filteration
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        title={R.strings.TokenStacking_History}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if TokenStackingIsFetching = true then display progress bar else display List*/}
                        {(TokenStackingIsFetching && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            /* render all item in list */
                                            renderItem={({ item, index }) => <FlatListItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                onPress={() => this.onViewPress(item)}>
                                            </FlatListItem>}
                                            /* assign index as key valye to Token History list item */
                                            keyExtractor={(item, index) => index.toString()}
                                            /* For Refresh Functionality In Token History FlatList Item */
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />
                                            } />
                                    </View>
                                    : !TokenStackingIsFetching && <ListEmptyComponent module={R.strings.Token_Stack} onPress={() => this.props.navigation.navigate('TokenStackingScreen')} />
                                }
                            </View>
                        }

                        {/* to Show Pagination */}
                        <View>
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.Page + 1} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer >
        );
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {

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
        let item = this.props.item;
        let { index, size, } = this.props;

        let color = R.colors.accent;
        
        //To Display various Status Color in ListView
        if (item.Status === 0) {
            color = R.colors.failRed;
        }
        if (item.Status === 1) {
            color = R.colors.successGreen;
        }
        if (item.Status === 4) {
            color = R.colors.yellow;
        }
        if (item.Status === 5) {
            color = R.colors.accent;
        }
        if (item.Status === 9) {
            color = R.colors.failRed;
        }

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }
                }>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}
                        onPress={this.props.onPress}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {/* StakingCurrency Image */}
                            <ImageViewWidget url={item.StakingCurrency ? item.StakingCurrency : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                {/* StakingAmount , StakingCurrency , StakingTypeName ,SlabTypeName */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold, }}>{(parseFloatVal(item.StakingAmount).toFixed(8).toString()) !== 'NaN' ? parseFloatVal(item.StakingAmount).toFixed(8).toString() : '-'} {item.StakingCurrency ? item.StakingCurrency : '-'}</Text>
                                    <Image
                                        source={R.images.RIGHT_ARROW_DOUBLE}
                                        style={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                    />
                                </View>

                                {/* Stacked Details */}
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.Stacked}</Text>
                                    <TextViewMR style={{ marginLeft: R.dimens.widgetMargin, alignSelf: 'center', color: R.colors.successGreen, fontSize: R.dimens.smallestText, }}>{item.StakingTypeName ? item.StakingTypeName : '-'}-{item.SlabTypeName ? item.SlabTypeName : '-'}</TextViewMR>
                                </View>

                                {/* Avalibale Amount */}
                                <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.AvailAmt} : </TextViewHML>
                                    {item.SlabType == 1 ?
                                        <TextViewHML style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{(parseFloatVal(item.AvailableAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(item.AvailableAmount).toFixed(8) : '-'}</TextViewHML>
                                        :
                                        <TextViewHML style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{(parseFloatVal((item.AvailableAmount).split('-')[0]).toFixed(8)) !== 'NaN' ? parseFloatVal((item.AvailableAmount).split('-')[0]).toFixed(8) : '-'}-{(parseFloatVal((item.AvailableAmount).split('-')[1]).toFixed(8)) !== 'NaN' ? parseFloatVal((item.AvailableAmount).split('-')[1]).toFixed(8) : '-'}</TextViewHML>
                                    }
                                </View>

                                {/* Wallet */}
                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.wallet} : </TextViewHML>
                                    <TextViewHML style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{item.WalletName ? item.WalletName : '-'}</TextViewHML>
                                </View>

                                {/* InterestValue and InterestTypeName */}
                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Interest} : </TextViewHML>
                                    <TextViewHML style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{item.InterestValue ? item.InterestValue : '-'}{item.InterestTypeName === 'Percentage' ? ' %' : ''}</TextViewHML>
                                </View>
                            </View>
                        </View >

                        {/* Maturity Information */}
                        <View style={{ flex: 1, marginTop: R.dimens.widgetMargin, }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.Maturity.toUpperCase()}</Text>
                                <Separator style={{ flex: 1, justifyContent: 'center', }} />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: R.dimens.widget_left_right_margin }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Received} : </TextViewHML>
                                    <TextViewHML style={{ alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{validateValue(item.AmountCredited)} / {item.MaturityAmount ? item.MaturityAmount : '-'} {item.MaturityCurrency ? item.MaturityCurrency : '-'}</TextViewHML>
                                </View>
                                <TextViewHML style={{ alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.MaturityDate)}</TextViewHML>
                            </View>
                        </View>

                        {/* Status */}
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.widget_left_right_margin }}>
                            <StatusChip
                                color={color}
                                value={item.StrStatus ? item.StrStatus : '-'}></StatusChip>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //Updated Data For Token Stacking History Action
        TokenStackingHistorydata: state.TokenStackingReducer.TokenStackingHistorydata,
        TokenStackingHistoryFetchData: state.TokenStackingReducer.TokenStackingHistoryFetchData,
        TokenStackingIsFetching: state.TokenStackingReducer.TokenStackingIsFetching
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Token Stacking History Action
        onTokenStackingHistory: (stakingHistoryRequest) => dispatch(onTokenStackingHistory(stakingHistoryRequest)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenStackingHistoryResult)