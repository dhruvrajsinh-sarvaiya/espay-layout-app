// AffliateReportsDashboard.js
import React, { Component } from 'react';
import { View, FlatList, ScrollView, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import R from '../../../native_theme/R';
import {
    affiliateDashboardCount, affiliateInviteChartDetail,
    affiliateMonthwiseChartDetail, affiliateDashboardDataClear
} from '../../../actions/account/AffiliateReportDashboardAction';
import CardView from '../../../native_theme/components/CardView';
import ChartView from 'react-native-highcharts';
import CommonToast from '../../../native_theme/components/CommonToast';
import Separator from '../../../native_theme/components/Separator';
import { Fonts } from '../../../controllers/Constants';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import SafeView from '../../../native_theme/components/SafeView';
import CustomCard from '../../widget/CustomCard';
const { width } = R.screen();
var largerHeight = 0;
var needScale = true;
var currentYear = new Date().getFullYear();//for get current Year

class AffliateReportsDashboard extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        //Define All initial State
        this.state = {

            isFirstTime: true,
            viewHeight: 0,
            isGrid: true,

            // for Pie chart
            pAffiliatelink: '',
            pFacebook: '',
            pTwitter: '',
            pEmail: '',
            pSms: '',

            // for Line chart
            lSignup: '',
            lDeposit: '',
            lBuyTrade: '',
            lSellTrade: '',

            // Array Object for display card data (title and value and icon)
            data: [
                { id: '1', title: '-', value: R.strings.affliateSignUpReport, icon: R.images.IC_OUTLINE_USER, type: 1 },
                { id: '2', title: '-', value: R.strings.affiliateCommissionReport, icon: R.images.IC_HANDSHAKE, type: 1 },
                { id: '3', title: '-', value: R.strings.facebookShareReport, icon: R.images.IC_FACEBOOK_LOGO, type: 1 },
                { id: '4', title: '-', value: R.strings.twitterShareReport, icon: R.images.IC_TWITTER, type: 1 },
                { id: '5', title: '-', value: R.strings.clickOnLinkReport, icon: R.images.IC_CLICK, type: 1 },
                { id: '6', title: '-', value: R.strings.emailSentReport, icon: R.images.IC_EMAIL_FILLED, type: 1 },
                { id: '7', title: '-', value: R.strings.smsSentReport, icon: R.images.IC_COMPLAINT, type: 1 },
            ],
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //  call api for LineChart
            this.props.affiliateMonthwiseChartDetail({ year: currentYear })

            //  call api for pieChart
            this.props.affiliateInviteChartDetail()

            //  call api for dashboardCountData fetch
            this.props.affiliateDashboardCount()
        }
    }

    componentWillUnmount = () => {
        // to clear reducer data
        this.props.affiliateDashboardDataClear()
    };

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
        if (AffliateReportsDashboard.oldProps !== props) {
            AffliateReportsDashboard.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Field of Particular actions
            const { dashboardCountData, dashboardCountDataFetch, inviteChartData, inviteChartdDataFetch, monthlyChartData, monthlyChartdDataFetch } = props;

            //To Check monthlyChartData Fetch or Not
            if (!monthlyChartdDataFetch) {
                try {
                    if (validateResponseNew({ response: monthlyChartData, isList: true })) {

                        //Get array from response
                        var res = parseArray(monthlyChartData.Response);
                        //Set State For Api response 
                        return {
                            ...state, lSignup: res[0].SignUp, lDeposit: res[0].Deposition,
                            lBuyTrade: res[0].BuyTrading, lSellTrade: res[0].SellTrading,
                        };
                    }
                    else {
                        return { ...state, lSignup: '', lDeposit: '', lBuyTrade: '', lSellTrade: '' };
                    }
                } catch (e) {
                    return { ...state, lSignup: '', lDeposit: '', lBuyTrade: '', lSellTrade: '' };
                }
            }

            //To Check inviteChartData Fetch or Not
            if (!inviteChartdDataFetch) {
                try {
                    if (validateResponseNew({ response: inviteChartData, isList: true })) {

                        // Get array from response
                        var chartResponse = parseArray(inviteChartData.Data);
                        //Set State For Api response 
                        return {
                            ...state, pAffiliatelink: chartResponse[0].AffiliateLink, pFacebook: chartResponse[0].Facebook, pTwitter: chartResponse[0].Twitter,
                            pEmail: chartResponse[0].Email, pSms: chartResponse[0].SMS
                        };
                    }
                    else {
                        return {
                            ...state, pAffiliatelink: '', pFacebook: '', pTwitter: '', pEmail: '',
                            pSms: ''
                        };
                    }
                } catch (e) {
                    return {
                        ...state, pAffiliatelink: '', pFacebook: '', pTwitter: '',
                        pEmail: '', pSms: ''
                    };
                }
            }

            //To Check dashboardCountData Fetch or Not
            if (!dashboardCountDataFetch) {

                try {
                    if (validateResponseNew({ response: dashboardCountData, isList: true })) {

                        //Get array from response
                        var countResponse = parseArray(dashboardCountData.Response);
                        var data = state.data;
                        data[0].title = countResponse[0].UserCount.toString()
                        data[1].title = countResponse[0].CommissionCount.toString()
                        data[2].title = countResponse[0].FacebookLinkCount.toString()
                        data[3].title = countResponse[0].TwitterLinkCount.toString()
                        data[4].title = countResponse[0].ReferralLinkCount.toString()
                        data[5].title = countResponse[0].EmailSentCount.toString()
                        data[6].title = countResponse[0].SMSSentCount.toString()

                        //Set State For Api response 
                        return {
                            ...state, data: data,
                        };
                    }
                    else {
                        return { ...state, };
                    }
                } catch (e) {
                    return { ...state, };
                }
            }
        }
        return null;
    }

    // for redirect to selected screen 
    screenToRedirect = (value) => {
        if (value === R.strings.affliateSignUpReport) {
            this.props.navigation.navigate('AffliateSignUpReportListScreen')
        }
        if (value === R.strings.affiliateCommissionReport) {
            this.props.navigation.navigate('AffiliateCommissionReportScreen')
        }
        if (value === R.strings.facebookShareReport) {
            this.props.navigation.navigate('AffiliateFacebookShareReportScreen')
        }
        if (value === R.strings.twitterShareReport) {
            this.props.navigation.navigate('AffiliateTwitterShareReportScreen')
        }
        if (value === R.strings.clickOnLinkReport) {
            this.props.navigation.navigate('AffiliateClickOnLinkReportScreen')
        }
        if (value === R.strings.emailSentReport) {
            this.props.navigation.navigate('AffiliateEmailSentReportScreen')
        }
        if (value === R.strings.smsSentReport) {
            this.props.navigation.navigate('AffiliateSmsSentReportScreen')
        }
    }

    render() {

        const { isDashboardCountFetch, isInviteChartFetch, isMonthlyChartFetch } = this.props;

        // for line chart Configuration
        var conf = {
            plotOptions: {
                series: {
                    boostThreshold: 500 // number of points in one series, when reaching this number, boost.js module will be used
                }
            },
            chart: {
                type: 'line',
                zoomType: 'yx',
                backgroundColor: 'transparent',
            },
            credits: { enabled: false },
            title: {
                text: '',
                style: {
                    color: R.colors.textPrimary,
                    align: 'left',
                }
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                labels: {
                    style: {
                        color: R.colors.textPrimary,
                        fontSize: R.dimens.smallestText
                    }
                },
            },
            yAxis: {
                gridLineWidth: 0,
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        color: R.colors.textPrimary,
                        fontSize: R.dimens.smallestText
                    }
                },
            },
            rangeSelector: {
                enabled: false,
                inputEnabled: false
            },
            scrollbar: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            legend: {
                itemStyle: {
                    color: R.colors.textPrimary,
                    fontSize: R.dimens.smallestText,
                    fontFamily: Fonts.HindmaduraiLight
                },
                symbolPadding: R.dimens.margin,
                symbolHeight: R.dimens.margin,
            },
            tooltip: {
                enabled: false
            },
            series: [
                {
                    name: R.strings.SignUp,
                    data: this.state.lSignup,
                },
                {
                    name: R.strings.buyTrade,
                    data: this.state.lBuyTrade,
                },
                {
                    name: R.strings.sellTrade,
                    data: this.state.lSellTrade,
                },
                {
                    name: R.strings.deposit,
                    data: this.state.lDeposit,
                }
            ],

        };
        const options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };

        // for pie chart configuration
        var pie_conf = {
            chart: {
                plotShadow: false,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                backgroundColor: 'transparent',
                type: 'pie'
            },
            credits: { enabled: false },
            exporting: {
                enabled: false
            },
            title: {
                text: '',
                style: {
                    align: 'left',
                    color: R.colors.textPrimary,
                }
            },
            plotOptions: {
                series: {
                    boostThreshold: 500 // number of points in one series, when reaching this number, boost.js module will be used
                },
                pie: {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        style: {
                            color: R.colors.textPrimary
                        }
                    },
                    showInLegend: true,
                }
            },
            legend: {
                itemStyle: {
                    color: R.colors.textPrimary,
                    fontSize: R.dimens.smallestText,
                    fontFamily: Fonts.HindmaduraiLight,
                },
                symbolPadding: R.dimens.margin,
                symbolHeight: R.dimens.margin,
            },
            tooltip: {
                enabled: false
            },
            series: [{
                data: [
                    {
                        y: this.state.pAffiliatelink,
                        name: R.strings.SignUp,
                    },
                    {
                        name: R.strings.Email,
                        y: this.state.pEmail,
                    },
                    {
                        y: this.state.pSms,
                        name: R.strings.sms,
                    },
                    {
                        name: R.strings.shareOnFacebooktext,y: this.state.pFacebook,
                    },
                    {
                        name: R.strings.shareOnTwittertext,
                        y: this.state.pTwitter,
                    },
                ]
            }]
        };
        const pie_options = {
            global: {
                useUTC: false
            },
            lang: {
                thousandsSep: '.',
                decimalPoint: ',',
            }
        };

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={'Affiliate Report'}
                    nav={this.props.navigation}
                />

                {/* To Set ProgressDialog as per our theme */}
                <ProgressDialog isShow={isDashboardCountFetch || isInviteChartFetch || isMonthlyChartFetch} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                        {/* for Line chart */}
                        <CardView style={{
                            elevation: R.dimens.listCardElevation,
                            flex: 1,
                            borderRadius: 0,
                            flexDirection: 'column',
                            borderBottomLeftRadius: R.dimens.margin,
                            borderTopRightRadius: R.dimens.margin,
                            margin: R.dimens.widget_top_bottom_margin,
                        }}>
                            {/* for header name and icon */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.monthlyAverageEarning} {currentYear}</Text>
                                </View>
                            </View>

                            {this.state.lSignup || this.state.lDeposit || this.state.lBuyTrade || this.state.lSellTrade ? <ChartView
                                style={{ height: R.dimens.highChartHeight, backgroundColor: 'transparent', marginTop: R.dimens.margin, }}
                                config={conf}
                                originWhitelist={['*']}
                                options={options} /> : <ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                        </CardView>

                        {/* Card for rest details to display item for Pie chart */}
                        <CardView style={{
                            elevation: R.dimens.listCardElevation,
                            flex: 1,
                            borderRadius: 0,
                            flexDirection: 'column',
                            borderBottomLeftRadius: R.dimens.margin,
                            borderTopRightRadius: R.dimens.margin,
                            marginBottom: R.dimens.widget_top_bottom_margin,
                            marginLeft: R.dimens.widget_top_bottom_margin,
                            marginRight: R.dimens.widget_top_bottom_margin,
                        }}>
                            {/* for header name and icon */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.inviteFriend}</Text>
                                </View>
                            </View>

                            {this.state.pAffiliatelink != '' || this.state.pFacebook != '' || this.state.pTwitter != '' || this.state.pEmail != '' || this.state.pSms != '' ?
                                // for display pie chart
                                <ChartView
                                    style={{ height: R.dimens.highChartHeight, backgroundColor: 'transparent', marginTop: R.dimens.margin, }}
                                    config={pie_conf}
                                    originWhitelist={['*']}
                                    options={pie_options} /> : <ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                        </CardView>

                        {/* for header name and icon */}
                        <View style={{ flexDirection: 'row', marginLeft: R.dimens.margin, marginRight: R.dimens.margin, }}>
                            <View style={{ flex: 1, justifyContent: 'center', }}>
                                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.statistics}</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <ImageButton
                                    icon={this.state.isGrid ? R.images.IC_VIEW_LIST : R.images.IC_VIEW_GRID}
                                    style={{ margin: 0 }}
                                    iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.cardHeader }]}
                                    onPress={() => this.setState({ isGrid: !this.state.isGrid })} />
                            </View>
                        </View>

                        <Separator style={{ marginTop: R.dimens.widgetMargin }} />

                        {/* for display Headers for list  */}
                        <View style={{ flex: 1, }}>

                            {this.state.data.length > 0 ?
                                <FlatList
                                    key={this.state.isGrid ? 'Grid' : 'List'}
                                    numColumns={this.state.isGrid ? 2 : 1}
                                    data={this.state.data}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    /* render all item in list */
                                    renderItem={({ item, index }) => {
                                        return (
                                            <CustomCard
                                                isGrid={this.state.isGrid}
                                                cardReverse={true}
                                                index={index}
                                                size={this.state.data.length}
                                                title={item.title}
                                                value={item.value}
                                                type={item.type}
                                                icon={item.icon}
                                                width={width}
                                                item={item}
                                                onChangeHeight={(height) => {
                                                    if (height > this.state.viewHeight) {
                                                        this.setState({ viewHeight: height })
                                                    }
                                                }}
                                                viewHeight={this.state.viewHeight}
                                                onPress={() => {
                                                    if (item.title != 0 && item.title != '-') {
                                                        this.screenToRedirect(item.value)
                                                    }
                                                    else {
                                                        this.toast.Show(R.strings.noRecordsFound)
                                                    }
                                                }} />
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                : null}
                        </View>
                    </ScrollView>
                </View>
            </SafeView>
        )
    }
}

