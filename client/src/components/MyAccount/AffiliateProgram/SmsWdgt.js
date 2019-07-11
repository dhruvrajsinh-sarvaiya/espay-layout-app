/**
 * Author : Saloni Rathod
 * Created : 04/03/2019
 *  Affiliate  invite friends by sms
 * updated on
*/
import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { NotificationManager } from "react-notifications";
import { AffiliateSmsPromo } from "Actions/MyAccount";
import mobilenovalidate from '../../../validation/MyAccount/mobilenovalidate';

//for Sms promotion
class SmsWdgt extends Component {
    constructor() {
        super();
        this.state = {
            expanded: 'panel1',
            errors: {},
            smsloading: false,
            MobileNumberList: '',
            mobiledata: "",

        };
        this.onChange = this.onChange.bind(this);
        this.resetData = this.resetData.bind(this);
    }

    onSubmit = (event) => {
        event.preventDefault();
        var newObj = Object.assign({}, this.state.MobileNumberList);
        const { errors, isValid, mobiledata } = mobilenovalidate(this.state.MobileNumberList);
        this.setState({ errors: errors, mobiledata: mobiledata });

        if (isValid) {
            var myString = newObj.MobileNumberList;
            newObj['MobileNumberList'] = myString.split(',');
            this.props.AffiliateSmsPromo(newObj);
        }
    }

    componentWillReceiveProps(nextProps) {
        //smsloading
        this.setState({ smsloading: nextProps.smsloading });
        //sms notifications
        if (nextProps.AffiliateSmsData.ReturnCode === 1 || nextProps.AffiliateSmsData.ReturnCode === 9) {
            var errMsg1 = <IntlMessages id={`apiErrCode.${nextProps.AffiliateSmsData.ErrorCode}`} />;
            NotificationManager.error(errMsg1);
        } else if (nextProps.AffiliateSmsData.ReturnCode === 0) {
            var sucMsg = nextProps.AffiliateSmsData.ErrorCode === 0 ? nextProps.AffiliateSmsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.AffiliateSmsData.ErrorCode}`} />;
            this.resetData();
            NotificationManager.success(sucMsg);
        }
    }

    resetData() {
        var newObj = Object.assign({}, this.state.MobileNumberList);
        newObj.MobileNumberList = "";
        this.setState({ MobileNumberList: newObj, errors: '' });
    }

    onChange(event) {
        var newObj = Object.assign({}, this.state.MobileNumberLista);
        newObj[event.target.name] = event.target.value;
        this.setState({ MobileNumberList: newObj });
    }

    render() {
        const { errors, mobiledata } = this.state;
        const { MobileNumberList } = this.state.MobileNumberList;
        return (
            <Fragment>
                <Form>
                    <FormGroup>
                        <Label for="MobileNumberList"><IntlMessages id="sidebar.enterMobileNo" /><span className="text-danger">*</span></Label>
                        <IntlMessages id="sidebar.mobileNo">
                            {(placeholder) =>
                                <Input type="textarea" rows="6" name="MobileNumberList" id="MobileNumberList" placeholder={placeholder} value={MobileNumberList} onChange={this.onChange} />
                            }
                        </IntlMessages>
                        <h5 className="sml_notes mt-2"><IntlMessages id="sidebar.multiplMobileNote" /></h5>
                        {errors.MobileNumberList && <div className="text-danger text-left"><IntlMessages id={errors.MobileNumberList} values={{ mobiledata: mobiledata }} /></div>}
                    </FormGroup>
                    <FormGroup className=" text-left">
                        <Button onClick={this.onSubmit} className="mr-10 perverbtn"><IntlMessages id="sidebar.btnSend" /></Button>
                        <Button onClick={this.resetData} color="danger"><IntlMessages id="button.cancel" /></Button>
                    </FormGroup>
                </Form>
            </Fragment>
        )
    }
}
const mapStateToProps = ({ invitefriends }) => {
    const { AffiliateSmsData, smsloading } = invitefriends;
    return { AffiliateSmsData, smsloading };
};

export default connect(mapStateToProps, {
    AffiliateSmsPromo
})(SmsWdgt);