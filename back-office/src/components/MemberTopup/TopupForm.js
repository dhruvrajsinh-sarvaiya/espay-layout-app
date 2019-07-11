/* 
    Developer : Nishant Vadgama
    Date : 13-11-2018
    File Comment : Member Topup form component
*/
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { Col, Form, Input, Label, FormGroup, Button } from "reactstrap";
import MatButton from "@material-ui/core/Button";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from "react-select";
import ScrollMenu from 'react-horizontal-scrolling-menu';
import MUIDataTable from "mui-datatables";

const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};

const BalanceWidget = ({ coin, balance, selectWallet }) => (
    <div className="social-card bg-primary mb-10 mt-10 p-15" onClick={selectWallet}>
        <div className="d-flex justify-content-between text-white w-100">
            <div className="align-items-start">
                <span className="font-weight-bold">{balance}</span>
                <span className="fs-12">{coin}</span>
            </div>
            <div className="align-items-end pl-20">
                <h2><i className="zmdi zmdi-balance-wallet"></i></h2>
            </div>
        </div>
    </div>
);
const Arrow = ({ text, className }) => {
    return (
        <div
            className={className}
        >{text}</div>
    );
};
const Menu = (list, selectWallet) => list.map((wallet, key) => {
    return (
        <div className="col-sm-12 w-xs-half-block" key={key}>
            <BalanceWidget
                coin={wallet.WalletName}
                balance={wallet.Balance}
                selectWallet={(e) => selectWallet(e, wallet.AccWalletID)}
            />
        </div>
    );
});

class TopupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            errors: "",
            selectObj: null,
            walletId: ''
        };
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };

    selectWallet(e, walletID) {
        e.preventDefault();
        this.setState({ walletId: walletID });
    }

    render() {
        const { drawerClose } = this.props;
        const coinlist = [
            { SMSCode: "BTC" },
            { SMSCode: "LTC" },
            { SMSCode: "LMX" },
            { SMSCode: "ETH" },
            { SMSCode: "QRL" },
            { SMSCode: "ZRX" },
        ];
        const wallets = [
            { WalletName: 'BTC_wallet1', Balance: "99.99999", AccWalletID: "001" },
            { WalletName: 'BTC_wallet2', Balance: "99.99999", AccWalletID: "002" },
            { WalletName: 'BTC_wallet3', Balance: "99.99999", AccWalletID: "003" },
        ];
        const walletList = Menu(wallets, this.selectWallet);
        const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
        const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });
        const history = [
            {
                orderId: "101",
                currency: "BTC",
                adminWallet: "BTC_Admin",
                userWallet: "BTC_user",
                amount: "00.0010121",
                date: "13-11-2018 11:11:04 PM",
                status: "Accepted",
                remark: "Internal",
            },
            {
                orderId: "102",
                currency: "BTC",
                adminWallet: "BTC_Admin",
                userWallet: "BTC_user",
                amount: "00.0010121",
                date: "13-11-2018 11:11:04 PM",
                status: "Accepted",
                remark: "Internal",
            }
        ];
        const columns = [
            {
                name: <IntlMessages id="Order ID" />
            },
            {
                name: <IntlMessages id="Currency" />
            },
            {
                name: <IntlMessages id="Admin Wallet" />
            },
            {
                name: <IntlMessages id="User Wallet" />
            },
            {
                name: <IntlMessages id="Amount" />
            },
            {
                name: <IntlMessages id="Stauts" />
            },
            {
                name: <IntlMessages id="Remark" />
            },
            {
                name: <IntlMessages id="Date" />
            },
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false
        };
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center mt-10 mx-auto">
                    <h2>
                        <span>{<IntlMessages id="walletDeshbard.Member" />}</span>
                    </h2>
                    <div className="page-title-wrap">
                        <MatButton
                            className="btn-warning text-white mr-10 mb-10"
                            style={{ maxHeight: "28px", minHeight: "28px", maxWidth: "28px", fontSize: "1rem" }}
                            variant="fab"
                            mini
                            onClick={drawerClose}
                        >
                            <i className="zmdi zmdi-mail-reply" />
                        </MatButton>
                        <MatButton
                            className="btn-info text-white mr-10 mb-10"
                            style={buttonSizeSmall}
                            variant="fab"
                            mini
                            onClick={this.closeAll}
                        >
                            <i className="zmdi zmdi-home" />
                        </MatButton>
                    </div>
                </div>
                <div className="MemberTopup row">
                    <JbsCollapsibleCard colClasses="col-sm-12">
                        <Form onSubmit={this.handleSubmit} className="col-sm-8 offset-sm-2">
                            <FormGroup row>
                                <Label for="coin" sm={4} className="py-15">
                                    <IntlMessages id="Search By" />
                                </Label>
                                <Col sm={8}>
                                    <RadioGroup row aria-label="gender" name="gender2" value={""} onChange={(e) => this.handleChangeRadio(e, 'genderRadio2')} >
                                        <FormControlLabel value="email" control={<Radio />} label="Email" />
                                        <FormControlLabel value="mobile" control={<Radio />} label="Mobile" />
                                    </RadioGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="member" sm={4}>
                                    <IntlMessages id="Member" />
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        type="text"
                                        name="member"
                                        value={""}
                                        onChange={this.handleChange}
                                        autoComplete="off"
                                        placeholder="Search"
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="currency" sm={4}>
                                    <IntlMessages id="Currency" />
                                </Label>
                                <Col sm={8}>
                                    <Select
                                        options={coinlist.map((coin, i) => ({
                                            label: coin.SMSCode,
                                            value: coin.SMSCode
                                        }))}
                                        onChange={e => this.setState({ selectObj: { label: e.value } })}
                                        value={this.state.selectObj}
                                        placeholder={<IntlMessages id="wallet.searchCoin" />}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="wallt" sm={12}>
                                    <IntlMessages id="Select Admin Wallet" />
                                </Label>
                                <Col sm={12}>
                                    <ScrollMenu
                                        data={walletList}
                                        arrowLeft={ArrowLeft}
                                        arrowRight={ArrowRight}
                                        menuClass={''}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="wallt" sm={12}>
                                    <IntlMessages id="Select User Wallet" />
                                </Label>
                                <Col sm={12}>
                                    <ScrollMenu
                                        data={walletList}
                                        arrowLeft={ArrowLeft}
                                        arrowRight={ArrowRight}
                                        menuClass={''}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="amount" sm={4}>
                                    <IntlMessages id="Amount" />
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        type="text"
                                        name="amount"
                                        value={""}
                                        onChange={this.handleChange}
                                        autoComplete="off"
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="remark" sm={4}>
                                    <IntlMessages id="Remark" />
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        type="text"
                                        name="remark"
                                        value={""}
                                        onChange={this.handleChange}
                                        autoComplete="off"
                                    />
                                </Col>
                            </FormGroup>
                            <Col className="justify-content-center d-flex">
                                <Button className="border-0 rounded-0" color="primary"><IntlMessages id="Submit" /></Button>
                            </Col>
                        </Form>
                    </JbsCollapsibleCard>
                    <JbsCollapsibleCard heading="Member Details" colClasses="col-sm-12">
                        <div className=" justify-content-between d-flex">
                            <FormGroup className="mb-0">
                                <Label for="coin" cla className="w-100">
                                    <IntlMessages id="Member ID" />
                                </Label>
                                <Label for="coin" className="font-weight-bold w-100">
                                    <IntlMessages id="001" />
                                </Label>
                            </FormGroup>
                            <FormGroup className="mb-0">
                                <Label for="coin" className="w-100">
                                    <IntlMessages id="Member Code" />
                                </Label>
                                <Label for="coin" className="font-weight-bold w-100">
                                    <IntlMessages id="RT0008" />
                                </Label>
                            </FormGroup>
                            <FormGroup className="mb-0">
                                <Label for="coin" className="w-100">
                                    <IntlMessages id="Name" />
                                </Label>
                                <Label for="coin" className="font-weight-bold w-100">
                                    <IntlMessages id="Devang Parekh" />
                                </Label>
                            </FormGroup>
                            <FormGroup className="mb-0">
                                <Label for="coin" className="w-100">
                                    <IntlMessages id="Balance" />
                                </Label>
                                <Label for="coin" className="font-weight-bold w-100">
                                    <IntlMessages id="0.0" />
                                </Label>
                            </FormGroup>
                            <FormGroup className="mb-0">
                                <Label for="coin" className="w-100">
                                    <IntlMessages id="Mobile" />
                                </Label>
                                <Label for="coin" className="font-weight-bold w-100">
                                    <IntlMessages id="9898989898" />
                                </Label>
                            </FormGroup>
                            <FormGroup className="mb-0">
                                <Label for="coin" className="w-100">
                                    <IntlMessages id="Email" />
                                </Label>
                                <Label for="coin" className="font-weight-bold w-100">
                                    <IntlMessages id="devang@jbspl.com" />
                                </Label>
                            </FormGroup>
                            <FormGroup className="mb-0">
                                <Label for="coin" className="w-100">
                                    <IntlMessages id="Status" />
                                </Label>
                                <Label for="coin" className="font-weight-bold w-100">
                                    <IntlMessages id="Active" />
                                </Label>
                            </FormGroup>
                        </div>
                    </JbsCollapsibleCard>
                    <div className="col-sm-12">
                        <MUIDataTable
                            className="col-sm-12"
                            title={"Member History"}
                            data={history.map((item, key) => {
                                return [
                                    item.orderId,
                                    item.currency,
                                    item.adminWallet,
                                    item.userWallet,
                                    item.amount,
                                    item.status,
                                    item.remark,
                                    item.date
                                ];
                            })}
                            columns={columns}
                            options={options}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default TopupForm;
