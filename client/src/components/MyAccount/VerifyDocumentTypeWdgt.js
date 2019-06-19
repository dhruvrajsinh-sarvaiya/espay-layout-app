/**
 * Active User Component
 */
import React, { Component, Fragment } from "react";

// intl messages
import IntlMessages from "Util/IntlMessages";
import MatButton from "@material-ui/core/Button";

class VerifyDocumentTypeWdgt extends Component {
  constructor(props) {
    super(props);
    this.onChangePersonalVerificationView = this.onChangePersonalVerificationView.bind(this);
    this.onChangeEnterpriseVerificationView = this.onChangeEnterpriseVerificationView.bind(this);
  }
  /**
   * On onChangePersonalVerificationView
   */
  onChangePersonalVerificationView() {
    this.props.changeComponentView("View3");
  }

  /**
   * On onChangeEnterpriseVerificationView
   */
  onChangeEnterpriseVerificationView() {
    this.props.changeComponentView("View4");
  }

  render() {
    return (
      <Fragment>
        <div className="mb-0">
          <h2 className="heading pb-10 mb-20 border-bottom">
            <IntlMessages id="my_account.selIdentityVerifyType" />
          </h2>
          <MatButton
            className="p-0 w-100 text-secondary mb-20"
            onClick={this.onChangePersonalVerificationView}
          >         
            <div className="w-100  p-15 text-left border media bg-light">
              <div className="media-left">
                <i className="material-icons mr-10 font-3x">assignment_ind</i>
              </div>
              <div className="media-body">
                <h2>
                  <IntlMessages id="sidebar.personal" />
                </h2>
                <p className="m-0">
                  <span className="mr-10">
                    <IntlMessages id="my_account.personalInfo" /> ->{" "}
                  </span>
                  <span className="mr-10">
                    <IntlMessages id="my_account.processing" /> ->{" "}
                  </span>
                  <span>
                    <IntlMessages id="my_account.approval" />
                  </span>
                </p>
              </div>
            </div>
            </MatButton>
          {/* </Link> */}
          <MatButton
            className="p-0 m-0 w-100 text-secondary mb-20"
            onClick={this.onChangeEnterpriseVerificationView}
          >     
            <div className="p-0 w-100  p-15 text-left border media bg-light">
              <div className="media-left">
                <i className="material-icons mr-10 font-3x">home</i>
              </div>
              <div className="media-body">
                <h2>
                  <IntlMessages id="sidebar.enterprise" />
                </h2>
                <p className="m-0">
                  <span className="mr-10">
                    <IntlMessages id="my_account.contactInfo" /> ->{" "}
                  </span>
                  <span className="mr-10">
                    <IntlMessages id="my_account.companyInfo" /> ->{" "}
                  </span>
                  <span className="mr-10">
                    <IntlMessages id="my_account.processing3" /> ->{" "}
                  </span>
                  <span>
                    <IntlMessages id="my_account.contactUS4" />
                  </span>
                </p>
              </div>
            </div>
            </MatButton>
          <p>
            <span className="text-warning mr-10">
              <IntlMessages id="sidebar.notice" />
            </span>
            <IntlMessages id="my_account.docVerifyNotice" />
          </p>
        </div>
      </Fragment>
    );
  }
}

export default VerifyDocumentTypeWdgt;
