import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { connect } from 'react-redux';
import { getCoinConfigurationList, clearCoinConfig } from '../../../actions/Trading/CoinConfigurationAction'
import { changeTheme, parseArray, convertDate, convertTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../../components/Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import ImageViewWidget from '../../widget/ImageViewWidget'
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class CoinConfigurationScreen extends Component {

    constructor(props) {
        super(props);

        // getting isMargin params from previous screen
        let isMargin = props.navigation.state.params && props.navigation.state.params.isMargin

        //Define All State initial state
        this.state = {
            refreshing: false,
            response: [],
            searchInput: '',
            isFirstTime: true,
            isMargin: isMargin
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            if (this.state.isMargin) {
                //Call coin config list API
                this.props.getCoinConfigurationList({ IsMargin: 1 });
            } else {

                //Call coin config list API
                this.props.getCoinConfigurationList();
            }
        }
    }

    componentWillUnmount() {
        // clear data from reducer
        this.props.clearCoinConfig();
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists as its Open Order's original Component Screen
        if (state.isFirstTime) {
            return Object.assign({}, state, {
                isFirstTime: false,
            });
        }

        // To Skip Render if old and new props are equal
        if (CoinConfigurationScreen.oldProps !== props) {
            CoinConfigurationScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {
            try {

                //Get All Updated Feild of Particular actions
                let { coinConfigurationList } = props.data;

                //if coinConfigurationList response is not null then handle resposne
                if (coinConfigurationList) {

                    //if local coinConfigurationList state is null or its not null and also different then new response then and only then validate response.
                    if (state.coinConfigurationList == null || (state.coinConfigurationList != null && coinConfigurationList !== state.coinConfigurationList)) {

                        //if favouriteList response is success then store array list else store empty list
                        if (validateResponseNew({ response: coinConfigurationList, isList: true })) {
                            let res = parseArray(coinConfigurationList.Response);
                            return Object.assign({}, state, {
                                coinConfigurationList,
                                response: res,
                                refreshing: false
                            })
                        } else {
                            return Object.assign({}, state, {
                                coinConfigurationList,
                                response: [],
                                refreshing: false
                            })
                        }
                    }
                }
            } catch (error) {
                return Object.assign({}, state, { coinConfigurationList: null, response: [], refreshing: false });
            }
        }

        return null;
    }

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {

            if (this.state.isMargin) {
                //Call coin config list API
                this.props.getCoinConfigurationList({ IsMargin: 1 });
            } else {

                //Call coin config list API
                this.props.getCoinConfigurationList();
            }
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { isLoadingCoinConfig } = this.props.data

        //for final items from search input (validate on SMSCode, StatusText)
        //default searchInput is empty so it will display all records.
        let finalItem = [];
        if (this.state.response) {
            finalItem = this.state.response.filter((item) => {
                return item.SMSCode.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                    item.StatusText.toLowerCase().includes(this.state.searchInput.toLowerCase())
            })
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.CoinConfiguration}
                    rightIcon={R.images.IC_PLUS}
                    isBack={true}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    onRightMenuPress={() => this.props.navigation.navigate('CoinConfigurationAddUpdate', { onRefresh: this.onRefresh, isMargin: this.state.isMargin })}
                    nav={this.props.navigation}
                />

                <View style={{ flex: 1, }}>

                    {/* For FlatList View */}
                    {(isLoadingCoinConfig && !this.state.refreshing) ?
                        <ListLoader />
                        :
                        <FlatList
                            data={finalItem}
                            showsVerticalScrollIndicator={false}
                            // render all item in list
                            renderItem={({ index, item }) => {
                                return <CoinConfigurationItem
                                    index={index}
                                    item={item}
                                    onEdit={() => this.props.navigation.navigate('CoinConfigurationAddUpdate', { item, isEdit: true, onRefresh: this.onRefresh, isMargin: this.state.isMargin })}
                                    onDetail={() => this.props.navigation.navigate('CoinConfigurationDetailScreen', { item })}
                                    size={this.state.response.length} />
                            }}
                            // for swipe to refresh functionality
                            refreshControl={
                                <RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => this.onRefresh(true, true)}
                                />
                            }
                            // assign index as key value to list item
                            keyExtractor={(item, index) => index.toString()}
                            // Displayed empty component when no record found 
                            ListEmptyComponent={<ListEmptyComponent
                                module={R.strings.addCoin}
                                onPress={() => this.props.navigation.navigate('CoinConfigurationAddUpdate', { onRefresh: this.onRefresh, isMargin: this.state.isMargin })}
                            />}
                            contentContainerStyle={contentContainerStyle(finalItem)}
                        />
                    }
                </View>
            </SafeView>
        );
    };
}

class CoinConfigurationItem extends Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }


    render() {

        // Get required fields from props
        let { item: { SMSCode, Name, IssueDate, CirculatingSupply, StatusText, MaxSupply, TotalSupply, Status }, index, size, onEdit, onDetail } = this.props;

        return (

            // Flatlist item animation
            <AnimatableItem>
                <View
                    style={{
                        marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginRight: R.dimens.widget_left_right_margin,
                        marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, flex: 1,
                        marginLeft: R.dimens.widget_left_right_margin,
                    }}>

                    <CardView
                        style={{
                            elevation: R.dimens.listCardElevation, flex: 1, borderRadius: 0,
                            borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                        }} onPress={onDetail}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            {/* Currency image, SMSCode, Currency name */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <ImageViewWidget url={SMSCode ? SMSCode : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, paddingLeft: R.dimens.margin }}>{SMSCode ? SMSCode : '-'}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{Name ? ' - ' + Name : '-'}</TextViewHML>
                            </View>

                            {/* Image button for detail */}
                            <ImageTextButton
                                style={{ margin: 0, padding: 0, }}
                                icon={R.images.RIGHT_ARROW_DOUBLE}
                                onPress={onDetail}
                                iconStyle={{ padding: 0, margin: 0, marginRight: R.dimens.widgetMargin, width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                            />

                        </View>

                        {/* for show CirculatingSupply , MaxSupply , TotalSupply */}
                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.cir_Supply}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{CirculatingSupply}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.max_supply}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{MaxSupply}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.total_supply}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{TotalSupply}</TextViewHML>
                            </View>
                        </View>

                        {/* for show status and issue date ,edit icon */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <StatusChip
                                    color={Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                    value={StatusText} />
                            </View>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{IssueDate ? convertDate(IssueDate) + ' ' + convertTime(IssueDate) : '-'}</TextViewHML>
                            <ImageTextButton
                                style={
                                    {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: R.colors.accent,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                        marginLeft: R.dimens.widgetMargin,
                                    }}
                                icon={R.images.IC_EDIT}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                onPress={onEdit} />
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    //data from Coin configuration reducer
    return {
        data: state.coinConfigurationReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //for coi configuration list
        getCoinConfigurationList: (payload) => dispatch(getCoinConfigurationList(payload)),
        // for clear reducer
        clearCoinConfig: () => dispatch(clearCoinConfig())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoinConfigurationScreen)