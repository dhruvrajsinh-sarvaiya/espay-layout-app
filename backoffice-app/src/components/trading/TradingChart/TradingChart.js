import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ChartView from 'react-native-highcharts';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { getPairList } from '../../../actions/PairListAction';
import { getGraphData } from '../../../actions/Trading/TradingChartActions';
import Picker from '../../../native_theme/components/Picker';
import R from '../../../native_theme/R';
import { changeTheme, parseArray, } from '../../../controllers/CommonUtils';
import { AppConfig } from '../../../controllers/AppConfig';

class TradingChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chartData: [],
            currencyPairs: [],
            pair: AppConfig.initialPair,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //to get pair list
            this.props.getPairList({});

            // Call Actions For Get Chart Data      
            this.props.getGraphData({ Pair: this.state.pair, interval: '15m' });
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    static getDerivedStateFromProps(props, state) {

        try {
            if (isCurrentScreen(props)) {
                const { graphData, pairList } = props.data

                // To check graphData is null or not
                if (graphData) {

                    //if local graphData state is null or its not null and also different then new response then and only then validate response.
                    if (state.graphData == null || (state.graphData != null && graphData !== state.graphData)) {

                        if (validateResponseNew({ response: graphData, isList: true })) {
                            return Object.assign({}, state, { chartData: parseArray(graphData.response), graphData });
                        } else {
                            return Object.assign({}, state, { chartData: [], graphData });
                        }
                    }
                }

                //if pairList response is not null then handle resposne
                if (pairList) {

                    //if local pairList state is null or its not null and also different then new response then and only then validate response.
                    if (state.pairList == null || (state.pairList != null && pairList !== state.pairList)) {

                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: pairList, isList: true })) {
                            let currencyPairs = parseArray(pairList.Response);

                            currencyPairs.map((item, index) => {
                                currencyPairs[index].value = item.PairName;
                            })

                            return Object.assign({}, state, { pairList, currencyPairs });
                        } else {
                            return Object.assign({}, state, { pairList, currencyPairs: [] });
                        }
                    }
                }
            }
        } catch (error) {
            return null;
        }
        return null;
    }

    render() {
        const volume = [];
        const info = [];
        const groupingUnits = [
            [
                "week", // unit name
                [1] // allowed multiples
            ],
            ["month", [1, 2, 3, 4, 6]]
        ];
        var { isLoading } = this.props.data;

        if (this.state.chartData.length !== 0) {
            this.state.chartData.map((value, key) => {
                info.push([
                    value.DataDate,
                    value.Open,
                    value.High,
                    value.Low,
                    value.Close
                ])

                volume.push([
                    value.DataDate,
                    value.Volume
                ])
            })
        }

        var conf = {
            colors: [R.colors.listSeprator, R.colors.successGreen, R.colors.chartColor1, R.colors.chartColor2, R.colors.chartColor3, R.colors.sellerPink, R.colors.chartColor4, R.colors.successGreen, R.colors.chartColor5, R.colors.chartColor2, R.colors.chartColor3],
            credits: { enabled: false },
            chart: {
                color: R.colors.cardBackground,
                backgroundColor: R.colors.cardBackground,
            },
            exporting: {
                enabled: false
            },
            rangeSelector: {
                buttons: [
                    {
                        type: 'day', count: 1, text: '1d'
                    }, {
                        type: 'month', count: 1,
                        text: '1m'
                    },
                    {
                        type: 'month',
                        count: 3, text: '3m'
                    },
                    {
                        type: 'month', count: 6, text: '6m',
                    }],
                selected: 2,
                inputEnabled: false,
            },
            title: { text: "" },
            yAxis: [{
                labels: { align: "right", x: -3 },
                title: {
                    text: "Data"
                },
                height: "60%", lineWidth: 2, resize: { enabled: true }
            },
            {
                labels: {
                    align: "right",
                    x: -3
                },
                title: { text: "Volume" },
                top: "65%",
                height: "35%", offset: 0, lineWidth: 2
            }
            ],
            tooltip: {
                split: true
            },
            series: [
                {
                    type: "candlestick", name: "AAPL", data: info,
                    dataGrouping: { units: groupingUnits }
                },
                {
                    type: "column", name: "Volume", data: volume,
                    yAxis: 1, dataGrouping: {
                        units: groupingUnits
                    }
                }
            ], plotOptions: {
                candlestick: {
                    color: R.colors.successGreen,
                    upColor: R.colors.failRed
                }
            },
        };
        const options = {
            global: { useUTC: false }, lang: {
                decimalPoint: ',', thousandsSep: '.'
            }
        };

        return (

            <View style={{ flex: 1 }}>

                <View style={{ marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin }}>
                    <Picker
                        value={this.state.pair}
                        searchable={true}
                        data={this.state.currencyPairs}
                        onPickerSelect={async (item) => {

                            if (item !== this.state.pair) {
                                //Check NetWork is Available or not
                                if (await isInternet()) {
                                    // Call Actions For Get Chart Data      
                                    this.props.getGraphData({ Pair: item, interval: '15m' });
                                }
                                this.setState({ pair: item })
                            }
                        }}
                        renderItemTextStyle={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}
                        displayArrow={'true'}
                        width={'100%'}
                    />
                </View>

                {(isLoading) ?
                    <View 
                    style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={'large'} color={R.colors.accent} />
                    </View> :
                    (this.state.chartData.length > 0 ?
                        <ChartView
                            style={{ flex: 1, backgroundColor: R.colors.cardBackground }}
                            config={conf}
                            stock={conf}
                            options={options} /> :
                        <ListEmptyComponent message={R.strings.noChartDataFound} />)}
            </View>
        )
    }
}

function mapStatToProps(state) {
    let data = {
        ...state.tradeGraphBOReducer,
        ...state.pairListReducer,
        ...state.preference
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        getPairList: (payload) => dispatch(getPairList(payload)),
        getGraphData: (payload) => dispatch(getGraphData(payload))
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TradingChart);