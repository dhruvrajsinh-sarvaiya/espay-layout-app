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
            list: []
        }
    }

    render() {
        return (
            <div className="StackingHistory">
                {/* <JbsCollapsibleCard>
                    <div className="col-md-12">
                        <div className="top-filter clearfix p-20">
                            <FormGroup className="mb-5">
                                <Label for="startDate">Start Date</Label>
                                <Input type="date" name="date" id="startDate" placeholder="dd/mm/yyyy" value={this.state.FromDate} onChange={(e) => this.onChangeHandler(e, 'FromDate')} />
                            </FormGroup>
                            <FormGroup className="mb-5">
                                <Label for="endDate">End Date</Label>
                                <Input type="date" name="date" id="endDate" placeholder="dd/mm/yyyy" value={this.state.ToDate} onChange={(e) => this.onChangeHandler(e, 'ToDate')} />
                            </FormGroup>
                            <FormGroup className="w-10 mb-5">
                                <Label for="Select-1"><IntlMessages id="widgets.status" /></Label>
                                <Input type="select" name="status" id="status" value={this.state.Status} onChange={(e) => this.onChangeHandler(e, 'Status')}>
                                    <option value="">Select Status</option>
                                    <option value="1">Active </option>
                                    <option value="2">Inactive </option>
                                    <option value="3">Freeze </option>
                                    <option value="4">Inoperative </option>
                                    <option value="5">Suspended </option>
                                    <option value="6">Blocked </option>
                                    <option value="9">Deleted </option>
                                </Input>
                            </FormGroup>
                            <FormGroup className="w-10 mb-5">
                                <Label for="endDate"><IntlMessages id="wallet.lblUserId" /></Label>
                                <Input type="text" name="userid" id="userid" placeholder="Search.." value={this.state.UserId} onChange={(e) => this.onChangeHandler(e, 'UserId')} />
                            </FormGroup>
                            <FormGroup className="w-10 mb-5">
                                <Label for="endDate"><IntlMessages id="table.organization" /></Label>
                                <Input type="select" name="OrgId" id="OrgId" value={this.state.OrgId} onChange={(e) => this.onChangeHandler(e, 'OrgId')}>
                                    <option value="">Select Organization</option>
                                    {this.props.organizationList.hasOwnProperty("Organizations") &&
                                        this.props.organizationList.Organizations.length &&
                                        this.props.organizationList.Organizations.map((org, index) => (
                                            <option key={index} value={org.OrgID}>{org.OrgName}</option>
                                        ))}
                                </Input>
                            </FormGroup>
                            <FormGroup className="w-10 mb-5">
                                <Label for="Select-1"><IntlMessages id="table.walletType" /></Label>
                                <Input type="select" name="walletType" id="walletType" value={this.state.WalletType} onChange={(e) => this.onChangeHandler(e, 'WalletType')}>
                                    <option value="">Select Wallet Type</option>
                                    {this.props.walletType.hasOwnProperty("Types") &&
                                        this.props.walletType.Types.length &&
                                        this.props.walletType.Types.map((type, index) => (
                                            <option key={index} value={type.TypeName}>{type.TypeName}</option>
                                        ))}
                                </Input>
                            </FormGroup>
                            <FormGroup className="mb-5">
                                <Label className="d-block">&nbsp;</Label>
                                <Button color="primary" variant="raised" className="mr-10 text-white" onClick={() => this.applyFilter()}><IntlMessages id="widgets.apply" /></Button>
                            </FormGroup>
                            {this.state.showReset && <FormGroup className="mb-5">
                                <Label className="d-block">&nbsp;</Label>
                                <Button className="btn-success text-white" onClick={(e) => this.clearFilter()}>
                                    <IntlMessages id="bugreport.list.dialog.button.clear" />
                                </Button>
                            </FormGroup>}
                        </div>
                    </div>
                </JbsCollapsibleCard> */}
                {/* <MUIDataTable
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
                /> */}
            </div>
        );
    }
}

export default ListDomainWdgt;