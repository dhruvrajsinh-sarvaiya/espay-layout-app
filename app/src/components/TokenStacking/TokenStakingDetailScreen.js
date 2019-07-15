import React, { Component } from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, showAlert, sendEvent, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { padding_left_right_margin, widget_top_bottom_margin, widgetMargin, } from '../../native_theme/helpers/dimens';
import { validateValue, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ImageButton from '../../native_theme/components/ImageTextButton';
import Button from '../../native_theme/components/Button';
import { postStackRequest } from '../../actions/Wallet/TockenStackingAction';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../Navigation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Events, Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

class TokenStakingDetailScreen extends Component {

    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            Data: props.navigation.state.params && props.navigation.state.params.Data,
            AccWalletID: props.navigation.state.params && props.navigation.state.params.AccWalletID,
            Amount: props.navigation.state.params && props.navigation.state.params.Amount,
            IsAutoUnStacking: props.navigation.state.params && props.navigation.state.params.Data.StakingDetails.EnableAutoUnstaking,
        };

    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    //To Redirect user to Main Screen
    Redirection = async () => {
        //To move to dashboard
        sendEvent(Events.MoveToMainScreen, 0);
        this.props.navigation.navigate('MainScreen')
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {
        const { PostReqData, PostReqFetchData } = this.props;

        // compare response with previous response
        if (PostReqData !== prevProps.PostReqData) {

            //To Check Post Request Data Fetch or Not
            if (!PostReqFetchData) {
                try {
                    //Get Withdraw Request Api STMSG
                    if (validateResponseNew({ response: PostReqData })) {
                        showAlert(R.strings.Success + '!', R.strings.Staking_Success_Msg, 0, () => this.Redirection())
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
    };

    //Check All Validation and if validation is proper then call API
    onSubmitButtonPress = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            let request = {
                StakingPolicyDetailID: this.state.Data.StakingDetails.PolicyDetailID,
                AccWalletID: this.state.AccWalletID,
                InterestValue: this.state.Data.StakingDetails.InterestValue,
                ChannelID: 21, // fixed
                DeductionAmount: parseFloatVal(this.state.Data.MaturityDetail.DeductionAmount),
                Amount: parseFloatVal(this.state.Data.MaturityDetail.DeductionAmount),
                MaturityDate: this.state.Data.MaturityDetail.MaturityDate,
                MaturityAmount: this.state.Data.MaturityDetail.MaturityAmount,
                MakerCharges: this.state.Data.StakingDetails.MakerCharges,
                TakerCharges: this.state.Data.StakingDetails.TakerCharges,
                EnableAutoUnstaking: this.state.IsAutoUnStacking,
            }
            this.props.postStackRequest(request);
        }
    }
    //-----------

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { PostReqIsFetching } = this.props;
        //----------

        return (
            <SafeView isDetail={true} style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.Token_Stack}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={PostReqIsFetching} />

                {/* Details of Withdrawal Report Detail Screen*/}
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    {/* Card for rest details to display Data */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom,
                        paddingBottom: R.dimens.margin_top_bottom
                    }} cardRadius={R.dimens.detailCardRadius}>

                        {/* Token Staking History Result Details in list */}
                        {this.rowItem(R.strings.StakingDetails + ' :', '', false, { color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold })}
                        {this.rowItem(R.strings.Stacking_Type, this.state.Data.StakingDetails.StakingTypeName ? this.state.Data.StakingDetails.StakingTypeName : '-', false)}
                        {this.rowItem(R.strings.Slab_Type, this.state.Data.StakingDetails.SlabTypeName ? this.state.Data.StakingDetails.SlabTypeName : '-', false)}
                        {this.state.Data.StakingDetails.InterestType == 0 ? null
                            :
                            <View>
                                {this.rowItem(R.strings.Interest_Type, this.state.Data.StakingDetails.InterestType ? this.state.Data.StakingDetails.InterestType == 1 ? R.strings.Fixed : this.state.Data.StakingDetails.InterestType == 2 ? R.strings.Percentage : '-' : '-', false)}
                                {this.rowItem(R.strings.Interest_Amount, (parseFloatVal(this.state.Data.StakingDetails.InterestValue).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Data.StakingDetails.InterestValue).toFixed(8) : '-'), false)}
                            </View>
                        }
                        {this.rowItem(R.strings.month, validateValue(this.state.Data.StakingDetails.DurationMonth), false)}
                        {this.rowItem(R.strings.week, validateValue(this.state.Data.StakingDetails.DurationWeek), false)}
                        {this.state.Data.StakingDetails.StakingType == 1 ?
                            <View>
                                {this.rowItem(R.strings.Staking_Before_Maturity_Charge, (parseFloatVal(this.state.Data.StakingDetails.EnableStakingBeforeMaturityCharge).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Data.StakingDetails.EnableStakingBeforeMaturityCharge).toFixed(8) : '-'), false)}
                            </View>
                            :
                            <View>
                                {this.rowItem(R.strings.Marker_Charges, (parseFloatVal(this.state.Data.StakingDetails.MakerCharges).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Data.StakingDetails.MakerCharges).toFixed(8) : '-'), false)}
                                {this.rowItem(R.strings.Taker_Charges, (parseFloatVal(this.state.Data.StakingDetails.TakerCharges).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Data.StakingDetails.TakerCharges).toFixed(8) : '-'), false)}
                            </View>}

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: widgetMargin,
                            marginBottom: 0,
                            paddingLeft: padding_left_right_margin,
                            paddingRight: padding_left_right_margin,
                        }}>
                            {this.renderCheckBox({
                                item: { title: R.strings.Auto_Unstacking_Enable, selected: this.state.IsAutoUnStacking },
                                onPress: () => this.setState({ IsAutoUnStacking: this.state.IsAutoUnStacking == 1 ? 0 : 1 })
                            })}
                        </View>

                        {this.rowItem(R.strings.MaturityDetails + ' :', '', false, { color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, marginTop: R.dimens.widgetMargin })}
                        {this.rowItem(R.strings.Amount, (parseFloatVal(this.state.Amount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Amount).toFixed(8) : '-'), false)}
                        {this.rowItem(R.strings.DeductionAmount, (parseFloatVal(this.state.Data.MaturityDetail.DeductionAmount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Data.MaturityDetail.DeductionAmount).toFixed(8) : '-'), false)}
                        {this.state.Data.StakingDetails.Stacking_Type == 1 ?
                            <View>
                                {this.rowItem(R.strings.Interest_Amount, (parseFloatVal(this.state.Data.MaturityDetail.InterestAmount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Data.MaturityDetail.InterestAmount).toFixed(8) : '-'), false)}
                            </View> : null}
                        {this.rowItem(R.strings.Maturity_Amount, (parseFloatVal(this.state.Data.MaturityDetail.MaturityAmount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Data.MaturityDetail.MaturityAmount).toFixed(8) : '-'), false)}
                        {this.rowItem(R.strings.MaturityDate, convertDateTime(this.state.Data.MaturityDetail.MaturityDate, 'YYYY-MM-DD HH:mm:ss', false), true)}
                    </CardView>

                    {/* Confirm Button on card */}
                    <View>
                        <Button
                            title={R.strings.confirm}
                            isRound={true}
                            isAlert={true}
                            onPress={this.onSubmitButtonPress}
                            style={{ position: 'absolute', bottom: -0, elevation: (R.dimens.CardViewElivation * 2) }}
                            textStyle={{ color: R.colors.white, padding: R.dimens.WidgetPadding }} />
                    </View>
                </ScrollView>
            </SafeView>
        );
    }

    // To Display single checkbox
    renderCheckBox(props) {

        // get required fields from params
        let { item } = props;

        return (<View>
            <ImageButton
                name={item.title}
                icon={item.selected ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                onPress={() => props.onPress(item)}
                style={{ margin: 0, flexDirection: 'row-reverse' }}
                textStyle={{ color: R.colors.textPrimary }}
                iconStyle={{ tintColor: item.selected ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
            />
        </View>)
    }

    // To Display Title and Value Horizontally
    rowItem = (title, value, marginBottom, style) => {

        // To apply color based on status
        let statusColor;
        if (value === R.strings.Pending)
            statusColor = R.colors.accent
        else if (value === R.strings.Hold)
            statusColor = R.colors.textPrimary
        else if (value === R.strings.inProcess)
            statusColor = R.colors.sellerPink
        else
            statusColor = R.colors.textPrimary

        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: widgetMargin,
            marginBottom: marginBottom ? widget_top_bottom_margin : 0,
            paddingLeft: padding_left_right_margin,
            paddingRight: padding_left_right_margin,

        }}>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }, style]}>{title}</TextViewHML>
            <TextViewHML style={[this.styles().contentItem, { color: statusColor, fontWeight: 'normal', textAlign: 'right' }]}>{value}</TextViewHML>
        </View>
    }

    styles = () => {
        return {
            contentItem: {
                flex: 1,
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        PostReqData: state.TokenStackingReducer.PostReqData,
        PostReqFetchData: state.TokenStackingReducer.PostReqFetchData,
        PostReqIsFetching: state.TokenStackingReducer.PostReqIsFetching,
    }
};

const mapDispatchToProps = (dispatch) => ({
    postStackRequest: (request) => dispatch(postStackRequest(request)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenStakingDetailScreen);