/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 10-01-2019
    UpdatedDate : 10-01-2019
    Description : Update Help Manual Form
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

import { getHelpmanualById, updateHelpmanual, getHelpmanualmodules } from 'Actions/HelpManual';
import { getLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { DebounceInput } from 'react-debounce-input';
import { Editor } from "@tinymce/tinymce-react"; // Added By Megha Kariya (18/02/2019)
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
    title: <IntlMessages id="sidebar.editHelpManual" />,
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

class EditHelpManual extends Component {

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
      helpmanualdetail: {
        manual_id: "",
        locale: {
          en: {
            title: "",
            content: "",
          }
        },
        module_id: '',
        sort_order: "",
        status: "1",
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
      btn_disabled: false
    };
    this.onUpdateHelpManualDetail = this.onUpdateHelpManualDetail.bind(this);
    this.updateHelpManual = this.updateHelpManual.bind(this);
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

  // On Update Help Manual Detail
  onUpdateHelpManualDetail(key, value, lang = '') {
    if (lang != '') {
      let statusCopy = Object.assign({}, this.state.helpmanualdetail);
      statusCopy.locale[lang][key] = value;
      this.setState(statusCopy);
    }
    else {
      this.setState({
        helpmanualdetail: {
          ...this.state.helpmanualdetail,
          [key]: value
        }
      });
    }
  }

  // Update Help Manual
  updateHelpManual() {
    const { locale, sort_order, module_id, status } = this.state.helpmanualdetail;
    const { errors, isValid } = validateHelpManualInput(this.state.helpmanualdetail);
    this.setState({ err_alert: true, errors: errors, btn_disabled: true });

    if (!isValid) {
      let data = {
        id: this.state.helpmanualdetail._id,
        manual_id: this.state.helpmanualdetail.manual_id,
        locale,
        module_id,
        sort_order,
        status
      }
      setTimeout(() => {
        this.props.updateHelpmanual(data);
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
        let ManualId = this.props.manualdata._id;
        if (ManualId != '') {
          this.props.getLanguage();
          this.props.getHelpmanualmodules();
          this.props.getHelpmanualById(ManualId);
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

    if (typeof nextProps.localebit != 'undefined' && nextProps.localebit != '' && nextProps.localebit == 1) {
      const locale = {};
      
      nextProps.language && nextProps.language.map((lang, key) => {
        locale[lang.code] = {
          title: "",
          content: ""
        };
      })
      
      var newObj = Object.assign({}, this.state.helpmanualdetail);
      newObj['locale'] = locale;
      this.setState({ helpmanualdetail: newObj })
          
    }

    if (typeof nextProps.manualdata != 'undefined' && typeof nextProps.manualdata.locale != 'undefined' && nextProps.manualdata != '') {
      const newlocale = {};
      {
        nextProps.language && nextProps.language.map((lang, key) => {

          newlocale[lang.code] = {
            title: nextProps.manualdata.locale[lang.code] && nextProps.manualdata.locale[lang.code].title ? nextProps.manualdata.locale[lang.code].title : '',
            content: nextProps.manualdata.locale[lang.code] && nextProps.manualdata.locale[lang.code].content ? nextProps.manualdata.locale[lang.code].content : '',
          };
        })
      }




			let newObject = Object.assign({}, this.state.helpmanualdetail);
			newObject['locale'] = newlocale;
      newObject['_id'] = nextProps.manualdata._id;
      newObject['manual_id'] = nextProps.manualdata.manual_id;
			newObject['sort_order'] = nextProps.manualdata.sort_order;
			newObject['status'] = nextProps.manualdata.status + '';
			newObject['module_id'] =nextProps.manualdata.module_id._id ? nextProps.manualdata.module_id._id : this.state.helpmanualdetail.module_id;
			this.setState({ helpmanualdetail: newObject });
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
            response = fieldList;
          }
        }
      }
    }
    return response;
  }

  render() {
    var menudetail = this.checkAndGetMenuAccessDetail('3173EB69-5F65-1965-3CF3-DB9E5D072686');

    const { err_alert, language, errors, helpmanualdetail, loading, modulelist, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
    return (
      <div className="jbs-page-content">
        {/* Added By Megha Kariya (05-02-2019) : add close2Level */}
        <DashboardPageTitle title={<IntlMessages id="sidebar.editHelpManual" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
                  {(menudetail["16AA2D52-5974-3758-41D4-4C6D07276CF2"] && menudetail["16AA2D52-5974-3758-41D4-4C6D07276CF2"].Visibility === "E925F86B") && //16AA2D52-5974-3758-41D4-4C6D07276CF2
                    <FormGroup>
                      <Label><IntlMessages id="helpmanual.label.title" />{lang.name}<span className="text-danger">*</span></Label>
                      <DebounceInput
                        readOnly={(menudetail["16AA2D52-5974-3758-41D4-4C6D07276CF2"].AccessRight === "11E6E7B0") ? true : false}
                        minLength={0}
                        debounceTimeout={300}
                        className="form-control"
                        type="text"
                        name="title"
                        id="title"
                        maxLength={150}
                        value={helpmanualdetail && helpmanualdetail.locale && helpmanualdetail.locale[lang.code] && helpmanualdetail.locale[lang.code].title}
                        onChange={(e) => this.onUpdateHelpManualDetail("title", e.target.value, lang.code)}
                      />
                      {errors && errors[lang.code] && errors[lang.code].title && <span className="text-danger"><IntlMessages id={errors[lang.code].title} /></span>}
                    </FormGroup>}

                  {(menudetail["609AF348-47A1-91FC-7B75-29DACAA65BAB"] && menudetail["609AF348-47A1-91FC-7B75-29DACAA65BAB"].Visibility === "E925F86B") && //609AF348-47A1-91FC-7B75-29DACAA65BAB
                    <FormGroup>
                      <Label><IntlMessages id="helpmanual.label.content" /> ({lang.code}) <span className="text-danger">*</span></Label>
                      <Editor
                        disabled={(menudetail["609AF348-47A1-91FC-7B75-29DACAA65BAB"].AccessRight === "11E6E7B0") ? true : false}
                        init={{
                          height: 500,
                          plugins: 'link image code lists advlist table preview',
                          toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
                          statusbar: false
                        }}
                        value={helpmanualdetail && helpmanualdetail.locale && helpmanualdetail.locale[lang.code] && helpmanualdetail.locale[lang.code].content}
                        onChange={(e) => this.onUpdateHelpManualDetail("content", e.target.getContent(), lang.code)}
                      />
                      {errors && errors[lang.code] && errors[lang.code].content && <span className="text-danger"><IntlMessages id={errors[lang.code].content} /></span>}
                    </FormGroup>}

                  {(menudetail["3178A234-42C2-335F-6E78-A7636E2D15F9"] && menudetail["3178A234-42C2-335F-6E78-A7636E2D15F9"].Visibility === "E925F86B") && //3178A234-42C2-335F-6E78-A7636E2D15F9
                    <FormGroup>
                      <Label><IntlMessages id="sidebar.helpmanualmodule" /></Label>
                      <Input
                        disabled={(menudetail["3178A234-42C2-335F-6E78-A7636E2D15F9"].AccessRight === "11E6E7B0") ? true : false}
                        type="select" name="module_id" id="module_id"
                        value={helpmanualdetail.module_id}
                        onChange={(e) => this.onUpdateHelpManualDetail('module_id', e.target.value)}
                      >
                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                        {modulelist.length ? modulelist.map((item, idxKey) => <option key={idxKey} value={item._id}>{item.locale.en.module_name}</option>) : ''}
                      </Input>
                    </FormGroup>}

                  {(menudetail["32118D1A-5F20-1B6D-75B6-709084F20E1F"] && menudetail["32118D1A-5F20-1B6D-75B6-709084F20E1F"].Visibility === "E925F86B") && //32118D1A-5F20-1B6D-75B6-709084F20E1F
                    <FormGroup>
                      <Label><IntlMessages id="faq.questionform.label.sort_order" /><span className="text-danger">*</span></Label>
                      <Input
                        disabled={(menudetail["32118D1A-5F20-1B6D-75B6-709084F20E1F"].AccessRight === "11E6E7B0") ? true : false}
                        minLength={2}
                        debounceTimeout={300}
                        className="form-control"
                        type="number"
                        name="sort_order"
                        id="sort_order"
                        min="0" max="10"
                        value={helpmanualdetail.sort_order}
                        onChange={(e) => this.onUpdateHelpManualDetail('sort_order', e.target.value)}
                      />
                      {errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
                    </FormGroup>}

                  {(menudetail["6AEC75CB-3B91-3468-229A-FC211F7D6C05"] && menudetail["6AEC75CB-3B91-3468-229A-FC211F7D6C05"].Visibility === "E925F86B") && //6AEC75CB-3B91-3468-229A-FC211F7D6C05
                    <FormGroup>
                      <Label><IntlMessages id="faq.questionform.label.status" /><span className="text-danger">*</span></Label>
                      <Input
                        disabled={(menudetail["6AEC75CB-3B91-3468-229A-FC211F7D6C05"].AccessRight === "11E6E7B0") ? true : false}
                        type="select" name="status" id="status" onChange={(e) => this.onUpdateHelpManualDetail('status', e.target.value)} value={helpmanualdetail.status}>>
                        <IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                        <IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
                      </Input>
                      {errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
                    </FormGroup>}

                  {(menudetail["E7C834BE-5F75-1212-8386-519045BF1593"] && menudetail["E7C834BE-5F75-1212-8386-519045BF1593"].Visibility === "E925F86B") && //E7C834BE-5F75-1212-8386-519045BF1593
                    <FormGroup>  { /* Added by Jayesh 22-01-2019  */}
                      <Label><IntlMessages id="sidebar.date_created" /> : </Label>
                      <Label>{new Date(this.props.manualdata.date_created).toLocaleString()}</Label>
                    </FormGroup>}

                  {(menudetail["E65986E9-4034-40A9-4355-053BCC031846"] && menudetail["E65986E9-4034-40A9-4355-053BCC031846"].Visibility === "E925F86B") && //E65986E9-4034-40A9-4355-053BCC031846
                    <FormGroup>
                      <Label><IntlMessages id="sidebar.date_modified" /> : </Label>
                      <Label>{new Date(this.props.manualdata.date_modified).toLocaleString()}</Label>
                    </FormGroup>}

                  {Object.keys(menudetail).length > 0 &&
                    <FormGroup>
                      <Button
                        className="text-white text-bold btn mr-10"
                        variant="raised"
                        color="primary"
                        onClick={() => this.updateHelpManual()}
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
    helpmanualdetail: helpmanuals.helpmanualdetail,
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
  getHelpmanualById, updateHelpmanual, getHelpmanualmodules, getLanguage, getMenuPermissionByID
})(EditHelpManual));