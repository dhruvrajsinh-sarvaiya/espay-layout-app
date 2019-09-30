import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import PaginationWidget from '../../widget/PaginationWidget';
import { AppConfig } from '../../../controllers/AppConfig';
import SafeView from '../../../native_theme/components/SafeView';
import { getArbiUserWalletLedger, clearArbiUserWalletLedger } from '../../../actions/Arbitrage/ArbitrageUserWalletLedgerActions';
import WalletOrgLedgerListItem from '../../Wallet/Reports/WalletOrgLedgerListItem';

class ArbiUserWalletLedgerListScreen extends Component {
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
            selectedPage: 1,
            row: params.allData != undefined ? addPages(params.allData.TotalCount) : [],
            WalletId: params.WalletId != undefined ? params.WalletId : '',
            refreshing: false,
            isFirstTime: true,
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentWillUnmount() {

        // call api for margin Wallet
        this.props.clearArbiUserWalletLedger();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind Request for user Ledger
            let requestLedgerdata = {
                FromDate: this.state.FromDate != '' ? this.state.FromDate : "",
                ToDate: this.state.ToDate != '' ? this.state.ToDate : "",
                WalletId: this.state.WalletId,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize
            }

            //call api User Wallet Ledger
            this.props.getArbiUserWalletLedger(requestLedgerdata)
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
        if (ArbiUserWalletLedgerListScreen.oldProps !== props) {
            ArbiUserWalletLedgerListScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {


            //Get All Updated field of Particular actions
            const { walletLedgerData } = props.data;

            //To Check userLedger Data Data Fetch or Not
            if (walletLedgerData) {
                try {
                    if (state.walletLedgerDataState == null || (state.walletLedgerDataState != null && walletLedgerData !== state.walletLedgerDataState)) {
                        if (validateResponseNew({ response: walletLedgerData, isList: true })) {
                            let res = parseArray(walletLedgerData.WalletLedgers);
                            return Object.assign({}, state, {
                                data: res,
                                refreshing: false,
                                row: addPages(walletLedgerData.TotalCount),walletLedgerData,
                            })
                        }
                        else {
                            return Object.assign({}, state, {
                                refreshing: false,
                                data: [], walletLedgerData
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        refreshing: false,
                        data: [],
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

                // Bind Request for user Ledger
                let requestLedgerdata = {
                    FromDate: this.state.FromDate != '' ? this.state.FromDate : "",
                    ToDate: this.state.ToDate != '' ? this.state.ToDate : "",WalletId: this.state.WalletId,
                    PageSize: this.state.PageSize,
                    PageNo: pageNo - 1,
                }

                //call api User Wallet Ledger
                this.props.getArbiUserWalletLedger(requestLedgerdata);
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
            item.LedgerId.toString().toLowerCase().includes(this.state.search) ||
            item.PreBal.toFixed(8).toString().includes(this.state.search) ||
            item.PostBal.toFixed(8).toString().includes(this.state.search) ||
            item.CrAmount.toFixed(8).toString().includes(this.state.search) ||
            item.DrAmount.toFixed(8).toString().includes(this.state.search) ||
            item.TrnDate.toLowerCase().includes(this.state.search.toLowerCase())
        ));

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.walletLedger}
                    isBack={true}
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
                                    <View style={{ flex: 1 }}>
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
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />}
                                        />
                                    </View>
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
    //Updated Data For ArbitrageUserWalletLedgerReducer Data 
    let data = {
        ...state.ArbitrageUserWalletLedgerReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform User Wallet Ledger Action
        getArbiUserWalletLedger: (requestLedgerData) => dispatch(getArbiUserWalletLedger(requestLedgerData)),
        // Perform Action for clear data from reducer
        clearArbiUserWalletLedger: () => dispatch(clearArbiUserWalletLedger()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArbiUserWalletLedgerListScreen) 