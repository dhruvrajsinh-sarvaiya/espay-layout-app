/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 10-01-2019
    UpdatedDate : 10-01-2019
    Description : Add Help Manual Form
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import $ from 'jquery';
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import JoditEditor from "Components/Joditeditor";
import 'jodit/build/jodit.min.css';
import 'jodit';
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
//Import CRUD Operation For Help Manual Actions...
import { addHelpmanual, getHelpmanualmodules } from 'Actions/HelpManual';
import { getLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { DebounceInput } from 'react-debounce-input';
import { Editor } from "@tinymce/tinymce-react"; // Added By Megha Kariya (18/02/2019)
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
    index: 3
  },
  // Added By Megha Kariya (05-02-2019)
  {
    title: <IntlMessages id="sidebar.help" />,
    link: '',
    index: 2
  },
  {
    title: <IntlMessages id="sidebar.helpmanual" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="help.button.add-manual" />,
    link: '',
    index: 0
  }
];

//Validation for Help Manual Form
const validateHelpManualInput = require('../../../../validation/Help/helpmanual');

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 2 * 3 }}>
      {children}
    </Typography>
  );
}

class AddHelpManual extends Component {

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
      modulelist: [],
      addNewHelpManualDetail: {
        locale:
        {
          en:
          {
            title: "",
            content: "",
          }
        },
        module_id: '',
        status: '1',
        sort_order: '',
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
      loading: false, // loading activity
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      addNewHelpManualDetail: {
        locale:
        {
          en:
          {
            title: "",
            content: "",
          }
        },
        module_id: '',
        status: '1',
        sort_order: '',
        date_created: "",
        date_modified: "",
        created_by: "",
        modified_by: ""
      } // Added by Khushbu Badheka D:30/01/2019
    };
    this.onChangeAddNewHelpManualDetail = this.onChangeAddNewHelpManualDetail.bind(this);
    this.addHelpmanual = this.addHelpmanual.bind(this);
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

  // On Change Add New Help Manual Detail
  onChangeAddNewHelpManualDetail(key, value, lang = '') {
    if (typeof lang != 'undefined' && lang != '') {
      let statusCopy = Object.assign({}, this.state.addNewHelpManualDetail);
      statusCopy.locale[lang][key] = value;
      this.setState(statusCopy);
    }
    else {
      this.setState({
        addNewHelpManualDetail: {
          ...this.state.addNewHelpManualDetail,
          [key]: value
        }
      });
    }
  }

