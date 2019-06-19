/**
 * Add Roles Wdgt
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import MatButton from "@material-ui/core/Button";
import { Form, FormGroup, Input, Label } from "reactstrap";

// redux action
import { editKycVerify, getKycVerifyById } from "Actions/MyAccount";

//intl messages
import IntlMessages from "Util/IntlMessages";

//Validation
const validateKYC = require("../../validation/MyAccount/kyc_verify");

const docStatus = [
  { id: "0", name: "Rejected" },
  { id: "1", name: "Verify" },
  { id: "2", name: "Not Verify" }
];

const KYCStatus = ({ status }) => {
  let htmlStatus = <IntlMessages id="sidebar.rejected" />;
  if (status === 1) {
    htmlStatus = <IntlMessages id="sidebar.verify" />;
  } else if (status === 2) {
    htmlStatus = <IntlMessages id="sidebar.notVerify" />;
  }
  return htmlStatus;
};

class EditEnterpriseKYCVerifyWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        first_name: "",
        last_name: "",
        email: "",
        country: "",
        user_type: "",
        company_name: "",
        company_address: "",
        company_country: "",
        source_of_founding: "",
        company_website_url: "",
        applicant_name: "",
        applicant_country: "",
        applicant_job_title: "",
        applicant_phone_no: "",
        status: "",
        exchange: "",
        updated_at: "",
        doc1: "",
        doc2: "",
        doc3: "",
        doc4: "",
        doc5: "",
        doc6: "",
        doc7: "",
        doc8: ""
      },
      doc1_status: 0,
      doc2_status: 0,
      doc3_status: 0,
      doc4_status: 0,
      doc5_status: 0,
      doc6_status: 0,
      doc7_status: 0,
      doc8_status: 0,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    var uid = this.props.location.state.data.id;

    if (uid !== "") {
      this.props.getKycVerifyById(uid, 2);
    } else {
      this.props.history.push("/app/my-account/kyc-verify");
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      doc1_status: nextProps.data.doc1_status,
      doc2_status: nextProps.data.doc2_status,
      doc3_status: nextProps.data.doc3_status,
      doc4_status: nextProps.data.doc4_status,
      doc5_status: nextProps.data.doc5_status,
      doc6_status: nextProps.data.doc6_status,
      doc7_status: nextProps.data.doc7_status,
      doc8_status: nextProps.data.doc8_status
    });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    let kycObj = {
      user_type: 2,
      doc1_status: this.state.doc1_status,
      doc2_status: this.state.doc2_status,
      doc3_status: this.state.doc3_status,
      doc4_status: this.state.doc4_status,
      doc5_status: this.state.doc5_status,
      doc6_status: this.state.doc6_status,
      doc7_status: this.state.doc7_status,
      doc8_status: this.state.doc8_status
    };

    const { errors, isValid } = validateKYC(kycObj);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.editKycVerify(kycObj);
    }
  }

  render() {
    const {
      first_name,
      last_name,
      email,
      country,
      company_name,
      company_address,
      company_country,
      source_of_founding,
      company_website_url,
      applicant_name,
      applicant_country,
      applicant_job_title,
      applicant_phone_no,
      exchange,
      updated_at
    } = this.state.data;
    const {
      doc1_status,
      doc2_status,
      doc3_status,
      doc4_status,
      doc5_status,
      doc6_status,
      doc7_status,
      doc8_status,
      errors
    } = this.state;
    return (
      <Fragment>
        <div className="card p-30">
          <Form>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="sidebar.firstName" />
              </Label>
              <Label className="col-md-9">{first_name}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="sidebar.lastName" />
              </Label>
              <Label className="col-md-9">{last_name}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="sidebar.email" />
              </Label>
              <Label className="col-md-9">{email}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="sidebar.country" />
              </Label>
              <Label className="col-md-9">{country}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="sidebar.userType" />
              </Label>
              <Label className="col-md-9">
                <IntlMessages id="my_account.enterprise" />
              </Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="my_account.registerCompanyName" />
              </Label>
              <Label className="col-md-9">{company_name}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="my_account.companyName" />
              </Label>
              <Label className="col-md-9">{company_address}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="my_account.registerCountry" />
              </Label>
              <Label className="col-md-9">{company_country}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="my_account.sourcesOfFunding" />
              </Label>
              <Label className="col-md-9">{source_of_founding}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="my_account.companyWebsiteUrl" />
              </Label>
              <Label className="col-md-9">{company_website_url}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="my_account.applicantFullName" />
              </Label>
              <Label className="col-md-9">{applicant_name}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="my_account.applicantCountry" />
              </Label>
              <Label className="col-md-9">{applicant_country}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="my_account.applicantJobTitle" />
              </Label>
              <Label className="col-md-9">{applicant_job_title}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="my_account.applicantPhoneNumber" />
              </Label>
              <Label className="col-md-9">{applicant_phone_no}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label htmlFor="status" className="col-md-3">
                <IntlMessages id="sidebar.status" />
              </Label>
              <Label className="col-md-9">
                <KYCStatus status={status} />
              </Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="sidebar.createdBy" />
              </Label>
              <Label className="col-md-9">{updated_at}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-3">
                <IntlMessages id="sidebar.exchange" />
              </Label>
              <Label className="col-md-9">{exchange}</Label>
            </FormGroup>
            <h2 className="mb-15 pb-15">
              <span className="border-bottom default">
                <IntlMessages id="my_account.documents" />
              </span>
            </h2>
            <div className="row">
              <div className="col-md-3 col-sm-6 text-center">
                <Label>
                  <IntlMessages id="my_account.originalCertificateOfBusiness" />
                </Label>
                <div className="img-post mb-15">
                  <img
                    src={require("Assets/img/weather-1.png")}
                    className="img-fluid border-rad-sm"
                    alt="profile post"
                  />
                </div>
                <Label>
                  <IntlMessages id="sidebar.uploadedAt" /> : 2017-10-15
                </Label>
                <FormGroup>
                  <Input
                    type="select"
                    name="doc1_status"
                    className="form-control w-50 mx-auto"
                    value={doc1_status}
                    onChange={this.onChange}
                  >
                    {docStatus &&
                      docStatus.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.doc1_status && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.doc1_status} />
                    </small>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-3 col-sm-6 text-center">
                <Label>
                  <IntlMessages id="my_account.memorandumNArticles" />
                </Label>
                <div className="img-post mb-15">
                  <img
                    src={require("Assets/img/weather-1.png")}
                    className="img-fluid border-rad-sm"
                    alt="profile post"
                  />
                </div>
                <Label>
                  <IntlMessages id="sidebar.uploadedAt" /> : 2017-10-15
                </Label>
                <FormGroup>
                  <Input
                    type="select"
                    name="doc2_status"
                    className="form-control w-50 mx-auto"
                    value={doc2_status}
                    onChange={this.onChange}
                  >
                    {docStatus &&
                      docStatus.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.doc2_status && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.doc2_status} />
                    </small>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-3 col-sm-6 text-center">
                <Label>
                  <IntlMessages id="my_account.ownershipNControl" />
                </Label>
                <div className="img-post mb-15">
                  <img
                    src={require("Assets/img/weather-1.png")}
                    className="img-fluid border-rad-sm"
                    alt="profile post"
                  />
                </div>
                <Label>
                  <IntlMessages id="sidebar.uploadedAt" /> : 2017-10-15
                </Label>
                <FormGroup>
                  <Input
                    type="select"
                    name="doc3_status"
                    className="form-control w-50 mx-auto"
                    value={doc3_status}
                    onChange={this.onChange}
                  >
                    {docStatus &&
                      docStatus.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.doc3_status && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.doc3_status} />
                    </small>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-3 col-sm-6 text-center">
                <Label>
                  <IntlMessages id="my_account.listOfAllDirectors" />
                </Label>
                <div className="img-post mb-15">
                  <img
                    src={require("Assets/img/weather-1.png")}
                    className="img-fluid border-rad-sm"
                    alt="profile post"
                  />
                </div>
                <Label>
                  <IntlMessages id="sidebar.uploadedAt" /> : 2017-10-15
                </Label>
                <FormGroup>
                  <Input
                    type="select"
                    name="doc4_status"
                    className="form-control w-50 mx-auto"
                    value={doc4_status}
                    onChange={this.onChange}
                  >
                    {docStatus &&
                      docStatus.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.doc4_status && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.doc4_status} />
                    </small>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-3 col-sm-6 text-center">
                <Label>
                  <IntlMessages id="my_account.certificateOfIncumbency" />
                </Label>
                <div className="img-post mb-15">
                  <img
                    src={require("Assets/img/weather-1.png")}
                    className="img-fluid border-rad-sm"
                    alt="profile post"
                  />
                </div>
                <Label>
                  <IntlMessages id="sidebar.uploadedAt" /> : 2017-10-15
                </Label>
                <FormGroup>
                  <Input
                    type="select"
                    name="doc5_status"
                    className="form-control w-50 mx-auto"
                    value={doc5_status}
                    onChange={this.onChange}
                  >
                    {docStatus &&
                      docStatus.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.doc5_status && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.doc5_status} />
                    </small>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-3 col-sm-6 text-center">
                <Label>
                  <IntlMessages id="my_account.applicantPassportCover" />
                </Label>
                <div className="img-post mb-15">
                  <img
                    src={require("Assets/img/weather-1.png")}
                    className="img-fluid border-rad-sm"
                    alt="profile post"
                  />
                </div>
                <Label>
                  <IntlMessages id="sidebar.uploadedAt" /> : 2017-10-15
                </Label>
                <FormGroup>
                  <Input
                    type="select"
                    name="doc6_status"
                    className="form-control w-50 mx-auto"
                    value={doc6_status}
                    onChange={this.onChange}
                  >
                    {docStatus &&
                      docStatus.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.doc6_status && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.doc6_status} />
                    </small>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-3 col-sm-6 text-center">
                <Label>
                  <IntlMessages id="my_account.applicantPassportPersonal" />
                </Label>
                <div className="img-post mb-15">
                  <img
                    src={require("Assets/img/weather-1.png")}
                    className="img-fluid border-rad-sm"
                    alt="profile post"
                  />
                </div>
                <Label>
                  <IntlMessages id="sidebar.uploadedAt" /> : 2017-10-15
                </Label>
                <FormGroup>
                  <Input
                    type="select"
                    name="doc7_status"
                    className="form-control w-50 mx-auto"
                    value={doc7_status}
                    onChange={this.onChange}
                  >
                    {docStatus &&
                      docStatus.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.doc7_status && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.doc7_status} />
                    </small>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-3 col-sm-6 text-center">
                <Label>
                  <IntlMessages id="my_account.applicantSelfieWithPhoto" />
                </Label>
                <div className="img-post mb-15">
                  <img
                    src={require("Assets/img/weather-1.png")}
                    className="img-fluid border-rad-sm"
                    alt="profile post"
                  />
                </div>
                <Label>
                  <IntlMessages id="sidebar.uploadedAt" /> : 2017-10-15
                </Label>
                <FormGroup>
                  <Input
                    type="select"
                    name="doc8_status"
                    className="form-control w-50 mx-auto"
                    value={doc8_status}
                    onChange={this.onChange}
                  >
                    {docStatus &&
                      docStatus.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.doc8_status && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.doc8_status} />
                    </small>
                  )}
                </FormGroup>
              </div>
            </div>
            <div className="row offset-md-3">
              <div className="col-md-2">
                <MatButton
                  variant="raised"
                  className="btn-primary text-white"
                  onClick={this.onSubmit}
                >
                  <IntlMessages id="sidebar.btnSaveRole" />
                </MatButton>
              </div>

              <div className="col-md-2">
                <MatButton
                  component={Link}
                  to="/app/my-account/kyc-verify"
                  variant="raised"
                  className="btn-danger text-white"
                >
                  <IntlMessages id="sidebar.btnCancel" />
                </MatButton>
              </div>
            </div>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ kycVerifyRdcer }) => {
  const { data, loading } = kycVerifyRdcer;
  return { data, loading };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      editKycVerify,
      getKycVerifyById
    }
  )(EditEnterpriseKYCVerifyWdgt)
);
