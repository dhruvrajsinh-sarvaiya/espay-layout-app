// component for Update Api Key Ip Access Data By Tejas 8/3/2019

import React, { Fragment, Component } from 'react';

// import for design
import {
    Row,
    Col,
    Card,
    Label,
    Button,
    Container,
    Modal,
    ModalBody,
    Form,
    FormGroup,
    Input

} from 'reactstrap';
// used for display notifications
import { NotificationManager } from 'react-notifications';
// Actions for Call API Call
import {
    updateApiKeyList,
    addIPAddress,
    getIpWhiteListdata
} from 'Actions/ApiKey';

// used for convert message in different language
import IntlMessages from 'Util/IntlMessages';

// get IP Address
import {
    getIPAddress,
} from "Helpers/helpers";

// used for display menu icon
import MenuIcon from '@material-ui/icons/add';

// import for connect store
import { connect } from 'react-redux';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

//class for update api key
class UpdateApiKeyIPAccess extends Component {

    //constructor
    constructor(props) {
        super(props)

        this.state = {
            updateData: props.updateData ? props.updateData : {},
            IpAddress: getIPAddress(),
            updateBit: 0,
            addIpBit: 0,
            openAddIpModal: false,
            openRemoveIpModal: false,
            IPAddresses: "",
            removeData: {},
            aliasName: "",
            whitelist: []
        }
    }

    // get current IP Address
    componentWillMount() {

        getIPAddress().then((ipAddress) => {
            this.setState({
                IpAddress: ipAddress
            })
        })

    }

    // Add IP To Array for  set Whitelist
    addNow = () => {

        const data = {
            aliasName: this.state.aliasName,
            ipaddress: this.state.IPAddresses
        }
        let dataWhittelist = this.state.whitelist
        dataWhittelist.push(data)
        this.setState({
            whitelist: dataWhittelist,
            openAddIpModal: false
        })
    }

    // will invoke when component is about to get receive new props
    componentWillReceiveProps(nextprops) {

        if (nextprops.updateKeyList && this.state.updateBit !== nextprops.updateBit) {
            this.setState({
                updateBit: nextprops.updateBit
            })

            const data = {
                PlanID: this.props.PlanID,
                AliasName: this.state.whitelist[0].aliasName,
                IPAddress: this.state.whitelist[0].ipaddress
            }
            this.props.addIPAddress(data)
        } else if (nextprops.updateError && this.state.updateBit !== nextprops.updateBit) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
            this.setState({
                updateBit: nextprops.updateBit
            })

        }

        if (nextprops.addIPAddressData && this.state.addIpBit !== nextprops.addIpBit) {
            this.setState({
                addIpBit: nextprops.addIpBit
            })
            this.props.getIpWhiteListdata({ planKey: this.props.PlanID, KeyID: this.state.updateData.KeyId })
            this.props.closeModal();

        } else if (nextprops.addIPerror && this.state.addIpBit !== nextprops.addIpBit) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
            this.setState({
                addIpBit: nextprops.addIpBit
            })
        }
    }

    //used for close
    closeNow = () => {
        this.setState({
            openAddIpModal: false,
            openRemoveIpModal: false,

            IPAddresses: "",
            removeData: {},
            aliasName: "",
        })
    }

    // open modal for set IP Address
    SetIPAddress = () => {

        this.setState({
            openAddIpModal: true,
            IPAddresses: "",
            removeData: {},
            aliasName: "",
        })
        
    }

    // used fro update api key
    UpdateNow = () => {
        this.props.updateApiKeyList({ planKey: this.state.updateData.KeyId })
    }

    // set state for alias name
    onAliasName = (event) => {
        event.preventDefault()
        this.setState({
            aliasName: event.target.value
        })
    }

    // used forstate IP address
    onIPAddress = (event) => {
        event.preventDefault()
        this.setState({
            IPAddresses: event.target.value
        })
    }

    // open remove Ip address modal
    RemoveIp = (item) => {
        this.setState({

            removeData: item,
            IPAddresses: "",
            aliasName: "",
            openRemoveIpModal: true,
        })
    }

    // call api for remove ip
    RemoveIPFromList = () => {
        let dataWhittelist = []
        this.state.whitelist.map((item, key) => {
            if (this.state.removeData.aliasName !== item.aliasName) {
                dataWhittelist.push(item)
            }
        })

        this.setState({
            whitelist: dataWhittelist,
            openRemoveIpModal: false
        })
    }

    // render the component
    render() {

        return (
            <Fragment>

                {this.props.updateLoading &&
                    <JbsSectionLoader />
                }
                {
                    this.state.updateData &&
                    <Col md={12}>
                        <Col md={{ size: "6", offset: "3" }}>
                            <Container className="p-5" style={{ border: "1px solid #5D92F4" }}>
                                <Row className="m-0 mt-5">

                                    <Col md={6} className="text-right">
                                        <h1 className="text-left">Update Public API Key IPAccess</h1>
                                    </Col>

                                    <Col md={6} className="text-right">
                                        <div>
                                            <a href="javascript:void(0)" onClick={this.props.closeModal}><i className="material-icons">close</i></a>

                                        </div>
                                    </Col>
                                </Row>

                                <Col md={12} className="mt-15">
                                    <Card>
                                        <Row>
                                            <Col md={2}>
                                                <h1 className="p-10 text-primary">{this.state.updateData.AliasName}</h1>
                                            </Col>

                                            <Col md={5}>
                                                <div>
                                                    <p>Api Permission</p>
                                                    {this.state.updateData.APIAccess === 1 ?
                                                        <IntlMessages id="sidebar.view.adminrights" />
                                                        : <IntlMessages id="sidebar.view.viewrights" />}
                                                </div>
                                            </Col>

                                            <Col md={5}>
                                                <div>
                                                    <p>{<IntlMessages id="sidebar.view.createdon" />}</p>
                                                    {this.state.updateData.CreatedDate.replace('T', ' ').split('.')[0]}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>

                                    <Card className="mt-10">
                                        <Row className="m-0 p-10">
                                            <div>
                                                <IntlMessages id="sidebar.apikeys.whitelisted" />
                                            </div>
                                        </Row>

                                        <hr />

                                        <Row className="m-0">
                                            <Col md={4}>
                                                <div>
                                                    <IntlMessages id="sidebar.apikeys.allowes.access" />
                                                </div>
                                            </Col>

                                            <Col md={8}>
                                                <div>

                                                    <p>
                                                        {this.state.updateData.APIAccess === 0
                                                            ? <i className="material-icons text-success font-weight-bold">check</i>
                                                            : <i className="material-icons text-danger font-weight-bold">close</i>
                                                        }<IntlMessages id="sidebar.apikeys.restrict.access" />  </p>

                                                    <p>
                                                        {this.state.updateData.APIAccess === 0
                                                            ?
                                                            <i className="material-icons text-danger font-weight-bold">close</i>
                                                            :
                                                            <i className="material-icons text-success font-weight-bold">check</i>

                                                        } <IntlMessages id="sidebar.apikeys.unrestrict.access" />
                                                    </p>

                                                </div>
                                            </Col>
                                        </Row>

                                    </Card>

                                    <Card className="mt-10">
                                        <Row className="m-0">
                                            <Col md={4}>
                                                <div>
                                                    <IntlMessages id="sidebar.apikeys.whitelistedIp.access" />
                                                </div>
                                            </Col>

                                            <Col md={8}>
                                                <Col md={12} className="d-flex">
                                                    <Col style={{ background: "#0000FF" }} md={4} className="totalapiKeys m-5">
                                                        <p style={{ fontSize: "20px" }}>{typeof this.state.IpAddress === 'string' ? this.state.IpAddress : ""}</p>

                                                        <p><IntlMessages id="sidebar.apikeys.current.ipaddress" /></p>
                                                    </Col>
                                                    <Col style={{ background: "#008080" }} md={4} className="totalapiKeys  m-5">
                                                        <p style={{ fontSize: "30px" }}>{this.props.keyCount} / {this.props.keyLimit}</p>
                                                        <p><IntlMessages id="sidebar.apikeys.totalapikeys" /></p>
                                                    </Col>
                                                    <Col style={{ background: "steelblue" }} md={4} className="totalapiKeys m-5">
                                                        <a href="javascript:void(0)" onClick={this.SetIPAddress}>
                                                            <MenuIcon />
                                                            <p><IntlMessages id="sidebar.apikeys.addnew.ipaddress" /></p>
                                                        </a>
                                                    </Col>

                                                </Col>
                                            </Col>

                                        </Row>

                                    </Card>

                                    <hr />
                                </Col>

                                <Col md={12} className="m-0">
                                    <p className="font-weight-bold"><IntlMessages id="widgets.note.colon" /></p>
                                    <Row className="m-0 mt-5">
                                        {<IntlMessages id="sidebar.apikeys.whitelisted.note" />}
                                    </Row>

                                    <Row className="m-0 mt-5 font-weight-bold text-warning">
                                        {<IntlMessages id="sidebar.apikeys.update.note" />}
                                    </Row>

                                    <hr />

                                    <Row className="m-0">
                                        <div>
                                            <Button
                                                variant="raised"
                                                onClick={() => this.props.closeModal()}
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
                                    </Row>
                                </Col>
                            </Container>
                        </Col>
                    </Col>
                }

                <Modal isOpen={this.state.openAddIpModal}>
                    {this.props.addIPLoading && <JbsSectionLoader />}

                    <ModalBody>
                        <Row className="mt-10">
                           
                            <div>
                                <h1 className="text-center mt-10">
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
                                <Row className="mb-10 m-0">
                                    <IntlMessages id="sidebar.apikey.title.enter.alias">
                                        {(placeholder) =>
                                            <Input type="text" value={this.state.aliasName} name="search" id="search"
                                                placeholder={placeholder} onChange={this.onAliasName}></Input>
                                        }
                                    </IntlMessages>
                                </Row>

                                <Row className="mb-10 m-0">
                                    <IntlMessages id="sidebar.apikey.title.enter.ip">
                                        {(placeholder) =>
                                            <Input type="text" value={this.state.IPAddresses} name="ipaddress" id="search"
                                                placeholder={placeholder} onChange={this.onIPAddress}></Input>
                                        }
                                    </IntlMessages>
                                </Row>


                                <Row className="mb-10 m-0">
                                    <div>
                                        {<IntlMessages id="sidebar.apikey.note.whitelistip" />}
                                    </div>
                                </Row>

                            </Form>

                            <hr />

                            <Row className="m-0">
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
                            </Row>

                        </Row>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.openRemoveIpModal}>
                    {this.props.addIPLoading && <JbsSectionLoader />}

                    <ModalBody>
                        <Row className="mt-10">
                            
                            <div>
                                <h1 className="text-center mt-10">
                                    {<IntlMessages id="sidebar.ApiPlan.removewhitelist" />}
                                </h1>
                            </div>
                            <hr />
                            <Form>
                                <FormGroup row className="mb-10">
                                    <Label sm={4} for="planName">
                                        {<IntlMessages id="sidebar.colAliasName" />}
                                    </Label>
                                    <Label sm={8} for="planName">
                                       
                                        {this.state.removeData.aliasName}
                                    </Label>
                                </FormGroup>

                                <FormGroup row className="mb-10">
                                    <Label sm={4} for="planName">
                                        {<IntlMessages id="sidebar.ApiPlan.removeip" />}
                                    </Label>
                                    <Label sm={8} for="planName">
                                       
                                        {this.state.removeData.ipaddress}
                                    </Label>
                                </FormGroup>


                                <Row className="mb-10 m-0">
                                    <div>
                                        {<IntlMessages id="sidebar.apikey.note.removeip" />}
                                    </div>
                                </Row>

                            </Form>

                            <hr />

                            <Row className="m-0">
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
        updateKeyList,
        updateLoading,
        updateError,
        updateBit,
        addIPLoading,
        addIPerror,
        addIPAddressData,
        addIpBit
    } = apiKey;

    return {
        updateKeyList,
        updateLoading,
        updateError,
        updateBit,
        addIPLoading,
        addIPerror,
        addIPAddressData,
        addIpBit
    }
}


// export this component with action methods and props
export default connect(mapStateToProps,
    {
        addIPAddress,
        updateApiKeyList,
        getIpWhiteListdata
    }
)(UpdateApiKeyIPAccess);