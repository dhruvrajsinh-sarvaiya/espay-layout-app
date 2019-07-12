import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import { getLeaderBoardList } from '../../actions/Wallet/LeaderBoardAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, } from '../../validations/CommonValidation';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import ImageButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class LeaderBoardList extends Component {

    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            isFirstTime: true,
        };

    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind request for leaderboard
            var leaderRequest = { UserCount: 25 };

            // call Leader Board Api
            this.props.getLeaderBoardList(leaderRequest);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind request for leaderboard
            var leaderRequest = { UserCount: 25 };

            // call Leader Board Api
            this.props.getLeaderBoardList(leaderRequest);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    shouldComponentUpdate = (nextProps, nextState) => {
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
        if (LeaderBoardList.oldProps !== props) {
            LeaderBoardList.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { LeaderBoardListFetchData, LeaderBoardListdata } = props;

            //To Check Leader Board List Fetch Or Not
            if (!LeaderBoardListFetchData) {
                try {
                    if (validateResponseNew({ response: LeaderBoardListdata, isList: true })) {
                        var resData = parseArray(LeaderBoardListdata.Data);
                        return Object.assign({}, state, {
                            response: resData,
                            refreshing: false,
                        })
                    }
                    else {
                        return Object.assign({}, state, {
                            refreshing: false,
                            response: []
                        })
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        refreshing: false,
                        response: []
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null;
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { LeaderBoardListisFetching } = this.props;
        //----------

        //for final items from search input (validate on UserName and Email)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) || item.Email.toLowerCase().includes(this.state.searchInput.toLowerCase()));

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.LeaderBoard}
                    isBack={true}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                    nav={this.props.navigation}
                />

                {/* To Check Response fetch or not if LeaderBoardListisFetching = true then display progress bar else display List*/}
                {(LeaderBoardListisFetching && !this.state.refreshing) ?
                    <ListLoader />
                    :
                    <View style={{ flex: 1 }}>

                        {finalItems.length ?
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    /* render all item in list */
                                    renderItem={({ item, index }) => <FlatListItems Items={item} leaderListIndex={index} leaderListSize={this.state.response.length} />}
                                    /* assign index as key valye to LeaderBoard list item */
                                    keyExtractor={(item, index) => index.toString()}
                                    /* For Refresh Functionality In LeaderBoard FlatList Item */
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    } />
                            </View>
                            : !LeaderBoardListisFetching && <ListEmptyComponent />
                        }
                    </View>
                }
            </SafeView>
        );
    }
}

// This Class is used for display record in list
class FlatListItems extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.Items === nextProps.Items) {
            return false
        }
        return true
    }

    render() {

        let item = this.props.Items;
        let { leaderListIndex, leaderListSize, } = this.props;

        return (
            <AnimatableItem>

                <View style={{
                    flex: 1,
                    marginTop: (leaderListIndex == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (leaderListIndex == leaderListSize - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                }}>

                    <CardView style={{
                        flex: 1,
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        {/* User Name and Up or Down Arrow */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ flex: 1, color: R.colors.listSeprator, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold, }}>{item.UserName ? item.UserName : '-'}</Text>
                            <ImageButton
                                style={
                                    {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: item.ProfitAmount >= 0 ? R.colors.successGreen : R.colors.failRed,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                        marginRight: R.dimens.padding_left_right_margin,
                                    }}
                                icon={item.ProfitAmount >= 0 ? R.images.UP_ARROW_ICON : R.images.DOWN_ARROW_ICON}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                            />
                        </View>

                        {/* Email Address */}
                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{item.Email ? item.Email : '-'}</TextViewHML>

                        {/* Static P/L Text */}
                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{R.strings.profitLossSmall}</TextViewHML>

                        {/* Profit Amount and Percentage */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={{ color: item.ProfitAmount >= 0 ? R.colors.successGreen : R.colors.failRed, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.ProfitAmount)}</Text>
                            <Text style={{ color: item.ProfitAmount >= 0 ? R.colors.successGreen : R.colors.failRed, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.ProfitPer)} %</Text>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //Updated Data For Leader Boader List
        LeaderBoardListFetchData: state.LeaderBoardReducer.LeaderBoardListFetchData,
        LeaderBoardListdata: state.LeaderBoardReducer.LeaderBoardListdata,
        LeaderBoardListisFetching: state.LeaderBoardReducer.LeaderBoardListisFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Leader Board List Action
        getLeaderBoardList: (leaderRequest) => dispatch(getLeaderBoardList(leaderRequest)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoardList)