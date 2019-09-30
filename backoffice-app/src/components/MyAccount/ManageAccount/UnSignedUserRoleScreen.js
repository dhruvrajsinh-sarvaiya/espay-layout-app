import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, getCurrentDate, convertDate, addPages, convertTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget'
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import StatusChip from '../../widget/StatusChip';
import { Fonts } from '../../../controllers/Constants';
import { clearUnassignUserRole, listUnassignUserRole } from '../../../actions/account/UnsignedUserRoleAction';

class UnSignedUserRoleScreen extends Component {

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

            userName: '',

            status: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.active, code: '1' }, { value: R.strings.Inactive, code: '0' }],
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',

            //For pagination
            row: [],
            selectedPage: 1,

            //For Drawer First Time Close
            isDrawerOpen: false,
            unassignData: null,
        };

        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

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

    componentDidMount = () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //To get callListUnassignUserRole 
        this.callListUnassignUserRole()

    };

    //api call for list 
    callListUnassignUserRole = async () => {

        this.setState({
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            userName: '',
            selectedPage: 1,
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: AppConfig.pageSize,
            }

            //To get listUnassignUserRole list
            this.props.listUnassignUserRole(request);
        }
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearUnassignUserRole();
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
        if (UnSignedUserRoleScreen.oldProps !== props) {
            UnSignedUserRoleScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { unassignData } = props.data;

            if (unassignData) {
                try {
                    //if local socialTradingData state is null or its not null and also different then new response then and only then validate response.
                    if (state.unassignData == null || (state.unassignData != null && unassignData !== state.unassignData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: unassignData, isList: true })) {
                            let res = parseArray(unassignData.Result);

                            //add status static based ion status code
                            res.map((item, index) => {
                                res[index].StatusText = item.Status === 1 ? R.strings.Active : R.strings.Inactive; // for search show hide string response has 0 or  1
                            })

                            return { ...state, unassignData, response: res, refreshing: false, row: addPages(unassignData.TotalCount) };
                        } else {
                            return { ...state, unassignData, response: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, row: [] };
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
            UserName: this.state.userName,
            Status: this.state.selectedStatusCode,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get listUnassignUserRole list
            this.props.listUnassignUserRole(request);
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();
        this.setState({ selectedPage: 1 })
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
            userName: '',
            selectedPage: 1,
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get listUnassignUserRole list
            this.props.listUnassignUserRole(request);
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
                PageSize: AppConfig.pageSize,
                UserName: this.state.userName,
                Status: this.state.selectedStatusCode,
            }

            //To get listUnassignUserRole list
            this.props.listUnassignUserRole(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // this method is called when page change and also api call
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                let request = {
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    PageNo: pageNo - 1,
                    PageSize: AppConfig.pageSize,
                    Status: this.state.selectedStatusCode,
                    UserName: this.state.userName,
                }

                //To get listUnassignUserRole list
                this.props.listUnassignUserRole(request);
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
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={[
                    {
                        header: R.strings.userName,
                        placeholder: R.strings.userName,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "done",
                        onChangeText: (text) => { this.setState({ userName: text }) },
                        value: this.state.userName,
                    }
                ]}
                pickers={[
                    {
                        title: R.strings.status,
                        array: this.state.status,
                        selectedValue: this.state.selectedStatus,
                        onPickerSelect: (index, object) => this.setState( 
                            { selectedStatus: 
                                index, 
                                selectedStatusCode: object.code 
                            })
                    }
                ]}
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    render() {

        let filteredList = [];
        if (this.state.response.length) {

            //for search
            filteredList = this.state.response.filter(item =>
                 (
                item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Email.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.CreatedDate.toLowerCase().includes(this.state.search) ||
                item.StatusText.toLowerCase().includes(this.state.search)
            ));
        }

        return (
            <Drawer  ref={component => this.drawer = component}  drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right} onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}  type={Drawer.types.Overlay}
                easingFunc={Easing.ease}>

                <SafeView style={this.styles().container}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set status bar as per our theme */}
                    <ProgressDialog ref={component => this.progressDialog = component} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.listUnasignUserRole}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        onBackPress={this.onBackPress} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {(this.props.data.listLoading && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <UnSignedUserRoleItem
                                            index={index}
                                            item={item}
                                            onActionPress=
                                            {() => this.props.navigation.navigate('UnSignedUserRoleAssignScreen',
                                                { item, onRefresh: this.callListUnassignUserRole })}
                                            size={this.state.response.length} />
                                    }
                                    keyExtractor={(_item, index) => index.toString()}
                                    refreshControl={<RefreshControl progressBackgroundColor={R.colors.background}
                                        colors={[R.colors.accent]}
                                        onRefresh={this.onRefresh}
                                        refreshing={this.state.refreshing}
                                    />}
                                />
                                :
                                <ListEmptyComponent />
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
                backgroundColor: R.colors.background,  flex: 1,
            },
        }
    }
}

// This Class is used for display record in list
class UnSignedUserRoleItem extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let props = this.props;
        let index = props.index;
        let item = props.item;
        let size = props.size;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{  flex: 1,  marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,  marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        borderBottomLeftRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                        flex: 1,
                    }}>
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageTextButton
                                    icon={R.images.IC_FILL_USER}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, paddingRight: R.dimens.WidgetPadding }}>{item.UserName ? item.UserName : '-'}</Text>
                                    <ImageTextButton
                                        icon={R.images.COPY_ICON}
                                        onPress={this.props.onActionPress}
                                        style={{ margin: 0 }}
                                        iconStyle={{
                                            width: R.dimens.dashboardMenuIcon,
                                            height: R.dimens.dashboardMenuIcon,
                                            tintColor: R.colors.textPrimary
                                        }} />
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.email + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.Email ? item.Email : '-'}</TextViewHML>
                                </View>

                            </View>
                        </View>

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
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate)}</TextViewHML>

                            </View>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}
function mapStatToProps(state) {
    //Updated Data For UnsignedUserRoleReducer Data 
    let data = {
        ...state.UnsignedUserRoleReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform listUnassignUserRole Action 
        listUnassignUserRole: (payload) => dispatch(listUnassignUserRole(payload)),
        //Perform clearUnassignUserRole Action 
        clearUnassignUserRole: () => dispatch(clearUnassignUserRole())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(UnSignedUserRoleScreen);