function mapStateToProps(state) {
    return {
        // updated data for affiliate
        isDashboardCountFetch: state.AffiliateReportDashboardReducer.isDashboardCountFetch,
        dashboardCountData: state.AffiliateReportDashboardReducer.dashboardCountData,
        dashboardCountDataFetch: state.AffiliateReportDashboardReducer.dashboardCountDataFetch,

        // updated data for piechart
        isInviteChartFetch: state.AffiliateReportDashboardReducer.isInviteChartFetch,
        inviteChartData: state.AffiliateReportDashboardReducer.inviteChartData,
        inviteChartdDataFetch: state.AffiliateReportDashboardReducer.inviteChartdDataFetch,

        // updated data for linechart
        isMonthlyChartFetch: state.AffiliateReportDashboardReducer.isMonthlyChartFetch,
        monthlyChartData: state.AffiliateReportDashboardReducer.monthlyChartData,
        monthlyChartdDataFetch: state.AffiliateReportDashboardReducer.monthlyChartdDataFetch,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform dashboardCountData Action
        affiliateDashboardCount: () => dispatch(affiliateDashboardCount()),
        //Perform piechart Action
        affiliateInviteChartDetail: () => dispatch(affiliateInviteChartDetail()),
        //Perform LineChart Action
        affiliateMonthwiseChartDetail: (request) => dispatch(affiliateMonthwiseChartDetail(request)),
        // To clear Reducer Data
        affiliateDashboardDataClear: () => dispatch(affiliateDashboardDataClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffliateReportsDashboard)