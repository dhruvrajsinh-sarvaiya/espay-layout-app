import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isInternet, validateResponseNew } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import { changeTheme, getCurrentDate, parseArray } from '../../controllers/CommonUtils';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import DatePickerWidget from '../../components/Widget/DatePickerWidget';
import { isCurrentScreen } from '../../components/Navigation';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import ComboPickerWidget from '../Widget/ComboPickerWidget';
import { getMarginWalletList } from '../../actions/PairListAction'
import { getMarginWalletLedgerData, getMarginWalletLedgerDataClear } from '../../actions/Margin/MarginWalletLedgerAction';
import { DateValidation } from '../../validations/DateValidation';
import SafeView from '../../native_theme/components/SafeView';
import { AppConfig } from '../../controllers/AppConfig';

class MarginWalletLedgerScreen extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            wallet: [],
            selectedWallet: '',
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            selectedPage: 0,
            refreshing: false,
            isFirstTime: true,
            WalletId: '',
        }
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // call api for margin Wallet
            this.props.getMarginWalletList({});
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { marginWalletLedgerData } = this.props;

        // compare response with previous response
        if (marginWalletLedgerData !== prevProps.marginWalletLedgerData) {

            // check marginWalletLedgerData fetch or not
            if (marginWalletLedgerData != null) {
                try {
                    if (validateResponseNew({ response: marginWalletLedgerData })) {
                        let res = parseArray(marginWalletLedgerData.WalletLedgers);

                        // If get response is not null than redirect to details screen and set data to ledger screen  
                        this.props.navigation.navigate('MarginWalletLedgerDetails',
                            {
                                item: res,
                                allData: marginWalletLedgerData,
                                wallet: this.state.wallet,
                                selectedWallet: this.state.selectedWallet,
                                FromDate: this.state.FromDate,
                                ToDate: this.state.ToDate,
                                WalletId: this.state.WalletId
                            })

                        //for clear marginwallet ledger data from Reducer
                        this.props.getMarginWalletLedgerDataClear();
                    } else {

                        //for clear marginwallet ledger data from Reducer
                        this.props.getMarginWalletLedgerDataClear();
                    }
                } catch (e) { }
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

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { marginWalletMasterData } = props;

            // check marginWalletLedgerData fetch or not
            if (marginWalletMasterData) {
                try {
                    //set data to picker 
                    if (state.marginWalletMasterData == null || (state.marginWalletMasterData != null && marginWalletMasterData !== state.marginWalletMasterData)) {
                        if (validateResponseNew({ response: marginWalletMasterData, isList: true })) {

                            // convert response data into array 
                            let res = parseArray(marginWalletMasterData.Data);
                            res.map((item, index) => {
                                res[index].ID = item.AccWalletID;
                                res[index].value = item.WalletName;
                            })
                            let walletItem = [
                                ...res
                            ];
                            return {
                                ...state,
                                wallet: walletItem,
                                selectedWallet: res[0].WalletName,
                                WalletId: res[0].AccWalletID,
                                marginWalletMasterData
                            }
                        }
                        else {
                            return {
                                ...state,
                                marginWalletMasterData,
                                selectedWallet: '',
                                WalletId: 0,
                            }
                        }
                    }
                } catch (e) { }
            }
        }
        return null;
    }

    //check validation and pass data and call api and internet condition
    submitData = async () => {

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.refs.Toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        }
        // validate selected wallet is empty or not
        if (this.state.selectedWallet === '') {
            this.refs.Toast.Show(R.strings.Select_Wallet);
            return;
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {

                // Bind Request for ledger data
                let requestLedgerdata = {
                    FromDate: this.state.FromDate != '' ? this.state.FromDate : "",
                    ToDate: this.state.ToDate != '' ? this.state.ToDate : "",
                    WalletId: this.state.WalletId,
                    Page: this.state.selectedPage,
                    PageSize: AppConfig.pageSize
                }
                // call api for margin Wallet ledger
                this.props.getMarginWalletLedgerData(requestLedgerdata)
            }
        }
    }

    render() {

        //loading bit for handling progress dialog
        const { isLoadingMasterData, isLoadingLedgerData } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.marginWalletLedger} isBack={true} nav={this.props.navigation} />

                {/* for progress dialog */}
                <ProgressDialog isShow={isLoadingMasterData || isLoadingLedgerData} />

                {/* For Toast */}
                <CommonToast ref="Toast" />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* DatePicker for FromDate and ToDate */}
                            <DatePickerWidget
                                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                                FromDate={this.state.FromDate}
                                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                                ToDate={this.state.ToDate} />

                            <ComboPickerWidget
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                                pickers={[
                                    {
                                        // For select Api Provider
                                        title: R.strings.wallet,
                                        array: this.state.wallet,
                                        selectedValue: this.state.selectedWallet,
                                        onPickerSelect: (index, object) => { this.setState({ selectedWallet: index, WalletId: object.ID }) },
                                        searchable: true,
                                    },

                                ]}
                            />

                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.submit} onPress={this.submitData}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data for margin Wallet
        isLoadingMasterData: state.MarginWalletLedgerReducer.isLoadingMasterData,
        marginWalletMasterData: state.MarginWalletLedgerReducer.marginWalletMasterData,
        fetchMarginWalletMasterData: state.MarginWalletLedgerReducer.fetchMarginWalletMasterData,

        //Updated Data for Margin Wallet Ledger
        isLoadingLedgerData: state.MarginWalletLedgerReducer.isLoadingLedgerData,
        marginWalletLedgerData: state.MarginWalletLedgerReducer.marginWalletLedgerData,
        fetchMarginWalletLedgerData: state.MarginWalletLedgerReducer.fetchMarginWalletLedgerData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform margin wallet Action
        getMarginWalletList: (request) => dispatch(getMarginWalletList(request)),

        //Perform margin wallet ledger Action
        getMarginWalletLedgerData: (requestLedgerData) => dispatch(getMarginWalletLedgerData(requestLedgerData)),
        
        // Perform Action for clear margin data from reducer
        getMarginWalletLedgerDataClear: () => dispatch(getMarginWalletLedgerDataClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarginWalletLedgerScreen)