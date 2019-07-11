/**
 * Form Elemets
 */
/**
 * Sms Authentication
 */
import React, { Component } from "react";
// intl messages
import { Card, CardBody } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";

export default class DownloadAppWdgt extends Component {
  render() {
    return (
      <div className="border border-dark p-25">
        <div className="downloadappbox offset-md-3 mt-20 row">
          <div className="col-md-12">
            <h3><IntlMessages id="my_account.downloadApp.downloadInstall" /></h3>
          </div>
        </div>

        <div className="offset-md-3 downloadappbox row">
          <div className="col-md-4">
            <Card className="marginbox border border-dark">
              <a href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8" target="_blank">
              <CardBody className="d-flex">
                <div className="appplaystore">                  
                    <span className="d-flex justify-content-center align-items-center rounded-circle perverbtn p-15 mr-15">
                      <i className="zmdi zmdi-apple" />
                    </span>
                </div>
                <div className="appplaystore">                  
                    <p className="fs-140 fw-bold mb-5"><IntlMessages id="my_account.downloadApp.downloadItFrom" /></p>
                    <span className="fs-50 fw-bold d-block text-muted">
                    <IntlMessages id="my_account.downloadApp.appStore" />
                    </span>
                </div>
              </CardBody>              
              </a>
            </Card>
          </div>

          <div className="col-md-4">
            <Card className="marginbox border border-dark">
              <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank">
              <CardBody className="d-flex">
                <div className="appplaystore">
                  <span className="d-flex justify-content-center align-items-center rounded-circle perverbtn p-15 mr-15">
                    <i className="zmdi zmdi-google-play" />
                  </span>
                </div>
                <div className="appplaystore">
                  <p className="fs-140 fw-bold mb-5"><IntlMessages id="my_account.downloadApp.downloadItFrom" /></p>
                  <span className="fs-50 fw-bold d-block text-muted">
                  <IntlMessages id="my_account.downloadApp.playStore" />
                  </span>
                </div>
              </CardBody>              
              </a>
            </Card>
          </div>
        </div>
        <div className="downloadappbox offset-md-3 row">
          <div className="col-md-12">
            <h3><IntlMessages id="my_account.downloadApp.installedApp" /></h3>
          </div>
        </div>
      </div>
    );
  }
}
