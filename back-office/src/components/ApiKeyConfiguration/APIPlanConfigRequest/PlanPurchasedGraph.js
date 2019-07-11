/**
 * Create By Sanjay 
 * Created Date 18/03/2019
 * Component For Plan Purchased Graph
 */
import React, { Component, Fragment } from 'react';
import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';

charts(fusioncharts);

export default class PlanPurchasedGraph extends Component {
    state = {
        dataSource: {}
    }

    componentWillReceiveProps(nextProps) {
        var mydata =
            nextProps.PurchasePlan.map((res, index) => {
                return {
                    label: res.PlanName,
                    value: res.APIUsers.toString()
                }
            });
        this.setState({
            dataSource: {
                "chart": {
                    "caption": "Plan Purchased",
                    "showpercentvalues": "1",
                    "enablesmartlabels": "1",
                    "usedataplotcolorforlabels": "1",
                    "showlabels": "1",
                    "plottooltext": "$label, <b>$value</b>",
                    "theme": "fusion",
                    "showlegend": "1",
                    "showValues": "1",
                },
                "data": mydata
            }
        })
    }
    render() {
        return (
            <Fragment>
                <ReactFusioncharts
                    type="doughnut3d"
                    dataFormat="JSON"
                    width="100%"
                    height="100%"
                    dataSource={this.state.dataSource} />
            </Fragment>
        )
    }
}
