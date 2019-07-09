import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Linking, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { getOutgoingTransactionsReport } from '../../actions/Reports/TradeInOutAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import Separator from '../../native_theme/components/Separator';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import R from '../../native_theme/R';
import ImageViewWidget from '../Widget/ImageViewWidget';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class TransferOutHistoryResult extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            searchInput: '',
            row: [],
            response: [],
            refreshing: false,
            isFirstTime: true,
        };

        //To Bind All Method
        this.onTrnLinkPress = this.onTrnLinkPress.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call OutGoing Transfer Out History from API
            this.props.getOutgoingTransactionsReport();
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    //This Method Is used to open Address in Browser With Specific Link
    onTrnLinkPress = (item) => {
        try {
            let hasLink = (item.hasOwnProperty('ExplorerLink')) ? JSON.parse(item.ExplorerLink) : '';
            Linking.openURL((hasLink.length) ? hasLink[0].Data + '/' + item.TrnID : item.TrnID);
        } catch (error) {
            //handle catch block here
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call OutGoing Transfer Out History from API
            this.props.getOutgoingTransactionsReport();
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

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
        if (TransferOutHistoryResult.oldProps !== props) {
            TransferOutHistoryResult.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { OutGoingTransactionData, OutGoingTransactionFetchData } = props;

            //To Check Transfer Out History Data Fetch
            if (!OutGoingTransactionFetchData) {
                try {

                    if (validateResponseNew({ response: OutGoingTransactionData.BizResponseObj, statusCode: OutGoingTransactionData.statusCode, isList: true })) {

                        //check Transfer Out History Api Response is an Array Or not
                        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                        var resData = OutGoingTransactionData.OutGoingTransactions;
                        var resArr = [];
                        if (!Array.isArray(resData)) {
                            resArr.push(resData);
                        }
                        return {
                            ...state,
                            response: (Array.isArray(resData)) ? resData : resArr,
                            refreshing: false,
                        };
                    } else {
                        return {
                            ...state,
                            response: [],
                            refreshing: false
                        };
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false
                    };
                }
            }
        }
        return null;
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { Loading } = this.props;
        //----------

        //for final items from search input (validate on Amount , TrnID  and WalletType)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(trnOutHistoryItem => (('' + trnOutHistoryItem.Amount).includes(this.state.searchInput) || ('' + trnOutHistoryItem.TrnID).includes(this.state.searchInput.toLowerCase()) || trnOutHistoryItem.WalletType.toLowerCase().includes(this.state.searchInput.toLowerCase())));

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.TransferoutHistory}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />

                {/* To Check Response fetch or not if Loading = true then display progress bar else display List*/}
                {Loading && !this.state.refreshing ?
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
                                        <TransferOutHistoryList
                                            trnOutHistoryItem={item}
                                            trnOutHistoryIndex={index}
                                            trnOutHistorySize={this.state.response.length}
                                            onTrnIdPress={() => this.onTrnLinkPress(item)} />
                                    }
                                    /* assign index as key valye to Transfer InOut History list item */
                                    keyExtractor={(item, index) => index.toString()}
                                    /* For Refresh Functionality In Transfer Out History FlatList Item */
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    } />
                            </View>
                            :
                            !Loading && <ListEmptyComponent />
                        }
                    </View>
                }
            </SafeView>
        );
    }
}

// This Class is used for display record in list
class TransferOutHistoryList extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.trnOutHistoryItem === nextProps.trnOutHistoryItem) {
            return false
        }
        return true
    }

    render() {

        // get required fields from props
        let trnOutHistoryItem = this.props.trnOutHistoryItem
        let { trnOutHistoryIndex, trnOutHistorySize } = this.props;

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (trnOutHistoryIndex == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (trnOutHistoryIndex == trnOutHistorySize - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1,
                        flexDirection: 'column',
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                    }}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {/* Currency Image */}
                            <ImageViewWidget url={trnOutHistoryItem.WalletType ? trnOutHistoryItem.WalletType : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                {/* Amount , Currecncy Name and Transaction No */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{(parseFloatVal(trnOutHistoryItem.Amount).toFixed(8).toString()) !== 'NaN' ? parseFloatVal(trnOutHistoryItem.Amount).toFixed(8).toString() : '-'} {trnOutHistoryItem.WalletType ? trnOutHistoryItem.WalletType : '-'}</Text>
                                    {trnOutHistoryItem.TrnNo ?
                                        <View style={{ flexDirection: 'row', }}>
                                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Trn_No} : </TextViewHML>
                                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(trnOutHistoryItem.TrnNo)}</TextViewHML>
                                        </View>
                                        : null
                                    }
                                </View>

                                {/* To Address */}
                                <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.from} : </TextViewHML>
                                    <TextViewHML style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{trnOutHistoryItem.Address ? trnOutHistoryItem.Address : '-'}</TextViewHML>
                                </View>
                            </View>
                        </View >

                        {/* Transaction Id */}
                        <View style={{ flex: 1, marginTop: R.dimens.widgetMargin, }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.txnid.toUpperCase()}</Text>
                                <Separator style={{ flex: 1, justifyContent: 'center' }} />
                            </View>
                            {
                                (trnOutHistoryItem.TrnID && trnOutHistoryItem.ExplorerLink) ?
                                    <TouchableOpacity onPress={this.props.onTrnIdPress}>
                                        <TextViewHML style={{ marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallestText, color: R.colors.accent, }}>{trnOutHistoryItem.TrnID ? trnOutHistoryItem.TrnID : '-'}</TextViewHML>
                                    </TouchableOpacity> :
                                    <TextViewHML style={{ marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{trnOutHistoryItem.TrnID ? trnOutHistoryItem.TrnID : '-'}</TextViewHML>
                            }
                        </View>

                        {/* Confiramtion , Confiramation Count and DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widget_left_right_margin }}>
                            <StatusChip
                                color={R.colors.yellow}
                                value={(trnOutHistoryItem.ConfirmationCount ? trnOutHistoryItem.ConfirmationCount : '-') + '/' + (trnOutHistoryItem.Confirmations ? trnOutHistoryItem.Confirmations : '-') + ' ' + R.strings.Conf} />
                            <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(trnOutHistoryItem.Date)}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

const mapStateToProps = (state) => {
    return {
        //Updated Data For Transfer In History Action
        OutGoingTransactionData: state.TransferInOutReducer.OutGoingTransactionData,
        OutGoingTransactionFetchData: state.TransferInOutReducer.OutGoingTransactionFetchData,
        Loading: state.TransferInOutReducer.Loading
    }
};

const mapDispatchToProps = (dispatch) => ({
    //Perform OutGoing Transaction Report In History Action
    getOutgoingTransactionsReport: () => dispatch(getOutgoingTransactionsReport())
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferOutHistoryResult);