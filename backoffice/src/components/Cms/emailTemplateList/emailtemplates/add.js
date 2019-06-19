/* 
    Createdby : dhara gajera
    CreatedDate : 01-12-2018
    Description : Add email template Form
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert, Row, Col } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import JoditEditor from "Components/Joditeditor";
import 'jodit/build/jodit.min.css';
import 'jodit';

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

//Import CRUD Operation For email template Actions...
import { getListTemplates, addNewEmailTemplate, getEmailTemplatesParameters, getListTemplatesbyServiceType } from 'Actions/EmailTemplates';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../../DashboardPageTitle';
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
    title: <IntlMessages id="sidebar.addTemplate" />,
    link: '',
    index: 0
  }
];

class AddEmailTemplate extends Component {

  constructor(props) {
    super(props);

    // default ui local state
    this.state = {
      loading: false, // loading activity
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      showErrorStatus: false,
      showSuccessStatus: false,
      responseMessage: "",
      templateType_list: [],
      addEmailTemplateDetail: { templateName: "", templateType: "", Content: "", AdditionalInfo: "", CommServiceTypeID: "" },
      addParameterModal: false,
      selectedParameters: null,
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
      showErrorStatus: false,
      showSuccessStatus: false,
      responseMessage: "",
      // Added By Megha Kariya (04/02/2019)
      addEmailTemplateDetail: { templateName: "", templateType: "", Content: "", AdditionalInfo: "", CommServiceTypeID: "" },
    };
    this.onChangeAddEmailTemplateDetails = this.onChangeAddEmailTemplateDetails.bind(this);
    this.addEmailTemplateDetail = this.addEmailTemplateDetail.bind(this);
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
  openParameterModal() {
    this.setState({ addParameterModal: true });
  }

  // On Change Add template Details
  onChangeAddEmailTemplateDetails(key, value) {
    if (key == 'CommServiceTypeID') {
      this.setState({ templateType_list: [] });
      this.props.getListTemplatesbyServiceType(value);
    }

    this.setState({
      addEmailTemplateDetail: {
        ...this.state.addEmailTemplateDetail,
        [key]: value
      }
    });
  }
  handleChangePair = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  //Add template Detail
  addEmailTemplateDetail() {
    const { CommServiceTypeID, templateName, templateType, Content, AdditionalInfo } = this.state.addEmailTemplateDetail;
    const { errors, isValid } = validateForm.validateNewEmailTemplateformInput(this.state.addEmailTemplateDetail);
    this.setState({ err_alert: true, errors: errors, btn_disabled: true });

    if (!isValid) {
      let data = {
        CommServiceTypeID,
        TemplateName: templateName,
        TemplateID: templateType,
        Content,
        AdditionalInfo
      }
      setTimeout(() => {
        this.props.addNewEmailTemplate(data);
        this.setState({ loading: true });
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
        this.props.getListTemplates();
        this.props.getEmailTemplatesParameters();
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

    if (typeof nextProps.data != 'undefined' && nextProps.data.ReturnCode == 0) {
      this.setState({ err_msg: '', err_alert: false });
      //this.props.drawerClose();
      this.resetData();
      this.props.reload();
    }

    if (typeof nextProps.templateType_list != 'undefined' && nextProps.templateType_list.length > 0) {
      this.setState({ templateType_list: nextProps.templateType_list, loading: nextProps.loading });
    }

    if (typeof nextProps.parameters_list != 'undefined' && nextProps.parameters_list.length > 0) {

      let selectedParams = [];
      nextProps.parameters_list.forEach(parmas => {

        if (typeof parmas.ParameterInfo != 'undefined' && parmas.ParameterInfo.length > 0) {
          parmas.ParameterInfo.forEach(element => {
            selectedParams.push({ Name: element.Name, Aliasname: element.Aliasname });
          });
        }

      });

      this.setState({ selectedParameters: selectedParams, loading: nextProps.loading });
    }

  }

  closeAll = () => {
    this.setState(this.initState);
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
    var menudetail = this.checkAndGetMenuAccessDetail('168D6B65-96E7-8427-89D1-08E535726811');
    const { err_alert, errors, addEmailTemplateDetail, loading, selectedParameters, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
    const { drawerClose } = this.props;

    return (
      <div className="jbs-page-content">
        {/* Added By Megha Kariya (05-02-2019) : add close2Level */}
        <DashboardPageTitle title={<IntlMessages id="emailtemplate.button.addTemplate" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
        {(loading || this.props.menuLoading) && <JbsSectionLoader />}

        {errors.message && <div className="alert_area">
          <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
        </div>}
        <Alert color="danger" isOpen={this.state.showErrorStatus} toggle={(e) => this.setState({ showErrorStatus: false })}>
          {this.state.responseMessageForList}
        </Alert>
        <Alert color="success" isOpen={this.state.showSuccessStatus} toggle={(e) => this.setState({ showSuccessStatus: false })}>
          {this.state.responseMessageForList}
        </Alert>

        <Form className="tradefrm">
          {(menudetail["CF0250C8-2E00-9914-7A52-E5750D030E8C"] && menudetail["CF0250C8-2E00-9914-7A52-E5750D030E8C"].Visibility === "E925F86B") && //CF0250C8-2E00-9914-7A52-E5750D030E8C
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.commServiceType" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["CF0250C8-2E00-9914-7A52-E5750D030E8C"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="CommServiceTypeID" id="CommServiceTypeID" onChange={(e) => this.onChangeAddEmailTemplateDetails('CommServiceTypeID', e.target.value)} value={addEmailTemplateDetail.CommServiceTypeID}>>
                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="template.templatetype.sms">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="template.templatetype.email">{(selectOption) => <option value="2">{selectOption}</option>}</IntlMessages>
              </Input>
              {errors.CommServiceTypeID && <span className="text-danger"><IntlMessages id={errors.CommServiceTypeID} /></span>}
            </FormGroup>}

          {(menudetail["88AA2BBC-6062-41F4-2EC4-408A95974556"] && menudetail["88AA2BBC-6062-41F4-2EC4-408A95974556"].Visibility === "E925F86B") && //88AA2BBC-6062-41F4-2EC4-408A95974556
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.templateType" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["88AA2BBC-6062-41F4-2EC4-408A95974556"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="templateType" value={addEmailTemplateDetail.templateType} id="templateType" onChange={(e) => this.onChangeAddEmailTemplateDetails('templateType', e.target.value)}>
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

          {(menudetail["344BBD8C-4C8C-9CCA-59A0-389927695A05"] && menudetail["344BBD8C-4C8C-9CCA-59A0-389927695A05"].Visibility === "E925F86B") && //344BBD8C-4C8C-9CCA-59A0-389927695A05
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.templateName" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["344BBD8C-4C8C-9CCA-59A0-389927695A05"].AccessRight === "11E6E7B0") ? true : false}
                type="text"
                name="templateName"
                id="templateName"
                min="0" max="10"
                maxLength={30}
                value={addEmailTemplateDetail.templateName}
                onChange={(e) => this.onChangeAddEmailTemplateDetails('templateName', e.target.value)}
              />
              {errors.templateName && <span className="text-danger"><IntlMessages id={errors.templateName} /></span>}
            </FormGroup>}

          {(menudetail["B4FD39FB-5F35-2256-9B4B-0242066D6F18"] && menudetail["B4FD39FB-5F35-2256-9B4B-0242066D6F18"].Visibility === "E925F86B") && //B4FD39FB-5F35-2256-9B4B-0242066D6F18
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.subject" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["B4FD39FB-5F35-2256-9B4B-0242066D6F18"].AccessRight === "11E6E7B0") ? true : false}
                type="text"
                name="AdditionalInfo"
                id="AdditionalInfo"
                min="0" max="10"
                value={addEmailTemplateDetail.AdditionalInfo}
                onChange={(e) => this.onChangeAddEmailTemplateDetails('AdditionalInfo', e.target.value)}
              />
              {errors.AdditionalInfo && <span className="text-danger"><IntlMessages id={errors.AdditionalInfo} /></span>}
            </FormGroup>}

          {(menudetail["2FC67A9D-847C-2E10-4123-02CF0BDD5752"] && menudetail["2FC67A9D-847C-2E10-4123-02CF0BDD5752"].Visibility === "E925F86B") && //2FC67A9D-847C-2E10-4123-02CF0BDD5752
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.content" /> <span className="text-danger">*</span>  <a href="javascript:void(0)" onClick={() => this.openParameterModal()} color="primary" className="caret btn-sm mr-10"><IntlMessages id="emailtemplate.form.lable.showparameters" /></a></Label>
              <Editor
                disabled={(menudetail["2FC67A9D-847C-2E10-4123-02CF0BDD5752"].AccessRight === "11E6E7B0") ? true : false}
                init={{
                  height: 500,
                  plugins: 'link image code lists advlist table preview',
                  toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
                  statusbar: false
                }}
                value={addEmailTemplateDetail.Content}
                onChange={(e) => this.onChangeAddEmailTemplateDetails("Content", e.target.getContent())}
              />
              {errors && errors.Content && <span className="text-danger"><IntlMessages id={errors.Content} /></span>}
            </FormGroup>}

          {menudetail &&
            <FormGroup>
              <Button
                className="text-white text-bold btn mr-10"
                variant="raised"
                color="primary"
                onClick={() => this.addEmailTemplateDetail()}
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

        <Dialog
          onClose={() => this.setState({ addParameterModal: false })}
          open={this.state.addParameterModal}
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogContent>
            {selectedParameters !== null &&
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
    template_list: emailtemplatesReducer.templates_list,
    //templateType_list_all:emailtemplatesReducer.templates_listing.Result,
    parameters_list: emailtemplatesReducer.parameters_list.templateParameterInfoList,
    templateType_list: emailtemplatesReducer.templates_listing,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
}

export default withRouter(connect(mapStateToProps, {
  addNewEmailTemplate,
  getListTemplates,
  getEmailTemplatesParameters,
  getListTemplatesbyServiceType,
  getMenuPermissionByID,
})(AddEmailTemplate));
