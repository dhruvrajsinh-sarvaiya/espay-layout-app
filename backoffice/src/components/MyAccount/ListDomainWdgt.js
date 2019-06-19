/**
 * List Roles Wdgt
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Badge } from 'reactstrap';
//DataTable
import MUIDataTable from "mui-datatables";
//intl messages
import IntlMessages from "Util/IntlMessages";
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
        name: <IntlMessages id="sidebar.colAliasName" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colDomainName" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colUserName" />,
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
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colUpdatedDt" />,
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

const data = [
    {
      "id": 1,
      "alias_name": "Paro",
      "domain_name": "www.paro.com",
      "user_name": "John Deo",
      "status": 1,
      "created_date": "2018-11-24 10:06:50",
      "updated_date": "2018-11-24 10:06:50"
    },
    {
      "id": 2,
      "alias_name": "Binanac",
      "domain_name": "www.binance.com",
      "user_name": "John Deo",
      "status": 1,
      "created_date": "2018-11-24 10:06:50",
      "updated_date": "2018-11-24 10:06:50"
    },
    {
      "id": 3,
      "alias_name": "Bitrex",
      "domain_name": "www.bitrex.com",
      "user_name": "John Deo",
      "status": 1,
      "created_date": "2018-11-24 10:06:50",
      "updated_date": "2018-11-24 10:06:50"
    },
    {
      "id": 4,
      "alias_name": "Oho Cash",
      "domain_name": "www.ohocash.com",
      "user_name": "John Deo",
      "status": 1,
      "created_date": "2018-11-24 10:06:50",
      "updated_date": "2018-11-24 10:06:50"
    }
  ];

const options = {
    filterType: "select",
    responsive: "scroll",
    selectableRows: false
};

const DomainStatus = ({ status }) => {
    let htmlStatus = <Badge color="danger"><IntlMessages id="sidebar.rejected" /></Badge>;
    if (status === 1) {
        htmlStatus = <Badge color="success"><IntlMessages id="sidebar.verify" /></Badge>;
    } else if (status === 2) {
        htmlStatus = <Badge color="warning"><IntlMessages id="sidebar.notVerify" /></Badge>;
    }
    return htmlStatus;
}

class ListDomainWdgt extends Component {
    constructor(props) {
        super();
        this.state = {
            list : []
        }
    }

    render() {
        return (
            <div className="StackingHistory">
                <MUIDataTable
                    title={<IntlMessages id="sidebar.listDomains" />}
                    columns={columns}
                    data={
                        data.map((lst,key) => {
                            return [
                                lst.id,
                                lst.alias_name,
                                lst.domain_name,
                                lst.user_name,
                                <Fragment>
                                    <DomainStatus status={lst.status} />
                                </Fragment>,
                                lst.created_date,
                                lst.updated_date,
                                <Fragment>
                                    <Link className="mr-10" color="primary" to={{pathname:"/app/my-account/edit-kyc", state : { data : lst }}}><i className="zmdi zmdi-eye zmdi-hc-2x" /></Link>
                                </Fragment>
                            ]
                        })
                    }
                    options={options}
                />
            </div>
        );
    }
}

export default ListDomainWdgt;