import React, { Component } from 'react';
import { View, FlatList, ScrollView, Text } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation'
import { isCurrentScreen } from '../Navigation';
import { connect } from 'react-redux';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import { GetAffiliatedata, getPieChartData, getLineChartData } from '../../actions/Affiliate/AffiliateAction';
import CardView from '../../native_theme/components/CardView';
import ChartView from 'react-native-highcharts';
import CommonToast from '../../native_theme/components/CommonToast';
import Separator from '../../native_theme/components/Separator';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
var largerHeight = 0;
var needScale = true;
var currentYear = new Date().getFullYear();//for get current Year

class AffiliateDashboard extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            SendMail: '',
            SendSMS: '',
            FacebookShare: '',
            TwitterShare: '',
            TotalSignup: '',
            AffiliateLink: '',
            CommissionReport: '',
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

            data: [
                { id: '1', title: null, value: R.strings.inviteFriends, icon: R.images.IC_EARTH, type: 2 },
                { id: '2', title: null, value: R.strings.commission_pattern, icon: R.images.IC_EARTH_NEW, type: 2 },
                { id: '3', title: '-', value: R.strings.sendMails, icon: R.images.IC_EMAIL_FILLED, type: 1 },
                { id: '4', title: '-', value: R.strings.sendSMS, icon: R.images.IC_COMPLAINT, type: 1 },
                { id: '5', title: '-', value: R.strings.shareOnFacebook, icon: R.images.IC_FACEBOOK_LOGO, type: 1 },
                { id: '6', title: '-', value: R.strings.shareOnTwitter, icon: R.images.IC_TWITTER, type: 1 },
                { id: '7', title: '-', value: R.strings.totalSignUp, icon: R.images.IC_OUTLINE_USER, type: 1 },
                { id: '8', title: '-', value: R.strings.affiliateLink, icon: R.images.IC_CLICK, type: 1 },
            ],
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //  call api for LineChart
            this.props.getLineChartData({ year: currentYear })
            //  call api for pieChart
            this.props.getPieChartData()
            //  call api for AffiliateData fetch
            this.props.GetAffiliatedata()
        }
    }

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Field of Particular actions
            const { affiliateData, affiliateDataFetch, pieChartData, pieChartDataFetch, lineChartData, lineChartDataFetch } = props;

            //To Check lineChartData Fetch or Not
            if (!lineChartDataFetch) {
                try {
                    if (validateResponseNew({ response: lineChartData, isList: true })) {
                        //Get array from response
                        var resLineChartData = parseArray(lineChartData.Response);
                        //Set State For Api response 
                        return {
                            ...state, lSignup: resLineChartData[0].SignUp, lDeposit: resLineChartData[0].Deposition,
                            lBuyTrade: resLineChartData[0].BuyTrading, lSellTrade: resLineChartData[0].SellTrading,
                        };
                    }
                    else {
                        return { ...state, lSignup: '', lDeposit: '', lBuyTrade: '', lSellTrade: '' };
                    }
                } catch (e) {
                    return { ...state, lSignup: '', lDeposit: '', lBuyTrade: '', lSellTrade: '' };
                }
            }

            //To Check pieChartData Fetch or Not
            if (!pieChartDataFetch) {
                try {
                    if (validateResponseNew({ response: pieChartData, isList: true })) {
                        //Get array from response
                        var resPieChartData = parseArray(pieChartData.Data);
                        //Set State For Api response 
                        return {
                            ...state, pAffiliatelink: resPieChartData[0].AffiliateLink, pFacebook: resPieChartData[0].Facebook, pTwitter: resPieChartData[0].Twitter,
                            pEmail: resPieChartData[0].Email, pSms: resPieChartData[0].SMS
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

            //To Check affiliateData Fetch or Not
            if (!affiliateDataFetch) {
                try {
                    if (validateResponseNew({ response: affiliateData, isList: true })) {

                        //Get array from response
                        var resAffiliateData = parseArray(affiliateData.Response);
                        var data = state.data;
                        data[2].title = resAffiliateData[0].EmailSentCount.toString()
                        data[3].title = resAffiliateData[0].SMSSentCount.toString()
                        data[4].title = resAffiliateData[0].FacebookLinkCount.toString()
                        data[5].title = resAffiliateData[0].TwitterLinkCount.toString()
                        data[6].title = resAffiliateData[0].UserCount.toString()
                        data[7].title = resAffiliateData[0].ReferralLinkCount.toString()

                        //Set State For Api response 
                        return {
                            ...state, data: data, SendMail: resAffiliateData[0].EmailSentCount, SendSMS: resAffiliateData[0].SMSSentCount,
                            FacebookShare: resAffiliateData[0].FacebookLinkCount, TwitterShare: resAffiliateData[0].TwitterLinkCount, TotalSignup: resAffiliateData[0].UserCount,
                            AffiliateLink: resAffiliateData[0].ReferralLinkCount, CommissionReport: resAffiliateData[0].CommissionCount,
                        };
                    }
                    else {
                        return {
                            ...state, SendMail: '', SendSMS: '', FacebookShare: '',
                            TwitterShare: '', TotalSignup: '', AffiliateLink: '', CommissionReport: '',
                        };
                    }
                } catch (e) {
                    return {
                        ...state, SendMail: '', SendSMS: '', FacebookShare: '',
                        TwitterShare: '', TotalSignup: '', AffiliateLink: '', CommissionReport: '',
                    };
                }
            }
        }
        return null;
    }

    // for redirect to selected screen 
    screenToRedirect = (value) => {
        if (value === R.strings.sendMails) {
            this.props.navigation.navigate('SendMailReport')
        }
        if (value === R.strings.sendSMS) {
            this.props.navigation.navigate('SendSmsReport')
        }
        if (value === R.strings.shareOnFacebook) {
            this.props.navigation.navigate('FacebookShareReport')
        }
        if (value === R.strings.shareOnTwitter) {
            this.props.navigation.navigate('TwitterShareReport')
        }
        if (value === R.strings.totalSignUp) {
            this.props.navigation.navigate('SignUpReport')
        }
        if (value === R.strings.affiliateLink) {
            this.props.navigation.navigate('ClickOnLinkReport')
        }
        if (value === R.strings.inviteFriends) {
            this.props.navigation.navigate('AffiliateInviteFriendScreen')
        }
        if (value === R.strings.commission_pattern) {
            this.props.navigation.navigate('CommissionPatternScreen')
        }
    }

    render() {
        const { isLoading, isLoadingPieChart, isLoadingLineChart } = this.props;

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
                enabled: false
            },
            series: [{
                data: [
                    {
                        name: R.strings.SignUp,
                        y: this.state.pAffiliatelink,
                    },
                    {
                        name: R.strings.Email,
                        y: this.state.pEmail,
                    },
                    {
                        name: R.strings.sms,
                        y: this.state.pSms,
                    },
                    {
                        name: R.strings.shareOnFacebooktext,
                        y: this.state.pFacebook,
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
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.affiliateAnalytics}
                    rightIcon={R.images.ic_history}
                    onRightMenuPress={() => this.props.navigation.navigate('CommissionReport')}
                    nav={this.props.navigation}
                />

                {/* To Set ProgressDialog as per our theme */}
                <ProgressDialog isShow={isLoading || isLoadingPieChart || isLoadingLineChart} />

                {/* To Set CommonToast as per our theme */}
                <CommonToast ref="Toast" />

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
                                    <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.invites}</Text>
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
                                            <ShowCard
                                                isGrid={this.state.isGrid}
                                                cardReverse={true}
                                                index={index}
                                                size={this.state.data.length}
                                                title={item.title}
                                                value={item.value}
                                                type={item.type}
                                                icon={item.icon}
                                                width={this.props.width}
                                                item={item}
                                                onChangeHeight={(height) => {
                                                    if (height > this.state.viewHeight) {
                                                        this.setState({ viewHeight: height })
                                                    }
                                                }}
                                                viewHeight={this.state.viewHeight}
                                                onPress={() => {
                                                    if (item.title != 0 && item.title != '-')
                                                        this.screenToRedirect(item.value)
                                                    else
                                                        this.refs.Toast.Show(R.strings.noRecordsFound)
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

class ShowCard extends Component {
    constructor(props) {
        super(props);
    }

    // for set color according to value
    valueget = (value) => {

        if (value === R.strings.VerifyNumbers) { return R.colors.successGreen }
        if (value === R.strings.UnverifiedNumbers) { return R.colors.failRed }
        if (value === R.strings.AddNumbers) { return R.colors.accent }

        return R.colors.accent
    }

    render() {
        //Get All Props Value 
        let icon = this.props.icon
        let width = this.props.width
        let title = this.props.title
        let value = this.props.value
        let tintColor = this.props.tintColor ? this.props.tintColor : R.colors.white
        let index = this.props.index;
        let size = this.props.size;
        let type = this.props.type;
        let isGrid = this.props.isGrid;
        let cardStyle = this.props.cardStyle
        let imageBack = this.props.imageBack ? this.props.imageBack : ''

        if (isGrid) {
            let isLeft = (index % 2 == 0);
            let isRight = !isLeft;
            let isSizeEven = (size % 2 == 0)
            return (
                <View style={{ width: width / 2, }}>
                    <CardView
                        cardBackground={type === 1 ? R.colors.cardBackground : R.colors.accent}
                        style={{
                            flex: 1,
                            marginLeft: isLeft ? R.dimens.widget_left_right_margin : R.dimens.widgetMargin,
                            padding: 0,
                            marginRight: isRight ? R.dimens.widget_left_right_margin : R.dimens.widgetMargin,
                            marginBottom: (index == size - 1 || (isSizeEven && index == size - 2)) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                            marginTop: (index == 0 || index == 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                            ...cardStyle
                        }}
                        onPress={this.props.onPress}>
                        <View style={[{ flex: 1, margin: R.dimens.margin }, this.props.mainviewstyle]}>
                            {type == 1 ?
                                <View style={{ flex: 1 }}>
                                    <View
                                        style={[this.props.style, (this.props.viewHeight == 0) ? {} : { height: this.props.viewHeight }]}
                                        onLayout={({ nativeEvent: { layout: { height } } }) => {

                                            if (needScale) {
                                                if (largerHeight != height) {
                                                    if (largerHeight >= 0) {
                                                        largerHeight = height;
                                                    }
                                                }

                                                if (index == size - 1) {
                                                    needScale = false;
                                                    this.props.onChangeHeight(largerHeight);
                                                }
                                            }
                                        }}>
                                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', margin: R.dimens.widgetMargin }}>
                                            <View style={{ backgroundColor: imageBack != '' ? imageBack : this.valueget(value), borderRadius: R.dimens.QRCodeIconWidthHeight }}>
                                                <ImageButton
                                                    icon={icon}
                                                    iconStyle={[{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: tintColor }, this.props.imageStyle]}
                                                    onPress={this.props.onPress}
                                                />
                                            </View>
                                        </View>

                                        {title ?
                                            <Text style={[{ color: imageBack != '' ? R.colors.white : R.colors.textPrimary, paddingTop: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, textAlign: 'left', fontFamily: Fonts.MontserratSemiBold }, this.props.titleStyle]}>{title}</Text>
                                            : null
                                        }
                                        <TextViewHML style={{ color: imageBack != '' ? R.colors.white : this.valueget(value), paddingTop: R.dimens.widgetMargin, fontSize: R.dimens.smallText, textAlign: 'left' }}>{value}</TextViewHML>

                                    </View>
                                </View>
                                :
                                <View
                                    style={[{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: R.dimens.CardViewElivation }, (this.props.viewHeight == 0 ? '' : { height: this.props.viewHeight })]}
                                    onLayout={({ nativeEvent: { layout: { height } } }) => {

                                        if (needScale) {
                                            if (largerHeight != height) {
                                                if (largerHeight >= 0) {
                                                    largerHeight = height;
                                                }
                                            }

                                            if (index == size - 1) {
                                                needScale = false;
                                                this.props.onChangeHeight(largerHeight);
                                            }
                                        }
                                    }}>
                                    <ImageButton
                                        icon={icon}
                                        style={[!this.props.circle && { borderWidth: R.dimens.CardViewElivation, borderRadius: R.dimens.paginationButtonRadious, borderColor: R.colors.white, }]}
                                        iconStyle={[{ width: R.dimens.listImageHeightWidth, height: R.dimens.listImageHeightWidth, tintColor: tintColor }, this.props.imageButtonStyle]}
                                        onPress={this.props.onPress} />
                                    <TextViewHML style={{ color: R.colors.white, paddingTop: R.dimens.widgetMargin, fontSize: R.dimens.smallText, textAlign: 'center' }}>{value}</TextViewHML>

                                </View>
                            }
                        </View >
                    </CardView>
                </View>
            );
        } else {
            return (
                <CardView
                    onPress={this.props.onPress}
                    cardBackground={type === 1 ? R.colors.cardBackground : R.colors.accent}
                    style={{
                        ...this.styles().cardViewStyle,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        ...cardStyle
                    }}>
                    {/* Image */}
                    <View style={{ marginLeft: R.dimens.widgetMargin, width: wp('15%'), justifyContent: 'center', alignItems: 'center', }}>
                        {type === 1 ?

                            <ImageButton
                                style={{ marginLeft: 0, padding: R.dimens.widgetMargin, backgroundColor: imageBack != '' ? imageBack : this.valueget(value), borderRadius: R.dimens.paginationButtonRadious }}
                                icon={icon}
                                iconStyle={[{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }, this.props.imageStyle]}
                                onPress={this.props.onPress}
                            />
                            :
                            <ImageButton
                                style={[!this.props.circle && { padding: R.dimens.widgetMargin, marginLeft: 0, borderRadius: R.dimens.paginationButtonRadious, backgroundColor: R.colors.white }]}
                                icon={icon}
                                iconStyle={[{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.accent, }, this.props.imageButtonStyle]}
                                onPress={this.props.onPress}
                            />
                        }
                    </View>
                    <View style={{ width: wp('70%') }}>
                        <TextViewHML style={{ color: type === 1 ? imageBack != '' ? R.colors.white : this.valueget(value) : R.colors.white, fontSize: R.dimens.smallText, }}>{value}</TextViewHML>
                    </View>
                    <View style={{ flex: 1, width: wp('15%'), alignItems: 'flex-end', marginRight: R.dimens.widget_left_right_margin }}>
                        <Text style={{ color: imageBack != '' ? R.colors.white : R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{title}</Text>
                    </View>
                </CardView>
            )
        }
    }

    // Style for this class
    styles = () => {
        return {
            cardViewStyle: {
                flex: 1,
                flexDirection: 'row',
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin,
                padding: 0,
            },
        }
    }
}

function mapStateToProps(state) {
    return {

        //For Update width as per orientation change
        width: state.preference.dimensions.width,

        // updated data for affiliate
        isLoading: state.AffiliateReducer.isLoading,
        affiliateData: state.AffiliateReducer.affiliateData,
        affiliateDataFetch: state.AffiliateReducer.affiliateDataFetch,

        // updated data for piechart
        isLoadingPieChart: state.AffiliateReducer.isLoadingPieChart,
        pieChartData: state.AffiliateReducer.pieChartData,
        pieChartDataFetch: state.AffiliateReducer.pieChartDataFetch,

        // updated data for linechart
        isLoadingLineChart: state.AffiliateReducer.isLoadingLineChart,
        lineChartData: state.AffiliateReducer.lineChartData,
        lineChartDataFetch: state.AffiliateReducer.lineChartDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform AffiliateData Action
        GetAffiliatedata: () => dispatch(GetAffiliatedata()),
        //Perform piechart Action
        getPieChartData: () => dispatch(getPieChartData()),
        //Perform LineChart Action
        getLineChartData: (request) => dispatch(getLineChartData(request)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateDashboard)