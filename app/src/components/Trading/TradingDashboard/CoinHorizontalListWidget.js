import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { GetBalance } from '../../../actions/PairListAction';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import ImageViewWidget from '../../Widget/ImageViewWidget';
import CardView from '../../../native_theme/components/CardView';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isCurrentScreen, addComponentDidResume } from '../../Navigation';
import { validateResponseNew, isInternet } from '../../../validations/CommonValidation';
import R from '../../../native_theme/R';
import { changeTheme, convertDate, windowPercentage, addListener } from '../../../controllers/CommonUtils';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Cache } from '../../../App';
import { Events } from '../../../controllers/Constants';

const CacheName = 'CoinHorizontalListWidget';

class CoinHorizontalListWidget extends Component {
    constructor(props) {
        super(props);

        // To fire resume event when component is reappear
        addComponentDidResume({ props, componentDidResume: this.componentDidResume, widgetName: CacheName });

        let { width, height } = Dimensions.get('window');
        let contentPercentage = width * 65 / 100;

        //Define All initial State
        this.state = {
            CoinData: null,
            responseCoinList: [],
            itemWidth: windowPercentage(85, width < height ? width : contentPercentage),
        };
    }

    componentDidResume = () => {

        //Whenever User manually change theme or locale from settings then its MainScreen needs to update
        R.colors.setTheme(props.preference.theme)
        R.strings.setLanguage(props.preference.locale);

        // check cache data is exist then store into state and clear cache
        if (Cache.getCache(CacheName) !== undefined) {

            this.setState(Cache.getCache([CacheName]));
            Cache.setCache({ [CacheName]: undefined });
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        // If data is not found & Check internet connection is available or not	
        if ((this.props.dataListCoin.CoinData === '' || this.props.dataListCoin.CoinData == null) && await isInternet()) {

            //fetching list of coin
            this.props.getCoinlist();
        }

        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, (data) => {

            let { width, height } = data;

            let contentPercentage = width * 65 / 100;

            this.setState({
                // as tablet will consider 35% of screen so display content in rest 65%	
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

    static getDerivedStateFromProps(props, state) {

        try {
            //Get All Updated field of Particular actions 
            var { dataListCoin: { CoinData } } = props;

            // check coin data is not empty
            if (CoinData !== '') {
                //if local CoinData state is null or its not null and also different then new response then and only then validate response.
                if (state.CoinData == null || (state.CoinData != null && CoinData !== state.CoinData)) {
                    let newState = { CoinData };

                    if (validateResponseNew({ response: CoinData, isList: true })) {
                        newState = Object.assign({}, newState, {
                            responseCoinList: CoinData.Response
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
            return Object.assign({}, state, { responseCoinList: [] });
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme
            || this.props.preference.locale !== nextProps.preference.locale
            || this.state.width !== nextState.width) {
            return true;
        } else if (this.props.dataListCoin.CoinData !== nextProps.dataListCoin.CoinData ||
            this.props.dataListCoin.isLoading !== nextProps.dataListCoin.isLoading ||
            this.state.responseCoinList !== nextState.responseCoinList) {
            return isCurrentScreen(nextProps);
        } else {
            return false;
        }
    }

    render() {
        return (
            <View style={{ flex: 1, marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}>
                <TextViewMR style={{
                    fontSize: R.dimens.mediumText,
                    color: R.colors.textPrimary,
                    paddingLeft: R.dimens.margin_left_right,
                    paddingRight: R.dimens.margin_left_right,
                }}>{R.strings.new_coins}</TextViewMR>

                {this.props.dataListCoin.isLoading ?
                    <View style={{ height: R.dimens.emptyListWidgetHeight }}>
                        <ListLoader />
                    </View> :
                    this.state.responseCoinList && this.state.responseCoinList.length > 0 ?
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {this.state.responseCoinList.map((item, index) => <CoinItem key={index.toString()} index={index} size={this.state.responseCoinList.length} itemWidth={this.state.itemWidth} item={item} navigation={this.props.navigation} preference={this.props.preference} />)}
                        </ScrollView>
                        :
                        <View style={{ height: R.dimens.emptyListWidgetHeight }}>
                            <ListEmptyComponent />
                        </View>
                }
            </View>
        );
    }
}

class CoinItem extends Component {

    constructor(props) {
        super(props)

        // Bind all method
        this.onPressLearnMore = this.onPressLearnMore.bind(this);
    };

    shouldComponentUpdate(nextProps) {
        if (this.props.preference.theme !== nextProps.preference.theme ||
            this.props.preference.locale !== nextProps.preference.locale ||
            this.props.itemWidth !== nextProps.itemWidth ||
            this.props.item !== nextProps.item
        ) {
            return true;
        }
        return false;
    }

    // Redirect to details screen
    onPressLearnMore() {
        this.props.navigation.navigate('CoinInfo', { DATA: this.props.item })
    }

    render() {
        // Get required fields from params
        let { itemWidth, index, size, item: { SMSCode, Name, IssueDate, TotalSupply, IssuePrice, CirculatingSupply } } = this.props;

        return (<CardView style={{
            width: itemWidth,
            marginTop: R.dimens.widgetMargin,
            marginBottom: R.dimens.widgetMargin,
            marginLeft: index == 0 ? R.dimens.widget_left_right_margin : R.dimens.widgetMargin,
            marginRight: (index == size - 1) ? R.dimens.widget_left_right_margin : R.dimens.widgetMargin,
            borderTopLeftRadius: 0,
            borderTopRightRadius: R.dimens.LoginButtonBorderRadius,
            borderBottomLeftRadius: R.dimens.LoginButtonBorderRadius,
            borderBottomRightRadius: 0,
            padding: R.dimens.margin
        }}>
            <View style={{ flex: 1, }}>
                <View style={{ flexDirection: 'row' }}>
                    <ImageViewWidget
                        url={SMSCode ? SMSCode : ''}
                        style={{ alignSelf: 'center' }}
                        width={R.dimens.feess_charges_list_image_height_width}
                        height={R.dimens.feess_charges_list_image_height_width} />

                    <TextViewMR style={{ color: R.colors.accent, fontSize: R.dimens.mediumText, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin }}>{SMSCode}</TextViewMR>
                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlignVertical: 'bottom' }}>{Name}</TextViewHML>
                </View>

                <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                    <View style={{ flex: 1, }}>
                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.issue_date}</TextViewHML>
                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }} ellipsizeMode={'tail'} numberOfLines={1}>{convertDate(IssueDate)}</TextViewHML>
                    </View>

                    <View style={{ flex: 1, }}>
                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.total_supply}</TextViewHML>
                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }} ellipsizeMode={'tail'} numberOfLines={1}>{TotalSupply}</TextViewHML>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                    <View style={{ flex: 1, }}>
                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.issue_price}</TextViewHML>
                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }} ellipsizeMode={'tail'} numberOfLines={1}>{IssuePrice}</TextViewHML>
                    </View>

                    <View style={{ flex: 1, }}>
                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.circulating_supply}</TextViewHML>
                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }} ellipsizeMode={'tail'} numberOfLines={1}>{CirculatingSupply}</TextViewHML>
                    </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <ImageButton
                        name={R.strings.learnMore}
                        textStyle={{ color: R.colors.accent, fontSize: R.dimens.smallText }}
                        isHML
                        style={{ margin: 0 }}
                        onPress={this.onPressLearnMore}
                    />
                </View>
            </View>
        </CardView>)
    }
}

const mapStateToProps = (state) => {
    return {
        // Update state from reducer
        preference: state.preference,
        dataListCoin: state.FetchCoinReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform CoinList action
    getCoinlist: () => dispatch(GetBalance()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinHorizontalListWidget);