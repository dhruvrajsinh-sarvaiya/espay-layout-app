import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import { getWalletUserList, addWalletUser, clearAddUserData } from '../../actions/Wallet/MyWalletAction';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, showAlert, parseArray } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import ImageButton from '../../native_theme/components/ImageTextButton';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import ImageViewWidget from '../Widget/ImageViewWidget';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class ListWalletUser extends Component {
    constructor(props) {
        super(props);

        //To Fetch value From Previous Screen
        let WalletId = props.navigation.state.params && props.navigation.state.params.WalletId;

        //Define All State initial state
        this.state = {
            response: [],
            refreshing: false,
            WalletId: WalletId,
            searchInput: '',
            isFirstTime: true,
        };

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // check for wallet id is found or not
            if (this.state.WalletId) {

                //Call Get Wallet User List From API
                this.props.getWalletUserList(this.state.WalletId);
            }

        } else {
            this.setState({ refreshing: false });
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async (fromSelf = true) => {

        if (fromSelf) {
            this.setState({ refreshing: true });
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            // check for wallet id is found or not
            if (this.state.WalletId) {

                //Call Get Wallet User List From API
                this.props.getWalletUserList(this.state.WalletId);
            }
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, _prevState) => {

        const { AddWalletUserFetchData, AddWalletUserData } = this.props;

        // compare response with previous response
        if (AddWalletUserData !== prevProps.AddWalletUserData) {

            //To Check Changes Status Of List User Wallet Wise
            if (!AddWalletUserFetchData) {
                try {
                    //handle response of API
                    if (validateResponseNew({ response: AddWalletUserData })) {

                        //Display Success Message and Refresh Wallet User List
                        showAlert(R.strings.Success + '!', AddWalletUserData.ReturnMsg, 0, () => {

                            //Clear Add User Data 
                            this.props.clearAddUserData();
                            this.onRefresh(false);
                        });
                    } else {
                        //Clear Add User Data 
                        this.props.clearAddUserData();
                    }
                } catch (e) {
                    this.setState({ isFromDelete: false });
                    //Clear Add User Data 
                    this.props.clearAddUserData();
                }
            }
        }
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
        if (ListWalletUser.oldProps !== props) {
            ListWalletUser.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { GetWalletUserListFetchData, GetWalletUserListWisedata, } = props;

            //To Check Wallet User List Data
            if (!GetWalletUserListFetchData) {
                try {
                    if (validateResponseNew({ response: GetWalletUserListWisedata, isList: true, })) {

                        //Check Response Is Array Or Not.
                        //If Response is Not array then parse and store in state.
                        var resData = parseArray(GetWalletUserListWisedata.Data);
                        return {
                            response: resData,
                            refreshing: false
                        }
                    } else {
                        return {
                            response: [],
                            refreshing: false
                        }
                    }
                } catch (e) {
                    return {
                        response: [],
                        refreshing: false
                    }
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
        return null;
    }

    //On Request For Delete List Record
    onDeletePress = async (Item) => {

        //Check NetWork is Available or not 
        if (await isInternet()) {

            //Delete Wallet User Request
            let deleteWalletUserRequest = {
                WalletID: this.state.WalletId,
                RoleId: Item.RoleID,
                Message: Item.WalletName,
                Email: Item.Email,
                RequestType: 2, //Static 2 For Delete Request
                ChannelId: 21

            }
            //To delete Request For User Wallet
            this.props.addWalletUser(deleteWalletUserRequest);
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { GetWalletUserListIsFetching, AddWalletUserIsFetching } = this.props;

        //final items from search input (validate on UserName and RoleName)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response;
        finalItems = finalItems.filter(item => item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) || item.RoleName.toLowerCase().includes(this.state.searchInput.toLowerCase()));

        return (
            <SafeView isDetail={true} style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.WalletUserList}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AddNewWalletUser', { WalletId: this.state.WalletId, onRefresh: this.onRefresh })
                    }}
                />

                {/* To Set ProgressDialog as per out theme */}
                <ProgressDialog isShow={AddWalletUserIsFetching} />

                {/* To Check Response fetch or not if GetWalletUserListIsFetching = true then display progress bar else display List*/}
                {GetWalletUserListIsFetching && !this.state.refreshing ?
                    <ListLoader />
                    :
                    <View style={{ flex: 1 }}>

                        {finalItems.length ?
                            <View style={{ flex: 1 }}>

                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    renderItem={({ item, index }) => {
                                        return <UserWalletList
                                            userWalletIndex={index}
                                            /* render all item in list */
                                            item={item}
                                            onDelete={() => {
                                                // for show selected Record in Dialog
                                                let selectedRecord = R.strings.wallet + " : " + (item.WalletName ? item.WalletName : '-') + "\n" + R.strings.userName + " : " + (item.UserName ? item.UserName : '-') + "\n\n"

                                                showAlert(
                                                    R.strings.Delete + '!',
                                                    selectedRecord + R.strings.delete_message,
                                                    6,
                                                    () => { this.onDeletePress(item) },
                                                    R.strings.no_text,
                                                    () => { },
                                                    R.strings.yes_text);
                                            }}
                                            userWalletSize={this.state.response.length} />
                                    }}
                                    /* assign index as key valye to List Wallet User Item */
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    /* For Refresh Functionality In List Wallet User FlatList Item */
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
                            :
                            <ListEmptyComponent module={R.strings.WalletUserList} onPress={() => this.props.navigation.navigate('AddNewWalletUser')} />
                        }
                    </View>
                }
            </SafeView>
        );
    }
}

// This Class is used for display record in list
export class UserWalletList extends Component {
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
        let { userWalletIndex, userWalletSize, onDelete } = this.props;

        // apply color based on role id
        let color = R.colors.accent;
        if (item.RoleID == 1) {
            color = R.colors.orange
        } else if (item.RoleID == 2) {
            color = R.colors.yellow
        } else if (item.RoleID == 3) {
            color = R.colors.successGreen
        } else {
            color = R.colors.accent
        }

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginBottom: (userWalletIndex == userWalletSize - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (userWalletIndex == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1,
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {/* Currency Image */}
                            <ImageViewWidget url={item.WalletType ? item.WalletType : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                {/* Amount , Currecncy Name and Transaction No */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletName ? item.WalletName : ''}</Text>
                                    <TextViewMR style={{ color: R.colors.successGreen, fontSize: R.dimens.smallText, }}>{item.WalletType ? item.WalletType : ''}</TextViewMR>
                                </View>

                                {/* User Name and Email Address */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.User} : </TextViewHML>
                                    <View>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{item.UserName ? item.UserName : '-'}</TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.Email ? item.Email : '-'}</TextViewHML>
                                    </View>
                                </View>
                            </View>
                        </View >

                        {/* RoleName and Action */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widget_left_right_margin }}>
                            <StatusChip
                                color={color}
                                value={item.RoleName ? item.RoleName : '-'}></StatusChip>
                            <ImageButton
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: 0,
                                }}
                                icon={R.images.IC_DELETE}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                onPress={onDelete} />
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    };

}

function mapStateToProps(state) {
    return {
        //Update Get All User Wallet Wise
        GetWalletUserListFetchData: state.MyWalletReducer.GetWalletUserListFetchData,
        GetWalletUserListWisedata: state.MyWalletReducer.GetWalletUserListWisedata,
        GetWalletUserListIsFetching: state.MyWalletReducer.GetWalletUserListIsFetching,

        //Update Delete Request For User Wallet
        AddWalletUserFetchData: state.MyWalletReducer.AddWalletUserFetchData,
        AddWalletUserData: state.MyWalletReducer.AddWalletUserData,
        AddWalletUserIsFetching: state.MyWalletReducer.AddWalletUserIsFetching,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform List User Wallet Wise
        getWalletUserList: (WalletId) => dispatch(getWalletUserList(WalletId)),

        //Perform Delete User Request
        addWalletUser: (deleteWalletUserRequest) => dispatch(addWalletUser(deleteWalletUserRequest)),

        //Perform Clear Add User Data
        clearAddUserData: () => dispatch(clearAddUserData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListWalletUser)