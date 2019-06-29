//component for View Api Key Data By Tejas 7/3/2019

import React, { Component, Fragment } from "react";

// import for design
import {
    Row,
    Col,
    Card,
    Label,
    Button,
    Table,
    Modal,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input

} from 'reactstrap';

// used for display notifications
import { NotificationManager } from 'react-notifications';

//used for display menu icon
//import MenuIcon from '@material-ui/icons/add';

// used for handle message 
import IntlMessages from 'Util/IntlMessages';

// import for connect store
import { connect } from 'react-redux';

// used for validate
import validator from 'validator';

// used for get IP Address
import {
    getIPAddress,
} from "Helpers/helpers";

// actions for Call API for get,add and update API key data
import {
    getIpWhiteListdata,
    updateApiKeyList,
    addIPAddress,
    removeIPAddress,
    getApiKeyList
} from 'Actions/ApiKey';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// class for Api Key Data
class ViewApiKeyData extends Component {

    //constructor
    constructor(props) {
        super(props)

        this.state = {
            apiKeyData: this.props.selectedData ? this.props.selectedData : {},
            apiKeyModal: false,
            secretKeyModal: false,
            apiKey: "",
            secreyKey: "",
            updateIPAccess: false,
            editApiData: {},
            ipWhitelistData: [],
            IPCount: 0,
            IPLimit: 0,
            PlanID: props.PlanID ? props.PlanID : 0,
            APIKeyID: props.selectedData.KeyId ? props.selectedData.KeyId : 0,
            IpAddress: getIPAddress(),
            updateBit: 0,
            addIpBit: 0,
            openAddIpModal: false,
            openRemoveIpModal: false,
            IPAddresses: "",
            removeData: {},
            aliasName: "",
            whitelist: [],
            updateDataList: 0,
            addIP: 0,
            removeIP: 0,
            removeIpBit: 0,
            apiAccess: this.props.selectedData.IPAccess === 1 ? true : false,
            IPType: 1
        }
    }

    // used for open modal of Add IP 
    SetIPAddress = (e) => {
        e.preventDefault();
        this.setState({
            openAddIpModal: true,
            IPAddresses: "",
            removeData: {},
            aliasName: "",
        })

    }

    // add IP And MAke request
    addNow = () => {

        if (this.state.aliasName === "") {

            NotificationManager.error(<IntlMessages id="sidebar.apikey.error.enter.aliasname" />)
        } else if (this.state.IPAddresses === "") {

            NotificationManager.error(<IntlMessages id="sidebar.apikey.error.enter.ipaddress" />)
        } else if (this.state.IPAddresses !== "" && !validator.isIP(this.state.IPAddresses)) {

            NotificationManager.error(<IntlMessages id="sidebar.apikey.error.enter.validIP" />)
        } else {
            const data = {
                AliasName: this.state.aliasName,
                IPAddress: this.state.IPAddresses,
                IPType: this.state.IPType
            }
            let dataWhittelist = this.state.whitelist
            dataWhittelist.push(data)
            this.setState({
                whitelist: dataWhittelist,
                openAddIpModal: false
            })
        }

    }

    // used for update API Key
    UpdateNow = () => {

        const data = {
            PlanID: this.state.PlanID,
            APIKeyID: this.state.APIKeyID,
            IPList: this.state.whitelist
        }
        this.setState({
            addIP: 1
        })
        this.props.addIPAddress(data)
    }

    // set State for alias name
    onAliasName = (event) => {
        event.preventDefault()
        const regexNumeric = /^[A-Za-z0-9? ,_-]+$/;
        if (validator.matches(event.target.value, regexNumeric)) {
            this.setState({
                aliasName: event.target.value
            })
        }

        if (event.target.value === "") {
            this.setState({
                aliasName: event.target.value
            })
        }

    }

    //set state for Add Ip Address
    onIPAddress = (event) => {
        event.preventDefault()
        this.setState({
            IPAddresses: event.target.value
        })
    }

