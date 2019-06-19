/**
 * Active User Component
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import {
    FormGroup,
	Label,
    Input,
    Button
} from 'reactstrap';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

// intl messages
import IntlMessages from 'Util/IntlMessages';

//Import 2fa Google Authentication...
import { 
    twoFASMSAuthentication,
    sendSMS
} from 'Actions/MyAccount';

const validate2FASMSAuth = require('../../validation/MyAccount/2fa_authentication');

class TwoFaSMSAuthentication extends Component {
    constructor(props) {
		super();
		this.state = {
            open: false,
            authType : 'sms',
            authCode : '',
            errors : {}
        }
		
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSendSMS = this.onSendSMS.bind(this);
	}

	handleClickOpen(){
		this.setState({ open: true });
	}

	handleClose() {
		this.setState({ open: false });
    }

    onChange(event) {
        this.setState({ authCode : event.target.value });
    }
    
    onSendSMS(e) {
        e.preventDefault();
        this.props.sendSMS(this.state);
    }

    onSubmit(e) {        
        e.preventDefault();

        const { errors, isValid } = validate2FASMSAuth(this.state);
        this.setState({ errors : errors });

        if(isValid) {
            this.props.twoFASMSAuthentication(this.state);
        }
    }

    render() {
        const { open, authCode, errors } = this.state;
        
        return (
            <Fragment>
                <form>
                    <FormGroup>
                        <Label for="sms_auth_code"><IntlMessages id="my_account.sms_auth_code" /></Label>
                        <div className="row">
                            <div className="col-md-8">
                                <Input type="text" name="sms_auth_code" id="sms_auth_code" value={authCode} onChange={this.onChange} />
                            </div>
                            <div className="col-md-4">
                                <Button variant="raised" color="warning" className="text-white btn-block" onClick={this.onSendSMS}><IntlMessages id="sidebar.btnSendSMS" /></Button>
                            </div>
                            {errors.authCode && <span className="text-danger col-md-12"><IntlMessages id={errors.authCode} /></span>}
                        </div>
                    </FormGroup>
                    <div className="clearfix">
                        <Button variant="raised" color="success" className="text-white btn-block" onClick={this.onSubmit}><IntlMessages id="sidebar.btnSubmit" /></Button>
                        <a className="text-warning float-right mt-10" onClick={this.handleClickOpen}><IntlMessages id="my_account.phone_no_unavailable" /></a>
                    </div>
                </form>
                <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title" className="text-center">
                        <span className="border-bottom border-warning pb-10"><IntlMessages id="my_account.resetSMSAuth" /></span>
                    </DialogTitle>
					<DialogContent>
						<DialogContentText>
                            <IntlMessages id="my_account.resetGoogleAuthTxt1" />                            
                            <Divider className="mt-5 mb-5" />
                            <div className="row mt-5 mb-5">
                                <div className="col-md-11">
                                    <IntlMessages id="my_account.resetGoogleAuthTxt2" />
                                </div>
                                <div className="col-md-1">
                                    <Input type="radio" name="type1" />
                                </div>
                            </div>
                            <div className="row mt-5 mb-5">
                                <div className="col-md-11">
                                    <IntlMessages id="my_account.resetGoogleAuthTxt3" />
                                </div>
                                <div className="col-md-1">
                                    <Input type="radio" name="type2" />
                                </div>
                            </div>
                        </DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button variant="raised" onClick={this.handleClose} color="primary" className="text-white float-right"><IntlMessages id="sidebar.btnConfirmYourResetRequest" /></Button>
					</DialogActions>
				</Dialog>
            </Fragment>
        )
    }
}

const mapStateToProps = ({ twoFAAuth }) => {
    return {twoFAAuth};
}

export default connect(mapStateToProps,{
    twoFASMSAuthentication,
    sendSMS
}) (TwoFaSMSAuthentication);
