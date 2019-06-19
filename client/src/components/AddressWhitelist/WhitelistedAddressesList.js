import React, { Component, Fragment } from "react";
import { Row, Col, Button } from "reactstrap";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { JbsCard } from "Components/JbsCard";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import { NotificationManager } from "react-notifications";
import { injectIntl } from 'react-intl';
import {
    getAllWhithdrawalAddress,
    addToWhitelist,
    removeWhitelist,
    deleteAddress
} from "Actions/AddressWhitelist";

class WhitelistedAddressesList extends Component {
    state = {
        showConfirmation: false,
        showWhitelistedOnly: false,
        selectedAddresses: [],
        addressList: [],
        filterList: [],
        rowsPerPage: 10,
    };

    componentWillMount() {
        this.props.getAllWhithdrawalAddress();
    }

    componentWillReceiveProps(nextProps) {
        // on get address list
        if (nextProps.addresses && nextProps.addresses.length) {
            this.setState({
                addressList: nextProps.addresses,
                filterList: nextProps.addresses
            });
        } else if (nextProps.addresses && nextProps.addresses.length === 0) {
            this.setState({
                addressList: nextProps.addresses,
                filterList: nextProps.addresses
            });
        }

        // on add, remove, delete response check
        if (nextProps.response.ReturnCode === 0) {
            NotificationManager.success(nextProps.response.ReturnMsg);
            this.setState({ selectedAddresses: [] });
            this.props.getAllWhithdrawalAddress();
        } else if (nextProps.response.ReturnCode === 1) {
            NotificationManager.error(nextProps.response.ReturnMsg);
        }
    }

    onSelectAllAddresses(e) {
        if (e.target.checked) {
            let tempArry = [];
            this.state.filterList.forEach(function (address) {
                tempArry.push(address.BeneficiaryID);
            });
            this.setState({ selectedAddresses: tempArry });
        } else {
            this.setState({ selectedAddresses: [] });
        }
    }

    onSelectAddress(e, recId) {
        let tempArry = this.state.selectedAddresses;
        //checked if not in list
        if (e.target.checked && tempArry.indexOf(recId) === -1) {
            tempArry.push(recId);
        } else if (!e.target.checked) {
            let pos = tempArry.indexOf(recId);
            if (pos !== -1) tempArry.splice(pos, 1);
        }
        this.setState({ selectedAddresses: tempArry });
    }
    handleAddWhitelist() {
        if (this.state.selectedAddresses.length)
            this.props.addToWhitelist(this.state.selectedAddresses);
    }
    handleRemove() {
        if (this.state.selectedAddresses.length)
            this.props.removeWhitelist(this.state.selectedAddresses);
    }
    handleDelete() {
        if (this.state.selectedAddresses.length) {
            this.props.deleteAddress(this.state.selectedAddresses);
            this.setState({ showConfirmation: false });
        }
    }

    showWhitelistedOnly(e) {
        var updatedList = this.state.addressList;
        if (e.target.checked)
            updatedList = updatedList.filter(function (address) {
                return address.IsWhiteListed === 1;
            });
        else updatedList = this.state.addressList;
        this.setState({
            filterList: updatedList,
            showWhitelistedOnly: !this.state.showWhitelistedOnly
        });
    }

