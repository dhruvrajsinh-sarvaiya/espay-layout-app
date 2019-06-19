/**
 * Total Earns Chart Widget
 */
import React, { Component, Fragment } from 'react';
import { Line } from 'react-chartjs-2';
import { Button, ButtonGroup } from 'reactstrap';

// chart config
import ChartConfig from 'Constants/chart-config';
import { hexToRgbA } from 'Helpers/helpers';

// options
const options = {
    elements: {
        point: {
            radius: 0
        }
    },
    legend: {
        display: false,
        labels: {
            fontColor: ChartConfig.legendFontColor
        }
    },
    scales: {
        xAxes: [{
            gridLines: {
                offsetGridLines: true,
                display: false
            },
            ticks: {
                fontColor: ChartConfig.axesColor
            }
        }],
        yAxes: [{
            gridLines: {
                drawBorder: false,
                zeroLineColor: ChartConfig.chartGridColor
            },
            ticks: {
                fontColor: ChartConfig.axesColor,
                stepSize: 1000,
                beginAtZero: true,
                padding: 40
            }
        }]
    }
};

class MultiLineChart extends Component {
    render() {
        const { data } = this.props;
        // chart data
        const dashboardPanelChart = {
            data: (canvas) => {
                const ctx = canvas.getContext("2d");
                var chartColor = hexToRgbA(ChartConfig.color.primary, 1);
                var gradientFill = ctx.createLinearGradient(0, 230, 0, 60);
                gradientFill.addColorStop(0, "rgba(255, 255, 255, 0)");
                gradientFill.addColorStop(1, hexToRgbA(ChartConfig.color.primary, 0.8));

                return {
                    labels: data.chartData.labels,
                    datasets: [
                        {
                            label: data.chartData.label,
                            borderColor: chartColor,
                            pointBorderColor: hexToRgbA(ChartConfig.color.white, 1),
                            pointBackgroundColor: hexToRgbA(ChartConfig.color.primary, 1),
                            pointHoverBackgroundColor: hexToRgbA(ChartConfig.color.primary, 1),
                            pointHoverBorderColor: hexToRgbA(ChartConfig.color.white, 1),
                            pointBorderWidth: 2,
                            pointHoverRadius: 7,
                            pointHoverBorderWidth: 2,
                            pointRadius: 7,
                            fill: true,
                            backgroundColor: gradientFill,
                            borderWidth: 2,
                            data: data.chartData.data
                        }
                    ]
                }
            }
        };
        return (
            <Fragment>
                <div className="chart-top d-flex justify-content-between display-n p-20">
                    <div className="d-flex align-items-start">
                        <ButtonGroup className="default-btn-group">
                            <Button className="btn-sm">Week</Button>
                            <Button className="btn-sm active">Month</Button>
                            <Button className="btn-sm">Year</Button>
                            <Button className="btn-sm">Today</Button>
                        </ButtonGroup>
                    </div>
                    <div className="d-flex align-items-end">
                        {data.customLegends.map((legend, key) => (
                            <Fragment key={key}>
                                <span className={`${legend.className} badge-sm`}>&nbsp;</span> 
                                <span className="fs-12">{legend.name}</span>
                            </Fragment>
                        ))}
                    </div>
                </div>
                <Line data={data} options={options} height={50} />
            </Fragment>
        );
    }
}

export { MultiLineChart };
