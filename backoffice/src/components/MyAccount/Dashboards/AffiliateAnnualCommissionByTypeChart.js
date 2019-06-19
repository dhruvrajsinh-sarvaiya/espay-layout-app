import React, { Component } from 'react'
import HighchartsReact from "highcharts-react-official";
import drilldown from 'highcharts-drilldown';
import Highcharts from 'highcharts';
drilldown(Highcharts);
export default class AffiliateAnnualCommissionByTypeChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionChart: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    height: 300,
                    margin: [20, 100, 50, 100],
                    plotShadow: false,
                    animation: false,
                    type: 'pie'
                },
                title: {
                    text: 'Invite Friend '
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: [{
                        name: 'Signup',
                        y: 61.41,
                        sliced: true,
                        selected: true
                    }, {
                        name: 'Email',
                        y: 11.84
                    }, {
                        name: 'SMS',
                        y: 10.85
                    }, {
                        name: 'Facebook',
                        y: 4.67
                    }, {
                        name: 'Twitter',
                        y: 4.18
                    }, {
                        name: 'Other',
                        y: 7.05
                    }]
                }]
            },
            option: {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Monthly Average Commission'
                },

                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'SignUp',
                    data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'Buy Trade',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }
                    , {
                    name: 'Sell Trade',
                    data: [4.2, 5.8, 5.3, 7.5, 10.9, 13.2, 16.0, 15.6, 12.2, 11.3, 5.6, 3.8]
                }
                    , {
                    name: 'Withdraw',
                    data: [1.9, 5.2, 6.7, 8.5, 10.9, 11.2, 13.0, 14.6, 11.2, 9.3, 7.6, 5.8]
                },
                {
                    name: 'Deposit',
                    data: [8.9, 4.2, 8.7, 4.5, 15.9, 11.2, 19.0, 6.6, 14.2, 0.3, 2.6, 4.8]
                }]
            },
            optionData: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Browser market shares. January, 2018'
                },
                subtitle: {
                    text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Total percent market share'
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                },

                "series": [
                    {
                        "name": "Trades",
                        "colorByPoint": true,
                        "data": [
                            {
                                "name": "SignUP",
                                "y": 62.74,
                                "drilldown": "SignUp"
                            },
                            {
                                "name": "Buy Trade",
                                "y": 10.57,
                                "drilldown": "Buy Trade"
                            },
                            {
                                "name": "Sell Trade",
                                "y": 7.23,
                                "drilldown": "Sell Trade"
                            },
                            {
                                "name": "Withdraw",
                                "y": 5.58,
                                "drilldown": "Withdraw"
                            },
                            {
                                "name": "Deposit",
                                "y": 4.02,
                                "drilldown": "Deposit"
                            },

                        ]
                    }
                ],
                "drilldown": {
                    "series": [
                        {
                            "name": "SignUp",
                            "id": "SignUp",
                            "data": [
                                [
                                    "yr2015",
                                    0.1
                                ],
                                [
                                    "yr2016",
                                    1.3
                                ],
                                [
                                    "yr2017",
                                    53.02
                                ],
                                [
                                    "yr2018",
                                    1.4
                                ],

                            ]
                        },
                        {
                            "name": "Buy Trade",
                            "id": "Buy Trade",
                            "data": [
                                [
                                    "yr2015",
                                    1.02
                                ],
                                [
                                    "yr2016",
                                    7.36
                                ],
                                [
                                    "yr2017",
                                    0.35
                                ],
                                [
                                    "yr2018",
                                    0.11
                                ],

                            ]
                        },
                        {
                            "name": "Sell Trade",
                            "id": "Sell Trade",
                            "data": [
                                [
                                    "yr2015",
                                    6.2
                                ],
                                [
                                    "yr2016",
                                    0.29
                                ],
                                [
                                    "yr2017",
                                    0.27
                                ],
                                [
                                    "yr2018",
                                    0.47
                                ]
                            ]
                        },
                        {
                            "name": "Withdraw",
                            "id": "Withdraw",
                            "data": [
                                [
                                    "yr2015",
                                    3.39
                                ],
                                [
                                    "yr2016",
                                    0.96
                                ],
                                [
                                    "yr2017",
                                    0.36
                                ],
                                [
                                    "yr2018",
                                    0.54
                                ],

                            ]
                        },
                        {
                            "name": "Deposit",
                            "id": "Deposit",
                            "data": [
                                [
                                    "yr2015",
                                    2.6
                                ],
                                [
                                    "yr2016",
                                    0.92
                                ],
                                [
                                    "yr2017",
                                    0.4
                                ],
                                [
                                    "yr2018",
                                    0.1
                                ]
                            ]
                        },

                    ]
                }
            }
        }
    }
    render() {
        const { componentName, open, optionChart, option, optionData } = this.state;
        return (
            
            <div>
            <HighchartsReact highcharts={Highcharts} options={optionData} />
        </div>
           
        )
    }

}