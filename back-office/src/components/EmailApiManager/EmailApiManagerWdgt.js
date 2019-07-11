/**
 * CreatedBy : Jinesh Bhatt
 * Date : 07-01-2019
 */
/**
 * Display Email API Manager
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import MatButton from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Button from '@material-ui/core/Button';
// intl messages
import IntlMessages from "Util/IntlMessages";

// import action
import { getEmailApiList } from "Actions/EmailApiManager";

//Notification Manager
import { NotificationManager } from "react-notifications";

import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import EditEmailApi from './EmailApiManagerWdgt/EditEmailApi';
import AddEmailAPI from './EmailApiManagerWdgt/AddEmailAPI';
import ViewEmailAPIDetail from './EmailApiManagerWdgt/ViewEmailAPIDetail';

//Columns Object
const columns = [
    {
        name: "APID",
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="emailAPIManager.column.SenderID" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="emailAPIManager.column.SendURL" />,
        options: { filter: true, sort: true }
    },
    {
        name: "ServiceName",
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="emailAPIManager.column.Action" />,
        options: { filter: false, sort: false }
    }
];

const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
};

const components = {
    EditEmailApi: EditEmailApi,
    AddEmailAPI: AddEmailAPI,
    ViewEmailAPIDetail: ViewEmailAPIDetail
};
const dynamicComponent = (TagName, EmailApiDetail, type, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { EmailApiDetail, type, drawerClose, closeAll });
};

//Component EmailApiManagerWdgt Class
class EmailApiManagerWdgt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: 0,
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            loading: false,
            componentName: '',
            open: false,
            SelectedEmailAPI: {},
            type: this.props.type
        };
        this.onApply = this.onApply.bind(this);
    }

    componentWillMount() {
        this.props.getEmailApiList({ type: this.state.type });
        this.setState({ loading: true });
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.error !== '' && this.state.errors == 0) {
            NotificationManager.error(nextProps.error);
            this.setState({ errors: 1 });
        }

        if (this.state.type !== nextProps.type) {
            this.props.getEmailApiList({ type: nextProps.type });
            this.setState({ loading: true, type: nextProps.type });
        }
    }

    // on change if change in any field store value in state
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    onApply(event) {
        this.props.getEmailApiList({});
        this.setState({ loading: true });
    }

    // Drawer Component
    showComponent = (componentName, EmailAPIDetail) => {

        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true,
            SelectedEmailAPI: EmailAPIDetail
        });
    };
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };
    toggleDrawer = (Email) => {
        this.setState({
            open: this.state.open ? false : true,
        });
    };

    render() {
        const data = typeof this.props.EmailApiList.Result == 'undefined' ? [] : this.props.EmailApiList.Result;
        const { drawerClose } = this.props;

        return (
            <div className="EmailAPIManagerList">
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="emailAPIManager.PageTitle" /></h2>
                    </div>
                    <div className="page-title-wrap">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
                            mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini
                            onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                {this.props.loading && <JbsSectionLoader />}
                <MUIDataTable
                    columns={columns}
                    data={data.map((item, key) => {
                        return [
                            item.APID,
                            item.SenderID,
                            item.SendURL,
                            item.ServiceName,
                            <div>
                                <Tooltip title={<IntlMessages id="liquidityprovider.tooltip.update" />}>
                                    <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                        this.showComponent('ViewEmailAPIDetail', item)
                                    }}><i className="ti-eye" />
                                    </a>
                                </Tooltip>
                                <Tooltip title={<IntlMessages id="liquidityprovider.tooltip.update" />}>
                                    <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                        this.showComponent('EditEmailApi', item)
                                    }}><i className="ti-pencil" />
                                    </a>
                                </Tooltip>
                            </div>
                        ];
                    })}
                    options={{
                        selectableRows: false, // <===== will turn off checkboxes in rows
                        print: false,// <===== will turn off print option in header
                        download: false,// <===== will turn off download option in header
                        viewColumns: false,// <===== will turn off viewColumns option in header
                        filter: false,// <===== will turn off filter option in header
                        customToolbar: () => {
                            return (
                                <MatButton
                                    variant="raised"
                                    className="btn-primary text-white"
                                    onClick={(e) => this.showComponent('AddEmailAPI', {})}
                                >
                                    <IntlMessages id="emailAPIManager.button.add" />
                                </MatButton>
                            );
                        },
                    }}
                />
                <Drawer
                    width="75%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.componentName == 'EditEmailApi' ? this.state.componentName != '' && this.state.componentName == 'EditEmailApi' && dynamicComponent(this.state.componentName, this.state.SelectedEmailAPI, this.state.type, this.toggleDrawer, this.closeAll) : this.state.componentName == 'ViewEmailAPIDetail' ? this.state.componentName != '' && this.state.componentName == 'ViewEmailAPIDetail' && dynamicComponent(this.state.componentName, this.state.SelectedEmailAPI, this.state.type, this.toggleDrawer, this.closeAll) : this.state.componentName != '' && this.state.componentName == 'AddEmailAPI' && dynamicComponent(this.state.componentName, {}, this.state.type, this.toggleDrawer, this.closeAll)}
                </Drawer>
            </div>

        );
    }
}

// map state to props
const mapStateToProps = ({ EmailApiManager }) => {

    const response = {
        EmailApiList: EmailApiManager.EmailApiList,
        loading: EmailApiManager.loading,
        error: EmailApiManager.error,
    };
    return response;
};

export default connect(mapStateToProps, { getEmailApiList })(EmailApiManagerWdgt);
