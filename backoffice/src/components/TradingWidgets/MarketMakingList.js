/* 
    Developer : Palak Gajjar
    Date : 04.06.2019
    File Comment :MarketMakingList Component
*/

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import { Badge } from 'reactstrap';
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import Tooltip from '@material-ui/core/Tooltip';
import { changeDateFormat } from "Helpers/helpers";
import { getMarketMaking, updateMarketMaking } from 'Actions/Trading';

//Column Field
const columns = [
    {
        name: <IntlMessages id="table.srno" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colActions" />,
        options: { filter: false, sort: false }
    }
];

//BreadCrumbData
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.trading" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="card.list.title.configuration" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.MarketMakingList" />,
        link: '',
        index: 2
    }
];

const MarketMakingStatus = ({ status }) => {
    var htmlStr = '';
    if (status === 0) {
        htmlStr = <Badge color="warning"><IntlMessages id="sidebar.inactive" /></Badge>;
    } else if (status === 1) {
        htmlStr = <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>;
    } else if (status === 9) {
        htmlStr = <Badge color="danger"><IntlMessages id="sidebar.btnDelete" /></Badge>;
    }
    return htmlStr;
}

class MarketMakingList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Id: '',
            status: '',
            open: false,
            marketList: [],
        };
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }
    //Change Status Method...
    changeStatus(Id, status) {
        var reqObj = {
            Id: Id,
            status: status
        }
        this.props.updateMarketMaking(reqObj);
    }
    ondeleteDialog(Id, Status) {
        this.refs.deleteConfirmationDialog.open();
        this.setState({ Id: Id, status: Status });
    }

    ondeleteStatus() {
        const reqObj = {
            Id: this.state.Id,
            status: this.state.status
        }
        this.props.updateMarketMaking(reqObj);
        this.refs.deleteConfirmationDialog.close();
    }
    componentWillMount() {
        this.props.getMarketMaking();
    }
    componentWillReceiveProps(nextProps) {
        //Get Market Making List...
        if (nextProps.marketList.hasOwnProperty('Data') && nextProps.marketList.Data.length > 0) {
            this.setState({ marketList: nextProps.marketList.Data, loading: nextProps.loading });
        }
        else if (nextProps.marketList.hasOwnProperty('Data') && nextProps.marketList.Data.length <= 0) {
            this.setState({ marketList: [] });
        }
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }
        //Change Status
        if (nextProps.chngStsData.ReturnCode === 1) {
            var errMsg = nextProps.marketList.ErrorCode === 1 ? nextProps.marketList.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.list.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.chngStsData.ReturnCode === 0) {
            this.props.getMarketMaking();
            var sucMsg = nextProps.chngStsData.ErrorCode === 0 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
    }

    render() {
        const { marketList } = this.state;
        const { drawerClose } = this.props;
        const options = {
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            resizableColumns: false,
            search: false,
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            sort: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },

        };
        return (
            <Fragment>
                {this.props.loading && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.MarketMakingList" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                            options={options}
                            columns={columns}
                            data={marketList.map((item, key) => {
                                return [
                                    key + 1,
                                    item.Name,
                                    <MarketMakingStatus status={item.Status} />,
                                    changeDateFormat(item.CreatedDate, 'YYYY-MM-DD'),
                                    <div className="list-action">
                                        {(item.Status !== 1) && <Tooltip title={<IntlMessages id="sidebar.active" />} placement="bottom"><a href="javascript:void(0)" onClick={() => this.changeStatus(item.Id, 1)} className="mr-10"><i className="ti-check" /></a></Tooltip>}
                                        {(item.Status === 1) && <Tooltip title={<IntlMessages id="sidebar.inactive" />} placement="bottom"><a href="javascript:void(0)" onClick={() => this.changeStatus(item.Id, 0)} className="mr-10"><i className="ti-na" /></a></Tooltip>}
                                        {(item.Status !== 9) && <Tooltip title={<IntlMessages id="sidebar.btnDelete" />} placement="bottom"><a href="javascript:void(0)" onClick={() => this.ondeleteDialog(item.Id, 9)} className="mr-10"><i className="ti-close" /></a></Tooltip>}
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    {/* Delete Customer Confirmation Dialog */}
                    <DeleteConfirmationDialog
                        ref="deleteConfirmationDialog"
                        title={<IntlMessages id="sidebar.btnDelete" />}
                        message="Are You Sure Want To Delete?"
                        onConfirm={() => this.ondeleteStatus()}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapToProps = ({ marketMakingRdcer, drawerclose }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { marketList, chngStsData, loading } = marketMakingRdcer;
    return { marketList, chngStsData, loading, drawerclose };
}
export default connect(mapToProps, {
    getMarketMaking,
    updateMarketMaking,
})(MarketMakingList);