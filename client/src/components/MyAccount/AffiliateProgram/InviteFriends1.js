/**
 * Auther : Salim Deraiya
 * Created : 14/02/2019
 * Invite Friends
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { Form, FormGroup, Input, Label, Button, Alert } from "reactstrap";
import IntlMessages from "Util/IntlMessages";

class InviteFriends extends Component {
    constructor() {
        super();
        this.state = {
            expanded: 'panel1',
            emailIds : '',
            mobileNos : '',
            loading : false,
            errors : {}
        };
    }

    handleChange = panel => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : 'panel1',
		});
	};

    render() {
        const { loading, expanded, emailIds, mobileNos, errors } = this.state;
        return (
            <Fragment>
                <ExpansionPanel className="epd_panel" square expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
					<ExpansionPanelSummary className="epd_tlt" expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
						Email Template
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className="epd_detail">
                        <Form>
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper">
                                        <Label>Sample Mail</Label>
                                        <div className="sample_mail">

                                        </div>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper">
                                        <Label htmlFor="emailIds">Email ID</Label>
                                        <IntlMessages id="myaccount.emailIds">
                                            { (placeholder) =>
                                                <Input type="textarea" tabIndex="1" rows="5" value={emailIds} name="emailIds" id="emailIds" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="50" />
                                            }
                                        </IntlMessages>
                                        <p className="sml_notes">Allow multiple email id with (,) comma separated.</p>
                                        <span className="has-icon"><i className="ti-user" /></span>
                                        {errors.emailIds && <div className="text-danger text-left"><IntlMessages id={errors.emailIds} /></div>}
                                    </FormGroup>
                                </div>
                                <FormGroup className="mb-15">
                                    <Button disabled={loading} type="submit" tabIndex="2" className="coolbtn-comman text-white" variant="raised" onClick={this.onSubmit}><IntlMessages id="sidebar.btnSend" /></Button>
                                    <Button disabled={loading} type="submit" tabIndex="3" color="danger" variant="raised" onClick={this.onSubmit}><IntlMessages id="sidebar.btnCancel" /></Button>
                                </FormGroup>
                            </div>
                        </Form>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel className="epd_panel" square expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
					<ExpansionPanelSummary className="epd_tlt" expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
						SMS Template
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className="epd_detail">
                        Form
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel className="epd_panel" square expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
					<ExpansionPanelSummary className="epd_tlt" expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
						Social Sharing Feeds
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className="epd_detail">
                        Form
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel className="epd_panel" square expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
					<ExpansionPanelSummary className="epd_tlt" expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
						Affiliate Links
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className="epd_detail">
                        Form
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Fragment>
        );
    }
}

export default InviteFriends;