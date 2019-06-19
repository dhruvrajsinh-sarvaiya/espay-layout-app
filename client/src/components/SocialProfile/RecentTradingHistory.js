/**
 * Auther : Salim Deraiya
 * Created : 18/12/2018
 * Updated : 
 * Portfolia Component
 */
import React, { Component, Fragment } from "react";
import MUIDataTable from "mui-datatables";
import { Badge, Alert } from 'reactstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
// intl messages
import IntlMessages from "Util/IntlMessages";

//Data Object
const recentTradeHistoryData = [
    {
        id : 1011,
		pair : 'COV/BTC',
		first_currency : 'COV',
		second_currency : 'BTC',
		buy_sell: 'Sell',
        type : 'limit',
        price : 0.000125,
        executed :1500.00000000,
        cancelled : '-',
        total : 0.174000000,
        fee : '0.25400000 BTC',
		status : 'Executed',
		date_time : '12/12/2018, 04:33:38'
	},
	{
        id : 1012,
		pair : 'COV/BTC',
		first_currency : 'COV',
		second_currency : 'BTC',
		buy_sell: 'Buy',
        type : 'limit',
        price : 0.000125,
        executed :1500.00000000,
        cancelled : '-',
        total : 0.174000000,
        fee : '0.25400000 BTC',
		status : 'Executed',
		date_time : '12/12/2018, 04:33:38'
	},
	{
        id : 1013,
		pair : 'DASH/USD',
		first_currency : 'DASH',
		second_currency : 'USD',
		buy_sell: 'Buy',
        type : 'limit',
        price : 0.000125,
        executed :1500.00000000,
        cancelled : '-',
        total : 0.174000000,
        fee : '0.25400000 DASH',
		status : 'Executed',
		date_time : '12/12/2018, 04:33:38'
	},
	{
        id : 1014,
		pair : 'XLM/USD',
		first_currency : 'XLM',
		second_currency : 'USD',
		buy_sell: 'Sell',
        type : 'limit',
        price : 0.000125,
        executed :1500.00000000,
        cancelled : '-',
        total : 0.174000000,
        fee : '0.25400000 USD',
		status : 'Executed',
		date_time : '12/12/2018, 04:33:38'
	},
	{
        id : 1015,
		pair : 'ETH/BTC',
		first_currency : 'ETH',
		second_currency : 'BTC',
		buy_sell: 'Buy',
        type : 'limit',
        price : 0.000125,
        executed :1500.00000000,
        cancelled : '-',
        total : 0.174000000,
        fee : '0.25400000 ETH',
		status : 'Executed',
		date_time : '12/12/2018, 04:33:38'
    }
];

//Columns Object
const columns = [
	{
		name: <IntlMessages id="sidebar.colID" />,
		options: {
			filter: false,
			sort: true
		}
	},
	{
		name: <IntlMessages id="sidebar.colPair" />,
		options: {
			filter: false,
			sort: true
		}
	},
	{
		name: <IntlMessages id="sidebar.colBuySell" />,
		options: {
			filter: false,
			sort: true
		}
	},
	{
		name: <IntlMessages id="sidebar.colType" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colPrice" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colExecuted" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colCancelled" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colTotal" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colFee" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colStatus" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colDateTime" />,
		options: {
			filter: false,
			sort: false
		}
	}
];

const options = {
	filterType: "select",
	responsive: "scroll",
	selectableRows: false,
    resizableColumns: false,
    viewColumns: false,
	filter: false,
	download: false,
	textLabels: {
		body: {
			noMatch: <IntlMessages id="wallet.emptyTable" />,
			toolTip: <IntlMessages id="wallet.sort" />,
		}
	}
};

class RecentTradingHistory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list : [],
			err_msg: '',
			err_alert: true,
			success_msg: '',
			success_alert: true,
			loading : false
		};

		this.onDismiss = this.onDismiss.bind(this);
	}

	onDismiss() {
		this.setState({ err_alert: false, success_alert: false });
	}

	componentWillMount() {
		this.setState({ list : recentTradeHistoryData });
	}

	render() {
        const { list, err_alert, err_msg, success_msg, success_alert, loading } = this.state;
	    return (
			<Fragment>
				{success_msg && <div className="alert_area">
					<Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
				</div>}
				{err_msg && <div className="alert_area">
					<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
				</div>}
				{
					loading
					? 
					<div className="text-center py-40">
                        <CircularProgress className="progress-primary" />
                    </div>
					:
					<Fragment>
						<div className="mt-20 portfolio-list">
                            <div className={this.props.darkMode ? 'ipwhitelist-darkmode':'ipwhitelist'}>
                                <MUIDataTable title={<IntlMessages id="sidebar.recentTradingHistory" />} columns={columns} options={options}
                                    data={list.map((item, key) => {
                                        return [
											item.id,
											item.pair,
                                            item.buy_sell,
                                            item.type,
                                            item.price,
                                            item.executed,
                                            item.cancelled,
                                            item.total,
                                            item.fee,
                                            item.status,
                                            item.date_time
                                        ];
                                    })}
                                />
                            </div>
						</div>
					</Fragment>
				}
			</Fragment>
		);
	}
}

export default RecentTradingHistory;