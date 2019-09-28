import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { connect } from 'react-redux';
import { changeTheme, parseArray, getCurrentDate, addPages } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import PaginationWidget from '../../widget/PaginationWidget';
import { AppConfig } from '../../../controllers/AppConfig';
import SafeView from '../../../native_theme/components/SafeView';
import { getMarginWalletLedger, clearMarginWalletLedger } from '../../../actions/Margin/WalletLedgerAction';
import WalletOrgLedgerListItem from '../../Wallet/Reports/WalletOrgLedgerListItem';

class WalletLedgerListScreen extends Component {
    constructor(props) {
        super(props);

        // data get from revious screen
        const { params } = this.props.navigation.state;

        //Define All initial State
        this.state = {
            data: params.item != undefined ? params.item : [],
            search: '',
            FromDate: params.FromDate != undefined ? params.FromDate : getCurrentDate(),
            ToDate: params.ToDate != undefined ? params.ToDate : getCurrentDate(),
            PageSize: AppConfig.pageSize,
            row: params.allData != undefined ? addPages(params.allData.TotalCount) : [],
            WalletId: params.WalletId != undefined ? params.WalletId : '',
            selectedPage: 1,
            isFirstTime: true,
            refreshing: false,
        }

        // create reference
        this.toast = React.createRef();
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentWillUnmount() {

        // call api for margin Wallet
        this.props.clearMarginWalletLedger();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind Request for marginWallet Ledger
            let requestLedgerdata = {
                ToDate: this.state.ToDate != '' ? this.state.ToDate : "",
                FromDate: this.state.FromDate != '' ? this.state.FromDate : "",
                WalletId: this.state.WalletId,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize
            }
            //call api for get MarginWalletledger detail
            this.props.getMarginWalletLedger(requestLedgerdata)
        } else {
            this.setState({ refreshing: false });
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
        if (WalletLedgerListScreen.oldProps !== props) {
            WalletLedgerListScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { walletLedgerData } = props.data;

            //To Check marginWalletLedger Data Data Fetch or Not
            if (walletLedgerData) {
                try {
                    if (state.walletLedgerData == null || (state.walletLedgerData != null && walletLedgerData !== state.walletLedgerData)) {
                        if (validateResponseNew({ response: walletLedgerData, isList: true })) {
                            let res = parseArray(walletLedgerData.WalletLedgers);
                            return Object.assign({}, state, {
                                data: res,
                                walletLedgerData,
                                row: addPages(walletLedgerData.TotalCount),
                                refreshing: false,
                            })
                        }
                        else {
                            return Object.assign({}, state, {
                                data: [],
                                refreshing: false,
                                walletLedgerData
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        data: [],
                        refreshing: false,
                    })
                }
            }
        }
        return null;
    }

    // this method is called when page change and also api call
    onPageChange = async (pageNo) => {

        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                // Bind Request for marginWallet Ledger
                let requestLedgerdata = {
                    PageNo: pageNo - 1,
                    FromDate: this.state.FromDate != '' ? this.state.FromDate : "",
                    ToDate: this.state.ToDate != '' ? this.state.ToDate : "",
                    WalletId: this.state.WalletId,
                    PageSize: this.state.PageSize
                }
                //call api for get MarginWalletledger detail
                this.props.getMarginWalletLedger(requestLedgerdata);
            }
        }
    }

    render() {

        //loading bit for handling progress dialog
        const { walletLedgerFetching } = this.props.data;

        //for final items from search input (validate on Remarks)
        //default searchInput is empty so it will display all records.
        let list = this.state.data;
        let finalItems = list.filter(item => (
            item.Remarks.toLowerCase().includes(this.state.search.toLowerCase()) ||
            item.PreBal.toString().toLowerCase().includes(this.state.search) ||
            item.LedgerId.toString().toLowerCase().includes(this.state.search) ||
            item.PostBal.toString().toLowerCase().includes(this.state.search) ||
            item.DrAmount.toString().toLowerCase().includes(this.state.search) ||
            item.CrAmount.toString().toLowerCase().includes(this.state.search) ||
            item.TrnDate.toLowerCase().includes(this.state.search.toLowerCase())
        ));

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.marginWalletLedger}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* To Check Response fetch or not if isLoadingLedgerData = true then display progress bar else display List*/}
                    {
                        walletLedgerFetching && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length > 0 ?
                                    <FlatList
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        // render all item in list
                                        renderItem={({ item, index }) =>
                                            <WalletOrgLedgerListItem
                                                item={item}
                                                index={index}
                                                size={this.state.data.length}
                                            />}
                                        // assign index as key value to list item
                                        keyExtractor={(item, index) => index.toString()}
                                        /* for refreshing data of flatlist */
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                onRefresh={this.onRefresh}
                                                progressBackgroundColor={R.colors.background}
                                                refreshing={this.state.refreshing}
                                            />}
                                    />
                                    :
                                    // Displayed empty component when no record found 
                                    <ListEmptyComponent />}
                            </View>
                    }
                </View>

                {/*To Set Pagination View  */}
                <View>
                    {finalItems.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                </View>
            </SafeView>

        )
    }

}

function mapStateToProps(state) {

    let data = {
        ...state.WalletLedgerReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform  Margin Wallet Ledger Action
        getMarginWalletLedger: (requestLedgerData) => dispatch(getMarginWalletLedger(requestLedgerData)),

        // Perform Action for clear margin data from reducer
        clearMarginWalletLedger: () => dispatch(clearMarginWalletLedger()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletLedgerListScreen) 