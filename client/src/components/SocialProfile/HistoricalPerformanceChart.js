/**
 * Auther : Salim Deraiya
 * Created : 17/12/2018
 * Historical Performance Chart
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// intl messages
import IntlMessages from "Util/IntlMessages";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { getHistoricalPerformanceChartData } from "Actions/SocialProfile";

class HistoricalPerformanceChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentYear: '',
            data: [],
            optionChart: {
                chart: {
                    className: 'performance_chart',
                    height: 300,
                    margin: [20, 100, 35, 100],
                    spacingBottom: 0,
                    animation: false,
                    styledMode: true,
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: [{
                    tickPositions: '',
                    className: 'highcharts-color-0',
                    title: {
                        text: ''
                    }
                }],
                series: [{
                    data: [],
                    maxPointWidth: 100
                }]
            }
        };
    }

    componentWillMount() {
        var reqObj = { LeaderId: this.props.LeaderId }
        this.props.getHistoricalPerformanceChartData(reqObj);
    }

    onChangeData(chartData) {
        var maxValue = Math.max(...chartData.Data);
        var minValue = Math.abs(Math.min(...chartData.Data));
        var finalValue = maxValue > minValue ? maxValue : minValue;

        var newChartObj = Object.assign({}, this.state.optionChart);
        newChartObj.yAxis[0]['tickPositions'] = [-finalValue, 0.00, finalValue];
        newChartObj.series[0]['data'] = chartData.Data;

        this.setState({ currentYear: chartData.Year, optionChart: newChartObj });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsg });
        } else if (Object.keys(nextProps.data).length > 0 && typeof (nextProps.data.Response) !== 'undefined' && nextProps.data.Response.length > 0) {
            var chartList = nextProps.data.Response;
            var currentYearData = chartList[0]['Data']; //First record from the list

            var maxValue = Math.max(...currentYearData);
            var minValue = Math.abs(Math.min(...currentYearData));
            var finalValue = maxValue > minValue ? maxValue : minValue;

            var currentYear = chartList[0]['Year'];
            var chartOption = Object.assign({}, this.state.optionChart);
            chartOption.yAxis[0]['tickPositions'] = [-finalValue, 0.00, finalValue];
            chartOption.series[0]['data'] = currentYearData;


            this.setState({
                currentYear: currentYear,
                data: chartList,
                optionChart: chartOption
            });
        }
    }

    render() {
        const { data, optionChart, currentYear, loading } = this.state;
        return (
            <Fragment>
                {loading && <JbsSectionLoader />}
                <HighchartsReact highcharts={Highcharts} options={optionChart} />
                {data.length > 0 &&
                    <div className="performance_tbl_area" style={{ overflow: 'auto' }}>
                        <table className="table text-center performance_tbl">
                            <thead>
                                <tr>
                                    <th scope="col"><IntlMessages id="sidebar.year" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.jan" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.feb" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.mar" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.apr" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.may" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.jun" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.jul" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.aug" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.sep" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.oct" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.nov" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.dec" /></th>
                                    <th scope="col"><IntlMessages id="sidebar.total" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((list, index) => (
                                    <tr className={list.Year === currentYear ? "active" : ''} onClick={() => this.onChangeData(list)} key={index}>
                                        <th scope="row" className="td-year">{list.Year}</th>
                                        <td className={list.Data[0] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[0] === 0 ? '' : list.Data[0]}</td>
                                        <td className={list.Data[1] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[1] === 0 ? '' : list.Data[1]}</td>
                                        <td className={list.Data[2] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[2] === 0 ? '' : list.Data[2]}</td>
                                        <td className={list.Data[3] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[3] === 0 ? '' : list.Data[3]}</td>
                                        <td className={list.Data[4] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[4] === 0 ? '' : list.Data[4]}</td>
                                        <td className={list.Data[5] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[5] === 0 ? '' : list.Data[5]}</td>
                                        <td className={list.Data[6] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[6] === 0 ? '' : list.Data[6]}</td>
                                        <td className={list.Data[7] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[7] === 0 ? '' : list.Data[7]}</td>
                                        <td className={list.Data[8] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[8] === 0 ? '' : list.Data[8]}</td>
                                        <td className={list.Data[9] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[9] === 0 ? '' : list.Data[9]}</td>
                                        <td className={list.Data[10] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[10] === 0 ? '' : list.Data[10]}</td>
                                        <td className={list.Data[11] > 0 ? 'td-positive' : 'td-negative'}>{list.Data[11] === 0 ? '' : list.Data[11]}</td>
                                        <td className="td-total">{list.Total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </Fragment>
        );
    }
}

// default props value
HistoricalPerformanceChart.defaultProps = {
    LeaderId: 0
}

//MapStateToProps
const mapStateToProps = ({ historicalPerformanceRdcer, settings }) => {
    const response = {
        darkMode: settings.darkMode,
        data: historicalPerformanceRdcer.chartData,
        loading: historicalPerformanceRdcer.loading
    }
    return response;
};

export default connect(mapStateToProps, {
    getHistoricalPerformanceChartData
})(HistoricalPerformanceChart);