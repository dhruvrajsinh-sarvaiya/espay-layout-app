import React, { Component } from 'react'
import { Text, View, FlatList, Easing, RefreshControl } from 'react-native'
import { changeTheme, parseArray, parseFloatVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getArbitrageExchangeBalList, clearArbitrageExchangeBalData } from '../../../actions/Arbitrage/ArbitrageExchangeBalActions';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { connect } from 'react-redux';
import FilterWidget from '../../widget/FilterWidget';
import ListLoader from '../../../native_theme/components/ListLoader';
import Drawer from 'react-native-drawer-menu';
import { Fonts } from '../../../controllers/Constants';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';

export class ArbitrageExchangeBalListScreen extends Component {
    constructor(props) {
        super(props);

        // get data from previous screen
        let { item, ServiceProvider, currencyName, Currency, SerProId, selectedProvider, GenerateMismatch } = props.navigation.state.params

        //Define all initial state
        this.state = {

            Currency: Currency !== undefined ? Currency : [],
            selectedCurrency: currencyName !== undefined ? currencyName : R.strings.selectCurrency,

            ServiceProvider: ServiceProvider !== undefined ? ServiceProvider : [],
            selectedProvider: selectedProvider !== undefined ? selectedProvider : R.strings.selectProvider,
            SerProId: SerProId !== undefined ? SerProId : '',

            GenerateMismatch: GenerateMismatch,

            ArbiExchangeBalResponse: item !== undefined ? item : [],
            ArbitrageExchangeBalListState: null,

            searchInput: '',
            isFirstTime: true,
            refreshing: false,
            isDrawerOpen: true,
        }

        // Create reference
        this.drawer = React.createRef()

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress = () => {
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
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearArbitrageExchangeBalData()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Arbitrage Exchange Bal
            let req = {
                SMSCode: this.state.selectedCurrency,
                SerProId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.SerProId : '',
                GenerateMismatch: (this.state.GenerateMismatch == true &&
                    (this.state.selectedCurrency != R.strings.selectCurrency &&
                        this.state.selectedProvider != R.strings.selectProvider)) ? 1 : '', // For genrate mismatch functionality
            }

            // Call Get Arbitrage Exchange Bal API
            this.props.getArbitrageExchangeBalList(req);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Reset Filter
    onResetPress = async () => {
        // Close drawer
        this.drawer.closeDrawer()

        // set Initial State
        this.setState({
            searchInput: '',
            selectedPage: 1,
            GenerateMismatch: false,
            SerProId: this.state.ServiceProvider[1].Id,
            selectedCurrency: this.state.Currency[1].CoinName,
            selectedProvider: this.state.ServiceProvider[1].ProviderName,
        })

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Arbitrage Exchange Bal List
            let req = {
                SMSCode: this.state.Currency[1].CoinName,
                SerProId: this.state.ServiceProvider[1].Id,
                GenerateMismatch: (this.state.GenerateMismatch == true &&
                    (this.state.selectedCurrency != R.strings.selectCurrency &&
                        this.state.selectedProvider != R.strings.selectProvider)) ? 1 : '', // For genrate mismatch functionality
            }

            //Call Get Arbitrage Exchange Bal List API
            this.props.getArbitrageExchangeBalList(req);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Call api when user pressed on complete button
    onCompletePress = async () => {

        //For Input validations
   /*      if (this.state.selectedProvider === R.strings.selectProvider) {
            this.toast.Show(R.strings.selectProvider)
        } else  */if (this.state.selectedCurrency === R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
        } else {
            // Close drawer
            this.drawer.closeDrawer()

            // check internet connection
            if (await isInternet()) {

                let req = {
                    SerProId: this.state.selectedProvider == R.strings.selectProvider ? '' : this.state.SerProId,
                    SMSCode: this.state.selectedCurrency,
                    GenerateMismatch: (this.state.GenerateMismatch == true &&
                        (this.state.selectedCurrency != R.strings.selectCurrency &&
                            this.state.selectedProvider != R.strings.selectProvider)) ? 1 : '', // For genrate mismatch functionality
                }
                // Call Service Provicer List Api
                this.props.getArbitrageExchangeBalList(req)
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
            };
        }

        // To Skip Render if old and new props are equal
        if (ArbitrageExchangeBalListScreen.oldProps !== props) {
            ArbitrageExchangeBalListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { ArbitrageExchangeBalList } = props.ArbitrageExchangeBalResult;

            // ArbitrageExchangeBalList is not null
            if (ArbitrageExchangeBalList) {
                try {
                    if (state.ArbitrageExchangeBalListState == null || (state.ArbitrageExchangeBalListState != null && ArbitrageExchangeBalList !== state.ArbitrageExchangeBalListState)) {

                        //succcess response fill the list 
                        if (validateResponseNew({ response: ArbitrageExchangeBalList, isList: true })) {

                            return Object.assign({}, state, {
                                ArbitrageExchangeBalListState: ArbitrageExchangeBalList,
                                ArbiExchangeBalResponse: parseArray(ArbitrageExchangeBalList.Data),
                                refreshing: false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                ArbitrageExchangeBalListState: null,
                                ArbiExchangeBalResponse: [],
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ArbitrageExchangeBalListState: null,
                        ArbiExchangeBalResponse: [],
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

        let resolveBalanceMismatchData = null

        if (this.state.selectedProvider !== R.strings.selectProvider && this.state.selectedCurrency !== R.strings.selectCurrency) {
            resolveBalanceMismatchData = [{
                isToggle: this.state.GenerateMismatch,
                backgroundColor: 'transparent', title: R.strings.resolveBalanceMismatch,
                onValueChange: () => this.setState({ GenerateMismatch: !this.state.GenerateMismatch })
            },
            ]
        }

        return (
            // for show filter of fromdate, todate,currency and status data
            <FilterWidget
                onResetPress={this.onResetPress}
                toastRef={component => this.toast = component} featureSwitchs={resolveBalanceMismatchData}
                onCompletePress={this.onCompletePress}
                pickers={[
                    {
                        title: R.strings.ServiceProvider,
                        array: this.state.ServiceProvider,
                        selectedValue: this.state.selectedProvider,
                        onPickerSelect: (index, object) => this.setState({ selectedProvider: index, SerProId: object.Id })
                    },
                    {
                        title: R.strings.Currency,
                        array: this.state.Currency,
                        selectedValue: this.state.selectedCurrency,
                        onPickerSelect: (index) => this.setState({ selectedCurrency: index })
                    }
                ]}
            />
        )
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { ArbitrageExchangeBalLoading } = this.props.ArbitrageExchangeBalResult

        // For searching functionality
        let finalItems = this.state.ArbiExchangeBalResponse.filter(item => (
            item.CurrencyName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.ProviderName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Balance.toFixed(8).toString().includes(this.state.searchInput) ||
            item.WalletBalance.toFixed(8).toString().includes(this.state.searchInput)
        ))

        return (
            //DrawerLayout for Arbitrage Exchange Bal Filteration
            <Drawer
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })} onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                drawerWidth={R.dimens.FilterDrawarWidth}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                ref={cmpDrawer => this.drawer = cmpDrawer}
                easingFunc={Easing.ease}>

                <SafeView style={{  backgroundColor: R.colors.background, flex: 1, }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        isBack={true}
                        title={R.strings.arbitrageExchangeBal}
                        onBackPress={() => this.onBackPress()}
                        nav={this.props.navigation}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            (ArbitrageExchangeBalLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) => <ArbitrageExchangeBalListItem
                                        index={index}
                                        item={item}
                                        size={finalItems.length}
                                    />
                                    }
                                    // assign index as key value to Arbitrage Exchange Bal list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // For Refresh Functionality In Arbitrage Exchange Bal FlatList Item
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
                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class ArbitrageExchangeBalListItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let { size, index, item, onPress } = this.props
        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                    flex: 1,    
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
                        flex: 1, borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                    }} onPress={onPress}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {/* Currency Image */}
                            <ImageViewWidget url={item.CurrencyName ? item.CurrencyName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                {/* for show currency name and balance */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.CurrencyName}</Text>
                                        <Text style={{ color: R.colors.successGreen, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{item.ProviderName ? ' ' + item.ProviderName : ''}</Text>
                                    </View>

                                    <Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
                                        {(parseFloatVal(item.Balance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Balance).toFixed(8)) : '-')}
                                    </Text>
                                </View>

                                {/* Wallet Balance */}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.walletBalance + ': '}</TextViewHML>
                                    <TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{(parseFloatVal(item.WalletBalance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.WalletBalance).toFixed(8)) : '-')}</TextViewHML>
                                </View>

                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get arbitrage exchange bal data from reducer
        ArbitrageExchangeBalResult: state.ArbitrageExchangeBalReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Arbitrage Exchange Bal Action
    getArbitrageExchangeBalList: (payload) => dispatch(getArbitrageExchangeBalList(payload)),
    // Clear Arbitrage Exchange Bal Data Action
    clearArbitrageExchangeBalData: () => dispatch(clearArbitrageExchangeBalData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageExchangeBalListScreen)