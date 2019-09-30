// ChatUserHistory
import React, { Component } from 'react';
import { View, FlatList, RefreshControl, /* ActivityIndicator */ } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation'
import { isCurrentScreen } from '../../components/Navigation';
import { connect } from 'react-redux';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import { getChatUserhistory, ChatUserHistoryClear } from '../../actions/CMS/ChatUserListAction';
import moment from 'moment';
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import SafeView from '../../native_theme/components/SafeView';
import AnimatableItem from '../../native_theme/components/AnimatableItem';

class ChatUserHistory extends Component {

    constructor(props) {
        super(props);

        // Data from previous screen
        const { params } = this.props.navigation.state;

        // Define all initial state
        this.state = {
            data: [],//for store data from the responce
            search: '',//for search value for data
            refreshing: false,//for refresh data
            item: params == undefined ? undefined : params.item,//get data from the another screen and store it in item state
            scrollbit: false, // for call api when scroll 
            fromRefresh: false, // for check refreshing  method is call 
            totalcount: 0,//for manage count of data to be display in flatlist
            //To call API once on Scroll
            endReachCounter: 0,
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme()

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Api for get ChatuserHistory
            this.props.getChatUserhistory({
                Username: this.state.item.UserName,
                Page: 0
            })
        }
    }

    componentWillUnmount() {
        // Clear data on backpress
        this.props.ChatUserHistoryClear()
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {

        //reseting endReachCounter to 0 so it want call api again
        this.setState({ refreshing: true, fromRefresh: true, endReachCounter: 0 });

        //Check NetWork is Available or not
        if (await isInternet()) {
            let RequestUserHistory = {
                Username: this.state.item.UserName,
                Page: 0
            }
            //Call Api for get ChatuserHistory
            this.props.getChatUserhistory(RequestUserHistory)
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    /*  static oldProps = {};
 
     static getDerivedStateFromProps(props, state) {
         //To Skip Render First Time for available reducer data if exists
         if (state.isFirstTime) {
             return {
                 ...state,
                 isFirstTime: false,
             }
         }
 
         // To Skip Render if old and new props are equal
         if (ChatUserHistory.oldProps !== props) {
             ChatUserHistory.oldProps = props;
         } else {
             return null;
         }
 
         if (isCurrentScreen(props)) {
 
             //for fetch News API
             const { chatUser_History } = props
 
             // for get chatuserlist
             if (chatUser_History) {
                 try {
                     // this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
                     if (state.chatUser_HistoryState == null || (state.chatUser_HistoryState != null && chatUser_History !== state.chatUser_HistoryState)) {
                         if (validateResponseNew({ response: chatUser_History, returnCode: chatUser_History.ReturnCode, returnMessage: chatUser_History.ReturnMsg, isList: true })) {
 
                             let res = chatUser_History.Data != null ? parseArray(chatUser_History.Data) : null;
 
                             props.ChatUserHistoryClear();
 
                             //If api is called from swipe refresh than replace existing array with new array
                             if (state.fromRefresh) {
                                 return {
                                     ...state,
                                     chatUser_HistoryState: chatUser_History,
                                     data: res,
                                     refreshing: false,
                                     fromRefresh: false,
                                     totalcount: chatUser_History.TotalRecord
                                 }
                             }
                             else {
                                 //If its not from swipe refresh then merge old records with new records
                                 return {
                                     ...state,
                                     chatUser_HistoryState: chatUser_History,
                                     data: res == null ? state.data : [...state.data, ...res],
                                     refreshing: false,
                                     totalcount: chatUser_History.TotalRecord
                                 }
                             }
                         }
 
                         else {
                             return { ...state, refreshing: false, data: [], chatUser_HistoryState: chatUser_History }
                         }
                     }
                 } catch (e) {
 
                 }
             }
         }
         return null;
     }
  */
    componentDidUpdate = (prevProps, prevState) => {
        const { chatUser_History } = this.props;

        if (chatUser_History !== prevProps.chatUser_History) {
            if (chatUser_History) {
                try {
                    // this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
                    if (this.state.chatUser_History == null || (this.state.chatUser_History != null && chatUser_History !== this.state.chatUser_History)) {
                        if (validateResponseNew({ response: chatUser_History, isList: true })) {
                            //If api is called from swipe refresh than replace existing array with new array

                            var res = chatUser_History.Data != null ? parseArray(chatUser_History.Data) : null;

                            // From swipe refresh
                            if (this.state.fromRefresh) {
                                this.setState({ chatUser_History, data: res, refreshing: false, fromRefresh: false, totalcount: chatUser_History.TotalRecord })
                            }
                            else {
                                //If its not from swipe refresh then merge old records with new records
                                this.setState({ chatUser_History, data: res == null ? this.state.data : [...this.state.data, ...res], refreshing: false, totalcount: chatUser_History.TotalRecord })
                            }

                            // Clear data
                            this.props.ChatUserHistoryClear();
                        }
                        else {
                            this.setState({ refreshing: false, data: [], chatUser_History });
                        }
                    }
                } catch (e) {
                    this.setState({ refreshing: false, data: [], chatUser_History });
                }
            }
        }
    }

    render() {
        // loading bit for display listloader
        const { loading } = this.props;

        let finalItems = [];
        let list = this.state.data;

        // for search 
        if (list.length > 0) {
            finalItems = list.filter(item => (
                item.Message.toLowerCase().includes(this.state.search.toLowerCase())
            ));
        }

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.ChatHistory}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                />

                <View style={{ flex: 1 }}>
                    {/* display listloader till data is not populated*/}
                    {loading && !this.state.refreshing && !this.state.fromRefresh && this.state.endReachCounter != 2 ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            {/* for display Headers for list  */}
                            {
                                finalItems.length > 0
                                    ?
                                    <FlatList
                                        extraData={this.state}
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) =>
                                            <FlatlistItem
                                                item={item}
                                                index={index}
                                                size={this.state.data.length}
                                            />
                                        }
                                        // assign index as key value to list item
                                        keyExtractor={(item, index) => index.toString()}
                                        /* for refreshing data of flatlist */
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.cardBackground}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                            />}
                                    /*    onEndReachedThreshold={0.5}
                                       onEndReached={() => {
                                           //if totalCount is greater than current items length than call api on scroll
                                           if (this.state.totalcount > finalItems.length) {

                                               //First time render will call once this method so skip it using increacing bit
                                               //Again Scrolling cause the second time call so skip it.
                                               if (this.state.endReachCounter == 0) {
                                                   this.setState({ endReachCounter: 1 })
                                               } else if (this.state.endReachCounter == 1) {
                                                   this.setState({ endReachCounter: 2 })
                                               }
                                               //If bit reached 2 count than execute API call.
                                               else if (this.state.endReachCounter == 2) {
                                                   if (!loading) {
                                                       let RequestUserHistory = {
                                                           Username: this.state.item.UserName,
                                                           Page: this.state.data[this.state.data.length - 1].Score
                                                       }

                                                       this.props.getChatUserhistory(RequestUserHistory)
                                                   }
                                               }
                                           }
                                       }}
                                       ListFooterComponent={() => loading ? <ActivityIndicator size={'large'} color={R.colors.accent} /> : null} */
                                    />
                                    :
                                    // Displayed empty component when no record found 
                                    <ListEmptyComponent />
                            }
                        </View>
                    }
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class FlatlistItem extends Component {
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
        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1, flexDirection: 'column',
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation, flex: 1, borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                    }}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View>
                                {/* for show User icon */}
                                <ImageTextButton
                                    icon={R.images.IC_COMPLAINT}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, }}>

                                {/* for show User Name */}
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>
                                    {validateValue(item.Name)}</TextViewMR>

                                {/* for show Message */}
                                <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>
                                    {validateValue(item.Message)}</TextViewHML>

                                {/* for show date and time */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <ImageTextButton
                                        style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                        icon={R.images.IC_TIMER}
                                        iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    />
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, paddingRight: R.dimens.widgetMargin, textAlign: 'right' }}>
                                        {item.Time ? moment.unix(item.Time / 1000).format("DD MMM YYYY hh:mm a") : '-'}</TextViewHML>
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
    return {
        // Data get from the reducer
        loading: state.ChatUserListReducer.loading,
        chatUser_History: state.ChatUserListReducer.chatUser_History,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // call action for getting chat user history
        getChatUserhistory: (RequestUserHistory) => dispatch(getChatUserhistory(RequestUserHistory)),
        // clear data 
        ChatUserHistoryClear: () => dispatch(ChatUserHistoryClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatUserHistory)