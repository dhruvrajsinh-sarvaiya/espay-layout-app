/**
 * Auther : Salim Deraiya
 * Created : 18/12/2018
 * Updated : 
 * Portfolia Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { Button, Form, FormGroup, Label, Input, Badge } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { getLeaderPortfolioList } from "Actions/SocialProfile";
import { getTradePairs } from "Actions/TradingReport";
import { changeDateFormat } from "Helpers/helpers";

//Columns Object
const columns = [
	{
		name: <IntlMessages id="tradesummary.tradeSummaryColumn.trnNo" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="tradesummary.tradeSummaryColumn.pair" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="tradesummary.tradeSummaryColumn.type" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="tradesummary.tradeSummaryColumn.orderType" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="tradesummary.tradeSummaryColumn.price" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="tradesummary.tradeSummaryColumn.amount" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colCharge" />,
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
		name: <IntlMessages id="sidebar.colStatus" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colIsCancel" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="tradesummary.tradeSummaryColumn.dateTime" />,
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
	},
	downloadOptions : {
		filename: 'PORTFOLIO_LIST_'+changeDateFormat(new Date(),'YYYY-MM-DD')+'.csv'
	}
};

const PortfolioStatus = ({ status }) => {
    var htmlStatus = <Badge color="secondary"><IntlMessages id={"myorders.response.status."+status} /></Badge>;
    return htmlStatus;
}

class Portfolio extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filter : {
				Pair: '',
				TrnType: '',
				FromDate: '',
				ToDate: '',
				FollowTradeType: '',
				FollowingTo: 0
			},
			pairList : [],
			list : [],
			loading : false,
			errors : {}
		};
	}

	componentWillMount() {
		var newObj = Object.assign({}, this.state.filter);
		if(this.props.isfilter) {
			newObj['FromDate'] = new Date().toISOString().slice(0, 10);
			newObj['ToDate'] = new Date().toISOString().slice(0, 10);
			this.setState({ filter : newObj });
		}
		this.props.getLeaderPortfolioList(newObj);
		this.props.getTradePairs();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });

		//Get & Set Pair list data
		if(nextProps.hasOwnProperty('pairList') && nextProps.pairList.length > 0) {
			this.setState({ pairList : nextProps.pairList });
		}
		
        if (nextProps.data.ReturnCode === 1) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.data.ReturnCode === 0) {
            if(nextProps.data.hasOwnProperty('Response') && nextProps.data.Response !== null && nextProps.data.Response.length > 0) {
                
                this.setState({ list : nextProps.data.Response });
            }
        }
	}

	onChange = (event) => {
        var newObj = Object.assign({}, this.state.filter);
		newObj[event.target.name] = event.target.value;
        this.setState({ filter : newObj });
    }

    applyFilter = (event) => {
		event.preventDefault();
        this.props.getLeaderPortfolioList(this.state.filter);
        this.setState({ showReset: true });
    }

	render() {
		const { list, pairList, loading, errors } = this.state;
		const { Pair, TrnType, FromDate, ToDate } = this.state.filter; 
		const { isfilter } = this.props;
	    return (
			<Fragment>				
				{loading && <JbsSectionLoader />}
				{isfilter && 
					<JbsCollapsibleCard>
						<div className="top-filter row">
							<FormGroup className="col-md-2 col-sm-4">
								<Label for="startDate">Start Date</Label>
								<Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} onChange={this.onChange} />
								{errors.FromDate && <div className="text-danger text-left"><IntlMessages id={errors.FromDate} /></div>}
							</FormGroup>
							<FormGroup className="col-md-2 col-sm-4">
								<Label for="endDate">End Date</Label>
								<Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} onChange={this.onChange} />
								{errors.ToDate && <div className="text-danger text-left"><IntlMessages id={errors.ToDate} /></div>}
							</FormGroup>
							<FormGroup className="col-md-2 col-sm-4">
								<Label for="Select-2">{<IntlMessages id="sidebar.tradeSummary.filterLabel.currencyPair" />}</Label>
								<Input type="select" name="Pair" value={Pair} id="Select-1" onChange={this.onChange}>
									<IntlMessages id="tradeSummary.selectCurrencyPair.all">{ (all) => <option value="">{all}</option> }</IntlMessages>
									{pairList.length > 0 && pairList.map((currency, key) =>
										<option key={key} value={currency.PairName}>{currency.PairName}</option>
									)}
								</Input>
							</FormGroup>
							<FormGroup className="col-md-2 col-sm-4">
								<Label for="Select-2">{<IntlMessages id="sidebar.tradeSummary.filterLabel.type" />}</Label>
								<Input type="select" name="TrnType" value={TrnType} id="Select-2" onChange={this.onChange}>
									<IntlMessages id="tradeSummary.selectType">{(selectType) => <option value="">{selectType}</option>}</IntlMessages>
									<IntlMessages id="tradeSummary.selectType.buy">{(buy) =><option value="buy">{buy}</option>}</IntlMessages>
									<IntlMessages id="tradeSummary.selectType.sell">{(sell) =><option value="sell">{sell}</option>}</IntlMessages>
								</Input>
							</FormGroup>
							
							<FormGroup className="col-md-2 col-sm-4">
								<div className="btn_area">
									<Button color="primary" variant="raised" className="mr-10 text-white perverbtn" onClick={this.applyFilter}><IntlMessages id="widgets.apply" /></Button>
									{this.state.showReset && <Button className="btn btn-danger" variant="raised" onClick={this.clearFilter}><IntlMessages id="button.clear" /></Button>}
								</div>
							</FormGroup>
						</div>
					</JbsCollapsibleCard>
				}
				<div className="mt-20 portfolio-list">
					<MUIDataTable title={<IntlMessages id="socialProfile.portfolioList" />} columns={columns} options={options}
						data={list.map((item, key) => {
							return [
								item.TrnNo,
								item.PairName,
								item.Type,
								item.OrderType,
								item.Price,
								item.Amount,
								item.ChargeRs,
								item.Total,
								<PortfolioStatus status={item.Status} />,
								item.IsCancel ? <IntlMessages id="sidebar.yes" /> : <IntlMessages id="sidebar.no" />,
								item.DateTime.replace('T', ' ').split('.')[0]
							];
						})}
					/>
				</div>
			</Fragment>
		);
	}
}

// default props value
Portfolio.defaultProps = {
    isfilter: true
}

//MapStateToProps
const mapStateToProps = ({ portfolioRdcer, tradeSummaryReport, settings }) => {
    const response = {
		darkMode : settings.darkMode,
        data: portfolioRdcer.portfolioList,
		loading: portfolioRdcer.loading,		
		pairList: tradeSummaryReport.pairList
    }
    return response;
};

export default connect(mapStateToProps, {
	getLeaderPortfolioList,
	getTradePairs
})(Portfolio);