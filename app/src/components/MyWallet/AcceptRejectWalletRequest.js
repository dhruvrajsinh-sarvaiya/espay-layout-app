import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import { walletRequestAction, getListUserWalletRequest } from '../../actions/Wallet/MyWalletAction';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, addListener, showAlert, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import ImageButton from '../../native_theme/components/ImageTextButton';
import { Method, Fonts } from '../../controllers/Constants';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import ImageViewWidget from '../Widget/ImageViewWidget';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class AcceptRejectWalletRequest extends Component {

    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            response: [],
            refreshing: false,
            searchInput: '',
            isFirstTime: true,
        };

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Call Get List User Wallet Request
        this.GetUsetWalletRequestList();

        //Recived Data From Signal R
        this.listenerRecieveWalletActivity = addListener(Method.RecieveWalletActivity, (receivedMessage) => {

            if (isCurrentScreen(this.props)) {

                try {
                    let response = JSON.parse(receivedMessage);
                    this.setState({ response: response.Data.Data });
                } catch (_error) {

                    //parsing error
                }
            }
        })
    }

    //Clear Signal R Data When Screen redirect To any Screen
    componentWillUnmount() {
        if (this.listenerRecieveWalletActivity) {
            this.listenerRecieveWalletActivity.remove();
        }
    }

    GetUsetWalletRequestList = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Get List User Wallet Request
            this.props.getListUserWalletRequest();

        } else {
            this.setState({ refreshing: false });
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Get List User Wallet Request
            this.props.getListUserWalletRequest();

        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, _prevState) => {

        //Get All Updated Feild of Particular actions
        const { AcceptRejectWalletFetchData, AcceptRejectWalletData } = this.props;

        if (AcceptRejectWalletData !== prevProps.AcceptRejectWalletData) {

            //To Check Accept Reject Wallet Request Data 
            if (!AcceptRejectWalletFetchData) {
                try {
                    //Get Api STMSG
                    let stmsg = AcceptRejectWalletData.ReturnMsg;
                    if (validateResponseNew({ response: AcceptRejectWalletData, })) {
                        // on success responce Dispaly Message and  Refresh List
                        showAlert(R.strings.Success + '!', stmsg, 0, () => this.GetUsetWalletRequestList())
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
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
        if (AcceptRejectWalletRequest.oldProps !== props) {
            AcceptRejectWalletRequest.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { GetUserWalletRequestFetchData, GetUserWalletRequestData, } = props;

            //To Check List All Wallet
            if (!GetUserWalletRequestFetchData) {
                try {
                    if (validateResponseNew({ response: GetUserWalletRequestData, isList: true, })) {
                        //Check User Wallet List Response is Array or Not.
                        //if Not parse Response in Array and Store in State.
                        var resData = parseArray(GetUserWalletRequestData.Data);
                        return Object.assign({}, state, {
                            response: resData,
                            refreshing: false,
                        })
                    } else {
                        return Object.assign({}, state, {
                            refreshing: false,
                            response: []
                        })
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        refreshing: false,
                        response: []
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null;
    }

    //accept request api..
    onAccept = async (id) => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Accept Wallet Request
            this.props.walletRequestAction({ Status: 1, RequestId: id });
        }
    }

    //reject request api...
    onReject = async (id) => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Reject Wallet Request
            this.props.walletRequestAction({
                Status: 9,
                RequestId: id
            });
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { GetUserWalletRequestIsFetching, AcceptRejectWalletIsFetching } = this.props;

        //for final items from search input (validate on WalletName and RoleName)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => item.WalletName.toLowerCase().includes(this.state.searchInput.toLowerCase()) || item.RoleName.toLowerCase().includes(this.state.searchInput.toLowerCase()));

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.PendingRequests}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />

                {/* To Set ProgressDialog as per out theme */}
                <ProgressDialog isShow={AcceptRejectWalletIsFetching} />

                {/* To Check Response fetch or not if GetUserWalletRequestIsFetching = true then display progress bar else display List*/}
                {GetUserWalletRequestIsFetching && !this.state.refreshing ?
                    <ListLoader />
                    :
                    <View style={{ flex: 1 }}>

                        {finalItems.length ?

                            <View style={{ flex: 1 }}>

                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    /* render all item in list */
                                    renderItem={({ item, index }) => {
                                        return <FlatListItem
                                            index={index}
                                            item={item}
                                            onAccept={() => { this.onAccept(item.RequestId); }}
                                            onReject={() => { this.onReject(item.RequestId); }}
                                            size={this.state.response.length} />
                                    }}
                                    /* assign index as key valye to Accept Reject Wallet History list item */
                                    keyExtractor={(_item, index) => index.toString()}
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    /* For Refresh Functionality In Accept Reject Wallet History FlatList Item */
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
                            <ListEmptyComponent />
                        }
                    </View>
                }
            </SafeView>
        );
    }
}

// This Class is used for display record in list
export class FlatListItem extends Component {
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
        let { index, size, onAccept, onReject, item } = this.props;
        let color = R.colors.accent;
        if (item.OwnerApprovalStatus == 1) {
            color = R.colors.successGreen;
        }
        if (item.OwnerApprovalStatus == 9) {
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
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            {/* coin image  */}
                            <View style={{
                                width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight,
                                backgroundColor: R.colors.background, borderRadius: R.dimens.signup_screen_logo_height,
                            }}>
                                <ImageViewWidget url={item.WalletType ? item.WalletType : ''} /* style={{ borderRadius: R.dimens.paginationButtonRadious }} */ width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />
                            </View>
                            {/* Wallet */}
                            <View style={{ marginLeft: R.dimens.widgetMargin, flex: 1, flexDirection: 'column' }}>

                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontWeight: 'bold' }}> {item.WalletName ? item.WalletName : ''}</TextViewMR>

                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>
                                    <Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.FromEmail ? item.FromEmail : ''}</Text> {R.strings.JoinMessage} {item.RoleName ? item.RoleName : ''}
                                </TextViewHML>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.margin }}>
                            <StatusChip
                                color={color}
                                value={item.StrOwnerApprovalStatus ? item.StrOwnerApprovalStatus : '-'}></StatusChip>
                            <View>
                                {item.OwnerApprovalStatus == 0 ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <ImageButton
                                            style={
                                                {
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: R.colors.successGreen,
                                                    borderRadius: R.dimens.titleIconHeightWidth,
                                                    margin: 0,
                                                    padding: R.dimens.CardViewElivation,
                                                    marginRight: R.dimens.padding_left_right_margin,
                                                }}
                                            icon={R.images.IC_CHECKMARK}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                            onPress={onAccept} />
                                        <ImageButton
                                            style={
                                                {
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: R.colors.failRed,
                                                    borderRadius: R.dimens.titleIconHeightWidth,
                                                    margin: 0,
                                                    padding: R.dimens.CardViewElivation
                                                }}
                                            icon={R.images.IC_CANCEL}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                            onPress={onReject} />
                                    </View>
                                    : null}
                            </View>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //Updated List User Wallet Request
        GetUserWalletRequestFetchData: state.MyWalletReducer.GetUserWalletRequestFetchData,
        GetUserWalletRequestData: state.MyWalletReducer.GetUserWalletRequestData,
        GetUserWalletRequestIsFetching: state.MyWalletReducer.GetUserWalletRequestIsFetching,

        //Updated Accept Reject Request Data 
        AcceptRejectWalletFetchData: state.MyWalletReducer.AcceptRejectWalletFetchData,
        AcceptRejectWalletData: state.MyWalletReducer.AcceptRejectWalletData,
        AcceptRejectWalletIsFetching: state.MyWalletReducer.AcceptRejectWalletIsFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform List User Wallet Request
        getListUserWalletRequest: () => dispatch(getListUserWalletRequest()),
        //Perform Accept Reject Wallet Request List
        walletRequestAction: (acceptRejectWalletRequest) => dispatch(walletRequestAction(acceptRejectWalletRequest)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AcceptRejectWalletRequest)