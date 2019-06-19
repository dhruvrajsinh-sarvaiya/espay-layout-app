/* 
    Createdby : Jayesh pathak
    Updateby : Jayesh pathak
    CreatedDate : 29-12-2018
    UpdatedDate : 29-12-2018
    Description : Email Template List
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Badge, Alert } from "reactstrap";
import MUIDataTable from "mui-datatables";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//Import List email templates Actions...
import { getEmailTemplateByCategory, getListTemplates } from "Actions/EmailTemplates";

import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import EditEmailTemplateConfig from './edit';
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
    index: 0
  },
  // Added By Megha Kariya (05-02-2019)
  {
    title: <IntlMessages id="sidebar.templates" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.templatesConfiguration" />,
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
    name: <IntlMessages id="emailtemplate.form.lable.templateType" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="emailtemplate.form.lable.commServiceType" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="emailtemplate.form.lable.isOnOff" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="sidebar.colAction" />,
    options: { sort: false, filter: false }
  }
];

// componenet listing
const components = {
  EditEmailTemplateConfig: EditEmailTemplateConfig
};

// dynamic component binding
// Added By Megha Kariya (05-02-2019) : Add close2Level
const dynamicComponent = (TagName, props, drawerClose, close2Level, closeAll, templatesconfigdata, reload, permission) => {
  return React.createElement(components[TagName], { props, drawerClose, close2Level, closeAll, templatesconfigdata, reload, permission });
};

class EmailTemplatesConfiguration extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: true, // loading activity
      templateslist: [],
      errors: {},
      err_msg: "",
      err_alert: true,
      open: false,
      componentName: "",
      templatesconfigdata: {},
      menudetail: [],
      Pflag: true,
      permission: {},
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
    this.props.getListTemplates();
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('1E56DBA8-5E6F-494C-6939-B38B959D6816');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getListTemplates();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (typeof nextProps.data != 'undefined' && nextProps.data.ReturnCode === 1) { //getlist fail
      if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.data.errors
      });

    }

    if (typeof nextProps.data != 'undefined' && nextProps.data.ReturnCode === 0) {

      this.setState({
        templateslist: nextProps.data.Result,
        loading: nextProps.loading,
      });

    }

  }

  onClick = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  showComponent = (componentName, permission, template = '') => {
    // check permission go on next page or not
    if (permission) {
      if (typeof template != 'undefined' && template != '') {
        let ID = template.Key;
        if (ID != '') {
          this.props.getEmailTemplateByCategory(ID);
        }
        this.setState({ templatesconfigdata: template });
      }
      this.setState({
        componentName: componentName,
        open: !this.state.open,
      });
    } else {
      NotificationManager.error(<IntlMessages id={"error.permission"} />);
    }
  }

  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  // Added By Megha Kariya (05-02-2019)
  close2Level = () => {
    this.props.close2Level();
    this.setState({ open: false });
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
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('9007A014-829A-748F-8707-066209E85C26'); //9007A014-829A-748F-8707-066209E85C26
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }
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
      search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
    };

    return (
      <Fragment>
        <div className="jbs-page-content">
          <DashboardPageTitle title={<IntlMessages id="sidebar.templatesConfiguration" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
          {(loading || this.props.menuLoading) && <JbsSectionLoader />}

          {errors.message && <div className="alert_area">
            <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
          </div>}

          <JbsCollapsibleCard fullBlock>
            <div className="StackingHistory statusbtn-comm">
              <MUIDataTable
                data={
                  templateslist &&
                  templateslist.map((template, key) => {
                    return [
                      template.Key,
                      template.Value,
                      template.ServiceType === 1 ? 'SMS' : 'Email',
                      template.IsOnOff === 1 ? (
                        <Badge className="mb-10 mr-10" color="primary">
                          <IntlMessages id="global.form.status.active" />
                        </Badge>
                      ) : (
                          <Badge className="mb-10 mr-10" color="danger">
                            <IntlMessages id="global.form.status.inactive" />
                          </Badge>
                        ),
                      <div className="list-action">
                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                          <a
                            href="javascript:void(0)"
                            color="primary"
                            onClick={(e) => this.showComponent('EditEmailTemplateConfig', (this.checkAndGetMenuAccessDetail('9007A014-829A-748F-8707-066209E85C26')).HasChild, template)}
                          >
                            <i className="ti-pencil" />
                          </a>
                        }
                      </div>
                    ];
                  })
                }
                columns={columns}
                options={options}
              />
            </div>
          </JbsCollapsibleCard>
          <Drawer
            width="100%"
            handler={false}
            open={this.state.open}
            className="drawer2"
            level=".drawer1"
            placement="right"
            levelMove={100}
          >
            {/* Added By Megha Kariya (05-02-2019) : Add close2Level */}
            {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.close2Level, this.closeAll, this.state.templatesconfigdata, this.reload)}
          </Drawer>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ emailtemplatesReducer, authTokenRdcer }) => {

  var response = {
    data: emailtemplatesReducer.all_templates_listing,
    loading: emailtemplatesReducer.loading,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default withRouter(connect(
  mapStateToProps,
  {
    getListTemplates,
    getEmailTemplateByCategory,
    getMenuPermissionByID,
  }
)(EmailTemplatesConfiguration));