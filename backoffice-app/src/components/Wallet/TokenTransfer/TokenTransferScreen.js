import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Image, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
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
import { getTokenTransferlist, ClearTokenTransferData } from '../../../actions/Wallet/TokenTransferAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import Separator from '../../../native_theme/components/Separator';

class TokenTransferScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //Define all initial state
        this.state = {

            fromDate: '',
            toDate: '',

            refreshing: false,
            search: '',

            response: [],

            isFirstTime: true,

            tokenTransferDataState: null,

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
        changeTheme()

        //To get callgetTokenTransferlist 
        this.callgetTokenTransferlist()
    }

    //api call
    async  callgetTokenTransferlist() {

        this.setState({ FromDate: '', ToDate: '', })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getTokenTransferlist list
            this.props.getTokenTransferlist({ FromDate: '', ToDate: '', });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    }

    componentWillUnmount() {
        //for Data clear on Backpress
        this.props.ClearTokenTransferData();
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
        if (TokenTransferScreen.oldProps !== props) {
            TokenTransferScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { tokenTransferData } = props.data;

            if (tokenTransferData) {
                try {
                    //if local tokenTransferData state is null or its not null and also different then new response then and only then validate response.
                    if (state.tokenTransferDataState == null || (state.tokenTransferDataState != null && tokenTransferData !== state.tokenTransferDataState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: tokenTransferData, isList: true })) {

                            return { ...state, tokenTransferDataState: tokenTransferData, response: parseArray(tokenTransferData.Data), refreshing: false };
                        } else {
                            return { ...state, tokenTransferDataState: tokenTransferData, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }
        }
        return null;
    }

    // if press on complete button api calling
    onComplete = async () => {

        // Both date required
        if (this.state.fromDate === "" && this.state.toDate !== "" || this.state.fromDate !== "" && this.state.toDate === "") {
            this.toast.Show(R.strings.bothDateRequired);
            return
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getTokenTransferlist list
            this.props.getTokenTransferlist({
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
            });
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
            fromDate: '',
            toDate: '',
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getTokenTransferlist list
            this.props.getTokenTransferlist({
                FromDate: '',
                Todate: '',
            });
        } else {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getTokenTransferlist list
            this.props.getTokenTransferlist({
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
            });
        } else {
            this.setState({ refreshing: false });
        }
    }

    navigationDrawer() {

        return (
            <FilterWidget
                isCancellable={true}
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                toastRef={component => this.toast = component}
                comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
                sub_container={{ paddingBottom: 0, }}
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    // Render Right Side Menu For Add ,Filters , 
    rightMenuRender() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageTextButton
                    icon={R.images.IC_PLUS}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.props.navigation.navigate('TokenTransferAddScreen', { onSuccess: this.callgetTokenTransferlist })} />
                <ImageTextButton
                    style={{
                        paddingBottom: R.dimens.WidgetPadding,
                        margin: 0,
                        paddingRight: R.dimens.widgetMargin,
                        paddingTop: R.dimens.WidgetPadding,
                        paddingLeft: R.dimens.widgetMargin,
                    }}
                    icon={R.images.FILTER}
                    iconStyle={[{
                        tintColor: R.colors.textSecondary,
                        height: R.dimens.SMALL_MENU_ICON_SIZE,
                        width: R.dimens.SMALL_MENU_ICON_SIZE,
                    }]}
                    onPress={() => this.drawer.openDrawer()}
                />
            </View>
        )
        
    }

    render() {

        let filteredList = [];

        //for search all fields if response length > 0
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.ActionByUserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.FromAddress.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.ToAddress.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Amount.toFixed(8).toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.TrnHash.toLowerCase().includes(this.state.search.toLowerCase()) ||
                convertDateTime(item.ActionDate, 'YYYY-MM-DD HH:mm:ss', false).toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Remarks.toLowerCase().includes(this.state.search.toLowerCase())
            ));
        }

        return (
            <Drawer
                ref={component => this.drawer = component}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}>

                <SafeView style={this.styles().container}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.tokenTransfer}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightMenuRenderChilds={this.rightMenuRender()}
                        onBackPress={this.onBackPress} />

                    {(this.props.data.Loading && !this.state.refreshing)
                        ?
                        <ListLoader />
                        :
                        filteredList.length > 0 ?
                            <FlatList
                                data={filteredList}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) =>
                                    <TokenTransferItem
                                        index={index}
                                        item={item}
                                        onDetailPress={() => this.props.navigation.navigate('TokenTransferDetailScreen', { item })}
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
                            <ListEmptyComponent module={R.strings.addTokenTransfer} onPress={() => this.props.navigation.navigate('TokenTransferAddScreen', { onSuccess: this.callgetTokenTransferlist })} />
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
class TokenTransferItem extends Component {
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
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }} onPress={onDetailPress}>

                        <View style={{ flex: 1, flexDirection: 'row', }}>

                            {/* User Image */}
                            <Image
                                source={R.images.IC_USER}
                                style={{ width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight, tintColor: R.colors.accent }}
                            />

                            <View style={{ marginLeft: R.dimens.widgetMargin, flex: 1, }}>

                                {/* ActionByUserName*/}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: R.dimens.smallText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.ActionByUserName)} </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextViewMR style={{ color: R.colors.yellow, fontSize: R.dimens.smallestText, }}>{validateValue(parseFloatVal(item.Amount).toFixed(8))} </TextViewMR>
                                        <Image
                                            source={R.images.RIGHT_ARROW_DOUBLE}
                                            style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                        />
                                    </View>
                                </View>

                                {/* To FromAddress */}
                                <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.from} : </TextViewHML>
                                    <TextViewHML numberOfLines={1} ellipsizeMode="tail"
                                        style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.FromAddress)}</TextViewHML>
                                </View>

                                {/* ToAddress */}
                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.to} : </TextViewHML>
                                    <TextViewHML numberOfLines={1} ellipsizeMode="tail"
                                        style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.ToAddress)}</TextViewHML>
                                </View>
                            </View>
                        </View >

                        {/* txnHash*/}
                        <View style={{ flex: 1, marginTop: R.dimens.widgetMargin, }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.txnHash.toUpperCase()}</Text>
                                <Separator style={{ flex: 1, justifyContent: 'center', }} />
                            </View>
                            <TextViewHML style={{ marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.TrnHash)}</TextViewHML>
                        </View>

                        {/* DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widget_left_right_margin }}>
                            <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.ActionDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem >
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For TokenTransferReducer Data 
    let data = {
        ...state.TokenTransferReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getTokenTransferlist List Action 
        getTokenTransferlist: (payload) => dispatch(getTokenTransferlist(payload)),
        //Perform ClearTokenTransferData Action 
        ClearTokenTransferData: () => dispatch(ClearTokenTransferData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TokenTransferScreen);