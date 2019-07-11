/**
 * Create By Sanjay
 * Created Date 18/03/2019
 * Api Access Pie Chart Component
 */

import React, { Component } from 'react';
import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';

charts(fusioncharts);

const dataSource = {
    "chart": {
        "caption": "API Access",
        "showlegend": "1",
        "legendPosition": "RIGHT",
        "showpercentvalues": "1",
        "usedataplotcolorforlabels": "1",
        "theme": "fusion",
        "showLabels": "0",
        "showValues": "0"
    },
    "data": [
        {
            "label": "Mobile Apps",
            "value": "32647479"
        },
        {
            "label": "Website",
            "value": "22100932"
        }
    ]
};

export default class APIAccessPieChart extends Component {
    render() {
        return (
            <div className="mt-25">
                <ReactFusioncharts
                    type="pie3d"
                    width='100%'
                    dataFormat="JSON"
                    dataSource={dataSource} />
            </div>
        )
    }
}