  // Add Help Manual
  addHelpmanual() {
    const { locale, sort_order, module_id, status } = this.state.addNewHelpManualDetail;
    const { errors, isValid } = validateHelpManualInput(this.state.addNewHelpManualDetail);
    this.setState({ err_alert: true, errors: errors, btn_disabled: true });

    if (!isValid) {
      let data = {
        locale,
        module_id,
        sort_order,
        status
      }

      setTimeout(() => {
        this.props.addHelpmanual(data);
        this.setState({ loading: true });
      }, 2000);
    }
    else { // Added By Megha Kariya (08/02/2019)
      this.setState({ btn_disabled: false });
    }
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('DCBFD7FA-3083-0196-640A-E1E5CD481220');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getHelpmanualmodules();
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
            title: "",
            content: ""
          };
        })
      }

      this.state.addNewHelpManualDetail.locale = locale;
      this.setState({
        addNewHelpManualDetail: this.state.addNewHelpManualDetail
      });
    }

    this.setState({
      loading: nextProps.loading,
      language: nextProps.language,
      modulelist: nextProps.help_module_list,
    });
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
    var menudetail = this.checkAndGetMenuAccessDetail('AF20ABA1-A1D1-237D-9D5F-9809B33496B1');
    const { err_alert, activeIndex, language, errors, addNewHelpManualDetail, loading, modulelist, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
    const { drawerClose } = this.props;

    return (
      <div className="jbs-page-content">
        {/* Added By Megha Kariya (05-02-2019) : add close2Level */}
        <DashboardPageTitle title={<IntlMessages id="help.button.add-manual" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
        {(loading || this.props.menuLoading) && <JbsSectionLoader /> }

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
                  {(menudetail["D73AED35-A459-5C6F-017C-A6378D5A78B6"] && menudetail["D73AED35-A459-5C6F-017C-A6378D5A78B6"].Visibility === "E925F86B") && //D73AED35-A459-5C6F-017C-A6378D5A78B6
                    <FormGroup>
                      <Label><IntlMessages id="helpmanual.label.title" />{lang.name}<span className="text-danger">*</span></Label>
                    <DebounceInput
                       readOnly={(menudetail["D73AED35-A459-5C6F-017C-A6378D5A78B6"].AccessRight === "11E6E7B0") ? true : false}
                        minLength={2}
                        debounceTimeout={300}
                        className="form-control"
                        type="text"
                        name="title"
                        id="title"
                        maxLength={150}
                        value={addNewHelpManualDetail.locale[lang.code].title}
                        onChange={(e) => this.onChangeAddNewHelpManualDetail("title", e.target.value, lang.code)}
                      />
                      {errors && errors[lang.code] && errors[lang.code].title && <span className="text-danger"><IntlMessages id={errors[lang.code].title} /></span>}
                    </FormGroup>}

                  {(menudetail["8E0E93AA-063F-8654-5DB2-71FC5BFB2C4F"] && menudetail["8E0E93AA-063F-8654-5DB2-71FC5BFB2C4F"].Visibility === "E925F86B") && //8E0E93AA-063F-8654-5DB2-71FC5BFB2C4F
                    <FormGroup>
                      <Label><IntlMessages id="helpmanual.label.content" /> ({lang.code}) <span className="text-danger">*</span></Label>
                      <Editor
                       disabled={(menudetail["8E0E93AA-063F-8654-5DB2-71FC5BFB2C4F"].AccessRight === "11E6E7B0") ? true : false}
                        init={{
                          height: 500,
                          plugins: 'link image code lists advlist table preview',
                          toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
                          statusbar: false
                        }}
                        value={addNewHelpManualDetail.locale[lang.code].content}
                        onChange={(e) => this.onChangeAddNewHelpManualDetail("content", e.target.getContent(), lang.code)}
                      />
                      {errors && errors[lang.code] && errors[lang.code].content && <span className="text-danger"><IntlMessages id={errors[lang.code].content} /></span>}
                    </FormGroup>}

                  {(menudetail["583355A1-0B7B-9685-1C15-C69C985522F6"] && menudetail["583355A1-0B7B-9685-1C15-C69C985522F6"].Visibility === "E925F86B") && //583355A1-0B7B-9685-1C15-C69C985522F6
                    <FormGroup>
                      <Label><IntlMessages id="sidebar.helpmanualmodule" /><span className="text-danger">*</span></Label>
                      <Input
                        disabled={(menudetail["583355A1-0B7B-9685-1C15-C69C985522F6"].AccessRight === "11E6E7B0") ? true : false}
                        type="select" name="module_id" id="module_id" value={addNewHelpManualDetail.module_id} onChange={(e) => this.onChangeAddNewHelpManualDetail('module_id', e.target.value)}>
                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                        {modulelist.length ? modulelist.map((item, key) => <option key={key} value={item._id}>{item.locale.en.module_name}</option>) : ''}
                      </Input>
                      {errors.module && <span className="text-danger"><IntlMessages id={errors.module} /></span>}
                    </FormGroup>}

                  {(menudetail["458A2051-7BC9-28AA-7633-1AFC446559F9"] && menudetail["458A2051-7BC9-28AA-7633-1AFC446559F9"].Visibility === "E925F86B") && //458A2051-7BC9-28AA-7633-1AFC446559F9
                    <FormGroup>
                      <Label><IntlMessages id="faq.questionform.label.sort_order" /><span className="text-danger">*</span></Label>
                      <Input
                        disabled={(menudetail["458A2051-7BC9-28AA-7633-1AFC446559F9"].AccessRight === "11E6E7B0") ? true : false}
                        minLength={2}
                        debounceTimeout={300}
                        className="form-control"
                        type="number"
                        name="sort_order"
                        id="sort_order"
                        min="0" max="10"
                        value={addNewHelpManualDetail.sort_order}
                        onChange={(e) => this.onChangeAddNewHelpManualDetail('sort_order', e.target.value)}
                      />
                      {errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
                    </FormGroup>}

                  {(menudetail["1C675EFA-02A8-91FF-1C6B-33EDDDF90A30"] && menudetail["1C675EFA-02A8-91FF-1C6B-33EDDDF90A30"].Visibility === "E925F86B") && //1C675EFA-02A8-91FF-1C6B-33EDDDF90A30
                    <FormGroup>
                      <Label><IntlMessages id="faq.questionform.label.status" /><span className="text-danger">*</span></Label>
                      <Input
                        disabled={(menudetail["1C675EFA-02A8-91FF-1C6B-33EDDDF90A30"].AccessRight === "11E6E7B0") ? true : false}
                        type="select" name="status" id="status" onChange={(e) => this.onChangeAddNewHelpManualDetail('status', e.target.value)} value={addNewHelpManualDetail.status}>>
                          <IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                        <IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
                      </Input>
                      {errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
                    </FormGroup>}

                  {(menudetail) &&
                    <FormGroup>
                      <Button
                        className="text-white text-bold btn mr-10"
                        variant="raised"
                        color="primary"
                        onClick={() => this.addHelpmanual()}
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
                </TabContainer>
              );
            }
          })
          }
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ languages, helpmanualmodules, helpmanuals, authTokenRdcer }) => {
  var response = {
    data: helpmanuals.data,
    loading: helpmanuals.loading,
    language: languages.language,
    localebit: languages.localebit,
    help_module_list: helpmanualmodules.help_module_list,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  if (typeof helpmanuals.localebit != 'undefined' && helpmanuals.localebit != '') {
    response['localebit'] = helpmanuals.localebit;
  }
  return response;
}

export default withRouter(connect(mapStateToProps, {
  addHelpmanual, getHelpmanualmodules, getLanguage, getMenuPermissionByID
})(AddHelpManual));
