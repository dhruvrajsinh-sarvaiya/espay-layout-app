/* 
    Developer : Nishant Vadgama
    Date : 01-10-2018
    File Comment : Decentralize Address Generation model component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import SwipeableViews from "react-swipeable-views";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { getCurrency, genAddressRequest } from "Actions/DecentAddressGen";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {children}
    </Typography>
  );
}
const validateStep1Request = require("../../validation/DecentAddressGen/validateStep1");
const validateStep2Request = require("../../validation/DecentAddressGen/validateStep2");

class AdddressGenerationProcess extends Component {
  state = {
    activeIndex: 0,
    selectedcurrency: "",
    password: "",
    filename: "",
    file: {},
    privatekey: "",
    showStep1: true,
    showStep2: false,
    showStep3: false,
    showStep4: false,
    showPassword: false,
    showQRCode: false,
    AddressQRCodeLink: "",
    PrivateKeyQRCodeLink: "",
    errors: {}
  };

  componentWillMount() {
    this.props.getCurrency();
  }

  togglePassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }
  onCancel() {
    this.setState({ errors: {} });
  }
  onClickNext1() {
    const { errors, isValid } = validateStep1Request(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      this.setState({
        showStep2: true,
        showStep1: false,
        showStep3: false,
        showStep4: false
      });
    }
  }
  onClickNext2() {
    const { errors, isValid } = validateStep2Request(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      this.props.genAddressRequest(this.state);
      this.setState({
        showStep2: false,
        showStep1: false,
        showStep3: true,
        showStep4: false
      });
    }
  }
  onClickNext3() {
    this.setState({
      showStep2: false,
      showStep1: false,
      showStep3: false,
      showStep4: true
    });
  }
  onChangeFile(event) {
    let file = event.target.files[0];
    this.setState({ file: file, filename: file.name });
    let reader = new FileReader();

    if (file) {
      reader.readAsText(file);
    }
  }
  onShowQRCode() {
    this.setState({
      AddressQRCodeLink:
        "https://chart.googleapis.com/chart?cht=qr&chl=" +
        encodeURI(document.getElementById("address-label").innerHTML) +
        "&chs=270x270&chld=L|0",
      PrivateKeyQRCodeLink:
        "https://chart.googleapis.com/chart?cht=qr&chl=" +
        encodeURI(document.getElementById("privatekey-label").innerHTML) +
        "&chs=270x270&chld=L|0",
      showQRCode: true
    });
  }
  onCloseQRCode = () => {
    this.setState({ showQRCode: false });
  };
  render() {
    const coin = [
      { name: "BCH" },
      { name: "BTC" },
      { name: "BTG" },
      { name: "LTC" },
      { name: "ZEC" }
    ];
    return (
      <div className="row justify-content-center">
        <JbsCollapsibleCard
          colClasses="col-sm-12 col-md-8 col-xl-4"
          contentCustomClasses="p-30"
          fullblock
        >
          {this.state.showStep1 && (
            <Form>
              <FormGroup>
                <Label className="text-muted">
                  <IntlMessages id="wallet.coinTitle" />
                </Label>
                <Input
                  className=""
                  type="select"
                  name="currency"
                  id="currency"
                  value={this.state.selectedcurrency}
                  onChange={e =>
                    this.setState({ selectedcurrency: e.target.value })
                  }
                >
                  <option value="">
                    <IntlMessages id="wallet.selectCoin" />
                  </option>
                  {coin.map((value, key) => (
                    <option key={key} value={value.name}>
                      {value.name}
                    </option>
                  ))}
                </Input>
                {this.state.errors.selectedcurrency && (
                  <span className="text-danger">
                    {" "}
                    <IntlMessages id={this.state.errors.selectedcurrency} />
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label className="text-muted">
                  <IntlMessages id="wallet.yourPassword" />
                </Label>
                <InputGroup>
                  <Input
                    id="password"
                    type={this.state.showPassword ? "text" : "password"}
                    value={this.state.password}
                    placeholder="Password"
                    onChange={e => this.setState({ password: e.target.value })}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      className="border-0 rounded-0"
                      color="primary"
                      onClick={e => this.togglePassword(e)}
                    >
                      {this.state.showPassword ? (
                        <i className="zmdi zmdi-eye-off" />
                      ) : (
                        <i className="zmdi zmdi-eye" />
                      )}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <InputGroupAddon addonType="append" />
                {this.state.errors.password && (
                  <span className="text-danger">
                    {" "}
                    <IntlMessages id={this.state.errors.password} />
                  </span>
                )}
              </FormGroup>
              <FormGroup className="mb-10">
                <div className="justify-content-center d-flex">
                  <Button
                    className="mx-10 border-0 rounded-0 w-30"
                    color="danger"
                    onClick={e => this.onCancel(e)}
                  >
                    <IntlMessages id={"button.cancel"} />
                  </Button>
                  {this.state.selectedcurrency &&
                    this.state.password && (
                      <Button
                        className="mx-10 border-0 rounded-0 w-20"
                        color="primary"
                        onClick={e => this.onClickNext1(e)}
                      >
                        <IntlMessages id={"button.next"} />
                      </Button>
                    )}
                </div>
              </FormGroup>
            </Form>
          )}
          {this.state.showStep2 && (
            <Form>
              <FormGroup>
                <Tabs
                  value={this.state.activeIndex}
                  onChange={(e, value) => this.setState({ activeIndex: value })}
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                >
                  <Tab label="Keystore File" />
                  <Tab label="Private Key" />
                </Tabs>
              </FormGroup>
              <FormGroup>
                <SwipeableViews
                  axis={"x"}
                  index={this.state.activeIndex}
                  onChangeIndex={index => this.setState({ activeIndex: index })}
                >
                  <TabContainer>
                    <Input
                      type="file"
                      name="file"
                      id="File"
                      accept="*.*"
                      onChange={e => this.onChangeFile(e)}
                    />
                    {this.state.errors.file && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.file} />
                      </span>
                    )}
                  </TabContainer>
                  <TabContainer>
                    <Input
                      className=""
                      type="text"
                      name="privatekey"
                      id="privatekey"
                      placeholder="Private Key"
                      value={this.state.privatekey}
                      onChange={e =>
                        this.setState({ privatekey: e.target.value })
                      }
                    />
                    {this.state.errors.privatekey && (
                      <span className="text-danger">
                        {" "}
                        <IntlMessages id={this.state.errors.privatekey} />
                      </span>
                    )}
                  </TabContainer>
                </SwipeableViews>
              </FormGroup>
              <FormGroup>
                <div className="text-center">
                  <p className="text-muted">
                    <IntlMessages id="wallet.notice" />
                  </p>
                </div>
              </FormGroup>
              <FormGroup className="mb-10">
                <div className="justify-content-center d-flex">
                  {(this.state.filename || this.state.privatekey) && (
                    <Button
                      className="mx-10 border-0 rounded-0"
                      color="primary"
                      onClick={e => this.onClickNext2(e)}
                    >
                      <IntlMessages id="wallet.btnContinue" />
                    </Button>
                  )}
                </div>
              </FormGroup>
            </Form>
          )}
          {this.state.showStep3 && (
            <Form>
              <FormGroup>
                <h3 className="text-center">
                  <IntlMessages id="wallet.headAddress" />
                </h3>
              </FormGroup>
              <FormGroup className="activity-board-wrapper">
                <div className="text-center comment-box p-20">
                  <Label className="mb-0" id="address-label">
                    {"0X56a6df5a6sdf5asdf123123123asdfd"}
                  </Label>
                </div>
              </FormGroup>
              <FormGroup>
                <h3 className="text-center">
                  <IntlMessages id="wallet.headPrivatekey" />
                </h3>
              </FormGroup>
              <FormGroup className="activity-board-wrapper">
                <div className="text-center comment-box p-20">
                  <p className="mb-0" id="privatekey-label">
                    {"71b7ea974dc49ceea18b66b5609c55001d420b94961e3"}
                  </p>
                </div>
              </FormGroup>
              <FormGroup>
                <h3 className="text-center">
                  <IntlMessages id="wallet.headBalance" />
                </h3>
              </FormGroup>
              <FormGroup className="activity-board-wrapper">
                <div className="text-center comment-box p-20">
                  <Label className="mb-0">{"0 ETH"}</Label>
                </div>
              </FormGroup>
              <FormGroup className="mb-10">
                <div className="justify-content-center d-flex">
                  <Button
                    className="mx-10 border-0 rounded-0"
                    color="primary"
                    onClick={e => this.onShowQRCode(e)}
                  >
                    <IntlMessages id={"wallet.AGButtonQRCode"} />
                  </Button>
                </div>
              </FormGroup>
            </Form>
          )}
          <Dialog
            open={this.state.showQRCode}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.onCloseQRCode}
          >
            <div className="d-flex">
              <div className="col-sm-6">
                <img
                  className="p-20 w-100"
                  src={this.state.AddressQRCodeLink}
                  alt="Img"
                />
                <h4 className="text-center mb-20">Address</h4>
              </div>
              <div className="col-sm-6">
                <img
                  className="p-20 w-100"
                  src={this.state.PrivateKeyQRCodeLink}
                  alt="Img"
                />
                <h4 className="text-center mb-20">Private Key</h4>
              </div>
            </div>
          </Dialog>
        </JbsCollapsibleCard>
      </div>
    );
  }
}
const mapStateToProps = ({ decentAddressGenReducer }) => {
  const { showLoading, currencies } = decentAddressGenReducer;
  return { showLoading, currencies };
};

export default connect(
  mapStateToProps,
  {
    getCurrency,
    genAddressRequest
  }
)(AdddressGenerationProcess);
