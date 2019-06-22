import React, { Component } from 'react';
import { View, Easing, FlatList, RefreshControl, Text, } from 'react-native';
import R from '../../native_theme/R';
import CommonToast from '../../native_theme/components/CommonToast';
import FilterWidget from '../Widget/FilterWidget';
import Drawer from 'react-native-drawer-menu';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import ListLoader from '../../native_theme/components/ListLoader';
import { changeTheme, parseArray, addPages, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { DateValidation } from '../../validations/DateValidation';
import { getCommissionReport, getAffiliateUserList, getSchemeMappigIds } from '../../actions/Affiliate/AffiliateAction';
import PaginationWidget from '../Widget/PaginationWidget';
import { AppConfig } from '../../controllers/AppConfig';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import StatusChip from '../Widget/StatusChip';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class CommissionReport extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            row: [],
            response: [],
            searchInput: '',
            refreshing: false,
            commissonListData: null,
            FromDate: '',
            ToDate: '',
            trnRefno: '',
            selectedPage: 1,
            PageSize: AppConfig.pageSize,
            isFirstTime: true,
            userList: [],
            selectedUser: R.strings.Please_Select,
            TrnUserId: 0,
            schemeIds: [],
            selectedSchemeId: R.strings.Please_Select,
            SchemeMappingId: 0,
            SchmeMappingIdsData: null,
            isDrawerOpen: false, // First Time Drawer is Closed
        };

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
        this.onResetPress = this.onResetPress.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
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

    shouldComponentUpdate(nextProps) {
        return isCurrentScreen(nextProps)
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // call api for get AffiliateUserList data 
            this.props.getAffiliateUserList();

            // call api for get SchemeMapingId data 
            this.props.getSchemeMappigIds({
                PageNo: 0,
                PageSize: 100
            });

            //Bind Request For get Commission Report data
            this.request = {
                PageNo: 0,
                PageSize: this.state.PageSize
            }
            //Call Commission Report API
            this.props.getCommissionReport(this.request);
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
        if (CommissionReport.oldProps !== props) {
            CommissionReport.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { commissonListData, affiliateUserDataFetch, affiliateUserData, SchmeMappingIdsData } = props.Listdata;

            //To Check commissonList Data Fetch or Not
            if (commissonListData) {
                try {
                    if (state.commissonListData == null || (state.commissonListData != null && commissonListData !== state.commissonListData)) {
                        if (validateResponseNew({ response: commissonListData, isList: true })) {
                            //Store Api Response Field and display in Screen.
                            return {
                                ...state,
                                commissonListData, response: parseArray(commissonListData.Data),
                                refreshing: false, row: addPages(commissonListData.TotalCount)
                            }
                        } else {
                            return {
                                ...state,
                                commissonListData, refreshing: false, response: [], row: []
                            }
                        }
                    }
                } catch (e) {
                    return { ...state, refreshing: false, response: [], row: [] }
                }
            }

            //To Check affiliateUser Data Fetch or Not
            if (!affiliateUserDataFetch) {
                try {
                    if (validateResponseNew({ response: affiliateUserData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var newRes = parseArray(affiliateUserData.Response);
                        newRes.map((item, index) => {
                            newRes[index].value = newRes[index].UserName
                        })
                        //----
                        let res = [{ value: R.strings.Please_Select, Id: 0 }, ...newRes]
                        return { ...state, userList: res };
                    }
                    else {
                        return { ...state, userList: [], selectedUser: R.strings.Please_Select, TrnUserId: 0 };
                    }
                } catch (e) {
                    return { ...state, userList: [], selectedUser: R.strings.Please_Select, TrnUserId: 0 };
                }
            }

            //To Check SchmeMappingIds Data Fetch or Not
            if (SchmeMappingIdsData) {
                try {
                    if (state.SchmeMappingIdsData == null || (state.SchmeMappingIdsData != null && SchmeMappingIdsData !== state.SchmeMappingIdsData)) {

                        if (validateResponseNew({ response: SchmeMappingIdsData, isList: true })) {
                            //Store Api Response Field and display in Screen.
                            let res = parseArray(SchmeMappingIdsData.AffiliateSchemeTypeMappingList);
                            res.map((item, index) => {
                                res[index].value = item.SchemeName;
                            })
                            let schemeIds = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];
                            return { ...state, schemeIds: schemeIds, SchmeMappingIdsData };
                        }
                        else {
                            return { ...state, schemeIds: [{ value: R.strings.Please_Select }], selectedSchemeId: R.strings.Please_Select, SchemeMappingId: 0 };
                        }
                    }
                } catch (e) {
                    return { ...state, schemeIds: [{ value: R.strings.Please_Select }], selectedSchemeId: R.strings.Please_Select, SchemeMappingId: 0 };
                }
            }
        }
        return null;
    }

    async  onResetPress() {

        // set initial state
        this.setState({
            FromDate: '',
            ToDate: '',
            selectedSchemeId: R.strings.Please_Select,
            SchemeMappingId: 0,
            selectedUser: R.strings.Please_Select,
            TrnUserId: 0,
            trnRefno: '',
            searchInput: '',
            selectedPage: 1,
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Bind Request For get Commission Report data
        this.Request = {
            PageNo: 1,
            PageSize: this.state.PageSize
        }

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Commission Report API
            this.props.getCommissionReport(this.Request);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Api Call when press on complete button
    async onCompletePress() {

        if (this.state.FromDate == "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate == "") {
            this.toast.Show(R.strings.bothDateRequired);
            return
        }

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        }
        else {
            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();

            //Bind Request For get Commission Report data
            this.request = {
                PageNo: 1,
                PageSize: this.state.PageSize
            }
            if (this.state.FromDate !== "" && this.state.ToDate !== "") {
                this.request = {
                    ...this.request,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }
            }
            if (this.state.trnRefno !== '') {
                this.request = {
                    ...this.request,
                    TrnRefNo: this.state.trnRefno,
                }
            }
            if (this.state.selectedSchemeId !== R.strings.Please_Select) {
                this.request = {
                    ...this.request,
                    SchemeMappingId: this.state.SchemeMappingId
                }
            }
            if (this.state.selectedUser !== R.strings.Please_Select) {
                this.request = {
                    ...this.request,
                    TrnUserId: this.state.TrnUserId
                }
            }

            //Check NetWork is Available or not
            if (await isInternet()) {
                //Call Commission Report API
                this.props.getCommissionReport(this.request);
                //----------
            } else {
                this.setState({ refreshing: false });
            }
            //If Filter from Complete Button Click then empty searchInput
            this.setState({ searchInput: '', selectedPage: 1 })
        }
    }

    //For Swipe to referesh Functionality
    async onRefresh() {
        this.setState({ refreshing: true });

        this.request = {
            PageNo: this.state.selectedPage - 1,
            PageSize: this.state.PageSize
        }
        if (this.state.FromDate !== "" && this.state.ToDate !== "") {
            this.request = {
                ...this.request,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
        }
        if (this.state.trnRefno !== '') {
            this.request = {
                ...this.request,
                TrnRefNo: this.state.trnRefno,
            }
        }
        if (this.state.selectedSchemeId !== R.strings.Please_Select) {
            this.request = {
                ...this.request,
                SchemeMappingId: this.state.SchemeMappingId
            }
        }
        if (this.state.selectedUser !== R.strings.Please_Select) {
            this.request = {
                ...this.request,
                TrnUserId: this.state.TrnUserId
            }
        }
        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get Commission Report data
            this.request = {
                ...this.request
            }
            //Call Commission Report API
            this.props.getCommissionReport(this.request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* for display Toast */}
                <CommonToast ref={cmp => this.toast = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* filterwidget for display fromdate, todate, trnrefno ,schememapping ids,userlist data */}
                <FilterWidget
                    isCancellable
                    comboPickerStyle={{ marginTop: 0, }}
                    textInputStyle={{ marginBottom: 0, marginTop: 0 }}
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    FromDate={this.state.FromDate}
                    ToDate={this.state.ToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                    textInputs={[
                        {
                            header: R.strings.trnRefno,
                            placeholder: R.strings.trnRefno,
                            multiline: false,
                            keyboardType: 'default',
                            returnKeyType: "done",
                            onChangeText: (text) => { this.setState({ trnRefno: text }) },
                            value: this.state.trnRefno,
                        },
                    ]}
                    pickers={[
                        {
                            title: R.strings.schemeMapping,
                            array: this.state.schemeIds,
                            selectedValue: this.state.selectedSchemeId,
                            onPickerSelect: (index, object) => {
                                this.setState({ selectedSchemeId: index, SchemeMappingId: object.MappingId })
                            }
                        },
                        {
                            title: R.strings.affliateUser,
                            array: this.state.userList,
                            selectedValue: this.state.selectedUser,
                            onPickerSelect: (index, object) => {
                                this.setState({ selectedUser: index, TrnUserId: object.Id })
                            }
                        },
                    ]}
                />
            </SafeView>
        )
    }

    // Pagination Method Called When User Change Page  
    async onPageChange(pageNo) {

        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pageNo });

            // Create request
            this.request = {}
            if (this.state.FromDate !== "" && this.state.ToDate !== "") {
                this.request = {
                    ...this.request,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }
            }
            if (this.state.selectedSchemeId !== R.strings.Please_Select) {
                this.request = {
                    ...this.request,
                    SchemeMappingId: this.state.SchemeMappingId
                }
            }

            if (this.state.selectedUser !== R.strings.Please_Select) {
                this.request = {
                    ...this.request,
                    TrnUserId: this.state.TrnUserId
                }
            }

            if (this.state.trnRefno !== "") {
                this.request = {
                    ...this.request,
                    TrnRefNo: this.state.trnRefno,
                }
            }

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get Commission Report data
                this.Request = {
                    ...this.request,
                    PageNo: pageNo - 1,
                    PageSize: this.state.PageSize
                }
                //Call Commission Report API
                this.props.getCommissionReport(this.Request)
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    render() {
        const { commissionLoading } = this.props.Listdata;
        let finalItems = this.state.response

        //for final items from search input (validate on StrStatus , AffiliateEmail and Level)
        //default searchInput is empty so it will display all records.
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item =>
                (item.StrStatus.toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
                (item.AffiliateEmail.toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
                (item.Level.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()))
            )
        }

        return (
            //DrawerLayout for CommissionReport
            <Drawer
                ref={cmpDrawer => this.drawer = cmpDrawer}
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
                        title={R.strings.commissionReport}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        rightIcon={R.images.FILTER}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if commissionLoading = true then display progress bar else display List*/}
                        {
                            (commissionLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={finalItems}
                                        renderItem={({ item, index }) =>
                                            <CommissionListItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                onPress={() => this.props.navigation.navigate('CommissionReportDetail', { item })}
                                            />
                                        }
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={contentContainerStyle(finalItems)}
                                        ListEmptyComponent={<ListEmptyComponent />}
                                        /* for refreshing data of flatlist */
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.background}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                            />
                                        }
                                    />
                                </View>
                        }
                        <View>
                            {/* show pagination if response contains more data  */}
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        );
    }
}

