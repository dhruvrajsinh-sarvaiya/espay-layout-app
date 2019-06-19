/**
 * Create By Sanjay 
 * Created Date 18/03/2019
 * Component For Hit By Browser Pie Chart
 */
import React, { Component } from 'react';
import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';

charts(fusioncharts);

export default class HitByBrowserPieChart extends Component {

    state = {
        dataSource: {}
    }

    componentWillReceiveProps(nextProps) {
        var mydata =
            nextProps.Browser.map((res, index) => {
                return {
                    label: res.Browser,
                    value: res.ReqCount.toString()
                }
            });
        this.setState({
            dataSource: {
                "chart": {
                    "caption": "Hits By Browser",
                    "showvalues": "1",
                    "enablemultislicing": "1",
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
                    type="pie3d"
                    width='100%'
                    dataFormat="JSON"
                    dataSource={this.state.dataSource} />
            </div>
        )
    }
}
