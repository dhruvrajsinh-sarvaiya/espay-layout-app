import React, { Component } from 'react'
import { Text, View, RefreshControl, FlatList } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import { validateResponseNew, isInternet } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getArbitrageProviderList } from '../../../actions/PairListAction';
import { updateArbitrageServiceProvider } from '../../../actions/Arbitrage/ServiceProviderListAction';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';

export class ServiceProviderList extends Component {
    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            isFirstTime: true,
            statusId: null,
            changedStatus: null,
            ServiceProviderListState: null,
            UpdateServiceProviderListState: null,
        };
    }


    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        this.getArbitrageList();
    }

    //For Get Arbitrage list
    getArbitrageList = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Call Arbitrage Provider List Api
            this.props.getArbitrageProviderList()

        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Call Arbitrage Provider List Api
            this.props.getArbitrageProviderList()

        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    shouldComponentUpdate(nextProps, nextState) {
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
            };
        }

        // To Skip Render if old and new props are equal
        if (ServiceProviderList.oldProps !== props) {
            ServiceProviderList.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { ServiceProviderdata, UpdateServiceProviderdata } = props.ServiceProviderResult;

            //To Check Service Provider List Fetch Or Not
            if (ServiceProviderdata) {
                try {
                    //if local ServiceProviderList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ServiceProviderList == null || (state.ServiceProviderList !== null && ServiceProviderdata !== state.ServiceProviderList)) {

                        if (validateResponseNew({ response: ServiceProviderdata, isList: true })) {
                            var resData = parseArray(ServiceProviderdata.Response);
                            return Object.assign({}, state, {
                                ServiceProviderList: ServiceProviderdata,
                                response: resData,
                                refreshing: false,
                            })
                        }
                        else {
                            return Object.assign({}, state, {
                                ServiceProviderList: null,
                                refreshing: false,
                                response: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ServiceProviderList: null,
                        refreshing: false,
                        response: []
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }


            //To Check Updated Service Provider Response Fetch Or Not
            if (UpdateServiceProviderdata) {

                try {
                    //if local UpdateServiceProviderListState state is null or its not null and also different then new response then and only then validate response.
                    if (state.UpdateServiceProviderListState == null || (state.UpdateServiceProviderListState !== null && UpdateServiceProviderdata !== state.UpdateServiceProviderListState)) {

                        if (validateResponseNew({ response: UpdateServiceProviderdata, isList: false })) {

                            let res = state.response;

                            let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.Id === state.statusId);

                            //if index is >-1 then record is found 
                            if (findIndexOfChangeID > -1) {
                                res[findIndexOfChangeID].Status = state.changedStatus;
                                res[findIndexOfChangeID].statusText = state.changedStatus === 1 ? R.strings.Enable : R.strings.Disable;
                            }

                            return Object.assign({}, state, {
                                response: res,
                                statusId: null,
                                changedStatus: null
                            })
                        }
                        else {
                            return Object.assign({}, state, {
                                statusId: null,
                                changedStatus: null
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        statusId: null,
                        changedStatus: null
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null;
    }

    onChangeStatus = async (item) => {
        // Check internet is Available or not
        if (await isInternet()) {
            this.setState({ statusId: item.Id, changedStatus: item.Status === 1 ? 0 : 1 })

            let Request = {
                id: item.Id,
                ProviderName: item.ProviderName,
                status: item.Status === 1 ? 0 : 1, //if status is 1(enable) than status change 0(disbale)
            }

            //Call For Update Service Provider Status
            this.props.updateArbitrageServiceProvider(Request)
        }

    }

    // Render Right Side Menu For Add Service Provider Arbitrage
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageTextButton
                    icon={R.images.IC_PLUS}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.WidgetPadding, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.props.navigation.navigate('AddArbritageServiceProvider', { getArbitrageList: this.getArbitrageList })} />
            </View>
        )
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { ServiceProviderIsFetching, updateServiceProviderIsFetching } = this.props.ServiceProviderResult;

        //for final items from search input (validate on Provider Name)
        // For searching functionality
        let finalItems = this.state.response.filter(item => item.ProviderName.toLowerCase().includes(this.state.searchInput.toLowerCase()));

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To Set ProgressDialog as per our theme */}
                <ProgressDialog isShow={updateServiceProviderIsFetching} />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.ServiceProvider}
                    isBack={true}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                    rightMenuRenderChilds={this.rightMenuRender()}
                    nav={this.props.navigation}
                />

                {/* To Check Response fetch or not if LeaderBoardListisFetching = true then display progress bar else display List*/}
                {(ServiceProviderIsFetching && !this.state.refreshing) ?
                    <ListLoader />
                    :
                    <View style={{ flex: 1 }}>

                        {finalItems.length ?
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    /* render all item in list */
                                    renderItem={({ item, index }) =>
                                        <ServiceProviderListItem
                                            Items={item}
                                            providerListIndex={index}
                                            onChangeStatus={() => this.onChangeStatus(item)}
                                            providerListSize={this.state.response.length} />}
                                    /* assign index as key valye to LeaderBoard list item */
                                    keyExtractor={(item, index) => index.toString()}
                                    /* For Refresh Functionality In LeaderBoard FlatList Item */
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    } />
                            </View>
                            // Displayed empty component when no record found 
                            : !ServiceProviderIsFetching && <ListEmptyComponent />
                        }
                    </View>
                }
            </SafeView>
        );
    }
}

// This Class is used for display record in list
class ServiceProviderListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item &&
            this.props.onChangeStatus === nextProps.onChangeStatus) {
            return false
        }
        return true
    }

    render() {

        let item = this.props.Items;
        let { providerListIndex, providerListSize, } = this.props;

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (providerListIndex == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (providerListIndex == providerListSize - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                }}>

                    <CardView style={{
                        flex: 1,
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        {/* User Name and Up or Down Arrow */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold, }}>{item.ProviderName ? item.ProviderName : '-'}</Text>

                            <FeatureSwitch
                                isToggle={item.Status == 1 ? true : false}
                                onValueChange={this.props.onChangeStatus}
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
                </View >
            </AnimatableItem>
        )
    };
}

const mapStateToProps = (state) => {
    return {
        // get arbitrage exchange Configuration data from reducer
        ServiceProviderResult: state.ServiceProviderListReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Arbitrage Service Provider List Action
    getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),

    // Update Arbitrage Service Provider Action
    updateArbitrageServiceProvider: (request) => dispatch(updateArbitrageServiceProvider(request)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ServiceProviderList)