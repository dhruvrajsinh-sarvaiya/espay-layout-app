import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, showAlert, parseFloatVal } from '../../controllers/CommonUtils';
import { validateValue, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../Widget/ImageViewWidget';
import { onUnstacking, OnDropdownChange } from '../../actions/Wallet/TockenStackingAction';
import { isCurrentScreen } from '../Navigation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import AlertDialog from '../../native_theme/components/AlertDialog';
import ImageButton from '../../native_theme/components/ImageTextButton';
import Button from '../../native_theme/components/Button';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class TokenStackingHistoryDetail extends Component {

    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
            isVisible: false,
            unStackingType: 1,
        };

    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    // Call This method When User Click in unstacking Button
    onButtonPress = async () => {

        //For StakingType == 1 then FD or 2 then Charge
        //only Full unstaking is possible in fd type
        if (this.state.item.StakingType == 1) {

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For UnStacking
                let request = {
                    StakingHistoryId: this.state.item.StakingHistoryId,
                    Type: this.state.unStackingType,
                    StakingPolicyDetailId: this.state.item.PolicyDetailID,
                    StakingAmount: this.state.item.StakingAmount,
                    ChannelID: 21,
                }
                //Call UnStacking API
                this.props.onUnstacking(request);
                //----------
            }
        } else {
            //Full and Partial unstaking is possible in Charge type
            this.setState({ isVisible: true })
        }
    }

    //When User Click on Unstacking button From Dailog
    onUnstacking = async () => {

        this.setState({ isVisible: false })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For UnStacking
            let request = {
                StakingHistoryId: this.state.item.StakingHistoryId,
                Type: this.state.unStackingType,
                StakingPolicyDetailId: this.state.item.PolicyDetailID,
                StakingAmount: this.state.item.StakingAmount,
                ChannelID: 21,
            }
            //Call UnStacking API
            this.props.onUnstacking(request);
            //----------
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { UnstakingRequestDate, UnstakingRequestFetchData } = this.props;

        if (UnstakingRequestDate !== prevProps.UnstakingRequestDate) {

            //To Check Unstaking Data Fetch or Not
            if (!UnstakingRequestFetchData) {
                try {
                    if (validateResponseNew({ response: UnstakingRequestDate })) {
                        showAlert(R.strings.Success + '!', UnstakingRequestDate.ReturnMsg, 0, () => {
                            //To empty Reducer
                            this.props.OnDropdownChange();
                            //---------

                            this.props.navigation.state.params.onRefresh(false /* Not from parent so sending false */);
                            this.props.navigation.goBack();
                        });
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
    };

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { UnstakingRequestIsFetching } = this.props;
        //----------

        return (
            <LinearGradient
                style={{ flex: 1, }}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView isDetail={true} style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.TokenStacking_History}
                        textStyle={{ color: 'white' }}
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        isBack={true} nav={this.props.navigation} />

                    {/* Progress Dialog */}
                    <ProgressDialog isShow={UnstakingRequestIsFetching} />

                    {/* Dialog to display Verify 2FA */}
                    <AlertDialog
                        visible={this.state.isVisible}
                        title={R.strings.UnStaking}
                        titleStyle={{ justifyContent: 'center', textAlign: 'center' }}
                        negativeButton={{
                            title: R.strings.cel,
                            onPress: () => this.setState({ isVisible: !this.state.isVisible })
                        }}
                        positiveButton={{
                            title: R.strings.submit,
                            onPress: () => this.onUnstacking(),
                            progressive: false
                        }}
                        requestClose={() => this.setState({ isVisible: !this.state.isVisible })}>

                        <View style={{ padding: R.dimens.margin, justifyContent: 'center', alignItems: 'center' }}>

                            {/* To Set Stacking Type */}
                            <TextViewMR style={{ fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.UnStaking_Type}</TextViewMR>

                            {/* for show radiobutton */}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                {this.renderRadioButton({
                                    index: 0,
                                    item: { title: R.strings.Full, selected: this.state.unStackingType == 1 },
                                    onPress: () => this.setState({ unStackingType: 1 })
                                })}
                                {this.renderRadioButton({
                                    index: 1,
                                    item: { title: R.strings.Partial, selected: this.state.unStackingType == 2 },
                                    onPress: () => this.setState({ unStackingType: 2 })
                                })}
                            </View>
                        </View>
                    </AlertDialog>

                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                        {/* Amount and CoinName is Merged With Toolbar using below design */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                            <TextViewMR style={
                                {
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                }}>{R.strings.Amount}</TextViewMR>
                            {this.state.item.SlabType == 1 ?
                                <Text style={
                                    {
                                        fontSize: R.dimens.mediumText,
                                        fontFamily: Fonts.MontserratSemiBold,
                                        color: R.colors.white,
                                        textAlign: 'left',
                                    }}>{((parseFloatVal(this.state.item.AvailableAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(this.state.item.AvailableAmount).toFixed(8) : '-') + ' ' + (this.state.item.StakingCurrency ? (this.state.item.StakingCurrency.toUpperCase()) : '')}</Text>
                                :
                                <Text style={
                                    {
                                        fontSize: R.dimens.mediumText,
                                        fontFamily: Fonts.MontserratSemiBold,
                                        color: R.colors.white,
                                        textAlign: 'left',
                                    }}>{((parseFloatVal((this.state.item.AvailableAmount).split('-')[0]).toFixed(8)) !== 'NaN' ? parseFloatVal((this.state.item.AvailableAmount).split('-')[0]).toFixed(8) : '-') + '-' + ((parseFloatVal((this.state.item.AvailableAmount).split('-')[1]).toFixed(8)) !== 'NaN' ? parseFloatVal((this.state.item.AvailableAmount).split('-')[1]).toFixed(8) : '-') + ' ' + (this.state.item.StakingCurrency ? (this.state.item.StakingCurrency.toUpperCase()) : '')}</Text>
                            }
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            margin: R.dimens.margin_top_bottom,
                            padding: 0,
                            backgroundColor: R.colors.cardBackground,
                            paddingBottom: (this.state.item.Status == 1) ? R.dimens.margin_top_bottom : 0,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* Holding Currency with Icon and Balance */}
                            <View style={{
                                flexDirection: 'row',
                                margin: R.dimens.widget_top_bottom_margin,
                            }}>
                                <View style={{ width: wp('20%'), }}>
                                    <View style={{
                                        width: R.dimens.signup_screen_logo_height,
                                        height: R.dimens.signup_screen_logo_height,
                                        backgroundColor: 'transparent',
                                        borderRadius: R.dimens.paginationButtonRadious,
                                    }}>
                                        <ImageViewWidget url={this.state.item.StakingCurrency ? this.state.item.StakingCurrency : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                    </View>
                                </View>
                                <View style={{ width: wp('80%'), flexDirection: 'column' }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold, }}>{this.state.item.StakingCurrency ? (this.state.item.StakingCurrency.toUpperCase()) : '-'}</Text>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{this.state.item.UserName ? this.state.item.UserName : '-'}</TextViewMR>
                                </View>
                            </View>

                            {/* Token Staking History Result Details in list */}
                            {this.rowItem(R.strings.Stacking_Type, this.state.item.StakingTypeName ? this.state.item.StakingTypeName : '-')}
                            {this.rowItem(R.strings.Slab_Type, this.state.item.SlabTypeName ? this.state.item.SlabTypeName : '-')}
                            {this.state.item.StakingType == 1 ?
                                <View>
                                    {this.rowItem(R.strings.Interest_Type, this.state.item.InterestTypeName ? this.state.item.InterestTypeName : '-')}
                                    {this.rowItem(R.strings.Interest_Amount, (parseFloatVal(this.state.item.InterestValue).toFixed(8)) !== 'NaN' ? parseFloatVal(this.state.item.InterestValue).toFixed(8) : '-')}
                                </View> : null}
                            {this.rowItem(R.strings.Maturity_Amount, (parseFloatVal(this.state.item.MaturityAmount).toFixed(8)) !== 'NaN' ? parseFloatVal(this.state.item.MaturityAmount).toFixed(8) : '-')}
                            {this.rowItem(R.strings.week, validateValue(this.state.item.DurationWeek))}
                            {this.rowItem(R.strings.month, validateValue(this.state.item.DurationMonth))}
                            {this.state.item.StakingType == 1 ?
                                <View>
                                    {this.rowItem(R.strings.Maturity_Currency, this.state.item.MaturityCurrency ? this.state.item.MaturityCurrency : '-')}
                                </View> : null}
                            {this.rowItem(R.strings.MaturityDate, this.state.item.MaturityDate ? convertDate(this.state.item.MaturityDate) : '-')}
                            {this.state.item.StakingType == 1 ?
                                <View>
                                    {this.rowItem(R.strings.Staking_Before_Maturity_Charge, (parseFloatVal(this.state.item.EnableStakingBeforeMaturityCharge).toFixed(8)) !== 'NaN' ? parseFloatVal(this.state.item.EnableStakingBeforeMaturityCharge).toFixed(8) : '-')}
                                </View>
                                :
                                <View>
                                    {this.rowItem(R.strings.Marker_Charges, (parseFloatVal(this.state.item.MakerCharges).toFixed(8)) !== 'NaN' ? parseFloatVal(this.state.item.MakerCharges).toFixed(8) : '-')}
                                    {this.rowItem(R.strings.Taker_Charges, (parseFloatVal(this.state.item.TakerCharges).toFixed(8)) !== 'NaN' ? parseFloatVal(this.state.item.TakerCharges).toFixed(8) : '-')}
                                </View>}
                            {this.state.item.RenewUnstakingEnable == 1 ?
                                <View>
                                    {this.rowItem(R.strings.Renew_Unstacking_Period, validateValue(this.state.item.RenewUnstakingPeriod))}
                                </View> : null}
                            {this.rowItem(R.strings.UnstakingDate, this.state.item.UnstakingDate ? convertDate(this.state.item.UnstakingDate) : '-', true)}
                        </CardView>

                        {/* If Status == 1 (Active) then Display UnStaking Button */}
                        {this.state.item.Status == 1 ?
                            <View>
                                <Button
                                    title={R.strings.UnStaking}
                                    isRound={true}
                                    isAlert={true}
                                    onPress={() => this.onButtonPress()}
                                    style={{ position: 'absolute', bottom: -0, elevation: (R.dimens.CardViewElivation * 2) }}
                                    textStyle={{ color: R.colors.white, padding: R.dimens.WidgetPadding }} />
                            </View> : null}
                    </ScrollView>
                </SafeView>
            </LinearGradient >
        );
    }

    renderRadioButton(props) {
        let { item } = props;

        return (<View>
            <ImageButton
                name={item.title}
                icon={item.selected ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                onPress={() => props.onPress(item)}
                style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
                textStyle={{ color: R.colors.textPrimary, marginLeft: R.dimens.widgetMargin }}
                iconStyle={{ tintColor: item.selected ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
            />
        </View>)
    }

    rowItem = (title, value, marginBottom = false) => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: R.dimens.widgetMargin,
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,

        }}>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary, fontWeight: 'normal', textAlign: 'right' }]}>{value}</TextViewHML>
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

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
        //Updated Data For Unstaking Action
        UnstakingRequestDate: state.TokenStackingReducer.UnstakingRequestDate,
        UnstakingRequestFetchData: state.TokenStackingReducer.UnstakingRequestFetchData,
        UnstakingRequestIsFetching: state.TokenStackingReducer.UnstakingRequestIsFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform UnStacking Action
        onUnstacking: (request) => dispatch(onUnstacking(request)),
        OnDropdownChange: () => dispatch(OnDropdownChange()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenStackingHistoryDetail)