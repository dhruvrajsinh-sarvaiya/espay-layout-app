// ArbitrageManageMarketListScreen.js
import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getArbiManageMarketList, updateArbiManageMarketList, clearArbiManageMarketListData } from '../../../actions/Arbitrage/ArbitrageManageMarketActions';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';

export class ArbitrageManageMarketListScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            row: [],
            // for Arbitrage Manage Market List
            ArbiManageMarketListResponse: [],
            ArbiManageMarketListState: null,
            // for get statusid and status value
            statusId: null,
            changedStatus: null,

            searchInput: '',

            refreshing: false,
            isFirstTime: true,
        }

    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()
        // for call manage market list api 
        this.callManageMarketApi()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearArbiManageMarketListData()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Call Get Arbitrage Manage Market List API
            this.props.getArbiManageMarketList();

        } else {
            this.setState({ refreshing: false });
        }
    }

    //api call
    callManageMarketApi = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Call Arbitrage Manage Market List Api
            this.props.getArbiManageMarketList()
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (ArbitrageManageMarketListScreen.oldProps !== props) {
            ArbitrageManageMarketListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ArbiManageMarketList, updatedArbiManageMarketList } = props.ManageMarketResult

            // Arbitrage Manage Market List is not null
            if (ArbiManageMarketList) {
                try {
                    if (state.ArbiManageMarketListState == null || (state.ArbiManageMarketListState !== null && ArbiManageMarketList !== state.ArbiManageMarketListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: ArbiManageMarketList, isList: true, })) {

                            return Object.assign({}, state, {
                                ArbiManageMarketListState: ArbiManageMarketList,
                                ArbiManageMarketListResponse: parseArray(ArbiManageMarketList.Response),
                                refreshing: false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                ArbiManageMarketListState: null,
                                ArbiManageMarketListResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ArbiManageMarketListState: null,
                        ArbiManageMarketListResponse: [],
                        refreshing: false,
                        row: [],
                    })
                }
            }

            //Check status Response 
            if (updatedArbiManageMarketList) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: updatedArbiManageMarketList, isList: true })) {
                        let res = state.ArbiManageMarketListResponse;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.ServiceID === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = state.changedStatus;
                        }

                        // Clear data
                        props.clearArbiManageMarketListData();
                        return {
                            ...state,
                            ArbiManageMarketListResponse: res,
                            statusId: null,
                            changedStatus: null
                        }
                    }
                    else {
                        // Clear data
                        props.clearArbiManageMarketListData();
                    }

                } catch (e) {
                    // Clear data
                    props.clearArbiManageMarketListData();
                }
            }
        }
        return null
    }

    updateFeature = async (item, status) => {
        //Check NetWork is Available or not
        if (await isInternet()) {
            let statusData = status === 'Active' ? 1 : 0;
            let Request = {
                ID: item.ID,
                CurrencyName: item.CurrencyName,
                Status: statusData,
                ServiceID: item.ServiceID
            }
            this.setState({ statusId: item.ServiceID, changedStatus: status })
            // call action for edit record
            this.props.updateArbiManageMarketList(Request);
        }
    }

    render() {
      
        // Loading status for Progress bar which is fetching from reducer
        let { ArbiManageMarketLoading, updatedArbiManageMarketLoading } = this.props.ManageMarketResult

        // For searching functionality
        let finalItems = this.state.ArbiManageMarketListResponse.filter(item => (
            item.CurrencyName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.CurrencyDesc.toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.arbitrageManageMarket}
                    nav={this.props.navigation}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => { this.props.navigation.navigate('ArbitrageAddNewCurrencyScreen', { onSuccess: this.callManageMarketApi }) }}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })} />

                <ProgressDialog isShow={updatedArbiManageMarketLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        (ArbiManageMarketLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => <ArbitrageManageMarketListItem
                                    index={index}
                                    item={item}
                                    size={finalItems.length}
                                    onUpdateFeature={() => {
                                        let data = this.state.ArbiManageMarketListResponse;
                                        let status = data[index].Status === 'Active' ? 'InActive' : 'Active'
                                        this.updateFeature(item, status)
                                    }}
                                />
                                }
                                // assign index as key value to Arbitrage Manage Marketlist item
                                keyExtractor={(_item, index) => index.toString()}
                                // For Refresh Functionality In Arbitrage Manage MarketFlatList Item
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
class ArbitrageManageMarketListItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { index, size } = this.props;
        let item = this.props.item;  let isEnable = item.Status === 'Active' ? true : false
        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,  marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1,  borderRadius: 0,  borderBottomLeftRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={
                            { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            {/* For show currency logo, CurrencyName, and CurrencyDesciption */}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <ImageViewWidget url={item.CurrencyName ? item.CurrencyName : ''}
                                    width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />
                                <TextViewHML style={{
                                    color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                    paddingLeft: R.dimens.widgetMargin
                                }}>{item.CurrencyName ? item.CurrencyName : '-'}</TextViewHML>
                                <TextViewHML style={{
                                    color: R.colors.textSecondary,
                                    fontSize: R.dimens.smallText
                                }}>{item.CurrencyDesc ? ' - ' + item.CurrencyDesc : '-'}</TextViewHML>
                            </View>

                            {/* Toggle switch for status */}
                            <FeatureSwitch
                                isToggle={isEnable}
                                onValueChange={() => this.props.onUpdateFeature(item)}
                                style={{
                                    backgroundColor: 'transparent',
                                    paddingBottom: R.dimens.widgetMargin,
                                    paddingTop: R.dimens.widgetMargin,
                                    paddingLeft: R.dimens.widgetMargin,
                                    paddingRight: R.dimens.widgetMargin,
                                }}
                            />

                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get Arbitrage Manage Market data from reducer
        ManageMarketResult: state.ArbitrageManageMarketReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Arbitrage Manage Market Action
    getArbiManageMarketList: (request) => dispatch(getArbiManageMarketList(request)),
    // Perform Update Arbitrage Manage Market Action
    updateArbiManageMarketList: (request) => dispatch(updateArbiManageMarketList(request)),
    // Clear Arbitrage Manage Market Data Action
    clearArbiManageMarketListData: () => dispatch(clearArbiManageMarketListData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageManageMarketListScreen)