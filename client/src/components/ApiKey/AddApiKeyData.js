/// component for add api key data by Tejas 8/3/2019

import React, { Fragment, Component } from 'react';

// import for design
import {
    Col,
    Label, Button,
    Modal,
    ModalBody,
    ModalHeader,
    Form,
    FormGroup,
    Input

} from 'reactstrap';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";
import validator from 'validator';
// used for display notifications
import { NotificationManager } from 'react-notifications';

// import for connect store
import { connect } from 'react-redux';

// used fro conver message in Different language
import IntlMessages from 'Util/IntlMessages';

// Actions fro call API
import {
    generateApiKey,
    getApiKeyList
} from 'Actions/ApiKey';

// used for copy data to clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";

//class for add api key data
class AddApiKeyData extends Component {

    //constructor
    constructor(props) {
        super(props)
        this.state = {
            apiKeyName: "",
            apiPermission: 1,
            userActivePlan: props.userActivePlan ? props.userActivePlan : {},
            planName: props.planName ? props.planName : "",
            generateApiKeyData: {},
            generateAPiKeyBit: 0,
            generateKeySuccess: false,
            addNewData: props.addNewData ? true : false
        }
    }

    // used for set state from change API key
    handleChangeApiKey = (event) => {
        event.preventDefault()
        const regexNumeric = /^[A-Za-z0-9? ,_-]+$/;

        if (!validator.matches(event.target.value, regexNumeric)) {
        }
        else {
            this.setState({
                apiKeyName: event.target.value
            })
        }

        if (event.target.value === "") {
            this.setState({
                apiKeyName: event.target.value
            })
        }

    }

    // used for set state from change API Permission
    handleChangeApiPermission = (e) => {
        this.setState({
            apiPermission: e.target.value
        })
    }

    // will invoke when component is about to get new props
    componentWillReceiveProps(nextprops) {
        if (nextprops.generateApiKeyData && nextprops.generateApiKeyData.AliasName !== undefined && this.state.generateAPiKeyBit !== nextprops.generateAPiKeyBit) {

            NotificationManager.success(<IntlMessages id="sidebar.apikeys.generate.add.success" />)

            this.setState({
                generateAPiKeyBit: nextprops.generateAPiKeyBit,
                generateApiKeyData: nextprops.generateApiKeyData,
                generateKeySuccess: true,
                addNewData: false
            })

            this.props.getApiKeyList({ PlanID: this.props.PlanID })

        } else if (nextprops.generateApiKeyError && this.state.generateAPiKeyBit !== nextprops.generateAPiKeyBit && nextprops.generateApiKeyError.ReturnCode === 1) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.generateApiKeyError.ErrorCode}`} />);
            this.setState({
                generateAPiKeyBit: nextprops.generateAPiKeyBit,
                generateApiKeyData: {},
                generateKeySuccess: false,
                addNewData: false
            })
            this.props.CancelApiKey()
        }
    }

    // call API for generate API Key
    CreateApiKey = (event) => {
        event.preventDefault()

        if (this.state.apiKeyName === "") {

            NotificationManager.error(<IntlMessages id="sidebar.apikey.error.enter.apikey" />)
        } else if (this.state.apiPermission === "") {

            NotificationManager.error(<IntlMessages id="sidebar.apikey.error.enter.apipermission" />)
        } else {
            const data = {
                PlanID: this.state.userActivePlan.PlanID,
                AliasName: this.state.apiKeyName,
                APIAccess: this.state.apiPermission,
            }
            this.props.generateApiKey({ data })
        }

    }

    // used for display message of Copy API KEy
    copyApiKey = () => {

        NotificationManager.success(<IntlMessages id="sidebar.apiKeyColon.copied" />)
    }

    // used for display message of Copy Secret KEy
    copySecretKey = () => {

        NotificationManager.success(<IntlMessages id="sidebar.secretKeyColon.copied" />)
    }

    //renders the component
    render() {

        //returns the component
        return (
            <Fragment>

                {this.props.generateApiKeyLoading && <JbsSectionLoader />}
                <h1 className="text-center mt-10">
                    {<IntlMessages id="sidebar.apikeys.generate.add" />}
                </h1>

                <ModalBody>
                    <Col md={12} className="mt-10">
                        <Form>

                            <FormGroup row className="mb-10">
                                <Label className="col-6 col-md-4 col-sm-4" for="planName">
                                    {<IntlMessages id="sidebar.ApiPlan.planname" />}
                                </Label>
                                <Label className="col-6 col-md-8 col-sm-8" for="planName">
                                    {this.state.userActivePlan.PlanName}
                                </Label>
                            </FormGroup>

                            <FormGroup row className="mb-10">
                                <Label className="col-6 col-md-4 col-sm-4" for="apiKey">
                                    {<IntlMessages id="sidebar.apikeys.lable.name" />}
                                </Label>
                                <div className="col-6 col-md-8 col-sm-8">
                                    <Input
                                        type="text"
                                        name="apiKey"
                                        id="apiKey"
                                        value={this.state.apiKeyName}
                                        onChange={this.handleChangeApiKey}
                                    />
                                </div>
                            </FormGroup>

                            <FormGroup row className="mb-10">
                                <Label check className="col-6 col-md-4 col-sm-4" for="access">
                                    {<IntlMessages id="sidebar.apikeys.apipermission" />}
                                </Label>
                                <div className="col-6 col-md-8 col-sm-8">
                                    <div >
                                        <FormGroup check>

                                            <Label check >
                                                <Input
                                                    type="radio"
                                                    name="access"
                                                    value={0}
                                                    onChange={this.handleChangeApiPermission}
                                                />{' '}
                                                {<IntlMessages id="sidebar.view.viewrights" />}
                                            </Label>
                                        </FormGroup>

                                        <FormGroup check>

                                            <Label check>
                                                <Input
                                                    type="radio"
                                                    name="access"
                                                    value={1}
                                                    checked
                                                    onChange={this.handleChangeApiPermission}
                                                />
                                                {<IntlMessages id="sidebar.view.adminrights" />}
                                            </Label>
                                        </FormGroup>
                                    </div>

                                </div>
                            </FormGroup>

                            <FormGroup row className="mt-20">
                                <div className="col-md-6 col-6">
                                    <IntlMessages id="sidebar.apikey.title.btngenerate">
                                        {(name) =>
                                            <Button
                                                type="submit"
                                                name={
                                                    name
                                                }
                                                color="primary"
                                                onClick={event => {
                                                    this.CreateApiKey(event);
                                                }}>
                                                {name}
                                            </Button>
                                        }
                                    </IntlMessages>

                                </div>
                                <div className="col-md-6 col-6">
                                    <IntlMessages id="button.cancel">
                                        {(name) =>
                                            <Button
                                                type="submit"
                                                name={
                                                    name
                                                }
                                                color="danger"
                                                onClick={event => {
                                                    this.props.CancelApiKey(event);
                                                }}>
                                                {name}
                                            </Button>
                                        }
                                    </IntlMessages>

                                </div>
                            </FormGroup>

                            <FormGroup row className="mb-10">
                                <Label sm={2} for="note" className="font-weight-bold text-danger">
                                    {<IntlMessages id="widgets.note.colon" />}
                                </Label>
                                <Col sm={10} className="font-weight-bold text-warning">
                                    <IntlMessages id="sidebar.apikeys.generatekey.lable.note" />
                                </Col>
                            </FormGroup>


                        </Form>
                    </Col>
                </ModalBody>

                <Modal isOpen={this.state.generateKeySuccess} style={{ maxWidth: "900px" }}>

                    <ModalHeader toggle={(event) => {
                        this.setState({ generateKeySuccess: false, addNewData: false });
                        this.props.CancelApiKey(event);
                        this.props.togglemodel();
                    }} className="modal_header_success">
                        <i className="fa fa-check-circle"></i><IntlMessages id="sidebar.apikeys.generate.add.generate" />
                    </ModalHeader>

                    <ModalBody >
                        <div className="font-weight-bold m-5 text-primary" style={{ fontSize: "24px" }}>
                            {this.state.generateApiKeyData.AliasName && this.state.generateApiKeyData.AliasName.toUpperCase()}
                        </div>

                        <div className="font-weight-bold text-danger text-center">
                            <i style={{ fontSize: "16px" }} className="fa fa-warning pr-5"></i>
                            <IntlMessages id="sidebar.apikeys.generate.store.generate" />
                        </div>

                        <Col md={12} className="d-flex p-10 m-15">
                            <Col md={8}>

                                <div className="d-contents">
                                    <p style={{ fontSize: "16px" }} className="font-weight-bold text-center"><IntlMessages id="sidebar.ApiKey" />
                                        <CopyToClipboard style={{ cursor: "pointer" }} text={this.state.generateApiKeyData.APIKey} onCopy={this.copyApiKey}>
                                            <i className="fa fa-clone pl-5" style={{ fontSize: "16px" }}></i>
                                        </CopyToClipboard>
                                    </p>
                                    <p id="apiKey" value={this.state.generateApiKeyData.APIKey} style={{ background: "cadetblue" }}>{this.state.generateApiKeyData.APIKey}</p>
                                </div>

                                <div>
                                    <p style={{ fontSize: "16px" }} className="font-weight-bold text-center"><IntlMessages id="sidebar.secretKey" />
                                        <CopyToClipboard style={{ cursor: "pointer" }} text={this.state.generateApiKeyData.SecretKey} onCopy={this.copySecretKey}>
                                            <i className="fa fa-clone pl-5" style={{ fontSize: "16px" }}></i>
                                        </CopyToClipboard>
                                    </p>
                                    <p id="secretKey" value={this.state.generateApiKeyData.SecretKey} style={{ background: "cadetblue" }}>{this.state.generateApiKeyData.SecretKey}</p>

                                </div>

                            </Col>

                            <Col md={4}>
                                <img alt="QrCode" className="h-80 w-80" src={this.props.generateApiKeyData.QRCode} />
                            </Col>
                        </Col>

                    </ModalBody>

                </Modal>
            </Fragment>
        )
    }
}


// map states to props when changed in states from reducer
const mapStateToProps = ({ apiKey }) => {
    const {

        generateApiKeyData,
        generateApiKeyLoading,
        generateApiKeyError,
        generateAPiKeyBit,
    } = apiKey

    return {
        generateApiKeyData,
        generateApiKeyLoading,
        generateApiKeyError,
        generateAPiKeyBit,
    }

}

// export this component with action methods and props
export default connect(mapStateToProps,
    {
        generateApiKey,
        getApiKeyList
    }
)(AddApiKeyData);