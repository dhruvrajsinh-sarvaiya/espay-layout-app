/* 
    Createdby : Jayesh pathak
    Updateby : Jayesh pathak
    CreatedDate : 29-12-2018
    UpdatedDate : 29-12-2018
    Description : Email Template List
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MatButton from "@material-ui/core/Button";
import Switch from 'react-toggle-switch';
import { Link, withRouter } from "react-router-dom";
import { Badge, Alert } from "reactstrap";
import MUIDataTable from "mui-datatables";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//Import List email templates Actions...
import { getEmailTemplates, updateTemplateStatus, getEmailTemplateById, getListTemplates, getEmailTemplatesParameters } from "Actions/EmailTemplates"; // Change By Megha Kariya (04/02/2019)

import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';
import AddEmailTemplate from './add';
import EditEmailTemplate from './edit';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';

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
    title: <IntlMessages id="sidebar.cms" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.templates" />,
    link: '',
    index: 0
  }
];

const columns = [
  {
    name: <IntlMessages id="sidebar.colId" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="emailtemplate.form.lable.templateName" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="emailtemplate.form.lable.templateType" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="emailtemplate.form.lable.commServiceType" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="emailtemplate.form.lable.status" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="sidebar.colAction" />,
    options: { sort: false, filter: false }
  }
];

// componenet listing
const components = {
  AddEmailTemplate: AddEmailTemplate,
  EditEmailTemplate: EditEmailTemplate,
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, templatesdata, reload) => {
  return React.createElement(components[TagName], { props, drawerClose, closeAll, templatesdata, reload });
};

class EmailTemplates extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: true, // loading activity
      templateslist: [],
      errors: {},
      err_msg: "",
      err_alert: true,
      switched: false,
      showErrorStatus: false,
      showSuccessStatus: false,
      responseMessageForList: "",
      open: false,
      componentName: "",
      templatesdata: {},
      currentKey: '',
      menudetail: [],
      Pflag: true,
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.reload = this.reload.bind(this);
  }

  onDismiss() {
    let err = delete this.state.errors['message'];
    this.setState({ err_alert: false, errors: err });
  }

  //On Reload
  reload() {
    this.props.getEmailTemplates();
    this.setState({ switched: false });
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getEmailTemplates();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (typeof nextProps.templates_list != 'undefined' && nextProps.templates_list.ReturnCode === 1) { //getlist fail
      if (typeof nextProps.templates_list.errors.message != 'undefined' && nextProps.templates_list.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.templates_list.errors
      });

    } else if (typeof nextProps.statusResponse !== 'undefined' && nextProps.statusResponse.ReturnCode === 0) { //update status success

      this.setState({ showSuccessStatus: true, responseMessageForList: nextProps.statusResponse.ReturnMsg })
      setTimeout(function () {
        this.setState({ showSuccessStatus: false, loading: nextProps.loading });
      }.bind(this), 3000);

    } else if (typeof nextProps.errors != 'undefined' && nextProps.errors.ReturnCode === 1) { //update status fail

      let tempObj = this.props.templates_list.TemplateMasterObj;    //Added by Jayesh for set default when error 29-01-2019
      tempObj[this.state.currentKey].Status = tempObj[this.state.currentKey].Status ? 0 : 1;

      this.setState({ showErrorStatus: true, responseMessageForList: <IntlMessages id={`apiErrCode.${nextProps.errors.ErrorCode}`} />, templateslist: tempObj })

      setTimeout(function () {
        this.setState({ showErrorStatus: false, loading: nextProps.loading });
      }.bind(this), 3000);

    }

    if (typeof nextProps.templates_list != 'undefined' && nextProps.templates_list.ReturnCode === 0 && this.state.switched === false) {

      if (nextProps.loading === false) {
        this.setState({
          switched: true
        });
      }

      this.setState({
        templateslist: nextProps.templates_list.TemplateMasterObj,
        loading: nextProps.loading,
      });

    }

  }

  toggleSwitch = (key) => {
    let tempObj = this.props.templates_list.TemplateMasterObj;
    tempObj[key].Status = tempObj[key].Status ? 0 : 1;
    this.setState({ templateslist: tempObj, loading: true, currentKey: key }); // Added by Jayesh 29-01-2018
    this.props.updateTemplateStatus({
      status: tempObj[key].Status,
      id: tempObj[key].ID
    });
  }

  onClick = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  showComponent = (componentName, template = '') => {

    if (typeof template != 'undefined' && template != '') {
      let ID = template.ID;
      if (ID != '') {
        this.props.getEmailTemplateById(ID);
        this.props.getListTemplates();
      }
      this.setState({ templatesdata: template });
    }
    // Added By Megha Kariya (04/02/2019)
    this.props.getListTemplates();
    this.props.getEmailTemplatesParameters();
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
    const { loading, err_alert, errors, templateslist } = this.state;
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
      rowsPerPageOptions: [10, 25, 50, 100],
      customToolbar: () => {
        return (
          <MatButton
            onClick={(e) => this.showComponent('AddEmailTemplate')}
            className="btn-primary text-white"
          >
            <IntlMessages id="button.add" />
          </MatButton>
        );
      }
    };
    return (
      <Fragment>
        <div className="jbs-page-content">
          <DashboardPageTitle title={<IntlMessages id="sidebar.templates" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
          {errors.message && <div className="alert_area">
            <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
          </div>}
          <Alert color="danger" isOpen={this.state.showErrorStatus} toggle={(e) => this.setState({ showErrorStatus: false })}>
            {this.state.responseMessageForList}
          </Alert>
          <Alert color="success" isOpen={this.state.showSuccessStatus} toggle={(e) => this.setState({ showSuccessStatus: false })}>
            {this.state.responseMessageForList}
          </Alert>
          <JbsCollapsibleCard fullBlock>
            <div className="StackingHistory">
              <MUIDataTable
                // title={<IntlMessages id="sidebar.templates" />}
                data={
                  templateslist &&
                  templateslist.map((template, key) => {
                    return [
                      template.ID,
                      template.TemplateName,
                      template.TemplateType,
                      template.CommServiceType,
                      template.Status != 9 ? (
                        <Switch id={template.TemplateID} onClick={() => this.toggleSwitch(key)} on={(template.Status === 1) ? true : false} />
                      ) : (
                          <Badge color="danger">
                            <IntlMessages id="global.form.status.deleted" />
                          </Badge>
                        ),
                      <div className="list-action">
                        <a
                          href="javascript:void(0)"
                          color="primary"
                          onClick={(e) => this.showComponent('EditEmailTemplate', template)}
                        >
                          <i className="ti-pencil" />
                        </a>
                      </div>
                    ];
                  })
                }
                columns={columns}
                options={options}
              />
              {(loading || this.props.menuLoading) && <JbsSectionLoader />}
            </div>
          </JbsCollapsibleCard>
          <Drawer
            width="100%"
            handler={false}
            open={this.state.open}
            // onMaskClick={this.onClick}
            className="drawer2"
            level=".drawer1"
            placement="right"
            levelMove={100}
          >
            {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.closeAll, this.state.templatesdata, this.reload)}
          </Drawer>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ emailtemplatesReducer, authTokenRdcer }) => {

  var response = {
    data: emailtemplatesReducer.data,
    loading: emailtemplatesReducer.loading,
    templates_list: emailtemplatesReducer.templates_list,
    statusResponse: emailtemplatesReducer.statusResponse,
    errors: emailtemplatesReducer.errors,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default withRouter(connect(
  mapStateToProps,
  {
    getEmailTemplates,
    updateTemplateStatus,
    getEmailTemplateById,
    getListTemplates,
    getEmailTemplatesParameters, // Added By Megha Kariya (04/02/2019)
    getMenuPermissionByID,
  }
)(EmailTemplates));