// ManageMarket
import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { GetMarketList, EditManageMarketData, editManageMarketDataClear, clearAllTradingMarketData } from '../../../actions/Trading/ManageMarketAction';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';
import CardView from '../../../native_theme/components/CardView';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ManageMarket extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
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

            //call api for marketlist data fetch
            this.props.GetMarketList()
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Api for get Marketlistdata
            this.props.GetMarketList()
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
        if (ManageMarket.oldProps !== props) {
            ManageMarket.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            const { MarketlistDataget, MarketlistdataFetch, EditMarketlistdata, EditedMarketlistdata } = props;

            if (!MarketlistdataFetch) {
                try {
                    if (validateResponseNew({ response: MarketlistDataget, isList: true })) {
                        //Get array from response
                        var res = parseArray(MarketlistDataget.Response);

                        //Set State For Api response 
                        return { ...state, data: res, refreshing: false, }
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
                        let resItem = state.data;
                        let findIndexOfChangeID = state.statusId == null ? -1 : resItem.findIndex(el => el.ServiceID === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            resItem[findIndexOfChangeID].Status = state.changedStatus;
                        }

                        props.editManageMarketDataClear();
                        return {
                            ...state,
                            data: resItem,
                            statusId: null,
                            changedStatus: null
                        }
                    }
                    else {
                        props.editManageMarketDataClear();
                    }

                } catch (e) {
                    props.editManageMarketDataClear();
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
                ServiceID: item.ServiceID
            }
            this.setState({ statusId: item.ServiceID, changedStatus: status })

            // call EditManageMarketData api
            this.props.EditManageMarketData(RequestEditmarketCurrency);
        }
    }

    componentWillUnmount = () => {
        // for clear reducer data
        this.props.clearAllTradingMarketData()
    };

    render() {

        const { isMarketlistFetch, isEditMarketlist } = this.props;

        // for search record using currencyname
        let finalItems = this.state.data.filter(item => (item.CurrencyDesc != null && item.CurrencyDesc.toLowerCase().includes(this.state.search.toLowerCase())));

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.manageMarkets}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('ManageMarketAddEdit')}
                />

                {/* ProgressDialog  */}
                <ProgressDialog isShow={isEditMarketlist} />

                <View style={{ flex: 1 }}>
                    {/* display listloader till data is not populated*/}
                    {isMarketlistFetch && !this.state.refreshing ?
                        <ListLoader />
                        :
                        finalItems.length > 0
                            ?
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) =>
                                    <ManageMarketItem
                                        item={item}
                                        index={index}
                                        size={this.state.data.length}
                                        onUpdateFeature={() => {
                                            let data = this.state.data;
                                            let status = data[index].Status === 'Active' ? 'InActive' : 'Active'
                                            this.updateFeature(item, status)
                                        }}
                                    />
                                }
                                keyExtractor={item => item.ID.toString()}
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}
                            />
                            :
                            <ListEmptyComponent module={R.strings.AddNewCurrency} onPress={() => this.props.navigation.navigate('ManageMarketAddEdit')} />
                    }
                </View>
            </SafeView>
        )
    }
    styles = () => {
        return {
            headerContainer: {
                flexDirection: "row",
                backgroundColor: R.colors.background,
                paddingTop: R.dimens.widgetMargin,
                paddingLeft: R.dimens.WidgetPadding,
                paddingRight: R.dimens.WidgetPadding,
                paddingBottom: R.dimens.widgetMargin
            },
        }
    }
}

// This Class is used for display record in list
class ManageMarketItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let item = this.props.item;
        let { index, size } = this.props;
        let isEnable = item.Status === 'Active' ? true : false
        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>

                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            {/* for show currency logo, Currency Name and Currency desc */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <ImageViewWidget url={item.CurrencyName ? item.CurrencyName : ''} width={R.dimens.IconWidthHeight}
                                    height={R.dimens.IconWidthHeight} />
                                <TextViewHML style={{
                                    color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                    paddingLeft: R.dimens.widgetMargin
                                }}>{item.CurrencyName ? item.CurrencyName : '-'}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>
                                    {item.CurrencyDesc ? ' - ' + item.CurrencyDesc : '-'}</TextViewHML>
                            </View>

                            {/* toggle switch for update status */}
                            <FeatureSwitch
                                isToggle={isEnable}
                                onValueChange={() => this.props.onUpdateFeature(item)}
                                style={{
                                    //justifyContent: 'flex-end',
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
    //Updated manageMarketReducer Data 
    return {
        isMarketlistFetch: state.manageMarketReducer.isMarketlistFetch,
        MarketlistDataget: state.manageMarketReducer.MarketlistDataget,
        MarketlistdataFetch: state.manageMarketReducer.MarketlistdataFetch,
        isEditMarketlist: state.manageMarketReducer.isEditMarketlist,
        EditMarketlistdata: state.manageMarketReducer.EditMarketlistdata,
        EditedMarketlistdata: state.manageMarketReducer.EditedMarketlistdata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // call action for get marketlist
        GetMarketList: () => dispatch(GetMarketList()),
        // call action for Edit record in market, than call action for clear Edited data from reducer
        EditManageMarketData: (RequestEditmarketCurrency) => dispatch(EditManageMarketData(RequestEditmarketCurrency)),
        // call action for clear Edited data from reducer
        editManageMarketDataClear: () => dispatch(editManageMarketDataClear()),
        // call action to clear all reducer data
        clearAllTradingMarketData: () => dispatch(clearAllTradingMarketData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageMarket)