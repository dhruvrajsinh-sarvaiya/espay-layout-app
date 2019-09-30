import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, Easing } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, addPages, convertDate, getCurrentDate, getDeviceID, getIPAddress, showAlert, parseIntVal, convertTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';
import { ServiceUtilConstant, Fonts } from '../../../controllers/Constants';
import PaginationWidget from '../../widget/PaginationWidget';
import { getProfileConfigList, deleteProfileConfig, getProfileType, clearProfileConfig } from '../../../actions/account/ProfileConfigAction';
import FilterWidget from '../../widget/FilterWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';


class ProfileConfigListScreen extends Component {
    constructor(props) {
        super(props);
        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);
        this.state = {
            profileConfigListData: null,
            profileTypeData: null,
            profileConfigDeleteData: null,
            response: [],
            searchInput: '',
            refreshing: false,
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            row: [],
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            type: [{ value: R.strings.Please_Select }],
            selectedType: R.strings.Please_Select,
            selectedTypeId: null,
            recursive: [{ value: 'true' }, { value: 'false' }],
            selectedRecursive: 'true',
            isDrawerOpen: false, // First Time Drawer is Closed
            isFirstTime: true,
        }

        //create reference
        this.drawer = React.createRef();
        this.onBackPress = this.onBackPress.bind(this);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                Typeid: 0,//default value,
                IsRecursive: this.state.selectedRecursive,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            //call Profile config List Api
            this.props.getProfileConfigList(this.Request)
            //call Profile Type Api
            this.props.getProfileType()
        }
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

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
                Typeid: this.state.selectedType === R.strings.Please_Select ? 0 : parseIntVal(this.state.selectedTypeId),
                IsRecursive: this.state.selectedRecursive,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            //call Profile config List Api
            this.props.getProfileConfigList(this.Request)
        } else {
            this.setState({ refreshing: false });
        }
    }

    //this method is call when user add or update success from the add or update screen 
    onSuccessAddEdit = async () => {
        // set number one page if add edit success from add or update screen
        this.setState({ selectedPage: 1 })

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
                Typeid: this.state.selectedType === R.strings.Please_Select ? 0 : parseIntVal(this.state.selectedTypeId),
                IsRecursive: this.state.selectedRecursive,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            //call Profile config List Api
            this.props.getProfileConfigList(this.Request)
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, }
        }

        // To Skip Render if old and new props are equal
        if (ProfileConfigListScreen.oldProps !== props) {
            ProfileConfigListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { profileConfigListData, profileTypeData } = props.Listdata;
            if (profileConfigListData) {
                try {
                    if (state.profileConfigListData == null || (state.profileConfigListData != null && profileConfigListData !== state.profileConfigListData)) {
                        if (validateResponseNew({ response: profileConfigListData, isList: true, })) {
                            //Set State For Api response 
                            return {
                                ...state,
                                refreshing: false,
                                profileConfigListData,
                                response: parseArray(profileConfigListData.getProfileConfiguration),
                                row: addPages(profileConfigListData.TotalCount)
                            }
                        } else {
                            return {
                                ...state,
                                profileConfigListData,
                                response: [],
                                refreshing: false,
                                row: [],
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [], refreshing: false, row: []
                    }
                }
            }

            //if profileTypeData response is not null then handle resposne
            if (profileTypeData) {
                if (state.profileTypeData == null || (state.profileTypeData != null && profileTypeData !== state.profileTypeData)) {
                    if (validateResponseNew({ response: profileTypeData, isList: true })) {
                        let res = parseArray(profileTypeData.TypeMasterList);

                        for (var typeKey in res) {
                            let item = res[typeKey]
                            item.value = item.Type
                        }

                        let type = [
                            { value: R.strings.Please_Select },
                            ...res
                        ]
                        return {
                            ...state,
                            profileTypeData, type
                        }
                    } else {
                        return {
                            ...state,
                            profileTypeData,
                            type: [{ value: R.strings.Please_Select }]
                        }
                    }
                }
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { profileConfigDeleteData } = this.props.Listdata;
        if (profileConfigDeleteData !== prevProps.Listdata.profileConfigDeleteData) {
            //Check delete Response 
            if (profileConfigDeleteData) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: profileConfigDeleteData, isList: false, })) {

                        showAlert(R.strings.Success, profileConfigDeleteData.ReturnMsg + '\n' + ' ', 0, () => {
                            this.setState({ selectedPage: 1 })

                            //clear data
                            this.props.clearProfileConfig()

                            this.Request = {
                                PageIndex: 1,
                                Page_Size: this.state.PageSize,
                                Typeid: 0,//default value,
                                IsRecursive: 'true',
                                FromDate: this.state.FromDate,
                                ToDate: this.state.ToDate,
                            }

                            //call getProfileConfigList api
                            this.props.getProfileConfigList(this.Request)
                        });
                    }
                    else {
                        //clear data
                        this.props.clearProfileConfig();
                    }
                } catch (e) {
                    //clear data
                    this.props.clearProfileConfig();
                }
            }
        }
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pageNo });

            //Check NetWork is Available or not
            if (await isInternet()) {
                //Bind request 
                this.Request = {
                    PageIndex: pageNo,
                    Page_Size: this.state.PageSize,
                    Typeid: this.state.selectedType === R.strings.Please_Select ? 0 : parseIntVal(this.state.selectedTypeId),
                    IsRecursive: this.state.selectedRecursive,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }
                //call Profile config List Api
                this.props.getProfileConfigList(this.Request)
            }
        }
    }

    // Render Right Side Menu 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageButton
                    icon={R.images.IC_PLUS}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.props.navigation.navigate('ProfileConfigAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })} />
                <ImageButton
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    icon={R.images.FILTER}
                    iconStyle={[{
                        height: R.dimens.SMALL_MENU_ICON_SIZE,
                        width: R.dimens.SMALL_MENU_ICON_SIZE,
                        tintColor: R.colors.textSecondary
                    }]}
                    onPress={() => this.drawer.openDrawer()} />
            </View>
        )
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <FilterWidget
                comboPickerStyle={{ marginTop: 0, }}
                textInputStyle={{ marginBottom: 0, marginTop: 0 }}
                toastRef={component => this.toast = component}
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                FromDate={this.state.FromDate}
                ToDate={this.state.ToDate}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
                pickers={[
                    {
                        title: R.strings.Type,
                        array: this.state.type,
                        selectedValue: this.state.selectedType,
                        onPickerSelect: (item, object) => { this.setState({ selectedType: item, selectedTypeId: object.id }) }
                    },
                    {
                        title: R.strings.recursive,
                        array: this.state.recursive,
                        selectedValue: this.state.selectedRecursive,
                        onPickerSelect: (index) => { this.setState({ selectedRecursive: index }) }
                    },

                ]}
            />
        )
    }

    // Set state to original value
    onResetPress = async () => {
        this.setState({
            selectedType: R.strings.Please_Select, selectedRecursive: 'true', searchInput: '',
            selectedPage: 1, FromDate: getCurrentDate(), ToDate: getCurrentDate(),
        })

        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Bind request
            let request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                Typeid: 0,//default value,
                IsRecursive: 'true',
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //call getProfileConfigList api
            this.props.getProfileConfigList(request)
        }
    }

    /* if press on complete button then check validation and api calling */
    onCompletePress = async () => {

        //check for validations
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen 
        this.drawer.closeDrawer();

        this.setState({ selectedPage: 1 })

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Bind request user sign up report
            let request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                Typeid: this.state.selectedType === R.strings.Please_Select ? 0 : parseIntVal(this.state.selectedTypeId),
                IsRecursive: this.state.selectedRecursive,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            //call getProfileConfigList api
            this.props.getProfileConfigList(request)
        }
        this.setState({ searchInput: '' })
    }

    deleteProfileConfig = async (item) => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            let deleteProfileConfigRequest = {
                Id: item.Id,
                DeviceId: await getDeviceID(),
                Mode: ServiceUtilConstant.Mode,
                IPAddress: await getIPAddress(),
                HostName: ServiceUtilConstant.hostName,
            }
            showAlert(R.strings.Delete, R.strings.delete_message, 3, () => {
                // To delete api call
                this.props.deleteProfileConfig(deleteProfileConfigRequest);
            }, R.strings.cancel, async () => { })
        }
    }

    render() {
        let finalItems = this.state.response;
        const { profileConfigListLoading, profileConfigDeleteLoading } = this.props.Listdata;
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.TypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.ProfileName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                ('' + item.IsRecursive).includes(this.state.searchInput.toLowerCase()) ||
                item.CreatedDate.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            <Drawer
                ref={cmpDrawer => this.drawer = cmpDrawer}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.listProfileConfig}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ searchInput: input })}
                        rightMenuRenderChilds={this.rightMenuRender()}
                    />

                    {/* Progress Dialog */}
                    <ProgressDialog isShow={profileConfigDeleteLoading} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {
                            (profileConfigListLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {finalItems.length ?
                                        <View style={{ flex: 1 }}>

                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                data={finalItems}
                                                renderItem={({ item, index }) => <ProfileConfigListItem
                                                    item={item}
                                                    index={index}
                                                    size={this.state.response.length}
                                                    ctx={this}
                                                    response={this.state.response}
                                                    onEdit={() => {
                                                        this.props.navigation.navigate('ProfileConfigAddEditScreen', { item: item, edit: true, onSuccess: this.onSuccessAddEdit })
                                                    }}
                                                    onDelete={() => this.deleteProfileConfig(item)}
                                                    onDetailPress={() => {
                                                        this.props.navigation.navigate('ProfileConfigListDetailScreen', { item: item })
                                                    }}

                                                ></ProfileConfigListItem>
                                                }
                                                keyExtractor={(item, index) => index.toString()}
                                                contentContainerStyle={contentContainerStyle(finalItems)}
                                                /* For Refresh Functionality FlatList Item */
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
                                        <ListEmptyComponent module={R.strings.AddProfileConfiguration} onPress={() => this.props.navigation.navigate('ProfileConfigAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })} />
                                    }
                                </View>
                        }
                        <View>
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class ProfileConfigListItem extends Component {

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item !== nextProps.item) {
            return true
        }
        return false
    }

    render() {
        let {item,index,size} = this.props;

        return (
            <AnimatableItem>
                <View
                    style={{
                        marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                        flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    }}>
                    <CardView
                        style={{
                            elevation: R.dimens.listCardElevation,
                            borderRadius: 0, borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                            flex: 1,
                        }}
                        onPress={props.onDetailPress}
                    >

                        <View style={{ flexDirection: 'row' }}>
                            {/* for show user icon */}
                            <ImageTextButton
                                icon={R.images.IC_FILL_USER}
                                style={{ margin: 0, padding: 0, justifyContent: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                            />

                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >

                                    {/* for show profile name */}
                                    <Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, paddingRight: R.dimens.WidgetPadding }}>{item.ProfileName ? item.ProfileName : '-'}</Text>

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                        {/* for show time and detail icon */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <ImageTextButton
                                                style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                                icon={R.images.IC_TIMER}
                                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                            />
                                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate)}</TextViewHML>
                                        </View>
                                        <ImageTextButton
                                            style={{ margin: 0, padding: 0, paddingRight: 0 }}
                                            onPress={this.props.onDetailPress}
                                            icon={R.images.RIGHT_ARROW_DOUBLE}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                        />
                                    </View>
                                </View>

                                {/* for show type */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.type + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.TypeName ? item.TypeName : '-'}</TextViewHML>
                                </View>

                                {/* for show recursive */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.recursive + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.IsRecursive ? R.strings.true : R.strings.false}</TextViewHML>
                                </View>

                                {/* for show edit and delete icon */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <ImageTextButton
                                        icon={R.images.IC_EDIT}
                                        style={{
                                            justifyContent: 'center', alignItems: 'center',
                                            margin: 0,
                                            padding: R.dimens.CardViewElivation,
                                            marginRight: R.dimens.widgetMargin,
                                            backgroundColor: R.colors.accent, borderRadius: R.dimens.titleIconHeightWidth,
                                        }} iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onEdit} />

                                    <ImageTextButton
                                        style={
                                            {
                                                justifyContent: 'center', alignItems: 'center', backgroundColor: R.colors.failRed,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                padding: R.dimens.CardViewElivation, margin: 0,
                                            }}
                                        icon={R.images.IC_DELETE}
                                        iconStyle={{
                                            width: R.dimens.titleIconHeightWidth,
                                            height: R.dimens.titleIconHeightWidth,
                                            tintColor: 'white'
                                        }}
                                        onPress={this.props.onDelete} />
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated Data
        Listdata: state.ProfileConfigReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //list data
        getProfileConfigList: (request) => dispatch(getProfileConfigList(request)),
        //delete Api 
        deleteProfileConfig: (request) => dispatch(deleteProfileConfig(request)),
        //get profile Type
        getProfileType: () => dispatch(getProfileType()),
        //clear reducer 
        clearProfileConfig: () => dispatch(clearProfileConfig()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ProfileConfigListScreen);


