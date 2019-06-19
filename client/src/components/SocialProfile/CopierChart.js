/**
  * Auther : Salim Deraiya
 * Created : 04/02/2018
 * Copier Chart Component
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from './Widgets';

class CopierChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            optionChart : {
                chart: {
                    type: 'area',
                    zoomType: 'x'
                },
                title: {
                    text: ''
                },
                xAxis: {},
                yAxis: {},
                legend: {
                    enabled: false
                },
                /* plotOptions: {
                    area: {
                        fillOpacity: 0.2,
                        lineWidth: 1,
                        step: 'center'
                    }
                }, */
                /* tooltip: {
                    headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
                    valueDecimals: 2
                }, */
                series: [{
                    name: 'Copier',
                    data: [ 0.948665,35.510715,39.883437,40.499661,43.262994,60.1479940,68.381696 ],
                    color: '#52bdf5'
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
CopierChart.defaultProps = {
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
})(CopierChart)); */

export default CopierChart;
