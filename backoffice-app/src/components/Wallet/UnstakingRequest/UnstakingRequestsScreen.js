import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Image } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
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
import { getListPendingRequest, clearUnstaking, AccepetRejectRequest } from '../../../actions/Wallet/UnstakingRequestsAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getUserDataList } from '../../../actions/PairListAction';

class UnstakingRequestsScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],

            userNames: [{ value: R.strings.Please_Select }],
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',

            statuses: [
                { value: R.strings.select_status, code: '' },
                { value: R.strings.Pending, code: '0' },
                { value: R.strings.approved, code: '1' },
                { value: R.strings.Rejected, code: '9' },
            ],
            selectedStatus: R.strings.select_status,
            selectedStatusCode: '',

            types: [
                { value: R.strings.Select_Type, code: '' },
                { value: R.strings.Full, code: '1' },
                { value: R.strings.Partial, code: '2' },
            ],
            selectedType: R.strings.Select_Type,
            selectedTypeCode: '',

            unstackingListData: null,
            acceptRejectData: null,
            userData: null,

            isFirstTime: true,

            accept: false,

            //For Drawer First Time Close
            isDrawerOpen: false,
        };

        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle

        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress() 
    {
        if (this.state.isDrawerOpen) 
        {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else 
        {
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    componentDidMount = async () => 
    {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) 
        {
            //To get callgetListPendingRequest 
            this.callgetListPendingRequest();

            //to getUserDataList list
            this.props.getUserDataList();
        }
    };

    //api call
    callgetListPendingRequest = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getListPendingRequest list
            this.props.getListPendingRequest({});
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearUnstaking();
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
        if (UnstakingRequestsScreen.oldProps !== props) {
            UnstakingRequestsScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { unstackingListData, userData } = props.data;

            if (unstackingListData) {
                try {
                    //if local unstackingListData state is null or its not null and also different then new response then and only then validate response.
                    if (state.unstackingListData == null || (state.unstackingListData != null && unstackingListData !== state.unstackingListData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: unstackingListData, isList: true })) {

                            let res = parseArray(unstackingListData.Unstakings);

                            //for add userData
                            for (var Rolekey in res) {
                                let item = res[Rolekey];
                                if (item.Status === 0) {
                                    item.statusText = R.strings.Pending
                                }
                                else if (item.Status === 1) {
                                    item.statusText = R.strings.approved
                                }
                                else if (item.Status === 9) {
                                    item.statusText = R.strings.Rejected
                                }
                                else {
                                    item.statusText = ''
                                }
                            }

                            return { ...state, unstackingListData, response: res, refreshing: false };
                        } else {
                            return { ...state, unstackingListData, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }

            if (userData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userData == null 
                        || (state.userData != null
                             && userData !== state.userData))
                              {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: userData, isList: true })) 
                        {
                            let res = parseArray(userData.GetUserData);

                            //for add userData
                            for (var userDatakey in res) {
                                let item = res[userDatakey];  item.value = item.UserName;
                            }

                            let userNames = 
                            [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, 
                                userData, 
                                userNames };
                        } else {
                            return { ...state, 
                                userData, 
                                userNames: [{ value: R.strings.Please_Select }] 
                            };
                        }
                    }
                } 
                catch (e) 
                {
                    return { ...state, 
                        userNames: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { acceptRejectData } = this.props.data

        if (acceptRejectData !== prevProps.data.acceptRejectData) {
            // acceptRejectData is not null
            if (acceptRejectData) {

                try {
                    if (this.state.acceptRejectData == null || (this.state.acceptRejectData != null && acceptRejectData !== this.state.acceptRejectData)) {

                        // Handle Response
                        if (validateResponseNew({ response: acceptRejectData, isList: true })) {
                            // Show success dialog
                            showAlert(R.strings.status, this.state.accept == true ? R.strings.approvedSuccessfully : R.strings.rejectedSuccessfully, 0, async () => {

                                this.props.clearUnstaking()

                                //callgetListPendingRequest
                                this.callgetListPendingRequest()
                            })
                            this.setState({ acceptRejectData, accept: false })
                        } else {
                            // Show success dialog
                            showAlert(R.strings.status, R.strings[`apiDestroyErrorCode.${acceptRejectData.ErrorCode}`], 1, () => {
                                this.props.clearUnstaking()
                            })
                            this.setState({ acceptRejectData: null, accept: false })
                        }
                    }
                } catch (error) {
                    // clear reducer data
                    this.props.clearUnstaking()
                    this.setState({ acceptRejectData: null, accept: false })
                }
            }
        }
    }

    // if press on complete button api calling
    onComplete = async () => {

        let request = {
            Userid: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
            UnStakingType: this.state.selectedType === R.strings.Select_Type ? '' : this.state.selectedTypeCode,
            Status: this.state.selectedStatus === R.strings.select_status ? '' : this.state.selectedStatusCode,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getListPendingRequest list
            this.props.getListPendingRequest(request);
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();
    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        // Set state to original value
        this.setState({
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',
            selectedType: R.strings.Select_Type,
            selectedTypeCode: '',
            selectedStatus: R.strings.select_status,
            selectedStatusCode: '',
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //To get getListPendingRequest list
        this.callgetListPendingRequest()

    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                Userid: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                UnStakingType: this.state.selectedType === R.strings.Select_Type ? '' : this.state.selectedTypeCode,
                Status: this.state.selectedStatus === R.strings.select_status ? '' : this.state.selectedStatusCode,
            }

            //To get getListPendingRequest list
            this.props.getListPendingRequest(request);
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
                        title: R.strings.User,
                        array: this.state.userNames,
                        selectedValue: this.state.selectedUserName,
                        onPickerSelect: (index, object) => this.setState({ selectedUserName: index, selectedUserNameCode: object.Id })
                    },
                    {
                        title: R.strings.status,
                        array: this.state.statuses,
                        selectedValue: this.state.selectedStatus,
                        onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                    },
                    {
                        title: R.strings.Type,
                        array: this.state.types,
                        selectedValue: this.state.selectedType,
                        onPickerSelect: (index, object) => this.setState({ selectedType: index, selectedTypeCode: object.code })
                    },
                ]}
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    onAcceptRejectPress = async (item, AcceptRejectType) => {
        showAlert('', R.strings.areYouSureYouWantToProceed, 3, async () => {
            if (await isInternet()) {

                this.setState({ accept: AcceptRejectType == 1 ? true : false })

                let Request = {
                    StakingHistoryId: item.TokenStakingHistoryID,
                    Type: item.UnstakeType,
                    Bit: AcceptRejectType,//for accept 1 reject 9
                    AdminReqID: item.AdminReqID,
                    StakingPolicyDetailId: item.DegradeStakingHistoryRequestID,
                }

                //call for AccepetRejectRequest
                this.props.AccepetRejectRequest(Request)
            }
        }, R.strings.cancel)

    }

    render() {

        let filteredList = [];

        //for search all fields if response length > 0
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Email.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.UnstackTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.statusText.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.AmountCredited.toFixed(8).includes(this.state.search) ||
                item.ChargeBeforeMaturity.toFixed(8).includes(this.state.search)
            ));
        }

        return (
            <Drawer
            drawerPosition={Drawer.positions.Right}
                ref={component => this.drawer = component}
                drawerWidth={R.dimens.FilterDrawarWidth}
                type={Drawer.types.Overlay}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                easingFunc={Easing.ease}>

                <SafeView 
                style={this.styles().container}
                >

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set Progress bar as per our theme */}
                    <ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.acceptRejectFetching} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.unstackingRequests}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        onSearchText={(input) => this.setState({ search: input })}
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
                                    <UnstakingRequestsItem
                                        index={index}
                                        item={item}
                                        onDetailPress={() => this.props.navigation.navigate('UnstakingRequestsDetailScreen', { item })}
                                        onAcceptPress={() => this.onAcceptRejectPress(item, 1)}//for accept 1
                                        onRejectPress={() => this.onAcceptRejectPress(item, 9)} //for reject 9 
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
                            <ListEmptyComponent />
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
class UnstakingRequestsItem extends Component {
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
        let { index, size, item, onDetailPress } = this.props;

