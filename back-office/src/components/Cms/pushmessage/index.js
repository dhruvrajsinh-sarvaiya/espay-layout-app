/*
 * CreatedBy : Megha Kariya
 * Date : 17-01-2019
 * Comment : form of Push Messages
 */
/**
 * Display Users for message
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Form, Label, Button, FormGroup } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { displayUserList, sendMessageUser } from "Actions/PushMessage";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';

import { withStyles } from '@material-ui/core/styles';

import classnames from 'classnames';

// code added by devang parekh for new select (29-3-2019)
import Select from 'react-select'

const validateSendMessageInput = require('../../../validation/PushMessage/PushMessage');
const ITEM_HEIGHT = 48;
const styles = theme => ({
  chip: {
    margin: theme.spacing.unit / 4,
  },

  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.Select--multi .Select-input': {
      margin: 0,
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0,
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2,
    },
    '.Select-input': {
      display: 'inline-flex !important',
      padding: 0,
      height: 'auto',
    },
    '.Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0,
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black,
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1,
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    },
  },
});

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
    title: <IntlMessages id="pushMessage.sendMessageUser" />,
    link: '',
    index: 0
  }
];


class MessageWdgt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
      userList: '0',
      smsText: '',
      error: {},
      remainChar: '',
      msgSent: 0,
      btn_disabled: false, // Added By Megha Kariya (08/02/2019)
      mobileNoList: [],
      fieldList: {},
      menudetail: [],
      Pflag: true,
    };
    this.initState = {
      selectedUser: null,
      userList: '0',
      smsText: '',
      error: {},
      remainChar: '',
      btn_disabled: false, // Added By Megha Kariya (08/02/2019)
      mobileNoList: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.closeAll = this.closeAll.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  resetData() {
    this.setState(this.initState);
    this.props.drawerClose();
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('6083249D-39A5-0D86-9D72-B1CCCB5E3732');
  }


  handleChangeMulti = selectedUser => {
    this.setState({
      selectedUser: selectedUser,
    });
  };

  handleChange(event) {
    if (event.target.name === 'smsText') {
      if (event.target.value !== '') {
        var remainChar = (200 - event.target.value.length);

        this.setState({ remainChar: remainChar });
      } else {
        this.setState({ remainChar: '' });
      }
    }
    var error = Object.assign({}, this.state.error); 
    if (error[event.target.name] && error[event.target.name] !== '') {
      error[event.target.name] = '';
    }

    this.setState({ [event.target.name]: event.target.value, error: error });

  }

  sendMessage() {

    // code change by devang parekh for handle new change of select package issue

    const { userList, smsText, mobileNoList } = this.state;

    const { errors, isValid } = validateSendMessageInput(this.state);
    this.setState({ error: errors, btn_disabled: true }); // Added By Megha Kariya (08/02/2019) : add btn_disabled

    if (!isValid) {

      var mobileNoListDetail = [];
      mobileNoList.forEach(function (mobileNo) {
        mobileNoListDetail.push(mobileNo.value)
      })

      let send_data = {
        userList,
        mobileNoListDetail,
        smsText,

      }

      this.setState({ // code change by devang parekh 30-3-2019 
        loading: true,
        msgSent: 1
      })

      this.props.sendMessageUser(send_data);

    } else {
      this.setState({ remainChar: '', btn_disabled: false }); // Added By Megha Kariya (08/02/2019) : add btn_disabled
    }

  }

  closeAll() {


    this.setState(this.initState);
    this.props.closeAll();
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });


        this.props.displayUserList({ cumpulsoryBit: 1 }); // 1 for Mobile number Cumplusory and 2 for Email Cumpulsory
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (nextProps.sendData !== undefined && nextProps.sendData.ReturnCode === 0 && this.state.msgSent === 1) {

      this.setState({ msgSent: 0, mobileNoList: [] });

      NotificationManager.success(nextProps.sendData.ReturnMsg);
      setTimeout(() => {
        this.closeAll();
      }, 2000);

    }
    else if (nextProps.error.length !== 0 && nextProps.error.ReturnCode !== 0) {

      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />);
      this.setState({
        msgSent: 0,
        btn_disabled: false // Added By Megha Kariya (08/02/2019)
      })
    }

    this.setState({
      loading: nextProps.loading
    });

  }

  // 30-3-2019 devang parekh
  //  handle muliselect and store in state
  onChangeMobileNo = (selectedUser) => {
    this.setState({ mobileNoList: selectedUser });
  }
  // end

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
    var menudetail = this.checkAndGetMenuAccessDetail('8A5F647B-8A02-41A9-4F07-E6298D620B92');
    const data = this.props.userDataList;
    const { error, remainChar, btn_disabled, mobileNoList } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled

    return (
      <Fragment>
        <div className="jbs-page-content">
          <DashboardPageTitle title={<IntlMessages id="pushMessage.sendMessageUser" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
          {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}

          <JbsCollapsibleCard>
            <Form>
              {(menudetail["132785B8-A1FC-7432-3053-1F99FF5C20E6"] && menudetail["132785B8-A1FC-7432-3053-1F99FF5C20E6"].Visibility === "E925F86B") && //132785B8-A1FC-7432-3053-1F99FF5C20E6
                <FormGroup>
                  <Label for="selectUser">{<IntlMessages id="pushMessage.label.selectUser" />}</Label>
                  <div refs="userList" size="30" onChange={this.handleChange}>
                    <input
                      disabled={(menudetail["132785B8-A1FC-7432-3053-1F99FF5C20E6"].AccessRight === "11E6E7B0") ? true : false}
                      type="radio" value="1" defaultChecked={this.state.userList === '1'} name="userList" /> All &nbsp;
                <input type="radio" value="0" defaultChecked={this.state.userList === '0'} name="userList" /> Manually
              </div>
                  {error.userList && <span className="text-danger"><IntlMessages id={error.userList} /></span>}
                </FormGroup>}

              {this.state.userList === '0' &&
                (menudetail["5C30A736-0F39-8486-5350-467981C5A534"] && menudetail["5C30A736-0F39-8486-5350-467981C5A534"].Visibility === "E925F86B") && //5C30A736-0F39-8486-5350-467981C5A534
                <FormGroup>
                  <Select
                    isDisabled={(menudetail["5C30A736-0F39-8486-5350-467981C5A534"].AccessRight === "11E6E7B0") ? true : false}
                    defaultValue={mobileNoList}
                    options={data}
                    name="mobileNoList"
                    onChange={this.onChangeMobileNo}
                    isMulti
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  {error.selectedUser && <span className="text-danger"><IntlMessages id={error.selectedUser} /></span>}
                </FormGroup>}

              {(menudetail["63F62880-41D5-50D3-88DF-5F9EA9853DC8"] && menudetail["63F62880-41D5-50D3-88DF-5F9EA9853DC8"].Visibility === "E925F86B") && //63F62880-41D5-50D3-88DF-5F9EA9853DC8
                <FormGroup>
                  <Label for="smsText">{<IntlMessages id="pushMessage.label.msgText" />}</Label>
                  <textarea
                    disabled={(menudetail["63F62880-41D5-50D3-88DF-5F9EA9853DC8"].AccessRight === "11E6E7B0") ? true : false}
                    className={classnames('form-control form-control-lg')}
                    placeholder="Enter Message"
                    name="smsText"
                    maxLength="200"
                    value={this.state.smsText}
                    onChange={this.handleChange}
                  />
                  {remainChar !== '' && <span className="text-danger">Remaining Characters :- {remainChar} </span>}
                  {error.smsText && <span className="text-danger"><IntlMessages id={error.smsText} /></span>}
                </FormGroup>}

              {Object.keys(menudetail).length > 0 &&
                <FormGroup>
                  <Button
                    className="text-white text-bold btn mr-10"
                    variant="raised"
                    color="primary"
                    onClick={() => this.sendMessage()}
                    disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
                  >
                    <IntlMessages id="button.send" />
                  </Button>

                  <Button
                    className="text-white text-bold btn mr-10 bg-danger"
                    variant="raised"
                    color="danger"
                    onClick={this.closeAll}
                    disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
                  >
                    <IntlMessages id="button.cancel" />
                  </Button>
                </FormGroup>}
            </Form>
          </JbsCollapsibleCard>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ pushMessage, authTokenRdcer }) => {
  var response = {
    userDataList: pushMessage.displayUserDara,
    loading: pushMessage.loading,
    error: pushMessage.error,
    sendData: pushMessage.sendData,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    displayUserList,
    sendMessageUser,
    getMenuPermissionByID
  }
)(withStyles(styles)(MessageWdgt));


