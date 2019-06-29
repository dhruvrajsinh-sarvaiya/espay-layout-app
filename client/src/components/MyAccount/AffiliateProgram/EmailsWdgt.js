/**
 * Author : Saloni Rathod
 * Created : 04/03/2019
 *  Affiliate  invite friends by email
*/
import React, { Component, Fragment } from 'react'
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import { AffiliateEmailPromo } from "Actions/MyAccount";
import emailvalidate from '../../../validation/MyAccount/emailvalidate';

// email promotion class
class EmailsWdgt extends Component {
    constructor() {
        super();
        this.state = {
            expanded: 'panel1',
            errors: {},
            loading: false,
            EmailList: '',
            emaildata:'',
        };
        this.onChange = this.onChange.bind(this);
        this.resetData = this.resetData.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit = (event) => {
        event.preventDefault();
        var newObj = Object.assign({}, this.state.EmailList);
        const { errors, isValid,emaildata } = emailvalidate(this.state.EmailList);
        this.setState({ errors: errors,emaildata:emaildata });

        if (isValid) {
            var myString = newObj.EmailList;
            newObj['EmailList'] = myString.split(',');
            this.props.AffiliateEmailPromo(newObj);
        }
    }

    componentWillReceiveProps(nextProps) {
        //loading
        this.setState({ loading: nextProps.loading });
        //email notifications
        if (nextProps.AffiliateEmailData.ReturnCode === 1 || nextProps.AffiliateEmailData.ReturnCode === 9) {
            var errMsg1 = <IntlMessages id={`apiErrCode.${nextProps.AffiliateEmailData.ErrorCode}`} />;
            NotificationManager.error(errMsg1);
        } else if (nextProps.AffiliateEmailData.ReturnCode === 0) {
            var sucMsg = nextProps.AffiliateEmailData.ErrorCode === 0 ? nextProps.AffiliateEmailData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.AffiliateEmailData.ErrorCode}`} />;
            this.resetData();
            NotificationManager.success(sucMsg);
        }
    }

    resetData() {
        var newObj = Object.assign({}, this.state.EmailList);
        newObj.EmailList = '';
        this.setState({ EmailList: newObj, errors: '' });
    }

    onChange(event) {
        var newObj = Object.assign({}, this.state.EmailList);
        newObj[event.target.name] = event.target.value;
        this.setState({ EmailList: newObj });
    }

    render() {
        const { errors,emaildata } = this.state;
        const { EmailList } = this.state.EmailList;
        return (
            <Fragment>
                
                <Form>
                    <FormGroup>
                        <Label for="EmailIds"><IntlMessages id="sidebar.enterEmailId" /><span className="text-danger">*</span></Label>
                        <IntlMessages id="sidebar.emailId">
                            {(placeholder) =>
                                <Input type="textarea" rows="6" name="EmailList" id="EmailList" placeholder={placeholder} value={EmailList} onChange={this.onChange} />
                            }
                        </IntlMessages>
                        <h5 className="sml_notes mt-2"><IntlMessages id="sidebar.multiplEmailNote" /></h5>
                        {errors.EmailList && <div className="text-danger text-left"><IntlMessages id={errors.EmailList} values={{emaildata:emaildata}} /></div>}
                    </FormGroup>
                    <FormGroup className=" text-left ">
                        <Button onClick={this.onSubmit} className="mr-10 perverbtn"><IntlMessages id="sidebar.btnSend" /></Button>
                        <Button disabled={this.state.loading} onClick={this.resetData} color="danger"><IntlMessages id="button.cancel" /></Button>
                    </FormGroup>
                </Form>
            </Fragment>
        )
    }
}
const mapStateToProps = ({ invitefriends }) => {
    const { AffiliateEmailData, loading } = invitefriends;
    return { AffiliateEmailData, loading };
};

export default connect(mapStateToProps, {
    AffiliateEmailPromo
})(EmailsWdgt);