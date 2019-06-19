/* 
    Developer : Salim Deraiya
    Date : 26-11-2018
    File Comment : MyAccount Organization Form Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
//import MatButton from '@material-ui/core/Button';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { DashboardPageTitle } from './DashboardPageTitle';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { Badge } from "reactstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
import { changeDateFormat } from "Helpers/helpers";
// redux action
import { complainList } from "Actions/MyAccount";
// Component for MyAccount Organization Form Dashboard

//Table Columns
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: {
            filter: false,
            sort: true
        }
    },
    {
        name: <IntlMessages id="sidebar.colCustomerName" />,
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: <IntlMessages id="sidebar.colComplainID" />,
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: <IntlMessages id="sidebar.colType" />,
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: <IntlMessages id="sidebar.colSubject" />,
        options: {
            filter: false,
            sort: true
        }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: <IntlMessages id="sidebar.colDescription" />,
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: {
            filter: false,
            sort: true
        }
    },
    // {
    //     name: <IntlMessages id="sidebar.colAction" />,
    //     options: {
    //         filter: false,
    //         sort: false
    //     }
    // }
];

//Table Options
const options = {
    filterType: "dropdown",
    responsive: "scroll",
    selectableRows: false,
    textLabels: {
        body: {
            noMatch: <IntlMessages id="wallet.emptyTable" />,
            toolTip: <IntlMessages id="wallet.sort" />,
        }
    },
};

const ComplainStatus = ({ status_id }) => {
    let htmlStatus = "";
    if (status_id === "Open") {
        htmlStatus = (
            <Badge color="success">
                <IntlMessages id="sidebar.open" />
            </Badge>
        );
    } else if (status_id === "Close") {
        htmlStatus = (
            <Badge color="danger">
                <IntlMessages id="sidebar.closed" />
            </Badge>
        );
    } else if (status_id === "Pending") {
        htmlStatus = (
            <Badge color="primary">
                <IntlMessages id="sidebar.pending" />
            </Badge>
        );
    }
    return htmlStatus;
};

class ListCloseComplainDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            Getdata: {
                PageIndex: 0,
                Page_Size: 100,
                ComplainId: '',
                EmailId: '',
                MobileNo: '',
                Status: 2,
                TypeId: '',
            },
            data: [],
            loading: false,
        }
    }


    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    componentWillMount() {
        this.props.complainList(this.state.Getdata);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        if (Object.keys(nextProps.list).length !== undefined && Object.keys(nextProps.list).length > 0 && Object.keys(nextProps.list.GetTotalCompList).length > 0) {
            this.setState({ data: nextProps.list.GetTotalCompList });
        } else {
            this.setState({ data: [] });
        }
    }

    render() {
        const { data, loading } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.closeComplain" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {
                    loading
                        ?
                        <div className="text-center py-40"><CircularProgress className="progress-primary" thickness={2} /></div>
                        :
                        <div className="col-md-12">
                            <div className="StackingHistory mt-20">
                                <MUIDataTable
                                    title={<IntlMessages id="sidebar.closeComplain" />}
                                    columns={columns}
                                    data={data.map((list, index) => {
                                        return [
                                            index + 1,
                                            list.UserName,
                                            list.ComplainId,
                                            list.Type,
                                            <p className="Complainlist">{list.Subject}</p>,
                                            <ComplainStatus status_id={list.Status} />,
                                            <p className="Complainlist">{list.Description}</p>,
                                            <span className="date">{changeDateFormat(list.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>
                                        ];
                                    })}
                                    options={options}
                                />
                            </div>
                        </div>
                }
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ complainRdcer }) => {
    const { list, loading } = complainRdcer;
    return { list, loading };
};

export default connect(mapStateToProps,
    { complainList }
)(ListCloseComplainDashboard);

//export default ComplainReportDashboard;