        // Change status color at runtime
        let stColor = R.colors.accent
        if (item.Status == 0)
            stColor = R.colors.yellow
        else if (item.Status == 1)
            stColor = R.colors.successGreen
        else if (item.Status == 9)
            stColor = R.colors.failRed

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1,
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }} onPress={onDetailPress}>
                        <View style={{ flex: 1, }}>

                            {/* for show WalletType  and  SlabType */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                {/* for show UserName */}
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.UserName)}</TextViewMR>

                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.RequestDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                                    <Image
                                        source={R.images.RIGHT_ARROW_DOUBLE}
                                        style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                    />
                                </View>
                            </View>

                            {/* for show email */}
                            <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.Email)}</TextViewHML>

                            {/* for show type */}
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.Type + ': '}</TextViewHML>
                                <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.UnstackTypeName)}</TextViewHML>
                            </View>
                        </View>


                        {/* for show TrnNo, Amount and Charge */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Amount}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                    {(parseFloatVal(item.AmountCredited).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.AmountCredited).toFixed(8)) : '-')}
                                </TextViewHML>
                            </View>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.maturityCharge}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                    {(parseFloatVal(item.ChargeBeforeMaturity).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.ChargeBeforeMaturity).toFixed(8)) : '-')}
                                </TextViewHML>

                            </View>
                        </View>


                        {/* for show status and delete */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>

                            <StatusChip
                                color={stColor}
                                value={item.statusText}
                                onPress={this.props.onChangeStatus} />

                            {item.Status == 0 &&
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <ImageTextButton
                                        style={
                                            {
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: R.colors.successGreen,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                padding: R.dimens.CardViewElivation,
                                                marginRight: R.dimens.widgetMargin,
                                            }}
                                        icon={R.images.IC_CHECKMARK}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onAcceptPress} />
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
                                        icon={R.images.IC_CANCEL}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onRejectPress} />

                                </View>
                            }
                        </View>
                    </CardView>
                </View >
            </AnimatableItem >
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For UnstakingRequestsReducer Data 
    let data = {
        ...state.UnstakingRequestsReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getListPendingRequest List Action 
        getListPendingRequest: (payload) => dispatch(getListPendingRequest(payload)),
        //Perform getUserDataList Action 
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform AccepetRejectRequest List Action 
        AccepetRejectRequest: (payload) => dispatch(AccepetRejectRequest(payload)),
        //Perform clearUnstaking Action 
        clearUnstaking: () => dispatch(clearUnstaking())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(UnstakingRequestsScreen);