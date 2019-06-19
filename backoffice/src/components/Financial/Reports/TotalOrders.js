/* 
    Createdby : Devang Parekh
    CreatedDate : 18-4-2019
    Description : List of total orders
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
        title : <IntlMessages id="sidebar.totalOrders" />,
        link : '',
        index:1
    },
];

const columns = [
	{
		name: <IntlMessages id="widgets.productName" />
	},
	{
		name: <IntlMessages id="widgets.price" />
	},
	{
		name: <IntlMessages id="table.date" />
	},
	{
		name: <IntlMessages id="sidebar.colCustomerName" />
	}
];

const totalOrders = [
	{ProductName:"Demo 1",Price:468,Date:"2019-04-14",CustomerName:"Mr. John"},
	{ProductName:"Demo 2",Price:3256,Date:"2019-04-12",CustomerName:"Ms. Angelina"},
	{ProductName:"Demo 3",Price:12,Date:"2019-04-09",CustomerName:"Mr. Johnson"},
	{ProductName:"Demo 4",Price:33,Date:"2019-04-07",CustomerName:"Mr. Metual brown"},
	{ProductName:"Demo 5",Price:56,Date:"2019-04-06",CustomerName:"Ms. Aliyana"},
	{ProductName:"Demo 6",Price:526,Date:"2019-04-01",CustomerName:"Mr. Spark"},
]

class TotalOrders extends Component {
	
	constructor(props) {
		super(props);
	
		// default ui local state
		this.state = {
			loading: false,//true, // loading activity
			totalOrders: [],
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
			totalOrders: nextProps.contact_list.data,
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
		
		const { loading,totalOrders,page,rowsPerPage,searchValue,count} = this.state;
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
                   
				   <WalletPageTitle title={<IntlMessages id="sidebar.totalOrders" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
			
					<div className="responsive-table-wrapper">
					
						<JbsCollapsibleCard fullBlock>
						<MUIDataTable
							title={<IntlMessages id="sidebar.totalOrders" />}
							//data={totalOrders && totalOrders.map(startUp => {
							data={totalOrders && totalOrders.map(startUp => {

								//var status =<IntlMessages id={`myorders.response.status.${startUp.CurrentStatus}`} />; //intl.formatMessage({id:`myorders.response.status.${item.CurrentStatus}`})

								return [
									startUp.ProductName,
									startUp.Price,
									startUp.Date,
									startUp.CustomerName
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
}) (TotalOrders));