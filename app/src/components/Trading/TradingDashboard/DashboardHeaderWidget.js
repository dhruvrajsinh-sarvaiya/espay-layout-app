import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import CardView from '../../../native_theme/components/CardView';
import R from '../../../native_theme/R';
import { isCurrentScreen, addComponentDidResume } from '../../Navigation';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import ImageViewWidget from '../../Widget/ImageViewWidget';
import { getAllBalance } from '../../../actions/Wallet/FundViewAction';
import { validateValue, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { parseFloatVal, windowPercentage, addListener } from '../../../controllers/CommonUtils';
import { Cache } from '../../../App';
import { Events } from '../../../controllers/Constants';

const CacheName = 'DashboardHeaderWidget';

class DashboardHeaderWidget extends Component {

    constructor(props) {
        super(props)

        // To fire resume event when component is reappear
        addComponentDidResume({ props, componentDidResume: this.componentDidResume, widgetName: CacheName });

        let { width, height } = Dimensions.get('window');

        let contentPercentage = windowPercentage(65, width);

        //Define All initial State
        this.state = {
            response: [],
            responseTemp: [{}, {}, {}],

            // as tablet will consider 40% of screen so display content in rest 60%	
            width: width < height ? width : contentPercentage,
            itemWidth: windowPercentage(85, width < height ? width : contentPercentage),
        };
    };

    componentDidResume = () => {

        // check cache data is exist then store into state and clear cache
        if (Cache.getCache(CacheName) !== undefined) {

            this.setState(Cache.getCache([CacheName]));
            Cache.setCache({ [CacheName]: undefined });
        }
    }

    componentDidMount = async () => {
        // If data is not found & Check NetWork is Available or not
        if (!this.props.AllBalanceData && await isInternet()) {

            //Call Get All Balance from API
            this.props.getAllBalance();
        }

        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, (data) => {

            let { width, height } = data;

            let contentPercentage = windowPercentage(65, width);

            this.setState({
                // as tablet will consider 40% of screen so display content in rest 60%	
                width: width < height ? width : contentPercentage,
                itemWidth: windowPercentage(85, width < height ? width : contentPercentage),
            })
        });
    };

    componentWillUnmount() {
        if (this.dimensionListener) {

            // remove listener of dimensions
            this.dimensionListener.remove();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.preference.theme !== nextProps.preference.theme
            || this.props.preference.locale !== nextProps.preference.locale
            || this.state.width !== nextState.width) {
            return true;
        } else if (this.props.AllBalanceData !== nextProps.AllBalanceData
            || this.props.onPress !== nextProps.onPress) {
            return isCurrentScreen(nextProps);
        } else {
            return false;
        }
    }

    static getDerivedStateFromProps(props, state) {
        try {
            //Get All Updated field of Particular actions 
            var { AllBalanceData } = props;

            // check balance data is available or not
            if (AllBalanceData) {

                //if local AllBalanceData state is null or its not null and also different then new response then and only then validate response.
                if (state.AllBalanceData == null || (state.AllBalanceData != null && AllBalanceData !== state.AllBalanceData)) {

                    let newState = { AllBalanceData };
                    if (validateResponseNew({ response: AllBalanceData.BizResponseObj, statusCode: AllBalanceData.statusCode, isList: true })) {
                        newState = Object.assign({}, newState, {
                            response: AllBalanceData.Response
                        });
                    }

                    // check for current screen
                    if (isCurrentScreen(props)) {
                        return Object.assign({}, state, newState);
                    } else {
                        Cache.setCache({ [CacheName]: newState });
                    }
                }
            }
        } catch (error) {
            return Object.assign({}, state, { response: [] });
        }
        return null;
    }

    render() {
        return <LinearGradient
            style={{ width: '100%' }}
            locations={[0, 1]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            colors={[R.colors.linearStart, R.colors.linearEnd]}>
            <View>
                <View style={{ justifyContent: 'center', marginTop: R.dimens.widgetMargin }}>
                    <TextViewMR style={{
                        position: 'absolute',
                        width: R.screen().width,
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontSize: R.dimens.mediumText,
                        color: R.colors.white,
                    }}>{R.strings.Balances}</TextViewMR>

                    {/* Open Drawer Button */}
                    <ImageTextButton
                        onPress={this.props.onPress}
                        icon={R.images.IC_DRAWER}
                        style={{
                            margin: 0,
                            marginLeft: R.dimens.widgetMargin,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: R.dimens.dashboardMenuIcon + R.dimens.margin,
                            height: R.dimens.dashboardMenuIcon + R.dimens.margin,
                        }}
                        iconStyle={{
                            padding: R.dimens.margin,
                            width: R.dimens.dashboardMenuIcon,
                            height: R.dimens.dashboardMenuIcon,
                        }} />
                </View>

                <Carousel
                    ref={component => this.slider = component}
                    data={this.state.response.length > 0 ? this.state.response : this.state.responseTemp}
                    renderItem={({ item }) => <CardHeaderItem item={item} preference={this.props.preference} />}
                    sliderWidth={this.state.width}
                    itemWidth={this.state.itemWidth}
                    inactiveSlideScale={1}
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
        </LinearGradient>
    }
}

class CardHeaderItem extends Component {

    shouldComponentUpdate = (nextProps, nextState) => {
        //If theme or locale is changed then update componenet
        if (this.props.item !== nextProps.item || this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else {
            return false;
        }
    };

    render() {

        // Get required fields from props
        let { item } = this.props;

        let icon = '', balance = '', walletName = '';

        // check for wallet type and balance is available 
        if (item.WalletType !== undefined && item.Balance !== undefined) {
            icon = item.WalletType ? item.WalletType : '';
            balance = parseFloatVal(validateValue(item.Balance)).toFixed(8);
            walletName = item.WalletType ? item.WalletType + ' ' + R.strings.Balance : '-';
        }

        return (<CardView cardBackground={R.colors.white} cardRadius={R.dimens.dashboardHeaderBalanceCardRadius} style={{
            margin: R.dimens.margin,
            marginBottom: R.dimens.margin * 2
        }}>
            <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}>
                {icon !== '' ? <ImageViewWidget
                    isNotAvailable={true}
                    url={icon}
                    style={{ alignSelf: 'center' }}
                    width={R.dimens.Verify_Image_Width_Height}
                    height={R.dimens.Verify_Image_Width_Height} /> : <View style={{ height: R.dimens.Verify_Image_Width_Height, width: R.dimens.Verify_Image_Width_Height }} />
                }
                <View style={{ flex: 1, marginLeft: R.dimens.margin, justifyContent: 'center', alignItems: 'flex-start', }}>
                    <TextViewHML style={{ color: R.colors.listValue, fontSize: R.dimens.largeText }}>{balance}</TextViewHML>
                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{walletName}</TextViewHML>
                </View>
            </View>
        </CardView>)
    }
}

const mapStateToProps = (state) => {
    return {
        // Updated state from reducer
        preference: state.preference,
        AllBalanceData: state.FundViewReducer.AllBalanceData,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform action for AllBalance
    getAllBalance: () => dispatch(getAllBalance()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardHeaderWidget);