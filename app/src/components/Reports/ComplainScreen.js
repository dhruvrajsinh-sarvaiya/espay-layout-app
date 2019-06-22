import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Image, Easing, Text, } from 'react-native';
import { connect } from 'react-redux';
import { complainList, clearComplainData } from '../../actions/account/Complain'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { parseArray, getCurrentDate, convertDateTime, } from '../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { changeTheme } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../Widget/FilterWidget';
import CommonToast from '../../native_theme/components/CommonToast';
import { DateValidation } from '../../validations/DateValidation';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

class ComplainScreen extends Component {
    constructor(props) {
        super(props)

        //Define All initial State
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            isFirstTime: true,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            isDrawerOpen: false, // First Time Drawer is Closed
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // Bind All Methods 
        this.onResetPress = this.onResetPress.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
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

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {
            //Call Complain list API
            let request = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            this.props.complainList(request);
            //----------
        }
        else {
            this.setState({ refreshing: false });
        }
    }

    //for refresh list
    async onSuccess() {
        if (await isInternet()) {
            //Call Complain list API
            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
            }
            this.props.complainList(request);
        }
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //bind Request for Complain list API
            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
            }
            // call complain list Api
            this.props.complainList(request);
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
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
        if (ComplainScreen.oldProps !== props) {
            ComplainScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { complainListFetchData } = props.ComplainReducer;

            //To Check Complain list Data Fetch or Not
            if (!complainListFetchData) {
                try {
                    const { list } = props.ComplainReducer;
                    //Handle Success Response of Complain list Api.
                    if (validateResponseNew({ response: list, isList: true })) {
                        //check Complain list Response is an Array Or not
                        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                        let finalRes = parseArray(list.userWiseCompaintDetailResponces);

                        return Object.assign({}, state, { response: finalRes, refreshing: false, })
                    }
                    else {
                        return Object.assign({}, state, { refreshing: false, response: [] })
                    }
                } catch (e) {
                    return Object.assign({}, state, { refreshing: false, response: [] })
                }
            }
        }
        return null;
    }

    componentWillUnmount() {
        // call action for clear Reducer value 
        this.props.clearComplainData()
    }

    //for redirect to reply complaint screen
    onPostReplyPress = (item) => {
        this.props.navigation.navigate('ReplyComplainScreen', { cid: item.CompainNumber, subject: item.Subject })
    }

    // User press on detail button redirect to detail screen
    onDetail = (item, type) => {
        this.props.navigation.navigate('ComplainDetailsScreen', { ITEM: item, type: type })
    }

    // Render Right Side Menu 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {/* display plus icon */}
                <ImageTextButton
                    icon={R.images.IC_PLUS}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.props.navigation.navigate('RaiseComplainScreen', { onRefresh: this.onSuccess })} />
                {/* display filter icon */}
                <ImageTextButton
                    icon={R.images.FILTER}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.drawer.openDrawer()} />
            </View>
        )
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* for display Toast */}
                <CommonToast ref={cmp => this.toast = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* filterwidget for display fromdate, todate*/}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    FromDate={this.state.FromDate}
                    ToDate={this.state.ToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                ></FilterWidget>
            </SafeView>
        )
    }

    // Reset FromDate and ToDate
    onResetPress = async () => {
        this.drawer.closeDrawer();
        this.setState({ FromDate: getCurrentDate(), ToDate: getCurrentDate(), searchInput: '' })

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Bind Request For Complain List
            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate()
            }
            //Call Complain List API
            this.props.complainList(request);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Api Call when press on complete button
    onCompletePress = async () => {

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        }
        else {
            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For Complain List
                let request = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }
                //Call Complain List API
                this.props.complainList(request);
                //----------
            } else {
                this.setState({ refreshing: false });
            }
            //If Filter from Complete Button Click then empty searchInput
            this.setState({ searchInput: '' })
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { complainisFetching } = this.props.ComplainReducer;
        //----------

        //for final items from search input (validate on Amount and status)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => (
            item.Type.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Subject.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            ('' + item.CompainNumber).includes(this.state.searchInput)
        ));

        return (
            //DrawerLayout for Filteration
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To Set StatusBar as per our theme */}
                    <CommonStatusBar />

                    {/* For Search View with custom tooolbar */}
                    <CustomToolbar
                        title={R.strings.complaint_list}
                        isBack={true}
                        nav={this.props.navigation}
                        onBackPress={this.onBackPress}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        rightMenuRenderChilds={this.rightMenuRender()}
                    />

                    {/* To Check Response fetch or not if Complain list = true then display progress bar else display List*/}
                    {(complainisFetching && !this.state.refreshing) ?

                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>

                            {finalItems.length ?
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={finalItems}
                                        /* render all item in list */
                                        renderItem={({ item, index }) =>
                                            <FlatListItem
                                                index={index}
                                                id={item.CompainNumber}
                                                type={item.Type}
                                                subject={item.Subject}
                                                description={item.Description}
                                                status={item.Status}
                                                created_at={item.CreatedDate}
                                                Subject={item.Subject}
                                                remarks={item.Remark}
                                                size={finalItems.length}
                                                item={item}
                                                onDetail={() => this.onDetail(item, item.Type)}
                                                onPostReplyPress={() => this.onPostReplyPress(item)}>
                                            </FlatListItem>
                                        }
                                        /* assign index as key valye to list item */
                                        keyExtractor={(item, index) => index.toString()}
                                        /* set content style of list */
                                        contentContainerStyle={[
                                            { flexGrow: 1 },
                                            finalItems.length ? null : { justifyContent: 'center' }
                                        ]}
                                        /* For Refresh Functionality For FlatList Item */
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.background}
                                                refreshing={this.state.refreshing}
                                                onRefresh={() => this.onRefresh(true, true)}
                                            />
                                        } />
                                </View>
                                : <ListEmptyComponent module={R.strings.Raise_Complain} onPress={() => this.props.navigation.navigate('RaiseComplainScreen', { onRefresh: this.onSuccess })} />
                            }
                        </View>
                    }
                </SafeView>
            </Drawer >
        );
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        let { index, size } = this.props;
        let item = this.props.item;

        let color;
        //apply colors based on status 
        if ((this.props.status).toLowerCase() === "open") {
            color = R.colors.successGreen
        } else if ((this.props.status).toLowerCase() === "closed") {
            color = R.colors.failRed
        } else {
            color = R.colors.yellow
        }

        return (
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
                    borderTopRightRadius: R.dimens.margin,
                    padding: 0,
                }} onPress={this.props.onDetail}>

                    <View style={{ padding: R.dimens.WidgetPadding }}>

                        <View style={{ flexDirection: 'row' }}>
                            {/* dislay subject and type */}
                            <View style={{ width: '94%', flexDirection: 'row', }}>
                                <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ width: '60%', fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{item.Subject ? item.Subject : '-'}</Text>
                                <Text style={{ width: '40%', fontSize: R.dimens.smallText, color: R.colors.successGreen, fontFamily: Fonts.MontserratSemiBold, textAlign: 'right' }}>{item.Type ? item.Type : '-'}</Text>
                            </View>
                            {/* for display awrrow to details screen */}
                            <View style={{ marginLeft: R.dimens.widgetMargin, width: '6%', justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'flex-end', }}>
                                <Image
                                    source={R.images.RIGHT_ARROW_DOUBLE}
                                    style={{
                                        padding: R.dimens.widgetMargin,
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        tintColor: R.colors.textPrimary,
                                        width: R.dimens.dashboardMenuIcon,
                                        height: R.dimens.dashboardMenuIcon,
                                    }} />
                            </View>
                        </View>

                        {/* for display complain id */}
                        <View style={{ flexDirection: 'row' }}>
                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, }}>{R.strings.complaint_id}</TextViewHML>
                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{' : '}{item.CompainNumber ? item.CompainNumber : '-'}</TextViewHML>
                        </View>

                        {/*for display Description */}
                        <View style={{ flexDirection: 'row' }}>
                            <TextViewHML
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{item.Description ? item.Description : '-'}</TextViewHML>
                        </View>

                        {/*for display status and DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <StatusChip
                                    color={color}
                                    value={item.Status ? item.Status : '-'}></StatusChip>
                            </View>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDateTime(item.CreatedDate) : '-'}</TextViewHML>
                        </View>
                    </View>
                </CardView>
            </View >
        )
    };
}

function mapStateToProps(state) {
    return {
        // Updated data for complain
        ComplainReducer: state.complainReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform complain list Action
        complainList: (Request) => dispatch(complainList(Request)),
        // Perform Action for clear data from reducer
        clearComplainData: () => dispatch(clearComplainData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComplainScreen)