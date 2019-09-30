import React, { Component } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Easing,
} from 'react-native';
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { connect } from 'react-redux';
import { countriesFatchData, countriesDeleteData, getFilterCountries, clearDelete, clearCountrisData } from '../../actions/CMS/CountriesAction'
import { changeTheme, showAlert, parseArray, addPages } from '../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../components/Navigation';
import PaginationWidget from '../../components/widget/PaginationWidget';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import FilterWidget from '../../components/widget/FilterWidget';
import CommonToast from '../../native_theme/components/CommonToast';
import Drawer from 'react-native-drawer-menu';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import ImageButton from '../../native_theme/components/ImageTextButton';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import StatusChip from '../widget/StatusChip';

class CountriesScreen extends Component {

    constructor(props) {
        super(props);
        //Define All State initial state
        this.drawer = React.createRef();
        this.state = {
            refreshing: false,
            searchInput: '',
            row: [],
            totalPage: 2,
            selectedPage: 1,
            paginationBit: true,
            response: [],
            filterList: [],
            spinnerStatusData: [{ value: R.strings.select_status }, { value: 'Active' }, { value: 'Inactive' }],
            selectedStatus: '',
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        }
        //----------
        //bind all methods
        this.onBackPress = this.onBackPress.bind(this);
    
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Fetch News API
            this.props.countriesFatchData();
            //----------
        }
        //--------------
    }

    componentWillUnmount() {
        //clear countris data
        this.props.clearCountrisData();
        //-----
    }

    componentDidUpdate = async (prevProps, prevState) => {
        //for fetch countries API
        const { countriesDeleteResponse } = this.props.appData;

        if (countriesDeleteResponse !== prevProps.appData.countriesDeleteResponse) {
            if (countriesDeleteResponse) {
                try {
                    //handle response of API
                    if (validateResponseNew({ response: countriesDeleteResponse, isList: false })) {
                        showAlert(R.strings.status, countriesDeleteResponse.ReturnMsg, 0, () => {
                            this.props.clearDelete()

                            //Call Get countries API
                            this.props.countriesFatchData();
                            //----------
                        });
                    }
                } catch (e) {
                }
            }
        }
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
        if (CountriesScreen.oldProps !== props) {
            CountriesScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch countries API
            const { countriesResponse } = props.appData;

            //check fetch Contries API response.
            if (countriesResponse) {
                try {
                    if (state.countriesResponse == null || (state.countriesResponse != null && countriesResponse !== state.countriesResponse)) {
                        //handle response of API
                        if (validateResponseNew({ response: countriesResponse, isList: true })) {
                            //check News Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            var res = parseArray(countriesResponse.countriesData)

                            return {
                                ...state,
                                response: res,
                                refreshing: false,
                                row: addPages(20),
                                countriesResponse
                            }
                        } else {
                            return {
                                response: [],
                                refreshing: false
                            }
                        }
                    }
                } catch (e) {
                    return {
                        response: [],
                        refreshing: false
                    }
                }
            }
        }
        return null;
    }

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {

            //Call Get countries API
            this.props.countriesFatchData();
            //----------
        }
        else {
            this.setState({ refreshing: false });
        }
        //--------------
    }
    //-----------

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {
        this.setState({ selectedPage: pageNo });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Fetch countries API
            this.props.countriesFatchData();
            //----------
        }
        else {
            this.setState({ refreshing: false });
            //Show Network Error Alert Dialog
            //showAlert(R.strings.status, R.strings.NETWORK_MESSAGE);
        }
        //--------------
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    _onRemoveCountries = (index, item) => {
        //console.warn(JSON.stringify(item))
        if (item) {
            this.props.countriesDeleteData();
        }
    }

    /* Reset Filter */
    _onResetPress = async () => {
        this.setState({
            searchInput: '',
            selectedStatus: this.state.spinnerStatusData[0].value,
        })

        /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Fetch News API
            this.props.countriesFatchData();
            //----------
        }
        //--------------
    }

    /* Api Call when press on complete button */
    onCompletePress = async () => {

        if (this.state.selectedStatus === R.strings.select_status) {
            this.refs.Toast.Show(R.strings.select_status);
        }
        else {
            /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
            this.drawer.closeDrawer();

            // call API For filteration
            //Check NetWork is Available or not
            if (await isInternet()) {
                //Call Fetch Report Info API
                let requeset = {
                    status: this.state.selectedStatus,
                }
                this.props.getFilterCountries(requeset);
                //----------
            }
            //--------------
            //If Filter from Complete Button make search imput empty
            this.setState({ searchInput: '' })
        }
    }

    // Render Right Side Menu For Add New Pattern , Filters , etc Functionality in history of Fee And Limit Pattern 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageButton
                    icon={R.images.IC_PLUS}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.props.navigation.navigate('CountriesAddScreen', { onRefresh: this.onRefresh })} />

                <ImageButton
                    iconStyle={[{
                        height: R.dimens.SMALL_MENU_ICON_SIZE,
                        width: R.dimens.SMALL_MENU_ICON_SIZE,
                        tintColor: R.colors.textSecondary
                    }]}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    icon={R.images.FILTER}
                    onPress={() => this.drawer.openDrawer()} />
            </View>
        )
    }

    /* Drawer Navigation */
    navigationDrawer() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: R.colors.background
            }}>
                {/* For Toast */}
                <CommonToast ref="Toast" styles={{ width: R.dimens.FilterDrawarWidth }} />
                <FilterWidget
                    onResetPress={this._onResetPress}
                    onCompletePress={this.onCompletePress}
                    firstPicker={{
                        title: R.strings.select_status,
                        array: this.state.spinnerStatusData,
                        selectedValue: this.state.selectedStatus,
                        onPickerSelect: (item) => this.setState({ selectedStatus: item })
                    }}
                />
            </View>
        )
    }

    render() {
        let { loading, deleteLoading } = this.props.appData

        let finalItems = this.state.response
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item =>
                item.countryName.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            //DrawerLayout for Countries Screen
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>
                <View style={{ flex: 1, backgroundColor: R.colors.background }}>
                    <CommonStatusBar />
                    <ProgressDialog isShow={deleteLoading} />
                    <CustomToolbar
                        title={R.strings.countries}
                        isBack={true}
                        searchable={true}
                        onSearchText={(input) => this.setState({ searchInput: input })}
                        rightMenuRenderChilds={this.rightMenuRender()}
                        nav={this.props.navigation}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {/* To Check Response fetch or not if WithdrawHistoryisFetching = true then display progress bar else display List*/}
                        {loading && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>

                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ index, item }) => <CountryItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                _onEditCountries={() => this.props.navigation.navigate('CountriesAddScreen', { ITEM: item, onRefresh: this.onRefresh })}
                                                _onRemoveCountries={() => this._onRemoveCountries(index, item)}
                                            />
                                            }
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={() => this.onRefresh(true, true)}
                                                />
                                            }
                                            keyExtractor={item => item.id.toString()}
                                        />
                                    </View> : !loading && <ListEmptyComponent module={R.strings.add_new_country} onPress={() => this.props.navigation.navigate('CountriesAddScreen', { onRefresh: this.onRefresh })} />
                                }
                            </View>
                        }
                        <View>
                            {/*To Set Pagination View  */}
                            {
                                finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </View>
            </ Drawer>

        );
    }
}

class CountryItem extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps) {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }
    _onDelete = () => {
        showAlert(
            R.strings.alert,
            R.strings.delete_message,
            3,
            () => { this.props._onRemoveCountries(this.props.id) },
            R.strings.cancel,
            () => { }
        )
    }
    render() {
        let item = this.props.item;
        let { size, index } = this.props;

        return (
            <View style={{
                marginLeft: R.dimens.widget_left_right_margin, flex: 1,
                marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                marginRight: R.dimens.widget_left_right_margin,
                flexDirection: 'column', marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
            }}>
                <CardView style={{
                    borderTopRightRadius: R.dimens.margin,
                    flexDirection: 'column',   
                    flex: 1, borderRadius: 0,borderBottomLeftRadius: R.dimens.margin,
                    elevation: R.dimens.listCardElevation,
                }}>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View>
                            <ImageTextButton
                                icon={R.images.IC_PROVIDER}
                                style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                            />
                        </View>
                        <View style={{ flex: 1, paddingLeft: R.dimens.margin, }}>
                            <View style={{ flex: 1, justifyContent: "space-between", flexDirection: 'row' }}>
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.countryName ? item.countryName : '-'}</TextViewMR>
                                <View style={{ flexDirection: 'row' }}>
                                    <ImageTextButton
                                        style={{ margin: 0, padding: 0, }}
                                        icon={R.images.IC_EDIT}
                                        onPress={this.props._onEditCountries}
                                        iconStyle={{ padding: 0, margin: 0, marginRight: R.dimens.widgetMargin, width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                    />
                                    <ImageTextButton
                                        style={{ margin: 0, padding: 0, }}
                                        icon={R.images.IC_DELETE}
                                        onPress={this._onDelete}
                                        iconStyle={{ padding: 0, margin: 0, marginRight: R.dimens.widgetMargin, width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.country_code + ': '}</TextViewHML>
                                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{item.countryCode ? item.countryCode : '-'}</TextViewHML>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'flex-end', marginTop: R.dimens.widgetMargin }}>
                        <View style={{ justifyContent: 'flex-end' }}>
                            <StatusChip
                                color={item.status.toUpperCase() === 'ACTIVE' ? R.colors.successGreen : R.colors.failRed}
                                value={item.status ? item.status : '-'}></StatusChip>
                        </View>
                    </View>

                </CardView>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        //data get from the reducer and set to appData
        appData: state.CountriesReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //here dispatch action and pass to action file and then goes to saga then data set to reducer and change state acording to responce.
        countriesFatchData: () => dispatch(countriesFatchData()),
        countriesDeleteData: () => dispatch(countriesDeleteData()),
        getFilterCountries: (request) => dispatch(getFilterCountries(request)),
        clearDelete: () => dispatch(clearDelete()),
        clearCountrisData: () => dispatch(clearCountrisData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountriesScreen)