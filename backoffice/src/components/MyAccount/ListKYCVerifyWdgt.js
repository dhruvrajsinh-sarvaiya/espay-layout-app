/**
 * List Roles Wdgt
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Badge } from 'reactstrap';
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

//DataTable
import MUIDataTable from "mui-datatables";

//intl messages
import IntlMessages from "Util/IntlMessages";

//Actions
import { kycVerify } from 'Actions/MyAccount';

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
        name: <IntlMessages id="sidebar.colName" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colEmail" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colExchange" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colDocUpdateAt" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colVerifyStatus" />,
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
    selectableRows: false
};

const KYCStatus = ({ status }) => {
    let htmlStatus = <Badge color="danger"><IntlMessages id="sidebar.rejected" /></Badge>;
    if (status === 1) {
        htmlStatus = <Badge color="success"><IntlMessages id="sidebar.verify" /></Badge>;
    } else if (status === 2) {
        htmlStatus = <Badge color="warning"><IntlMessages id="sidebar.notVerify" /></Badge>;
    }
    return htmlStatus;
}

class ListKYCVerifyWdgt extends Component {
    constructor(props) {
        super();
    }

    componentWillMount() {
        this.props.kycVerify();
    }

    render() {
        const { list } = this.props;
        return (
            <div className="StackingHistory">
                <MUIDataTable
                    title={<IntlMessages id="sidebar.kycVerify" />}
                    columns={columns}
                    data={
                        list.map((lst,key) => {
                            return [
                                lst.id,
                                lst.name,
                                lst.email,
                                lst.exchange,
                                lst.updated_at,
                                <Fragment>
                                    <KYCStatus status={lst.status} />
                                </Fragment>,
                                <Fragment>
                                    <Link className="mr-10" color="primary" to={{ pathname: "/app/my-account/edit-kyc", state: { data:lst } }}><i className="zmdi zmdi-eye zmdi-hc-2x" /></Link>
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

const mapStateToProps = ({ kycVerifyRdcer }) => {
    const { list, loading } = kycVerifyRdcer;
    return { list, loading };
}

export default connect(mapStateToProps,{
    kycVerify
})(ListKYCVerifyWdgt);