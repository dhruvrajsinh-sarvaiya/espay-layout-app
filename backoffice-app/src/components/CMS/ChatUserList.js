// ChatUserList
import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, convertDateTime, addPages } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation'
import { isCurrentScreen } from '../../components/Navigation';
import { connect } from 'react-redux';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import StatusChip from '../widget/StatusChip';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import CardView from '../../native_theme/components/CardView';
import { getUserChatListApi, clearChatListData } from '../../actions/CMS/ChatUserListAction';
import { AppConfig } from '../../controllers/AppConfig';
import PaginationWidget from '../widget/PaginationWidget';
import SafeView from '../../native_theme/components/SafeView';
import AnimatableItem from '../../native_theme/components/AnimatableItem';

class ChatUserList extends Component {

    constructor(props) {
        super(props);

        // Data from previous screen
        let screenType = props.navigation.state.params && props.navigation.state.params.screenType

        // Set screen title based on previous screen card select
        let screenTitle

        if (screenType == 1)
            screenTitle = R.strings.OnlineUser
        else if (screenType == 2)
            screenTitle = R.strings.OfflineUser
        else if (screenType == 3)
            screenTitle = R.strings.ActiveUser
        else if (screenType == 4)
            screenTitle = R.strings.BlockedUser

        // Define all initial state
        this.state = {
            screenTitle: screenTitle,
            screenType: screenType,
            data: [],//for store data from the responce
            search: '',//for search value for data
            refreshing: false,//for refresh data
            isFirstTime: true,
            selectedPage: 1,
            row: []
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //To get call counts api's  
        this.callGetUserChatListApi()
    }

    //api call for list and filter reset
    callGetUserChatListApi = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Api for get Chatuserlist
            this.props.getUserChatListApi({ PageNo: 0, PageSize: AppConfig.pageSize, screenType: this.state.screenType })
        }
    }

    componentWillUnmount() {
        // Clear data on backpress
        this.props.clearChatListData()
        // this.props.navigation.state.params.callCountApi() // call list method from back screen
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Api for get Chatuserlist
            this.props.getUserChatListApi({ PageNo: this.state.selectedPage - 1, PageSize: AppConfig.pageSize, screenType: this.state.screenType })
            //----------
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
            }
        }

        // To Skip Render if old and new props are equal
        if (ChatUserList.oldProps !== props) {
            ChatUserList.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { chatUserListData } = props.data

            // for get chatuserlist
            if (chatUserListData) {
                try {
                    // this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
                    if (state.chatUserListDataState == null || (state.chatUserListDataState != null && chatUserListData !== state.chatUserListDataState)) {
                        if (validateResponseNew({ response: chatUserListData, returnCode: chatUserListData.ReturnCode, returnMessage: chatUserListData.ReturnMsg, isList: true })) {

                            let res = parseArray(chatUserListData.Users);

                            //for add status static
                            for (var keyData in res) {
                                let item = res[keyData];

                                if (item.Status == 0)
                                    item.statusStatic = R.strings.Inactive
                                else if (item.Status == 1)
                                    item.statusStatic = R.strings.Active
                                else if (item.Status == 2)
                                    item.statusStatic = R.strings.Confirmed
                                else if (item.Status == 3)
                                    item.statusStatic = R.strings.Unconfirmed
                                else if (item.Status == 4)
                                    item.statusStatic = R.strings.Unassigned
                                else if (item.Status == 5)
                                    item.statusStatic = R.strings.Suspended
                                else if (item.Status == 6)
                                    item.statusStatic = R.strings.Blocked
                                else if (item.Status == 7)
                                    item.statusStatic = R.strings.requestDeleted
                                else if (item.Status == 8)
                                    item.statusStatic = R.strings.Suspicious
                                else if (item.Status == 9)
                                    item.statusStatic = R.strings.deleted
                                else if (item.Status == 10)
                                    item.statusStatic = R.strings.PolicyViolated
                                else if (item.Status == 11)
                                    item.statusStatic = R.strings.UnBlocked
                            }

                            return {
                                ...state, chatUserListDataState: chatUserListData,
                                data: res,
                                refreshing: false,
                                row: addPages(chatUserListData.TotalCount)
                            }
                        }
                        else {
                            return { ...state, refreshing: false, data: [], chatUserListDataState: chatUserListData, row: [] }
                        }
                    }
                } catch (e) {
                    return { ...state, refreshing: false, data: [], row: [] }
                }
            }
        }
        return null;
    }

    // move to edit record screen 
    editRecord(item) {
        this.props.navigation.navigate('ChatUserListEdit', { item: item, onSuccess: this.callGetUserChatListApi })
    }

    // move to show History screen for get chat message of perticular user
    showHistory(item) {
        this.props.navigation.navigate('ChatUserHistory', { item: item })
    }

    // this method is called when page change and also api call
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {

                this.setState({ selectedPage: pageNo });

                //To get getUserChatListApi list
                this.props.getUserChatListApi({
                    PageNo: pageNo - 1,
                    PageSize: AppConfig.pageSize,
                    screenType: this.state.screenType
                });
            }
        }
    }

    render() {
        // loading bit for display listloader
        const { chatUserListFetching } = this.props.data;

        let list = this.state.data;
        let finalItems = [];

        // for search 
        if (list.length > 0) {
            finalItems = list.filter(item => (
                item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Name != null && item.Name.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Email != null && item.Email.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Mobile != null && item.Mobile.includes(this.state.search)
            ));
        }

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.screenTitle}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* display listloader till data is not populated*/}
                    {chatUserListFetching && !this.state.refreshing ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            {/* for display Headers for list  */}
                            {
                                finalItems.length
                                    ?
                                    <View style={{ flex: 1, marginBottom: R.dimens.widgetMargin }}>
                                        {/* for display data in row using flatlist  */}
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item, index }) =>
                                                <ChatUserListItem
                                                    item={item}
                                                    index={index}
                                                    size={this.state.data.length}
                                                    onEdit={() => this.editRecord(item)}
                                                    onHistory={() => this.showHistory(item)}
                                                />
                                            }
                                            // assign index as key value to list item
                                            keyExtractor={item => item.Id.toString()}
                                            /* for refreshing data of flatlist */
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.cardBackground}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />}
                                        />
                                    </View>
                                    :
                                    // Displayed empty component when no record found 
                                    <ListEmptyComponent />
                            }
                        </View>
                    }

                    {/*To Set Pagination View  */}
                    <View>
                        {finalItems.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                    </View>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class ChatUserListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let item = this.props.item; //for get single item from flatlist
        let { index, size } = this.props;

        let statusColor

        // InActive = 0
        if (item.Status == 0)
            statusColor = R.colors.failRed
        //  Active = 1
        else if (item.Status == 1)
            statusColor = R.colors.successGreen
        // Confirmed = 2
        else if (item.Status == 2)
            statusColor = R.colors.textSecondary
        // UnConfirmed = 3
        else if (item.Status == 3)
            statusColor = R.colors.textPrimary
        // UnAssigned = 4
        else if (item.Status == 4)
            statusColor = R.colors.yellow
        // Suspended = 5
        else if (item.Status == 5)
            statusColor = R.colors.failRed
        // Blocked = 6
        else if (item.Status == 6)
            statusColor = R.colors.orange
        // RequestDeleted = 7
        else if (item.Status == 7)
            statusColor = R.colors.failRed
        // Suspicious = 8
        else if (item.Status == 8)
            statusColor = R.colors.failRed
        // Delete = 9
        else if (item.Status == 9)
            statusColor = R.colors.failRed
        // PolicyViolated = 10
        else if (item.Status == 10)
            statusColor = R.colors.sellerPink
        // UnBlocked = 11
        else if (item.Status == 11)
            statusColor = R.colors.cardBalanceBlue

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginLeft: R.dimens.widget_left_right_margin,
                    flexDirection: 'column', marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        borderTopRightRadius: R.dimens.margin,flex: 1,
                        elevation: R.dimens.listCardElevation,
                        flexDirection: 'column',
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                    }} onPress={this.props.onDetailScreen}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {/* for show User icon */}
                            <View>
                                <ImageTextButton
                                    icon={R.images.IC_FILL_USER}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, }}>

                                {/* for show Name, view list and edit icon */}
                                <View style={{ flex: 1, justifyContent: "space-between", flexDirection: 'row', alignItems: 'center' }}>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>
                                        {item.Name && (item.Name).trim() != '' ? item.Name : '-'}
                                    </TextViewMR>
                                    <View style={{ flexDirection: 'row' }}>
                                        <ImageTextButton
                                            style={{
                                                margin: 0, justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: R.colors.yellow,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                marginRight: R.dimens.widgetMargin,
                                                padding: R.dimens.CardViewElivation,
                                            }}
                                            icon={R.images.IC_VIEW_LIST}
                                            onPress={this.props.onHistory}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        />
                                        <ImageTextButton
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: R.colors.accent,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                padding: R.dimens.CardViewElivation,
                                            }}
                                            icon={R.images.IC_EDIT}
                                            onPress={this.props.onEdit}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        />
                                    </View>
                                </View>

                                {/* for show Email and Blocked status */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.Email)}</TextViewHML>
                                    <TextViewHML style={{
                                        color: item.IsBlocked == true ? R.colors.failRed : R.colors.successGreen,
                                        fontSize: R.dimens.smallestText,
                                    }}>{item.IsBlocked == true ? ' - ' + R.strings.Blocked : ' - ' + R.strings.UnBlocked}</TextViewHML>
                                </View>

                                {/* for show Mobile */}
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, paddingRight: R.dimens.widgetMargin, }}>
                                    {validateValue(item.Mobile)}</TextViewHML>
                            </View>
                        </View>

                        {/* for show status and date time */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <StatusChip
                                    color={statusColor}
                                    value={item.statusStatic}></StatusChip>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <ImageTextButton
                                        style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                        icon={R.images.IC_TIMER}
                                        iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    />
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDateTime(item.CreatedDate) : '-'}</TextViewHML>
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    //Updated Data For ChatUserListReducer Data 
    let data = {
        ...state.ChatUserListReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        // call action for getting chatuserlist
        getUserChatListApi: (Request) => dispatch(getUserChatListApi(Request)),
        // call action for clear chatuserlist
        clearChatListData: () => dispatch(clearChatListData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatUserList)