import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { deleveragePreConfirm, deleverageConfirm } from '../../actions/Margin/DeleverageAction';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseFloatVal, showAlert, sendEvent, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import Button from '../../native_theme/components/Button';
import R from '../../native_theme/R';
import EditText from '../../native_theme/components/EditText';
import { Events } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

class Deleverage extends Component {

    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            Currency: this.props.navigation.state.params && this.props.navigation.state.params.Currency,
            totalAmount: '',
            chargeAmount: '',
            loanId: '',
            profitAmount: '',
            isDisplay: false,
            isFirstTime: true,
        };

    }

    //To Redirect user to Main Screen
    Redirection = async () => {
        //To move to dashboard
        sendEvent(Events.MoveToMainScreen, 0);
        this.props.navigation.navigate('MainScreen')
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Field of Particular actions
        const { DeleverageFetchData, DeleverageData } = this.props;

        if (DeleverageData !== prevProps.DeleverageData) {

            //To Check Deleverage Confirm Data fetch or not
            if (!DeleverageFetchData) {
                try {
                    if (validateResponseNew({ response: DeleverageData })) {
                        showAlert(R.strings.Success + '!', DeleverageData.ReturnMsg, 0, () => this.Redirection());
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
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

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { DeleveragePreFetchData, DeleveragePreData } = props;

            //To Check Deleverage Pre Confirm Data Fetch or Not
            if (!DeleveragePreFetchData) {
                try {
                    if (validateResponseNew({ response: DeleveragePreData })) {
                        return {
                            ...state,
                            isDisplay: true,
                            totalAmount: (parseFloatVal(DeleveragePreData.TotalAmount).toFixed(8) !== 'NaN' ? parseFloatVal(DeleveragePreData.TotalAmount).toFixed(8).toString() : '-'),
                            chargeAmount: (parseFloatVal(DeleveragePreData.ChargeAmount).toFixed(8) !== 'NaN' ? parseFloatVal(DeleveragePreData.ChargeAmount).toFixed(8).toString() : '-'),
                            loanId: DeleveragePreData.LoanID.toString(),
                            profitAmount: (parseFloatVal(DeleveragePreData.ProfitAmount).toFixed(8) !== 'NaN' ? parseFloatVal(DeleveragePreData.ProfitAmount).toFixed(8).toString() : '-'),
                        }
                    }
                    else {
                        return {
                            ...state,
                            isDisplay: false,
                            totalAmount: '',
                            chargeAmount: '',
                            loanId: '',
                            profitAmount: '',
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        isDisplay: false,
                        totalAmount: '',
                        chargeAmount: '',
                        loanId: '',
                        profitAmount: '',
                    }
                }
            }
        }
        return null;
    }

    onPreConfirm = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To bind Deleverage Pre Confirmation Request
            let request = {
                Currency: this.state.Currency
            }
            //Call Deleverage Pre Confirm API
            this.props.deleveragePreConfirm(request);
            //----------
        }
    }

    onConfirm = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To bind Deleverage Confirmation Request
            let request = {
                Currency: this.state.Currency
            }
            //Call Deleverage Confirm API
            this.props.deleverageConfirm(request);
            
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { DeleveragePreIsFetching, DeleverageIsFetching } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Deleverage}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* For Progress Dialog */}
                <ProgressDialog isShow={DeleveragePreIsFetching || DeleverageIsFetching} />

                <View style={{
                    flex: 1,
                    justifyContent: 'space-between',
                }}>

                    <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingTop: R.dimens.widget_top_bottom_margin, paddingBottom: R.dimens.padding_top_bottom_margin, }}>

                            {/* For Currency */}
                            <EditText
                                header={R.strings.Currency}
                                placeholder={R.strings.Currency}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(Currency) => this.setState({ Currency })}
                                value={this.state.Currency}
                                editable={false}
                            />

                            {this.state.isDisplay ?
                                <View>
                                    {/* For Total Amount */}
                                    <EditText
                                        header={R.strings.TotalAmount}
                                        placeholder={R.strings.TotalAmount}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        onChangeText={(totalAmount) => this.setState({ totalAmount })}
                                        value={this.state.totalAmount}
                                        editable={false}
                                    />

                                    {/* For Charge Amount */}
                                    <EditText
                                        header={R.strings.ChargeAmount}
                                        placeholder={R.strings.ChargeAmount}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        onChangeText={(chargeAmount) => this.setState({ chargeAmount })}
                                        value={this.state.chargeAmount}
                                        editable={false}
                                    />

                                    {/* For Loan Id */}
                                    <EditText
                                        header={R.strings.loanId}
                                        placeholder={R.strings.loanId}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        onChangeText={(loanId) => this.setState({ loanId })}
                                        value={this.state.loanId}
                                        editable={false}
                                    />

                                    {/* For Profit Amount */}
                                    <EditText
                                        header={R.strings.profitAmount}
                                        placeholder={R.strings.profitAmount}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"done"}
                                        onChangeText={(profitAmount) => this.setState({ profitAmount })}
                                        value={this.state.profitAmount}
                                        editable={false}
                                    />
                                </View> : null}
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Show Button */}
                        <Button title={this.state.isDisplay ? R.strings.Confirm : R.strings.GetQuote} onPress={this.state.isDisplay ? this.onConfirm : this.onPreConfirm}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //For Deleverage Pre Confirm
        DeleveragePreFetchData: state.DeleverageReducer.DeleveragePreFetchData,
        DeleveragePreData: state.DeleverageReducer.DeleveragePreData,
        DeleveragePreIsFetching: state.DeleverageReducer.DeleveragePreIsFetching,

        //For Deleverage Confirm
        DeleverageFetchData: state.DeleverageReducer.DeleverageFetchData,
        DeleverageData: state.DeleverageReducer.DeleverageData,
        DeleverageIsFetching: state.DeleverageReducer.DeleverageIsFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perfotm Deleverage Pre Confirm Request
        deleveragePreConfirm: (request) => dispatch(deleveragePreConfirm(request)),
        //Perfotm Deleverage Confirm Request
        deleverageConfirm: (request) => dispatch(deleverageConfirm(request)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Deleverage)