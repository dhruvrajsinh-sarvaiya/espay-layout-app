import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import Separator from '../../../native_theme/components/Separator';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen, addComponentDidResume } from '../../Navigation';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { getTopLosersData, clearTopLoserData } from '../../../actions/Trading/TopLoserActions';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Cache } from '../../../App'
import Picker from '../../../native_theme/components/Picker';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';

const CacheName = 'MarginTopLoser';

class MarginTopLoser extends Component {
    constructor(props) {
        super(props);

        addComponentDidResume({ props, componentDidResume: this.componentDidResume, widgetname: CacheName })

        //Define all initial state
        this.state = {
            response: [],
            types: [{ value: R.strings.volume, code: 1 }, { value: R.strings.changePercentage, code: 2 }, { value: R.strings.lastPrice, code: 3 }, { value: R.strings.changeValue, code: 4 }],
            type: R.strings.volume,
            isMargin: props.isMargin,
        };
    }

    componentDidResume = () => {
        if (Cache.getCache(CacheName) !== undefined) {
            this.setState(Cache.getCache([CacheName]));
            Cache.setCache({ [CacheName]: undefined });
        }
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearTopLoserData()
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //If data is already stored then put in list and also set the picker
        if (this.props.data.topLosers) {
            this.setState({ type: this.state.types[this.state.types.findIndex(el => el.code == this.props.data.type)].value })
        } else {
            //To check internet
            if (await isInternet()) {
                let type = this.state.types[this.state.types.findIndex(el => el.value === this.state.type)].code;

                if (this.state.isMargin) {
                    //To get margin top gainers
                    this.props.getTopLosers({ type, IsMargin: 1 });
                } else {
                    //To get top gainers
                    this.props.getTopLosers({ type });
                }
            }
        }

    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else {
            if (this.props.data.topLosers !== nextProps.data.topLosers ||
                this.props.data.loading !== nextProps.data.loading ||
                this.state.response !== nextState.response) {
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    };

    static getDerivedStateFromProps(props, state) {

        try {
            let { topLosers } = props.data;

            if (topLosers) {

                //if local topLosers state is null or its not null and also different then new response then and only then validate response.
                if (state.topLosers == null || (state.topLosers != null && topLosers !== state.topLosers)) {
                    let newState = { topLosers };

                    if (validateResponseNew({ response: topLosers, isList: true })) {

                        let res = parseArray(topLosers.Response);

                        let finalList = [];
                        res.forEach((el, index) => {
                            if (index < 5) {
                                finalList.push(el);
                            }
                        })

                        newState = Object.assign({}, newState, {
                            response: finalList,
                        });
                    } else {
                        newState = Object.assign({}, newState, {
                            response: [],
                        });
                    }

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
        if (this.state.response.length) {
            result = this.state.response;
        }

        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                <View style={{ marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin }}>
                    <Picker
                        data={this.state.types}
                        value={this.state.type}
                        onPickerSelect={async (item) => {
                            //if old and new item is different than call api
                            if (item != this.state.type) {

                                //To check internet availablity
                                if (await isInternet()) {
                                    let type = this.state.types[this.state.types.findIndex(el => el.value === item)].code;

                                    if (this.state.isMargin) {
                                        //To get top gainers
                                        this.props.getTopLosers({ type, IsMargin: 1 });
                                    } else {
                                        //To get top gainers
                                        this.props.getTopLosers({ type });
                                    }
                                }

                                this.setState({ type: item })
                            }
                        }}
                        displayArrow={'true'}
                        width={'100%'}
                        renderItemTextStyle={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}
                    />
                </View>

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
                                return <TopLosersItem
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
            </View>
        );
    }
}

class TopLosersItem extends Component {

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item !== nextProps.item ||
            this.props.index !== nextProps.index ||
            this.props.size !== nextProps.size ||
            this.props.type !== nextProps.type ||
            this.props.theme !== nextProps.theme) {
            return true;
        }
        return false;
    }

    render() {

        let { item: { PairName, Volume, ChangePer, LTP, High, Low }, index, size } = this.props;

        let sign = ChangePer != 0 ?
            (ChangePer > 0 ? '+' : '') :
            '';
        let firstCurrency = PairName.split('_')[0];
        let secondCurrency = '/' + PairName.split('_')[1];


        //To Display various Color for changePercentage 
        let changeColor;
        if (sign === '' && ChangePer == 0) { changeColor = R.colors.textSecondary; }
        else if (sign === '+') { changeColor = R.colors.successGreen; }
        else {
            changeColor = R.colors.failRed;
        }

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{ flex: 1, }}>
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: R.dimens.widget_left_right_margin,
                        marginRight: R.dimens.widget_left_right_margin,
                        marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        flex: 1,
                        marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    }}>
                        <TextViewMR style={{ width: '4%', color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{index + 1}.</TextViewMR>

                        <View style={{ width: '40%' }}>
                            <TextViewMR style={{
                                flex: 1,
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.secondCurrencyText
                            }}><TextViewMR style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{firstCurrency}</TextViewMR>{secondCurrency}</TextViewMR>
                            <TextViewHML style={{
                                flex: 1, color: R.colors.textPrimary,
                                fontSize: R.dimens.secondCurrencyText
                            }}>{R.strings.vol_24h} {Volume.toFixed(8)}</TextViewHML>
                            <TextViewHML style={{
                                flex: 1,
                                color: R.colors.textPrimary,
                                fontSize: R.dimens.secondCurrencyText,
                            }}>
                                {R.strings.h}: {High.toFixed(8)}</TextViewHML>
                        </View>
                        <View style={{ width: '30%' }}>
                            <TextViewHML style={{
                                flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText
                            }}>{LTP.toFixed(8)}</TextViewHML>
                            <TextViewHML style={{
                                flex: 1,
                                color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText
                            }}>{' '}</TextViewHML>
                            <TextViewHML style={{
                                flex: 1, color: R.colors.textPrimary,
                                fontSize: R.dimens.secondCurrencyText
                            }}>{R.strings.l}: {Low.toFixed(8)}</TextViewHML>
                        </View>
                        <View style={{
                            width: '26%',
                            alignItems: 'flex-end', justifyContent: 'center'
                        }}>
                            <TextViewHML style={{
                                backgroundColor: changeColor,
                                padding: R.dimens.widgetMargin,
                                alignSelf: 'center',
                                color: R.colors.white,
                                fontSize: R.dimens.secondCurrencyText,
                                textAlign: 'right',
                                width: '75%',
                            }}>{sign + ChangePer.toFixed(2) + '%'}
                            </TextViewHML>
                        </View>
                    </View >
                    {index !== size - 1 && <Separator />}
                </View>

            </AnimatableItem>
        )
    }

}

function mapStatToProps(state) {
    return {
        preference: state.preference,
        data: state.MarginTopLoserReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getTopLosers action for getting top losers api 
        getTopLosers: (payload) => dispatch(getTopLosersData(payload)),
        //Clear Top Gainer Data action
        clearTopLoserData: () => dispatch(clearTopLoserData()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(MarginTopLoser);