import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, getCurrentDate, parseArray, showAlert } from '../../controllers/CommonUtils';
import Button from '../../native_theme/components/Button';
import DatePickerWidget from '../Widget/DatePickerWidget';
import { isInternet, validateResponseNew, isEmpty } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { fetchUserLedgerList, } from '../../actions/Reports/UserLedgerAction';
import { getWallets } from '../../actions/PairListAction';
import CommonToast from '../../native_theme/components/CommonToast';
import { AppConfig } from '../../controllers/AppConfig';
import { DateValidation } from '../../validations/DateValidation';
import R from '../../native_theme/R';
import { TitlePicker } from '../Widget/ComboPickerWidget';
import SafeView from '../../native_theme/components/SafeView';

class UserLedger extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        //Bind All Method 
        this.onSubmit = this.onSubmit.bind(this);

        //Define All initial State
        this.state = {
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            coinname: '',
            WalletList: [],
            isFirstTime: true,
            AccWalletId: 0,
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Wallet List
            this.props.getWallets()
            //----------
        }
    };

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return Object.assign({}, state, {
                isFirstTime: false,
            });
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            // Fetch Data from Reducer
            const { WalletList } = props.userLedgerResult

            //If WalletList response is not null
            if (WalletList) {
                try {

                    //If response is not null and nor same as old than check for validation of response
                    if (state.WalletListData == null || (state.WalletListData != null && WalletList !== state.WalletListData)) {

                        // To check for success and failure response
                        if (validateResponseNew({ response: WalletList, isList: true })) {

                            let tempList = WalletList.Wallets;
                            tempList.map((el, index) => {
                                tempList[index].value = el.WalletName;
                            })

                            return Object.assign({}, state, {
                                WalletList: tempList,
                                WalletListData: WalletList,
                                coinname: tempList[0].WalletName,
                                AccWalletId: tempList[0].AccWalletID
                            })
                        } else {
                            return Object.assign({}, state, {
                                WalletList: [],
                                WalletListData: WalletList,
                                coinname: '',
                                AccWalletId: 0
                            })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        WalletList: [],
                        WalletListData: WalletList,
                        coinname: '',
                        AccWalletId: 0,
                    })
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { UserLedgerData } = this.props.userLedgerResult;

        //If both data are different
        if (UserLedgerData !== prevProps.userLedgerResult.UserLedgerData) {

            //If data is not null
            if (UserLedgerData) {

                // To Validate Response for Success and Failure Response
                if (validateResponseNew({ response: UserLedgerData })) {

                    //to get response in array
                    let finalRes = parseArray(UserLedgerData.WalletLedgers);

                    //if array length is greater than 0 then redirect to result screen
                    if (finalRes.length > 0) {

                        let options = {
                            FromDate: this.state.FromDate,
                            ToDate: this.state.ToDate,
                            coinname: this.state.coinname,
                            WalletList: this.state.WalletList,
                            AccWalletId: this.state.AccWalletId,
                            WalletListData: this.state.WalletListData,
                        }

                        this.props.navigation.navigate('UserLedgerResult', options);

                    } else {
                        //If there is no record in success response than show no record found dialog.
                        showAlert(R.strings.failure + '!', R.strings.noRecordsFound, 1);
                    }
                }
            }
        }
    }

    // check validation and call user Ledger List API
    async onSubmit() {

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        }

        //Added Validation For Wallet List DropDown
        if (isEmpty(this.state.coinname)) {
            this.toast.Show(R.strings.Select_Wallet);
            return;
        } else {

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Call Get User Ledger History API
                const requestUserLedger = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    WalletId: this.state.AccWalletId,
                    PageNo: 0,
                    PageSize: AppConfig.pageSize
                }
                // call user Ledger List API
                this.props.fetchUserLedgerList(requestUserLedger)
                //----------
            }
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in Activity
        let { loadingUserLedger } = this.props.userLedgerResult

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.UserLedger}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loadingUserLedger} />

                {/* Set Common Toast as Per our Theme */}
                <CommonToast ref={comp => this.toast = comp} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <ScrollView>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* For FromDate and ToDate Picker and Its View */}
                            <DatePickerWidget
                                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                                FromDate={this.state.FromDate}
                                ToDate={this.state.ToDate}
                                style={{ marginTop: 0 }}
                            />

                            <TitlePicker
                                style={{
                                    marginTop: R.dimens.widget_top_bottom_margin,
                                }}
                                title={R.strings.Select_Wallet}
                                searchable={true}
                                array={this.state.WalletList}
                                selectedValue={this.state.coinname}
                                onPickerSelect={(item, object) => {
                                    if (item !== this.state.coinname) {
                                        this.setState({ coinname: item, AccWalletId: object.AccWalletID })
                                    }
                                }}
                            />

                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Show Button */}
                        <Button title={R.strings.Show_ButtonText} onPress={this.onSubmit}></Button>
                    </View>
                </View>
            </SafeView>
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

function mapStateToProps(state) {
    return {
        // Updated Data for User ledger 
        userLedgerResult: state.UserLedgerReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // perform get Wallet Action
        getWallets: () => dispatch(getWallets()),
        
        // perform user ledger list Action
        fetchUserLedgerList: (requestUserLedger) => dispatch(fetchUserLedgerList(requestUserLedger)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserLedger);