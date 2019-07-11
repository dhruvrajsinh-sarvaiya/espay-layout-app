/**
 * Auther : Salim Deraiya
 * Created : 01/02/2018
 * Updated :
 * Top Gainer List Component
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import MUIDataTable from 'mui-datatables';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import { getLeaderBoardList } from 'Actions/SocialProfile';
//Columns Object
const columns = [
	{
		name: <IntlMessages id="wallet.tableSr" />,
		options: { filter: false, sort: true },
	},
	{
		name: <IntlMessages id="sidebar.colLeaderName" />,
		options: { filter: false, sort: true },
	},
	{
		name: <IntlMessages id="sidebar.colEmail" />,
		options: { filter: false, sort: true },
	},
	{
		name: <IntlMessages id="sidebar.colProfit" />,
		options: { filter: false, sort: true },
	},
	{
		name: <IntlMessages id="sidebar.colProfitPer" />,
		options: { filter: false, sort: true },
	},
];
const options = {
	filterType: 'select',
	responsive: 'scroll',
	selectableRows: false,
	resizableColumns: false,
	viewColumns: false,
	filter: false,
	sorting: false,
	download: false,
	rowsPerPage: 10,
	textLabels: {
		body: {
			noMatch: <IntlMessages id="wallet.emptyTable" />,
			toolTip: <IntlMessages id="wallet.sort" />,
		},
	},
};

class LeaderBoardWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			loading: false,
			UserCount: 0,
		};
	}
	componentWillMount() {
		var newObj = { UserCount: this.state.UserCount };
		this.props.getLeaderBoardList(newObj);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });
		//Get & Set Leader Board List
		if (nextProps.ldrBrdList.hasOwnProperty('Data') && nextProps.ldrBrdList.Data.length > 0) {
			this.setState({ list: nextProps.ldrBrdList.Data });
		}
	}
	render() {
		const { list, loading } = this.state;
		return (
			<div className={this.props.darkMode ? 'transaction-history-detail-darkmode tbl_overflow_auto' : 'transaction-history-detail tbl_overflow_auto'}>
				{loading && <JbsSectionLoader />}
				<MUIDataTable
					title={<IntlMessages id="sidebar.top25LeaderList" />}
					columns={columns}
					options={options}
					data={list.map((item, key) => {
						return [
							key + 1,
							item.UserName,
							item.Email,
							item.ProfitAmount.toFixed(8),
							item.ProfitPer.toFixed(8),
						];
					})}
				/>
			</div>
		);
	}
}

//MapStateToProps
const mapStateToProps = ({ leaderBoardRdcer }) => {
	const { loading, ldrBrdList } = leaderBoardRdcer;
	return { loading, ldrBrdList };
};

export default connect(
	mapStateToProps,
	{
		getLeaderBoardList,
	}
)(LeaderBoardWdgt);
