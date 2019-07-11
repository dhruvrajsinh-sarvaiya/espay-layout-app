/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 17-09-2018
    UpdatedDate : 17-09-2018
    Description : ContactUs Form Component 
	Changed by Jayesh Pathak on 29-10-2018 
*/
import React, { Component,Fragment } from "react";
import { Input, Form, Label, Col, FormGroup} from "reactstrap";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import LinearProgress from '@material-ui/core/LinearProgress';
// redux actions
import {
  addNewContactUs
} from "Actions/Contactus";
// intl messages
import IntlMessages from "Util/IntlMessages";
//Validation for Contactus Form
const validateContactUs = require("../../validation/Contactus/contactus");

class ContactFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        email: "",
        subject: "",
        description: "",
      },
      errors: {},
      loading: false
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    let newObj = Object.assign({}, this.state.data);
    newObj[event.target.name] = event.target.value;
    this.setState({ data: newObj });
  }

  /**
   * Add Contactus Data
   */

  onSubmit(event) {
    event.preventDefault();

    const { errors, isValid } = validateContactUs.validateAddContactUsInput(this.state.data);
    this.setState({ errors: errors });

    if (isValid) {
      this.setState({ loading: true });
      this.props.addNewContactUs(this.state.data);
    }
  }


  cleanData() {
    this.setState({
      data: {
        email: "",
        subject: "",
        description: "",
      },
      errors: {}
    });
  }

  componentWillReceiveProps(nextProps) {

    this.setState({ loading: nextProps.loading });

    if (typeof nextProps.data !== 'undefined' && nextProps.data.responseCode=== 1) {
      
      if (typeof nextProps.data.data !== 'undefined' && nextProps.data.data !== '') {

        if(nextProps.data.data=== 500 || nextProps.data.data=== 400)
        {
          var errMsg = <IntlMessages id={`contactApiErrCode.${nextProps.data.data}`} />; 
          NotificationManager.error(errMsg);
        }
        else
        {
          NotificationManager.error(nextProps.data.data);
        }

      }
    
     
		} else if (typeof nextProps.data !== 'undefined' && nextProps.data.responseCode=== 0) {
      
       var sucessMsg = <IntlMessages id={"contactus.contactform.add.success"} />
       NotificationManager.success(sucessMsg);
       this.cleanData();
    }
  }

  render() {
    const { email, subject, description } = this.state.data;  // attachedFile
    const { loading, errors } = this.state; 
    return (
      <Fragment>
      <div className="row">
        <div className="col-sm-12 col-md-10 col-lg-7">
        {loading && <div><LinearProgress color="secondary" /></div>}
          <Form id="contactForm">
            <FormGroup row>
              <Label for="email" sm={2}>
                <IntlMessages id="contactus.title.email" />
              </Label>
              <Col sm={10} md={6}>
                <IntlMessages id="contactus.enterEmail">
                    { (placeholder) =>
                      <Input
                      type="email"
                      value={email}
                      name="email"
                      id="email"
                      className="input-lg"
                      placeholder={placeholder}
                      onChange={this.onChange}
                    />
                    }
                </IntlMessages>
                {errors.email && (
                  <span className="text-danger">
                    <IntlMessages id={errors.email} />
                  </span>
                )}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="subject" sm={2}>
                <IntlMessages id="contactus.title.subject" />
              </Label>
              <Col sm={10} md={6}>
                
                <IntlMessages id="contactus.enterSubject">
                    { (placeholder) =>
                      <Input
                      type="text"
                      value={subject}
                      name="subject"
                      id="subject"
                      className="input-lg"
                      placeholder={placeholder}
                      onChange={this.onChange}
                    />
                    }
                </IntlMessages>
                {errors.subject && (
                  <span className="text-danger">
                    <IntlMessages id={errors.subject} />
                  </span>
                )}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="description" sm={2}>
                <IntlMessages id="contactus.title.description" />
              </Label>
              <Col sm={10} md={6}>
                 <IntlMessages id="contactus.enterDescription">
                    { (placeholder) =>
                       <Input
                       type="textarea"
                       value={description}
                       rows="7"
                       name="description"
                       id="description"
                       placeholder={placeholder}
                       onChange={this.onChange}
                     />
                    }
                </IntlMessages>
                {errors.description && (
                  <span className="text-danger">
                    <IntlMessages id={errors.description} />
                  </span>
                )}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>&nbsp;</Label>
              <Col sm={2} md={6}>
                <Button disabled={loading}
                  variant="raised"
                  className="btn-primary text-white"
                  onClick={this.onSubmit}
                >
                  <IntlMessages id="contactus.button.submit" />
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
      </Fragment>
    );
  }
}

//map state to props
const mapStateToProps = ({ contactus }) => {
  const { data, loading } = contactus;
  return { data, loading };
};

export default connect(
  mapStateToProps,
  {
    addNewContactUs
  }
)(ContactFrom);