    // used for open modal of remove IP
    RemoveIp = (item) => {
        this.setState({

            removeData: item,
            IPAddresses: "",
            aliasName: "",
            openRemoveIpModal: true,
        })
    }

    //set Request for remove Ip from list
    RemoveIPFromList = () => {
        let IPID = ""
        if (this.state.removeData.IPId) {
            if (this.state.whitelist && this.state.whitelist.length > 0) {
                this.state.whitelist.map((item, key) => {
                    if (item.IPId === this.state.removeData.IPId) {
                        IPID = item.IPId;
                    }
                })
            }
            this.setState({
                removeIP: 1
            })
            this.props.removeIPAddress({ IPId: IPID })
        } else {
            let dataWhittelist = []
            this.state.whitelist.map((item, key) => {
                if (this.state.removeData.AliasName !== item.AliasName) {
                    dataWhittelist.push(item)
                }
            })


            this.setState({
                whitelist: dataWhittelist,
                openRemoveIpModal: false
            })
        }
    }

    //invoke when component is about to get new props
    componentWillReceiveProps(nextprops) {
        if (nextprops.ipWhitelistData.length > 0) {

            this.setState({
                ipWhitelistData: nextprops.ipWhitelistData,
                IPCount: nextprops.IPCount,
                IPLimit: nextprops.IPLimit,
                whitelist: nextprops.ipWhitelistData
            })

        } else if (nextprops.ipWhitelistError && !nextprops.ipWhitelistData) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.ipWhitelistError.ErrorCode}`} />);
            this.setState({
                ipWhitelistData: [],
                IPCount: 0,
                IPLimit: 0,
                whitelist: []
            })
        }

        if (nextprops.addIPAddressData && nextprops.addIPAddressData.ReturnCode === 0 && this.state.addIpBit !== nextprops.addIpBit && this.state.addIP === 1) {
            this.setState({
                addIpBit: nextprops.addIpBit,
                addIP: 0
            })

            NotificationManager.success(<IntlMessages id="sidebar.apiplan.success.ipwhitelist" />)
            this.props.getIpWhiteListdata({ planKey: this.state.PlanID, KeyID: this.state.APIKeyID })
            this.props.getApiKeyList({ PlanID: this.state.PlanID })
            this.closeModal();

        } else if (nextprops.addIPerror && nextprops.addIPerror.ReturnCode === 1 && this.state.addIpBit !== nextprops.addIpBit && this.state.addIP === 1) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addIPerror.ErrorCode}`} />);
            this.setState({
                addIpBit: nextprops.addIpBit,
                addIP: 0
            })
        }

        if (nextprops.removeIPAddressData && nextprops.removeIPAddressData.ReturnCode === 0 && this.state.removeIpBit !== nextprops.removeIpBit && this.state.removeIP === 1) {
            this.setState({
                removeIpBit: nextprops.removeIpBit,
                removeIP: 0,
                openRemoveIpModal: false,
                IPAddresses: "",
                removeData: {},
                aliasName: "",
            })

            NotificationManager.success(<IntlMessages id="sidebar.apiplan.success.removewhitelist" />)
            this.props.getIpWhiteListdata({ planKey: this.state.PlanID, KeyID: this.state.APIKeyID })
            this.closeModal();

        } else if (nextprops.removeIPerror && nextprops.removeIPerror.ReturnCode === 1 && this.state.removeIpBit !== nextprops.removeIpBit && this.state.removeIP === 1) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.removeIPerror.ErrorCode}`} />);
            this.setState({
                removeIpBit: nextprops.removeIpBit,
                removeIP: 0,
                openRemoveIpModal: false,
                IPAddresses: "",
                removeData: {},
                aliasName: "",
            })
        }


    }

    // get current Ip Address
    componentDidMount() {

        getIPAddress().then((ipAddress) => {
            this.setState({
                IpAddress: ipAddress
            })
        })

        this.props.getIpWhiteListdata({ planKey: this.state.PlanID, KeyID: this.state.APIKeyID })
    }

    // used fro view Secret key
    ViewSecretKey = (secretKey) => {
        this.setState({
            secretKey: secretKey,
            secretKeyModal: true
        })
    }

    // used for view Api key
    ViewApiKey = (apiKey) => {
        this.setState({
            apiKeyBit: 1
        })
    }

    //used for close modal
    closeModal = () => {
        this.setState({
            apiKeyModal: false,
            secretKeyModal: false,
            apiKey: "",
            secreyKey: "",
            updateIPAccess: false,
            openAddIpModal: false,
            openRemoveIpModal: false,
            IPAddresses: "",
            removeData: {},
            aliasName: "",
        })
        this.props.CloseDeleteModal()
    }

    // used for handle radio buttin change
    changeIpAccess = (e) => {
        e.preventDefault();
        this.setState({
            updateIPAccess: true
        })
    }

    // used for close modal of Ip address
    closeNow = () => {
        this.setState({
            openAddIpModal: false,
            openRemoveIpModal: false,

            IPAddresses: "",
            removeData: {},
            aliasName: "",
        })
    }

    // set state for APi Permission
    handleChangeApiPermission = (e) => {

        this.setState({
            updateIPAccess: !this.state.updateIPAccess,
            apiAccess: !this.state.apiAccess
        })
    }

    // used fro handle IP Type
    handleChangeIPType = (e) => {
        this.setState({
            IPType: e.target.value
        })
    }

    //renders the component
    render() {

        return (
            <Fragment>
                {
                    (this.props.addIPLoading ||
                        this.props.updateLoading) &&
                    <JbsSectionLoader />
                }

                {this.state.apiKeyData &&
                    <Col md={{ size: "6", offset: "3" }} sm={12}>
                        <div className="p-5" style={{ border: "1px solid #5D92F4" }}>
                            <Row className="m-0 mt-5">

                                <Col md={6} className="text-right">
                                    <h1 className="text-left"><IntlMessages id="sidebar.apiKey.permission.label" /></h1>
                                </Col>

                                <Col md={6} className="text-right">
                                    <div>
                                        <a href="javascript:void(0)" onClick={() => this.props.DeleteKey(this.state.apiKeyData)}><i className="material-icons">delete </i></a>
                                        <a href="javascript:void(0)" onClick={this.closeModal}><i className="material-icons">close</i></a>
                                    </div>
                                </Col>
                            </Row>

                            <Col md={12} className="mt-15 d-flex">
                                <Col md={4} >
                                    <img alt=" Qrcode" style={{ height: "80%", width: "80%" }} src={this.state.apiKeyData.QRCode} />
                                </Col>

                                <Col md={8}>

                                    <Row>
                                        <div>
                                            <h1 className="font-weight-bold"><IntlMessages id="sidebar.apikeys.demokeys" /></h1>
                                            <div className="d-flex p-5"><p className="font-weight-bold"><IntlMessages id="sidebar.ApiKey" /></p>
                                                <p className="ml-10">{this.state.apiKeyData.APIKey.substring(this.state.apiKeyData.APIKey.length - 10, this.state.apiKeyData.APIKey.length)}
                                                </p>
                                            </div>
                                            <div className="d-flex p-5">
                                                <p className="font-weight-bold"><IntlMessages id="sidebar.secretKey" /></p>
                                                <p className="ml-10">{this.state.apiKeyData.SecretKey.substring(this.state.apiKeyData.SecretKey.length - 10, this.state.apiKeyData.SecretKey.length)}
                                                </p>
                                            </div>
                                            <div className="d-flex p-5">
                                                <p className="font-weight-bold"><IntlMessages id="sidebar.apikeys.apipermission" /></p>
                                                <p className="ml-10">{this.state.apiKeyData.APIAccess === 1 ?
                                                    <IntlMessages id="sidebar.view.adminrights" />
                                                    : <IntlMessages id="sidebar.view.viewrights" />}
                                                </p>
                                            </div>
                                        </div>
                                    </Row>
                                </Col>
                            </Col>
                            <Row className="m-0">
                                <div className="text-warning font-weight-bold">
                                    <IntlMessages id="sidebar.apikeys.apikeydata.note" />
                                </div>
                            </Row>

                            <Card>
                                <Row className="m-0 p-10" style={{ borderBottom: "1px solid blue" }}>
                                    <div className="font-weight-bold ">
                                        <IntlMessages id="sidebar.apikeys.whitelisted" />
                                    </div>
                                </Row>

                                <Row className="m-0 my-5">
                                    <Col md={4}>
                                        <div>
                                            <IntlMessages id="sidebar.apikeys.allowes.access" />
                                        </div>
                                    </Col>

                                    <Col md={8}>
                                        <div >
                                            <FormGroup check>

                                                <Label check >
                                                    <Input
                                                        type="radio"
                                                        name="access"
                                                        disabled={this.state.apiKeyData.IPAccess}
                                                        value={this.state.updateIPAccess}
                                                        checked={this.state.apiAccess}
                                                        // checked={(this.state.updateIPAccess == true || this.state.apiKeyData.APIAccess) } 
                                                        onChange={this.handleChangeApiPermission}
                                                    // className={!this.state.isPriceBuyValid ? "error" : ""}
                                                    />{' '}
                                                    {<IntlMessages id="sidebar.apikeys.restrict.access" />}
                                                </Label>
                                            </FormGroup>

                                            <FormGroup check>

                                                <Label check>
                                                    <Input
                                                        type="radio"
                                                        name="access"
                                                        disabled={this.state.apiKeyData.IPAccess}
                                                        value={this.state.updateIPAccess}
                                                        checked={this.state.apiAccess === false}
                                                        onChange={this.handleChangeApiPermission}
                                                    />
                                                    {<IntlMessages id="sidebar.apikeys.unrestrict.access" />}
                                                </Label>
                                            </FormGroup>
                                        </div>

                                    </Col>
                                </Row>

                            </Card>

                            <Card className="mt-10">
                                <Row className="m-0">
                                    <Col md={4} sm={6}>
                                        <div>
                                            <IntlMessages id="sidebar.apikeys.whitelistedIp.access" />
                                        </div>
                                    </Col>

                                    <Col md={8} sm={12}>
                                        {this.state.updateIPAccess === 1 ?
                                            <Col md={12} className="d-flex">
                                                <Col style={{ background: "#0000FF" }} md={4} sm={4} className="totalapiKeys m-5">
                                                    <p style={{ fontSize: "20px" }}>{typeof this.state.IpAddress === 'string' ? this.state.IpAddress : ""}</p>

                                                    <p><IntlMessages id="sidebar.apikeys.current.ipaddress" /></p>
                                                </Col>
                                                <Col style={{ background: "#008080" }} md={4} sm={4} className="totalapiKeys  m-5">
                                                    <p className="m-0" style={{ fontSize: "30px" }}>{this.state.IPCount} / {this.state.IPLimit}</p>
                                                    <p><IntlMessages id="sidebar.apikeys.totalipLimit" /></p>
                                                </Col>
                                                <Col style={{ background: "steelblue" }} md={4} sm={4} className="totalapiKeys m-5">
                                                    <a href="javascript:void(0)" onClick={this.SetIPAddress}>
                                                        <i className="fa fa-plus"></i>
                                                        <p><IntlMessages id="sidebar.apikeys.addnew.ipaddress" /></p>
                                                    </a>
                                                </Col>
                                            </Col>
                                            :
                                            <div className="row view_api_key_detail">
                                                <Col style={{ visibility: "hidden" }} md={4} sm={4} className="totalapiKeys">
                                                    <div className="api_key_box" style={{ background: "steelblue" }}>
                                                        <a href="javascript:void(0)" onClick={this.SetIPAddress}>
                                                            <i className="fa fa-plus"></i>
                                                            <p><IntlMessages id="sidebar.apikeys.addnew.ipaddress" /></p>
                                                        </a>
                                                    </div>
                                                </Col>

                                                <Col md={4} sm={4} className="totalapiKeys">
                                                    <div className="api_key_box" style={{ background: "#0000FF" }}>
                                                        <p style={{ fontSize: "20px" }}>{typeof this.state.IpAddress === 'string' ? this.state.IpAddress : ""}</p>
                                                        <p><IntlMessages id="sidebar.apikeys.current.ipaddress" /></p>
                                                    </div>
                                                </Col>
                                                <Col md={4} sm={4} className="totalapiKeys">
                                                    <div className="api_key_box" style={{ background: "#008080" }}>
                                                        <p className="m-0" style={{ fontSize: "30px" }}>{this.props.keyCount} / {this.props.keyLimit}</p>
                                                        <p><IntlMessages id="sidebar.apikeys.totalapikeys" /></p>
                                                    </div>
                                                </Col>


                                            </div>
                                        }
                                    </Col>

                                </Row>

                                <hr />
                                {this.state.updateIPAccess === false ?
                                    <Table className="api-key-detail">
                                        {
                                            this.props.ipWhitelistLoading &&
                                            <JbsSectionLoader />}
                                        <thead>
                                            <tr>
                                                <th className="text-center">{<IntlMessages id="sidebar.colAliasName" />}</th>
                                                <th className="text-center">{<IntlMessages id="my_account.IPWhitelis.addColumn.ip" />}</th>
                                                <th className="text-center">{<IntlMessages id="sidebar.apiKey.Ipaddress.type.iptype" />}</th>
                                                <th className="text-center">{<IntlMessages id="sidebar.view.createdon" />}</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {this.state.ipWhitelistData && this.state.ipWhitelistData.length > 0 &&

                                                this.state.ipWhitelistData.map((item, key) => {
                                                    return <tr key={key}>
                                                        <td className="text-center">{item.AliasName}</td>
                                                        <td className="text-center">{item.IPAddress}</td>
                                                        {item.IPType === 1 && <td className="text-center">{<IntlMessages id="sidebar.apiKey.Ipaddress.type.concurrent.ip" />}</td>}
                                                        {item.IPType === 2 && <td className="text-center">{<IntlMessages id="sidebar.apiKey.Ipaddress.type.whitelist.ip" />}</td>}
                                                        <td className="text-center">{item.CreatedDate.replace('T', " ").split('.')[0]}</td>
                                                    </tr>
                                                })}
                                        </tbody>
                                    </Table>
                                    :
                                    <Table className="api-key-detail">
                                        {
                                            this.props.ipWhitelistLoading &&
                                            <JbsSectionLoader />}
                                        <thead>
                                            <tr>
                                                <th className="text-center">{<IntlMessages id="sidebar.colAliasName" />}</th>
                                                <th className="text-center">{<IntlMessages id="my_account.IPWhitelis.addColumn.ip" />}</th>
                                                <th className="text-center">{<IntlMessages id="sidebar.colActions" />}</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {this.state.whitelist && this.state.whitelist.length > 0 &&

                                                this.state.whitelist.map((item, key) => {
                                                    return <tr key={key}>
                                                        <td className="text-center">{item.AliasName}</td>
                                                        <td className="text-center">{item.IPAddress}</td>
                                                        <td className="text-center">{<a href="javascript:void(0)" onClick={() => this.RemoveIp(item)}><i style={{ fontSize: "14px" }} className="fa fa-trash" ></i></a>}</td>
                                                    </tr>
                                                })}
                                        </tbody>
                                    </Table>
                                }

                                {
                                    this.state.updateIPAccess === false ?
                                        <Row className="m-0 p-10">
                                            <div>
                                                <p className="font-weight-bold text-danger">{<IntlMessages id="widgets.note" />} :</p>
                                                <p className="font-weight-bold text-warning">{<IntlMessages id="sidebar.apikeys.whitelisted.note" />}</p>
                                            </div>
                                        </Row>
                                        :
                                        <Col md={12} className="m-0">
                                            <p className="font-weight-bold"><IntlMessages id="widgets.note.colon" /></p>
                                            <Row className="m-0 mt-5">
                                                {<IntlMessages id="sidebar.apikeys.whitelisted.note" />}
                                            </Row>

                                            <Row className="m-0 mt-5 font-weight-bold text-warning">
                                                {<IntlMessages id="sidebar.apikeys.update.note" />}
                                            </Row>

                                            <hr />

                                            <div className="m-0 text-right">
                                                <Button
                                                    variant="raised"
                                                    onClick={() => this.closeModal()}
                                                    className="btn-danger text-white m-5"
                                                >
                                                    <span>
                                                        <IntlMessages id="button.cancel" />
                                                    </span>
                                                </Button>
                                                <Button
                                                    variant="raised"
                                                    onClick={() => this.UpdateNow()}
                                                    className="btn-info text-white m-5"
                                                >
                                                    <span>
                                                        <IntlMessages id="sidebar.apikey.title.btnupdate" />
                                                    </span>
                                                </Button>
                                            </div>
                                        </Col>
                                }
                            </Card>
                            {/* // } */}
                        </div>
                    </Col>

                }

                <Modal isOpen={this.state.apiKeyModal || this.state.secretKeyModal}>
                    <h1 className="text-center mt-5">
                        {this.state.apiKeyModal ? <IntlMessages id="sidebar.ApiKey" /> :
                            this.state.secretKeyModal ? <IntlMessages id="sidebar.secretKey" /> : ""
                        }
                    </h1>
                    <ModalBody>
                        <div style={{ wordWrap: "break-word" }}>
                            {
                                this.state.apiKeyModal ? this.state.apiKey :
                                    this.state.secretKeyModal ? this.state.secretKey : ""
                            }
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="raised"
                            onClick={() => this.closeModal()}
                            className="btn-info text-white"
                        >
                            <span>
                                <IntlMessages id="widgets.done" />
                            </span>
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.openAddIpModal}>

                    <ModalBody>
                        <Row className="mt-10 d-contents">
                            {/* <Col md={6}> */}
                            <div>
                                <h1 className="text-center mt-10 font-weight-bold">
                                    {<IntlMessages id="sidebar.ApiPlan.whitelist" />}
                                </h1>
                            </div>
                            <hr />
                            <div>
                                <h1 className="text-center mt-10">
                                    <p>{<IntlMessages id="sidebar.apikey.title.currentip" />}</p>
                                    <p>{this.state.IpAddress}</p>
                                </h1>
                            </div>

                            <hr />

                            <Form>
                                <Row className="mb-10 m-5">
                                    <IntlMessages id="sidebar.apikey.title.enter.alias">
                                        {(placeholder) =>
                                            <Input type="text" value={this.state.aliasName} name="search" id="search"
                                                placeholder={placeholder} onChange={this.onAliasName}></Input>
                                        }
                                    </IntlMessages>
                                </Row>

                                <Row className="mb-10 m-5">
                                    <IntlMessages id="sidebar.apikey.title.enter.ip">
                                        {(placeholder) =>
                                            <Input type="text" value={this.state.IPAddresses} name="ipaddress" id="search"
                                                placeholder={placeholder} onChange={this.onIPAddress}></Input>
                                        }
                                    </IntlMessages>
                                </Row>

                                <Row className="m-5">
                                    <FormGroup check>
                                        <Label check className="m-2">
                                            <Input
                                                type="radio"
                                                name="access"
                                                value={2}
                                                checked={this.state.IPType === 1 && true}
                                                onChange={this.handleChangeIPType}
                                            />
                                            {<IntlMessages id="sidebar.apiKey.Ipaddress.type.whitelist" />}
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Label check className="m-2">
                                            <Input
                                                type="radio"
                                                name="access"
                                                value={1}
                                                checked={this.state.IPType === 2 && true}
                                                onChange={this.handleChangeIPType}

                                            />{' '}
                                            {<IntlMessages id="sidebar.apiKey.Ipaddress.type.concurrent" />}
                                        </Label>
                                    </FormGroup>
                                </Row>

                                <Row className="mb-10 m-5 text-warning font-weight-bold">
                                    <Col md={2}>
                                        {<IntlMessages id="widgets.note.colon" />}
                                    </Col>
                                    <Col md={10}>
                                        {<IntlMessages id="sidebar.apikey.note.whitelistip" />}
                                    </Col>

                                </Row>

                            </Form>

                            <hr />

                            <div className="m-0">
                                <Button
                                    variant="raised"
                                    onClick={() => this.closeNow()}
                                    className="btn-danger text-white m-5"
                                >
                                    <span>
                                        <IntlMessages id="button.cancel" />
                                    </span>
                                </Button>
                                <Button
                                    variant="raised"
                                    onClick={() => this.addNow()}
                                    className="btn-info text-white m-5"
                                >
                                    <span>
                                        <IntlMessages id="sidebar.apikey.title.btnadd" />
                                    </span>
                                </Button>
                            </div>

                        </Row>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.openRemoveIpModal}>
                    {this.props.removeIPLoading && <JbsSectionLoader />}
                    <ModalBody>
                        <Row className="mt-10">

                            <div>
                                <h1 className="text-center mt-10 ml-5">
                                    {<IntlMessages id="sidebar.ApiPlan.removewhitelist" />}
                                </h1>
                            </div>
                            <hr />
                            <Form>
                                <FormGroup row className="mb-10 m-5">
                                    <Label sm={4} for="planName">
                                        {<IntlMessages id="sidebar.colAliasName" />}
                                    </Label>
                                    <Label sm={8} for="planName">

                                        {this.state.removeData.AliasName}
                                    </Label>
                                </FormGroup>

                                <FormGroup row className="mb-10  m-5">
                                    <Label sm={4} for="planName">
                                        {<IntlMessages id="sidebar.ApiPlan.removeip" />}
                                    </Label>
                                    <Label sm={8} for="planName">

                                        {this.state.removeData.IPAddress}
                                    </Label>
                                </FormGroup>



                                <Row className="mb-10 m-5 text-warning font-weight-bold">
                                    <div>
                                        {<IntlMessages id="sidebar.apikey.note.removeip" />}
                                    </div>
                                </Row>

                            </Form>

                            <hr />

                            <Row className="m-5">
                                <Button
                                    variant="raised"
                                    onClick={() => this.closeNow()}
                                    className="btn-danger text-white m-5"
                                >
                                    <span>
                                        <IntlMessages id="button.cancel" />
                                    </span>
                                </Button>
                                <Button
                                    variant="raised"
                                    onClick={() => this.RemoveIPFromList()}
                                    className="btn-info text-white m-5"
                                >
                                    <span>
                                        <IntlMessages id="sidebar.apikey.title.btnremove" />
                                    </span>
                                </Button>
                            </Row>

                        </Row>
                    </ModalBody>
                </Modal>

            </Fragment>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ apiKey }) => {
    const {
        ipWhitelistData,
        ipWhitelistError,
        ipWhitelistLoading,
        IPCount,
        IPLimit,
        updateKeyList,
        updateLoading,
        updateError,
        updateBit,
        addIPLoading,
        addIPerror,
        addIPAddressData,
        addIpBit,
        removeIPAddressData,
        removeIPLoading,
        removeIPerror,
        removeIpBit
    } = apiKey

    return {
        ipWhitelistData,
        ipWhitelistError,
        ipWhitelistLoading,
        IPCount,
        IPLimit,
        updateKeyList,
        updateLoading,
        updateError,
        updateBit,
        addIPLoading,
        addIPerror,
        addIPAddressData,
        addIpBit,
        removeIPAddressData,
        removeIPLoading,
        removeIPerror,
        removeIpBit,
    }
}

// export this component with action methods and props
export default connect(mapStateToProps,
    {
        getIpWhiteListdata,
        addIPAddress,
        removeIPAddress,
        updateApiKeyList,
        getApiKeyList
    }
)(ViewApiKeyData);