    render() {
        const intl = this.props.intl;
        const title = this.props.title;
        const columns = [
            { name: "", options: { sort: false, filter: false } },
            { name: intl.formatMessage({ id: "wallet.tblLabelCoin" }) },
            { name: intl.formatMessage({ id: "wallet.tblLabelLabel" }) },
            { name: intl.formatMessage({ id: "wallet.tblLabelAddress" }) },
            {
                name: intl.formatMessage({ id: "wallet.tblLabelWhitelisted" }),
                options: { sort: true, filter: false }
            }
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            viewColumns: false,
            print: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />
                }
            },
            rowsPerPage: this.state.rowsPerPage,
            onChangeRowsPerPage: (numberOfRow) => {
                this.setState({ rowsPerPage: numberOfRow })
            }
        };
        return (
            <Fragment>
                {this.props.listLoading && <JbsSectionLoader />}
                <JbsCard>
                    <div className="row p-20">
                        <div className="col-md-4 col-sm-12 align-items-start">
                            <Row>
                                <div className="w-20 col-sm-1 col-12">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    this.state.selectedAddresses.length ? true : false
                                                }
                                                onChange={e => this.onSelectAllAddresses(e)}
                                                value="all"
                                                color="primary"
                                            />
                                        }
                                    />
                                </div>
                                <div className="w-80 col-sm-4 col-12">
                                    <Button
                                        size="small"
                                        className={
                                            this.state.selectedAddresses.length
                                                ? "border-0 rounded-0 my-10 perverbtn"
                                                : "disabled my-10 border-0 rounded-0 perverbtn"
                                        }
                                        onClick={() => this.handleAddWhitelist()}
                                    >
                                        <IntlMessages id="wallet.btnAddToWhitelist" />
                                    </Button>
                                </div>
                                <div className="w-80 col-sm-4 col-12">
                                    <Button
                                        size="small"
                                        className={
                                            this.state.selectedAddresses.length
                                                ? "my-10 border-0 rounded-0 perverbtn"
                                                : "disabled my-10 border-0 rounded-0 perverbtn"
                                        }
                                        color="primary"
                                        onClick={() => this.handleRemove()}
                                    >
                                        <IntlMessages id="wallet.btnRemoceWhitelist" />
                                    </Button>
                                </div>
                                <div className="w-80 col-sm-3 col-12">
                                    <Button
                                        size="small"
                                        className={
                                            this.state.selectedAddresses.length
                                                ? "my-10 border-0 rounded-0 perverbtn"
                                                : "disabled my-10 border-0 rounded-0 perverbtn"
                                        }
                                        color="primary"
                                        onClick={e =>
                                            this.state.selectedAddresses.length
                                                ? this.setState({ showConfirmation: true })
                                                : ""
                                        }
                                    >
                                        <IntlMessages id="button.delete" />
                                    </Button>
                                </div>
                            </Row>
                        </div>

                        <div className="col-md-4 col-sm-12 col-12 offset-md-4 align-items-end w-30">
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={this.state.showWhitelistedOnly}
                                            onChange={e => this.showWhitelistedOnly(e)}
                                        />
                                    }
                                    label={<IntlMessages id="wallet.onlyWhitelisted" />}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <JbsCollapsibleCard fullBlock>
                        <div
                            className={
                                this.props.darkMode
                                    ? "DepositWithdrawHistory-darkmode tbl_overflow_auto"
                                    : "DepositWithdrawHistory tbl_overflow_auto"
                            }
                        >
                            <MUIDataTable
                                title={title}
                                data={this.state.filterList.map(item => {
                                    return [
                                        <Checkbox
                                            checked={
                                                this.state.selectedAddresses.indexOf(
                                                    item.BeneficiaryID
                                                ) >= 0
                                                    ? true
                                                    : false
                                            }
                                            onChange={e =>
                                                this.onSelectAddress(e, item.BeneficiaryID)
                                            }
                                            color="primary"
                                        />,
                                        item.CoinName,
                                        item.Name,
                                        item.Address,
                                        item.IsWhiteListed ? intl.formatMessage({ id: "sidebar.btnYes" }) : intl.formatMessage({ id: "sidebar.btnNo" })
                                    ];
                                })}
                                columns={columns}
                                options={options}
                            />
                        </div>
                    </JbsCollapsibleCard>
                </JbsCard>
                <Dialog
                    open={this.state.showConfirmation}
                    onClose={e => this.setState({ showConfirmation: false })}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogContent>
                        <DialogContentText>
                            <Row>
                                <Col sm={12}>
                                    <h2>{<IntlMessages id={"wallet.deleteConf"} />}</h2>
                                </Col>
                            </Row>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={e => this.setState({ showConfirmation: false })}
                            color="danger"
                            autoFocus
                        >
                            <IntlMessages id={"button.cancel"} />
                        </Button>
                        <Button
                            onClick={() => this.handleDelete()}
                            color="primary"
                            autoFocus
                        >
                            <IntlMessages id={"wallet.btnAgree"} />
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapDispatchToProps = ({ addressWhitelist, settings }) => {
    const { darkMode } = settings;
    const { addresses, listLoading, response } = addressWhitelist;
    return { addresses, listLoading, response, darkMode };
};

export default connect(
    mapDispatchToProps,
    {
        getAllWhithdrawalAddress,
        addToWhitelist,
        removeWhitelist,
        deleteAddress
    }
)(injectIntl(WhitelistedAddressesList));
