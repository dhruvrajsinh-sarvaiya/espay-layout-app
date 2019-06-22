import React, { Component } from 'react';
import { View, ScrollView, FlatList, Image, TouchableWithoutFeedback, } from 'react-native';
import { connect } from 'react-redux';
import { getAllBalance, getWalletsBalance, clearReducer } from '../../actions/Wallet/FundViewAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme } from '../../controllers/CommonUtils';
import { isInternet, validateValue, validateResponseNew } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import Separator from '../../native_theme/components/Separator';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ImageButton from '../../native_theme/components/ImageTextButton';
import ListLoader from '../../native_theme/components/ListLoader';
import R from '../../native_theme/R';
import { ServiceUtilConstant } from '../../controllers/Constants';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../Widget/ImageViewWidget';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

const { width, } = R.screen();

class FundViewScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            symbol: '',
            TotalBalance: '',
            response: [],
            showBalance: false,
            isActive: false,
            showSecureView: false,
            selectedCurrency: '',
            WalletBalanceData: null,
            isFirstTime: true,
        };
        //----------

        //To Bind All Method
        this.RedirectDetailScreen = this.RedirectDetailScreen.bind(this);
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get All Balance from API
            this.props.getAllBalance();
            //----------
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        // call action for clear Reducer value 
        this.props.clearReducer();
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { WalletBalanceFetchData, WalletBalanceData } = this.props;

        if (WalletBalanceData !== prevProps.WalletBalanceData) {

            //To Check Wallet Balance Api Data Fetch Or Not
            if (!WalletBalanceFetchData) {
                try {
                    if (validateResponseNew({ response: WalletBalanceData.BizResponseObj, statusCode: WalletBalanceData.statusCode })) {
                        //Redirect User To Fund Detail Screen
                        var { navigate } = this.props.navigation;
                        navigate('FundDetailScreen', { WalletBalanceData: WalletBalanceData, AllBalanceData: this.state.response, selectedCurrency: this.state.selectedCurrency });
                    }
                }
                catch (error) {
                    //handle catch part
                }
            }
        }
    };

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { AllBalanceData, AllBalanceFetchData } = props;

            //To Check Get All Balance Api Data Fetch Or Not
            if (!AllBalanceFetchData) {
                try {
                    if (validateResponseNew({ response: AllBalanceData.BizResponseObj, statusCode: AllBalanceData.statusCode, isList: true })) {
                        return {
                            ...state,
                            response: AllBalanceData.Response,
                            symbol: AllBalanceData.Response[0].WalletType,
                            TotalBalance: AllBalanceData.TotalBalance
                        }
                    } else {
                        return {
                            ...state,
                            response: [],
                            TotalBalance: '-',
                            symbol: ''
                        }
                    }
                }
                catch (error) {
                    return {
                        ...state,
                        response: [],
                        TotalBalance: '-',
                        symbol: ''
                    }
                }
            }
        }
        return null;
    }

    //Redirect User To Fund Detail Screen
    RedirectDetailScreen = async (WalletType) => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            this.setState({ selectedCurrency: WalletType })
            //Bind Request
            let walletBalanceRequest = {
                WalletType: WalletType
            }
            //Call Get Wallet Balance from API
            this.props.getWalletsBalance(walletBalanceRequest, WalletType);
            //----------
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { AllBalanceIsFetching, WalletBalanceIsFetching } = this.props;
        //----------

        let finalItems = this.state.response;

        var { navigate } = this.props.navigation;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Funds}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* To Set ProgressDialog as per our theme */}
                <ProgressDialog isShow={WalletBalanceIsFetching} />

                <ScrollView stickyHeaderIndices={[1]} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>

                    <TotalBalanceCard
                        TotalBalance={this.state.TotalBalance}
                        onDepositPress={() => navigate('CoinSelectScreen', { isAction: ServiceUtilConstant.From_Deposit })}
                        onWithdrawPress={() => navigate('CoinSelectScreen', { isAction: ServiceUtilConstant.From_Withdraw })}
                    >
                    </TotalBalanceCard>

                    {/* Fund View Stickey Header */}
                    <View style={{ marginTop: R.dimens.margin_top_bottom }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ showBalance: !this.state.showBalance, isActive: !this.state.isActive })}>
                            <LinearGradient
                                locations={[0, 1]}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                colors={[R.colors.linearStart, R.colors.linearEnd]}>
                                <View style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                }}>
                                    <ImageButton
                                        isMR
                                        name={this.state.showBalance ? R.strings.HideBalance : R.strings.ShowBalance}
                                        icon={R.images.IC_SHOW_PROPERTY}
                                        onPress={() => this.setState({ showBalance: !this.state.showBalance, isActive: !this.state.isActive })}
                                        style={this.styles().showBalance}
                                        textStyle={{ color: R.colors.white, marginLeft: R.dimens.widgetMargin, }}
                                        iconStyle={{ tintColor: R.colors.white, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, marginLeft: R.dimens.padding_left_right_margin, }}
                                    />
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: R.dimens.margin }}>
                                        <Image
                                            source={this.state.isActive ? R.images.IC_COLLAPSE_ARROW : R.images.IC_EXPAND_ARROW}
                                            style={{
                                                alignSelf: 'center',
                                                tintColor: R.colors.white,
                                                height: R.dimens.SMALL_MENU_ICON_SIZE,
                                                width: R.dimens.SMALL_MENU_ICON_SIZE
                                            }}
                                        />
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableWithoutFeedback>
                    </View>

                    {/* Fund View Get All Balance */}
                    <View style={{ paddingLeft: R.dimens.padding_left_right_margin, paddingRight: R.dimens.padding_left_right_margin, flex: 1 }}>

                        {/* To Check Response fetch or not if WithdrawHistoryisFetching = true then display progress bar else display List*/}
                        {AllBalanceIsFetching ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {this.state.showBalance ?

                                    <View style={{ flex: 1 }}>

                                        {finalItems.length ?

                                            <FlatList
                                                data={finalItems}
                                                showsVerticalScrollIndicator={false}
                                                /* render all item in list */
                                                renderItem={({ item, index }) =>
                                                    <FlatListItem
                                                        item={item}
                                                        showSecureView={this.state.showSecureView}
                                                        onPress={() => { this.RedirectDetailScreen(item.WalletType) }}
                                                    ></FlatListItem>}

                                                /* assign index as key value to Fund View item */
                                                keyExtractor={(item, index) => index.toString()}
                                                /* for item seprator on Fund View item */
                                                ItemSeparatorComponent={() => <Separator style={{ marginLeft: 0, marginRight: 0 }} />}
                                            />
                                            :
                                            <ListEmptyComponent />
                                        }
                                    </View>
                                    : null
                                }
                            </View>
                        }
                    </View>
                </ScrollView>
            </SafeView>
        );
    }

    // style for this class
    styles = () => {
        return {
            showBalance: {
                margin: 0,
                flexDirection: 'row-reverse',
                alignSelf: 'flex-start',
                marginTop: R.dimens.widget_top_bottom_margin,
                marginBottom: R.dimens.widget_top_bottom_margin,
            }
        }
    }
}