// This Class is used for display record in list
class CommissionListItem extends Component {

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
        let item = this.props.item;
        let { index, size, } = this.props;

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin
                    }} onPress={this.props.onPress}>

                        <View>
                            {/* for display email and level and arrow right image */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: R.dimens.widgetMargin, }}>
                                <Text style={{ fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.smallText, color: R.colors.textPrimary, }} >{item.AffiliateEmail ? item.AffiliateEmail : '-'} </Text>
                                <Text style={{ flex: 1, textAlign: 'right', fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.smallText, color: R.colors.textSecondary, }} > {'LV.'} {item.Level ? item.Level : '-'} </Text>
                                <ImageTextButton
                                    icon={R.images.RIGHT_ARROW_DOUBLE}
                                    onPress={this.props.onPress}
                                    style={{ margin: 0 }}
                                    iconStyle={{
                                        width: R.dimens.dashboardMenuIcon,
                                        height: R.dimens.dashboardMenuIcon,
                                        tintColor: R.colors.textPrimary
                                    }} />
                            </View>

                            {/* for display amount commission and transction amount */}
                            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginBottom: R.dimens.widgetMargin }}>
                                <View style={{ width: '34%' }}>
                                    <TextViewHML style={[this.mystyle().headerText]} >{R.strings.Amount} </TextViewHML>
                                    <TextViewHML style={[this.mystyle().valueText]} >  {(parseFloatVal(item.Amount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Amount).toFixed(8)) : '-')} </TextViewHML>
                                </View>
                                <View style={{ width: '33%' }}>
                                    <TextViewHML style={[this.mystyle().headerText]} >{R.strings.commi} </TextViewHML>
                                    <TextViewHML style={[this.mystyle().valueText]} >{(parseFloatVal(item.CommissionPer) !== 'NaN' ? validateValue(parseFloatVal(item.CommissionPer) + '%') : '-')} </TextViewHML>
                                </View>
                                <View style={{ width: '33%' }}>
                                    <TextViewHML style={[this.mystyle().headerText]} >{R.strings.trnAmount} </TextViewHML>
                                    <TextViewHML style={[this.mystyle().valueText]} >{(parseFloatVal(item.TransactionAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.TransactionAmount).toFixed(8)) : '-')} </TextViewHML>
                                </View>
                            </View>

                            {/* for show time and status */}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <StatusChip
                                        color={(item.Status === 1) ? R.colors.successGreen : R.colors.failRed}
                                        value={item.Status === 1 ? R.strings.Success : R.strings.Failed}></StatusChip>
                                </View>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.TrnDate ? convertDateTime(item.TrnDate) : '-'}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )

    };

    // styles for this class
    mystyle = () => {
        return {
            headerText: {
                fontSize: R.dimens.smallText,
                color: R.colors.textSecondary,
                textAlign: 'center'
            },
            valueText: {
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
                textAlign: 'center'
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
        // update list data
        Listdata: state.AffiliateReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // perform action for commission report
        getCommissionReport: (Request) => dispatch(getCommissionReport(Request)),
        // perform action for userlist
        getAffiliateUserList: () => dispatch(getAffiliateUserList()),
        // perform action scheme mapping 
        getSchemeMappigIds: (Request) => dispatch(getSchemeMappigIds(Request)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommissionReport)