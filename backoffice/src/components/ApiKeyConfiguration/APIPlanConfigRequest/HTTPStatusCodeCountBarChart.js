/**
 * Create By Sanjay 
 * Created Date 18/03/2019
 * Bar Chart For HTTP Status Code 
 */

import React, { Component } from 'react';
import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';

charts(fusioncharts);

export default class HTTPStatusCodeCountBarChart extends Component {
    state = {
        dataSource: {}
    }

    componentWillReceiveProps(nextProps) {
        var mydata =
            nextProps.StatusCode.map((res, index) => {
                return {
                    label: res.HTTPStatusCode.toString(),
                    value: res.ReqCount.toString()
                }
            });
        this.setState({
            dataSource: {
                "chart": {
                    "caption": "HTTP Status Code Count",
                    "xaxisname": "Status",
                    "theme": "fusion"
                },
                "data": mydata
            }
        })
    }
    render() {
        return (
            <div className="mt-25">
                <ReactFusioncharts
                    type="column3d"
                    width='100%'
                    height='70%'
                    dataFormat="JSON"
                    dataSource={this.state.dataSource} />
            </div>
        )
    }
}
