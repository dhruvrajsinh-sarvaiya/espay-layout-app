/**
 * Form Elemets
 */
/**
 * Sms Authentication
 */
import React, { Component } from "react";
import { Card, CardBody } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";

export default class BackupKeyWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      simgUrl: sessionStorage.getItem("simgUrl")
    }
  }

  render() {
    const { simgUrl } = this.state;
    return (
      <div className="border border-dark">
        <div className="downloadappbox offset-md-3 mt-20 row">
          <div className="col-md-12">
            <h3><IntlMessages id="my_account.backUpKey.backUpKeyStep" /></h3>
          </div>
        </div>
        <div className="offset-md-3 downloadappbox row">
          <div className="col-md-8">
            <Card className="marginbox border border-dark">
              <CardBody className="d-flex row">
                <div className="col-md-4">
                  <span className="d-flex justify-content-center align-items-center">
                    <img className="img-fluid d-xs-none" alt="share" width="250" height="250" src={simgUrl} />
                  </span>
                </div>
                <div className="col-md-8">
                  <h3 className="fs-140 fw-bold">
                  <IntlMessages id="my_account.backUpKey.backUpMsg1" />
                  </h3>
                  <span className="fs-50 d-block text-muted">
                  <IntlMessages id="my_account.backUpKey.backUpmsg2" />
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="downloadappbox offset-md-3 row">
          <div className="col-md-12">
            <h3>
            <IntlMessages id="my_account.backUpKey.16DigitKey" />
            </h3>
          </div>
        </div>
      </div>
    );
  }
}