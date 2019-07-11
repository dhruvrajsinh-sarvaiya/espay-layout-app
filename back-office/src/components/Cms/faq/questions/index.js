/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-11-2018
    UpdatedDate : 27-11-2018
    Description : Faq Questions List
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
//Import List Faq Question Actions...
//Added by Meghaben 29-01-2019
import {
  getFaqcategories,
  getFaqquestions,
  deleteFaqQuestion,
  getFaqQuestionById
} from "Actions/Faq";
import { getLanguage } from 'Actions/Language';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import AddFaqQuestions from './add';
import EditFaqQuestions from './edit';
import { DashboardPageTitle } from '../../DashboardPageTitle';

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
    title: <IntlMessages id="sidebar.faq" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.Faq-Questions" />,
    link: '',
    index: 0
  }
];

// componenet listing
const components = {
  AddFaqQuestions: AddFaqQuestions,
  EditFaqQuestions: EditFaqQuestions
};

// dynamic component binding
// Added By Megha Kariya (05-02-2019) : add close2Level
const dynamicComponent = (TagName, props, drawerClose, close2Level, closeAll, faqquestiondata, reload, permission) => {
  return React.createElement(components[TagName], { props, drawerClose, close2Level, closeAll, faqquestiondata, reload, permission });
};

//Table Object...
const columns = [
  {
    name: <IntlMessages id="sidebar.colId" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="faq.questionform.label.question" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="faq.questionform.label.category" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="faq.questionform.label.sort_order" />,
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

class FaqQuestions extends Component {
  constructor(props) {
    super();
    // default ui local state
    this.state = {
      loading: false, // loading activity
      faqs_questions_list: [],
      categorylist: [],
      errors: {},
      err_msg: "",
      err_alert: true,
      selectedquestion: "",
      open: false,
      componentName: "",
      faqquestiondata: {},
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
    this.props.getFaqquestions();
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('8C722FB9-8559-6A53-1011-24B2717C91D2');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getFaqquestions();
        this.props.getFaqcategories();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (nextProps.data !== undefined && nextProps.data.responseCode == 0 && nextProps.deleteevent == 1) {
      this.setState({ loading: false, selectedquestion: null });
      this.reload();
    }
    if (nextProps.data !== undefined && (nextProps.data.responseCode == 9 || nextProps.data.responseCode == 1)) {
      if (nextProps.data.errors.message !== undefined && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.data.errors
      });
    }

    this.setState({
      categorylist: nextProps.faqs_categories_list,
      faqs_questions_list: nextProps.faqs_questions_list,
      loading: false
    });
  }

  /**
   * On Delete
   */
  onDelete(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedquestion: data });
  }

  /**
   * Delete Faq Question Permanently
   */
  deleteFaqQuestionPermanently() {
    const { selectedquestion } = this.state;
    this.refs.deleteConfirmationDialog.close();
    this.setState({ loading: true });
    let FaqQuestionId = selectedquestion._id;
    if (FaqQuestionId != undefined && FaqQuestionId != "") {
      this.props.deleteFaqQuestion(FaqQuestionId);
    }
  }

  onClick = () => {
    this.setState({
      open: this.state.open ? false : true,
    })
  }

  showComponent = (componentName, permission, question) => {
    // check permission go on next page or not
    if (permission) {
      if (question !== undefined && question != '') {
        this.setState({ faqquestiondata: question });
        //Added by Meghaben 29-01-2019
        this.props.getFaqQuestionById(question._id);
      }
      //Added by Meghaben 29-01-2019
      this.props.getFaqcategories();
      this.props.getLanguage();
      this.setState({
        componentName: componentName,
        open: true,
        permission: permission
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
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('CC09682E-0907-1BA4-A687-08BAE3B34160'); //CC09682E-0907-1BA4-A687-08BAE3B34160
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }
    const { loading, err_alert, errors, faqs_questions_list } = this.state;
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
              onClick={(e) => this.showComponent('AddFaqQuestions', (this.checkAndGetMenuAccessDetail('CC09682E-0907-1BA4-A687-08BAE3B34160')).HasChild)}
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
          <DashboardPageTitle title={<IntlMessages id="sidebar.Faq-Questions" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
          {(loading || this.props.menuLoading) && <JbsSectionLoader />}

          {errors.message && <div className="alert_area">
            <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
          </div>}

          <JbsCollapsibleCard fullBlock>
            <div className="StackingHistory">
              <MUIDataTable
                data={
                  faqs_questions_list &&
                  faqs_questions_list.map(question => {
                    return [
                      question.question_id,
                      question.locale.en.question,
                      question.category_id && question.category_id.locale && question.category_id.locale.en.category_name ? question.category_id.locale.en.category_name : '--',
                      question.sort_order,
                      new Date(question.date_modified).toLocaleString(),  // Added by Jayesh 22-01-2019
                      question.status == 1 ? (
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
                            onClick={(e) => this.showComponent('EditFaqQuestions', (this.checkAndGetMenuAccessDetail('CC09682E-0907-1BA4-A687-08BAE3B34160')).HasChild, question)}
                          >
                            <i className="ti-pencil" />
                          </a>
                        }
                        {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && // check for delete permission
                          <a
                            href="javascript:void(0)"
                            color="primary"
                            onClick={() => this.onDelete(question)}
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
            onConfirm={() => this.deleteFaqQuestionPermanently()}
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
            {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.close2Level, this.closeAll, this.state.faqquestiondata, this.reload)}
          </Drawer>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ faqcategories, faqquestions, authTokenRdcer }) => {
  var response = {
    data: faqquestions.data,
    loading: faqquestions.loading,
    faqs_categories_list: faqcategories.faqs_categories_list,
    faqs_questions_list: faqquestions.faqs_questions_list,
    deleteevent: faqquestions.deleteevent,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    getFaqcategories,
    getFaqquestions,
    deleteFaqQuestion,
    getFaqQuestionById,
    getLanguage,
    getMenuPermissionByID,
  }
)(FaqQuestions);