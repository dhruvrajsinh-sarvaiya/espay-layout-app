// ChatDashboard
import React, { Component } from 'react';
import { View, FlatList, } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation'
import { isCurrentScreen } from '../../components/Navigation';
import { connect } from 'react-redux';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import ImageButton from '../../native_theme/components/ImageTextButton';
import {
    getChatOnlineUserDashboard, getChatOfflineUserDashboard, getChatActiveUserDashboard,
    getChatBlockedUserDashboard, ClearChatDashboardData
} from '../../actions/CMS/ChatDashboardAction';
import R from '../../native_theme/R';
import CustomCard from '../widget/CustomCard';
import DashboardHeader from '../widget/DashboardHeader';
import ThemeToolbarWidget from '../widget/ThemeToolbarWidget';
const { width, height } = R.screen();

class ChatDashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewHeight: 0,//for set common viewheight
            isGrid: true,//for display record in grid / list
            // static data for display cardview 
            data: [
                { id: 1, title: '-', value: R.strings.OnlineUser, icon: R.images.IC_FILL_USER, type: 1 },
                { id: 2, title: '-', value: R.strings.OfflineUser, icon: R.images.IC_FILL_USER, type: 1 },
                { id: 3, title: '-', value: R.strings.ActiveUser, icon: R.images.IC_FILL_USER, type: 1 },
                { id: 4, title: '-', value: R.strings.BlockedUser, icon: R.images.IC_FILL_USER, type: 1 },
            ],
            isFirstTime: true,
        }

    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //To get call counts api's  
        this.callCountsApi()
    }


    //api call for list and filter reset
    callCountsApi = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            // call action for get chat dashboard data one by one
            this.props.getChatOnlineUserDashboard()
            this.props.getChatOfflineUserDashboard()
            this.props.getChatActiveUserDashboard()
            this.props.getChatBlockedUserDashboard()
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
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
        if (ChatDashboard.oldProps !== props) {
            ChatDashboard.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { onlineUserCount, offlineUserCount, activeUserCount, blockedUserCount } = props;

            // for get Online user Count
            if (onlineUserCount) {
                // this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
                if (state.onlineUserCount == null || (state.onlineUserCount != null && onlineUserCount !== state.onlineUserCount)) {
                    if (validateResponseNew({ response: onlineUserCount, returnCode: onlineUserCount.ReturnCode, returnMessage: onlineUserCount.ReturnMsg, isList: true })) {
                        state.data[0].title = onlineUserCount.Count
                    }
                }
            }
            // for get Offline user Count
            if (offlineUserCount) {
                // this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
                if (state.offlineUserCount == null || (state.offlineUserCount != null && offlineUserCount !== state.offlineUserCount)) {
                    if (validateResponseNew({ response: offlineUserCount, returnCode: offlineUserCount.ReturnCode, returnMessage: offlineUserCount.ReturnMsg, isList: true })) {
                        state.data[1].title = offlineUserCount.Count
                    }
                }
            }
            // for get Active user Count
            if (activeUserCount) {
                // this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
                if (state.activeUserCount == null || (state.activeUserCount != null && activeUserCount !== state.activeUserCount)) {
                    if (validateResponseNew({ response: activeUserCount, returnCode: activeUserCount.ReturnCode, returnMessage: activeUserCount.ReturnMsg, isList: true })) {
                        state.data[2].title = activeUserCount.Count
                    }
                }
            }
            // for get Block user Count
            if (blockedUserCount) {
                // this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
                if (state.blockedUserCount == null || (state.blockedUserCount != null && blockedUserCount !== state.blockedUserCount)) {
                    if (validateResponseNew({ response: blockedUserCount, returnCode: blockedUserCount.ReturnCode, returnMessage: blockedUserCount.ReturnMsg, isList: true })) {
                        state.data[3].title = blockedUserCount.Count
                    }
                }
            }
        }
        return null;
    }


    componentWillUnmount() {
        this.props.ClearChatDashboardData();
    }

    onPress = async (id) => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //redirect screens based on card selected 
            if (id == 1) { // screentype:1 for online user list
                this.props.navigation.navigate('ChatUserList', { screenType: 1, callCountApi: this.callCountsApi })
            }
            else if (id == 2) { // screentype:2 for offline user list
                this.props.navigation.navigate('ChatUserList', { screenType: 2, callCountApi: this.callCountsApi })
            }
            else if (id == 3) { // screentype:3 for active user list 
                this.props.navigation.navigate('ChatUserList', { screenType: 3, callCountApi: this.callCountsApi })
            }
            else if (id == 4) {  // screentype:4 for blocked user list 
                this.props.navigation.navigate('ChatUserList', { screenType: 4, callCountApi: this.callCountsApi })
            }
        }
    }

    render() {
        // for a loading bit for display progress dialog
        let { loading, offlineloading, Activeloading, blockloading } = this.props

        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background, width, height }}>
                {/* statusbar and actionbar  */}
                <CommonStatusBar />
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                />

                {/* Progress Dialog */}
                < ProgressDialog isShow={loading || offlineloading || Activeloading || blockloading} />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.Chat}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                {/* for display card with it's value,icon and title   */}
                <View style={{ flex: 1 }}>

                    <FlatList
                        style={{ marginTop: R.dimens.widgetMargin, }}
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        numColumns={this.state.isGrid ? 2 : 1}
                        data={this.state.data}
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    isGrid={this.state.isGrid}
                                    title={item.title}
                                    value={item.value}
                                    size={this.state.data.length}
                                    icon={item.icon}
                                    type={item.type}
                                    width={width}
                                    index={index}
                                    onChangeHeight={(newHeight) => {
                                        this.setState({ viewHeight: newHeight });
                                    }}
                                    viewHeight={this.state.viewHeight}
                                    onPress={() => this.onPress(item.id)}
                                />
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />

                </View>
                {/* Display image button at bottom of screen */}
                <View style={{ margin: R.dimens.margin }}>
                    <ImageButton
                        icon={R.images.BACK_ARROW}
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.listValue }]}
                    />

                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        // get ChatDashboard list from the reducer
        loading: state.ChatDashboardReducer.loading,
        offlineloading: state.ChatDashboardReducer.offlineloading,
        Activeloading: state.ChatDashboardReducer.Activeloading,
        blockloading: state.ChatDashboardReducer.blockloading,

        // user count data  
        onlineUserCount: state.ChatDashboardReducer.onlineUserCount,
        offlineUserCount: state.ChatDashboardReducer.offlineUserCount,
        activeUserCount: state.ChatDashboardReducer.activeUserCount,
        blockedUserCount: state.ChatDashboardReducer.blockedUserCount,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // call action for clear all user count data
        ClearChatDashboardData: () => dispatch(ClearChatDashboardData()),
        // for get count of online user
        getChatOnlineUserDashboard: () => dispatch(getChatOnlineUserDashboard()),
        // for get count of offline user
        getChatOfflineUserDashboard: () => dispatch(getChatOfflineUserDashboard()),
        // for get count of Active user
        getChatActiveUserDashboard: () => dispatch(getChatActiveUserDashboard()),
        // for get count of Blocked user
        getChatBlockedUserDashboard: () => dispatch(getChatBlockedUserDashboard()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatDashboard)