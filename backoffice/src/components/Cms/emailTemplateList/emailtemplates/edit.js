/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : Edit Survey Form
*/
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import JoditEditor from "Components/Joditeditor";
import 'jodit/build/jodit.min.css';
import 'jodit';

import Button from "@material-ui/core/Button";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

// intl messages
import IntlMessages from "Util/IntlMessages";

import { getEmailTemplateById, updateEmailTemplate, getListTemplates, getListTemplatesbyServiceType } from 'Actions/EmailTemplates';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Editor } from "@tinymce/tinymce-react"; // Added By Megha Kariya (18/02/2019)
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
//Validation for email template Form
const validateForm = require('../../../../validation/EmailTemplates/EmailTemplates');

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
    index: 3
  },
  // Added By Megha Kariya (05-02-2019)
  {
    title: <IntlMessages id="sidebar.templates" />,
    link: '',
    index: 2
  },
  {
    title: <IntlMessages id="sidebar.templatesList" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.editTemplate" />,
    link: '',
    index: 0
  }
];

class EditEmailTemplate extends Component {
  constructor(props) {
    super(props);

    // default ui local state
    this.state = {
      loading: false, // loading activity
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      templateType_list: [],
      templatedetail: {
        templateId: "",
        templateName: "",
        templateType: "",
        Content: "",
        AdditionalInfo: "",
        CommServiceTypeID: "",
        status: ""
      },
      paramDetails: [],
      selectedParameters: null,
      addParameterModal: false,
      dataloaded: 0,
      fieldList: {},
      menudetail: [],
      Pflag: true,
    };
    this.initState = {
      loading: false, // loading activity  Added by Jayesh 22-01-2019 for drowerclose issue
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      dataloaded: 0,
      templatedetail: {
        templateId: "",
        templateName: "",
        templateType: "",
        Content: "",
        AdditionalInfo: "",
        CommServiceTypeID: "",
        status: ""
      }
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

  /**
	 * Open Show Parameters
	 */
  openParameterModal(data) {
    this.setState({ addParameterModal: true, selectedParameters: data });
  }

  //On Update Survey Details
  onUpdateEmailTemplatesDetail(key, value) {
    if (key == 'CommServiceTypeID') {
      this.setState({ templateType_list: [] });
      this.props.getListTemplatesbyServiceType(value);
    }
    this.setState({
      templatedetail: {
        ...this.state.templatedetail,
        [key]: value
      }
    });
  }

  //Update Survey Detail
  updateEmailTemplatesDetail() {

    let data = {
      ID: this.state.templatedetail.templateId,
      CommServiceTypeID: this.state.templatedetail.CommServiceTypeID,
      TemplateName: this.state.templatedetail.templateName,
      TemplateID: this.state.templatedetail.templateType,
      AdditionalInfo: this.state.templatedetail.AdditionalInfo,
      Content: this.state.templatedetail.Content
    }

    const { errors, isValid } = validateForm.validateUpdateEmailTemplateformInput(data);
    this.setState({ errors: errors, err_alert: true, btn_disabled: true }); // Added By Megha Kariya (08/02/2019) : add btn_disabled

    if (!isValid) {
      setTimeout(() => {
        this.props.updateEmailTemplate(data);
      }, 2000);
    }
    else { // Added By Megha Kariya (08/02/2019)
      this.setState({ btn_disabled: false });
    }

  }

  componentWillMount() {
    this.props.getMenuPermissionByID('305DB39B-374F-84DE-6787-729783761922');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        let ID = this.props.templatesdata.ID;
        if (ID != '') {
          this.props.getEmailTemplateById(ID);
          this.props.getListTemplates();
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

    if (typeof nextProps.data != 'undefined' && nextProps.data.ReturnCode == 1) { //getlist fail
      if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.data.errors,
        btn_disabled: false // Added By Megha Kariya (08/02/2019)
      });
    }

    if (typeof nextProps.templateType_list != 'undefined' && nextProps.templateType_list.length > 0) {
      this.setState({ templateType_list: nextProps.templateType_list, loading: nextProps.loading });
    }

    if (typeof nextProps.templatedetail != 'undefined' && nextProps.templatedetail != '' && this.state.dataloaded == 0) {
      this.setState({
        templatedetail: {
          templateId: nextProps.templatedetail.ID,
          templateName: nextProps.templatedetail.TemplateName,
          templateType: nextProps.templatedetail.TemplateID,
          Content: nextProps.templatedetail.Content,
          AdditionalInfo: nextProps.templatedetail.AdditionalInfo,
          CommServiceTypeID: nextProps.templatedetail.CommServiceTypeID,
          Status: nextProps.templatedetail.Status,
        },
        paramDetails: nextProps.templatedetail.ParameterInfo
      });
      this.setState({ dataloaded: 1 });
      this.props.getListTemplatesbyServiceType(nextProps.templatedetail.CommServiceTypeID);
    }

    if (typeof nextProps.data != 'undefined' && nextProps.data.ReturnCode == 0) {
      this.setState({ err_msg: '', err_alert: false });
      this.resetData();
      this.props.reload();
    }
    this.setState({ loading: nextProps.loading });
  }

  closeAll = () => {
    this.setState(this.initState);
    this.props.closeAll();
    this.setState({ open: false });
  }

  // Added By Megha Kariya (05-02-2019)  
  close2Level = () => {
    this.props.close2Level();
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
            return response = fieldList;
          }
        }
      }
    } else {
      return response;
    }
  }

  render() {
    var menudetail = this.checkAndGetMenuAccessDetail('C0ABA788-7E79-8CA8-A0B7-40530B6D237C');
    const { err_alert, err_msg, errors, templatedetail, loading, paramDetails, selectedParameters, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
    const { drawerClose } = this.props;

    return (
      <div className="jbs-page-content">
        {/* Added By Megha Kariya (05-02-2019) : add close2Level */}
        <DashboardPageTitle title={<IntlMessages id="emailtemplate.button.editTemplate" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
        {(loading || this.props.menuLoading) && <JbsSectionLoader />}

        {errors.message && <div className="alert_area">
          <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
        </div>}

        <Form className="tradefrm">
          {(menudetail["CE1429D1-19F3-7233-7F2A-4793CA666AFD"] && menudetail["CE1429D1-19F3-7233-7F2A-4793CA666AFD"].Visibility === "E925F86B") && //CE1429D1-19F3-7233-7F2A-4793CA666AFD
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.commServiceType" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["CE1429D1-19F3-7233-7F2A-4793CA666AFD"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="CommServiceTypeID" id="CommServiceTypeID" onChange={(e) => this.onUpdateEmailTemplatesDetail('CommServiceTypeID', e.target.value)} value={templatedetail.CommServiceTypeID}>>
                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="template.templatetype.sms">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="template.templatetype.email">{(selectOption) => <option value="2">{selectOption}</option>}</IntlMessages>
              </Input>
              {errors.CommServiceTypeID && <span className="text-danger"><IntlMessages id={errors.CommServiceTypeID} /></span>}
            </FormGroup>}

          {(menudetail["68BC930E-82B5-15EA-6DB4-FC013FA11B47"] && menudetail["68BC930E-82B5-15EA-6DB4-FC013FA11B47"].Visibility === "E925F86B") && //68BC930E-82B5-15EA-6DB4-FC013FA11B47
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.templateType" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["68BC930E-82B5-15EA-6DB4-FC013FA11B47"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="templateType" value={templatedetail.templateType} id="templateType" onChange={(e) => this.onUpdateEmailTemplatesDetail('templateType', e.target.value)}>
                <IntlMessages id="traderecon.list.selectall">
                  {(select) =>
                    <option value="select one">{select}</option>
                  }
                </IntlMessages>
                {this.state.templateType_list.map((template, key) =>
                  <option key={key} value={template.Key}>{template.Value}</option>
                )}
              </Input>
              {errors.templateType && <span className="text-danger"><IntlMessages id={errors.templateType} /></span>}
            </FormGroup>}

          {(menudetail["F0FA6499-A23B-A29C-12C3-6A7C13C450EA"] && menudetail["F0FA6499-A23B-A29C-12C3-6A7C13C450EA"].Visibility === "E925F86B") && //F0FA6499-A23B-A29C-12C3-6A7C13C450EA
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.templateName" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["F0FA6499-A23B-A29C-12C3-6A7C13C450EA"].AccessRight === "11E6E7B0") ? true : false}
                type="text"
                name="templateName"
                id="templateName"
                min="0" max="10"
                maxLength={30}
                value={templatedetail.templateName}
                onChange={(e) => this.onUpdateEmailTemplatesDetail('templateName', e.target.value)}
              />
              {errors.templateName && <span className="text-danger"><IntlMessages id={errors.templateName} /></span>}
            </FormGroup>}

          {(menudetail["96B8DFFA-97D4-8CF0-9548-13C8DEB07BB3"] && menudetail["96B8DFFA-97D4-8CF0-9548-13C8DEB07BB3"].Visibility === "E925F86B") && //96B8DFFA-97D4-8CF0-9548-13C8DEB07BB3
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.subject" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["96B8DFFA-97D4-8CF0-9548-13C8DEB07BB3"].AccessRight === "11E6E7B0") ? true : false}
                type="text"
                name="AdditionalInfo"
                id="AdditionalInfo"
                min="0" max="10"
                value={templatedetail.AdditionalInfo}
                onChange={(e) => this.onUpdateEmailTemplatesDetail('AdditionalInfo', e.target.value)}
              />
              {errors.AdditionalInfo && <span className="text-danger"><IntlMessages id={errors.AdditionalInfo} /></span>}
            </FormGroup>}

          {(menudetail["569DFB33-8DD0-A502-0303-80C43B152522"] && menudetail["569DFB33-8DD0-A502-0303-80C43B152522"].Visibility === "E925F86B") && //569DFB33-8DD0-A502-0303-80C43B152522
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.content" /> <span className="text-danger">*</span><a href="javascript:void(0)" onClick={() => this.openParameterModal(paramDetails)} color="primary" className="caret btn-sm mr-10"><IntlMessages id="emailtemplate.form.lable.showparameters" /></a></Label>
              <Editor
                disabled={(menudetail["569DFB33-8DD0-A502-0303-80C43B152522"].AccessRight === "11E6E7B0") ? true : false}
                init={{
                  height: 500,
                  plugins: 'link image code lists advlist table preview',
                  toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
                  statusbar: false
                }}
                value={templatedetail.Content}
                onChange={(e) => this.onUpdateEmailTemplatesDetail("Content", e.target.getContent())}
              />
              {errors && errors.Content && <span className="text-danger"><IntlMessages id={errors.Content} /></span>}
            </FormGroup>}

          <FormGroup>
            <Label><IntlMessages id="emailtemplate.form.lable.status" /> : </Label>
            <Label>{templatedetail.Status === 1 ? (
              <IntlMessages id="global.form.status.active" />
            ) : (
                <IntlMessages id="global.form.status.inactive" />
              )}</Label>
          </FormGroup>

          {menudetail &&
            <FormGroup>
              <Button
                className="text-white text-bold btn mr-10"
                variant="raised"
                color="primary"
                onClick={() => this.updateEmailTemplatesDetail()}
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

        <Dialog
          onClose={() => this.setState({ addParameterModal: false })}
          open={this.state.addParameterModal}
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogContent>
            {selectedParameters && selectedParameters !== null &&
              <div>
                <div className="clearfix d-flex">
                  <div className="media pull-left">
                    <div className="media-body">
                      {selectedParameters.map((params, key) => {
                        return [
                          <Row key={key}>
                            <Col md={6}><span className="fw-bold">{params.Name}:</span></Col>
                            <Col md={6}>{params.Aliasname}</Col>
                          </Row>
                        ]
                      })}
                    </div>
                  </div>
                </div>
              </div>
            }
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({ emailtemplatesReducer, authTokenRdcer }) => {
  var response = {
    data: emailtemplatesReducer.data,
    loading: emailtemplatesReducer.loading,
    templatedetail: emailtemplatesReducer.templatedetail.TemplateMasterObj,
    templateType_list: emailtemplatesReducer.templates_listing,
    updatestatus: emailtemplatesReducer.updatestatus,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };

  return response;
}

export default withRouter(connect(mapStateToProps, {
  updateEmailTemplate,
  getEmailTemplateById,
  getListTemplates,
  getListTemplatesbyServiceType,
  getMenuPermissionByID,
})(EditEmailTemplate));