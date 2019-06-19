/* 
    Developer : Salim Deraiya
    Date : 28-12-2018
    File Comment : KYC Document Type List Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
import { Link } from "react-router-dom";
import MatButton from "@material-ui/core/Button";
//DataTable
import MUIDataTable from "mui-datatables";
import { ActiveInactiveStatus } from '../ActiveInactiveStatus';
import { DashboardPageTitle } from './DashboardPageTitle';
// import { addKYCDocumentConfig } from "Actions/MyAccount";
//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colDocType" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colDate" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: {
            filter: false,
            sort: false,
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
	/* downloadOptions : {
		filename: 'IP_History_'+changeDateFormat(new Date(),'YYYY-MM-DD')+'.csv'
	} */
};

const dataList = [
    { id: 1, doc_type: 'JPG', status : 0, created_date : '2018-12-08 13:25' },
    { id: 2, doc_type: 'PNG', status : 1, created_date : '2018-12-08 13:25' },
    { id: 3, doc_type: 'PDF', status : 1, created_date : '2018-12-08 13:25' },
    { id: 4, doc_type: 'JPEG', status : 0, created_date : '2018-12-08 13:25' }
];

class ListKYCDocumentType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            list: [],
        };
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }

    /* componentWillMount() {
        this.props.getIPWhitelistData();
    } */

    render() {
        const { drawerClose } = this.props;
        const data = dataList; //this.props.IPWhitelistDashData;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.listIPWhitelist" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="jbs-page-content col-md-12 mx-auto">
                    <div className="StackingHistory">
                        <MUIDataTable
                            title={<IntlMessages id="my_account.listIPWhitelist" />}
                            columns={columns}
                            data={
                                data.map((lst, key) => {
                                    return [
                                        lst.id,
                                        lst.doc_type,
                                        lst.status,
                                        // <Fragment>
                                        //     <ActiveInactiveStatus status={lst.status} />
                                        // </Fragment>,
                                        lst.created_date,
                                        <Fragment>
                                            <Link className="mr-10" color="Secondary" to={{ pathname: "", state: { data: lst } }}><i className="zmdi zmdi-edit zmdi-hc-2x" /></Link>
                                            {/* <Link className="mr-10" color="Secondary" to={{ pathname: "", state: { data: lst } }}><i className="zmdi zmdi-delete zmdi-hc-2x" /></Link> */}
                                        </Fragment>,
                                    ]
                                })
                            }
                            options={options}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

/* const mapToProps = ({ ipwhitelistDashboard }) => {
    const { IPWhitelistDashData, loading } = ipwhitelistDashboard;
    return { IPWhitelistDashData, loading };
}

export default connect(mapToProps, {
    getIPWhitelistData
})(ListKYCDocumentType); */

export default ListKYCDocumentType;