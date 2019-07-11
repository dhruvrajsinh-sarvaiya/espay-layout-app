/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 10-01-2019
    UpdatedDate : 10-01-2019
    Description : Help Manual  List
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
import MatButton from "@material-ui/core/Button";
import { Badge } from "reactstrap";
import MUIDataTable from "mui-datatables";
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
//Import List Help Manual Actions...
import {
  getHelpmanuals,
  deleteHelpmanual,
  getHelpmanualById, // Added by Khushbu Badheka D:30/01/2019
  getHelpmanualmodules // Added by Khushbu Badheka D:30/01/2019

} from "Actions/HelpManual";
import AddHelpManual from './add';
import EditHelpManual from './edit';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { getLanguage } from 'Actions/Language';  // Added by Khushbu Badheka D:30/01/2019
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
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
    title: <IntlMessages id="sidebar.help" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.helpmanual" />,
    link: '',
    index: 0
  }
];

// componenet listing
const components = {
  AddHelpManual: AddHelpManual,
  EditHelpManual: EditHelpManual
};

// dynamic component binding
// Added By Megha Kariya (05-02-2019) : Add close2Level
const dynamicComponent = (TagName, props, drawerClose, close2Level, closeAll, manualdata, reload, permission) => {
  return React.createElement(components[TagName], { props, drawerClose, close2Level, closeAll, manualdata, reload, permission });
};

//Table Object...
const columns = [
  {
    name: <IntlMessages id="sidebar.colId" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="helpmanual.label.title" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="help.label.module_name" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="help.label.sort_order" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="sidebar.date_modified" />,  // Added by Jayesh 22-01-2019
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="sidebar.colStatus" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="sidebar.colAction" />,
    options: { sort: false, filter: false }
  }
];

class HelpManuals extends Component {
  constructor(props) {
    super();
    // default ui local state
    this.state = {
      loading: false, // loading activity
      help_manual_list: [],
      errors: {},
      err_msg: "",
      err_alert: true,
      selectedmanual: "",
      open: false,
      componentName: "",
      manualdata: {},
      permission: {},
      menudetail: [],
      Pflag: true,
    };
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    let err = delete this.state.errors['message'];
    this.setState({ err_alert: false, errors: err });
  }

  //On Reload
  reload() {
    this.props.getHelpmanuals();
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('FB40DCDD-80AD-A586-3CB6-364107F33C7D');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getHelpmanuals();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (nextProps.data.responseCode == 0 && nextProps.deleteevent == 1) {
      this.setState({ loading: false, selectedmanual: null });
      this.reload();
    }
    if (nextProps.data.responseCode == 9 || nextProps.data.responseCode == 1) {
      if (nextProps.data.errors.message !== undefined && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.data.errors
      });
    }

    this.setState({
      help_manual_list: nextProps.help_manual_list,
      loading: false
    });
  }

  /**
   * On Delete
   */
  onDelete(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedmanual: data });
  }

  /**
   * Delete help manual Permanently
   */
  deleteHelpmanualPermanently() {
    const { selectedmanual } = this.state;
    this.refs.deleteConfirmationDialog.close();
    this.setState({ loading: true });
    let ManualId = selectedmanual._id;
    if (ManualId !== undefined && ManualId != "") {
      this.props.deleteHelpmanual(ManualId);
    }
  }

  onClick = () => {
    this.setState({
      open: this.state.open ? false : true,
    })
  }

  showComponent = (componentName, permission, manual) => {
    // check permission go on next page or not
    if (permission) {
      if (manual !== undefined && manual != '') {
        this.setState({ manualdata: manual });
        this.props.getHelpmanualmodules(); // Added by Khushbu Badheka D:30/01/2019
        this.props.getHelpmanualById(manual._id); // Added by Khushbu Badheka D:30/01/2019
      }
      this.props.getLanguage(); // Added by Khushbu Badheka D:30/01/2019
      this.setState({
        componentName: componentName,
        open: this.state.open ? false : true,
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
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('DCBFD7FA-3083-0196-640A-E1E5CD481220'); //DCBFD7FA-3083-0196-640A-E1E5CD481220
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }
    const { loading, err_alert, errors, help_manual_list } = this.state;
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
      customToolbar: () => {
        if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
          return (
            <MatButton
              variant="raised"
              onClick={(e) => this.showComponent('AddHelpManual', (this.checkAndGetMenuAccessDetail('DCBFD7FA-3083-0196-640A-E1E5CD481220')).HasChild)}
              className="btn-primary text-white"
            >
              <IntlMessages id="button.add" />
            </MatButton>
          );
        }
      }
    };

    return (
      <Fragment>
        <div className="jbs-page-content">
          <DashboardPageTitle title={<IntlMessages id="sidebar.helpmanual" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
          {(loading || this.props.menuLoading) && <JbsSectionLoader />}

          {errors.message && <div className="alert_area">
            <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
          </div>}

          <JbsCollapsibleCard fullBlock>
            <div className="StackingHistory">
              <MUIDataTable
                data={
                  help_manual_list &&
                  help_manual_list.map(manual => {
                    return [
                      manual.manual_id,
                      manual.locale.en.title,
                      manual.module_id && manual.module_id.locale && manual.module_id.locale.en.module_name ? manual.module_id.locale.en.module_name : '--',
                      manual.sort_order,
                      new Date(manual.date_modified).toLocaleString(),  // Added by Jayesh 22-01-2019
                      manual.status == 1 ? (
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
                            onClick={(e) => this.showComponent('EditHelpManual', (this.checkAndGetMenuAccessDetail('DCBFD7FA-3083-0196-640A-E1E5CD481220')).HasChild, manual)}
                          >
                            <i className="ti-pencil" />
                          </a>
                        }
                        {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && // check for delete permission
                          <a
                            href="javascript:void(0)"
                            color="primary"
                            onClick={() => this.onDelete(manual)}
                          >
                            <i className="ti-close" />
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

          <DeleteConfirmationDialog
            ref="deleteConfirmationDialog"
            title={<IntlMessages id="global.delete.message" />}
            message=""
            onConfirm={() => this.deleteHelpmanualPermanently()}
          />

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
            {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.close2Level, this.closeAll, this.state.manualdata, this.reload)}
          </Drawer>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ helpmanuals, authTokenRdcer }) => {
  var response = {
    data: helpmanuals.data,
    loading: helpmanuals.loading,
    help_manual_list: helpmanuals.help_manual_list,
    deleteevent: helpmanuals.deleteevent,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    getHelpmanuals,
    deleteHelpmanual,
    getHelpmanualById, // Added by Khushbu Badheka D:30/01/2019
    getHelpmanualmodules, // Added by Khushbu Badheka D:30/01/2019
    getLanguage, // Added by Khushbu Badheka D:30/01/2019
    getMenuPermissionByID,
  }
)(HelpManuals);