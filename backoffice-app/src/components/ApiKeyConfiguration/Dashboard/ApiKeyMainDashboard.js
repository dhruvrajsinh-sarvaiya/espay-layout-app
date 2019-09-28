import React, { Component } from 'react'
import { Text, View, FlatList, ScrollView } from 'react-native'
import { changeTheme, parseArray, convertDate, convertTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import CustomCard from '../../widget/CustomCard';
import { connect } from 'react-redux';
import { getApiKeyDasboardCount, getApiRequestStatisticsCount, getFrequentlyUseApi, getMostActiveIpAddress, clearApiKeyConfigDashboard } from '../../../actions/ApiKeyConfiguration/ApiKeyDashboradActions';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CardView from '../../../native_theme/components/CardView';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import { Fonts } from '../../../controllers/Constants';
import ChartView from 'react-native-highcharts';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import Separator from '../../../native_theme/components/Separator';

export class ApiKeyMainDashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {

            viewHeight: 0,
            isFirstTime: true,

            // for plan details card Display
            dashboardData: [
                { id: 1, title: '-', value: R.strings.apiPlanConfiguration, icon: R.images.ic_configuration, type: 1 },
                { id: 2, title: '-', value: R.strings.apiPlanSubscriptionHistory, icon: R.images.IC_SPEEDOMETER, type: 1 },
                { id: 3, title: '-', value: R.strings.apiPlanConfigurationHistory, icon: R.images.ic_configuration, type: 1 },
                { id: 4, title: '-', value: R.strings.apiKeyConfigurationHistory, icon: R.images.IC_DIAMOND_STONE, type: 1 },
                { id: 5, title: '-', value: R.strings.apiKeyPolicySetting, icon: R.images.IC_SETTING_WRENCH, type: 1 },
                { id: 6, title: '-', value: R.strings.apiMethod, icon: R.images.IC_TARGET, type: 1 },
                { id: 7, title: '100', value: R.strings.ipwiseReqReport, icon: R.images.IC_FILE_DOCUMENT, type: 1 },
            ],

            // for Plan User Pie chart
            userPieChartData: [],

            // for Plan Purchased Bar chart
            purchase_cat_bar: [],
            perchase_data_bar: [],

            // for Recent http Error
            errorCodeList: [],

            // for http Status Code Column Chart
            httpstatus_cat_col: [],
            httpstatus_data_col: [],

            // for browser Pie Chart 
            browserPieChart: [],

            // for Most Active Ip Address List
            MostActiveIpAddressDataState: null,
            MostActiveIpAddressDataRes: [],

            // for Frequently Used Api List
            FrequentlyUsedApiDataState: null,
            FrequentlyUsedApiDataRes: [],

            apiUsers: '',
            successCount: '',
            failureCount: '',
            registerToday: ''
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check internet connection
        if (await isInternet()) {

            // Call api for api key dashboard count
            this.props.getApiKeyDasboardCount()

            // Call api for get Dashboard Statistics count
            this.props.getApiRequestStatisticsCount()

            // Call api for get frequently used Api
            this.props.getFrequentlyUseApi()

            // Call api for get most Active ip address
            this.props.getMostActiveIpAddress()
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    onCustomCardPress = (id) => {

        let { navigate } = this.props.navigation

        //Redirect screen based on card select
        if (id == 1)
            navigate('ApiPlanConfigListScreen')
        if (id == 2)
            navigate('ApiPlanSubscriptionHistory')
        if (id == 3)
            navigate('ApiPlanConfigurationHistoryScreen')
        if (id == 4)
            navigate('ApiKeyConfigHistory')
        if (id == 5)
            navigate('ApiKeyPolicySettingScreen')
        if (id == 6)
            navigate('ListApiMethodScreen')
        if (id == 7)
            navigate('IpWiseRequestReportScreen')
    }

    componentWillUnmount = () => {
        // for clear reducer data 
        this.props.clearApiKeyConfigDashboard()
    };

    redirectToScreen = (id) => {
        //Redirect screen based on card select
        if (id == 1) {
            this.props.navigation.navigate('HttpErrorCodeListScreen')
        }
        if (id == 2) {
            this.props.navigation.navigate('ActiveIpAddressReportListScreen')
        }
        if (id == 3) {
            this.props.navigation.navigate('UsedApiWiseReportListScreen')
        }
    }

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
        if (ApiKeyMainDashboard.oldProps !== props) {
            ApiKeyMainDashboard.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            // Get all upadated field of particular actions
            const { ApiKeyDasboardCount, ApiKeyStatisticsCount, FrequentlyUsedApiData, MostActiveIpAddressData } = props.ApiKeyDashboardResult

            if (ApiKeyDasboardCount) {
                try {
                    if (state.ApiKeyDasboardCountState == null || (state.ApiKeyDasboardCountState != null && ApiKeyDasboardCount !== state.ApiKeyDasboardCountState)) {
                        //succcess response fill count
                        if (validateResponseNew({ response: ApiKeyDasboardCount, isList: true })) {
                            let oldData = state.dashboardData

                            oldData[0].title = validateValue(ApiKeyDasboardCount.Response.APIPlanCount)
                            oldData[1].title = validateValue(ApiKeyDasboardCount.Response.SubscriptionCount)
                            oldData[2].title = validateValue(ApiKeyDasboardCount.Response.PlanConfigHistoryCount)
                            oldData[3].title = validateValue(ApiKeyDasboardCount.Response.KeyCount)
                            oldData[4].title = validateValue(ApiKeyDasboardCount.Response.APIKeyPolicyCount)
                            oldData[5].title = validateValue(ApiKeyDasboardCount.Response.APIMethodCount)

                            return Object.assign({}, state, { dashboardData: oldData, ApiKeyDasboardCountState: ApiKeyDasboardCount, })

                        } else {
                            //if response is not validate than empty count
                            return Object.assign({}, state, { dashboardData: state.dashboardData, ApiKeyDasboardCountState: null, })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, { dashboardData: state.dashboardData, ApiKeyDasboardCountState: null, })
                }
            }

            if (ApiKeyStatisticsCount) {
                try {
                    if (state.ApiKeyStatisticsCountState == null || (state.ApiKeyStatisticsCountState != null && ApiKeyStatisticsCount !== state.ApiKeyStatisticsCountState)) {

                        //succcess response fill StatisticsCount
                        if (validateResponseNew({ response: ApiKeyStatisticsCount, isList: true })) {

                            let pieChartDataRes = parseArray(ApiKeyStatisticsCount.PlanUsers)
                            let barchartDataRes = parseArray(ApiKeyStatisticsCount.PurchasePlan)
                            let errorCodeListRes = parseArray(ApiKeyStatisticsCount.ErrorCodeList)
                            let httpStatusCodeRes = parseArray(ApiKeyStatisticsCount.StatusCode)
                            let browserHitRes = parseArray(ApiKeyStatisticsCount.Browser)

                            let apiUsers = validateValue(ApiKeyStatisticsCount.APIUsers)
                            let successCount = validateValue(ApiKeyStatisticsCount.SuccessCount)
                            let failureCount = validateValue(ApiKeyStatisticsCount.FaliureCount)
                            let registerToday = validateValue(ApiKeyStatisticsCount.RegisterToday)

                            // for display pie chart for Plan User
                            pieChartDataRes.map((item, index) => {
                                if (item) {
                                    pieChartDataRes[index].name = item.PlanName;
                                    pieChartDataRes[index].y = item.APIUsers;
                                }
                            })
                            // ----------------

                            // for display barchart data for Purchase plan
                            let barchartCategory = []
                            let barchartData = []

                            barchartDataRes.map((item, index) => {
                                if (item) {
                                    barchartCategory[index] = item.PlanName;
                                    barchartData[index] = item.APIUsers;
                                }
                            })
                            // ---------------------------

                            // for error Code List Response 
                            let finalList = [];
                            errorCodeListRes.forEach((el, index) => {
                                if (index < 3) {
                                    finalList.push(el);
                                }
                            })
                            // --------------------

                            // for display Column chart data for http status code
                            let colchartCategory = []
                            let colchartData = []

                            httpStatusCodeRes.map((item, index) => {
                                if (item) {
                                    colchartCategory[index] = item.HTTPStatusCode;
                                    colchartData[index] = item.ReqCount;
                                }
                            })
                            // ---------------------------

                            // for display pie chart for Browser Hit 
                            browserHitRes.map((item, index) => {
                                if (item) {
                                    browserHitRes[index].name = item.Browser != null ? item.Browser : ' Other Browser';
                                    browserHitRes[index].y = item.ReqCount;
                                }
                            })
                            // ----------------

                            return Object.assign({}, state, {
                                ApiKeyStatisticsCountState: ApiKeyStatisticsCount,
                                userPieChartData: pieChartDataRes, purchase_cat_bar: barchartCategory, perchase_data_bar: barchartData,
                                errorCodeList: finalList, httpstatus_cat_col: colchartCategory, httpstatus_data_col: colchartData,
                                browserPieChart: browserHitRes, apiUsers: apiUsers, successCount: successCount,
                                failureCount: failureCount, registerToday: registerToday
                            })

                        } else {
                            //if response is not validate than empty count
                            return Object.assign({}, state, {
                                ApiKeyStatisticsCountState: null,
                                userPieChartData: [], purchase_cat_bar: [], perchase_data_bar: [],
                                errorCodeList: [], httpstatus_cat_col: [], httpstatus_data_col: [],
                                browserPieChart: [], apiUsers: '', successCount: '',
                                failureCount: '', registerToday: ''
                            })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        ApiKeyStatisticsCountState: null,
                        userPieChartData: [], purchase_cat_bar: [], perchase_data_bar: [], errorCodeList: [],
                        httpstatus_cat_col: [], httpstatus_data_col: [], browserPieChart: [], apiUsers: '', successCount: '',
                        failureCount: '', registerToday: ''
                    })
                }
            }

            if (MostActiveIpAddressData) {
                try {
                    if (state.MostActiveIpAddressDataState == null || (state.MostActiveIpAddressDataState != null && MostActiveIpAddressData !== state.MostActiveIpAddressDataState)) {

                        //succcess response fill the MostActiveIpAddressData 
                        if (validateResponseNew({ response: MostActiveIpAddressData, isList: true })) {
                            let res = parseArray(MostActiveIpAddressData.Response)

                            // for display only 3 Records for most Active Ip Address
                            let finalList = [];
                            res.forEach((el, index) => {
                                if (index < 3) {
                                    finalList.push(el);
                                }
                            })
                            // --------------------


                            return Object.assign({}, state, { MostActiveIpAddressDataRes: finalList, MostActiveIpAddressDataState: MostActiveIpAddressData, })

                        } else {
                            //if response is not validate than empty MostActiveIpAddressData
                            return Object.assign({}, state, { MostActiveIpAddressDataRes: [], MostActiveIpAddressDataState: null, })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, { MostActiveIpAddressDataRes: [], MostActiveIpAddressDataState: null, })
                }
            }

            if (FrequentlyUsedApiData) {
                try {
                    if (state.FrequentlyUsedApiDataState == null || (state.FrequentlyUsedApiDataState != null && FrequentlyUsedApiData !== state.FrequentlyUsedApiDataState)) {

                        //succcess response fill the FrequentlyUsedApiData 
                        if (validateResponseNew({ response: FrequentlyUsedApiData, isList: true })) {
                            let res = parseArray(FrequentlyUsedApiData.Response)

                            // for display only 3 Records for Frequently Use Api
                            let finalList = [];
                            res.forEach((el, index) => {
                                if (index < 3) {
                                    finalList.push(el);
                                }
                            })
                            // --------------------

                            return Object.assign({}, state, { FrequentlyUsedApiDataRes: finalList, FrequentlyUsedApiDataState: FrequentlyUsedApiData, })

                        } else {
                            //if response is not validate than empty FrequentlyUsedApiData
                            return Object.assign({}, state, { FrequentlyUsedApiDataRes: [], FrequentlyUsedApiDataState: null, })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, { FrequentlyUsedApiDataRes: [], FrequentlyUsedApiDataState: null, })
                }
            }
        }
        return null
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { ApiKeyDasboardCountLoading, ApiKeyStatisticsCountLoading, FrequentlyUsedApiDataLoading, MostActiveIpAddressDataLoading } = this.props.ApiKeyDashboardResult;

        var pie_conf = {
            chart: {
                backgroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            credits: { enabled: false },
            exporting: {
                enabled: false
            },
            title: {
                text: '',
                style: {
                    color: R.colors.textPrimary,
                    align: 'left',
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
                    fontFamily: Fonts.HindmaduraiLight
                },
                symbolPadding: R.dimens.margin,
                symbolHeight: R.dimens.margin
            },
            tooltip: {
                // enabled: false
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
            series: [{
                name: R.strings.value,
                data: this.state.userPieChartData
            }]
        };

        const pie_options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };

        var bar_conf = {
            chart: {
                backgroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'bar'
            },
            title: {
                text: ''
            },
            exporting: {
                enabled: false
            },
            xAxis: {
                categories: this.state.purchase_cat_bar,
                title: {
                    text: null,
                    color: R.colors.textPrimary
                },
                labels: {
                    style: {
                        color: R.colors.textPrimary,
                    }
                },
                lineWidth: 1
            },
            yAxis: {
                min: 0,
                gridLineWidth: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify',
                    style: {
                        color: R.colors.textPrimary,
                    }
                },
                lineWidth: 0.5
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        style: {
                            color: R.colors.textPrimary,
                            textOutline: '0px'
                        }
                    }
                }
            },
            legend: {
                itemStyle: {
                    color: R.colors.textPrimary,
                    fontSize: R.dimens.smallestText,
                    fontFamily: Fonts.HindmaduraiLight
                },
                symbolPadding: R.dimens.margin,
                symbolHeight: R.dimens.margin
            },
            credits: {
                enabled: false
            },
            series: [{
                name: R.strings.apiPlan,
                data: this.state.perchase_data_bar,
                color: R.colors.accent,
            },]

        };

        const bar_options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };

        var column_conf = {
            chart: {
                type: 'column',
                zoomType: 'yx',
                backgroundColor: 'transparent',
            },
            credits: { enabled: false },
            title: {
                text: '',
            },
            xAxis: {
                categories: this.state.httpstatus_cat_col,
                title: {
                    text: R.strings.httpStatusCode,
                    style: {
                        color: R.colors.textPrimary,
                    }
                },
                labels: {
                    style: {
                        color: R.colors.textPrimary,
                        fontSize: R.dimens.graphFontSize,
                    }
                },
                lineWidth: 1
            },
            yAxis: {
                gridLineWidth: 0,
                title: {
                    text: R.strings.httpStatusCodeCounts,
                    style: {
                        color: R.colors.textPrimary,
                    }
                },
                labels: {
                    style: {
                        color: R.colors.textPrimary,
                        fontSize: R.dimens.graphFontSize,
                    }
                },
                lineWidth: 1
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
                enabled: false
            },
            series: [
                {
                    name: R.strings.value,
                    data: this.state.httpstatus_data_col,
                    // display label or text on chart
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: R.dimens.graphFontSize,
                            color: R.colors.textPrimary
                        }
                    },
                    color: R.colors.accent,
                },
            ],
            plotOptions: {
                series: {
                    boostThreshold: 500 // number of points in one series, when reaching this number, boost.js module will be used
                }
            },
        };

        const column_options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };

        var browser_pie_conf = {
            chart: {
                backgroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            credits: { enabled: false },
            exporting: {
                enabled: false
            },
            title: {
                text: '',
                style: {
                    color: R.colors.textPrimary,
                    align: 'left',
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
                    fontFamily: Fonts.HindmaduraiLight
                },
                symbolPadding: R.dimens.margin,
                symbolHeight: R.dimens.margin
            },
            tooltip: {
                // enabled: false
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
            series: [{
                name: R.strings.value,
                data: this.state.browserPieChart
            }]
        };

        var apiAccess_pie_conf = {
            chart: {
                backgroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            credits: { enabled: false },
            exporting: {
                enabled: false
            },
            title: {
                text: '',
                style: {
                    color: R.colors.textPrimary,
                    align: 'left',
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
                    fontFamily: Fonts.HindmaduraiLight
                },
                symbolPadding: R.dimens.margin,
                symbolHeight: R.dimens.margin
            },
            tooltip: {
                // enabled: false
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
            series: [{
                name: R.strings.value,
                data: [{
                    name: R.strings.mobileApps,
                    y: 600,
                    color: '#BDDCF3'
                }, {
                    name: R.strings.websites,
                    y: 400,
                    color: '#F5CF59'
                }]
            }]
        };

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.publicPrivateApiKey}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Progressbar */}
                <ProgressDialog isShow={ApiKeyDasboardCountLoading || ApiKeyStatisticsCountLoading || FrequentlyUsedApiDataLoading || MostActiveIpAddressDataLoading} />

                <ScrollView showsVerticalScrollIndicator={false} >

                    <View style={{ flexDirection: 'row' }}>

                        <CardView style={{
                            marginBottom: R.dimens.widget_top_bottom_margin,
                            flexDirection: 'column',
                            marginLeft: R.dimens.widget_top_bottom_margin,
                            elevation: R.dimens.listCardElevation,
                            backgroundColor: R.colors.accent
                        }}>
                            {/*For show User icon, apiUsers and registerToday */}
                            <ImageTextButton
                                style={{ margin: 0 }}
                                icon={R.images.IC_OUTLINE_USER}
                                iconStyle={{ width: R.dimens.listImageHeightWidth, height: R.dimens.listImageHeightWidth, tintColor: R.colors.white }}
                            />
                            <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.white, fontFamily: Fonts.MontserratSemiBold }}>
                                {validateValue(this.state.apiUsers)}</Text>
                            <Text style={{ fontSize: R.dimens.smallText, color: R.colors.white, fontFamily: Fonts.MontserratSemiBold }}>
                                {R.strings.apiUsers}</Text>
                            <Text style={{ fontSize: R.dimens.smallestText, color: R.colors.lightDark, fontFamily: Fonts.MontserratSemiBold }}>
                                {validateValue(this.state.registerToday) + ' ' + R.strings.newToday}</Text>
                        </CardView>

                        <CardView style={{
                            elevation: R.dimens.listCardElevation,
                            flex: 1,
                            marginBottom: R.dimens.widget_top_bottom_margin,
                            marginLeft: R.dimens.widget_top_bottom_margin,
                            flexDirection: 'column',
                            backgroundColor: R.colors.cardBalanceBlue,
                            marginRight: R.dimens.widget_top_bottom_margin,
                        }}>

                            {/*For show chek mark icon */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{
                                    fontSize: R.dimens.mediumText, color: R.colors.ligthWhite,
                                    fontFamily: Fonts.MontserratSemiBold
                                }}>{R.strings.apiRequests}</Text>
                                <ImageTextButton
                                    style={{ margin: 0 }}
                                    icon={R.images.IC_CHECK_CIRCLE}
                                    iconStyle={{
                                        width: R.dimens.listImageHeightWidth, height: R.dimens.listImageHeightWidth,
                                        tintColor: R.colors.white
                                    }}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', marginRight: R.dimens.widgetMargin }}>

                                {/*For show successCount and newToday */}
                                <View style={{ flex: 1, marginRight: R.dimens.widgetMargin }}>
                                    <Text style={{
                                        fontSize: R.dimens.mediumText, color: R.colors.white,
                                        fontFamily: Fonts.MontserratSemiBold
                                    }}>{validateValue(this.state.successCount)}</Text>
                                    <Text style={{
                                        fontSize: R.dimens.smallText, color: R.colors.white,
                                        fontFamily: Fonts.MontserratSemiBold
                                    }}>{R.strings.Success}</Text>
                                    <Text style={{
                                        fontSize: R.dimens.smallestText, color: R.colors.ligthWhite,
                                        fontFamily: Fonts.MontserratSemiBold
                                    }}>{'10 ' + R.strings.newToday}</Text>
                                </View>

                                <View
                                    style={{
                                        borderLeftWidth: R.dimens.LineHeight,
                                        borderLeftColor: R.colors.ligthWhite,
                                    }}
                                />

                                {/*For show failureCount and newToday */}
                                <View style={{ flex: 1, marginLeft: R.dimens.margin }}>
                                    <Text style={{
                                        fontSize: R.dimens.mediumText, color: R.colors.white,
                                        fontFamily: Fonts.MontserratSemiBold
                                    }}>{validateValue(this.state.failureCount)}</Text>
                                    <Text style={{
                                        fontSize: R.dimens.smallText, color: R.colors.white,
                                        fontFamily: Fonts.MontserratSemiBold
                                    }}>{R.strings.failure}</Text>
                                    <Text style={{
                                        fontSize: R.dimens.smallestText, color: R.colors.ligthWhite,
                                        fontFamily: Fonts.MontserratSemiBold
                                    }}>{'10 ' + R.strings.newToday}</Text>
                                </View>
                            </View>

                        </CardView>
                    </View>

                    {/* Card for details to display Pie chart for Plan User */}
                    <CardView style={[this.style().cardViewStyle, { marginBottom: R.dimens.margin }]}>
                        {/* for header name and icon */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.planUsers}</Text>
                            </View>
                        </View>

                        {this.state.userPieChartData.length > 0 ?
                            // for display pie chart
                            <ChartView
                                style={{ height: R.dimens.highChartHeight, backgroundColor: 'transparent', marginTop: R.dimens.margin, }}
                                config={pie_conf}
                                originWhitelist={['*']}
                                options={pie_options} /> : <ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                    </CardView>

                    {/* Card for details to display Bar chart for Plan Purchase */}
                    <CardView style={[this.style().cardViewStyle, { marginBottom: R.dimens.margin }]}>
                        {/* for header name and icon */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.planPurchased}</Text>
                            </View>
                        </View>

                        {this.state.purchase_cat_bar.length > 0 ?
                            // for display bar chart
                            <ChartView
                                style={{ height: R.dimens.highChartHeight, backgroundColor: 'transparent', marginTop: R.dimens.margin, }}
                                config={bar_conf}
                                originWhitelist={['*']}
                                options={bar_options} /> : <ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                    </CardView>

                    {/* Card for details to display List for Recent Http Errors */}
                    <CardView style={[this.style().cardViewStyle, { marginBottom: R.dimens.margin }]}>
                        {/* for header name and icon */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: R.dimens.margin }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.recentHttpErrors}</Text>
                            </View>
                            <ImageTextButton
                                icon={R.images.RIGHT_ARROW_DOUBLE}
                                style={{ margin: 0 }}
                                iconStyle={{
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: R.colors.textPrimary
                                }}
                                onPress={() => this.redirectToScreen(1)} />
                        </View>

                        <FlatList
                            data={this.state.errorCodeList}
                            extraData={this.state}
                            key={'CodeList'}
                            showsVerticalScrollIndicator={false}
                            // render all item in list
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>

                                        {/*For show MethodType and HTTPErrorCode */}
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>
                                                {item.MethodType}</TextViewMR>
                                            <TextViewMR style={{
                                                fontSize: R.dimens.smallText,
                                                color: item.HTTPErrorCode == 200 ? R.colors.successGreen : R.colors.failRed
                                            }}>{item.HTTPErrorCode}</TextViewMR>
                                        </View>

                                        {/*For show Path, CreatedDate */}
                                        <View style={{ flex: 1 }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{item.Path}</TextViewHML>
                                        </View>
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                            <ImageTextButton
                                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                                icon={R.images.IC_TIMER}
                                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                            />
                                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate) : '-'}</TextViewHML>
                                        </View>

                                        {index < 2 && <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin }} />}
                                    </View>
                                )
                            }}
                            // assign index as key valye to Withdrawal list item
                            keyExtractor={(_item, index) => index.toString()}
                            contentContainerStyle={contentContainerStyle(this.state.errorCodeList)}
                            // Displayed empty component when no record found 
                            ListEmptyComponent={<ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                        />
                    </CardView>

                    {/* Card for details to display Column chart for Http Status Code */}
                    <CardView style={[this.style().cardViewStyle, { marginBottom: R.dimens.margin }]}>
                        {/* for header name and icon */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.httpStatusCodeCount}</Text>
                            </View>
                        </View>

                        {this.state.httpstatus_cat_col.length > 0 ?
                            // for display column chart
                            <ChartView
                                style={{ height: R.dimens.highChartHeight, backgroundColor: 'transparent', marginTop: R.dimens.margin, }}
                                config={column_conf}
                                options={column_options}
                                originWhitelist={['*']}
                                javaScriptEnabled={true}
                                domStorageEnabled={true} /> : <ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                    </CardView>

                    {/* Card for details to display Pie chart for APi Access*/}
                    <CardView style={[this.style().cardViewStyle, { marginBottom: R.dimens.margin }]}>
                        {/* for header name and icon */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.apiAccess}</Text>
                            </View>
                        </View>

                        {this.state.browserPieChart.length > 0 ?
                            // for display pie chart
                            <ChartView
                                style={{ height: R.dimens.highChartHeight, backgroundColor: 'transparent', marginTop: R.dimens.margin, }}
                                config={apiAccess_pie_conf}
                                originWhitelist={['*']}
                                options={pie_options} /> : <ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                    </CardView>

                    {/* Card for details to display Pie chart for Browser hit*/}
                    <CardView style={[this.style().cardViewStyle, { marginBottom: R.dimens.margin }]}>
                        {/* for header name and icon */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.hitsByBrowser}</Text>
                            </View>
                        </View>

                        {this.state.browserPieChart.length > 0 ?
                            // for display pie chart
                            <ChartView
                                style={{ height: R.dimens.highChartHeight, backgroundColor: 'transparent', marginTop: R.dimens.margin, }}
                                config={browser_pie_conf}
                                originWhitelist={['*']}
                                options={pie_options} /> : <ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                    </CardView>

                    {/* Card for details to display List for Most Active Address*/}
                    <CardView style={[this.style().cardViewStyle, { marginBottom: R.dimens.margin }]}>
                        {/* for header name and icon */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.mostActiveAddress}</Text>
                            </View>
                            <ImageTextButton
                                icon={R.images.RIGHT_ARROW_DOUBLE}
                                style={{ margin: 0 }}
                                iconStyle={{
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: R.colors.textPrimary
                                }}
                                onPress={() => this.redirectToScreen(2)} />
                        </View>

                        <FlatList
                            data={this.state.MostActiveIpAddressDataRes}
                            extraData={this.state}
                            key={'MostActiveIp'}
                            showsVerticalScrollIndicator={false}
                            // render all item in list
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>

                                        {/*For show UserName, whiteList, Host, Path,IPAddress and CreatedDate */}
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>
                                                {validateValue(item.UserName)}</TextViewMR>
                                            <TextViewMR style={{ fontSize: R.dimens.smallestText, color: R.colors.accent }}>
                                                {item.WhitelistIP == 1 ? ' - ' + R.strings.whiteList : ''}</TextViewMR>
                                        </View>

                                        <View style={{ flex: 1, }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>
                                                {validateValue(item.Host)}{validateValue(item.Path)}</TextViewHML>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.yellow }}>{item.IPAddress}</TextViewMR>

                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <ImageTextButton
                                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                                    icon={R.images.IC_TIMER}
                                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                                />
                                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate) : '-'}</TextViewHML>
                                            </View>
                                        </View>

                                        {index < 2 && <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin }} />}
                                    </View>
                                )
                            }}
                            // assign index as key valye to Withdrawal list item
                            keyExtractor={(_item, index) => index.toString()}
                            contentContainerStyle={contentContainerStyle(this.state.MostActiveIpAddressDataRes)}
                            // Displayed empty component when no record found 
                            ListEmptyComponent={<ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                        />

                    </CardView>

                    {/* Card for details to display List for Most Frequently Used Api*/}
                    <CardView style={this.style().cardViewStyle}>
                        {/* for header name and icon */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.mostFrequentlyUsedApi}</Text>
                            </View>
                            <ImageTextButton
                                icon={R.images.RIGHT_ARROW_DOUBLE}
                                style={{ margin: 0 }}
                                iconStyle={{
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: R.colors.textPrimary
                                }}
                                onPress={() => this.redirectToScreen(3)} />
                        </View>

                        <FlatList
                            data={this.state.FrequentlyUsedApiDataRes}
                            extraData={this.state}
                            key={'FrequentlyUsedIp'}
                            showsVerticalScrollIndicator={false}
                            // render all item in list
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>

                                        {/*For show statusCode, Status, Host, Path,IPAddress and CreatedDate */}
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>
                                                    {R.strings.statusCode}</TextViewMR>
                                                <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.HTTPStatusCode ? ': ' + item.HTTPStatusCode : ''}</TextViewMR>
                                            </View>

                                            <TextViewMR style={{
                                                fontSize: R.dimens.smallText,
                                                color: item.Status ? R.colors.failRed : R.colors.successGreen
                                            }}>{item.Status == 1 ? R.strings.Failed : R.strings.Success}</TextViewMR>
                                        </View>

                                        <View style={{ flex: 1, }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>
                                                {validateValue(item.Host)}{validateValue(item.Path)}</TextViewHML>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <ImageTextButton
                                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                                icon={R.images.IC_TIMER}
                                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                            />
                                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate) : '-'}</TextViewHML>
                                        </View>

                                        {index < 2 && <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin }} />}
                                    </View>
                                )
                            }}
                            // assign index as key valye to Withdrawal list item
                            keyExtractor={(_item, index) => index.toString()}
                            contentContainerStyle={contentContainerStyle(this.state.FrequentlyUsedApiDataRes)}
                            // Displayed empty component when no record found 
                            ListEmptyComponent={<ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                        />

                    </CardView>

                    <FlatList
                        data={this.state.dashboardData}
                        extraData={this.state}
                        key={'Grid'}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        // render all item in list
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    isGrid={true}
                                    index={index}
                                    size={this.state.dashboardData.length}
                                    title={item.title}
                                    value={item.value}
                                    type={item.type}
                                    icon={item.icon}
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height })
                                    }}
                                    viewHeight={this.state.viewHeight}
                                    onPress={() => this.onCustomCardPress(item.id)} />
                            )
                        }}
                        // assign index as key valye to Withdrawal list item
                        keyExtractor={(_item, index) => index.toString()}
                    />

                </ScrollView>
            </SafeView>
        )
    }

    style = () => {
        return {
            cardViewStyle: {
                elevation: R.dimens.listCardElevation,
                borderRadius: 0,
                flexDirection: 'column',
                borderBottomLeftRadius: R.dimens.margin,
                borderTopRightRadius: R.dimens.margin,
                marginLeft: R.dimens.widget_top_bottom_margin,
                marginRight: R.dimens.widget_top_bottom_margin,
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        // get ApiKeyDashboardReducer data
        ApiKeyDashboardResult: state.ApiKeyDashboardReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //call action for get Application data
        getApiKeyDasboardCount: () => dispatch(getApiKeyDasboardCount()),

        //call action for get Dashboard statistics Count
        getApiRequestStatisticsCount: () => dispatch(getApiRequestStatisticsCount()),

        // call action for get Frequently Used Api
        getFrequentlyUseApi: () => dispatch(getFrequentlyUseApi()),

        // call action for get Moast Active Ip Address
        getMostActiveIpAddress: () => dispatch(getMostActiveIpAddress()),

        // call action for clear dashboard data
        clearApiKeyConfigDashboard: () => dispatch(clearApiKeyConfigDashboard()),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyMainDashboard)