import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import { getWalletTransactionType, getRoleDetails } from '../../../actions/PairListAction';
import { getTrnTypeRoleWise, clearRoleWiseData, updateTrnTypeRoleWiseStatus } from '../../../actions/Wallet/RoleWiseTransactionTypesAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';

class RoleWiseTransactionTypesScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],

            transactionTypes: [{ value: R.strings.Select_Type }],
            selectedTransactionType: R.strings.Select_Type,
            selectedTransactionTypeCode: '',

            roles: [{ value: R.strings.selectRole }],
            selectedRole: R.strings.selectRole,
            selectedRoleCode: '',

            statuses: [
                { value: R.strings.select_status, code: '' },
                { value: R.strings.Enable, code: '1' },
                { value: R.strings.Disable, code: '0' },
            ],
            selectedStatus: R.strings.select_status,
            selectedStatusCode: '',

            roleTrnListData: null,
            updateStatus: null,
            roleDetails: null,
            walletTransactionType: null,

            isFirstTime: true,
            delete: false,

            statusId: null,
            changedStatus: null,

            //For Drawer First Time Close
            isDrawerOpen: false,
        };

        this.onBackPress = this.onBackPress.bind(this);
        //Bind all methods

        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        //add current route for backpress handle
    }

    componentDidMount = async () => {

        changeTheme();
        //Add this method to change theme based on stored theme name.

        //Check NetWork is Available or not
        if (await isInternet()) {
            //To get callgetTrnTypeRoleWise 
            this.callgetTrnTypeRoleWise()
            //call getWalletTransactionType api
            this.props.getWalletTransactionType();
            //call getRoleDetails api
            this.props.getRoleDetails()

        }
    };

    //api call
    callgetTrnTypeRoleWise = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                TrnTypeId: '',
                RoleId: '',
                Status: '',
            }
            //To get getTrnTypeRoleWise list
            this.props.getTrnTypeRoleWise(request);
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearRoleWiseData();
    };

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
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
        if (RoleWiseTransactionTypesScreen.oldProps !== props) {
            RoleWiseTransactionTypesScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { roleTrnListData, walletTransactionType, roleDetails } = props.data;

            if (roleTrnListData) {
                try {
                    //if local roleTrnListData state is null or its not null and also different then new response then and only then validate response.
                    if (state.roleTrnListData == null || (state.roleTrnListData != null && roleTrnListData !== state.roleTrnListData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: roleTrnListData, isList: true })) {

                            let res = parseArray(roleTrnListData.Data);

                            //for add userData
                            for (var Rolekey in res) {
                                let item = res[Rolekey];
                                if (item.Status === 0) {
                                    item.statusText = R.strings.Disable
                                }
                                else if (item.Status === 1) {
                                    item.statusText = R.strings.Enable
                                }
                                else {
                                    item.statusText = ''
                                }
                            }

                            return { ...state, roleTrnListData, response: res, refreshing: false };
                        } else {
                            return { ...state, roleTrnListData, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }

            if (walletTransactionType) {
                try {
                    //if local walletTransactionType state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletTransactionType == null || (state.walletTransactionType != null && walletTransactionType !== state.walletTransactionType)) {

                        //if  response is success then store walletTransactionType list else store empty list
                        if (validateResponseNew({ response: walletTransactionType, isList: true })) {
                            let res = parseArray(walletTransactionType.Data);

                            //for add transactionTypes
                            for (var transactionTypesKey in res) {
                                let item = res[transactionTypesKey];
                                item.value = item.TypeName;
                            }

                            let transactionTypes = [
                                { value: R.strings.Select_Type },
                                ...res
                            ];

                            return { ...state, walletTransactionType, transactionTypes };
                        } else {
                            return { ...state, walletTransactionType, transactionTypes: [{ value: R.strings.Select_Type }] };
                        }
                    }
                } catch (e) {
                    return { ...state, transactionTypes: [{ value: R.strings.Select_Type }] };
                }
            }

            if (roleDetails) {
                try {
                    //if local roleDetails state is null or its not null and also different then new response then and only then validate response.
                    if (state.roleDetails == null || (state.roleDetails != null && roleDetails !== state.roleDetails)) {

                        //if  response is success then store roleDetails list else store empty list
                        if (validateResponseNew({ response: roleDetails, isList: true })) {
                            let res = parseArray(roleDetails.Roles);

                            //for add roleDetails
                            for (var roleDetailsKey in res) {
                                let item = res[roleDetailsKey];
                                item.value = item.RoleName;
                            }

                            let roles = [
                                { value: R.strings.selectRole },
                                ...res
                            ];

                            return { ...state, roleDetails, roles };
                        } else {
                            return { ...state, roleDetails, roles: [{ value: R.strings.selectRole }] };
                        }
                    }
                } catch (e) {
                    return { ...state, roles: [{ value: R.strings.selectRole }] };
                }
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { updateStatus } = this.props.data;
        if (updateStatus !== prevProps.data.updateStatus) {
            //Check delete Response 
            if (updateStatus) {
                try {
                    //Get Api response
                    if (validateResponseNew({
                        response: updateStatus,
                        isList: false,
                    })) {
                        //If Delete is true than show success dialog or change status statically
                        if (this.state.delete) {
                            showAlert(R.strings.Success, R.strings.delete_success + '\n' + ' ', 0, () => {

                                //To call getTrnTypeRoleWise list api
                                this.callgetTrnTypeRoleWise()

                                this.setState({ delete: false })
                            });

                        }
                        else {
                            let res = this.state.response;

                            let findIndexOfChangeID = this.state.statusId == null ? -1 : res.findIndex(el => el.Id === this.state.statusId);

                            //if index is >-1 then record is found 
                            if (findIndexOfChangeID > -1) {
                                res[findIndexOfChangeID].Status = this.state.changedStatus;
                                res[findIndexOfChangeID].statusText = this.state.changedStatus === 1 ? R.strings.Enable : R.strings.Disable;
                            }

                            this.setState({ delete: false, response: res, statusId: null, changedStatus: null })
                        }

                        this.props.clearRoleWiseData();
                    }
                    else {
                        this.setState({ delete: false, statusId: null, changedStatus: null })
                        this.props.clearRoleWiseData();
                    }
                } catch (e) {
                    this.setState({ delete: false, statusId: null, changedStatus: null })
                    this.props.clearRoleWiseData();
                }
            }
        }
    }

    // if press on complete button api calling
    onComplete = async () => {

        let request = {
            RoleId: this.state.selectedTransactionType === R.strings.selectRole ? '' : this.state.selectedRoleCode,
            TrnTypeId: this.state.selectedTransactionType === R.strings.Select_Type ? '' : this.state.selectedTransactionTypeCode,
            Status: this.state.selectedStatus === R.strings.select_status ? '' : this.state.selectedStatusCode,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getTrnTypeRoleWise list
            this.props.getTrnTypeRoleWise(request);
        } else {
            this.setState({ refreshing: false });
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();
    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        // Set state to original value
        this.setState({
            selectedTransactionType: R.strings.Select_Type,
            selectedTransactionTypeCode: '',
            selectedRole: R.strings.selectRole,
            selectedRoleCode: '',
            selectedStatus: R.strings.select_status,
            selectedStatusCode: '',
        })

        let request = {
            RoleId: '',
            TrnTypeId: '',
            Status: '',
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getTrnTypeRoleWise list
            this.props.getTrnTypeRoleWise(request);
        } else {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                RoleId: this.state.selectedTransactionType === R.strings.selectRole ? '' : this.state.selectedRoleCode,
                TrnTypeId: this.state.selectedTransactionType === R.strings.Select_Type ? '' : this.state.selectedTransactionTypeCode,
                Status: this.state.selectedStatus === R.strings.select_status ? '' : this.state.selectedStatusCode,
            }

            //To get getTrnTypeRoleWise list
            this.props.getTrnTypeRoleWise(request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    navigationDrawer() {

        return (
            <FilterWidget
                comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
                sub_container={{ paddingBottom: 0, }}
                pickers={[
                    {
                        title: R.strings.TransactionType,
                        array: this.state.transactionTypes,
                        selectedValue: this.state.selectedTransactionType,
                        onPickerSelect: (index, object) => this.setState({ selectedTransactionType: index, selectedTransactionTypeCode: object.TypeId })
                    },
                    {
                        title: R.strings.Role,
                        array: this.state.roles,
                        selectedValue: this.state.selectedRole,
                        onPickerSelect: (index, object) => this.setState({ selectedRole: index, selectedRoleCode: object.ID })
                    },
                    {
                        title: R.strings.status,
                        array: this.state.statuses,
                        selectedValue: this.state.selectedStatus,
                        onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                    },
                ]}
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    // Render Right Side Menu For Add RoleWiseTransasctionType , Filters , 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageTextButton
                    icon={R.images.IC_PLUS}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.props.navigation.navigate('RoleWiseTransasctionTypeAddScreen', { onSuccess: this.callgetTrnTypeRoleWise })} />
                <ImageTextButton
                    icon={R.images.FILTER}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.drawer.openDrawer()} />

            </View>
        )
    }

    onDeletePress = async (item) => {
        showAlert(R.strings.Delete_Record, R.strings.areyousure, 3, async () => {
            this.setState({ delete: true })
            if (await isInternet()) {

                let Request = {
                    id: item.Id,
                    status: 9 // fixed for delete
                }
                //call for delete RoleWiseStatus
                this.props.updateTrnTypeRoleWiseStatus(Request)
            }
        }, R.strings.cancel)
    }

    onChangeStatus = async (item) => {

        if (await isInternet()) {

            this.setState({ statusId: item.Id, changedStatus: item.Status === 1 ? 0 : 1 })

            let Request = {
                id: item.Id,
                status: item.Status === 1 ? 0 : 1, //if status is 1(enable) than status change 0(disbale)
            }

            //call for update RoleWiseStatus
            this.props.updateTrnTypeRoleWiseStatus(Request)
        }

    }

    render() {

        let filteredList = [];

        //for search all fields if response length > 0
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.RoleName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.TrnTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.statusText.toLowerCase().includes(this.state.search.toLowerCase())
            ));
        }

        return (
            <Drawer
                drawerWidth={R.dimens.FilterDrawarWidth}
                easingFunc={Easing.ease}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                ref={component => this.drawer = component}
                drawerContent={this.navigationDrawer()}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}    >

                <SafeView
                    style={this.styles().container}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set Progress bar as per our theme */}
                    <ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.updateStatusFetching} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.roleWiseTransactionTypes}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightMenuRenderChilds={this.rightMenuRender()}
                        onBackPress={this.onBackPress} />

                    {(this.props.data.loading && !this.state.refreshing)
                        ?
                        <ListLoader />
                        :
                        filteredList.length > 0 ?
                            <FlatList
                                data={filteredList}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) =>
                                    <RoleWiseTrnTypesItem
                                        index={index}
                                        item={item}
                                        onDelete={() => this.onDeletePress(item)}
                                        onChangeStatus={() => this.onChangeStatus(item)}
                                        size={this.state.response.length} />
                                }
                                keyExtractor={(_item, index) => index.toString()}
                                refreshControl={<RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                            />
                            :
                            <ListEmptyComponent module={R.strings.addRoleWiseTransactionType} onPress={() => this.props.navigation.navigate('RoleWiseTransasctionTypeAddScreen', { onSuccess: this.callgetTrnTypeRoleWise })} />
                    }

                </SafeView>
            </Drawer>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
    }
}

