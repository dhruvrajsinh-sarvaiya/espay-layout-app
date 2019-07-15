import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { connect } from 'react-redux';
import { changeTheme, parseArray, addListener } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ChartView from 'react-native-highcharts';
import { Method, ServiceUtilConstant } from '../../controllers/Constants';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import R from '../../native_theme/R';
import { getGraphDetails } from '../../actions/Trade/TradeChartAction';
import SafeView from '../../native_theme/components/SafeView';
import { getData } from '../../App';

class TradeChartWidget extends Component {

    constructor(props) {
        super(props);

        // Define All Initial State
        this.state = {
            graphDetails: null,
            chartData: [],
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check NetWork is Available or not
        if (await isInternet()) {

            if (getData(ServiceUtilConstant.KEY_IsMargin)) {
                // Call GraphDetails Api
                this.props.getGraphDetails({ pairName: this.props.pairName, interval: '15m', IsMargin: 1 });
            } else {
                // Call GraphDetails Api
                this.props.getGraphDetails({ pairName: this.props.pairName, interval: '15m' });
            }
        }

        // Handle Signal-R response for Chart Data
        this.listenerRecieveChartData = addListener(Method.RecieveChartData, (receivedMessage) => {

            if (receivedMessage !== null) {
                var charData = this.state.chartData;
                try {
                    const receivedMessageData = JSON.parse(receivedMessage);

                    if ((receivedMessageData.EventTime && this.state.socketData.length === 0) ||
                        (this.state.socketData.length !== 0 && receivedMessageData.EventTime > this.state.socketData.EventTime)) {

                        /*  charData.push(receivedMessageData.Data)
                         receivedMessageData.Data.map((info, key) => {
                             data.push(receivedMessageData.Data)
                         })

                         this.state.chartData.map((value, key) => {
                             data.push(value)
                         }) */
                    }

                    this.setState({ chartData: charData, socketData: receivedMessageData });
                } catch (error) {
                    //logger(error)
                }
            }

        });
    };

    componentWillUnmount() {
        // Remove Listener
        if (this.listenerRecieveChartData) {
            this.listenerRecieveChartData.remove();
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.result.isFetchingGraph !== nextProps.result.isFetchingGraph ||
            this.props.result.graphDetails !== nextProps.result.graphDetails ||
            this.state.chartData !== nextState.charData) {
            return isCurrentScreen(nextProps);
        } else {
            return false;
        }
    };

    static getDerivedStateFromProps(props, state) {

        // check for current screen
        if (isCurrentScreen(props)) {
            try {

                //Get All Updated Field of Particular actions
                let { graphDetails } = props.result;

                //if graphDetails response is success then handle resposne
                if (graphDetails) {
                    //if local graphDetails state is null or its not null and also different then new response then and only then validate response.
                    if (state.graphDetails == null || (state.graphDetails != null && graphDetails !== state.graphDetails)) {

                        if (validateResponseNew({ response: graphDetails, isList: true })) {
                            let chartData = parseArray(graphDetails.response);

                            return Object.assign({}, state, {
                                graphDetails,
                                chartData
                            })
                        } else {
                            return Object.assign({}, state, {
                                graphDetails
                            })
                        }
                    }
                }
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in widget
        var { isFetchingGraph } = this.props.result

        const info = [];
        const volume = [];

        const groupingUnits = [
            [
                "week", // unit name
                [1] // allowed multiples
            ],
            ["month", [1, 2, 3, 4, 6]]
        ];

        if (this.state.chartData.length !== 0) {

            this.state.chartData.map((value, key) => {
                info.push(
                    [
                        value.DataDate,
                        value.Open,
                        value.High,
                        value.Low,
                        value.Close
                    ]
                )

                volume.push([
                    value.DataDate,
                    value.Volume
                ])
            })
        }

        var conf = {
            colors: [R.colors.listSeprator, R.colors.successGreen, R.colors.chartColor1, R.colors.chartColor2, R.colors.chartColor3, R.colors.sellerPink, R.colors.chartColor4, R.colors.successGreen, R.colors.chartColor5, R.colors.chartColor2, R.colors.chartColor3],
            chart: {
                backgroundColor: R.colors.background,
                color: R.colors.cardBackground,
                width: R.screen().width,
            },
            credits: { enabled: false },
            responsive: {
                rules: [{
                    chartOptions: {
                        subtitle: {
                            text: null
                        },
                        navigator: {
                            enabled: false
                        }
                    }
                }]
            },
            rangeSelector: {
                buttons: [
                    {
                        type: 'minute',
                        count: 1,
                        text: '1m'
                    },
                    {
                        type: 'minute',
                        count: 5,
                        text: '5m'
                    },
                    {
                        type: 'minute',
                        count: 15,
                        text: '15m'
                    },
                    {
                        type: 'minute',
                        count: 30,
                        text: '30m'
                    },
                    {
                        type: 'hour',
                        count: 1,
                        text: '1h'
                    }, {
                        type: 'hour',
                        count: 6,
                        text: '6h'
                    },
                    {
                        type: 'day',
                        count: 1,
                        text: '1d'
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    },
                    {
                        type: 'month',
                        count: 3,
                        text: '3m'
                    },
                    {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    },
                    {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }],
                selected: 1,
                inputEnabled: false,
            },
            scrollbar: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            yAxis: [
                {
                    labels: {
                        align: "right",
                        x: -3
                    },
                    title: {
                        text: R.strings.data
                    },
                    lineWidth: 2,
                    height: '60%',
                    resize: {
                        enabled: true
                    }
                },
                {
                    labels: {
                        align: "right",
                        x: -3
                    },
                    title: {
                        text: R.strings.volume
                    },
                    top: "65%",
                    height: "35%",
                    offset: 0,
                    lineWidth: 2
                }
            ],

            tooltip: {
                split: true
            },

            series: [
                {
                    type: "candlestick",
                    name: this.props.pairName.replace('_', '/'),
                    data: info,
                    dataGrouping: {
                        units: groupingUnits
                    }
                },
                {
                    type: "column",
                    name: R.strings.volume,
                    data: volume,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                }

            ],
            plotOptions: {
                series: {
                    boostThreshold: 500 // number of points in one series, when reaching this number, boost.js module will be used
                },
                candlestick: {
                    color: R.colors.successGreen,
                    upColor: R.colors.failRed
                }
            },

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

        return (
            <SafeView style={{ flex: 1 }}>
                {/* To Check Response fetch or not if isFetchingGraph = true then display progress bar else display Chart*/}
                {isFetchingGraph ?
                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={'large'} color={R.colors.accent} />
                    </View> :
                    (this.state.chartData.length > 0 ?
                        <ChartView
                            style={{ flex: 1, backgroundColor: R.colors.background }}
                            config={conf}
                            stock={conf}
                            originWhitelist={['*']}
                            options={options} /> :
                        <ListEmptyComponent message={R.strings.noChartDataFound} />)}
            </SafeView>
        )
    }
}

function mapStateToProps(state) {
    // Updated Data of Tradechart
    return {
        result: state.tradeChartReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform action for Graph Detail
        getGraphDetails: (params) => dispatch(getGraphDetails(params)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeChartWidget);