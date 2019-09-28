import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, getCurrentDate, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import StatusChip from '../../widget/StatusChip';
import { Fonts } from '../../../controllers/Constants';
import { getWalletType } from '../../../actions/PairListAction';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { clearStakingConfig, getMasterStakingList, deleteMasterStaking } from '../../../actions/Wallet/StakingConfigurationAction';

class StakingConfigListScreen extends Component {

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

            //currency Picker
            currency: [{ value: R.strings.Please_Select }],
            selectedCurrency: R.strings.Please_Select,
            selectedCurrencyCode: '',

            //stakingType Picker
            stakingTypes: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Fixed_Deposit, code: '1' },
                { value: R.strings.Charge, code: '2' },

            ],
            selectedstakingType: R.strings.Please_Select,
            selectedstakingTypeCode: '',

            //slabTypes Picker
            slabTypes: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Fixed, code: '1' },
                { value: R.strings.Range, code: '2' },

            ],
            selectedSlabType: R.strings.Please_Select,
            selectedSlabTypeCode: '',

            //status Picker
            status: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Enable, code: '1' },
                { value: R.strings.Disable, code: '0' },
            ],
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',

            //For Drawer First Time Close
            isDrawerOpen: false,
            walletData: null,
            stakingList: null,

        };//Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams(
            { onBackPress: this.onBackPress });
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //get walletlist
            this.props.getWalletType();

            //To get getMasterStakingList list
            this.props.getMasterStakingList({});
        }
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


    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearStakingConfig();
    };
    shouldComponentUpdate = (nextProps, _nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
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
        if (StakingConfigListScreen.oldProps !== props) {
            StakingConfigListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { stakingList, walletData } = props.data;

            if (stakingList) {
                try {
                    //if local stakingList state is null or its not null and also different then new response then and only then validate response.
                    if (state.stakingList == null || (state.stakingList != null && stakingList !== state.stakingList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: stakingList, isList: true })) {
                            let res = parseArray(stakingList.Data);
                            return { ...state, stakingList, response: res, refreshing: false, };
                        } else {
                            return { ...state, stakingList, response: [], refreshing: false, };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, };
                }
            }

            if (walletData) {
                try {
                    //if local walletData state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletData == null || (state.walletData != null && walletData !== state.walletData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: walletData, isList: true })) {
                            let res = parseArray(walletData.Types);

                            for (var dataItem in res) {
                                let item = res[dataItem]
                                item.value = item.TypeName
                            }

                            let currency = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, walletData, currency };
                        } else {
                            return { ...state, walletData, currency: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, currency: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    // if press on complete button then check validation and api calling
    onComplete = async () => {

        let request = {
            WalletTypeID: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
            Status: this.state.selectedStatusCode,
            SlabType: this.state.selectedSlabTypeCode,
            StakingType: this.state.selectedstakingTypeCode,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getMasterStakingList list
            this.props.getMasterStakingList(request);
        } else {
            this.setState({ refreshing: false });
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();
    }

    onDeletePress = async (id) => {
        showAlert(R.strings.Delete_Record, R.strings.areyousure, 3, async () => {
            if (await isInternet()) {
                //  call api for delete Customer
                this.props.deleteMasterStaking(id)
            }
        }, R.strings.cancel)
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { stakingDeleteData } = this.props.data;
        if (stakingDeleteData !== prevProps.data.stakingDeleteData) {
            //Check delete Response 
            if (stakingDeleteData) {
                try {
                    //Get Api response
                    if (validateResponseNew({
                        response: stakingDeleteData,
                        isList: false,
                    })) {
                        showAlert(R.strings.Success, R.strings.recordDeletedSuccessfully, 0, () => {

                            this.props.clearStakingConfig();

                            //To call limit configuration api
                            this.props.getMasterStakingList({})
                        });
                    }
                    else {
                        this.props.clearStakingConfig();
                    }
                } catch (e) {
                    this.props.clearStakingConfig();
                }
            }
        }
    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        let request = {}

        // Set state to original value
        this.setState({
            selectedCurrency: R.strings.Please_Select,
            selectedCurrencyCode: '',

            selectedSlabType: R.strings.Please_Select,
            selectedSlabTypeCode: '',

            selectedstakingType: R.strings.Please_Select,
            selectedstakingTypeCode: '',
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getMasterStakingList list
            this.props.getMasterStakingList(request);
        } else {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = async (needUpdate, fromRefreshControl = false) => {

        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {

            let request = {
                WalletTypeID: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
                Status: this.state.selectedStatusCode,
                SlabType: this.state.selectedSlabTypeCode,
                StakingType: this.state.selectedstakingTypeCode,
            }

            //To get getMasterStakingList list
            this.props.getMasterStakingList(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    navigationDrawer() {
        return (
            <FilterWidget
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.Currency,
                        array: this.state.currency,
                        selectedValue: this.state.selectedCurrency,
                        onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, selectedCurrencyCode: object.ID })
                    },
                    {
                        title: R.strings.Staking_Type,
                        array: this.state.stakingTypes,
                        selectedValue: this.state.selectedstakingType,
                        onPickerSelect: (index, object) => this.setState({ selectedstakingType: index, selectedstakingTypeCode: object.code })
                    },
                    {
                        title: R.strings.Slab_Type,
                        array: this.state.slabTypes,
                        selectedValue: this.state.selectedSlabType,
                        onPickerSelect: (index, object) => this.setState({ selectedSlabType: index, selectedSlabTypeCode: object.code })
                    },
                    {
                        title: R.strings.status,
                        array: this.state.status,
                        selectedValue: this.state.selectedStatus,
                        onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                    },
                ]}
                onCompletePress={this.onComplete}
                onResetPress={this.onReset} />

        )
    }

    // Render Right Side Menu For Add Staking Configuration , Filters for Staking list 
    rightMenuRender = () => {

        return (
            <View style={{
                flexDirection: 'row'
            }}>
                <ImageTextButton
                    onPress={() => this.props.navigation.navigate('AddEditStakingConfigScreen', { onRefresh: this.onRefresh })}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    icon={R.images.IC_PLUS}
                />
                <ImageTextButton
                    icon={R.images.FILTER}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.drawer.openDrawer()} />
            </View>
        )
    }

    render() {

        let filteredList = [];

        // for searching
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.WalletTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.SlabTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.StakingTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.StrStatus.toLowerCase().includes(this.state.search)
            ));
        }

        return (
            <Drawer
                easingFunc={Easing.ease}
                drawerWidth={R.dimens.FilterDrawarWidth}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                ref={component => this.drawer = component}    >

                <SafeView
                    style={this.styles().container}>

                    {/* To set status bar as per our theme */}

                    <CommonStatusBar />

                    {/* To set Progress bar as per our theme */}
                    <ProgressDialog
                        ref={component => this.progressDialog = component}
                        isShow={this.props.data.stakingDeleteFetching} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.stakingConfiguration}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightMenuRenderChilds={this.rightMenuRender()}
                        onBackPress={this.onBackPress} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {(this.props.data.stakingListFetching && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <StakingConfigListItem
                                            index={index}
                                            item={item}
                                            onDetailPress={() => this.props.navigation.navigate('StakingPolicyListScreen', { item })}
                                            onEdit={() => this.props.navigation.navigate('AddEditStakingConfigScreen', { item, onRefresh: this.onRefresh })}
                                            onDelete={() => this.onDeletePress(item.Id)}
                                            size={this.state.response.length} />
                                    }
                                    keyExtractor={(_item, index) => index.toString()}
                                    refreshControl={<RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={() => this.onRefresh(true, true)}
                                    />}
                                />
                                :
                                <ListEmptyComponent module={R.strings.addStakingPlan}
                                    onPress={() => this.props.navigation.navigate('AddEditStakingConfigScreen', { onRefresh: this.onRefresh })} />
                        }
                    </View>
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
class StakingConfigListItem extends Component {
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

        // Get required fields from props
        let { index, size, item } = this.props;

        let statusText = ''
        let statusTextColor = R.colors.successGreen
        let color = R.colors.failRed

        //if status is inactive=0 than set icons and colors
        if (item.Status == 0) {
            statusText = item.StrStatus
            statusTextColor = R.colors.failRed
        }

        //if status is active=1 than set icons and colors
        else if (item.Status == 1) {
            statusText = item.StrStatus 
        }
        return (
            <AnimatableItem>
                <View style={{
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, marginRight: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        borderRadius: 0, borderBottomLeftRadius: R.dimens.margin, flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            {/* for show coin image */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.SignUpButtonHeight} height={R.dimens.SignUpButtonHeight} />
                            </View>

                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
                                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletTypeName ? item.WalletTypeName : '-'}</Text>
                                </View>

                                <View style={{ flex: 1, }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Slab_Type + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.SlabTypeName ? item.SlabTypeName : '-'}</TextViewHML>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Staking_Type + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.StakingTypeName ? item.StakingTypeName : '-'}</TextViewHML>
                                    </View>
                                </View>
                            </View>

                        </View>

                        {/* for show status and button for edit,status,delete */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
                            <StatusChip
                                color={statusTextColor}
                                value={statusText}></StatusChip>
                            <View>

                                <View style={{ flexDirection: 'row' }}>

                                    <ImageTextButton
                                        style={
                                            {
                                                alignItems: 'center', marginRight: R.dimens.widgetMargin,
                                                backgroundColor: R.colors.yellow,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                justifyContent: 'center',
                                                padding: R.dimens.CardViewElivation, margin: 0,
                                            }}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        icon={R.images.IC_VIEW_LIST}
                                        onPress={this.props.onDetailPress} />

                                    <ImageTextButton
                                        style={
                                            {
                                                alignItems: 'center', justifyContent: 'center',
                                                marginRight: R.dimens.widgetMargin,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                padding: R.dimens.CardViewElivation, margin: 0,
                                                backgroundColor: R.colors.accent,
                                            }}
                                        onPress={this.props.onEdit}
                                        icon={R.images.IC_EDIT}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    />

                                    <ImageTextButton
                                        style={
                                            {
                                                justifyContent: 'center',
                                                padding: R.dimens.CardViewElivation,
                                                alignItems: 'center', backgroundColor: color,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                            }}
                                        onPress={this.props.onDelete}
                                        icon={R.images.IC_DELETE}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    />
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
    //Updated Data For StakingConfigurationReducer Data 
    let data = {
        ...state.StakingConfigurationReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getMasterStakingList Action 
        getMasterStakingList: (payload) => dispatch(getMasterStakingList(payload)),
        //Perform deleteMasterStaking Action 
        deleteMasterStaking: (payload) => dispatch(deleteMasterStaking(payload)),
        //Perform getWalletType Action 
        getWalletType: () => dispatch(getWalletType()),
        //Perform clearStakingConfig Action 
        clearStakingConfig: () => dispatch(clearStakingConfig())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(StakingConfigListScreen);