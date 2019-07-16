import React, { Component } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, showAlert, parseFloatVal } from '../../controllers/CommonUtils';
import { validateValue, validateResponseNew, isInternet } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../native_theme/components/Button';
import { connect } from 'react-redux';
import { ResendWithdrawalEmail } from '../../actions/Wallet/WithdrawAction'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../Navigation';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import CommonDetailHeader from '../Widget/CommonDetailHeader';
import CommonDetailHeaderSub from '../Widget/CommonDetailHeaderSub';

class WithdrawHistoryDetail extends Component {

    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        };
    }

    // Api Call when press on Resend button 
    onResendEmailPress = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Resend Withdrawal Confirmation Email
            let Request = {
                TrnNo: this.state.item.TrnNo,
            }

            //Call API to resend Withdrawal Confirmation Email
            this.props.ResendWithdrawalEmail(Request);
            //----------
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    // open link in browser on link press
    onTrnLinkPress = () => {
        try {
            let res = (this.state.item.hasOwnProperty('ExplorerLink')) ? JSON.parse(this.state.item.ExplorerLink) : '';
            Linking.openURL((res.length) ? res[0].Data + '/' + this.state.item.TrnId : this.state.item.TrnId);
        } catch (error) {
            //handle catch block here
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, _prevState) => {

        //Get All Updated Feild of Particular actions
        const { ResendEmailData, ResendEmailFetchData } = this.props;

        // compare response with previous response
        if (ResendEmailData !== prevProps.ResendEmailData) {

            //To Check Withdraw History Data Fetch or Not
            if (!ResendEmailFetchData) {
                try {
                    if (validateResponseNew({ response: ResendEmailData })) {
                        showAlert(R.strings.Success + '!', ResendEmailData.ReturnMsg, 0);
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }

    };

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { ResendEmailIsFetching } = this.props;
        //----------

        return (
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}
                style={{ flex: 1, }}
                locations={[0, 1]}
            >

                <SafeView isDetail={true} style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To Set ToolBar as per out theme */}
                    <CustomToolbar
                        textStyle={{ color: 'white' }}
                        title={R.strings.TransactionDetail}
                        backIconStyle={{ tintColor: 'white' }}
                        isBack={true} nav={this.props.navigation}
                        toolbarColor={'transparent'}
                    />

                    {/* Progress Dialog */}
                    <ProgressDialog isShow={ResendEmailIsFetching} isDisable={true} />

                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                        {/* Amount and CoinName is Merged With Toolbar using below design */}
                        <CommonDetailHeader
                            title={R.strings.TransactionAmount.toUpperCase()}
                            value={((parseFloatVal((this.state.item.Amount)).toFixed(8)) !== 'NaN' ? parseFloatVal((this.state.item.Amount)).toFixed(8) : '-')}
                            subValue={(this.state.item.CoinName ? this.state.item.CoinName : '-')}>
                        </CommonDetailHeader>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            margin: R.dimens.margin_top_bottom,
                            padding: 0,
                            backgroundColor: R.colors.cardBackground,
                            paddingBottom: (this.state.item.IsVerified == 0 && this.state.item.Status == 4) ? R.dimens.margin_top_bottom : 0,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* Holding Currency with Icon and Balance */}
                            <CommonDetailHeaderSub
                                coin={this.state.item.CoinName ? this.state.item.CoinName : ''}
                                coinName={this.state.item.CoinName ? (this.state.item.CoinName.toUpperCase()) : '-'}>
                            </CommonDetailHeaderSub>

                            {/* Withdraw History Result Details in list */}
                            <View style={{
                                paddingLeft: R.dimens.padding_left_right_margin,
                                paddingRight: R.dimens.padding_left_right_margin,
                                justifyContent: 'space-between',
                                marginTop: R.dimens.widgetMargin,
                                marginBottom: 0,
                                flexDirection: 'column'
                            }}>
                                <TextViewHML
                                    style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{R.strings.TrnId}</TextViewHML>
                                {
                                    (this.state.item.ExplorerLink && this.state.item.TrnId && (this.state.item.IsInternalTrn == 2)) ?
                                        <TouchableOpacity onPress={() => this.onTrnLinkPress()}>
                                            <TextViewHML style={[this.styles().contentItem, { color: R.colors.accent }]}>{this.state.item.TrnId ? this.state.item.TrnId : '-'}</TextViewHML>
                                        </TouchableOpacity> :
                                        <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary }]}>{this.state.item.TrnId ? this.state.item.TrnId : '-'}</TextViewHML>
                                }
                            </View>
                            <View style={{
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                                marginTop: R.dimens.widgetMargin,
                                paddingLeft: R.dimens.padding_left_right_margin,
                                paddingRight: R.dimens.padding_left_right_margin,
                                marginBottom: 0
                            }}>
                                <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{R.strings.Address}</TextViewHML>
                                <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary }]}>{this.state.item.Address ? this.state.item.Address : '-'}</TextViewHML>
                            </View>

                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: R.dimens.widgetMargin,
                                marginBottom: 0,
                                paddingLeft: R.dimens.padding_left_right_margin,
                                paddingRight: R.dimens.padding_left_right_margin,

                            }}>
                                <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{R.strings.Information}</TextViewHML>
                                <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary }]}>{this.state.item.Information ? this.state.item.Information : '-'}</TextViewHML>
                            </View>

                            {this.rowItem(R.strings.Trn_No, validateValue(this.state.item.TrnNo), false, false)}
                            {this.rowItem(R.strings.Date, this.state.item.Date ? convertDate(this.state.item.Date) : '-', false, false)}
                            {this.rowItem(R.strings.Status, this.state.item.StatusStr ? this.state.item.StatusStr : '-', true, true, this.state.item.Status)}
                        </CardView>
                        {(this.state.item.IsVerified == 0 && this.state.item.Status == 4) ?
                            <View>
                                <Button
                                    title={R.strings.Resend}
                                    isRound={true}
                                    isAlert={true}
                                    onPress={() => this.onResendEmailPress()}
                                    style={{ position: 'absolute', bottom: -0, elevation: (R.dimens.CardViewElivation * 2) }}
                                    textStyle={{ color: R.colors.white, padding: R.dimens.WidgetPadding }} />
                            </View> : null}
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        );
    }

    // for display title and value horizontally
    rowItem = (title, value, marginBottom, status, StatusCode) => {

        let color;
        if (status) {
            //To Display various Status Color in ListView
            if (StatusCode == 0) {
                color = R.colors.textPrimary
            } else if (StatusCode == 1) {
                color = R.colors.successGreen
            } else if (StatusCode == 2) {
                color = R.colors.failRed
            } else if (StatusCode == 3) {
                color = R.colors.failRed
            } else if (StatusCode == 4 || StatusCode == 6) {
                color = R.colors.accent
            } else if (StatusCode == 5) {
                color = R.colors.sellerPink
            } else {
                color = R.colors.accent
            }
        }

        return <View style={{
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
            flexDirection: 'row',
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,
            marginTop: R.dimens.widgetMargin,
            justifyContent: 'space-between'
        }}>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.styles().contentItem, { color: status ? color : R.colors.textPrimary, textAlign: 'right' }]}>{value}</TextViewHML>
        </View>
    }

    styles = () => {
        return {
            contentItem: {
                fontSize: R.dimens.smallText,
                flex: 1
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        //For Resend Withdraw Email
        ResendEmailFetchData: state.WithdrawReducer.ResendEmailFetchData,
        ResendEmailData: state.WithdrawReducer.ResendEmailData,
        ResendEmailIsFetching: state.WithdrawReducer.ResendEmailIsFetching,

        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Resend Withdrawal Email Action
        ResendWithdrawalEmail: (Request) => dispatch(ResendWithdrawalEmail(Request)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WithdrawHistoryDetail)