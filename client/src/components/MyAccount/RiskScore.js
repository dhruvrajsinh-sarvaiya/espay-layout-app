/**
 * Created By: Sanjay
 * Create Date:05/02/2019
 * Component For Risk Score Chart
 */
import React , {Fragment}from 'react';

import {Row,Col } from 'reactstrap';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Column2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

const chartConfigs = {
    type: 'mscolumnline3d',
    width: '100%',
    height: '400',
    dataFormat: 'json',
    dataSource: {
        "chart": {
            "caption": "AVERAGE RISK SCORE OF THE LAST 7 DAYS",
            "plottooltext": "$label has $dataValue $seriesName",
            "lineAlpha": "0",

            //Cosmetics
            "divlineAlpha": "100",
            "divlineColor": "#999999",
            "divlineThickness": "1",
            "divLineIsDashed": "1",
            "divLineDashLen": "1",
            "divLineGapLen": "1",
            "usePlotGradientColor": "0",
            "anchorRadius": "3",
            "theme": "fusion"
        },
        "categories": [{
            "category": [{
                "label": "Jan"
            },
            {
                "label": "Feb"
            },
            {
                "label": "Mar"
            },
            {
                "label": "Apr"
            },
            {
                "label": "May"
            },
            {
                "label": "Jun"
            },
            {
                "label": "Jul"
            },
            {
                "label": "Aug"
            },
            {
                "label": "Sep"
            },
            {
                "label": "Oct"
            },
            {
                "label": "Nov"
            },
            {
                "label": "Dec"
            }
            ]
        }],
        "dataset": [{
            "renderAs": "line",
            "lineAlpha": "0",
            "anchorSides": "1",
            "anchorRadius": "10",
            "seriesname": "MAX Risk",
            "data": [{
                "value": "7"
            },
            {
                "value": "5"
            },
            {
                "value": "7"
            },
            {
                "value": "9"
            },
            {
                "value": "4"
            },
            {
                "value": "8"
            },
            {
                "value": "9"
            },
            {
                "value": "5"
            },
            {
                "value": "8"
            },
            {
                "value": "6"
            },
            {
                "value": "2"
            },
            {
                "value": "4"
            }
            ]
        },
        {
            "showValues": "0",
            "seriesname": "AVG. Risk",
            "data": [{
                "value": "5"
            },
            {
                "value": "3"
            },
            {
                "value": "4"
            },
            {
                "value": "7"
            },
            {
                "value": "2"
            },
            {
                "value": "6"
            },
            {
                "value": "7"
            },
            {
                "value": "3"
            },
            {
                "value": "5"
            },
            {
                "value": "1"
            },
            {
                "value": "2"
            },
            {
                "value": "4"
            }
            ]
        }
        ]
    }
};

class RiskScore extends React.Component {
    render() {
        return (
            <Fragment>

                <div className="col-md-12 col-sm-12 col-lg-12">
                    <ReactFC
                        {...chartConfigs} />
                </div>

                <Col sm={12}>
                    <h4 className="pt-30 pl-10">MAX DRAWDOWN</h4>
                    <Row>
                        <div className="col-sm-4 col-md-4 p-20">
                            <div className="riskScore_border">
                                <h5>-2.88%</h5>
                                <p>DAILY</p>
                            </div>
                        </div>
                        <div className="col-sm-4 col-md-4 p-20">
                            <div className="riskScore_border">
                                <h5>-4.43%</h5>
                                <p>WEEKLY</p>
                            </div>
                        </div>
                        <div className="col-sm-4 col-md-4 p-20">
                            <div className="riskScore_border">
                                <h5>-15.88%</h5>
                                <p>YEARLY</p>
                            </div>
                        </div>
                    </Row>
                </Col>
            </Fragment>
        );
    }
}

export default RiskScore 