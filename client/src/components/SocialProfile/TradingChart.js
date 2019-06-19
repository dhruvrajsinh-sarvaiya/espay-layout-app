/**
  * Auther : Salim Deraiya
 * Created : 04/02/2018
 * Trading Chart Component
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Form, FormGroup, Input, Alert, Button } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { 
    AveProfitLossLayout,
    ProfitableCircle,
    TradeDetailBlk,
    ProgressBarChart 
} from './Widgets';

class TradingChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total : '318',
            profit : '',
            loss : '',
            total_profit : '40.88',
            chartData : [
                { title : 'data1', value : 73.87 },
                { title : 'data2', value : 14.77 },
                { title : 'data3', value : 11.37 },
                /* { title : 'data4', value : 10.38 },
                { title : 'data5', value : 4.08 },
                { title : 'data6', value : 1.89 } */
            ]
        };
    }    

    render() {
        const { chartData } = this.state;
        return (
            <Fragment>                
                <div className="card trade_chart p-25">
                    <h2>Trading</h2>
                    <div className="trade_info row">
                        <div className="col-md-4 col-sm-4 col">
                            <div className="font_big">318</div>
                            <div className="">Total Trades</div>
                        </div>
                        <div className="col-md-4 col-sm-4 col">
                            <AveProfitLossLayout profit="2.40" loss="4.66" {...this.props} />
                        </div>
                        <div className="col-md-4 col-sm-4 col">
                            <ProfitableCircle profit="87.75" />
                        </div>
                    </div>
                    <div className="t_chart">
                        <ProgressBarChart tData={chartData} />
                        <TradeDetailBlk tData={chartData} />
                    </div>
                </div>
            </Fragment>
        );
    }
}

// default props value
TradingChart.defaultProps = {
    LeaderId : 0
}

// map state to props
/* const mapStateToProps = ({ forgotPassRdcer }) => {
    var response = {
        data: forgotPassRdcer.data,
        loading: forgotPassRdcer.loading
    };
    return response;
};

export default withRouter(connect(mapStateToProps, {
    forgotPassword
})(TradingChart)); */

export default TradingChart;
