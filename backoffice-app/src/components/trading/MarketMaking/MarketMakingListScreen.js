// MarketMakingListScreen.js
import React, { Component } from 'react'
import { View, FlatList, RefreshControl, } from 'react-native'
import { changeTheme, parseArray, convertTime, convertDate, } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, validateValue, } from '../../../validations/CommonValidation';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getMarketMakingList, changeMarketMakingStatus, clearMarkeMakingData } from '../../../actions/Trading/MarketMakingActions'
import StatusChip from '../../widget/StatusChip';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';

export class MarketMakingListScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            // for Market Making List
            MarketMakingListResponse: [],
            MarketMakingListState: null,
            searchInput: '',
            statusId: null,
            changedStatus: null,
            refreshing: false,
            isFirstTime: true,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Call Market Making List Api
            this.props.getMarketMakingList()
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //For stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearMarkeMakingData()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Call Get Market Making List API
            this.props.getMarketMakingList();

        } else {
            this.setState({ refreshing: false });
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (MarketMakingListScreen.oldProps !== props) {
            MarketMakingListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { MarketMakingList, changeStatusData } = props.MarketMakingResult

            // MarketMakingList is not null
            if (MarketMakingList) {
                try {
                    if (state.MarketMakingListState == null || (state.MarketMakingListState !== null && MarketMakingList !== state.MarketMakingListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: MarketMakingList, isList: true, })) {

                            return Object.assign({}, state, {
                                MarketMakingListState: MarketMakingList,
                                MarketMakingListResponse: parseArray(MarketMakingList.Data),
                                refreshing: false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                MarketMakingListState: null,
                                MarketMakingListResponse: [],
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        MarketMakingListState: null,
                        MarketMakingListResponse: [],
                        refreshing: false,
                    })
                }
            }

            //Check enable status Response 
            if (changeStatusData) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: changeStatusData, isList: true })) {
                        let res = state.MarketMakingListResponse;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.Id === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = state.changedStatus;
                        }

                        props.clearMarkeMakingData()
                        return {
                            ...state,
                            MarketMakingListResponse: res,
                            statusId: null,
                            changedStatus: null
                        }
                    }
                    else {
                        props.clearMarkeMakingData()
                    }

                } catch (e) {
                    props.clearMarkeMakingData()
                }
            }
        }
        return null
    }

    onUpdateStatus = async (item, isDelete) => {

        let status
        //if status is inactive=0 than set status call for active 
        if (item.Status == 0) {
            //if status is inactive=0 and delete than call for delete
            if (isDelete) {
                status = 9
            }
            else {
                status = 1
            }
        }

        //if status is active=1 than set status call for inactive 
        else if (item.Status == 1) {
            //if status is active=0 and delete than call for delete
            if (isDelete) {
                status = 9
            }
            else {
                status = 0
            }
        }

        //if status is delete=9 than set status call for inactive 
        else if (item.Status == 9) {
            if (isDelete) {
                status = 0
            }
            else {
                status = 1
            }
        }

        // check Network is Available or not
        if (await isInternet()) {
            // Bind Request forchange  detail status
            let request = {
                Id: item.Id,
                Status: status
            }

            this.setState({ statusId: item.Id, changedStatus: status })
            // call api for change status of Market Making
            this.props.changeMarketMakingStatus(request);
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { MarketMakingLoading, changeStatusLoading } = this.props.MarketMakingResult

        // For searching
        let finalItems = this.state.MarketMakingListResponse.filter(item => (
            item.Name.toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.marketMakingList}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })} />

                {/* To set ProgressDialog as per our theme */}
                <ProgressDialog isShow={changeStatusLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        (MarketMakingLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => <MarketMakingListItem
                                    index={index}
                                    item={item}
                                    size={finalItems.length}
                                    onStatusChange={() => this.onUpdateStatus(item, false)}
                                    onDeleteStatusChange={() => this.onUpdateStatus(item, true)}
                                />
                                }
                                // assign index as key value to Market Making list item
                                keyExtractor={(_item, index) => index.toString()}
                                // For Refresh Functionality In Market Making FlatList Item
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />
                                }
                                contentContainerStyle={contentContainerStyle(finalItems)}
                                // Displayed empty component when no record found 
                                ListEmptyComponent={<ListEmptyComponent />}
                            />
                    }

                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class MarketMakingListItem extends Component {

    constructor(props) {
        super(props);
    }

    // shouldComponentUpdate(nextProps) {
    //     //Check If Old Props and New Props are Equal then Return False
    //     if (this.props.item === nextProps.item)
    //         return false
    //     return true
    // }

    render() {
        let { size, index, item, } = this.props
        // Status
        let StatusText = '';
        let statusColor = '';
        let icon = R.images.IC_CHECKMARK
        let color = R.colors.failRed
        let delIcon = R.images.IC_DELETE
        let delColor = R.colors.failRed

        if (item.Status == 0) {
            icon = R.images.IC_CHECKMARK
            color = R.colors.successGreen

            delIcon = R.images.IC_DELETE
            delColor = R.colors.failRed

            StatusText = R.strings.inActive
            statusColor = R.colors.yellow
        }
        if (item.Status == 1) {
            icon = R.images.IC_CANCEL
            color = R.colors.yellow

            delIcon = R.images.IC_DELETE
            delColor = R.colors.failRed

            StatusText = R.strings.active
            statusColor = R.colors.successGreen
        }
        if (item.Status == 9) {
            icon = R.images.IC_CHECKMARK
            color = R.colors.successGreen

            delIcon = R.images.IC_CANCEL
            delColor = R.colors.yellow

            StatusText = R.strings.Delete
            statusColor = R.colors.failRed
        }

        return (
            // flatlist item animation

            <AnimatableItem>

                <View
                    style={{
                        marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginLeft: R.dimens.widget_left_right_margin,
                        flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginRight: R.dimens.widget_left_right_margin
                    }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
                        borderRadius: 0,
                        flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                    }} >

                        {/* for show Name , status change  */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <TextViewHML style={{
                                color: R.colors.textPrimary, fontSize: R.dimens.mediumText,
                                paddingLeft: R.dimens.widgetMargin
                            }}>{validateValue(item.Name)}</TextViewHML>
                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    style={
                                        {
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: color,
                                            borderRadius: R.dimens.titleIconHeightWidth,
                                            margin: 0,
                                            padding: R.dimens.CardViewElivation,
                                            marginRight: item.Status == 9 ? 0 : R.dimens.margin,
                                        }}
                                    icon={icon}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    onPress={this.props.onStatusChange}
                                />
                                {item.Status == 9 ? null : <ImageTextButton
                                    style={
                                        {
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: delColor,
                                            borderRadius: R.dimens.titleIconHeightWidth,
                                            margin: 0,
                                            padding: R.dimens.CardViewElivation
                                        }}
                                    icon={delIcon}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    onPress={this.props.onDeleteStatusChange}
                                />}

                            </View>
                        </View>

                        {/* for show status , delete time */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <StatusChip
                                    color={statusColor}
                                    value={StatusText} />
                            </View>
                            <ImageTextButton style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                icon={R.images.IC_TIMER}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate) : '-'}</TextViewHML>
                        </View>
                        
                    </CardView>
                </View>

            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get Market Making data from reducer
        MarketMakingResult: state.MarketMakingReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Market Making Action
    getMarketMakingList: () => dispatch(getMarketMakingList()),
    // for change status
    changeMarketMakingStatus: (request) => dispatch(changeMarketMakingStatus(request)),
    // Clear Market Making Data Action
    clearMarkeMakingData: () => dispatch(clearMarkeMakingData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketMakingListScreen)