/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : Survey Add Page Form
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import * as SurveyJSEditor from "surveyjs-editor";
import * as SurveyKo from "survey-knockout";
import "surveyjs-editor/surveyeditor.css";

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";

import "icheck/skins/square/blue.css";

import * as widgets from "surveyjs-widgets";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';

//Import CRUD Operation For Survey Actions...
import { addNewSurvey } from 'Actions/Surveys';
import { getLanguage } from 'Actions/Language';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
widgets.icheck(SurveyKo, $);
widgets.select2(SurveyKo, $);
widgets.inputmask(SurveyKo);
//Commented by Jayesh 17-04-2019
/*
widgets.jquerybarrating(SurveyKo, $);
widgets.jqueryuidatepicker(SurveyKo, $);
//widgets.nouislider(SurveyKo);
//widgets.select2tagbox(SurveyKo, $);
//widgets.signaturepad(SurveyKo);
//widgets.sortablejs(SurveyKo);*/
widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo, $);
/*widgets.bootstrapslider(SurveyKo);*/


//Validation for Survey Form
const validateSurveyformInput = require('../../../validation/Surveys/Surveys');

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
    index: 2
  },
  {
    title: <IntlMessages id="sidebar.surveys" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.addSurvey" />,
    link: '',
    index: 0
  }
];


function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 2 * 3 }}>
      {children}
    </Typography>
  );
}


class AddSurvey extends Component {
  editor;
  constructor(props) {
    super(props);

    // default ui local state
    this.state = {
      activeIndex: 1,
      loading: false, // loading activity
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      addNewSurveyDetail: {
        locale: {
          en: {
            surveyName: ""
          }
        },
        surveyJson: {},
        isDefault: 0,
        category_id: "1",
        status: 1,
        date_created: "",
        date_modified: "",
        created_by: "",
        modified_by: ""
      },
      language: [
        {
          id: 1,
          code: "en",
          language_name: "English",
          locale: "en-US,en_US.UTF-8,en_US,en-gb,english",
          status: "1",
          sort_order: "1"
        }
      ],
      fieldList: {},
      menudetail: [],
      Pflag: true,
    };
    this.initState = {
      activeIndex: 1,
      loading: false, // loading activity  Added by Jayesh 22-01-2019 for drowerclose issue
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      // Added By Megha Kariya (04/02/2019)
      addNewSurveyDetail: {
        locale: {
          en: {
            surveyName: ""
          }
        },
        surveyJson: {},
        isDefault: 0,
        category_id: "1",
        status: 1,
        date_created: "",
        date_modified: "",
        created_by: "",
        modified_by: ""
      },
    };
    this.onChangeaddNewSurveyDetails = this.onChangeaddNewSurveyDetails.bind(this);
    this.addSurveyDetail = this.addSurveyDetail.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  resetData() {
    this.setState(this.initState);
    this.editor.text = '';
    this.props.drawerClose();
  }

  onDismiss() {
    let err = delete this.state.errors['message'];
    this.setState({ err_alert: false, errors: err });
  }

  // Handle tab Change
  handleChange(e, value) {
    this.setState({ activeIndex: value });
  }

  //On Change Add New Survey Details
  onChangeaddNewSurveyDetails(key, value, lang = '') {
    if (lang != 'undefined' && lang != '') {
      let statusCopy = Object.assign({}, this.state.addNewSurveyDetail);
      statusCopy.locale[lang][key] = value;
      this.setState(statusCopy);
    }
    else {
      this.setState({
        addNewSurveyDetail: {
          ...this.state.addNewSurveyDetail,
          [key]: value
        }
      });
    }
  }

  //Add Survey Detail
  addSurveyDetail() {
    let data = {
      locale: this.state.addNewSurveyDetail.locale,
      surveyJson: this.editor.text,
      isDefault: this.state.addNewSurveyDetail.isDefault,
      category_id: this.state.addNewSurveyDetail.category_id,
      status: this.state.addNewSurveyDetail.status
    }

    const { errors, isValid } = validateSurveyformInput.validateAddSurveyInput(data);
    this.setState({ err_alert: true, errors: errors, btn_disabled: true });

    if (isValid) {
      this.props.addNewSurvey(data);
      this.setState({ loading: true });
    }
    else { // Added By Megha Kariya (08/02/2019)
      this.setState({ btn_disabled: false });
    }
  }

  componentDidMount() {
    SurveyKo.surveyLocalization.supportedLocales = ["ar", "de", "en", "es", "fr", "he", "hu", "it", "ja", "ko", "nl", "pt", "ru", "zh"];
    let editorOptions = { showEmbededSurveyTab: false, showTestSurveyTab: false, showJSONEditorTab: false };
    SurveyJSEditor.StylesManager.applyTheme("bootstrap");
    this.editor = new SurveyJSEditor.SurveyEditor(
      "surveyEditorContainer",
      editorOptions
    );
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('FD821083-17E2-8F23-67C5-175356CA18CB');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getLanguage();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (nextProps.data.responseCode === 0) {
      this.setState({ err_msg: '', err_alert: false });
      //this.props.drawerClose();
      this.resetData();
      this.props.reload();
    }

    if (typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
      if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.data.errors,
        btn_disabled: false // Added By Megha Kariya (08/02/2019)
      });
    }
    if (typeof nextProps.localebit != 'undefined' && nextProps.localebit != '' && nextProps.localebit == 1) {
      const locale = {};
      {
        nextProps.language && nextProps.language.map((lang, key) => {

          locale[lang.code] = {
            surveyName: ""
          };
        })
      }
      this.state.addNewSurveyDetail.locale = locale;
      this.setState({
        addNewSurveyDetail: this.state.addNewSurveyDetail
      });
    }

