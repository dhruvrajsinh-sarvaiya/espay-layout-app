/* 
    Createdby : Devang Parekh
    CreatedDate : 18-4-2019
    Description : List of total products
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
        title : <IntlMessages id="sidebar.totalProduct" />,
        link : '',
        index:1
    },
];

const columns = [
	{
		name: <IntlMessages id="sidebar.productName" />
	},
	{
		name: <IntlMessages id="widgets.price" />
	},
	{
		name: <IntlMessages id="my_account.common.status" />
	},
	{
		name: <IntlMessages id="widgets.category" />
	},
	{
		name: <IntlMessages id="sidebar.subCategory" />
	},
	{
		name: <IntlMessages id="table.balance" />
	},
	{
		name: <IntlMessages id="sidebar.currentValuation" />
	}

];

const productList = [
	{ProductName:"Demo 1",Price:468,Status:1,Category:"Web Developing",SubCategory:"ReactJS"},
	{ProductName:"Demo 2",Price:3256,Status:0,Category:"APP Developing",SubCategory:"ReactJS Native"},
	{ProductName:"Demo 3",Price:12,Status:2,Category:"Software Developing",SubCategory:".Net"},
	{ProductName:"Demo 4",Price:33,Status:1,Category:"Software Developing",SubCategory:".Net"},
	{ProductName:"Demo 5",Price:56,Status:1,Category:"APP Developing",SubCategory:"ReactJS Native"},
	{ProductName:"Demo 6",Price:526,Status:2,Category:"Web Developing",SubCategory:"ReactJS"},
]

class ProductList extends Component {
	
	constructor(props) {
		super(props);
	
		// default ui local state
		this.state = {
			loading: false,//true, // loading activity
			productList: [],
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
			productList: nextProps.contact_list.data,
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
		
		const { loading,productList,page,rowsPerPage,searchValue,count} = this.state;
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
                   
				   <WalletPageTitle title={<IntlMessages id="sidebar.listOfStartUp" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
			
					<div className="responsive-table-wrapper">
					
						<JbsCollapsibleCard fullBlock>
						<MUIDataTable
							title={<IntlMessages id="sidebar.listOfStartUp" />}
							//data={productList && productList.map(startUp => {
							data={productList && productList.map(product => {

								var status =<IntlMessages id={`myorders.response.status.${product.Status}`} />; //intl.formatMessage({id:`myorders.response.status.${item.CurrentStatus}`})

								return [
									product.ProductName,
									product.Price,
									product.Category,
									product.SubCategory,
									status
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
}) (ProductList));