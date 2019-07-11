/* 
    Developer : Nishant Vadgama
    Date : 15-10-2018
    File Comment : Coin List
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import MatButton from "@material-ui/core/Button";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import {
  Form,
  Input,
  FormGroup,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { NotificationManager } from "react-notifications";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import validateCoinConfigRequest from "../../validation/CoinConfig/validateCoinConfigRequest";
import {
  getCoinList,
  addCoin,
  getCoinDetails,
  updateCoin,
  deleteCoin
} from "Actions/CoinConfig";

class CoinList extends Component {
  state = {
    delteCoinID: "",
    coinDetails: {
      WalletTypeName: "",
      Description: "",
      IsDepositionAllow: 0,
      IsDepositionAllowValue: "",
      IsWithdrawalAllow: 0,
      IsWithdrawalAllowValue: "",
      IsTransactionWallet: 0,
      IsTransactionWalletValue: "",
      Status: 0,
      StatusValue: ""
    },
    showDialog: false,
    isEdit: false,
    errors: {}
  };
  // on page load will mount details
  componentWillMount() {
    this.props.getCoinList();
  }
  // on change props show details
  componentWillReceiveProps(nextProps) {
    // validate add coin response
    if (
      nextProps.response &&
      nextProps.response.hasOwnProperty("returnCode") &&
      !nextProps.response.returnCode
    ) {
      NotificationManager.success(nextProps.response.returnMsg);
      this.setState({
        coinDetails: {
          WalletTypeName: "",
          Description: "",
          IsDepositionAllow: 0,
          IsDepositionAllowValue: "",
          IsWithdrawalAllow: 0,
          IsWithdrawalAllowValue: "",
          IsTransactionWallet: 0,
          IsTransactionWalletValue: "",
          Status: 0,
          StatusValue: ""
        },
        showDialog: false,
        isEdit: false,
        errors: {}
      });
      this.props.getCoinList();
    } else if (
      nextProps.response &&
      nextProps.response.hasOwnProperty("returnCode") &&
      nextProps.response.returnCode
    ) {
      NotificationManager.error(nextProps.response.returnMsg);
    }

    //validate get coin details response
    if (
      nextProps.coinDetails &&
      nextProps.coinDetails.hasOwnProperty("returnCode") &&
      !nextProps.coinDetails.returnCode &&
      nextProps.coinDetails.walletTypeMaster
    ) {
      this.setState({
        coinDetails: {
          id: nextProps.coinDetails.walletTypeMaster.id,
          WalletTypeName: nextProps.coinDetails.walletTypeMaster.walletTypeName,
          Description: nextProps.coinDetails.walletTypeMaster.discription,
          IsDepositionAllow:
            nextProps.coinDetails.walletTypeMaster.isDepositionAllow,
          IsDepositionAllowValue: nextProps.coinDetails.walletTypeMaster
            .isDepositionAllow
            ? "1"
            : "0",
          IsWithdrawalAllow:
            nextProps.coinDetails.walletTypeMaster.isWithdrawalAllow,
          IsWithdrawalAllowValue: nextProps.coinDetails.walletTypeMaster
            .isWithdrawalAllow
            ? "1"
            : "0",
          IsTransactionWallet:
            nextProps.coinDetails.walletTypeMaster.isTransactionWallet,
          IsTransactionWalletValue: nextProps.coinDetails.walletTypeMaster
            .isTransactionWallet
            ? "1"
            : "0",
          Status: nextProps.coinDetails.walletTypeMaster.status,
          StatusValue: nextProps.coinDetails.walletTypeMaster.status ? "1" : "0"
        }
      });
    } else if (
      nextProps.coinDetails &&
      nextProps.coinDetails.hasOwnProperty("returnCode") &&
      nextProps.coinDetails.returnCode
    ) {
      NotificationManager.error(nextProps.coinDetails.returnMsg);
    }
  }
  //handle form element change event
  handleFormChange(e) {
    let coinObj = this.state.coinDetails;
    coinObj[e.target.name] = e.target.value;
    if (e.target.name === "IsDepositionAllowValue")
      coinObj["IsDepositionAllow"] = e.target.value === "1" ? 1 : 0;
    else if (e.target.name === "IsWithdrawalAllowValue")
      coinObj["IsWithdrawalAllow"] = e.target.value === "1" ? 1 : 0;
    else if (e.target.name === "IsTransactionWalletValue")
      coinObj["IsTransactionWallet"] = e.target.value === "1" ? 1 : 0;
    else if (e.target.name === "StatusValue")
      coinObj["Status"] = e.target.value === "1" ? 1 : 0;
    this.setState({ coinDetails: coinObj });
  }
  // add coin
  addCoin(e) {
    const { errors, isValid } = validateCoinConfigRequest(
      this.state.coinDetails
    );
    this.setState({ errors });
    if (isValid) {
      this.props.addCoin(this.state.coinDetails);
    }
  }
  // update coin
  updateCoin(e) {
    const { errors, isValid } = validateCoinConfigRequest(
      this.state.coinDetails
    );
    this.setState({ errors });
    if (isValid) {
      this.props.updateCoin(this.state.coinDetails);
    }
  }
  // edit coin button
  onEditCoin(coin) {
    this.props.getCoinDetails(coin.id);
    this.setState({ showDialog: true, isEdit: true });
  }
  // delete coin button
  onDeleteCoin(coin) {
    this.setState({ delteCoinID: coin.id });
    this.refs.deleteConfirmationDialog.open();
  }
  //delete after confirmation
  deleteCoin() {
    this.props.deleteCoin(this.state.delteCoinID);
    this.refs.deleteConfirmationDialog.close();
  }
  // close button click on model
  closeAddCoin() {
    this.setState({
      coinDetails: {
        WalletTypeName: "",
        Description: "",
        IsDepositionAllow: 0,
        IsDepositionAllowValue: "",
        IsWithdrawalAllow: 0,
        IsWithdrawalAllowValue: "",
        IsTransactionWallet: 0,
        IsTransactionWalletValue: "",
        Status: 0,
        StatusValue: ""
      },
      showDialog: false,
      isEdit: false,
      errors: {}
    });
  }
  render() {
    const columns = [
      {
        name: <IntlMessages id={"wallet.titleSr"} />
      },
      {
        name: <IntlMessages id={"wallet.titleCoinName"} />
      },
      {
        name: <IntlMessages id={"wallet.titleDesc"} />
      },
      {
        name: <IntlMessages id={"wallet.titleDepostition"} />
      },
      {
        name: <IntlMessages id={"wallet.titleWithdraw"} />
      },
      {
        name: <IntlMessages id={"wallet.titleTransaction"} />
      },
      {
        name: <IntlMessages id={"wallet.titleStatus"} />
      },
      {
        name: <IntlMessages id={"table.action"} />
      }
    ];
    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      selectableRows: false,
      customToolbar: () => {
        return (
          <MatButton
            variant="raised"
            className="btn-primary text-white"
            onClick={e => this.setState({ showDialog: true })}
          >
            <IntlMessages id="wallet.btnAddCoin" />
          </MatButton>
          // <a
          //   href="javascript:void(0)"
          //   onClick={e => this.setState({ showDialog: true })}
          //   color="primary"
          //   className="caret btn-sm mr-10"
          // >
          //   <IntlMessages id="wallet.btnAddCoin" />{" "}
          //   <i className="zmdi zmdi-plus" />
          // </a>
        );
      }
    };
    return (
      <div>
        {this.props.listLoader && <JbsSectionLoader />}
        {this.props.coinList && (
          <MUIDataTable
            data={this.props.coinList.map((coin, key) => {
              return [
                key + 1,
                coin.walletTypeName,
                coin.discription,
                coin.isDepositionAllow ? "YES" : "NO",
                coin.isWithdrawalAllow ? "YES" : "NO",
                coin.isTransactionWallet ? "YES" : "NO",
                coin.status ? "Active" : "Inactive",
                <div className="list-action">
                  <a
                    className="mr-10"
                    href="javascript:void(0)"
                    onClick={() => this.onEditCoin(coin)}
                  >
                    <i className="ti-pencil" />
                  </a>
                  <a
                    href="javascript:void(0)"
                    onClick={() => this.onDeleteCoin(coin)}
                  >
                    <i className="ti-close" />
                  </a>
                </div>
              ];
            })}
            columns={columns}
            options={options}
          />
        )}
        <Modal
          isOpen={this.state.showDialog}
          toggle={e => this.setState({ showDialog: !this.state.showDialog })}
        >
          <ModalHeader
            toggle={e => this.setState({ showDialog: !this.state.showDialog })}
          >
            {this.state.isEdit ? (
              <IntlMessages id={"wallet.titleEditCoin"} />
            ) : (
              <IntlMessages id={"wallet.titleAddCoin"} />
            )}
          </ModalHeader>
          <ModalBody
            style={{
              maxHeight: "calc(100vh - 210px)",
              overflowY: "auto"
            }}
          >
            {this.props.loading && <JbsSectionLoader />}
            <Form>
              <FormGroup>
                <Label for="WalletTypeName">
                  <IntlMessages id={"wallet.titleCoinName"} />
                </Label>
                <Input
                  type="text"
                  name="WalletTypeName"
                  id="WalletTypeName"
                  placeholder="Coin Name"
                  value={this.state.coinDetails.WalletTypeName}
                  onChange={e => {
                    this.handleFormChange(e);
                  }}
                />
                {this.state.errors.WalletTypeName && (
                  <span className="text-danger px-10">
                    <IntlMessages id={this.state.errors.WalletTypeName} />
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="Description">
                  <IntlMessages id={"wallet.titleDesc"} />
                </Label>
                <Input
                  type="text"
                  name="Description"
                  id="Description"
                  placeholder="Description"
                  value={this.state.coinDetails.Description}
                  onChange={e => {
                    this.handleFormChange(e);
                  }}
                />
                {this.state.errors.Description && (
                  <span className="text-danger px-10">
                    <IntlMessages id={this.state.errors.Description} />
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label for="IsDepositionAllow">
                  <IntlMessages id={"wallet.titleDepostition"} />
                </Label>
                <Input
                  type="select"
                  name="IsDepositionAllowValue"
                  id="IsDepositionAllow"
                  value={this.state.coinDetails.IsDepositionAllowValue}
                  onChange={e => {
                    this.handleFormChange(e);
                  }}
                >
                  <option value="">Select</option>
                  <option value="1">YES</option>
                  <option value="0">NO</option>
                </Input>
                {this.state.errors.IsDepositionAllow && (
                  <span className="text-danger px-10">
                    <IntlMessages id={this.state.errors.IsDepositionAllow} />
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="IsWithdrawalAllow">
                  <IntlMessages id={"wallet.titleWithdraw"} />
                </Label>
                <Input
                  type="select"
                  name="IsWithdrawalAllowValue"
                  id="IsWithdrawalAllow"
                  value={this.state.coinDetails.IsWithdrawalAllowValue}
                  onChange={e => {
                    this.handleFormChange(e);
                  }}
                >
                  <option value="">Select</option>
                  <option value="1">YES</option>
                  <option value="0">NO</option>
                </Input>
                {this.state.errors.IsWithdrawalAllow && (
                  <span className="text-danger px-10">
                    <IntlMessages id={this.state.errors.IsWithdrawalAllow} />
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="IsTransactionWallet">
                  <IntlMessages id={"wallet.titleTransaction"} />
                </Label>
                <Input
                  type="select"
                  name="IsTransactionWalletValue"
                  id="IsTransactionWallet"
                  value={this.state.coinDetails.IsTransactionWalletValue}
                  onChange={e => {
                    this.handleFormChange(e);
                  }}
                >
                  <option value="">Select</option>
                  <option value="1">YES</option>
                  <option value="0">NO</option>
                </Input>
                {this.state.errors.IsTransactionWallet && (
                  <span className="text-danger px-10">
                    <IntlMessages id={this.state.errors.IsTransactionWallet} />
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="Status">
                  <IntlMessages id={"wallet.titleStatus"} />
                </Label>
                <Input
                  type="select"
                  name="StatusValue"
                  id="Status"
                  value={this.state.coinDetails.StatusValue}
                  onChange={e => {
                    this.handleFormChange(e);
                  }}
                >
                  <option value="">Select</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Input>
                {this.state.errors.Status && (
                  <span className="text-danger px-10">
                    <IntlMessages id={this.state.errors.Status} />
                  </span>
                )}
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            {this.state.isEdit
              ? !this.props.loading && (
                  <Button
                    variant="raised"
                    className="text-white btn-success"
                    onClick={e => this.updateCoin(e)}
                  >
                    <IntlMessages id="button.update" />
                  </Button>
                )
              : !this.props.loading && (
                  <Button
                    variant="raised"
                    className="text-white btn-success"
                    onClick={e => this.addCoin(e)}
                  >
                    <IntlMessages id="button.add" />
                  </Button>
                )}
            <Button
              variant="raised"
              className="text-white btn-danger"
              onClick={e => this.closeAddCoin(e)}
            >
              <IntlMessages id="button.cancel" />
            </Button>
          </ModalFooter>
        </Modal>
        <DeleteConfirmationDialog
          ref="deleteConfirmationDialog"
          title="Are You Sure Want To Delete?"
          message="Are You Sure Want To Delete Permanently This Data."
          onConfirm={() => this.deleteCoin()}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ coinConfig }) => {
  const { coinList, response, coinDetails, loading, listLoader } = coinConfig;
  return { coinList, response, coinDetails, loading, listLoader };
};

export default connect(
  mapStateToProps,
  {
    getCoinList,
    addCoin,
    getCoinDetails,
    updateCoin,
    deleteCoin
  }
)(CoinList);
