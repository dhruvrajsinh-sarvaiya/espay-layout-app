import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { Fonts } from '../../../controllers/Constants';
import { changeTheme, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { validateValue, isEmpty } from '../../../validations/CommonValidation';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import RowItem from '../../../native_theme/components/RowItem';

export class ApiPlanSubscriptionHistoryDetail extends Component {
    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        }
    }

    componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    // Get Plan validity
    getPlanValidity = (planValidityType) => {
        let validity = ''
        if (planValidityType == 1)
            validity = R.strings.day
        else if (planValidityType == 2)
            validity = R.strings.month
        else if (planValidityType == 3)
            validity = R.strings.Year
        return validity
    }

    render() {
        let { item } = this.state

        // Get Plan Validity in Year/Month/Days
        let statusColor = R.colors.textSecondary
        let planValidity = this.getPlanValidity(item.PlanValidityType)
        let statusText = ''
        // Expire
        if (item.Status == 0) {
            statusColor = R.colors.failRed
            statusText = R.strings.expire
        }
        
        // Active
        else if (item.Status == 1) {
            statusText = R.strings.active
            statusColor = R.colors.successGreen
        }
        // Disable
        else if (item.Status == 2) {
            statusColor = R.colors.textSecondary
            statusText = R.strings.Disable
        }
        
        // In Process
        else if (item.Status == 9) {
            statusText = R.strings.inProcess
            statusColor = R.colors.accent
        }

        return (
            <LinearGradient style={{ flex: 1, }} locations={[0, 1]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        toolbarColor={'transparent'}
                        textStyle={{ color: 'white' }}
                        title={R.strings.apiPlanSubscriptionHistory}
                        backIconStyle={{ tintColor: 'white' }}
                        isBack={true} nav={this.props.navigation} />

                    <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text style={
                            {
                                fontSize: R.dimens.smallText,
                                color: R.colors.white,
                                textAlign: 'left',
                                fontFamily: Fonts.MontserratSemiBold,
                            }}>{R.strings.Price}</Text>

                        <Text style={
                            {
                                fontSize: R.dimens.mediumText,
                                fontFamily: Fonts.HindmaduraiSemiBold,
                                color: R.colors.white,
                                textAlign: 'left',
                            }}>{isEmpty(item.Price) ? '-' : item.Price + ' USD'}</Text>
                    </View>

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'}>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            padding: 0,
                            margin: R.dimens.margin_top_bottom,
                            backgroundColor: R.colors.cardBackground,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* Holding CoinName with Icon and Description */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: R.dimens.widget_top_bottom_margin,
                                marginRight: R.dimens.widget_top_bottom_margin,
                                marginTop: R.dimens.widget_top_bottom_margin,
                            }}>
                                <View style={{ flex: 1, justifyContent: 'center', marginLeft: R.dimens.margin, }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.PlanName)}</Text>
                                    <TextViewHML style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, }}>{validateValue(item.PlanValidity + ' ' + planValidity)}</TextViewHML>
                                </View>

                            </View>

                            {/* Display other detail  */}
                            <RowItem title={R.strings.userId} value={validateValue(item.UserID)} />
                            <RowItem title={R.strings.Charge} value={validateValue(item.Charge)} />
                            <RowItem title={R.strings.planNetTotal} value={validateValue(item.TotalAmt)} />
                            <RowItem title={R.strings.ExpiryDate} value={validateValue(convertDateTime(item.ExpiryDate, 'YYYY-MM-DD HH:mm:ss', false))} />
                            <RowItem title={R.strings.planRequestedOn} value={validateValue(convertDateTime(item.RequestedDate, 'YYYY-MM-DD HH:mm:ss', false))} />
                            <RowItem title={R.strings.planActivatedOn} value={validateValue(convertDateTime(item.ActivationDate, 'YYYY-MM-DD HH:mm:ss', false))} />
                            <RowItem title={R.strings.totalPublicApiKeys} value={validateValue(item.KeyCount + "/" + item.KeyTotCount)} />
                            <RowItem title={R.strings.totalIpWhitelisted} value={validateValue(item.WhitelistedEndPointsCount + "/" + item.WhitelistedEndPoints)} />
                            <RowItem title={R.strings.Status} value={validateValue(statusText)} status={true} color={statusColor} marginBottom={true} />

                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        )
    }
}

export default ApiPlanSubscriptionHistoryDetail
