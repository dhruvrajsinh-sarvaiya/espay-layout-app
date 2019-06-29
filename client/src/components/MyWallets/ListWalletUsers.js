/* 
    Developer : Nishant Vadgama
    Date : 09-01-2019
    File Comment : list of wallet users
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import MUIDataTable from "mui-datatables";
import IconButton from '@material-ui/core/IconButton';
import { NotificationManager } from 'react-notifications';
import { Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, } from 'reactstrap';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
//add wallet user request validator
const validateAddUserRequest = require('../../validation/MyWallets/AddUserRequestValidator');
//initial state
const initState = {
    currency: "",
    showModel: false,
    addNewUserDetails: {
        WalletID: "",
        RoleId: 2,
        Message: "",
        Email: "",
        RequestType: 1,
        ChannelId: 21
    },
    userDetails: {},
    errors: {},
    showConfirmation: false,
}
//my wallets methods...
import {
    getWalletUserList,
    addWalletUser
} from 'Actions/MyWallets';
//button size
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
};
class ListWalletUsers extends Component {
    state = initState;
    //will mount fetch data
    componentWillMount() {
        let walletID = this.props.location.state.walletID;
        if (walletID) {
            let tempObj = this.state.addNewUserDetails;
            tempObj["WalletID"] = walletID;
            this.setState({ addNewUserDetails: tempObj });
            this.props.getWalletUserList(walletID);
        } else {
            //redirect to main page
            this.props.history.push('/app/my-wallets');
        }
    }
    //on change props
    componentWillReceiveProps(nextProps) {
        if (nextProps.addUserResponse.hasOwnProperty("ReturnCode")) {
            if (nextProps.addUserResponse.ReturnCode == 0) {
                NotificationManager.success(nextProps.addUserResponse.ReturnMsg);
                this.setState({
                    showModel: false,
                    errors: {},
                    addNewUserDetails: {
                        WalletID: this.state.addNewUserDetails.WalletID,
                        RoleId: 2,
                        Message: "",
                        Email: "",
                        RequestType: 1,
                        ChannelId: 21
                    },
                });
            } else if (nextProps.addUserResponse.ReturnCode == 1) {
                NotificationManager.error(<IntlMessages id={"apiWalletErrCode." + nextProps.addUserResponse.ErrorCode} />);
            }
        }
    }
    //onchange handle 
    onChangeHandler(e, key) {
        this.setState({ [key]: e.target.value });
    }
    //onchange add object
    onChangeAddNewUserDetails(key, value) {
        let tempObj = this.state.addNewUserDetails;
        tempObj[key] = value;
        this.setState({ addNewUserDetails: tempObj });
    }
    //toggle model show hide
    toggleModel = () => {
        this.setState({
            showModel: !this.state.showModel,
            errors: {},
            addNewUserDetails: {
                WalletID: this.state.addNewUserDetails.WalletID,
                RoleId: 2,
                Message: "",
                Email: "",
                RequestType: 1,
                ChannelId: 21
            },
        });
    }
    //add user to wallet
    addNewUser() {
        const { errors, isValid } = validateAddUserRequest(this.state.addNewUserDetails);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.addWalletUser(this.state.addNewUserDetails);
        }
    }
    //remove user from wallet
    removeUser() {
        if (this.state.userDetails.hasOwnProperty("Email")) {
            const { userDetails } = this.state;
            let tempObj = this.state.addNewUserDetails;
            tempObj["RequestType"] = 2;
            tempObj["Message"] = userDetails.WalletName;
            tempObj["Email"] = userDetails.Email;
            this.props.addWalletUser(tempObj);
            this.setState({ showConfirmation: false, userDetails: {} });
        }
    }
    //show Confirmation Dialog
    showConfirmationDialog(details) {
        this.setState({ showConfirmation: true, userDetails: details });
    }
    //render component
    render() {
        const columns = [
            {
                name: <IntlMessages id="sidebar.colUserName" />,
                options: { filter: false, sort: true }
            },
            {
                name: <IntlMessages id="sidebar.email" />,
                options: { filter: false, sort: true }
            },
            {
                name: <IntlMessages id="wallet.RoleName" />,
                options: { filter: true, sort: true }
            },
            {
                name: <IntlMessages id="sidebar.colActions" />,
                options: { filter: false, sort: false }
            },
        ];
        const options = {
            filterType: 'dropdown',
            responsive: 'scroll',
            selectableRows: false,
            download: false,
            viewColumns: false,
            print: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customToolbar: () => {
                return <IconButton className="" aria-label="add user" onClick={(e) => this.setState({ showModel: true })}>
                    <i className="zmdi zmdi-account-add"></i>
                </IconButton>
            },
        };
        const { walletUserList } = this.props;
        const { addNewUserDetails, errors } = this.state;
        return (
            <JbsCollapsibleCard
                colClasses="col-sm-12"
                fullBlock>
                {this.props.loading && <JbsSectionLoader />}
                <div className={this.props.darkMode ? 'DepositWithdrawHistory-darkmode' : 'DepositWithdrawHistory'}>
                    <MUIDataTable
                        title={<IconButton className="" aria-label="back" onClick={(e) => this.props.history.push('/app/my-wallets')}>
                            <i className="zmdi zmdi-mail-reply"></i>
                        </IconButton>}
                        data={walletUserList.map(user => {
                            return [
                                user.UserName,
                                user.Email,
                                user.RoleName,
                                <div className="list-action">
                                    <a
                                        href="javascript:void(0)"
                                        onClick={e => this.showConfirmationDialog(user)}
                                    >
                                        <i className="ti-trash" />
                                    </a>
                                </div>,
                            ]
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                {this.props.loading && <JbsSectionLoader />}
                <Modal isOpen={this.state.showModel} toggle={() => this.toggleModel()}>
                    <ModalHeader toggle={() => this.toggleModel()}>
                        <IntlMessages id="button.addNewUser" />
                    </ModalHeader>
                    <ModalBody>
                        {this.props.loading && <JbsSectionLoader />}
                        <Form>
                            <FormGroup>
                                <Label for="Email"><IntlMessages id="my_account.editProfile.email" /></Label>
                                <IntlMessages id="my_account.editProfile.email">
                                    {(placeholder) => <Input
                                        type="email"
                                        name="Email"
                                        id="Email"
                                        placeholder={placeholder}
                                        autoComplete="off"
                                        value={addNewUserDetails.Email}
                                        onChange={(e) => this.onChangeAddNewUserDetails('Email', e.target.value)}
                                    />}
                                </IntlMessages>
                                {errors.hasOwnProperty("email") && <span className="text-danger"><IntlMessages id={errors.email} /></span>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="Message"><IntlMessages id="wallet.InviteMessage" /></Label>
                                <IntlMessages id="wallet.invitePlaceholder">
                                    {(placeholder) => <Input
                                        type="textarea"
                                        name="Message"
                                        id="Message"
                                        placeholder={placeholder}
                                        value={addNewUserDetails.Message}
                                        onChange={(e) => this.onChangeAddNewUserDetails('Message', e.target.value)}
                                    />}
                                </IntlMessages>
                                {errors.hasOwnProperty("message") && <span className="text-danger"><IntlMessages id={errors.message} /></span>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="RoleId"><IntlMessages id="wallet.Role" /></Label>
                                <Input
                                    type="select"
                                    name="RoleId"
                                    id="RoleId"
                                    value={addNewUserDetails.RoleId}
                                    onChange={(e) => this.onChangeAddNewUserDetails('RoleId', e.target.value)}
                                >
                                    <IntlMessages id="wallet.Admin">
                                        {(optionValue) => <option value="2">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.Spender">
                                        {(optionValue) => <option value="3">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.Viewer">
                                        {(optionValue) => <option value="4">{optionValue}</option>}
                                    </IntlMessages>
                                </Input>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    {!this.props.loading && <ModalFooter>
                        <Button variant="raised" className="text-white btn-success" onClick={() => this.addNewUser()}><IntlMessages id="button.add" /></Button>
                        <Button variant="raised" className="text-white btn-danger" onClick={() => this.toggleModel()}><IntlMessages id="button.cancel" /></Button>
                    </ModalFooter>}
                </Modal>
                <Dialog
                    open={this.state.showConfirmation}
                    onClose={e => this.setState({ showConfirmation: false })}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogContent>
                        <DialogContentText>
                            <h2>{<IntlMessages id={"wallet.deleteConf"} />}</h2>
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
                            onClick={() => this.removeUser()}
                            color="primary"
                            autoFocus
                        >
                            <IntlMessages id={"wallet.btnAgree"} />
                        </Button>
                    </DialogActions>
                </Dialog>
            </JbsCollapsibleCard>
        );
    }
}

const mapStateToProps = ({ MyWalletsReducer }) => {
    const { loading, walletUserList, addUserResponse } = MyWalletsReducer;
    return { loading, walletUserList, addUserResponse };
}
export default connect(mapStateToProps, {
    getWalletUserList,
    addWalletUser
})(ListWalletUsers);