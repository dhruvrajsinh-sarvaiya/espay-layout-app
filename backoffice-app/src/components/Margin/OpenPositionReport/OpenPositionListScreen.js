import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import SafeView from '../../../native_theme/components/SafeView';
import { changeTheme, parseArray, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { getOpenPositionReport } from '../../../actions/Margin/OpenPositionReportActions';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { getUserDataList, getPairList } from '../../../actions/PairListAction';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import ImageViewWidget from '../../widget/ImageViewWidget';

export class OpenPositionListScreen extends Component {

    constructor(props) {
        super(props)
        this.drawer = React.createRef();
        // create reference

        this.onBackPress = this.onBackPress.bind(this);
        //To Bind All Method

        // Define All State initial state
        this.state = {
            PairList: [],
            UserNames: [],
            OpenPositionReportList: [],

            searchInput: '',
            isFirstTime: true,
            refreshing: false,
            isDrawerOpen: false,

            UserId: 0,
            PairId: 0,
            selectedUser: R.strings.Please_Select,
            selectedPair: R.strings.all,
        }

        //Add Current Screen to Manual Handling BackPress Events

        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    componentDidMount = async () => {
        changeTheme();
        //Add this method to change theme based on stored theme name.

        // check internet connection
        if (await isInternet()) {
            
            this.props.getOpenPositionReport()
            // Call Open Position Report Api 
            
            this.props.getUserDataList()
            // Call Get User List Api
            
            this.props.getPairList({ IsMargin: 1 })
            // Call Get Pair List
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {

        //stop twice api call

        return isCurrentScreen(nextProps);
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Open Position Report
            let request = {
                UserId: this.state.selectedUser === R.strings.Please_Select ? '' : this.state.UserId,
                PairId: this.state.selectedPair === R.strings.all ? '' : this.state.PairId
            }

            //Call Get Open Position API
            this.props.getOpenPositionReport(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Reset Filter
    onResetPress = async () => {
        // Close Drawer 
        this.drawer.closeDrawer();

        // set Initial State
        this.setState({
            selectedUser: R.strings.Please_Select,
            selectedPair: R.strings.all,
            searchInput: '',
            UserId: 0,
            PairId: 0,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Open Position Report API
            this.props.getOpenPositionReport();

        } else {
            this.setState({ refreshing: false });
        }
    }
    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({
                isDrawerOpen: false
            })
        }
        else {
            //going back screen
            this.props.navigation.goBack();
        }
    }
    // Api Call when press on complete button
    onCompletePress = async () => {
        // Close Drawer user press on Complete button because display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Open Position Report
            let request = {
                UserId: this.state.selectedUser === R.strings.Please_Select ? '' : this.state.UserId,
                PairId: this.state.selectedPair === R.strings.all ? '' : this.state.PairId
            }

            //Call Get Open Position Report API
            this.props.getOpenPositionReport(request);

        } else {
            this.setState({ refreshing: false });
        }
        //If Filter from Complete Button Click then empty searchInput
        this.setState({ searchInput: '' })
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (OpenPositionListScreen.oldProps !== props) {
            OpenPositionListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { OpenPositionReportData, UserDataList, PairListData } = props.OpenPositionReportResult;

            // OpenPositionReportData is not null
            if (OpenPositionReportData) {
                try {
                    if (state.OpenPositionReportData == null || (state.OpenPositionReportData != null && OpenPositionReportData !== state.OpenPositionReportData)) {

                        //succcess response fill the list 
                        if (validateResponseNew({ response: OpenPositionReportData, isList: true })) {

                            return Object.assign({}, state, {
                                OpenPositionReportData,
                                OpenPositionReportList: parseArray(OpenPositionReportData.Data),
                                refreshing: false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                OpenPositionReportData: null,
                                OpenPositionReportList: [],
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        OpenPositionReportData: null,
                        OpenPositionReportList: [],
                        refreshing: false,
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            // UserDataList is not null
            if (UserDataList) {
                try {
                    //if local UserDataList state is null or its not null and also different then new response then and only then validate response.
                    if (state.UserDataList == null || (state.UserDataList != null && UserDataList !== state.UserDataList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: UserDataList, isList: true })) {
                            // Parsing respons in array
                            let res = parseArray(UserDataList.GetUserData);

                            // fetching only UserName from response
                            for (var userListItem in res) {
                                let item = res[userListItem]
                                item.value = item.UserName
                            }

                            let userNames = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, UserDataList, UserNames: userNames };
                        } else {
                            return { ...state, UserDataList, UserNames: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, UserNames: [{ value: R.strings.Please_Select }] };
                }
            }

            // PairListData is not null
            if (PairListData) {
                try {
                    //if local PairListData state is null or its not null and also different then new response then and only then validate response.
                    if (state.PairListData == null || (state.PairListData != null && PairListData !== state.PairListData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: PairListData, isList: true })) {
                            // Parsing respons in array
                            let res = parseArray(PairListData.Response);

                            // fetching only PairName from response
                            for (var pairKey in res) {
                                let item = res[pairKey]
                                item.value = item.PairName
                            }

                            let pairList = [
                                { value: R.strings.all },
                                ...res
                            ];

                            return { ...state, PairListData, PairList: pairList };
                        } else {
                            return { ...state, PairListData, PairList: [{ value: R.strings.all }] };
                        }
                    }
                } catch (e) {
                    return { ...state, PairList: [{ value: R.strings.all }] };
                }
            }
        }
        return null
    }

    // Drawer Navigation
    navigationDrawer() {

        return (
            // for show filter of Pair List and status data
            <FilterWidget
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
                toastRef={component => this.toast = component}
                pickers={[
                    {
                        title: R.strings.User,
                        array: this.state.UserNames,
                        selectedValue: this.state.selectedUser,
                        onPickerSelect: (index, object) => this.setState({ selectedUser: index, UserId: object.Id })
                    },
                    {
                        title: R.strings.currencyPair,
                        array: this.state.PairList,
                        selectedValue: this.state.selectedPair,
                        onPickerSelect: (index, object) => this.setState({ selectedPair: index, PairId: object.PairId })
                    }
                ]}
            />
        )
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { OpenPositionReportLoading, } = this.props.OpenPositionReportResult;

        // for searching
        let finalItems = this.state.OpenPositionReportList.filter(item => (
            item.UserID.toString().includes(this.state.searchInput) ||
            item.UserName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.PairName.replace('_', '/').toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            //DrawerLayout for Open Position Report Filteration
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
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        title={R.strings.openPositionReport}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    <View style={{ flex: 1 }}>
                        {
                            (OpenPositionReportLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) => <OpenPositionListItem
                                        index={index}
                                        item={item}
                                        size={finalItems.length}
                                        onPress={() => this.props.navigation.navigate('OpenPositionReportDetailScreen', { item })}
                                    />
                                    }
                                    // assign index as key valye to Withdrawal list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // For Refresh Functionality In Withdrawal FlatList Item
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    }
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    // Displayed Empty Component when no record found 
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                        }
                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class OpenPositionListItem extends Component {

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
        let { size, index, item, onPress } = this.props

        return (
            // for flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1,
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }} onPress={onPress}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {/* Currency Image */}
                            <ImageViewWidget url={item.PairName ? item.PairName.split('_')[0] : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                {/* Pair Name and Right Arrow icon for Detail Screen */}
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.PairName.replace('_', '/'))} </Text>
                                    <ImageTextButton
                                        style={{ margin: 0, }}
                                        icon={R.images.RIGHT_ARROW_DOUBLE}
                                        iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                    />
                                </View>

                                {/* User Id */}
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.userId}: </TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(item.UserID)}</TextViewHML>
                                </View>

                                {/* User Name */}
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.userName}: </TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(item.UserName)}</TextViewHML>
                                </View>

                                {/* Transaction Date */}
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                    <ImageTextButton
                                        style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                        icon={R.images.IC_TIMER}
                                        iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    />
                                    <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get position report data from reducer
        OpenPositionReportResult: state.OpenPositionReportReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // To Perform Open Position Report Action
    getOpenPositionReport: (payload) => dispatch(getOpenPositionReport(payload)),
    // To Perform User Data Action
    getUserDataList: () => dispatch(getUserDataList()),
    // To Perform Pair List Action
    getPairList: (payload) => dispatch(getPairList(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenPositionListScreen);