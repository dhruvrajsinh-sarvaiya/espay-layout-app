import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { confirmAddLeverage } from '../../actions/Margin/MarginWalletListAction';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, showAlert, parseIntVal, parseFloatVal, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import Button from '../../native_theme/components/Button';
import R from '../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import CardView from '../../native_theme/components/CardView';
import SafeView from '../../native_theme/components/SafeView';

class ConfirmMarginWalletScreen extends Component {

    constructor(props) {
        super(props);

        // create Reference
        this.toast = React.createRef();

        //Define All State initial state
        this.state = {
            Amount: this.props.navigation.state.params.Amount,
            WalletTypeId: this.props.navigation.state.params.WalletTypeId,
            AccWalletid: this.props.navigation.state.params.AccWalletid,
            Leverage: this.props.navigation.state.params.Leverage,
        };
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
        const { ConfirmLevargeRequestFetchData, ConfirmLevargeRequestdata } = this.props;

        // compare response with previous response
        if (ConfirmLevargeRequestdata !== prevProps.ConfirmLevargeRequestdata) {

            //To Check Confirm Leverage wallet request Data fetch or not
            if (!ConfirmLevargeRequestFetchData) {
                try {
                    if (validateResponseNew({ response: ConfirmLevargeRequestdata })) {
                        showAlert(R.strings.Success + '!', ConfirmLevargeRequestdata.ReturnMsg, 0, async () => {
                            this.props.navigation.navigate("MarginWalletList");
                        });
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
    };

    onConfirmLeveargeRequest = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Confirm Margin wallet Api Call
            this.props.confirmAddLeverage({
                WalletTypeId: this.state.WalletTypeId,
                AccWalletID: this.state.AccWalletid,
                Amount: parseIntVal(this.state.Amount),
                Leverage: this.state.Leverage,
            });
        }
    }

    render() {

        //To Fetch value From Previous Screen
        const { params } = this.props.navigation.state;

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { ConfirmLevargeRequestIsFetching } = this.props;
        //----------

        return (
            <LinearGradient style={{ flex: 1, }}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        textStyle={{ color: 'white' }}
                        title={R.strings.ConfirmLeverage}
                        isBack={true} nav={this.props.navigation} />

                    {/* For Progress Dialog */}
                    <ProgressDialog isShow={ConfirmLevargeRequestIsFetching} />

                    {/* Final Creadit amount is Merged With Toolbar using below design */}
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                        {/* Amount and CoinName is Merged With Toolbar using below design */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                            <TextViewMR style={[
                                this.styles().contentItem,
                                {
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                }]}>{R.strings.FinalCreaditAmount}</TextViewMR>
                            <Text style={[
                                this.styles().contentItem,
                                {
                                    fontSize: R.dimens.largeText,
                                    fontFamily: Fonts.MontserratSemiBold,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                }]}>{params.LeverageRequestInfo.FinalCreditAmount ? parseFloatVal(params.LeverageRequestInfo.FinalCreditAmount).toFixed(8).toString() : '-'}</Text>
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            margin: R.dimens.margin_top_bottom,
                            padding: 0,
                            backgroundColor: R.colors.cardBackground,
                            paddingBottom: R.dimens.margin_top_bottom
                        }} cardRadius={R.dimens.detailCardRadius}>

                            <View style={{ marginBottom: R.dimens.widget_top_bottom_margin }} >
                                {/* History Details in list */}
                                {this.rowItem(R.strings.LeverageAmount, validateValue(params.LeverageRequestInfo.LeverageAmount.toFixed(8)), true)}
                                {this.rowItem(R.strings.LeveragePer, validateValue(params.LeverageRequestInfo.LeveragePer) + ' %', false)}
                                {this.rowItem(R.strings.ChageAmount, validateValue(params.LeverageRequestInfo.ChargeAmount.toFixed(8)), false)}
                                {this.rowItem(R.strings.Charges, validateValue(params.LeverageRequestInfo.ChargePer) + ' %', false)}
                                {this.rowItem(R.strings.SafteyMarginAmount, validateValue(params.LeverageRequestInfo.SafetyMarginAmount.toFixed(8)), false)}
                            </View>
                        </CardView>

                        {/* confirm Button */}
                        <View>
                            <Button
                                title={R.strings.confirm}
                                isRound={true}
                                isAlert={true}
                                onPress={this.onConfirmLeveargeRequest}
                                style={{ position: 'absolute', bottom: -0, elevation: (R.dimens.CardViewElivation * 2) }}
                                textStyle={{ color: R.colors.white, padding: R.dimens.WidgetPadding }} />
                        </View>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        );
    }

    // display title and value in single row 
    rowItem = (title, value, marginTop, SuccessColor, SuccessFontStyle) => {
        return <View style={{
            flexDirection: 'row',
            marginTop: marginTop ? R.dimens.widget_top_bottom_margin : 0,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,
            justifyContent: 'space-between'
        }}>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.styles().contentItem, { color: SuccessColor ? SuccessColor : R.colors.textPrimary, fontWeight: SuccessFontStyle }]}>{value}</TextViewHML>
        </View>
    }

    styles = () => {
        return {
            contentItem: {
                fontSize: R.dimens.listItemText,
                color: R.colors.textPrimary
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For Confirm Leverage Request
        ConfirmLevargeRequestFetchData: state.MarginWalletListReducer.ConfirmLevargeRequestFetchData,
        ConfirmLevargeRequestIsFetching: state.MarginWalletListReducer.ConfirmLevargeRequestIsFetching,
        ConfirmLevargeRequestdata: state.MarginWalletListReducer.ConfirmLevargeRequestdata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perfotm Confirm Leverage Request
        confirmAddLeverage: (confirmLevargeRequest) => dispatch(confirmAddLeverage(confirmLevargeRequest)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmMarginWalletScreen)