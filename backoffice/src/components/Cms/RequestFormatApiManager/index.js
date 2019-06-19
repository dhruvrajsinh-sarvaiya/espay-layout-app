/* 
    Created By : Megha Kariya (actual develop by Jineshbhai)
    Date : 20-02-2019
    Description : CMS Request Format API List
*/
import React, { Component, Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import MatButton from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import CloseButton from '@material-ui/core/Button';

import { connect } from "react-redux";
import { getrequestformet } from "Actions/RequestFormatApiManager";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import AddRequetsFormatwdgt from "./RequestFormatApiManagerWdgt/AddRequetsFormatwdgt";
import EditRequestFormatwdgt from "./RequestFormatApiManagerWdgt/EditRequestFormatwdgt";
import IntlMessages from "Util/IntlMessages";
import { DashboardPageTitle } from '../DashboardPageTitle';

import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
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
    title: <IntlMessages id="sidebar.cms" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.requestformet" />,
    link: '',
    index: 0
  }
];

const dyanamicComponent = (TagName, props, drawerClose, closeAll, item) => {
  return React.createElement(Component[TagName], {
    props,
    drawerClose,
    closeAll,
    item
  });
};

class RequestFormatApiManagerWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formetdata: [],
      open: false,
      Modal: false,
      addData: false,
      editData: false,
      editDetails: [],
      componentName: '',
      // distrebuter:null
      permission: {},
      menudetail: [],
      Pflag: true,
    };
    this.toggle = this.toggle.bind(this);
    this.toggaleEdit = this.toggaleEdit.bind(this);

  }
  toggle() {
    this.setState({
      modal: !this.state.Modal
    });
  }

  toggaleEdit() {
    this.setState({
      open: !this.state.open,
      editData: !this.state.editData
    });
  }

  closeAll = () => {
    this.setState({
      editData: false
    });
  };

  toggleDrawer = () => {
    this.setState({

      open: !this.state.open,
      componentName: ''
    })
  }
  editForm = (selectedData) => {
    this.setState({
      addData: false,
      editData: true,
      open: !this.state.open,
      editDetails: selectedData
    });
  };
  componentWillMount() {
    this.props.getMenuPermissionByID('652FF8FE-9544-5471-9F4A-F6F0563E8612');
  }

  onAddData = () => {
    this.setState({
      addData: true,
      open: !this.state.open,
      editData: false,
    })
  }
  showComponent = (componentName, permission) => {
    // check permission go on next page or not
    if (permission) {
      this.setState({
        componentName: componentName,
        open: !this.state.open,
      });
    } else {
      NotificationManager.error(<IntlMessages id={"error.permission"} />);
    }
  }
  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getrequestformet();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (nextProps.formetdata) {
      this.setState({
        formetdata: nextProps.formetdata
      })
    }
  }

  /* check menu permission */
  checkAndGetMenuAccessDetail(GUID) {
    var response = false;
    var index;
    const { menudetail } = this.state;
    if (menudetail.length) {
      for (index in menudetail) {
        if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
          response = menudetail[index];
      }
    }
    return response;
  }

  render() {
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('BEDDE08C-8EA4-60E4-A3BC-68ECA65B34F5'); //BEDDE08C-8EA4-60E4-A3BC-68ECA65B34F5
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }

    const columns = [
      {
        name: <IntlMessages id={"request.formet.RequestName"} />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id={"request.formet.RequestID"} />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id={"request.formet.ContentType"} />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id={"request.formet.MethodType"} />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id={"request.formet.RequestFormat"} />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id={"request.formet.Status"} />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id={"request.formet.action"} />,
        options: { sort: true, filter: true }
      }
    ];

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      selectableRows: false,
      print: false,
      search: false,
      download: false,
      viewColumns: false,
      filter: false,
      customToolbar: () => {
        if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
          return (
            <MatButton
              variant="raised"
              className="btn-primary text-white"
              onClick={() => {
                this.onAddData();
                this.showComponent('AddRequetsFormatwdgt', (this.checkAndGetMenuAccessDetail('BEDDE08C-8EA4-60E4-A3BC-68ECA65B34F5')).HasChild);
              }}
            >
              <IntlMessages id="request.formet.adddetailes" />
            </MatButton>
          );
        }
      }
    };
    const { drawerClose, closeAll } = this.props;
    const { permission } = this.state;

    const data =
      typeof this.props.formetdata !== "undefined" ? this.props.formetdata : [];

    return (
      <div className="jbs-page-content">
        <DashboardPageTitle title={<IntlMessages id="sidebar.requestformet" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}

        {this.props.formetdata && (
          <div className="StackingHistory">
            <MUIDataTable
              data={data.map(item => {
                return [
                  item.RequestName,
                  item.RequestID,
                  item.ContentType,
                  item.MethodType,
                  item.RequestFormat,
                  item.Status,
                  (menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                    <a
                      href="javascript:void(0)"
                      className="mr-10"
                      onClick={() => {
                        this.editForm(item);
                        this.showComponent('EditRequestFormatwdgt', (this.checkAndGetMenuAccessDetail('BEDDE08C-8EA4-60E4-A3BC-68ECA65B34F5')).HasChild);
                      }}
                    >
                      <i className="ti-pencil" />
                    </a>)
                ];
              })}
              options={options}
              columns={columns}
            />
          </div>
        )}

        <Drawer
          width="100%"
          handler={false}
          open={this.state.open}
          className="drawer2"
          level=".drawer1"
          placement="right"
          levelMove={100}
        >

          {this.state.addData && (
            <AddRequetsFormatwdgt {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
          )}

          {this.state.editData && this.state.editDetails && (
            <EditRequestFormatwdgt
              {...this.props}
              selectedData={this.state.editDetails}
              drawerClose={this.toggaleEdit}
              closeAll={this.closeAll}
            />
          )}
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = ({ AllRequestFormet, authTokenRdcer }) => {
  var response = {
    formetdata: AllRequestFormet.displayCustomerData,
    loading: AllRequestFormet.loading,
    // editresponse: AllRequestFormet.EditResponse,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    getrequestformet,
    getMenuPermissionByID,
  }
)(RequestFormatApiManagerWdgt);
