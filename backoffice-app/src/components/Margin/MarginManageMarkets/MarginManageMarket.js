// MarginManageMarket
import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import {
    GetMarginMarketList, EditMarginManageMarketData, editMarginManageMarketDataClear, clearAllMarginMarketData
} from '../../../actions/Margin/MarginManageMarketAction';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';
import CardView from '../../../native_theme/components/CardView';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class MarginManageMarket extends Component {

    constructor(props) {
        super(props);

        // Define all initial state
        this.state = {
            data: [],/* for store data from the responce */
            search: '',/* for search value for data */
            refreshing: false,/* for refresh data */
            isFirstTime: true,
            statusId: null,
            changedStatus: null,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //  call api for market list data fetch
            this.props.GetMarginMarketList()
        } else {
            this.setState({ refreshing: false });
        }
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
            //Call Api for get Market list data
            this.props.GetMarginMarketList()
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
            };
        }

        // To Skip Render if old and new props are equal
        if (MarginManageMarket.oldProps !== props) {
            MarginManageMarket.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            const { MarketlistDataget, MarketlistdataFetch, EditMarketlistdata, EditedMarketlistdata } = props;

            if (!MarketlistdataFetch) {
                try {
                    if (validateResponseNew({ response: MarketlistDataget, isList: true })) {
                        //Get array from response
                        var listResponse = parseArray(MarketlistDataget.Response);

                        //Set State For Api response 
                        return { ...state, data: listResponse, refreshing: false, }
                    }
                    else {
                        return { ...state, refreshing: false, data: [] };
                    }
                } catch (e) {
                    return { ...state, refreshing: false, data: [] };
                }
            }

            //Check status Response 
            if (!EditedMarketlistdata) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: EditMarketlistdata, isList: true })) {
                        let res = state.data;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.ServiceID === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = state.changedStatus;
                        }

                        props.editMarginManageMarketDataClear();
                        return {
                            ...state,
                            data: res,
                            statusId: null,
                            changedStatus: null
                        }
                    }
                    else {
                        props.editMarginManageMarketDataClear();
                    }

                } catch (e) {
                    props.editMarginManageMarketDataClear();
                }
            }
        }
        return null;
    }

    updateFeature = async (item, status) => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            let statusData = status === 'Active' ? 1 : 0;
            let RequestEditmarketCurrency = {
                ID: item.ID,
                CurrencyName: item.CurrencyName,
                Status: statusData,
                ServiceID: item.ServiceID,
                IsMargin: 1
            }
            this.setState({ statusId: item.ServiceID, changedStatus: status })
            // call action for edit record
            this.props.EditMarginManageMarketData(RequestEditmarketCurrency);
        }
    }

    componentWillUnmount = () => {
        // for clear reducer data
        this.props.clearAllMarginMarketData();
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { isMarketlistFetch, isEditMarketlist } = this.props;

        // for search record using currencyname
        let finalItems = this.state.data.filter(
            item => (item.CurrencyDesc.toLowerCase().includes(this.state.search.toLowerCase())));

        return (
            <SafeView style={
                { flex: 1, backgroundColor: R.colors.background, }}>


                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    onRightMenuPress={() => this.props.navigation.navigate('MarginManageMarketAdd')}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    title={R.strings.manageMarkets}
                    nav={this.props.navigation}
                    searchable={true}
                    isBack={true}
                />

                {/* To set ProgressDialog as per our theme */}

                <ProgressDialog
                    isShow={isEditMarketlist} />

                <View style={
                    { flex: 1 }}>

                    {/* display listloader till data is not populated*/}
                    {isMarketlistFetch
                        && !this.state.refreshing ?
                        <ListLoader /> :
                        finalItems.length > 0
                            ? <FlatList
                                showsVerticalScrollIndicator={false}
                                data={finalItems}

                                // render all item in list
                                renderItem={({ item, index }) =>
                                    <MarginManageMarketItem
                                        size={this.state.data.length}
                                        onUpdateFeature={() => {
                                            let data = this.state.data;
                                            let status = data[index].Status === 'Active' ? 'InActive' : 'Active'
                                            this.updateFeature(item, status)
                                        }}
                                        index={index}
                                        item={item}
                                    />
                                }
                                // assign index as key value to list item
                                keyExtractor={item => item.ID.toString()}
                                // Refresh functionality in list
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        progressBackgroundColor={R.colors.background}
                                        onRefresh={this.onRefresh}
                                        colors={[R.colors.accent]}
                                    />}
                            /> :
                            // Displayed empty component when no record found 
                            <ListEmptyComponent />
                    }
                </View>

            </SafeView>
        )
    }
}

// This Class is used for display record in list
class MarginManageMarketItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item !== nextProps.item || this.props.onUpdateFeature !== nextProps.onUpdateFeature)
            return true
        return false
    }

    render() {
        let { index, size, item } = this.props;
        let isEnable = item.Status === 'Active' ? true : false
        return (
            // Flatlist item animation
            <AnimatableItem>

                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                }}>

                    <CardView style={{
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>

                            {/* Display Currency image, name and desc */}
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <ImageViewWidget url={item.CurrencyName ? item.CurrencyName : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, paddingLeft: R.dimens.widgetMargin }}>{item.CurrencyName ? item.CurrencyName : '-'}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{item.CurrencyDesc ? ' - ' + item.CurrencyDesc : '-'}</TextViewHML>
                            </View>

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

function mapStateToProps(state) {
    return {
        //for get marketlist data
        isMarketlistFetch: state.MarginManageMarketReducer.isMarketlistFetch,
        MarketlistDataget: state.MarginManageMarketReducer.MarketlistDataget,
        MarketlistdataFetch: state.MarginManageMarketReducer.MarketlistdataFetch,

        // for edit marketlist
        isEditMarketlist: state.MarginManageMarketReducer.isEditMarketlist,
        EditMarketlistdata: state.MarginManageMarketReducer.EditMarketlistdata,
        EditedMarketlistdata: state.MarginManageMarketReducer.EditedMarketlistdata,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        // call action for get marketlist
        GetMarginMarketList: () => dispatch(GetMarginMarketList()),
        // call action for Edit record in market
        EditMarginManageMarketData: (RequestEditmarketCurrency) => dispatch(EditMarginManageMarketData(RequestEditmarketCurrency)),
        //  call action for clear Edited data from reducer
        editMarginManageMarketDataClear: () => dispatch(editMarginManageMarketDataClear()),
        // for clear all reducer data
        clearAllMarginMarketData: () => dispatch(clearAllMarginMarketData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarginManageMarket)