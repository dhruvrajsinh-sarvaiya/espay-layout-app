import React, { Component } from 'react';
import { View, Text, processColor, ScrollView, Image, FlatList, } from 'react-native';
import { connect } from 'react-redux';
import {
    getOrganizationsDetails, getUsersDetails, getUserTypesDetails, getWalletTypeList, getWalletSummary
    , getWalletStatusDetails, getUserGraph, getOrganizationGraph
} from '../../../actions/Wallet/WalletMainDashboardAction';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseArray, windowPercentage, } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import LineChart from 'react-native-charts-wrapper/lib/LineChart';
import Carousel from 'react-native-snap-carousel';
import R from '../../../native_theme/R';
import ImageViewWidget from '../../widget/ImageViewWidget';
import CardView from '../../../native_theme/components/CardView';
import CustomCard from '../../widget/CustomCard';
import SafeView from '../../../native_theme/components/SafeView';

const { width, width: viewportWidth } = R.screen();

const slideWidth = windowPercentage(85, viewportWidth);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth;

class WalletMainDashboard extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            viewHeight: 0,
            walletViewHeight: 0,
            isGrid: true,
            OrgTotalCount: '',
            OrgTodayCount: '',
            UserTotalCount: '',
            UserTodayCount: '',
            UserTypesCount: [],
            WalletTypesData: [],
            WalletStatusDetail: [],
            activeSlide: 0,
            UserGraphChartData: [],
            OrganizationGraphChartData: [],
            isFirstTime: true,
            SubDashboards: [
                { title: R.strings.Reports, icon: R.images.IC_WITHDRAW_HISTORY, id: 1 },
                { title: R.strings.configurations, icon: R.images.ic_configuration, id: 2 },
                { title: R.strings.utilits, icon: R.images.ic_widgets, id: 3 },
                { title: R.strings.Policies, icon: R.images.IC_WALLET, id: 4 },
            ],
            WalletSummaryDetails: [
                { title: '-', value: R.strings.Wallets, icon: R.images.IC_WALLET, id: 1, type: 1 },
                { title: '-', value: R.strings.WalletTypes, icon: R.images.ic_widgets, id: 2, type: 1 },
                { title: '-', value: R.strings.WalletMembers, icon: R.images.IC_ACCOUNT, id: 3, type: 1 },
                { title: '-', value: R.strings.WalletTotal, icon: R.images.IC_DOLLAR, id: 4, type: 1 },
            ]
        };

    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (await isInternet()) {

            //Call api For Get Wallet Type List 
            this.props.getWalletTypeList();

            //call api for Get Organization Details
            this.props.getOrganizationsDetails();

            //call api for Get User Details
            this.props.getUsersDetails()

            //call api for User Type Details
            this.props.getUserTypesDetails()

            //Call api For Get Wallet Summary
            this.props.getWalletSummary();

            //Call api For Get Wallet Status Type
            this.props.getWalletStatusDetails();

            //Call api For Get User Graph Data
            this.props.getUserGraph();

            //Call api For Get Organization Graph Data
            this.props.getOrganizationGraph();
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call 
        return isCurrentScreen(nextProps);
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (WalletMainDashboard.oldProps !== props) {
            WalletMainDashboard.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Field of Particular actions
            const { OrgDetailFetchData, OrgDetaildata, UserDetailFetchData, UserDetaildata,
                TypeDetailFetchData, TypeDetaildata, WalletTypeFetchData, WalletTypedata, WalletSummaryFetchData, WalletSummarydata,
                WalletStatusDetailFetchData, WalletStatusDetaildata, UserGraphFetchData, UserGraphdata,
                OrganizationGraphFetchData, OrganizationGraphdata
            } = props;

            //Check Get Wallet Type List Api Response 
            if (!WalletTypeFetchData) {
                try {
                    if (validateResponseNew({ response: WalletTypedata, isList: true })) {

                        var resWalletTypeData = parseArray(WalletTypedata.WalletTypes);
                        return Object.assign({}, state, { WalletTypesData: resWalletTypeData })
                    } else {
                        return Object.assign({}, state, { WalletTypesData: [] })
                    }

                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                    return Object.assign({}, state, { WalletTypesData: [] })
                }
            }

            //Check Organization details Api Response 
            if (!OrgDetailFetchData) {
                try {
                    if (validateResponseNew({ response: OrgDetaildata, isList: true })) {
                        return Object.assign({}, state, {
                            OrgTotalCount: OrgDetaildata.TotalCount,
                            OrgTodayCount: OrgDetaildata.TodayCount
                        })
                    } else {
                        return Object.assign({}, state, {
                            OrgTotalCount: '',
                            OrgTodayCount: ''
                        })
                    }

                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                    return Object.assign({}, state, {
                        OrgTotalCount: '',
                        OrgTodayCount: ''
                    })
                }
            }

            //Check User details Api Response 
            if (!UserDetailFetchData) {
                try {
                    if (validateResponseNew({ response: UserDetaildata, isList: true })) {
                        return Object.assign({}, state, {
                            UserTotalCount: UserDetaildata.TotalCount,
                            UserTodayCount: UserDetaildata.TodayCount
                        })
                    } else {
                        return Object.assign({}, state, {
                            UserTotalCount: '',
                            UserTodayCount: ''
                        })
                    }

                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                    return Object.assign({}, state, {
                        UserTotalCount: '',
                        UserTodayCount: ''
                    })
                }
            }

            //Check User Type Details Api Response 
            if (!TypeDetailFetchData) {
                try {
                    if (validateResponseNew({ response: TypeDetaildata, isList: true })) {
                        var resTypeData = parseArray(TypeDetaildata.Counter);
                        return Object.assign({}, state, { UserTypesCount: resTypeData })
                    } else {
                        return Object.assign({}, state, { UserTypesCount: '' })
                    }

                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                    return Object.assign({}, state, { UserTypesCount: '' })
                }
            }

            //Check Get Wallet Type List Api Response 
            if (!WalletSummaryFetchData) {
                try {
                    if (validateResponseNew({ response: WalletSummarydata, isList: true })) {
                        let oldData = state.WalletSummaryDetails
                        //var resWalletSummaryData = parseArray(WalletSummarydata.Data);

                        oldData[0].title = validateValue(WalletSummarydata.Data.WalletCount)
                        oldData[1].title = validateValue(WalletSummarydata.Data.WalletTypeCount)
                        oldData[2].title = validateValue(WalletSummarydata.Data.UserCount)
                        oldData[3].title = validateValue(WalletSummarydata.Data.ToatalBalance)

                        return Object.assign({}, state, { WalletSummaryDetails: oldData, })
                    } else
                        return Object.assign({}, state, { WalletSummaryDetails: [], })

                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                    return Object.assign({}, state, { WalletSummaryDetails: [], })
                }
            }

            //Check Get Wallet Status Type Api Response 
            if (!WalletStatusDetailFetchData) {
                try {
                    if (validateResponseNew({ response: WalletStatusDetaildata, isList: true })) {
                        var resWalletStatusData = parseArray(WalletStatusDetaildata.Counter);
                        return Object.assign({}, state, { WalletStatusDetail: resWalletStatusData, })
                    } else
                        return Object.assign({}, state, { WalletStatusDetail: [] })

                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                    return Object.assign({}, state, { WalletStatusDetail: [] })
                }
            }

            //Check Get User Graph Data Api Response 
            if (!UserGraphFetchData) {
                try {
                    if (validateResponseNew({ response: UserGraphdata, isList: true })) {

                        let UserChartData = [];
                        UserGraphdata.TotalCount.map((item, index) => {
                            UserChartData.push({
                                y: item,
                                x: index,
                                marker: UserGraphdata.Month[index] + '\n' + item
                            })
                        })
                        return Object.assign({}, state, { UserGraphChartData: UserChartData, })
                    } else
                        return Object.assign({}, state, { UserGraphChartData: [] })

                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                    return Object.assign({}, state, { UserGraphChartData: [] })
                }
            }

            //Check Get Organization Graph Data Api Response 
            if (!OrganizationGraphFetchData) {
                try {
                    if (validateResponseNew({ response: OrganizationGraphdata, isList: true })) {

                        let OrganizationChartData = [];
                        OrganizationGraphdata.TotalCount.map((item, index) => {
                            OrganizationChartData.push({
                                y: item,
                                x: index,
                                marker: OrganizationGraphdata.Month[index] + '\n' + item
                            })
                        })
                        return Object.assign({}, state, { OrganizationGraphChartData: OrganizationChartData, })
                    } else
                        return Object.assign({}, state, { OrganizationGraphChartData: [], })
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                    return Object.assign({}, state, { OrganizationGraphChartData: [], })
                }
            }
        }
        return null
    }

    onPress = (id) => {
        if (id === 1) {
            this.props.navigation.navigate('WalletReportDashboard')
        }
        else if (id === 2) {
            this.props.navigation.navigate('CommonDashboard', {
                response: [
                    { title: R.strings.stakingConfiguration, icon: R.images.ic_configuration, id: 0, type: 1, navigate: 'StakingConfigListScreen' },
                    { title: R.strings.limitConfiguration, icon: R.images.ic_configuration, id: 1, type: 1, navigate: 'LimitConfigListScreen' },
                    { title: R.strings.chargeConfig, icon: R.images.ic_configuration, id: 2, type: 1, navigate: 'ChargeConfigListScreen' },
                    { title: R.strings.depositionInterval, icon: R.images.ic_configuration, id: 3, type: 1, navigate: 'DepositionIntervalScreen' },
                    { title: R.strings.erc223Configuration, icon: R.images.ic_configuration, id: 4, type: 1, navigate: 'ERC223ConfigDashboard' },
                    { title: R.strings.blockUnblockUserAddress, icon: R.images.ic_configuration, id: 5, type: 1, navigate: 'UserAddressScreen' },
                ], title: R.strings.configurations
            })
        }
        else if (id === 3) {
            this.props.navigation.navigate('WalletUtilitesDashboard')
        }
        else if (id === 4) {
            this.props.navigation.navigate('CommonDashboard', {
                response: [
                    { title: null, value: R.strings.wallet_usage_policy, icon: R.images.IC_WALLET, id: 0, type: 1, navigate: 'WalletUsagePolicyListScreen', },
                    { title: null, value: R.strings.transaction_policy, icon: R.images.IC_VIEW_LIST, id: 1, type: 1, navigate: 'TransactionPolicyListScreen' },
                ], title: R.strings.Policies
            })
        }
    }

    onWalletSummaryPress = (id) => {
        if (id === 1) {
            this.props.navigation.navigate('UserWalletListScreen')
        }
        else if (id === 2) {
            this.props.navigation.navigate('WalletTypesScreen')
        }
        else if (id === 3) {
            this.props.navigation.navigate('WalletMemberListScreen')
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { OrgDetailIsFetching, UserDetailIsFetching, TypeDetailIsFetching, RoleDetailIsFetching,
            WalletTypeIsFetching, WalletSummaryIsFetching, WalletStatusDetailIsFetching, UserGraphIsFetching, OrganizationGraphIsFetching } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.WalletDashBoard}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={OrgDetailIsFetching || UserDetailIsFetching || TypeDetailIsFetching || RoleDetailIsFetching || WalletTypeIsFetching || WalletSummaryIsFetching || WalletStatusDetailIsFetching || UserGraphIsFetching || OrganizationGraphIsFetching} />

                <ScrollView>

                    {/* Header Title For Wallet Types Card */}
                    {this.state.WalletTypesData.length > 0 &&
                        <View style={{ flex: 1, }}>

                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widget_left_right_margin, flexDirection: 'row' }}>
                                <Image
                                    source={R.images.IC_WALLET}
                                    style={{ alignSelf: 'center', width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.accent }}
                                />
                                <Text style={{ marginLeft: R.dimens.widget_left_right_margin, alignSelf: 'center', fontSize: R.dimens.mediumText, color: R.colors.accent, fontWeight: "bold" }}>{R.strings.WalletTypes}</Text>
                            </View>

                            <Carousel
                                ref={c => this._slider1Ref = c}
                                data={this.state.WalletTypesData}
                                renderItem={({ item }) => <SliderListItem item={item} />}
                                sliderWidth={sliderWidth}
                                itemWidth={itemWidth}
                                inactiveSlideScale={0.95}
                                inactiveSlideOpacity={1}
                                hasParallaxImages={true}
                                firstItem={0}
                                activeSlideAlignment={'center'}
                                activeAnimationType={'spring'}
                                activeAnimationOptions={{
                                    friction: 4,
                                    tension: 40
                                }}
                                loop={true}
                                onSnapToItem={(index) => this.setState({ activeSlide: index })}
                            />

                        </View>
                    }

                    {/* Wallets, Wallet Types, Wallet Member and Wallet Total Card */}
                    <FlatList
                        numColumns={2}
                        data={this.state.WalletSummaryDetails}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    icon={item.icon}
                                    title={item.title}
                                    value={item.value}
                                    index={index}
                                    width={width}
                                    titleStyle={{ fontWeight: 'bold', fontSize: R.dimens.smallText }}
                                    size={this.state.WalletSummaryDetails.length}
                                    isGrid={true}
                                    type={1}
                                    viewHeight={this.state.walletViewHeight}
                                    onChangeHeight={(height) => {
                                        this.setState({ walletViewHeight: height });
                                    }}
                                    onPress={() => this.onWalletSummaryPress(item.id)}
                                />

                            )
                        }}
                        keyExtractor={(_item, index) => index.toString()}
                    />

                    {/* Organization And Users Detail Card */}
                    <View style={{ flex: 1, flexDirection: 'row', }}>

                        <CardView cardRadius={0} style={{
                            flex: 1,
                            width: width / 2,
                            marginTop: R.dimens.widgetMargin,
                            marginLeft: R.dimens.widget_left_right_margin,
                            marginRight: R.dimens.widgetMargin,
                            padding: R.dimens.normalizePixels(0)
                        }}>

                            <View>
                                <View style={{ flex: 1, paddingTop: R.dimens.WidgetPadding, paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding, }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: R.dimens.smallText, color: R.colors.accent }}>{R.strings.Organizations}</Text>
                                    </View>

                                    <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(this.state.OrgTodayCount + ' ' + R.strings.createdToday)}</Text>
                                    <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary, fontSize: R.dimens.largeText, fontWeight: 'bold' }}>{validateValue(this.state.OrgTotalCount)}</Text>

                                </View>
                                {this.state.OrganizationGraphChartData.length > 0 &&
                                    <LineChart
                                        style={{ height: R.dimens.LoginImageWidthHeight }}
                                        data={{
                                            dataSets: [
                                                {
                                                    values: this.state.OrganizationGraphChartData,
                                                    label: "",
                                                    config: {
                                                        mode: "CUBIC_BEZIER",
                                                        drawValues: false,
                                                        lineWidth: R.dimens.LineHeight,
                                                        drawCircles: true,
                                                        circleColor: processColor(R.colors.currentLevelBlue),
                                                        drawCircleHole: false,
                                                        drawFilled: true,
                                                        highlightColor: processColor(R.colors.currentLevelBlue),
                                                        color: processColor(R.colors.currentLevelBlue),
                                                        circleRadius: R.dimens.LineHeight,
                                                    }
                                                },
                                            ]
                                        }}
                                        chartDescription={{ text: "" }}
                                        legend={{ enabled: false }}
                                        marker={{
                                            markerColor: processColor(R.colors.cardBackground),
                                            enabled: true,
                                            textColor: processColor(R.colors.textPrimary)
                                        }}
                                        xAxis={{  enabled: false,  }}
                                        yAxis={{
                                            left: {
                                                enabled: false 
                                            },
                                            right: {
                                                enabled: false 
                                            }
                                        }}
                                        autoScaleMinMaxEnabled={true}
                                        animation={{
                                            durationX: 0,
                                            easingY: "EaseInOutQuart",
                                            durationY: 1500,
                                        }}
                                        drawGridBackground={false}
                                        touchEnabled={false} scaleYEnabled={false}
                                        dragEnabled={false}
                                        scaleEnabled={false}
                                        scaleXEnabled={false} pinchZoom={false}
                                        doubleTapToZoomEnabled={false} dragDecelerationEnabled={false}
                                        drawBorders={false}
                                        keepPositionOnRotation={false}

                                    />
                                }

                            </View>

                        </CardView>

                        <CardView cardRadius={0} style={{
                            flex: 1,
                            width: width / 2,
                            marginTop: R.dimens.widgetMargin,
                            marginLeft: R.dimens.widgetMargin,
                            marginRight: R.dimens.widget_left_right_margin,
                            justifyContent: 'center',
                            padding: R.dimens.normalizePixels(0)
                        }}>

                            <View style={{ flex: 1, paddingTop: R.dimens.WidgetPadding, paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding, }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: R.dimens.smallText, color: R.colors.failRed }}>{R.strings.Users}</Text>
                                </View>

                                <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(this.state.UserTodayCount + ' ' + R.strings.NewRegister)}</Text>
                                <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary, fontSize: R.dimens.largeText, fontWeight: 'bold' }}>{validateValue(this.state.UserTotalCount)}</Text>

                            </View>
                            {this.state.UserGraphChartData.length > 0 &&
                                <LineChart
                                    style={{ height: R.dimens.LoginImageWidthHeight }}
                                    data={{
                                        dataSets: [
                                            {
                                                values: this.state.UserGraphChartData,
                                                label: "",
                                                config: {
                                                    mode: "CUBIC_BEZIER",
                                                    drawValues: false,
                                                    lineWidth: R.dimens.LineHeight,
                                                    drawCircles: true,
                                                    circleColor: processColor(R.colors.failRed),
                                                    drawCircleHole: false,
                                                    highlightColor: processColor(R.colors.failRed),
                                                    circleRadius: R.dimens.LineHeight,
                                                    color: processColor(R.colors.failRed),
                                                    drawFilled: true,
                                                }
                                            },
                                        ]
                                    }}
                                    chartDescription={{ text: "" }}
                                    legend={{
                                        enabled: false
                                    }}
                                    marker={{
                                        enabled: true,
                                        markerColor: processColor(R.colors.cardBackground),
                                        textColor: processColor(R.colors.textPrimary)
                                    }}
                                    xAxis={{
                                        enabled: false,
                                    }}
                                    yAxis={{
                                        left: {
                                            enabled: false
                                        },
                                        right: {
                                            enabled: false
                                        }
                                    }}
                                    autoScaleMinMaxEnabled={true}
                                    animation={{
                                        durationX: 0,
                                        durationY: 1500,
                                        easingY: "EaseInOutQuart"
                                    }}
                                    drawGridBackground={false}
                                    drawBorders={false}
                                    touchEnabled={false}
                                    dragEnabled={false}
                                    scaleEnabled={false}
                                    scaleXEnabled={false}
                                    scaleYEnabled={false}
                                    pinchZoom={false}
                                    doubleTapToZoomEnabled={false}
                                    dragDecelerationEnabled={false}
                                    keepPositionOnRotation={false}

                                />
                            }
                        </CardView>
                    </View>

                    {/* User Types Card */}
                    <View style={{ width: width / 2, flexDirection: 'row', }}>

                        <CardView cardRadius={0} style={{
                            flex: 1,
                            marginTop: R.dimens.margin,
                            marginLeft: R.dimens.margin,
                            marginRight: R.dimens.widgetMargin,
                            padding: R.dimens.normalizePixels(0)
                        }}>

                            <View style={{ flex: 1, paddingTop: R.dimens.widgetMargin, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding, }}>

                                <Image
                                    source={R.images.IC_ACCOUNT}
                                    style={{ alignSelf: 'flex-end', width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.cardValue }}
                                />

                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.largeText, fontWeight: 'bold' }}>{this.state.UserTypesCount.length ? this.state.UserTypesCount[0].Count : '-'}</Text>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{this.state.UserTypesCount.length ? (this.state.UserTypesCount[0].Name).toUpperCase() : '-'}</Text>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.largeText, fontWeight: 'bold' }}>{this.state.UserTypesCount.length ? this.state.UserTypesCount[1].Count : '-'}</Text>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{this.state.UserTypesCount.length ? (this.state.UserTypesCount[1].Name).toUpperCase() : '-'}</Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widget_top_bottom_margin }}>
                                    <Text style={{ fontSize: R.dimens.smallText, color: R.colors.accent }}>{R.strings.UserTypes}</Text>
                                </View>
                            </View>
                        </CardView>
                    </View>

                    {/* Wallet Status Detail */}
                    {this.state.WalletStatusDetail.length > 0 &&
                        <View style={{ flex: 1, padding: R.dimens.WidgetPadding, }}>

                            <Text style={{ fontSize: R.dimens.smallText, color: R.colors.accent, fontWeight: "bold" }}>{R.strings.WalletStatus}</Text>

                            <Carousel
                                ref={component => this.slider = component}
                                data={this.state.WalletStatusDetail}
                                renderItem={({ item }) => <FlatlistItem item={item} />}
                                sliderWidth={sliderWidth}
                                itemWidth={itemWidth}
                                inactiveSlideScale={0.95}
                                inactiveSlideOpacity={1}
                                hasParallaxImages={true}
                                firstItem={0}
                                activeSlideAlignment={'center'}
                                activeAnimationType={'spring'}
                                loop={true}
                                activeAnimationOptions={{
                                    friction: 4,
                                    tension: 40
                                }}
                                onSnapToItem={(index) => this.setState({ activeSlide: index })}
                            />
                        </View>
                    }

                    {/* For Sub Dashboards*/}
                    <View style={{ flex: 1 }}>
                        <FlatList
                            key={this.state.isGrid ? 'Grid' : 'List'}
                            numColumns={this.state.isGrid ? 2 : 1}
                            data={this.state.SubDashboards}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <CustomCard
                                        cardStyle={{ marginTop: R.dimens.widgetMargin }}
                                        icon={item.icon}
                                        value={item.title}
                                        index={index}
                                        width={width}
                                        titleStyle={{ fontWeight: 'bold' }}
                                        size={this.state.SubDashboards.length}
                                        isGrid={this.state.isGrid}
                                        type={1}
                                        viewHeight={this.state.viewHeight}
                                        onChangeHeight={(height) => {
                                            this.setState({ viewHeight: height });
                                        }}
                                        onPress={() => this.onPress(item.id)}
                                    />

                                )
                            }}
                            keyExtractor={(_item, index) => index.toString()}
                        />
                    </View>
                </ScrollView>
            </SafeView>
        );
    }
}

class FlatlistItem extends Component {

    render() {

        return (<CardView style={{
            marginRight: R.dimens.widgetMargin,
            marginLeft: R.dimens.widgetMargin,
            marginTop: R.dimens.widget_top_bottom_margin,
            marginBottom: R.dimens.widgetMargin
        }}>
            <View>
                <Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText }}>
                    {this.props.item.Name}
                </Text>
                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold' }}>
                    {this.props.item.Count}
                </Text>
            </View>
        </CardView>)
    }
}

// This Class is used for display record in list
class SliderListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let { item } = this.props;

        return (
            <CardView style={{
                marginRight: R.dimens.widgetMargin,
                marginLeft: R.dimens.widgetMargin,
                marginTop: R.dimens.widgetMargin,
                marginBottom: R.dimens.widgetMargin,
            }}>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {/* coin image  */}
                    <ImageViewWidget url={item.WalletType ? item.WalletType : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

                    <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontWeight: 'bold' }}>{validateValue(item.WalletType + ' ' + R.strings.Wallets)}</Text>
                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{validateValue(item.WalletCount)}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center' }}>

                            <View style={{ flex: 1, }}>
                                <Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Members}</Text>
                                <Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Transactions}</Text>
                                <Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Balance}</Text>
                            </View>

                            <View style={{ flex: 1, }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontWeight: 'bold' }}>{validateValue(item.UserCount)}</Text>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontWeight: 'bold' }}>{validateValue(item.TransactionCount)}</Text>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontWeight: 'bold' }}>{validateValue(item.ToatalBalance)}</Text>
                            </View>

                        </View>
                    </View>
                </View>
            </CardView>
        )
    };

}

function mapStateToProps(state) {
    return {

        //Updated Data Organization Details
        OrgDetailFetchData: state.WalletMainDashboardReducer.OrgDetailFetchData,
        OrgDetailIsFetching: state.WalletMainDashboardReducer.OrgDetailIsFetching,
        OrgDetaildata: state.WalletMainDashboardReducer.OrgDetaildata,

        //Updated Data User Details
        UserDetailFetchData: state.WalletMainDashboardReducer.UserDetailFetchData,
        UserDetailIsFetching: state.WalletMainDashboardReducer.UserDetailIsFetching,
        UserDetaildata: state.WalletMainDashboardReducer.UserDetaildata,

        //Updated Data Type Details
        TypeDetailFetchData: state.WalletMainDashboardReducer.TypeDetailFetchData,
        TypeDetailIsFetching: state.WalletMainDashboardReducer.TypeDetailIsFetching,
        TypeDetaildata: state.WalletMainDashboardReducer.TypeDetaildata,

        //Updated Data Wallet Type Details
        WalletTypeFetchData: state.WalletMainDashboardReducer.WalletTypeFetchData,
        WalletTypeIsFetching: state.WalletMainDashboardReducer.WalletTypeIsFetching,
        WalletTypedata: state.WalletMainDashboardReducer.WalletTypedata,

        //Updated Data Wallet Summary Details
        WalletSummaryFetchData: state.WalletMainDashboardReducer.WalletSummaryFetchData,
        WalletSummaryIsFetching: state.WalletMainDashboardReducer.WalletSummaryIsFetching,
        WalletSummarydata: state.WalletMainDashboardReducer.WalletSummarydata,

        //Updated Data Wallet Status Type Details
        WalletStatusDetailFetchData: state.WalletMainDashboardReducer.WalletStatusDetailFetchData,
        WalletStatusDetailIsFetching: state.WalletMainDashboardReducer.WalletStatusDetailIsFetching,
        WalletStatusDetaildata: state.WalletMainDashboardReducer.WalletStatusDetaildata,

        //Updated Data Of User Graph Data
        UserGraphFetchData: state.WalletMainDashboardReducer.UserGraphFetchData,
        UserGraphIsFetching: state.WalletMainDashboardReducer.UserGraphIsFetching,
        UserGraphdata: state.WalletMainDashboardReducer.UserGraphdata,

        //Updated Data Of Organization Data
        OrganizationGraphFetchData: state.WalletMainDashboardReducer.OrganizationGraphFetchData,
        OrganizationGraphIsFetching: state.WalletMainDashboardReducer.OrganizationGraphIsFetching,
        OrganizationGraphdata: state.WalletMainDashboardReducer.OrganizationGraphdata,
    }
}

function mapDispatchToProps(dispatch) {

    return {

        //Perform Organization Details
        getOrganizationsDetails: () => dispatch(getOrganizationsDetails()),

        //Perform User Details
        getUsersDetails: () => dispatch(getUsersDetails()),

        //Perform Type Details
        getUserTypesDetails: () => dispatch(getUserTypesDetails()),

        //Perform Wallet Type List
        getWalletTypeList: () => dispatch(getWalletTypeList()),

        //Perform Get Wallet Summary
        getWalletSummary: () => dispatch(getWalletSummary()),

        //Perform Get Wallet Status Details
        getWalletStatusDetails: () => dispatch(getWalletStatusDetails()),

        //Perform Get User Graph Data
        getUserGraph: () => dispatch(getUserGraph()),

        //Perform Get Organization Graph Data 
        getOrganizationGraph: () => dispatch(getOrganizationGraph()),

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WalletMainDashboard)
//---------------------------------

