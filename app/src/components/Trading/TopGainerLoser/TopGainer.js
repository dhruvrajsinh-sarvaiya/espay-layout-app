import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import Separator from '../../../native_theme/components/Separator';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen, addComponentDidResume } from '../../../components/Navigation';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { getTopGainersData } from '../../../actions/Trade/TopGainerLoser/TopGainerActions';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Cache } from '../../../App';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';
const CacheName = 'TopGainer';

class TopGainer extends Component {
    constructor(props) {
        super(props);

        // To handle resume screen event
        addComponentDidResume({ props, componentDidResume: this.componentDidResume, widgetname: CacheName })

        //Define All initial State
        this.state = {
            response: [],
            types: [{ value: R.strings.volume, code: 1 }, { value: R.strings.changePercentage, code: 2 }, { value: R.strings.lastPrice, code: 3 }, { value: R.strings.changeValue, code: 4 }],
            type: R.strings.volume
        };
    }

    componentDidResume = () => {

        // check cache data is exist then store into state and clear cache
        if (Cache.getCache(CacheName) !== undefined) {
            this.setState(Cache.getCache([CacheName]));
            Cache.setCache({ [CacheName]: undefined });
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //If data is already stored then put in list and also set the picker
        if (this.props.data.topGainers) {
            this.setState({ type: this.state.types[this.state.types.findIndex(el => el.code == this.props.data.type)].value })
        } else {
            //To check internet
            if (await isInternet()) {
                let type = this.state.types[this.state.types.findIndex(el => el.value === this.state.type)].code;

                //To get top gainers
                this.props.getTopGainers({ type });
            }
        }

    };

    shouldComponentUpdate(nextProps, nextState) {

        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme
            || this.props.preference.locale !== nextProps.preference.locale
            || this.props.preference.dimensions.isPortrait !== nextProps.preference.dimensions.isPortrait) {
            return true;
        } else {
            if (this.props.data.topGainers !== nextProps.data.topGainers ||
                this.props.data.loading !== nextProps.data.loading ||
                this.state.response !== nextState.response) {
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    }

    static getDerivedStateFromProps(props, state) {

        try {
            //Get All Updated field of Particular actions 
            let { topGainers } = props.data;

            // check topgainer data is available
            if (topGainers) {

                //if local topGainers state is null or its not null and also different then new response then and only then validate response.
                if (state.topGainers == null || (state.topGainers != null && topGainers !== state.topGainers)) {
                    let newState = { topGainers };

                    if (validateResponseNew({ response: topGainers, isList: true })) {

                        let res = parseArray(topGainers.Response);

                        let finalList = [];
                        res.forEach((el, index) => {
                            if (index < 5) {
                                finalList.push(el);
                            }
                        })

                        newState = Object.assign({}, newState, {
                            response: finalList,
                        });
                    }

                    //check for current screen
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

        let result = [];

        //check for response is available or not
        if (this.state.response.length) {
            result = this.state.response;
        }

        return (
            <SafeView style={{
                flex: 1,
                backgroundColor: R.colors.background,
            }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* Progress and List*/}
                {(this.props.data.loading)
                    ?
                    <View style={{ height: R.dimens.emptyListWidgetHeight }}>
                        <ListLoader />
                    </View>
                    :
                    (result &&
                        <FlatList
                            data={result}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return <TopGainersItem
                                    isPortrait={this.props.preference.dimensions.isPortrait}
                                    index={index}
                                    item={item}
                                    size={result.length}
                                    type={this.state.type}
                                    theme={this.props.preference.theme}
                                />
                            }}
                            keyExtractor={(_item, index) => index.toString()}
                            contentContainerStyle={contentContainerStyle(result)}
                            ListEmptyComponent={<View style={{ height: R.dimens.emptyListWidgetHeight }}>
                                <ListEmptyComponent />
                            </View>}
                        />)
                }
            </SafeView>
        );
    }
}

class TopGainersItem extends Component {

    shouldComponentUpdate(nextProps) {
        if (this.props.item !== nextProps.item ||
            this.props.index !== nextProps.index ||
            this.props.size !== nextProps.size ||
            this.props.type !== nextProps.type ||
            this.props.isPortrait !== nextProps.isPortrait ||
            this.props.theme !== nextProps.theme) {
            return true;
        } else {
            return false;
        }
    }
    render() {

        // Get required fields from props
        let { item: { PairName, Volume, ChangePer, LTP, High, Low }, index, size, type } = this.props;

        let sign = ChangePer != 0 ? (ChangePer > 0 ? '+' : '') : '';
        let firstCurrency = PairName.split('_')[0];
        let secondCurrency = '/' + PairName.split('_')[1];

        // apply color based on sign
        let changeColor;
        if (sign === '' && ChangePer == 0) {
            changeColor = R.colors.textSecondary;
        } else if (sign === '+') {
            changeColor = R.colors.successGreen;
        } else {
            changeColor = R.colors.failRed;
        }

        return (
            <AnimatableItem>
                <View style={{ flex: 1 }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        paddingLeft: R.dimens.widget_left_right_margin,
                        paddingRight: R.dimens.widget_left_right_margin,
                        marginTop: (index == 0) ? R.dimens.widgetMargin : R.dimens.widgetMargin,
                        marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    }}>
                        <TextViewMR style={{ width: '4%', color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{index + 1}.</TextViewMR>

                        <View style={{ width: '40%' }}>
                            <TextViewMR style={{ color: R.colors.textSecondary, fontSize: R.dimens.secondCurrencyText }}><TextViewMR style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{firstCurrency}</TextViewMR>{secondCurrency}</TextViewMR>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{R.strings.vol_24h} {Volume.toFixed(8)}</TextViewHML>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText, }}>{R.strings.h}: {High.toFixed(8)}</TextViewHML>
                        </View>

                        <View style={{ width: '30%' }}>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{LTP.toFixed(8)}</TextViewHML>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{' '}</TextViewHML>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{R.strings.l}: {Low.toFixed(8)}</TextViewHML>
                        </View>

                        <View style={{ width: '26%', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <TextViewHML style={{
                                width: '75%',
                                padding: R.dimens.widgetMargin,
                                backgroundColor: changeColor,
                                color: R.colors.white,
                                fontSize: R.dimens.secondCurrencyText,
                                textAlign: 'center',
                                alignSelf: 'center'
                            }}>
                                {sign + ChangePer.toFixed(2) + '%'}
                            </TextViewHML>
                        </View>
                    </View>
                    {index !== size - 1 &&
                        <Separator />
                    }
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        // Updated state for reducer
        preference: state.preference,
        data: state.topGainerReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform action for Top Gainer
        getTopGainers: (payload) => dispatch(getTopGainersData(payload)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TopGainer);