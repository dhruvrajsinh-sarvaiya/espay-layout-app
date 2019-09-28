import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Image } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages, convertDateTime, parseFloatVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, isEmpty } from '../../../validations/CommonValidation';
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
import { getUserDataList } from '../../../actions/PairListAction';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { getStakingHistoryList, clearStackingHistoryData } from '../../../actions/Wallet/StackingHistoryAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { DateValidation } from '../../../validations/DateValidation';

class StackingHistoryScreen extends Component {

    constructor(props) {
        super(props);

        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //Create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],

            fromDate: '',
            toDate: '',

            userNames: [{ value: R.strings.Please_Select }],
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',

            slabTypes: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Range, code: '2' },
                { value: R.strings.Fixed, code: '1' },
            ],
            selectedSlabType: R.strings.Please_Select,

            //For pagination
            row: [],
            selectedPage: 1,

            isFirstTime: true,

            //For Drawer First Time Close
            isDrawerOpen: false, selectedSlabTypeCode: '',

            stackingTypes: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Fixed_Deposit, code: '1' },
                { value: R.strings.Charge, code: '2' },
            ],
            selectedStackingType: R.strings.Please_Select,
            selectedStackingTypeCode: '',

            StakingHistoryList: null,
            userData: null,
        };

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }
    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.

        changeTheme();

        //Check NetWork is Available or not

        if (await isInternet()) {

            this.props.getUserDataList();
            //to getUserDataList list

            let request = {
                PageNo: 0,
                PageSize: AppConfig.pageSize,
                Slab: this.state.selectedSlabType === R.strings.Please_Select ? '' : this.state.selectedSlabTypeCode,
                UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                StakingType: this.state.selectedStackingType === R.strings.Please_Select ? '' : this.state.selectedStackingTypeCode,
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
            }

            //To get getStakingHistoryList list
            this.props.getStakingHistoryList(request);
        }
    };

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        } else {
            this.props.navigation.goBack();
            //goging back screen
        }
    }
    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearStackingHistoryData();
    };


    shouldComponentUpdate = (nextProps, nextState) => {
        //For stop twice api call
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
        if (StackingHistoryScreen.oldProps !== props) {
            StackingHistoryScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { StakingHistoryList, userData } = props.data;

            if (StakingHistoryList) {
                try {
                    //if local StakingHistoryList state is null or its not null and also different then new response then and only then validate response.
                    if (state.StakingHistoryList == null || (state.StakingHistoryList != null && StakingHistoryList !== state.StakingHistoryList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: StakingHistoryList, isList: true })) {

                            let res = parseArray(StakingHistoryList.Stakings);

                            //for add userData
                            for (var stackingKey in res) {
                                let item = res[stackingKey];
                                item.stackingTypeText = item.StakingType === 1 ? R.strings.Fixed_Deposit : R.strings.Charge;

                                if (item.Status === 0) {
                                    item.statusText = R.strings.inActive
                                }
                                else if (item.Status === 1) {
                                    item.statusText = R.strings.Active
                                }
                                else if (item.Status === 4) {
                                    item.statusText = R.strings.Pending
                                }
                                else if (item.Status === 5) {
                                    item.statusText = R.strings.unstakeAndRefunded
                                }
                                else if (item.Status === 9) {
                                    item.statusText = R.strings.removed
                                }
                                else {
                                    item.statusText = ''
                                }
                            }

                            return { ...state, StakingHistoryList, response: res, refreshing: false, row: addPages(StakingHistoryList.TotalCount) };
                        } else {
                            return { ...state, StakingHistoryList, response: [], refreshing: false, row: [] };
                        }
                    }
                }
                catch (e) {

                    return { ...state, response: [], refreshing: false, row: [] };
                }
            }

            if (userData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userData == null || (state.userData != null && userData !== state.userData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew(
                            { response: userData, isList: true })) {
                            let res = parseArray(userData.GetUserData);

                            //for add userData
                            for (var userDatakey in res) {
                                let item = res[userDatakey];
                                item.value = item.UserName;
                            }

                            let userNames = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, userData, userNames };
                        }
                        else {
                            return { ...state, userData, userNames: [{ value: R.strings.Please_Select }] };
                        }
                    }
                }
                catch (e) {
                    return { ...state, userNames: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    // if press on complete button api calling
    onComplete = async () => {

        //Check Validation of FromDate and ToDate
        if (DateValidation(this.state.fromDate, this.state.toDate, true)) {
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate, true));
            return;
        }

        let request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            Slab: this.state.selectedSlabType === R.strings.Please_Select ? '' : this.state.selectedSlabTypeCode,
            UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
            StakingType: this.state.selectedStackingType === R.strings.Please_Select ? '' : this.state.selectedStackingTypeCode,
            FromDate: this.state.fromDate,
            ToDate: this.state.toDate,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getStakingHistoryList list
            this.props.getStakingHistoryList(request);
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
            selectedSlabType: R.strings.Please_Select,
            selectedSlabTypeCode: '',
            selectedStackingType: R.strings.Please_Select,
            selectedStackingTypeCode: '',
            fromDate: '',
            toDate: '',
        })

        let request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,
        };

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getStakingHistoryList list
            this.props.getStakingHistoryList(request);
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
                Slab: this.state.selectedSlabType === R.strings.Please_Select ? '' : this.state.selectedSlabTypeCode,
                UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                StakingType: this.state.selectedStackingType === R.strings.Please_Select ? '' : this.state.selectedStackingTypeCode,
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
            }

            //To get getStakingHistoryList list
            this.props.getStakingHistoryList(request);
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
                    Slab: this.state.selectedSlabType === R.strings.Please_Select ? '' : this.state.selectedSlabTypeCode,
                    UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                    StakingType: this.state.selectedStackingType === R.strings.Please_Select ? '' : this.state.selectedStackingTypeCode,
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                }

                //To get getStakingHistoryList list

                this.props.getStakingHistoryList(request);
            }
            else {
                this.setState(
                    { refreshing: false })
            }
        }
    }

    navigationDrawer() {

        return (
            <FilterWidget
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                toastRef={component => this.toast = component}
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
                sub_container={{ paddingBottom: 0, }}
                pickers={[
                    {
                        title: R.strings.User,
                        array: this.state.userNames,
                        selectedValue: this.state.selectedUserName,
                        onPickerSelect: (index, object) => this.setState({ selectedUserName: index, selectedUserNameCode: object.Id })
                    },
                    {
                        title: R.strings.slab,
                        array: this.state.slabTypes,
                        selectedValue: this.state.selectedSlabType,
                        onPickerSelect: (index, object) => this.setState({ selectedSlabType: index, selectedSlabTypeCode: object.code })
                    },
                    {
                        title: R.strings.stackingType,
                        array: this.state.stackingTypes,
                        selectedValue: this.state.selectedStackingType,
                        onPickerSelect: (index, object) => this.setState({ selectedStackingType: index, selectedStackingTypeCode: object.code })
                    },
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
                !isEmpty(item.UserName) && item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.stackingTypeText.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.SlabTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.StakingCurrency.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.MaturityDate.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.statusText.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.StakingAmount.toFixed(8).toString().toLowerCase().includes(this.state.search.toLowerCase())
            ));

        }

        return (
            <Drawer
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}
                drawerPosition={Drawer.positions.Right}
                ref={component => this.drawer = component}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
            >

                <SafeView style={this.styles().container}>

                    {/* To set status bar as per our theme */}

                    <CommonStatusBar />

                    {/* To set Progress bar as per our theme  */}
                    <ProgressDialog
                        ref={component => this.progressDialog = component} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.stackingHistoryReport}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        onBackPress={this.onBackPress} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {(this.props.data.stackingHistoryFetching && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <StackingHistoryItem
                                            item={item}
                                            onDetailPress={() => this.props.navigation.navigate('StackingHistoryDetailScreen', { item })}
                                            index={index}
                                            size={this.state.response.length} />
                                    }
                                    keyExtractor={(_item, index) => index.toString()}

                                    ref0reshControl={<RefreshControl
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        colors={[R.colors.accent]}
                                        onRefresh={this.onRefresh}
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
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
    }
}

