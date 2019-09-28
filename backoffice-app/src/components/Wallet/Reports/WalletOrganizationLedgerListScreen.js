import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages } from '../../../controllers/CommonUtils';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import PaginationWidget from '../../widget/PaginationWidget';
import { AppConfig } from '../../../controllers/AppConfig';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import SafeView from '../../../native_theme/components/SafeView';
import { getOrganizationLedger, clearOrginizationLedger } from '../../../actions/Wallet/OrginizationLedgerAction';
import WalletOrgLedgerListItem from './WalletOrgLedgerListItem';

class WalletOrganizationLedgerListScreen extends Component {
    constructor(props) {
        super(props);

        // data get from revious screen
        const { params } = this.props.navigation.state;

        //Define All initial State
        this.state = {
            data: params.item != undefined ? params.item : [],
            FromDate: params.FromDate != undefined ? params.FromDate : getCurrentDate(),
            ToDate: params.ToDate != undefined ? params.ToDate : getCurrentDate(),
            PageSize: AppConfig.pageSize, selectedPage: 1,
            search: '',
            row: params.allData != undefined ? addPages(params.allData.TotalCount) : [],
            WalletId: params.WalletId != undefined ? params.WalletId : '',
            refreshing: false, isFirstTime: true,
        }
    }

    componentDidMount() {
        // clear Orginization Ledger
        this.props.clearOrginizationLedger();

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentWillUnmount() {

        // clear Orginization Ledger
        this.props.clearOrginizationLedger();
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

            // Bind Request for Orginization  Ledger
            let requestLedgerdata = {
                FromDate: this.state.FromDate != '' ? this.state.FromDate : "",
                ToDate: this.state.ToDate != '' ? this.state.ToDate : "",
                AccWalletId: this.state.WalletId,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize
            }
            //call api for get Orginization ledger detail
            this.props.getOrganizationLedger(requestLedgerdata)
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
        if (WalletOrganizationLedgerListScreen.oldProps !== props) {
            WalletOrganizationLedgerListScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { ledgerData } = props.data;

            //To Check Orginization Ledger Data Data Fetch or Not
            if (ledgerData) {
                try {
                    if (state.ledgerData == null || (state.ledgerData != null && ledgerData !== state.ledgerData)) {
                        if (validateResponseNew({ response: ledgerData, isList: true })) {
                            let res = parseArray(ledgerData.WalletLedgers);
                            return Object.assign({}, state, {
                                data: res,
                                refreshing: false,
                                ledgerData,
                                row: addPages(ledgerData.TotalCount)
                            })
                        }
                        else {
                            return Object.assign({}, state, {
                                data: [], refreshing: false, ledgerData
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        data: [], refreshing: false,
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

                // Bind Request for Orginization  Ledger
                let requestLedgerdata = {
                    FromDate: this.state.FromDate != '' ? this.state.FromDate : "",
                    ToDate: this.state.ToDate != '' ? this.state.ToDate : "",
                    AccWalletId: this.state.WalletId,
                    PageNo: pageNo - 1,
                    PageSize: this.state.PageSize
                }
                //call api for get Orginization ledger 
                this.props.getOrganizationLedger(requestLedgerdata);
            }
        }
    }

    render() {

        //loading bit for handling progress dialog
        const { ledgerLoading } = this.props.data;

        //default searchInput is empty so it will display all records.
        let list = this.state.data;
        let finalItems = list.filter(item => (
            item.Remarks.toLowerCase().includes(this.state.search.toLowerCase()) ||
            item.LedgerId.toString().toLowerCase().includes(this.state.search) ||
            item.PreBal.toString().toLowerCase().includes(this.state.search) ||
            item.PostBal.toString().toLowerCase().includes(this.state.search) ||
            item.CrAmount.toString().toLowerCase().includes(this.state.search) ||
            item.DrAmount.toString().toLowerCase().includes(this.state.search) ||
            item.TrnDate.toLowerCase().includes(this.state.search.toLowerCase())
        ));

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.organizationLedger}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* To Check Response fetch or not if isLoadingLedgerData = true then display progress bar else display List*/}
                    {
                        ledgerLoading && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length > 0 ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item, index }) =>
                                                <WalletOrgLedgerListItem
                                                    item={item}
                                                    index={index} size={this.state.data.length}
                                                />}
                                            keyExtractor={(item, index) => index.toString()}
                                            /* for refreshing data of flatlist */
                                            refreshControl={
                                                <RefreshControl
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    colors={[R.colors.accent]}
                                                    onRefresh={this.onRefresh}
                                                />}
                                        />
                                    </View>
                                    :
                                    <ListEmptyComponent />}
                            </View>
                    }
                </View>

                {/*To Set Pagination View  */}
                <View>
                    {finalItems.length > 0 &&
                        <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                </View>
            </SafeView>

        )
    }

}

function mapStateToProps(state) {
    //Updated Data For OrginizationLedgerReducer Data 
    let data = {
        ...state.OrginizationLedgerReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Orginization Ledger Action
        getOrganizationLedger: (requestLedgerData) => dispatch(getOrganizationLedger(requestLedgerData)),

        // Perform Action for clear margin data from reducer
        clearOrginizationLedger: () => dispatch(clearOrginizationLedger()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletOrganizationLedgerListScreen) 