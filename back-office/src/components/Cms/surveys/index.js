/* 
    Createdby : Jayesh pathak
    Updateby : Jayesh pathak
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : Surveys List
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MatButton from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import { Badge, Alert } from "reactstrap";
import { getLanguage } from 'Actions/Language'; // Added By Megha Kariya (04/02/2019)
import MUIDataTable from "mui-datatables";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';

//Import List page Actions...
import { getSurveys, getSurveyResultsById, getSurveyById } from "Actions/Surveys";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import AddSurvey from './add';
import EditSurvey from './edit';
import SurveyResults from './survey-results';
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
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.surveys" />,
    link: '',
    index: 0
  }
];

const columns = [
  {
    name: <IntlMessages id="surveys.surveyform.label.surveyName" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="surveys.title.surveyCategory" />,
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

// componenet listing
const components = {
  AddSurvey: AddSurvey,
  EditSurvey: EditSurvey,
  SurveyResults: SurveyResults
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, surveydata, reload) => {
  return React.createElement(components[TagName], { props, drawerClose, closeAll, surveydata, reload });
};

class Surveys extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false, // loading activity
      surveylist: [],
      errors: {},
      err_msg: "",
      err_alert: true,
      open: false,
      componentName: "",
      surveydata: {},
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
    this.props.getSurveys();
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('21B5873A-9A15-465A-1BCE-5064A48E1E7F');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getSurveys();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    this.setState({
      surveylist: nextProps.surveys_list,
      loading: false
    });

    if (typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
      if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.data.errors
      });
    }

  }

  onClick = () => {
    this.setState({ open: this.state.open ? false : true })
  }

  showComponent = (componentName, permission, survey = '') => {
    // check permission go on next page or not
    if (permission) {
      if (survey != '') {
        let SurveyId = survey._id;

        if (SurveyId != '') {
          this.props.getSurveyResultsById(SurveyId);
          this.props.getSurveyById(SurveyId);
        }

        this.setState({ surveydata: survey });
      }
      this.props.getLanguage(); // Added By Megha Kariya (04/02/2019)
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
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('FD821083-17E2-8F23-67C5-175356CA18CB'); //FD821083-17E2-8F23-67C5-175356CA18CB
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }
    const { loading, err_alert, errors, surveylist } = this.state;
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
              onClick={(e) => this.showComponent('AddSurvey', (this.checkAndGetMenuAccessDetail('FD821083-17E2-8F23-67C5-175356CA18CB')).HasChild)}
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
          <DashboardPageTitle title={<IntlMessages id="sidebar.surveys" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
          {(loading || this.props.menuLoading) && <JbsSectionLoader />}

          {errors.message && <div className="alert_area">
            <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
          </div>}

          <JbsCollapsibleCard fullBlock>
            <div className="StackingHistory">
              <MUIDataTable
                data={
                  surveylist &&
                  surveylist.map(survey => {
                    return [
                      survey.locale.en.surveyName,
                      survey.category_id == 1 ? "Feature Voting" : survey.category_id == 2 ? "Coin Listing Voting" : "Feedback",
                      new Date(survey.date_modified).toLocaleString(),  // Added by Jayesh 22-01-2019
                      survey.status == 1 ? (
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
                            onClick={(e) => this.showComponent('EditSurvey', (this.checkAndGetMenuAccessDetail('FD821083-17E2-8F23-67C5-175356CA18CB')).HasChild, survey)}
                          >
                            <i className="ti-pencil" />
                          </a>
                        }
                        {menuPermissionDetail.CrudOption.indexOf('5645F321') !== -1 &&
                          <a
                            href="javascript:void(0)"
                            color="primary"
                            onClick={(e) => this.showComponent('SurveyResults', (this.checkAndGetMenuAccessDetail('FD821083-17E2-8F23-67C5-175356CA18CB')).HasChild, survey)}
                          >
                            <i className="ti-list" />
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
            {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.closeAll, this.state.surveydata, this.reload)}
          </Drawer>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ surveysReducer, authTokenRdcer }) => {
  var response = {
    data: surveysReducer.data,
    loading: surveysReducer.loading,
    surveys_list: surveysReducer.surveys_list,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default withRouter(connect(
  mapStateToProps,
  {
    getSurveys,
    getSurveyResultsById,
    getSurveyById,
    getLanguage, // Added By Megha Kariya (04/02/2019)
    getMenuPermissionByID,
  }
)(Surveys));