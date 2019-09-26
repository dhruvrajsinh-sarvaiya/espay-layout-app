import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, getCurrentDate, convertDate, addPages, convertTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import StatusChip from '../../widget/StatusChip';
import { roleAssignHistory, clearRoleAssignHistory } from '../../../actions/account/RoleAssignHistoryAction';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';
import { getUserDataList } from '../../../actions/PairListAction';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget'
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import { connect } from 'react-redux';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';

class RoleAssignHistoryScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],
            isFirstTime: true,

            //Filter
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),

            userNames: [{ value: R.strings.Please_Select }],
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',

            modules: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Role, code: '1' },
                { value: R.strings.Groups, code: '2' },
                { value: R.strings.modules, code: '3' },
                { value: R.strings.Users, code: '4' }
            ],
            selectedModule: R.strings.Please_Select,
            selectedModuleCode: '',

            status: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.active, code: '1' }, { value: R.strings.Inactive, code: '0' }],
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',

            //For pagination
            row: [],
            selectedPage: 1,
            PageSize: AppConfig.pageSize,

            //For Drawer First Time Close
            isDrawerOpen: false,
            roleAssignData: null,
            userData: null,
        };

        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle

        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams(
            { onBackPress: this.onBackPress }
        );
    }

    onBackPress() {
        if (this.state.isDrawerOpen) {

            this.drawer.closeDrawer();
            this.setState(
                { isDrawerOpen: false }
            )
        }
        else {
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //to getUserDataList list
            this.props.getUserDataList();

            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                /* FromDate: '2019-01-01',
                ToDate: '2019-06-04', */
                PageNo: 0,
                PageSize: this.state.PageSize,
            }

            //To get roleAssignHistory list
            this.props.roleAssignHistory(request);
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearRoleAssignHistory();
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
        if (RoleAssignHistoryScreen.oldProps !== props) {
            RoleAssignHistoryScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { roleAssignData, userData } = props.data;

            if (roleAssignData) {
                try {
                    //if local socialTradingData state is null or its not null and also different then new response then and only then validate response.
                    if (state.roleAssignData == null || (state.roleAssignData != null && roleAssignData !== state.roleAssignData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: roleAssignData, isList: true })) {
                            let res = parseArray(roleAssignData.Data);
                            res.map((item, index) => {
                                res[index].StatusText = item.Status === 1 ? R.strings.Active : R.strings.Inactive; // for search show hide string response has 0 or  1
                            })

                            return { ...state, roleAssignData, response: res, refreshing: false, row: addPages(roleAssignData.TotalCount) };
                        } else {
                            return { ...state, roleAssignData, response: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, row: [] };
                }
            }

            if (userData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userData == null || (state.userData != null && userData !== state.userData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: userData, isList: true })) {
                            let res = parseArray(userData.GetUserData);

                            res.map((item, index) => {
                                res[index].value = item.UserName;
                            })

                            let userNames = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, userData, userNames };
                        } else {
                            return { ...state, userData, userNames: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, userNames: [{ value: R.strings.all }] };
                }
            }
        }
        return null;
    }

    // if press on complete button then check validation and api calling
    onComplete = async () => {

        //Check All From Date and To Date Validation
        if (DateValidation(this.state.fromDate, this.state.toDate)) {
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate));
            return;
        }

        let request = {
            FromDate: this.state.fromDate,
            ToDate: this.state.toDate,
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            UserId: this.state.selectedUserNameCode,
            ModuleId: this.state.selectedModuleCode,
            Status: this.state.selectedStatusCode,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get roleAssignHistory list
            this.props.roleAssignHistory(request);
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();
        this.setState({ selectedPage: 1, })
    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        let request = {
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            PageNo: 0,
            PageSize: AppConfig.pageSize,
        };

        // Set state to original value
        this.setState({
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            selectedPage: 1,
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',
            selectedModule: R.strings.Please_Select,
            selectedModuleCode: '',
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get roleAssignHistory list
            this.props.roleAssignHistory(request);
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize,
                UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                ModuleId: this.state.selectedModuleCode,
                Status: this.state.selectedStatusCode,
            }

            //To get roleAssignHistory list
            this.props.roleAssignHistory(request);

        } else {
            this.setState({
                refreshing: false
            });
        }
    }

    // this method is called when page change and also api call
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState(
                    { selectedPage: pageNo });

                let request = {
                    PageSize: AppConfig.pageSize,
                    UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                    Status: this.state.selectedStatusCode,
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    PageNo: pageNo - 1,
                    ModuleId: this.state.selectedModuleCode,
                }

                //To get roleAssignHistory list
                this.props.roleAssignHistory(request);
            }
        }
    }

    navigationDrawer() {

        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                toastRef={component => this.toast = component}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[

                    {
                        title: R.strings.userName,
                        array: this.state.userNames,
                        selectedValue: this.state.selectedUserName,
                        onPickerSelect: (index, object) => this.setState({ selectedUserName: index, selectedUserNameCode: object.Id })
                    },
                    {
                        title: R.strings.modules,
                        array: this.state.modules,
                        selectedValue: this.state.selectedModule,
                        onPickerSelect: (index, object) => this.setState({ selectedModule: index, selectedModuleCode: object.code })
                    },
                    {
                        title: R.strings.status, array: this.state.status,
                        selectedValue: this.state.selectedStatus,
                        onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                    }
                ]}
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    render() {
        let filteredList = [];

        //for search

        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.Module.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.IPAddress.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.UserName.toLowerCase().includes(this.state.search) ||
                item.UpdatedDate.toLowerCase().includes(this.state.search) ||
                item.ModificationDetail.toLowerCase().includes(this.state.search) ||
                item.StatusText.toLowerCase().includes(this.state.search)
            ));
        }

        return (
            <Drawer
                ref={component => this.drawer = component}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>
                <SafeView style={this.styles().container}>

                    {/* To set status bar as per our theme */}

                    <CommonStatusBar />

                    {/* To set Progress bar as per our theme */}
                    <ProgressDialog ref={component => this.progressDialog = component} />

                    {/* To set toolbar as per our theme */}

                    <CustomToolbar
                        title={R.strings.roleAssignHistory}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        onBackPress={this.onBackPress} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {(this.props.data.roleAssignFetching && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <RoleAssignHistoryItem
                                            index={index}
                                            item={item}
                                            size={this.state.response.length} />
                                    }
                                    refreshControl={<RefreshControl
                                        progressBackgroundColor={R.colors.background}
                                        colors={[R.colors.accent]}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}
                                    keyExtractor={(_item, index) => index.toString()}
                                />
                                : <ListEmptyComponent />
                        }
                        {/*To Set Pagination View  */}
                        <View>
                            {filteredList.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1, backgroundColor: R.colors.background,
            },
        }
    }
}

// This Class is used for display record in list
class RoleAssignHistoryItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) { return false }
        return true
    }

    render() {
        let props = this.props
        let size = props.size;
        let index = props.index;
        let item = props.item;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row' }}>

                            {/* icon for fill user */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageTextButton
                                    icon={R.images.IC_FILL_USER}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
                                {/* for show UserName */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <Text style={{
                                        flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary,
                                        fontFamily: Fonts.MontserratSemiBold, paddingRight: R.dimens.WidgetPadding
                                    }}>{item.UserName ? item.UserName : '-'}</Text>
                                </View>

                                {/* for show Module */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.modules + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.Module ? item.Module : '-'}</TextViewHML>
                                </View>

                                {/* for show ip address */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.IPAddress + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.IPAddress ? item.IPAddress : '-'}</TextViewHML>
                                </View>

                                {/* for show ModificationDetail */}
                                <View >
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.modificationDetail + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.ModificationDetail ? item.ModificationDetail : '-'}</TextViewHML>
                                </View>
                            </View>
                        </View>

                        {/* for show status and date */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
                            <StatusChip
                                color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.StatusText}></StatusChip>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDate(item.UpdatedDate) + ' ' + convertTime(item.UpdatedDate)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For RoleAssignHistoryReducer Data 
    let data = {
        ...state.RoleAssignHistoryReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform roleAssignHistory Action 
        roleAssignHistory: (payload) => dispatch(roleAssignHistory(payload)),
        //Perform getUserDataList Action 
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform clearRoleAssignHistory Action 
        clearRoleAssignHistory: () => dispatch(clearRoleAssignHistory())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(RoleAssignHistoryScreen);