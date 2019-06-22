import React, { Component } from 'react';
import { View, FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { isCurrentScreen } from '../Navigation';
import { changeTheme } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import R from '../../native_theme/R';
import { GetBalance, clearReducer } from '../../actions/PairListAction';
import { ServiceUtilConstant } from '../../controllers/Constants';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ImageViewWidget from '../Widget/ImageViewWidget';
import TextViewMR from '../../native_theme/components/TextViewMR';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class CoinSelectScreen extends Component {
    constructor(props) {
        super(props);

        //To Fetch value From Previous Screen
        const { params } = this.props.navigation.state;

        //Define All initial State
        this.state = {
            isAction: params.isAction,
            response: [],
            searchInput: '',
            refreshing: false,
            isFirstTime: true,
        };

        //Bind All Method 
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount = async () => {
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Get CoinList API
            this.props.GetBalance();
            //----------
        } else {
            this.setState({ refreshing: false });
        }

    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get CoinList API
            this.props.GetBalance();

        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    //Clear Reducer Data When Screen redirect To any Screen
    componentWillUnmount = () => {
        this.props.clearReducer();
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
        if (CoinSelectScreen.oldProps !== props) {
            CoinSelectScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { Balancedata, BalanceFetchData } = props;

            //To Check CoinList Api Data Fetch Or Not
            if (!BalanceFetchData) {
                try {
                    if (validateResponseNew({ response: Balancedata, isList: true })) {
                        //check Balance Data Response is an Array Or not
                        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                        var resData = [];
                        //Check Coin Select Screen Open From Deposit Menu
                        if (state.isAction == ServiceUtilConstant.From_Deposit) {
                            for (var i = 0; i < Balancedata.Response.length; i++) {
                                //Check IsDeposit Bit 1 From response then Store All Coin in state 
                                if (Balancedata.Response[i].IsDeposit == 1) {
                                    resData.push({ SMSCode: Balancedata.Response[i].SMSCode, ServiceId: Balancedata.Response[i].ServiceId, Name: Balancedata.Response[i].Name });
                                }
                            }
                            return Object.assign({}, state, {
                                response: resData,
                                refreshing: false
                            })
                        }
                        //Check Coin Select Screen Open From Withdraw Menu
                        else if (state.isAction == ServiceUtilConstant.From_Withdraw) {
                            for (var i = 0; i < Balancedata.Response.length; i++) {
                                //Check IsWithdraw Bit 1 From response then Store All Coin in state 
                                if (Balancedata.Response[i].IsWithdraw == 1) {
                                    resData.push({ SMSCode: Balancedata.Response[i].SMSCode, ServiceId: Balancedata.Response[i].ServiceId, Name: Balancedata.Response[i].Name });
                                }
                            }
                            return Object.assign({}, state, {
                                response: resData,
                                refreshing: false
                            })
                        }
                    } else {
                        return Object.assign({}, state, {
                            response: [],
                            refreshing: false
                        })
                    }
                }
                catch (error) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false
                    }
                }
            }
        }
        return null;
    }

    //This Method is Called When User Select Coin From List any Redirect To Deposit or Withdraw Screen Based On Prev Selected Trn Type
    onCoinItemSelection = (item) => {
        var { navigate } = this.props.navigation;
        if (this.state.isAction == ServiceUtilConstant.From_Deposit) {
            navigate('DepositRequest', { CoinItem: item, Response: this.state.response });
        } else if (this.state.isAction == ServiceUtilConstant.From_Withdraw) {
            navigate('WithdrawRequest', { CoinItem: item, Response: this.state.response });
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props;
        //----------

        let finalItems = this.state.response.filter(item => (item.SMSCode.toLowerCase().includes(this.state.searchInput.toLowerCase())));

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    visibleSearch={true}
                    searchHint={R.strings.searchHere}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                    onSearchCancel={() => this.props.navigation.goBack()}
                />

                <View style={{ flex: 1 }}>
                    {/* To Check Response fetch or not if loading = true then display progress bar else display List*/}
                    {(loading && !this.state.refreshing) ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>

                            {finalItems.length ?
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        /* render all item in list */
                                        renderItem={({ item, index }) =>
                                            <FlatListItem
                                                size={finalItems.length - 1}
                                                index={index}
                                                item={item}
                                                onCoinItemSelection={() => this.onCoinItemSelection(item)}>
                                            </FlatListItem>}
                                        /* assign index as key valye to Coin list item */
                                        keyExtractor={(item, index) => index.toString()}
                                        /* For Refresh Functionality In Coin FlatList Item */
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.background}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                            />
                                        } />
                                </View>
                                : !loading && <ListEmptyComponent />
                            }
                        </View>
                    }
                </View>
            </SafeView >
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
class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let { item, index, size } = this.props
        return (
            <AnimatableItem>
                {/* Coin Image With Name */}
                <TouchableWithoutFeedback onPress={this.props.onCoinItemSelection}>
                    <View style={{
                        marginLeft: R.dimens.WidgetPadding,
                        marginTop: index == 0 ? R.dimens.widget_top_bottom_margin : R.dimens.dashboardPaddingTop,
                        marginBottom: index == size ? R.dimens.widget_top_bottom_margin : R.dimens.dashboardPaddingTop,
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <ImageViewWidget url={item.SMSCode ? item.SMSCode : null} style={{ marginRight: R.dimens.margin }} width={R.dimens.LARGE_MENU_ICON_SIZE} height={R.dimens.LARGE_MENU_ICON_SIZE} />
                        <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.SMSCode ? item.SMSCode : '-'}</TextViewMR>
                    </View>
                </TouchableWithoutFeedback>
            </AnimatableItem>
        )
    };
}

function mapStatToProps(state) {
    return {
        //Updated Data For Get Balance Action
        Balancedata: state.DepositReducer.Balancedata,
        Balanceerror: state.DepositReducer.Balanceerror,
        BalanceFetchData: state.DepositReducer.BalanceFetchData,
        loading: state.DepositReducer.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Get Coin List Action
        GetBalance: () => dispatch(GetBalance()),
        //To Clear Reducer
        clearReducer: () => dispatch(clearReducer()),
    }
}
export default connect(mapStatToProps, mapDispatchToProps)(CoinSelectScreen);