    this.setState({
      loading: nextProps.loading,
      language: nextProps.language
    });

  }

  closeAll = () => {
    this.setState(this.initState);
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  /* check menu permission */
  checkAndGetMenuAccessDetail(GUID) {
    var response = {};
    var index;
    const { menudetail } = this.state;
    if (menudetail.length) {
      for (index in menudetail) {
        if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
          if (menudetail[index].Fields && menudetail[index].Fields.length) {
            var fieldList = {};
            menudetail[index].Fields.forEach(function (item) {
              fieldList[item.GUID.toUpperCase()] = item;
            });
            return response = fieldList;
          }
        }
      }
    } else {
      return response;
    }
  }

  render() {
    var menudetail = this.checkAndGetMenuAccessDetail('CC93222D-299D-1002-2A80-6D1EFC5E192B');
    const { err_alert, activeIndex, language, errors, addNewSurveyDetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
    const { drawerClose } = this.props;

    return (
      <div className="jbs-page-content">
        <DashboardPageTitle title={<IntlMessages id="surveys.button.addSurvey" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
        {(loading || this.props.menuLoading) && <JbsSectionLoader />}

        {errors.message && <div className="alert_area">
          <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
        </div>}

        <Form className="tradefrm">
          <AppBar position="static" color="default">
            <Tabs
              value={this.state.activeIndex}
              onChange={(e, value) => this.handleChange(e, value)}
              indicatorColor="primary"
              textColor="primary"
              fullWidth
              scrollable
              scrollButtons="auto"
            >
              {language && language.map((lang, key) => (
                <Tab key={key} value={lang.id} title={lang.language_name} label={lang.language_name} icon={<img src={require(`Assets/flag-icons/${lang.code}.png`)} className="mr-10" width="25" height="16" alt="lang-icon" />} />
              ))}
            </Tabs>
          </AppBar>

          {language && language.map((lang, key) => {
            if (this.state.activeIndex == lang.id) {
              return (
                <TabContainer key={key}>
                  {(menudetail["ED119445-4E97-629C-6207-FC9219370B3D"] && menudetail["ED119445-4E97-629C-6207-FC9219370B3D"].Visibility === "E925F86B") && //ED119445-4E97-629C-6207-FC9219370B3D
                    <FormGroup>
                      <Label><IntlMessages id="surveys.surveyform.label.surveyName" />  ({lang.code})<span className="text-danger">*</span></Label>
                      <Input
                        disabled={(menudetail["ED119445-4E97-629C-6207-FC9219370B3D"].AccessRight === "11E6E7B0") ? true : false}
                        type="text"
                        name="surveyName"
                        id="surveyName"
                        maxLength={100}
                        value={addNewSurveyDetail && addNewSurveyDetail.locale && addNewSurveyDetail.locale[lang.code] && addNewSurveyDetail.locale[lang.code].surveyName}
                        onChange={(e) => this.onChangeaddNewSurveyDetails("surveyName", e.target.value, lang.code)}
                      />
                      {errors && errors[lang.code] && errors[lang.code].surveyName && <span className="text-danger"><IntlMessages id={errors[lang.code].surveyName} /></span>}
                    </FormGroup>}
                </TabContainer>
              );
            }
          })
          }

          {(menudetail["6402811B-2746-3C3A-6D17-5C165A3C8091"] && menudetail["6402811B-2746-3C3A-6D17-5C165A3C8091"].Visibility === "E925F86B") && //6402811B-2746-3C3A-6D17-5C165A3C8091
            <FormGroup>
              <Label><IntlMessages id="surveys.surveyform.label.surveyJson" /><span className="text-danger">*</span></Label>
              <div id="surveyEditorContainer" />
              {errors.surveyJson && <span className="text-danger"><IntlMessages id={errors.surveyJson} /></span>}
            </FormGroup>}

          {(menudetail["257DBD2B-9828-15F9-37F1-82D5CBC17BFC"] && menudetail["257DBD2B-9828-15F9-37F1-82D5CBC17BFC"].Visibility === "E925F86B") && //257DBD2B-9828-15F9-37F1-82D5CBC17BFC
            <FormGroup>
              <Label><IntlMessages id="surveys.surveyform.label.category_id" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["257DBD2B-9828-15F9-37F1-82D5CBC17BFC"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="category_id" id="category_id" onChange={(e) => this.onChangeaddNewSurveyDetails('category_id', e.target.value)} value={addNewSurveyDetail.category_id}>
                <IntlMessages id="survey.category.featurevoting">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="survey.category.coinlistvoting">{(selectOption) => <option value="2">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="survey.category.feedback">{(selectOption) => <option value="3">{selectOption}</option>}</IntlMessages>
              </Input>
              {errors.category_id && <span className="text-danger"><IntlMessages id={errors.category_id} /></span>}
            </FormGroup>}

          {(menudetail["D9FC74BF-1960-1B9D-258B-6CE479AE7B39"] && menudetail["D9FC74BF-1960-1B9D-258B-6CE479AE7B39"].Visibility === "E925F86B") && //D9FC74BF-1960-1B9D-258B-6CE479AE7B39
            <FormGroup>
              <Label><IntlMessages id="surveys.surveyform.label.status" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["D9FC74BF-1960-1B9D-258B-6CE479AE7B39"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="status" id="status" onChange={(e) => this.onChangeaddNewSurveyDetails('status', e.target.value)} value={addNewSurveyDetail.status}>
                <IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
              </Input>
              {errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
            </FormGroup>}

          {menudetail &&
            <FormGroup>
              <Button
                className="text-white text-bold btn mr-10"
                variant="raised"
                color="primary"
                onClick={() => this.addSurveyDetail()}
                disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
              >
                <IntlMessages id="button.add" />
              </Button>

              <Button
                className="text-white text-bold btn mr-10 btn bg-danger text-white"
                variant="raised"
                onClick={this.resetData}
                disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
              >
                <IntlMessages id="button.cancel" />
              </Button>

            </FormGroup>}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ languages, surveysReducer, authTokenRdcer }) => {
  var response = {
    data: surveysReducer.data,
    loading: surveysReducer.loading,
    language: languages.language,
    localebit: languages.localebit,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  if (typeof surveysReducer.localebit != 'undefined' && surveysReducer.localebit != 0) {
    response['localebit'] = surveysReducer.localebit;
  }
  return response;
}

export default withRouter(connect(mapStateToProps, {
  addNewSurvey, getLanguage, getMenuPermissionByID,
})(AddSurvey));
