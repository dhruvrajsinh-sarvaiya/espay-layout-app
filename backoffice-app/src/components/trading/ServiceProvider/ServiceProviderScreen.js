import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { listServiceProvider, clearServiceProvider, updateServiceProvider } from '../../../actions/Trading/ServiceProviderActions';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../../components/Navigation';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import CardView from '../../../native_theme/components/CardView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import SafeView from '../../../native_theme/components/SafeView';

class ServiceProviderScreen extends Component {
    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            Response: [],
            search: '',
            refreshing: false,
            isFirstTime: true,
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //check for internet connection
        if (await isInternet()) {

            //call api to service provider list
            this.props.listServiceProvider();
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //Add this method to change theme based on stored theme name.
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {

            //call api to service provider list
            this.props.listServiceProvider();
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
        if (ServiceProviderScreen.oldProps !== props) {
            ServiceProviderScreen.oldProps = props;
        } else {
            return null;
        }

        //check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { listServiceProviderData, updateServiceProviderData } = props.Listdata;

            // check service provider data is available or not
            if (listServiceProviderData) {
                try {
                    //if local providerConfigurationList state is null or its not null and also different then new response then and only then validate response.
                    if (state.listServiceProviderData == null || (state.listServiceProviderData != null && listServiceProviderData !== state.listServiceProviderData)) {
                        if (validateResponseNew({ response: listServiceProviderData, isList: true })) {

                            //Get array from response
                            var serviceProviderResponse = parseArray(listServiceProviderData.Response);

                            //Set State For Api response 
                            return { ...state, listServiceProviderData, Response: serviceProviderResponse, refreshing: false };
                        } else {
                            //Set State For Api response 
                            return { ...state, listServiceProviderData, Response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return { ...state, Response: [], refreshing: false };
                }
            }

            // check for update data is available or not
            if (updateServiceProviderData) {
                try {
                    if (validateResponseNew({ response: updateServiceProviderData, isList: true })) {

                        let res = state.Response;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.Id === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = res[findIndexOfChangeID].Status == 1 ? 0 : 1;
                        }

                        // clear reducer
                        props.clearServiceProvider();

                        return { Response: res }
                    }
                } catch (e) {
                    //console.warn(e)
                }
            }
        }
        return null;
    }

    componentWillUnmount = () => {

        //clear reducer
        this.props.clearServiceProvider()
    };

    // for update status of selected service provider
    statusUpdate = async (item) => {

        this.setState({ statusId: item.Id })

        //check for internet connection
        if (await isInternet()) {

            //To update status value 
            let request = {
                Id: item.Id,
                ProviderName: item.ProviderName,
                Status: item.Status == 0 ? 1 : 0,
            }

            //call api for update service provider status
            this.props.updateServiceProvider(request);
        }
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading, loadingUpdate } = this.props.Listdata;

        //for final items from search input (validate on ProviderName)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.Response;
        finalItems = finalItems.filter(item => item.ProviderName.toLowerCase().includes(this.state.search.toLowerCase()));

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Service_Provider}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('ServiceProviderAddScreen', { onRefresh: this.onRefresh })}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loadingUpdate} />

                <View style={{ flex: 1 }}>

                    {/* List Items */}
                    {
                        loading && !this.state.refreshing ?
                            <ListLoader />
                            :
                            finalItems.length > 0 ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    renderItem={({ item, index }) =>
                                        <ProviderListItem
                                            index={index}
                                            item={item}
                                            onUpdateFeature={() => this.statusUpdate(item)}
                                            size={this.state.Response.length} />
                                    }
                                    keyExtractor={(item, index) => index.toString()}
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => this.onRefresh(true, true)}
                                        />
                                    }
                                />
                                :
                                <ListEmptyComponent module={R.strings.Add + ' ' + R.strings.Service_Provider}
                                    onPress={() => this.props.navigation.navigate('ServiceProviderAddScreen', { onRefresh: this.onRefresh })} />
                    }
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class ProviderListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item !== nextProps.item || this.props.onUpdateFeature !== nextProps.onUpdateFeature) {
            return true
        }
        return false
    }

    render() {

        // Get required fields from props
        let item = this.props.item;
        let { index, size, onUpdateFeature } = this.props;

        return (
            // Flatlist item item
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
                        flex: 1, borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            {/* for show ProviderName  */}
                            <View style={{ alignItems: 'center', alignContent: 'center' }}>
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.ProviderName === "" ? " - " : item.ProviderName}</TextViewMR>
                            </View>

                            {/* for show status */}
                            <View style={{ alignItems: 'flex-start' }}>
                                <FeatureSwitch
                                    isToggle={item.Status == 1 ? true : false}
                                    onValueChange={onUpdateFeature}
                                    style={{
                                        backgroundColor: 'transparent',
                                        paddingBottom: R.dimens.widgetMargin,
                                        paddingTop: R.dimens.widgetMargin,
                                        paddingLeft: R.dimens.WidgetPadding,
                                        paddingRight: R.dimens.WidgetPadding,
                                    }}
                                    textStyle={{ marginTop: R.dimens.widgetMargin, color: R.colors.textPrimary, fontSize: R.dimens.smallText }}
                                />
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated Data service provider
        Listdata: state.ServiceProviderConfigReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //action provider list
        listServiceProvider: () => dispatch(listServiceProvider()),

        // action for update status of service provier
        updateServiceProvider: (request) => dispatch(updateServiceProvider(request)),

        // action for clear reducer of service provider
        clearServiceProvider: () => dispatch(clearServiceProvider()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ServiceProviderScreen);