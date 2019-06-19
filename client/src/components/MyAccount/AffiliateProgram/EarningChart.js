/**
 * Auther : Salim Deraiya
 * Created : 14/02/2019
 * Updated By:Saloni Rathod(13th APril 2019)
 * Monthly Commission Average  Chart
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
 import { affiliateMonthlyAverageCommissionChart} from "Actions/MyAccount";

class EarningChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            SignUp: [],
            Deposition: [],
            BuyTrading: [],
            SellTrading:[],
        

        };        
    }

    componentWillMount() {
        let currentyear = new Date();
        currentyear = currentyear.getFullYear()
    this.props.affiliateMonthlyAverageCommissionChart(currentyear);
    } 

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
           //Get Edit Data By Id
        if (nextProps.mchart.hasOwnProperty('Response') && nextProps.mchart.Response !== null) {
            if (nextProps.mchart.hasOwnProperty('Response') && Object.keys(nextProps.mchart.Response).length > 0) {
                this.setState({ SignUp: nextProps.mchart.Response.SignUp, Deposition: nextProps.mchart.Response.Deposition, BuyTrading: nextProps.mchart.Response.BuyTrading, SellTrading: nextProps.mchart.Response.SellTrading, });
            }
        }
    }
    render() {
        let currentyear = new Date();
        currentyear = currentyear.getFullYear()

        const { loading } = this.state;
        const   optionChart = {
            chart: {
                type: 'line',
                borderRadius:15,
            },
            title: {
                text: 'Monthly Average Earning '+currentyear
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: ''
                }
            },

            series: [
                {
                    name: 'Signup',
                    data: this.state.SignUp 
                },
                {
                    name: 'Buy - Trade',
                    data: this.state.BuyTrading
                },
                {
                    name: 'Sell - Trade',
                    data: this.state.SellTrading
                },

                {
                    name: 'Deposit',
                    data: this.state.Deposition
                }
            ]
        }
        
        return (
            
            <Fragment>
                {loading && <JbsSectionLoader />}
                <HighchartsReact highcharts={Highcharts} options={optionChart} />
            </Fragment>
        );
    }
}

//Mapstatetoprops...
const mapStateToProps = ({ affiliateReportRdcer }) => {
    const { mchart, loading } = affiliateReportRdcer;
    return { mchart, loading };
}

export default connect(mapStateToProps, {
    affiliateMonthlyAverageCommissionChart,
})(EarningChart);