// This Class is used for display record in list
class StackingHistoryItem extends Component {
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
        let statusText = ''

        //inActive 
        if (item.Status === 0) {
            color = R.colors.failRed
            statusText = R.strings.inActive
        }
        //Active 
        else if (item.Status === 1) {
            color = R.colors.successGreen
            statusText = R.strings.Active
        }
        //Pending 
        else if (item.Status === 4) {
            color = R.colors.yellow
            statusText = R.strings.Pending
        }
        //unstakeAndRefunded 
        else if (item.Status === 5) {
            color = R.colors.cardBalanceBlue
            statusText = R.strings.unstakeAndRefunded
        }
        //removed 
        else if (item.Status === 9) {
            color = R.colors.failRed
            statusText = R.strings.removed
        }


        return (
            <AnimatableItem>
                <View style={{
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        flexDirection: 'column',
                    }} onPress={onDetailPress}>

                        <View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>

                                {/* WalletType Image */}
                                <ImageViewWidget url={item.StakingCurrency ? item.StakingCurrency : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                                <View style={{ flex: 1, }}>

                                    {/* for show WalletType  and  SlabType */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                        <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.StakingCurrency ? item.StakingCurrency : ' - '}</TextViewMR>

                                        <View style={{ flexDirection: 'row', }}>
                                            <TextViewMR style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.SlabTypeName)}</TextViewMR>
                                            <Image
                                                source={R.images.RIGHT_ARROW_DOUBLE}
                                                style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                            />
                                        </View>
                                    </View>

                                    {/* for show UserName */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.UserName)}</TextViewHML>
                                    </View>

                                    {/* for show StakingTypeName */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.stackingType + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.stackingTypeText)}</TextViewHML>
                                    </View>

                                    {/* for show StakingAmount */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.Amount + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>
                                            {(parseFloatVal(item.StakingAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.StakingAmount).toFixed(8)) : '-')}
                                        </TextViewHML>
                                    </View>

                                </View>
                            </View >

                            {/* for show status and DateTime */}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                                <StatusChip
                                    color={color}
                                    value={statusText}></StatusChip>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <ImageTextButton
                                        style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                        icon={R.images.IC_TIMER}
                                        iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    />
                                    <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.MaturityDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
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
    //Updated Data For StackingHistroyReducer Data 
    let data = {
        ...state.StackingHistroyReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getUserDataList Action 
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform getStakingHistoryList List Action 
        getStakingHistoryList: (payload) => dispatch(getStakingHistoryList(payload)),
        //Perform clearStackingHistoryData Action 
        clearStackingHistoryData: () => dispatch(clearStackingHistoryData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(StackingHistoryScreen);