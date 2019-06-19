/* 
    Createdby : Devang Parekh
    CreatedDate : 18-4-2019
    Description : Equity Pool 196
*/

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import MUIDataTable from "mui-datatables";
// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

//Import CRUD Operation For ContactUs Actions...
//import { getContactUs } from 'Actions/ContactUs';
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';

//BreadCrumbData
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link : '',
        index:0
    },
    {
        title : <IntlMessages id="sidebar.dashboard" />,
        link : '',
        index:0
    },
    {
        title : <IntlMessages id="sidebar.financial" />,
        link : '',
        index:0
    },
    {
        title : <IntlMessages id="sidebar.196EquityPool" />,
        link : '',
        index:1
    },
];

const columns = [
	{
		name: <IntlMessages id="widgets.username" />
	},
	{
		name: <IntlMessages id="sidebar.startUpName" />
	},
	{
		name: <IntlMessages id="sidebar.noOfEquity" />
	},
	{
		name: <IntlMessages id="sidebar.currentStatus" />
	},
	{
		name: <IntlMessages id="sidebar.investedAmount" />
	},
	{
		name: <IntlMessages id="table.balance" />
	},
	{
		name: <IntlMessages id="sidebar.currentValuation" />
	}

];

const startUpDetailList = [
	{UserName:"John",StartUpName:"ABC",NoOfEquity:10,CurrentStatus:1,InvestedAmount:468521,Balance:454215,CurrentValuation:4878412},
	{UserName:"Smith",StartUpName:"XYZ",NoOfEquity:8,CurrentStatus:2,InvestedAmount:32564541,Balance:6565263,CurrentValuation:656921},
	{UserName:"Dev",StartUpName:"UVW",NoOfEquity:6,CurrentStatus:3,InvestedAmount:1248541,Balance:5656,CurrentValuation:696232515},
	{UserName:"Mitual",StartUpName:"CDE",NoOfEquity:3,CurrentStatus:0,InvestedAmount:3323154,Balance:2565,CurrentValuation:5451215},
	{UserName:"Leo",StartUpName:"WXY",NoOfEquity:100,CurrentStatus:1,InvestedAmount:565221215,Balance:656323,CurrentValuation:968215656},
	{UserName:"Aliana",StartUpName:"MNO",NoOfEquity:1054,CurrentStatus:2,InvestedAmount:526326595,Balance:5689635,CurrentValuation:5684545},

]

class EquityPool196 extends Component {
	
	constructor(props) {
		super(props);
	
		// default ui local state
		this.state = {
			loading: false,//true, // loading activity
			startUpList: [],
			page: 0,
			rowsPerPage: 100,
			searchValue : null,
			count:0,
			errors : {}
		};
		
	}

	componentWillMount() {
		
    }
  
	componentWillReceiveProps(nextProps) {

		/* this.setState({
			startUpList: nextProps.contact_list.data,
			count: nextProps.contact_list.totalCount,
			loading: nextProps.loading
		}); */
		
	}

	onChildClick = () => {
		this.setState({
			openChild: !this.state.openChild,
		})
	}
	
	showComponent = (componentName,page='') => {

		if(typeof page!='undefined' && page!='') {
			this.setState({pagedata: page});
		}

		this.setState({
			componentName: componentName,
			openChild: !this.state.open,
		});

	}
	
	closeAll = () => {
		this.props.closeAll();
		this.setState({
			openChild: false,
		});
	}

	render() {

		var menuPermissionDetail = checkAndGetMenuAccessDetail('7F54B9EC-814D-86B9-2BAE-FA0649BC85AB'); //7F54B9EC-814D-86B9-2BAE-FA0649BC85AB
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
		}
		
		const { loading,startUpList,page,rowsPerPage,searchValue,count} = this.state;
		const { drawerClose } = this.props;

		const options = {
			filterType: "dropdown",
			responsive: "scroll",
			selectableRows: false,
			print: false,
			download: false,
			resizableColumns: false,
			viewColumns: false,
			filter: false,
			rowsPerPageOptions:AppConfig.rowsPerPageOptions,
			serverSide: true,
			page: page,
			count:count,
			rowsPerPage: AppConfig.totalRecordDisplayInList,
			searchValue : searchValue,
			search: true,//menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
			onTableChange: (action, tableState) => {
				
				switch (action) {
					case 'changeRowsPerPage':
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							//searchValue: tableState.searchText,
							loading: false
						});
						//this.props.getContactUs({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue:tableState.searchText, orderBy : orderBy,sortOrder : sortOrder  });
					break;
					case 'changePage':
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							//searchValue: tableState.searchText,
							loading: false
						});
						//this.props.getContactUs({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue:tableState.searchText, orderBy : orderBy,sortOrder : sortOrder });
					break;
					case 'search':
						if(typeof tableState.searchText != 'undefined' && tableState.searchText != null && tableState.searchText.length > 2 )
						{
							this.setState({
								page: tableState.page,
								rowsPerPage: tableState.rowsPerPage,
								//searchValue: tableState.searchText,
								loading: false
							});
							//this.props.getContactUs({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue:tableState.searchText, orderBy : orderBy,sortOrder : sortOrder });
						}
						else if(typeof tableState.searchText != 'undefined' && tableState.searchText == null)
						{ 
							
							this.setState({
								page: tableState.page,
								rowsPerPage: tableState.rowsPerPage,
								//searchValue: tableState.searchText,
								loading: false
							});
							//this.props.getContactUs({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue:tableState.searchText, orderBy : orderBy,sortOrder : sortOrder });
						}
					break;
					case 'sort':
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							searchValue: tableState.searchText,
							loading: false
						});
						//this.props.getContactUs({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue:tableState.searchText, orderBy : sortColumns[tableState.activeColumn].orderBy,sortOrder : sortingDirectionString });
					break;
				}
			}
		};

		return (
			<Fragment>
           		<div className="jbs-page-content">
                   
				   <WalletPageTitle title={<IntlMessages id="sidebar.196EquityPool" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
			
					<div className="responsive-table-wrapper">
					
						<JbsCollapsibleCard fullBlock>
						<MUIDataTable
							title={<IntlMessages id="sidebar.196EquityPool" />}
							//data={startUpList && startUpList.map(startUp => {
							data={startUpDetailList && startUpDetailList.map(startUp => {

								//var status =<IntlMessages id={`myorders.response.status.${startUp.CurrentStatus}`} />; //intl.formatMessage({id:`myorders.response.status.${item.CurrentStatus}`})

								return [
									startUp.UserName,
									startUp.StartUpName,
									startUp.NoOfEquity,
									startUp.CurrentStatus,
									startUp.InvestedAmount,
									startUp.Balance,
									startUp.CurrentValuation
								]
							})}
							columns={columns}
							options={options}
						/>
						{loading &&
							<JbsSectionLoader />
						}
						</JbsCollapsibleCard>
					</div>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ contactus }) => {
	const { contact_list, loading } = contactus;
    return { contact_list, loading }
}

export default withRouter(connect(mapStateToProps,{
	//getContactUs
}) (EquityPool196));