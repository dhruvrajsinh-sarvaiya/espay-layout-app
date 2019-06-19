/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 04-10-2018
    UpdatedDate : 17-10-2018
    Description : Update News Form
*/
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import $ from 'jquery';
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import JoditEditor from "Components/Joditeditor";
import 'jodit/build/jodit.min.css';
import 'jodit';
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { getNewsById, updateNews } from 'Actions/News';
import { getLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../DashboardPageTitle';
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
    index: 2
  },
  {
    title: <IntlMessages id="sidebar.news" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.editNews" />,
    link: '',
    index: 0
  }
];
//Validation for News Form
const validateNewsformInput = require('../../../validation/News/news');

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 2 * 3 }}>
      {children}
    </Typography>
  );
}

class EditNews extends Component {

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
      newsdetail: {
        newsid: "",
        locale: {
          en: {
            title: "",
            content: ""
          }
        },
        sort_order: "",
        type: 1, //1= News, 2=Announcement
        status: 1,
        from_date: "",
        to_date: "",
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
    this.onUpdateNewsDetail = this.onUpdateNewsDetail.bind(this);
    this.updateNewsDetail = this.updateNewsDetail.bind(this);
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

  //On Update News Details
  onUpdateNewsDetail(key, value, lang = '') {
    if (typeof lang != 'undefined' && lang != '') {
      let statusCopy = Object.assign({}, this.state.newsdetail);
      statusCopy.locale[lang][key] = value;
      this.setState(statusCopy);
    }
    else {
      this.setState({
        newsdetail: {
          ...this.state.newsdetail,
          [key]: value
        }
      });
    }
  }

  //Update News Detail
  updateNewsDetail() {
    const { locale, sort_order, status, type, from_date, to_date } = this.state.newsdetail;
    const { errors, isValid } = validateNewsformInput(this.state.newsdetail);
    this.setState({ err_alert: true, errors: errors, btn_disabled: true });

    if (!isValid) {
      let data = {
        id: this.state.newsdetail._id,
        newsid: this.state.newsdetail.newsid,
        locale,
        sort_order,
        type,
        status,
        from_date,
        to_date
      }
      this.setState({ loading: true });
      setTimeout(() => {
        this.props.updateNews(data);
      }, 2000);
    }
    else { // Added By Megha Kariya (08/02/2019)
      this.setState({ btn_disabled: false });
    }
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('7461A5F0-A583-70E7-3F0E-346293322F01');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        let NewsId = this.props.newsdata._id;
        if (NewsId != '') {
          this.props.getLanguage();
          this.props.getNewsById(NewsId);
        } else {
          //this.props.drawerClose();
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
            content: "",
          };
        })
      }
      this.state.newsdetail.locale = locale;
      this.setState({
        newsdetail: this.state.newsdetail
      });
    }

    if (typeof nextProps.newsdata != 'undefined' && typeof nextProps.newsdata.locale != 'undefined' && nextProps.newsdata != '') {
      const newlocale = {};
      {
        nextProps.language && nextProps.language.map((lang, key) => {

          newlocale[lang.code] = {
            title: nextProps.newsdata.locale[lang.code] && nextProps.newsdata.locale[lang.code].title ? nextProps.newsdata.locale[lang.code].title : '',
            content: nextProps.newsdata.locale[lang.code] && nextProps.newsdata.locale[lang.code].content ? nextProps.newsdata.locale[lang.code].content : '',
          };
        })
      }

      this.state.newsdetail.locale = newlocale;
      this.state.newsdetail._id = nextProps.newsdata._id;
      this.state.newsdetail.newsid = nextProps.newsdata.newsid;
      this.state.newsdetail.sort_order = nextProps.newsdata.sort_order;
      //Added by Meghaben 29-01-2019
      this.state.newsdetail.status = nextProps.newsdata.status + '';
      this.state.newsdetail.type = nextProps.newsdata.type ? nextProps.newsdata.type : this.state.newsdetail.type;
      this.state.newsdetail.from_date = nextProps.newsdata.from_date;
      this.state.newsdetail.to_date = nextProps.newsdata.to_date;
      this.setState({
        newsdetail: this.state.newsdetail
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
    var menudetail = this.checkAndGetMenuAccessDetail('14E60CF9-A7AB-9981-3B3C-2748714C8ADE');
    const { err_alert, err_msg, activeIndex, language, errors, newsdetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
    const { drawerClose } = this.props;

    return (
      <div className="jbs-page-content">
        <DashboardPageTitle title={<IntlMessages id="news.title.edit-News" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
                  {(menudetail["FECC79D0-97C0-2E92-245F-670A06929E8C"] && menudetail["FECC79D0-97C0-2E92-245F-670A06929E8C"].Visibility === "E925F86B") && //FECC79D0-97C0-2E92-245F-670A06929E8C
                    <FormGroup>
                      <Label><IntlMessages id="news.form.label.title" /> ({lang.code}) <span className="text-danger">*</span></Label>
                      <DebounceInput
                        readOnly={(menudetail["FECC79D0-97C0-2E92-245F-670A06929E8C"].AccessRight === "11E6E7B0") ? true : false}
                        minLength={0}
                        debounceTimeout={300}
                        className="form-control"
                        type="text"
                        name="title"
                        id="title"
                        maxLength={200}
                        value={newsdetail && newsdetail.locale && newsdetail.locale[lang.code] && newsdetail.locale[lang.code].title}
                        onChange={(e) => this.onUpdateNewsDetail("title", e.target.value, lang.code)}
                      />
                      {errors && errors[lang.code] && errors[lang.code].title && <span className="text-danger"><IntlMessages id={errors[lang.code].title} /></span>}
                    </FormGroup>}

                  {(menudetail["D69DEBA8-121E-8AC1-462D-2B8552E24656"] && menudetail["D69DEBA8-121E-8AC1-462D-2B8552E24656"].Visibility === "E925F86B") && //D69DEBA8-121E-8AC1-462D-2B8552E24656
                    <FormGroup>
                      <Label><IntlMessages id="news.form.label.content" /> ({lang.code}) <span className="text-danger">*</span></Label>
                      <Editor
                        disabled={(menudetail["D69DEBA8-121E-8AC1-462D-2B8552E24656"].AccessRight === "11E6E7B0") ? true : false}
                        init={{
                          height: 500,
                          plugins: 'link image code lists advlist table preview',
                          toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
                          statusbar: false
                        }}
                        value={newsdetail && newsdetail.locale && newsdetail.locale[lang.code] && newsdetail.locale[lang.code].content}
                        onChange={(e) => this.onUpdateNewsDetail("content", e.target.getContent(), lang.code)}
                      />
                      {errors && errors[lang.code] && errors[lang.code].content && <span className="text-danger"><IntlMessages id={errors[lang.code].content} /></span>}
                    </FormGroup>}
                </TabContainer>
              );
            }
          })
          }

          {(menudetail["EF716312-17CA-28B3-1C01-7FF32470066A"] && menudetail["EF716312-17CA-28B3-1C01-7FF32470066A"].Visibility === "E925F86B") && //EF716312-17CA-28B3-1C01-7FF32470066A
            <FormGroup>
              <Label><IntlMessages id="news.form.label.displayfrom" /><span className="text-danger">*</span></Label>
              <DebounceInput
                readOnly={(menudetail["EF716312-17CA-28B3-1C01-7FF32470066A"].AccessRight === "11E6E7B0") ? true : false}
                minLength={0}
                debounceTimeout={300} type="date" className="form-control" name="fromdate" id="fromdate" placeholder="date placeholder" value={newsdetail.from_date} onChange={(e) => this.onUpdateNewsDetail('from_date', e.target.value)} />
              {errors.fromdate && <span className="text-danger"><IntlMessages id={errors.fromdate} /></span>}
            </FormGroup>}

          {(menudetail["FB37C23F-6E62-54D3-79F3-2002C2506DD7"] && menudetail["FB37C23F-6E62-54D3-79F3-2002C2506DD7"].Visibility === "E925F86B") && //FB37C23F-6E62-54D3-79F3-2002C2506DD7
            <FormGroup>
              <Label><IntlMessages id="news.form.label.displayto" /><span className="text-danger">*</span></Label>
              <DebounceInput
                readOnly={(menudetail["FB37C23F-6E62-54D3-79F3-2002C2506DD7"].AccessRight === "11E6E7B0") ? true : false}
                minLength={0}
                debounceTimeout={300} type="date" className="form-control" name="todate" id="todate" placeholder="date placeholder" value={newsdetail.to_date} onChange={(e) => this.onUpdateNewsDetail('to_date', e.target.value)} />
              {errors.todate && <span className="text-danger"><IntlMessages id={errors.todate} /></span>}
            </FormGroup>}

          {(menudetail["C6E164A7-6C3D-3134-25A2-818B282D2A06"] && menudetail["C6E164A7-6C3D-3134-25A2-818B282D2A06"].Visibility === "E925F86B") && //C6E164A7-6C3D-3134-25A2-818B282D2A06
            <FormGroup>
              <Label><IntlMessages id="news.form.label.type" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["C6E164A7-6C3D-3134-25A2-818B282D2A06"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="type" id="type" onChange={(e) => this.onUpdateNewsDetail('type', e.target.value)} value={newsdetail.type}>>
                <option value="1">News</option>
                <option value="2">Announcement</option>
              </Input>
              {errors.type && <span className="text-danger"><IntlMessages id={errors.type} /></span>}
            </FormGroup>}

          {(menudetail["5BFFB49F-88BE-11EA-5E4E-5AF76B07065A"] && menudetail["5BFFB49F-88BE-11EA-5E4E-5AF76B07065A"].Visibility === "E925F86B") && //5BFFB49F-88BE-11EA-5E4E-5AF76B07065A
            <FormGroup>
              <Label><IntlMessages id="cmspage.pageform.label.sort_order" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["5BFFB49F-88BE-11EA-5E4E-5AF76B07065A"].AccessRight === "11E6E7B0") ? true : false}
                minLength={0}
                debounceTimeout={300}
                className="form-control"
                type="number"
                name="sort_order"
                id="sort_order"
                min="0" max="10"
                value={newsdetail.sort_order}
                onChange={(e) => this.onUpdateNewsDetail('sort_order', e.target.value)}
              />
              {errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
            </FormGroup>}

          {(menudetail["0212AEF9-5BBF-4FD4-587F-CF4B0ABB1888"] && menudetail["0212AEF9-5BBF-4FD4-587F-CF4B0ABB1888"].Visibility === "E925F86B") && //0212AEF9-5BBF-4FD4-587F-CF4B0ABB1888
            <FormGroup>
              <Label><IntlMessages id="cmspage.pageform.label.status" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["0212AEF9-5BBF-4FD4-587F-CF4B0ABB1888"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="status" id="status" onChange={(e) => this.onUpdateNewsDetail('status', e.target.value)} value={newsdetail.status}>>
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
                onClick={() => this.updateNewsDetail()}
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
const mapStateToProps = ({ languages, news, authTokenRdcer }) => {

  var response = {
    data: news.data,
    loading: news.loading,
    language: languages.language,
    newsdetail: news.newsdetail,
    localebit: languages.localebit,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  if (typeof news.localebit != 'undefined' && news.localebit != '') {
    response['localebit'] = news.localebit;
  }
  return response;
}

export default withRouter(connect(mapStateToProps, {
  updateNews,
  getNewsById,
  getLanguage,
  getMenuPermissionByID,
})(EditNews));