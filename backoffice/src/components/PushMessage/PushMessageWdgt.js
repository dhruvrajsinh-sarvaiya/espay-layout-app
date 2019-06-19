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
import { Form, Label, Input, Col, Row,Table, Button,FormGroup } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { displayUserList,sendMessageUser } from "Actions/PushMessage";

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MultiSelectComponent from './component/MultiSelectComponent';
import classnames from 'classnames';
const validateSendMessageInput = require('../../validation/PushMessage/PushMessage');
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
class MessageWdgt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
      userList: '0',
      smsText: '',
      error: {},
      // remarks: '',
      remainChar: '',
      msgSent: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }
  componentWillMount() {
    //this.props.displayUserList();
    this.props.displayUserList({cumpulsoryBit:1}); // 1 for Mobile number Cumplusory and 2 for Email Cumpulsory
  }
  

  handleChangeMulti = selectedUser => {
    this.setState({
      selectedUser: selectedUser,
    });
  };

  handleChange(event) {
    if(event.target.name === 'smsText')
    {
      if(event.target.value !== '') {
      var remainChar = (200 - event.target.value.length);
      
      this.setState({ remainChar: remainChar });
      } else
      {
        this.setState({ remainChar: '' });
      }
    }
    var error = this.state.error;
    if(error[event.target.name] && error[event.target.name] !== '')
    {
      error[event.target.name] = '';
    }
    
    this.setState({ [event.target.name]: event.target.value, error: error });
    
  }
  sendMessage()
  {
		// const { userList, selectedUser, smsText,remarks} = this.state;
		const { userList, selectedUser, smsText} = this.state;
		
      	const { errors, isValid } = validateSendMessageInput(this.state);
      	this.setState({ error: errors });
    
        if(!isValid) {
          let send_data = {
            userList,
            selectedUser,
            smsText,
            // remarks
          }
          
          this.setState({
            msgSent: 1
            })
          setTimeout(() => {
            let res= this.props.sendMessageUser(send_data);
            
            this.setState({ loading: true });
          }, 2000);   
        }
        else{
          this.setState({ remainChar: '' });
        }
  }
  clearAll()
  {
    
    this.setState({selectedUser: null,
      userList: '0',
      smsText: '',
      error: {},
      // remarks: '',
      remainChar: ''
    });
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
		if(typeof nextProps.sendData !== 'undefined' && nextProps.sendData.ReturnCode === 0 && this.state.msgSent === 1) {
      this.setState({ msgSent: 0});
      NotificationManager.success(nextProps.sendData.ReturnMsg);
			setTimeout(() => {
				
				this.clearAll();
	  	}, 2000); 
    }
    else if (nextProps.error.length !== 0 && nextProps.error.ReturnCode !== 0) {
      
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />);
      this.setState({
        msgSent: 0,
      })
    }

    this.setState({ 
      loading : nextProps.loading
    });
  }

  render() {
    const data = this.props.userDataList;
    const { classes } = this.props;
    const { selectedUser,userList,error, remainChar } = this.state;
    return (
      <Fragment>
        {this.props.loading && <JbsSectionLoader />}
        <div className="charts-widgets-wrapper">
          <JbsCollapsibleCard>
          <div className="page-title d-flex justify-content-between align-items-center">
            <div className="page-title-wrap">
               <h2>{<IntlMessages id="pushMessage.sendMessageUser" />}</h2> 
            </div>
           
        </div>
            <Form>
            <FormGroup>

              <Label for="selectUser">{<IntlMessages id="pushMessage.label.selectUser" />}</Label>
              <div refs="userList" size="30" onChange={this.handleChange}>
                <input type="radio" value="1" checked={this.state.userList === '1'} name="userList"/> All &nbsp;
                <input type="radio" value="0" checked={this.state.userList === '0'} name="userList"/> Manually
              </div>
              {error.userList &&  <span className="text-danger"><IntlMessages id={error.userList} /></span> }
            </FormGroup>
            {this.state.userList === '0' &&
              <FormGroup>
              <MultiSelectComponent data={data} classes={classes} selectedUser={selectedUser} handleChangeMulti={this.handleChangeMulti} />
              {error.selectedUser &&  <span className="text-danger"><IntlMessages id={error.selectedUser} /></span> }
              </FormGroup>
            }
            <FormGroup>

              <Label for="smsText">{<IntlMessages id="pushMessage.label.msgText" />}</Label>
              <textarea
                className={classnames('form-control form-control-lg')}
                placeholder="Enter Message"
                name="smsText"
                maxLength="200"
                value={this.state.smsText}
                onChange={this.handleChange}
              />
              {remainChar !== '' && <span className="text-danger">Remaining Characters :- {remainChar} </span>}
              {error.smsText &&  <span className="text-danger"><IntlMessages id={error.smsText} /></span> }
            </FormGroup>
            {/* <FormGroup>

              <Label for="remarks">{<IntlMessages id="pushMessage.label.remarks" />}</Label>
              <Input
                className={classnames('form-control form-control-lg')}
                placeholder="Enter Remarks"
                name="remarks"
                value={this.state.remarks}
                onChange={this.handleChange}
              />
              {error.remarks &&  <span className="text-danger"><IntlMessages id={error.remarks} /></span> }
            </FormGroup> */}
            <FormGroup>
              <Button
									className="text-white text-bold btn mr-10"
									variant="raised"
									color="primary"
									onClick={() => this.sendMessage()}
								>
								<IntlMessages id="button.send" />
								</Button>
					
								<Button
									className="text-white text-bold btn mr-10 btn bg-danger text-white"
									variant="raised"
									onClick={this.clearAll}
								> 
								<IntlMessages id="button.cancel" /> 
								</Button>
              </FormGroup>
            
            </Form>
          </JbsCollapsibleCard>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ pushMessage }) => {
  var response = {
    userDataList: pushMessage.displayUserDara,
    loading: pushMessage.loading,
    error: pushMessage.error,
    sendData: pushMessage.sendData
  };
  return response;
};

MessageWdgt.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(
  mapStateToProps,
  {
    displayUserList,
    sendMessageUser
  }
)(withStyles(styles)(MessageWdgt));


