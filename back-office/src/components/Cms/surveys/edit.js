/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : Edit Survey Form
*/
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

// intl messages
import IntlMessages from "Util/IntlMessages";

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

import { getSurveyById, updateSurvey } from 'Actions/Surveys';
import { getLanguage } from 'Actions/Language';

import { DashboardPageTitle } from '../DashboardPageTitle';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
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
    title: <IntlMessages id="sidebar.editSurvey" />,
    link: '',
    index: 0
  }
];
//Validation for Survey Form
const validateSurveyformInput = require('../../../validation/Surveys/Surveys');

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 2 * 3 }}>
      {children}
    </Typography>
  );
}

class EditSurvey extends Component {
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
      surveydetail: {
        locale: {
          en: {
            surveyName: "",

          }
        },
        category_id: "1",
        surveyId: "",
        surveyJson: {},
        isDefault: 0,
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
      btn_disabled: false
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  resetData() {
    this.setState(this.initState);
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

  //On Update Survey Details
  onUpdateSurveyDetail(key, value, lang = '') {
    if (lang != 'undefined' && lang != '') {
      let statusCopy = Object.assign({}, this.state.surveydetail);
      statusCopy.locale[lang][key] = value;
      this.setState(statusCopy);
    }
    else {
      this.setState({
        surveydetail: {
          ...this.state.surveydetail,
          [key]: value
        }
      });
    }
  }

  //Update Survey Detail
  updateSurveyDetail() {

    let data = {
      surveyId: this.state.surveydetail.surveyId,
      category_id: this.state.surveydetail.category_id,
      locale: this.state.surveydetail.locale,
      surveyJson: this.editor.text,
      isDefault: this.state.surveydetail.isDefault,
      status: this.state.surveydetail.status
    }

    const { errors, isValid } = validateSurveyformInput.validateUpdateSurveyInput(data);
    this.setState({ errors: errors, btn_disabled: true }); // Added By Megha Kariya (08/02/2019) : add btn_disabled

    if (isValid) {
      setTimeout(() => {
        this.props.updateSurvey(data);
      }, 2000);
    }
    else { // Added By Megha Kariya (08/02/2019)
      this.setState({ btn_disabled: false });
    }
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('FD821083-17E2-8F23-67C5-175356CA18CB');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        let SurveyId = this.props.surveydata._id;
        if (SurveyId != '') {
          this.props.getLanguage();
          this.props.getSurveyById(SurveyId);
        } else {
          this.resetData();
        }
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
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
      this.setState({
        surveydetail: {
          ...this.state.surveydetail,
          locale: locale,
        }
      });
    }

    if (typeof nextProps.surveydetail != 'undefined' && typeof nextProps.surveydetail.locale != 'undefined' && nextProps.surveydetail != '') {

      const newlocale = {};
      {
        nextProps.language && nextProps.language.map((lang, key) => {

          newlocale[lang.code] = {
            surveyName: nextProps.surveydetail.locale[lang.code] && nextProps.surveydetail.locale[lang.code].surveyName ? nextProps.surveydetail.locale[lang.code].surveyName : ''
          };
        })
      }

      this.editor.text = nextProps.surveydetail.json;
      this.setState({
        surveydetail: {
          ...this.state.surveydetail,
          locale: newlocale,
          surveyId: nextProps.surveydetail._id,
          surveyJson: nextProps.surveydetail.json,
          isDefault: nextProps.surveydetail.isDefault,
          category_id: nextProps.surveydetail.category_id,
          status: nextProps.surveydetail.status,
        }
      });

    }

    if (nextProps.data.responseCode === 0) {
      this.setState({ err_msg: '', err_alert: false });
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

    this.setState({
      loading: nextProps.loading,
      language: nextProps.language
    });
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

  closeAll = () => {
    this.setState(this.initState);
    this.props.closeAll();
    this.setState({ open: false });
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
            response = fieldList;
          }
        }
      }
    }
    return response;
  }


  render() {
    var menudetail = this.checkAndGetMenuAccessDetail('9482D8D2-5FDF-549D-1BC5-FCF9BD5E791B');
    const { err_alert, language, errors, surveydetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled

    return (
      <div className="jbs-page-content">
        <DashboardPageTitle title={<IntlMessages id="surveys.button.editSurvey" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
        {(loading || this.props.menuLoading) && <JbsSectionLoader />}

        {errors.message && <div className="alert_area">
          <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
        </div>}

        <Form>
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
            if (this.state.activeIndex === lang.id) {
              return (
                <TabContainer key={key}>
                  {(menudetail["89673D64-8031-00C8-3A88-D6BAD47B478A"] && menudetail["89673D64-8031-00C8-3A88-D6BAD47B478A"].Visibility === "E925F86B") && //89673D64-8031-00C8-3A88-D6BAD47B478A
                    <FormGroup>
                      <Label><IntlMessages id="surveys.surveyform.label.surveyName" />  ({lang.code})<span className="text-danger">*</span></Label>
                      <Input
                        disabled={(menudetail["89673D64-8031-00C8-3A88-D6BAD47B478A"].AccessRight === "11E6E7B0") ? true : false}
                        type="text"
                        name="surveyName"
                        id="surveyName"
                        maxLength={100}
                        value={surveydetail && surveydetail.locale && surveydetail.locale[lang.code] && surveydetail.locale[lang.code].surveyName}
                        onChange={(e) => this.onUpdateSurveyDetail("surveyName", e.target.value, lang.code)}
                      />
                      {errors && errors[lang.code] && errors[lang.code].surveyName && <span className="text-danger"><IntlMessages id={errors[lang.code].surveyName} /></span>}
                    </FormGroup>}
                </TabContainer>
              );
            }
          })
          }

          {(menudetail["4EBECC2A-36C3-0DD2-9463-EAA895EA9233"] && menudetail["4EBECC2A-36C3-0DD2-9463-EAA895EA9233"].Visibility === "E925F86B") && //4EBECC2A-36C3-0DD2-9463-EAA895EA9233
            <FormGroup>
              <Label><IntlMessages id="surveys.surveyform.label.surveyJson" /><span className="text-danger">*</span></Label>
              <div id="surveyEditorContainer" />
              {errors.surveyJson && <span className="text-danger"><IntlMessages id={errors.surveyJson} /></span>}
            </FormGroup>}

          {(menudetail["9DE246F0-35C7-0FB8-A030-83DA96FB7B9C"] && menudetail["9DE246F0-35C7-0FB8-A030-83DA96FB7B9C"].Visibility === "E925F86B") && //9DE246F0-35C7-0FB8-A030-83DA96FB7B9C
            <FormGroup>
              <Label><IntlMessages id="surveys.surveyform.label.category_id" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["9DE246F0-35C7-0FB8-A030-83DA96FB7B9C"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="category_id" id="category_id" onChange={(e) => this.onUpdateSurveyDetail('category_id', e.target.value)} value={surveydetail.category_id}>
                <IntlMessages id="survey.category.featurevoting">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="survey.category.coinlistvoting">{(selectOption) => <option value="2">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="survey.category.feedback">{(selectOption) => <option value="3">{selectOption}</option>}</IntlMessages>
              </Input>
              {errors.category_id && <span className="text-danger"><IntlMessages id={errors.category_id} /></span>}
            </FormGroup>}

          {(menudetail["753365CD-4480-284A-A308-4BFB2D459EEB"] && menudetail["753365CD-4480-284A-A308-4BFB2D459EEB"].Visibility === "E925F86B") && //753365CD-4480-284A-A308-4BFB2D459EEB
            <FormGroup>
              <Label><IntlMessages id="surveys.surveyform.label.status" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["753365CD-4480-284A-A308-4BFB2D459EEB"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="status" id="status" onChange={(e) => this.onUpdateSurveyDetail('status', e.target.value)} value={surveydetail.status}>
                <IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
              </Input>
              {errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
            </FormGroup>}

          {(menudetail["3357B456-92EA-75DB-5564-EC6AB0440E7D"] && menudetail["3357B456-92EA-75DB-5564-EC6AB0440E7D"].Visibility === "E925F86B") && //3357B456-92EA-75DB-5564-EC6AB0440E7D
            <FormGroup>  { /* Added by Jayesh 22-01-2019  */}
              <Label><IntlMessages id="sidebar.date_created" /> : </Label>
              <Label>{new Date(this.props.surveydata.date_created).toLocaleString()}</Label>
            </FormGroup>}

          {(menudetail["83F3E787-2876-056A-14B4-7F4BD07D5F9F"] && menudetail["83F3E787-2876-056A-14B4-7F4BD07D5F9F"].Visibility === "E925F86B") && //83F3E787-2876-056A-14B4-7F4BD07D5F9F
            <FormGroup>
              <Label><IntlMessages id="sidebar.date_modified" /> : </Label>
              <Label>{new Date(this.props.surveydata.date_modified).toLocaleString()}</Label>
            </FormGroup>}

          {Object.keys(menudetail).length > 0 &&
            <FormGroup>
              <Button
                className="text-white text-bold btn mr-10"
                variant="raised"
                color="primary"
                onClick={() => this.updateSurveyDetail()}
                disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
              >
                <IntlMessages id="button.update" />
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
    surveydetail: surveysReducer.surveydetail,
    updatestatus: surveysReducer.updatestatus,
    localebit: languages.localebit,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  if (typeof surveysReducer.localebit != 'undefined' && surveysReducer.localebit != '') {
    response['localebit'] = surveysReducer.localebit;
  }
  return response;
}

export default withRouter(connect(mapStateToProps, {
  updateSurvey,
  getSurveyById,
  getLanguage,
  getMenuPermissionByID,
})(EditSurvey));