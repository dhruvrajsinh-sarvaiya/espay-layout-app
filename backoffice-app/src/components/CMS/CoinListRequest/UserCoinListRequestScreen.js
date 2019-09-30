// UserCoinListRequestScreen.js
import React, { Component } from 'react'
import { View, FlatList, RefreshControl, Text } from 'react-native'
import { changeTheme, parseArray, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { connect } from 'react-redux';
import { getUserCoinListRequestData, clearUserCoinListRequest } from '../../../actions/CMS/UserCoinListRequestActions';
import { validateResponseNew, isInternet, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';

export class UserCoinListRequestScreen extends Component {
    constructor(props) {
        super(props)

        // Define all initial state
        this.state = {
            UserCoinListRequestState: null,
            UserCoinListRequestResponse: [],

            searchInput: '',
            refreshing: false,
            isFirstTime: true,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        // check internet connection
        if (await isInternet()) {
            // Call User Coin List Request
            this.props.getUserCoinListRequestData()
        }
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Call Get User Coin List Request List API
            this.props.getUserCoinListRequestData()

        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount = () => {
        // for clear reducer data
        this.props.clearUserCoinListRequest()
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (UserCoinListRequestScreen.oldProps !== props) {
            UserCoinListRequestScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { UserCoinListRequest, } = props.UserCoinListRequestResult
            // UserCoinListRequest is not null
            if (UserCoinListRequest) {
                try {
                    if (state.UserCoinListRequestState == null || (UserCoinListRequest !== state.UserCoinListRequestState)) {
                        // { response: {}, statusCode: null, returnCode: UserCoinListRequest.responseCode, errorCode: null, returnMessage: null, isList: false, enableLog: false }
                        //succcess response fill the list 
                        if (validateResponseNew({ response: UserCoinListRequest, returnCode: UserCoinListRequest.responseCode, isList: true, })) {
                            let res = parseArray(UserCoinListRequest.data)
                            return Object.assign({}, state, {
                                UserCoinListRequestState: UserCoinListRequest,
                                UserCoinListRequestResponse: res,
                                refreshing: false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                UserCoinListRequestState: null,
                                UserCoinListRequestResponse: [],
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        UserCoinListRequestState: null,
                        UserCoinListRequestResponse: [],
                        refreshing: false,
                    })
                }
            }
        }
        return null
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { UserCoinListRequestLoading } = this.props.UserCoinListRequestResult

        //for search
        let finalItems = this.state.UserCoinListRequestResponse.filter(item => (
            item.userId.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.coin_name.toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.userCoinListRequest}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        (UserCoinListRequestLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => <UserCoinListRequestItem
                                item={item}
                                index={index}
                                    size={finalItems.length}
                                    onPress={() => this.props.navigation.navigate('UserCoinListDetailsScreen', { item })}
                                />}
                                // assign index as key value to User Coin List Request list item
                                keyExtractor={(_item, index) => index.toString()}
                                // For Refresh Functionality In User Coin List Request FlatList Item
                                refreshControl={  <RefreshControl
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    colors={[R.colors.accent]}
                                        onRefresh={this.onRefresh}
                                    />
                                }
                                contentContainerStyle={contentContainerStyle(finalItems)}
                                // Displayed empty component when no record found 
                                ListEmptyComponent= {<ListEmptyComponent />}
                            />
                    }
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class UserCoinListRequestItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let { size,  index, item,  onPress } = this.props

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{  flex: 1,  marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                    }} onPress={onPress}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {/* Currency Image */}
                            <ImageViewWidget url={item.coin_name ? item.coin_name : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                {/* for show userId */}
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{
                                        color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                        fontFamily: Fonts.MontserratSemiBold,
                                    }}>{validateValue(item.userId)}</Text>
                                    <ImageTextButton
                                        icon={R.images.RIGHT_ARROW_DOUBLE}
                                        style={{ padding: 0, margin: 0, }}
                                        iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                        onPress={onPress}
                                    />
                                </View>
                                {/* for show CoinName */}
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.coinName + ' : '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.coin_name)}</TextViewHML>
                                </View>
                            </View>
                        </View>

                        {/* for show date time */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.date_created ? convertDateTime(item.date_created) : '-'}</TextViewHML>
                        </View>

                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get User Coin List Request data from reducer
        UserCoinListRequestResult: state.UserCoinListRequestReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform User Coin List Request Action
    getUserCoinListRequestData: () => dispatch(getUserCoinListRequestData()),
    // Clear User Coin List Request Action
    clearUserCoinListRequest: () => dispatch(clearUserCoinListRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserCoinListRequestScreen)