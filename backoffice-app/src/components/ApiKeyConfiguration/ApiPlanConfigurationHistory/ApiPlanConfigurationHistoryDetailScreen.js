// ApiPlanConfigurationHistoryDetailScreen.js
import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme, parseIntVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import RowItem from '../../../native_theme/components/RowItem';
import { validateValue } from '../../../validations/CommonValidation';
import { Fonts } from '../../../controllers/Constants';
import LinearGradient from 'react-native-linear-gradient';
import CardView from '../../../native_theme/components/CardView';

export class ApiPlanConfigurationHistoryDetailScreen extends Component {
    constructor(props) {
        super(props);

        let item = props.navigation.state.params && props.navigation.state.params.item

        // Define all initial state
        this.state = {
            item: item,
        }
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme()
    }

    shouldComponentUpdate(nextProps, _nextState) {
         //stop twice api call
        return isCurrentScreen(nextProps);
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

        // get plan validity in day/month/year
        let planValidity = this.getPlanValidity(item.PlanValidityType)

        return (
            <LinearGradient style={{ flex: 1, }} start={{ x: 0, y: 0 }}
            locations={[0, 1]} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'} textStyle={{ color: 'white' }}
                        title={R.strings.apiPlanConfigurationHistory} isBack={true} nav={this.props.navigation}
                    />


                    {/* <ScrollView showsVerticalScrollIndicator={false}>
                  
                    {/* Price and PlanValidity */}
                    {/* <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: R.dimens.margin, }}>
                                <TextViewMR style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, }}>{parseIntVal(item.Price)}</TextViewMR>
                                <TextViewMR style={{ color: R.colors.textSecondary, marginLeft: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, }}>USD</TextViewMR>
                                <TextViewHML style={{ color: R.colors.textSecondary, marginLeft: R.dimens.widgetMargin, fontSize: R.dimens.smallestText, bottom: 0, right: 0, paddingTop: R.dimens.widgetMargin }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
                            </View> */}

                    {/* Plan Description */}
                    {/* <View style={{ marginTop: R.dimens.margin, }}>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.PlanDesc ? item.PlanDesc : ''}</TextViewHML>
                            </View> */}

                    {/* <Separator style={{ marginTop: R.dimens.margin, marginLeft: 0, marginRight: 0, }} /> */}

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'}>

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
                                }}>{parseIntVal(item.Price) + ' USD'}</Text>
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            padding: 0,
                            margin: R.dimens.margin_top_bottom,
                            backgroundColor: R.colors.cardBackground,
                        }} cardRadius={R.dimens.detailCardRadius}>
                            <View style={{ marginTop: R.dimens.margin }}>
                                <RowItem title={R.strings.planName} value={validateValue(item.PlanName)} />
                                <RowItem title={R.strings.Charge} value={validateValue(item.Charge)} />
                                <RowItem title={R.strings.planValidity} value={item.PlanValidity + ' ' + planValidity.toLowerCase()} />
                                <RowItem title={R.strings.maxOrderPerSec} value={validateValue(item.MaxOrderPerSec)} />
                                <RowItem title={R.strings.maxPerMin} value={validateValue(item.MaxPerMinute)} />
                                <RowItem title={R.strings.maxPerDay} value={validateValue(item.MaxPerDay)} />
                                <RowItem title={R.strings.maxPerMonth} value={validateValue(item.MaxPerMonth)} />
                                <RowItem title={R.strings.maxRequestSize} value={validateValue(item.MaxReqSize)} />
                                <RowItem title={R.strings.maxResponseSize} value={validateValue(item.MaxResSize)} />
                                <RowItem title={R.strings.maxRecPerRequest} value={validateValue(item.MaxRecPerRequest)} />
                                <RowItem title={R.strings.priority} value={validateValue(item.Priority)} />
                                <RowItem title={R.strings.concurrenctEndPoint} value={validateValue(item.ConcurrentEndPoints)} />
                                <RowItem title={R.strings.whitelistEndPoint} value={validateValue(item.WhitelistedEndPoints)} />
                                <RowItem title={R.strings.historicalData} value={validateValue(item.HistoricalDataMonth)} />
                                <RowItem title={R.strings.isPlanRecursive} value={item.IsPlanRecursive == 1 ? R.strings.recursive : '-'} />
                                <RowItem title={R.strings.createdDate} value={validateValue(item.CreatedDate ? convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false) : '')} />
                                <RowItem title={R.strings.updatedDate} value={validateValue(item.UpdatedDate ? convertDateTime(item.UpdatedDate, 'YYYY-MM-DD HH:mm:ss', false) : '')} />
                                <RowItem title={R.strings.status} status={true} color={item.Status ? R.colors.successGreen : R.colors.failRed} value={item.Status == 1 ? R.strings.active : R.strings.inActive} />

                                <View style={{ flex: 1, marginTop: R.dimens.widgetMargin, }}>
                                    <TextViewHML style={[this.styles().title]}>{R.strings.planDescription}</TextViewHML>
                                    <TextViewHML style={[this.styles().value]}>{validateValue(item.PlanDesc)}</TextViewHML>
                                </View>

                                <View style={{ flex: 1, marginTop: R.dimens.widgetMargin, }}>
                                    <TextViewHML style={[this.styles().title]}>{R.strings.modifyDetails}</TextViewHML>
                                    <TextViewHML style={[this.styles().value, { marginBottom: R.dimens.margin }]}>{validateValue(item.ModifyDetails)}</TextViewHML>
                                </View>
                            </View>


                            {/* </View>
                    </ScrollView> */}

                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        )
    }
    // style for this class
    styles = () => {
        return {
            title: {
                flex: 1,
                fontSize: R.dimens.smallText,
                color: R.colors.textSecondary,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingRight: R.dimens.padding_left_right_margin,
            },
            value: {
                flex: 1,
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingRight: R.dimens.padding_left_right_margin,
            }
        }
    }
}

export default ApiPlanConfigurationHistoryDetailScreen
