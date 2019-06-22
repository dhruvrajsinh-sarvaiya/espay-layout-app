import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeTheme, parseFloatVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ChartView from 'react-native-highcharts';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { getMarketDepthData } from '../../../actions/Trade/MarketDepthActions';
import R from '../../../native_theme/R';
import ListLoader from '../../../native_theme/components/ListLoader';
import SafeView from '../../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class MarginMarketDepthChart extends Component {
    constructor(props) {
        super(props);

        //Define all initial State
        this.state = {
            askData: [],
            bidData: []
        };
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check market depth is not available
        // check for internet connection
        if (this.props.result.marketDepth === null && await isInternet()) {

            // Call get market depth chart
            this.props.getMarketDepthData({ Pair: this.props.PairName, IsMargin: 1 });
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else {
            if (this.props.result.isLoading !== nextProps.result.isLoading ||
                this.props.result.marketDepth !== nextProps.result.marketDepth) {

                // stop twice api call 
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    };

    static getDerivedStateFromProps(props, state) {

        // check for current screen
        if (isCurrentScreen(props)) {
            try {

                //Get All Updated Field of Particular actions
                const { marketDepth } = props.result;

                // To check marketDepth is null or not
                if (marketDepth) {

                    //if local buyerbookdata state is null or its not null and also different then new response then and only then validate response.
                    if (state.marketDepth == null || (state.marketDepth != null && marketDepth !== state.marketDepth)) {

                        if (validateResponseNew({ response: marketDepth, isList: true })) {

                            var buyerorder = [];
                            var sellerorder = [];

                            //if bid list has records then add values in array for chart
                            if (marketDepth.Response.Bid.length !== 0) {
                                marketDepth.Response.Bid.map((value, key) => {
                                    if (parseFloatVal(value.Price) !== 0)
                                        buyerorder.push([value.Price, value.Amount])
                                })
                            }

                            //if ask book list has records then add values in array for chart
                            if (marketDepth.Response.Ask.length !== 0) {
                                marketDepth.Response.Ask.map((value, key) => {
                                    if (parseFloatVal(value.Price) !== 0)
                                        sellerorder.push([value.Price, value.Amount])
                                })
                            }

                            return Object.assign({}, state, {
                                bidData: buyerorder,
                                askData: sellerorder,
                                marketDepth
                            })
                        } else {
                            return Object.assign({}, state, {
                                bidData: [],
                                askData: [],
                                marketDepth
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
        //loading bit for handling progress
        var { isLoading } = this.props.result;

        // data for chart
        var conf = {
            chart: {
                type: 'area',
                zoomType: 'xy',
                backgroundColor: 'transparent',
            },
            credits: { enabled: false },
            title: {
                text: null,
            },
            xAxis: [{
                type: 'logarithmic',
                title: {
                    text: null,
                },
                width: wp('50%'),
                labels: {
                    style: {
                        color: R.colors.buyerGreen
                    }
                },
            }, {
                type: 'logarithmic',
                title: {
                    text: null,
                },
                labels: {
                    style: {
                        color: R.colors.sellerPink
                    }
                },
                offset: 0,
                left: wp('50%'),
                width: wp('50%')
            }],
            yAxis: {
                gridLineWidth: 0,
                title: {
                    text: null,
                }
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 600
                    },
                    chartOptions: {
                        chart: {
                            height: R.dimens.chartHeightMedium
                        },
                        subtitle: {
                            text: null
                        },
                        navigator: {
                            enabled: false
                        }
                    }
                }]
            },
            tooltip: {
                split: true,
            },
            rangeSelector: {
                enabled: false,
                inputEnabled: false
            },
            legend: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                series: {
                    boostThreshold: 500 // number of points in one series, when reaching this number, boost.js module will be used
                },
                area: {
                    softThreshold: true,
                    marker: {
                        radius: 2
                    },
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                },
            },
            series: [{
                name: R.strings.bid,
                type: 'area',
                data: this.state.bidData,
                color: R.colors.buyerGreen,
                fillColor: R.colors.buyerGreenOpacity,
                xAxis: 0,
            }, {
                name: R.strings.ask,
                type: 'area',
                data: this.state.askData,
                color: R.colors.orange,
                fillColor: R.colors.orangeOpacity,
                xAxis: 1,
            }]
        };
        const options = {
            /*  global: {
                 useUTC: false
             }, */
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };

        return (
            <SafeView style={{ flex: 1 }}>

                {/* To Check Response fetch or not if isLoading = true then display progress bar else display Chart*/}
                {(isLoading) ?
                    <ListLoader /> :
                    ((this.state.askData.length > 0 || this.state.bidData.length > 0) ?
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
    // Updated Data of Market Depth and Preference
    return {
        result: state.marketDepthReducer,
        preference: state.preference,
        //For Update isPortrait true or false
        orientation: state.preference.dimensions.isPortrait,
    }
}

function mapDispatchToProps(dispatch) {
    return {

        // Perform Market Depth Action
        getMarketDepthData: (Pair) => dispatch(getMarketDepthData(Pair)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarginMarketDepthChart);