import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, addPages, parseFloatVal } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, } from '../../validations/CommonValidation';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import { getFollowerList as getFollowerListApi } from '../../actions/SocialProfile/SocialProfileActions';
import PaginationWidget from '../Widget/PaginationWidget';
import { AppConfig } from '../../controllers/AppConfig';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class FollowerList extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            row: [],
            response: [],
            searchInput: '',
            refreshing: false,
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            totalCount: 0,
            getFollowerList: null,
            isFirstTime: true,
        };

        //To Bind All Method
        this.onPageChange = this.onPageChange.bind(this);
        this.onRefresh = this.onRefresh.bind(this);

        //initial Request for api call
        this.Request = {
            PageIndex: 1,
            Page_Size: this.state.PageSize,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get follower list from API
            this.props.getFollowerList(this.Request);
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
        if (FollowerList.oldProps !== props) {
            FollowerList.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { getFollowerList } = props.Listdata;

            //To Check  Data Fetch or Not
            if (getFollowerList) {
                try {
                    if (state.getFollowerList == null || (state.getFollowerList != null && getFollowerList !== state.getFollowerList)) {

                        //succcess response fill the list 
                        if (validateResponseNew({ response: getFollowerList, isList: true })) {
                            return Object.assign({}, state, {
                                getFollowerList,
                                response: parseArray(getFollowerList.FollowerList),
                                refreshing: false,
                                row: addPages(getFollowerList.Totalcount)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                getFollowerList: null,
                                refreshing: false,
                                response: [],
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        getFollowerList: null,
                        refreshing: false,
                        response: [],
                        row: [],
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null
    }

    //For Swipe to referesh Functionality
    async onRefresh() {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                ...this.Request,
                PageIndex: this.state.selectedPage,
            }

            //Call Get follower list from API
            this.props.getFollowerList(this.Request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        /* stop twice api call  */
        return isCurrentScreen(nextProps);
    };

    // Pagination Method Called When User Change Page  
    async onPageChange(pageNo) {

        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pageNo });
            if (await isInternet()) {

                //Bind request
                this.Request = {
                    ...this.Request,
                    PageIndex: pageNo,
                }
                this.props.getFollowerList(this.Request)
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { followerLoading } = this.props.Listdata;
        let finalItems = this.state.response

        //for final items from search input
        //default searchInput is empty so it will display all records.
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item =>
                (item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
                (item.Mobile.toString().toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
                (item.ConfigKey.toString().toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
                (item.TradePercentage.toString().includes(this.state.searchInput))
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.followerList}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* List Items */}
                    {/* To Check Response fetch or not if followerLoading = true then display progress bar else display List*/}
                    {
                        (followerLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                /* render all item in list */
                                renderItem={({ item, index }) =>
                                    <FolllowerListItem
                                        item={item}
                                        index={index}
                                        size={this.state.response.length} />
                                }
                                /* assign index as key valye to list item */
                                keyExtractor={(_item, index) => index.toString()}
                                contentContainerStyle={contentContainerStyle(finalItems)}
                                ListEmptyComponent={<ListEmptyComponent />}
                                /* For Refresh Functionality In FlatList Item */
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />
                                }
                            />
                    }
                    {/*To Set Pagination View  */}
                    <View>
                        {finalItems.length > 0 &&
                            <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                        }
                    </View>
                </View>
            </SafeView>
        );
    }
}

// This Class is used for display record in list
class FolllowerListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item || this.props.index === nextProps.index || this.props.size === nextProps.size) {
            return false
        }
        return true
    }

    render() {
        let item = this.props.item;
        let props = this.props
        //tradeType 1 = Copy Trade 
        //tradeType 0 = Mirror Trade
        let tradeType = item.ConfigKey === "Can_Copy_Trade" ? 1 : 0
        //to get single value after point
        let tradePercentage = parseFloatVal(item.TradePercentage).toFixed(1)

        return (
            <AnimatableItem>
                <View style={{
                    marginTop: (props.index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (props.index == props.size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flexDirection: 'column',
                    marginRight: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        flex: 1,
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View>
                                <Text style={[this.mystyle().card_tag_value, { fontFamily: Fonts.MontserratSemiBold }]} >{item.UserName}</Text>
                                <TextViewHML style={[this.mystyle().card_tag_value, { fontSize: R.dimens.secondCurrencyText, color: R.colors.textSecondary }]} >{item.Mobile}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <TextViewHML style={[this.mystyle().card_tag_value, { fontSize: R.dimens.mediumText, color: R.colors.yellow }]} >{validateValue(tradePercentage)} <TextViewHML style={{ fontSize: R.dimens.smallestText }}>%</TextViewHML></TextViewHML>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin }}>
                            <StatusChip
                                color={R.colors.accent}
                                value={tradeType == 1 ? R.strings.copy : R.strings.mirror} />
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };

    mystyle = () => {
        return {
            card_tag_value: {
                fontSize: R.dimens.mediumText,
                color: R.colors.textPrimary,
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For Follwerlist Action
        Listdata: state.SocialProfileReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //get follower list
        getFollowerList: (Request) => dispatch(getFollowerListApi(Request)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerList)