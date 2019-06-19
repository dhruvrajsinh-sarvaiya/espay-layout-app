/**
  * Auther : Salim Deraiya
 * Created : 04/02/2018
 * Risk Score Chart Component
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// intl messages
import IntlMessages from "Util/IntlMessages";

class RiskScoreChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            optionChart : {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Stacked bar chart'
                },
                xAxis: {
                    categories: ['']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                legend: {
                    reversed: true
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                series: [{
                    name: '',
                    data: [5, 3, 4, 7, 2]
                }, {
                    name: '',
                    data: [2, 2, 3, 2, 1]
                }, {
                    name: '',
                    data: [3, 4, 4, 2, 5]
                }]
            }
        };
    }    

    render() {
        const { optionChart, loading } = this.state;
        return (
            <Fragment>                
                {loading && <JbsSectionLoader />}
                <HighchartsReact highcharts={Highcharts} options={optionChart} />
            </Fragment>
        );
    }
}

// default props value
RiskScoreChart.defaultProps = {
    LeaderId : 0
}

// map state to props
/* const mapStateToProps = ({ forgotPassRdcer }) => {
    var response = {
        data: forgotPassRdcer.data,
        loading: forgotPassRdcer.loading
    };
    return response;
};

export default withRouter(connect(mapStateToProps, {
    forgotPassword
})(RiskScoreChart)); */

export default RiskScoreChart;
