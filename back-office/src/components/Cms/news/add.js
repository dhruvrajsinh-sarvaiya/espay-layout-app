/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 04-10-2018
    UpdatedDate : 04-10-2018
    Description : Add News Form
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label,Alert} from "reactstrap";
import { withRouter } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import 'jodit/build/jodit.min.css';
import 'jodit';
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import 'rc-drawer/assets/index.css';
//Import CRUD Operation For News Actions...
import {addNews} from 'Actions/News';
import { getLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../DashboardPageTitle';
import {DebounceInput} from 'react-debounce-input';
import { Editor } from "@tinymce/tinymce-react"; // Added By Megha Kariya (18/02/2019)
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
//BreadCrumbData
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link : '',
        index:0
    },
    {
        title : <IntlMessages id="sidebar.dashboard" />,
        link : '',
        index:0
    },
    {
        title : <IntlMessages id="sidebar.cms" />,
        link : '',
        index:2
    },
    {
        title : <IntlMessages id="sidebar.news" />,
        link : '',
        index:1
    },
    {
        title :<IntlMessages id="sidebar.addNews" />,
		    link : '',
		    index : 0
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

class AddNews extends Component {

  constructor(props) {
		super(props);
	
		// default ui local state
		this.state = {
      activeIndex: 1,
			loading: false, // loading activity
      errors : {},
      err_msg : "",
      err_alert : true,
      btn_disabled : false,
      addNewsDetail: {
				newsid: "",
        locale: {
          en: {
              title: "",
              content:"",
          } 
        },
        sort_order: "",
        status: 1,
        type:1,
        from_date:"",
        to_date:"",
        date_created: "",
        date_modified: "",
        created_by: "",
        modified_by: ""
			},
			language:[
				{
					id: 1,
          code: "en",
          language_name : "English",
          locale : "en-US,en_US.UTF-8,en_US,en-gb,english",
          status : "1",
          sort_order : "1"
				}
      ],
      fieldList:{},
      menudetail: [],
      Pflag: true,
    };
    this.initState = {
			activeIndex: 1,
			loading: false, // loading activity
			errors : {},
			err_msg : "",
			err_alert : true,
      btn_disabled : false,
      //Added by Meghaben 29-01-2019
      addNewsDetail: {
        newsid: "",
        locale: {
        en: {
        title: "",
        content:"",
        } 
        },
        sort_order: "",
        status: 1,
        type:1,
        from_date:'',
        to_date:'',
        date_created: "",
        date_modified: "",
        created_by: "",
        modified_by: ""
        },
		};
    this.onChangeAddNewsDetails = this.onChangeAddNewsDetails.bind(this);
    this.addNewsDetail = this.addNewsDetail.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  resetData() {
    this.setState(this.initState);
    this.props.drawerClose();
  }

  onDismiss() {
    let err=delete  this.state.errors['message'];
    this.setState({ err_alert: false, errors:err});
  }

  // Handle tab Change
  handleChange(e, value) {
    this.setState({ activeIndex: value });
  }

	// On Change Add News Details
	onChangeAddNewsDetails(key, value , lang='') {
		if( lang!='undefined' && lang!='')
		{
			let statusCopy = Object.assign({}, this.state.addNewsDetail);
			statusCopy.locale[lang][key] = value;
			this.setState(statusCopy);
		}
		else
		{
			this.setState({
				addNewsDetail: {
					...this.state.addNewsDetail,
					[key]: value
				}
			});
		}
  }
  
  //Add News Detail
  addNewsDetail() {
    const { locale,sort_order,status,type,from_date,to_date} = this.state.addNewsDetail;
    const { errors, isValid } = validateNewsformInput(this.state.addNewsDetail);
    this.setState({ err_alert: true, errors: errors, btn_disabled : true });
    //let isValid=false;
      if(!isValid) {
          let data = {
              locale,
              sort_order,
              status,
              type,
              from_date,
              to_date
          }
          setTimeout(() => {
            this.props.addNews(data);
            this.setState({loading: true });
            }, 2000);   
      }
      else { // Added By Megha Kariya (08/02/2019)
        this.setState({ btn_disabled : false }); 
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
        this.props.getLanguage();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }
   
    if(nextProps.data.responseCode === 0) {
      this.setState({ err_msg : '', err_alert: false  });
      //this.props.drawerClose();
      this.resetData();
      this.props.reload();
    }

    if( nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
      if(typeof nextProps.data.errors.message !='undefined' && nextProps.data.errors.message!='')
      {
        this.setState({ err_alert: true});
      }
      this.setState({ 
        errors : nextProps.data.errors,
        btn_disabled : false // Added By Megha Kariya (08/02/2019)
      });
    }

    if(typeof nextProps.localebit != 'undefined' && nextProps.localebit!='' &&  nextProps.localebit==1)
    {
      const locale={};
      { 
        nextProps.language && nextProps.language.map((lang,key) => {

          locale[lang.code]={
            title: "",
            content:""
          };
      })}

    var newObj = Object.assign({}, this.state.addNewsDetail);
      newObj['locale'] = locale;
     this.setState({addNewsDetail:newObj})

    }
    
    this.setState({ 
      loading : nextProps.loading,
      language:nextProps.language
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
            response = fieldList;
          }
      }
  }
return response;
}
  }

  render() {
    var menudetail = this.checkAndGetMenuAccessDetail('B48048D0-8F47-A1EC-701F-8AF25C3080D2');
    const {err_alert,language,errors,addNewsDetail,loading,btn_disabled} = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
    return (
      <div className="jbs-page-content">
        <DashboardPageTitle title={<IntlMessages id="news.title.add-News" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
              {language && language.map((lang,key) => (
                  <Tab key={key} value={lang.id} title={lang.language_name} label={lang.language_name} icon={<img src={require(`Assets/flag-icons/${lang.code}.png`)} className="mr-10" width="25" height="16" alt="lang-icon" />} />
              ))}
              </Tabs>
              </AppBar>

                {language && language.map((lang,key) => {
                  if (this.state.activeIndex == lang.id) {
                    return (
                          <TabContainer key={key}>
                        {(menudetail["F64AA414-5FCB-7329-5534-C15A64B78A55"] && menudetail["F64AA414-5FCB-7329-5534-C15A64B78A55"].Visibility === "E925F86B") && //F64AA414-5FCB-7329-5534-C15A64B78A55
                             <FormGroup>
                                <Label><IntlMessages id="news.form.label.title" /> ({lang.code}) <span className="text-danger">*</span></Label>
                                <DebounceInput
                                readOnly={(menudetail["F64AA414-5FCB-7329-5534-C15A64B78A55"].AccessRight === "11E6E7B0") ? true : false}
          					                minLength={0}
                                    debounceTimeout={300}
                                    className="form-control"
                                    type="text"
                                    name="title"
                                    id="title"
                                    maxLength={200}
                                    value={addNewsDetail.locale[lang.code].title}
                                    onChange={(e) => this.onChangeAddNewsDetails("title", e.target.value,lang.code)}
                                />
                                  {errors && errors[lang.code] &&  errors[lang.code].title && <span className="text-danger"><IntlMessages id={errors[lang.code].title} /></span>}
                              </FormGroup>}

                        {(menudetail["7AAC8E9D-59FD-0241-4598-654AC2452DD5"] && menudetail["7AAC8E9D-59FD-0241-4598-654AC2452DD5"].Visibility === "E925F86B") && //7AAC8E9D-59FD-0241-4598-654AC2452DD5
                              <FormGroup>
                                <Label><IntlMessages id="news.form.label.content" /> ({lang.code}) <span className="text-danger">*</span></Label>
                                <Editor
                                disabled={(menudetail["7AAC8E9D-59FD-0241-4598-654AC2452DD5"].AccessRight === "11E6E7B0") ? true : false}
                                  init={{
                                    height: 500,
                                    plugins: 'link image code lists advlist table preview',
                                    toolbar : "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
                                    statusbar : false
                                  }}
                                  value={addNewsDetail.locale[lang.code].content}
                                  onChange={(e)=>this.onChangeAddNewsDetails("content", e.target.getContent(),lang.code)}
                                />
                                  {errors && errors[lang.code] &&  errors[lang.code].content && <span className="text-danger"><IntlMessages id={errors[lang.code].content} /></span>}
                              </FormGroup>}
                          </TabContainer>
                        );
                      }
                    })
                    }

          {(menudetail["BA792A85-8F63-34E2-7563-61A11BF97B3B"] && menudetail["BA792A85-8F63-34E2-7563-61A11BF97B3B"].Visibility === "E925F86B") && //BA792A85-8F63-34E2-7563-61A11BF97B3B
                    <FormGroup>
						          <Label><IntlMessages id="news.form.label.displayfrom" /><span className="text-danger">*</span></Label>
						          <DebounceInput
                      readOnly={(menudetail["BA792A85-8F63-34E2-7563-61A11BF97B3B"].AccessRight === "11E6E7B0") ? true : false}
          					    minLength={0}
                        value={addNewsDetail.from_date}  // Added By Megha Kariya (08/02/2019)
          					    debounceTimeout={300} className="form-control" type="date" name="fromdate" id="fromdate" placeholder="date placeholder" onChange={(e) => this.onChangeAddNewsDetails('from_date', e.target.value)}/>
                      {errors.fromdate && <span className="text-danger"><IntlMessages id={errors.fromdate} /></span>}
                    </FormGroup>}

          {(menudetail["D0DD0A59-27DC-4DDA-0475-1FF182CF128D"] && menudetail["D0DD0A59-27DC-4DDA-0475-1FF182CF128D"].Visibility === "E925F86B") && //D0DD0A59-27DC-4DDA-0475-1FF182CF128D
                    <FormGroup>
                      <Label><IntlMessages id="news.form.label.displayto" /><span className="text-danger">*</span></Label>
                      <DebounceInput
                      readOnly={(menudetail["D0DD0A59-27DC-4DDA-0475-1FF182CF128D"].AccessRight === "11E6E7B0") ? true : false}
          					    minLength={0}
                        value={addNewsDetail.to_date}  // Added By Megha Kariya (08/02/2019)
          					    debounceTimeout={300} className="form-control" type="date" name="todate" id="todate" placeholder="date placeholder" onChange={(e) => this.onChangeAddNewsDetails('to_date', e.target.value)}/>
                      {errors.todate && <span className="text-danger"><IntlMessages id={errors.todate} /></span>}
                    </FormGroup>}

          {(menudetail["E728E6D1-930D-A14F-2916-23B7B1F15034"] && menudetail["E728E6D1-930D-A14F-2916-23B7B1F15034"].Visibility === "E925F86B") && //E728E6D1-930D-A14F-2916-23B7B1F15034
                    <FormGroup>
                            <Label><IntlMessages id="news.form.label.type" /><span className="text-danger">*</span></Label>
            <Input
              disabled={(menudetail["E728E6D1-930D-A14F-2916-23B7B1F15034"].AccessRight === "11E6E7B0") ? true : false}
              type="select" name="type" id="type" onChange={(e) => this.onChangeAddNewsDetails('type', e.target.value)} value={addNewsDetail.type}>>
                  
                                <option value="1">News</option>
                                <option value="2">Announcement</option>
                            </Input>
                            {errors.type && <span className="text-danger"><IntlMessages id={errors.type} /></span>}
                    </FormGroup>}

          {(menudetail["85F85E21-08C3-0458-1DAD-E0013DC1167B"] && menudetail["85F85E21-08C3-0458-1DAD-E0013DC1167B"].Visibility === "E925F86B") && //85F85E21-08C3-0458-1DAD-E0013DC1167B
                    <FormGroup>
                        <Label><IntlMessages id="cmspage.pageform.label.sort_order" /><span className="text-danger">*</span></Label>
            <Input
              disabled={(menudetail["85F85E21-08C3-0458-1DAD-E0013DC1167B"].AccessRight === "11E6E7B0") ? true : false}
          					        minLength={0}
                            debounceTimeout={300}
                            className="form-control"
                            type="number"
                            name="sort_order"
                            id="sort_order"
                            min="0" max="10"
                            value={addNewsDetail.sort_order}
                            onChange={(e) => this.onChangeAddNewsDetails('sort_order', e.target.value)}
                        />
                        {errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
                    </FormGroup>}

          {(menudetail["3F6E980F-7896-6654-A029-12FF92FBA6CB"] && menudetail["3F6E980F-7896-6654-A029-12FF92FBA6CB"].Visibility === "E925F86B") && //3F6E980F-7896-6654-A029-12FF92FBA6CB
                    <FormGroup>
                            <Label><IntlMessages id="cmspage.pageform.label.status" /><span className="text-danger">*</span></Label>
                            <Input 
              disabled={(menudetail["3F6E980F-7896-6654-A029-12FF92FBA6CB"].AccessRight === "11E6E7B0") ? true : false}              
              type="select" name="status" id="status" onChange={(e) => this.onChangeAddNewsDetails('status', e.target.value)} value={addNewsDetail.status}>>
                            <IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
								          <IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
                                {/* <option value="1">Active</option>
                                <option value="0">Inactive</option> */}
                            </Input>
                            {errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
                    </FormGroup>}

          {Object.keys(menudetail).length > 0 && 
                    <FormGroup>
                    <Button
                      className="text-white text-bold btn mr-10"
                      variant="raised"
                      color="primary"
                      onClick={() => this.addNewsDetail()}
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

const mapStateToProps = ({ languages, news, authTokenRdcer }) => {
	var response = { 
    data: news.data,
    loading: news.loading,
    language:languages.language,
    localebit:languages.localebit,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  if(typeof news.localebit != 'undefined' && news.localebit!='')
  {
    response['localebit']=news.localebit;
  }
  return response;
}

export default withRouter(connect(mapStateToProps,{
  addNews, getLanguage, getMenuPermissionByID,
}) (AddNews));