// This Class is used for display record in list
class RoleWiseTrnTypesItem extends Component {
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
        // Get required fields from props
        let { index, size, item } = this.props;

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}
                    >
                        <View>
                            <View style={{ flex: 1, }}>

                                {/* for show TRNTYPE */}
                                <TextViewMR style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.TrnTypeName)}</TextViewMR>

                                {/* for show ROLE */}
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.Role + ': '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.RoleName)}</TextViewHML>
                                </View>
                            </View>


                            {/* for show status and delete */}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>

                                <StatusChip
                                    color={item.Status === 1 ? R.colors.successGreen : R.colors.failRed}
                                    value={item.Status === 1 ? R.strings.Enable : R.strings.Disable}
                                    onPress={this.props.onChangeStatus}
                                ></StatusChip>

                                <ImageTextButton
                                    style={
                                        {
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: R.colors.failRed,
                                            borderRadius: R.dimens.titleIconHeightWidth,
                                            margin: 0,
                                            padding: R.dimens.CardViewElivation,
                                        }}
                                    icon={R.images.IC_DELETE}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    onPress={this.props.onDelete} />
                            </View>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem >
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For RoleWiseTransactionTypesReducer Data 
    let data = {
        ...state.RoleWiseTransactionTypesReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform  getWalletTransactionType Api Data 
        getWalletTransactionType: () => dispatch(getWalletTransactionType()),
        //Perform role type
        getRoleDetails: () => dispatch(getRoleDetails()),
        //Perform getTrnTypeRoleWise List Action 
        getTrnTypeRoleWise: (payload) => dispatch(getTrnTypeRoleWise(payload)),
        //Perform updateTrnTypeRoleWiseStatus List Action 
        updateTrnTypeRoleWiseStatus: (payload) => dispatch(updateTrnTypeRoleWiseStatus(payload)),
        //Perform clearRoleWiseData Action 
        clearRoleWiseData: () => dispatch(clearRoleWiseData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(RoleWiseTransactionTypesScreen);