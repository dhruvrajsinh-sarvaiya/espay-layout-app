import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { changeTheme, parseArray, convertDateTime } from '../../../controllers/CommonUtils';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { isInternet, validateResponseNew, validateValue, validWithdrawAddress, validateNumeric, validCharacter, isEmpty } from '../../../validations/CommonValidation';
import { getDestroyBlackFundList } from '../../../actions/Wallet/ERC223DashboardActions';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';

export class DestroyBlackFundListScreen extends Component {
    constructor(props) {
        super(props);
        //To Bind All Method
        this.onBackPress = this.onBackPress.bind(this);

        //Define all initial state
        this.state = {
            DestroyBlackFundResponse: [],
            DestroyBlackFundState: null,

            searchInput: '',
            refreshing: false,
            isFirstTime: true,
            isDrawerOpen: false,

            Address: '',
            FromDate: '',
            ToDate: '',
        }


        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams(
            { onBackPress: this.onBackPress });
    }


    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check internet connection
        if (await isInternet()) {
            // Destroy Black Fund List Api
            this.props.getDestroyBlackFundList({
                FromDate: this.state.FromDate, ToDate: this.state.ToDate
            })
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call 
        return isCurrentScreen(nextProps);
    };

    // For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // check internet connection
        if (await isInternet()) {
            let req = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Address: this.state.Address
            }

            // Call Api for Get Destroy Black Fund
            this.props.getDestroyBlackFundList(req)

        } else {
            this.setState({ refreshing: false });
        }
    }
    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //going back screen
            this.props.navigation.goBack();
        }
    }
    // Reset Filter
    onResetPress = async () => {
        this.drawer.closeDrawer();

        // set Initial State
        this.setState({
            FromDate: '',
            ToDate: '',
            searchInput: '',
            Address: '',
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Leverage Report
            let req = {
                FromDate: '',
                ToDate: '',
                Address: '',
            }

            // Call destroy black fund list api
            this.props.getDestroyBlackFundList(req);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Api Call when press on complete button
    onCompletePress = async () => {

        // Both date required
        if (this.state.FromDate === "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate === "") {
            this.toast.Show(R.strings.bothDateRequired);
            return
        }

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true))
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
        else if (validateNumeric(this.state.Address) && !isEmpty(this.state.Address))
            this.toast.Show(R.strings.invalidAddress);
        else if (validCharacter(this.state.Address) && !isEmpty(this.state.Address))
            this.toast.Show(R.strings.invalidAddress);
        else if (!validWithdrawAddress(this.state.Address) && !isEmpty(this.state.Address))
            this.toast.Show(R.strings.invalidAddress);
        else {
            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();

            // check internet connection
            if (await isInternet()) {
                let req = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    Address: this.state.Address
                }

                // Call destroy black fund list api
                this.props.getDestroyBlackFundList(req)
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (DestroyBlackFundListScreen.oldProps !== props) {
            DestroyBlackFundListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { DestroyBlackFund, } = props.DestroyBlackFundResult;

            // DestroyBlackFund is not null
            if (DestroyBlackFund) {
                try {
                    if (state.DestroyBlackFundState == null || (state.DestroyBlackFundState != null && DestroyBlackFund !== state.DestroyBlackFundState)) {

                        //succcess response fill the list 
                        if (validateResponseNew({ response: DestroyBlackFund, isList: true })) {
                            // Parse Destroy Black Fund object to array
                            let res = parseArray(DestroyBlackFund.Data)

                            return Object.assign({}, state, {
                                DestroyBlackFundState: DestroyBlackFund,
                                DestroyBlackFundResponse: res,
                                refreshing: false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                DestroyBlackFundState: null,
                                DestroyBlackFundResponse: [],
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        DestroyBlackFundState: null,
                        DestroyBlackFundResponse: [],
                        refreshing: false,
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null
    }

    // Drawer Navigation
    navigationDrawer() {

        return (
            // for show filter of fromdate, todate,currency and status data
            <FilterWidget
                isCancellable={true}
                FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
                ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
                FromDate={this.state.FromDate}
                ToDate={this.state.ToDate}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
                toastRef={component => this.toast = component}
                textInputs={[
                    {
                        header: R.strings.Address,
                        placeholder: R.strings.Address,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "done",
                        onChangeText: (text) => { this.setState({ Address: text }) },
                        value: this.state.Address,
                    }
                ]}
            />
        )
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { DestroyBlackFundLoading } = this.props.DestroyBlackFundResult;

        // searching functionlity
        let finalItems = this.state.DestroyBlackFundResponse.filter(item => (
            item.ActionByUserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Address.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.TrnHash.toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            //DrawerLayout for Leverage Request Filteration
          
            <Drawer
                easingFunc={Easing.ease}
                ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}>

                
                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        title={R.strings.destroyBlackFund}
                        isBack={true}
                        rightIcon={R.images.FILTER}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    {
                        (DestroyBlackFundLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => <DestroyBlackFundListItem
                                    index={index}
                                    item={item}
                                    size={finalItems.length} />
                                }
                                // assign index as key valye to Withdrawal list item
                                keyExtractor={(item, index) => index.toString()}
                                // For Refresh Functionality In Withdrawal FlatList Item
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />
                                }
                                contentContainerStyle={contentContainerStyle(finalItems)}
                                // Displayed empty component when no record found 
                                ListEmptyComponent={<ListEmptyComponent />}
                            />
                    }
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class DestroyBlackFundListItem extends Component {

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
     
        let { size, index, item, } = this.props

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        borderTopRightRadius: R.dimens.margin,
                        flex: 1,
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{item.ActionByUserName}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.trnHash + ': '}</TextViewHML>
                                <View style={{ flex: 1 }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.TrnHash)}</TextViewHML>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Address + ': '}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Address)}</TextViewHML>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.remarks + ': '}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Remarks)}</TextViewHML>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.ActionDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get destroy black fund data from reducer
        DestroyBlackFundResult: state.ERC223DashboardReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // To Perform Destroy Black Fund List Action
    getDestroyBlackFundList: (payload) => dispatch(getDestroyBlackFundList(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DestroyBlackFundListScreen);