//Display Total Balance
class TotalBalanceCard extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.TotalBalance === nextProps.TotalBalance) {
            return false
        }
        return true
    }

    render() {
        return (
            <View style={this.styles().container}>
                <LinearGradient style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    borderRadius: R.dimens.margin_left_right,
                }}
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={[R.colors.linearStart, R.colors.linearEnd]}>

                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center', flex: 1, padding: R.dimens.margin
                    }}>

                        <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.white, textAlign: 'center' }}>{R.strings.TotalAmount}</TextViewMR>

                        {/* to set Avalible Balnace and Amount */}
                        <TextViewMR style={{ flex: 1, marginTop: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.mediumText, color: R.colors.white, textAlign: 'center' }}>{validateValue(this.props.TotalBalance) !== '-' ? (validateValue(this.props.TotalBalance) + ' BTC') : '-'}</TextViewMR>

                        {/* to set withdraw and deposit button in view */}
                        <View style={{ flex: 1, marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'row' }}>

                            <ImageButton
                                isHML
                                name={R.strings.deposit}
                                icon={R.images.IC_DEPOSIT}
                                onPress={this.props.onDepositPress}
                                style={this.styles().imageStyle}
                                textStyle={{ color: R.colors.white }}
                                iconStyle={{ tintColor: R.colors.white, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                            />

                            {/* show Vertical line  */}
                            <Separator width={R.dimens.LineHeight} color={R.colors.white} height={'100%'} />

                            <ImageButton
                                isHML
                                name={R.strings.withdrawal}
                                icon={R.images.IC_WITHDRAW}
                                onPress={this.props.onWithdrawPress}
                                style={this.styles().imageStyle}
                                textStyle={{ color: R.colors.white }}
                                iconStyle={{ tintColor: R.colors.white, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                            />
                        </View>
                    </View>
                </LinearGradient>
            </View>
        )
    };

    // styles for this class
    styles = () => {
        return {
            container: {
                backgroundColor: R.colors.background,
                marginTop: R.dimens.widgetMargin,
                flexDirection: 'column',
                alignItems: 'center',
            },
            imageStyle: {
                flexDirection: 'row-reverse',
                justifyContent: 'center',
                margin: 0,
                paddingTop: R.dimens.widgetMargin,
                paddingBottom: R.dimens.widgetMargin,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingRight: R.dimens.padding_left_right_margin,
                width: width / 3
            },
        }
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item &&
            this.props.showSecureView === nextProps.showSecureView) {
            return false
        }
        return true
    }

    render() {
        let item = this.props.item;
        return (
            <AnimatableItem>
                <TouchableWithoutFeedback onPress={this.props.onPress}>
                    <View style={this.mystyle().container} >

                        {/* image icon for all coin */}
                        <ImageViewWidget style={{ alignSelf: 'center', marginRight: R.dimens.margin }} url={item.WalletType ? item.WalletType : ''} width={R.dimens.dashboardMenuIcon} height={R.dimens.dashboardMenuIcon} />

                        {/* WalletType and Name */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TextViewHML style={[this.mystyle().card_tag_value, { textAlign: 'left', alignSelf: 'flex-start' }]}>{item.WalletType ? item.WalletType : '-'}</TextViewHML>
                        </View>

                        {/* Balance */}
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TextViewHML style={[this.mystyle().card_tag_value]}>{this.props.showSecureView ? '*****' : validateValue(item.Balance)}</TextViewHML>
                        </View>

                        {/* Balance */}
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={R.images.RIGHT_ARROW_DOUBLE} style={{
                                margin: R.dimens.widgetMargin,
                                marginLeft: R.dimens.WidgetPadding,
                                tintColor: R.colors.textPrimary,
                                height: R.dimens.SMALL_MENU_ICON_SIZE,
                                width: R.dimens.SMALL_MENU_ICON_SIZE
                            }} />
                        </View>
                    </View>
                </TouchableWithoutFeedback >
            </AnimatableItem>
        )
    };

    // styles for this class
    mystyle = () => {
        return {
            container: {
                flex: 1,
                flexDirection: 'row',
                paddingTop: R.dimens.widgetMargin,
                paddingBottom: R.dimens.widgetMargin,
                justifyContent: 'center',
                alignItems: 'center'
            },
            card_tag_value: {
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        // Updated Data for All Balance
        AllBalanceFetchData: state.FundViewReducer.AllBalanceFetchData,
        AllBalanceIsFetching: state.FundViewReducer.AllBalanceIsFetching,
        AllBalanceData: state.FundViewReducer.AllBalanceData,

        // Updated Data for Wallet Balance
        WalletBalanceFetchData: state.FundViewReducer.WalletBalanceFetchData,
        WalletBalanceIsFetching: state.FundViewReducer.WalletBalanceIsFetching,
        WalletBalanceData: state.FundViewReducer.WalletBalanceData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Get All Balance Action
        getAllBalance: () => dispatch(getAllBalance()),
        //To Clear Reducer
        clearReducer: () => dispatch(clearReducer()),
        // Perform Wallet Balance Action
        getWalletsBalance: (walletBalanceRequest, WalletType) => dispatch(getWalletsBalance(walletBalanceRequest, WalletType)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FundViewScreen)