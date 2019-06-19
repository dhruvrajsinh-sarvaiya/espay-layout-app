/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 04-10-2018
    UpdatedDate : 17-10-2018
    Description :News List
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import MatButton from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { Badge, Alert } from "reactstrap";
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
//Import List page Actions...
//Added by Meghaben 29-01-2019
import { getNews, deleteNewsById, getNewsById } from "Actions/News";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { getLanguage } from 'Actions/Language';
import AddNews from './add';
import EditNews from './edit';
import { DashboardPageTitle } from '../DashboardPageTitle';
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
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.news" />,
    link: '',
    index: 1
  }
];

const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}

// componenet listing
const components = {
  AddNews: AddNews,
  EditNews: EditNews
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, newsdata, reload) => {
  return React.createElement(components[TagName], { props, drawerClose, closeAll, newsdata, reload });
};

//Table Object...
const columns = [
  {
    name: <IntlMessages id="sidebar.colId" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="news.table.label.newstitle" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="news.table.label.type" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="news.table.label.displayfrom" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="news.table.label.displayto" />,
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

class News extends Component {
  constructor(props) {
    super();
    // default ui local state
    this.state = {
      loading: false, // loading activity
      newslist: [],
      errors: {},
      err_msg: "",
      err_alert: true,
      selectedNews: "",
      open: false,
      componentName: "",
      newsdata: {},
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
    //this.setState({ loading: true });
    this.props.getNews();
    // setTimeout(() => {
    //   this.setState({ loading: false });
    // }, 2000);
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('BF144589-69FA-3637-2F9F-3F5F006661EC');
  }

  componentWillReceiveProps(nextProps) {
    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getNews();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (nextProps.hasOwnProperty('response'))
      if (nextProps.response.data.responseCode === 0 && nextProps.deleteevent == 1) {
        this.setState({ loading: false, selectedNews: null });
        this.reload();
        //window.location.reload();
      }

    if (nextProps.hasOwnProperty('response'))
      if (typeof nextProps.response.data != 'undefined' && (nextProps.response.data.responseCode === 9 || nextProps.response.data.responseCode === 1)) {
        if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
          this.setState({ err_alert: true });
        }
        this.setState({
          errors: nextProps.data.errors
        });
      }

    this.setState({
      newslist: nextProps.news_list,
      loading: false
    });
  }

  /**
   * On Delete
   */
  onDelete(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedNews: data });
  }

  /**
   * Delete News Permanently
   */
  deleteNewsPermanently() {
    const { selectedNews } = this.state;
    this.refs.deleteConfirmationDialog.close();
    this.setState({ loading: true });
    let NewsId = selectedNews._id;
    if (NewsId != "") {
      this.props.deleteNewsById(NewsId);
    }
  }

  onClick = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  showComponent = (componentName, permission, news = '') => {
    // check permission go on next page or not
    if (permission) {
      if (typeof news != 'undefined' && news != '') {
        this.setState({ newsdata: news });
      }
      this.setState({
        componentName: componentName,
        open: !this.state.open,
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
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7461A5F0-A583-70E7-3F0E-346293322F01'); //7461A5F0-A583-70E7-3F0E-346293322F01
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }
    const { loading, err_alert, errors, newslist } = this.state;
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
              onClick={(e) => this.showComponent('AddNews', (this.checkAndGetMenuAccessDetail('7461A5F0-A583-70E7-3F0E-346293322F01')).HasChild)}
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
          <DashboardPageTitle title={<IntlMessages id="sidebar.news" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
          {(loading || this.props.menuLoading) && <JbsSectionLoader />}

          {errors.message && <div className="alert_area">
            <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
          </div>}

          <JbsCollapsibleCard fullBlock>
            <div className="StackingHistory">
              <MUIDataTable
                data={
                  newslist &&
                  newslist.map(news => {
                    return [
                      news.newsid,
                      news.locale.en.title,
                      news.type == 1 ? (
                        <Badge color="primary">News</Badge>
                      ) : (
                          <Badge color="danger">Announcement</Badge>
                        ),
                      news.from_date,
                      news.to_date,
                      news.status == 1 ? (
                        <Badge color="primary">
                          <IntlMessages id="global.form.status.active" />
                        </Badge>
                      ) : (
                          <Badge color="danger">
                            <IntlMessages id="global.form.status.inactive" />
                          </Badge>
                        ),
                      <div className="list-action">
                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                          <a
                            href="javascript:void(0)"
                            color="primary"
                            onClick={(e) => this.showComponent('EditNews', (this.checkAndGetMenuAccessDetail('7461A5F0-A583-70E7-3F0E-346293322F01')).HasChild, news)}
                          >
                            <i className="ti-pencil" />
                          </a>
                        }
                        {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && // check for delete permission
                          <a
                            href="javascript:void(0)"
                            color="primary"
                            onClick={() => this.onDelete(news)}
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
            onConfirm={() => this.deleteNewsPermanently()}
          />

          <Drawer
            style={{ zIndex: '5' }}
            width="100%"
            handler={false}
            open={this.state.open}
            className="drawer2"
            level=".drawer1"
            placement="right"
            levelMove={100}
          >
            {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.closeAll, this.state.newsdata, this.reload)}
          </Drawer>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ news, authTokenRdcer }) => {
  var response = {
    data: news.data,
    loading: news.loading,
    news_list: news.news_list,
    deleteevent: news.deleteevent,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    getNews,
    deleteNewsById,
    getNewsById,
    getLanguage,
    getMenuPermissionByID,
  }
)(News);
