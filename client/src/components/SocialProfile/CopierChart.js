/**
  * Auther : Salim Deraiya
 * Created : 04/02/2018
 * Copier Chart Component
 */

import React, { Component, Fragment } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

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

export default CopierChart;
