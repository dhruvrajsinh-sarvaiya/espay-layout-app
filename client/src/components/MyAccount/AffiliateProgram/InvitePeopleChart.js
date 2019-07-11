// /**
//  * Auther : Salim Deraiya
//  * Created : 14/02/2019
// * Updated By: Saloni Rathod(13th APril 2019)
//  * Invite People Chart
//  */

import React, { Component, Fragment } from 'react'
import HighchartsReact from "highcharts-react-official";
import { connect } from "react-redux";
import Highcharts from 'highcharts';
import { affiliateInviteFriendChart } from 'Actions/MyAccount';
import { injectIntl } from 'react-intl';


class AffiliateInviteFriendChart extends Component {
    constructor(props) {
        super(props);
        this.state= {
            
       data: {
                AffiliateLink: 0,
                Facebook:0,
                Twitter: 0,
                EmailSentCount:0,
                SMSSentCount:0,
            }
        } 
    }
    componentWillMount() {
        this.props.affiliateInviteFriendChart();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
           //Get Edit Data By Id
        if (nextProps.chart.hasOwnProperty('Data') && nextProps.chart.Data !== null) {
            if (nextProps.chart.hasOwnProperty('Data') && Object.keys(nextProps.chart.Data).length > 0) {
                this.setState({ data: nextProps.chart.Data });
            }

        }
    
    }

    render() {
        const intl = this.props.intl;
        const { AffiliateLink, Facebook, Twitter, Email, SMS } = this.state.data;
        const optionChart = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                borderRadius:15,
                width: 360,
                height: 370,
                margin: [20, 100, 50, 50],
                plotShadow: false,
                animation: true,
                type: 'pie'
            },
            title: {
                text: intl.formatMessage({ id: "sidebar.inviteFriends" })
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: { enabled: false },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Shares',
                colorByPoint: true,
                data: [
                    { name: intl.formatMessage({ id: "my_account.signUp" }), y: AffiliateLink, sliced: true, selected: true },
                    { name: intl.formatMessage({ id: "sidebar.email" }), y: Email },
                    { name: intl.formatMessage({ id: "sidebar.sms" }), y: SMS },
                    { name:intl.formatMessage({ id: "sidebar.facebook" }), y: Facebook },
                    { name:  intl.formatMessage({ id: "sidebar.twitter" }), y: Twitter },
                ]
            }]
        }
        return (
            <Fragment>
                <HighchartsReact highcharts={Highcharts} options={optionChart} />
            </Fragment>
        )
    }
}
//Mapstatetoprops...
const mapStateToProps = ({ affiliateReportRdcer }) => {
    const { chart, loading } = affiliateReportRdcer;
    return { chart, loading };
}

export default connect(mapStateToProps, {
    affiliateInviteFriendChart,
})(injectIntl(AffiliateInviteFriendChart));
