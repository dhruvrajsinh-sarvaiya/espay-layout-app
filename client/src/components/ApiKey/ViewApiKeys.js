// component for display api keys BY tejas 7/3/219
import React, { Component, Fragment } from 'react';

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

//used dfor display dialog boxes
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';

//used fro language conversion
import IntlMessages from 'Util/IntlMessages';

// Used For Set Conditional Base Classes
import classnames from "classnames";
// import for connect store
import { connect } from 'react-redux';

// used for display notifications
import { NotificationManager } from 'react-notifications';



// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// used fro Varify 2FA
import {
    verify2fa,
} from "Actions/Withdraw";

// import neccessary actions for fetch records
import {
    getUserActivePlan
} from 'Actions/ApiPlan';

//Actions fro Call API
import {
    getApiKeyList,
    getApiKeyByID
} from 'Actions/ApiKey';

// get Profile Data
import { getProfileByID } from "Actions/MyAccount";

// for cinvert language object into string
import { injectIntl } from 'react-intl';

//components for view,add and update key
import ViewApiKeyData from "./ViewApiKeyData";
import AddApiKeyData from "./AddApiKeyData";
import DeleteApiKeyData from "./DeleteApiKey";
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
// class for display view APIkey list
class ViewAPIKeyList extends Component {

    // make default state values on load
    constructor(props) {

        super(props);

        this.state = {
            getUserList: 0,
            userActivePlan: {},
            userBit: 0,
            keyLimit: 0,
            keyCount: 0,
            viewData: false,
            selectedData: {},
            apiKeyModal: false,
            secretKeyModal: false,
            apiKey: "",
            secreyKey: "",
            editApiKey: false,
            editApiKeyData: {},
            addNewData: false,
            apiKeyName: "",
            apiPermission: 1,
            generateApiKeyData: {},
            generateAPiKeyBit: 0,
            generateKeySuccess: false,
            deletePlanData: {},
            deleteData: false,
            deleteAPiKeyBit: 0,
            ipWhitelistData: [],
            getProfileInfoBit: 0,
            IPCount: 0,
            IPLimit: 0,
            TwoFAStatus: false,
            twoFA: false,
            showDialog: false,
            code: "",
            varify2faCode: 0,
            apiKeyListData: [],
            viewKeyAPIData: 0,
            viewKeySecretData: 0
        }
    }

    // invoke after render component
    componentDidMount() {
        this.setState({
            getUserList: 1,
            getProfileInfoBit: 1
        })
        this.props.getUserActivePlan({})
        this.props.getProfileByID();
    }

    // used fro close show dialog
    handleClose = () => {
        this.setState({ showDialog: false, code: "" });
    };

    // Invoke when component will about to recieve props
    componentWillReceiveProps(nextprops) {

        if (nextprops.response2fa.hasOwnProperty("ErrorCode") && nextprops.response2fa.ErrorCode === 0 && this.state.varify2faCode === 1) {

            this.handleClose();
            this.setState({
                addNewData: true,
                code: "",
                varify2faCode: 0
            })
        }

        if (nextprops.data.ReturnCode === 1 && this.state.getProfileInfoBit === 1) {

            this.setState({
                getProfileInfoBit: 0,
                TwoFAStatus: nextprops.data.UserData.TwoFactorEnabled
            })
        } else if (nextprops.data.ReturnCode === 0 && this.state.addNewData === false
            && this.state.getProfileInfoBit === 1
        ) {
            this.setState({
                getProfileInfoBit: 0,
                TwoFAStatus: nextprops.data.UserData.TwoFactorEnabled
            });
        }

        // set state for user plans
        if (
            this.state.getUserList &&
            typeof (nextprops.UserPlanList) !== undefined &&
            typeof (nextprops.UserPlanList) !== null &&
            nextprops.UserPlanList &&
            this.state.userBit !== nextprops.userPlanBit
        ) {

            this.setState({
                UserActivePlanList: 0,
                userActivePlan: nextprops.UserPlanList,
                userBit: nextprops.userPlanBit,
                getUserList: 0
            })
            this.props.getApiKeyList({ PlanID: nextprops.UserPlanList.PlanID })

        }

        if (this.state.getUserList
            && nextprops.userPlanError.ReturnCode === 1
            && this.state.userBit !== nextprops.userPlanBit) {

            this.setState({
                UserActivePlanList: 0,
                userActivePlan: {},
                userBit: nextprops.userPlanBit,
                getUserList: 0
            })

            NotificationManager.error(<IntlMessages id="sidebar.apikey.selectplan" />);
            this.props.history.push("/app/ApiPlan")
        }

        if (nextprops.apiKeyList) {

            this.setState({
                apiKeyList: nextprops.apiKeyList,
                keyLimit: nextprops.keyLimit,
                keyCount: nextprops.keyCount
            })
        }

        if (nextprops.apiKeyListByID) {
            if (this.state.viewKeyAPIData === 1) {
                this.setState({
                    apiKey: nextprops.apiKeyListByID.APIKey,
                    apiKeyListData: nextprops.apiKeyListByID,
                    viewKeyAPIData: 0
                })
            }

            if (this.state.viewSecretAPIData === 1) {
                this.setState({
                    secretKey: nextprops.apiKeyListByID.SecretKey,
                    apiKeyListData: nextprops.apiKeyListByID,
                    viewSecretAPIData: 0
                })
            }

        }

    }

    //set state for viewdata
    ViewData = (apiKey) => {
        this.setState({
            selectedData: apiKey,
            viewData: true
        })
    }

    //used fro view secret key
    ViewSecretKey = (secretKey) => {
        this.setState({
            viewSecretAPIData: 1,
            secretKeyModal: true
        })
        this.props.getApiKeyByID({ KeyID: secretKey })
    }

    //used for view api key
    ViewApiKey = (apiKey) => {

        this.setState({
            viewKeyAPIData: 1,
            apiKeyModal: true
        })

        this.props.getApiKeyByID({ KeyID: apiKey })

    }

    //used for toggle modal
    togglemodel = () => {
        this.setState({
            generateKeySuccess: !this.state.generateKeySuccess,
            addNewData: false
        })

    }

    //used fro fetch key data
    getKeyData = () => {
        this.props.getApiKeyList({ PlanID: this.state.userActivePlan.PlanID })
    }

    //used for close delete modal
    CloseDeleteModal = () => {
        this.setState({
            viewData: false,
            selectedData: {},
            apiKeyModal: false,
            secretKeyModal: false,
            apiKey: "",
            secreyKey: "",
            editApiKey: false,
            editApiKeyData: {},
            addNewData: false,
            deleteData: false,
            deletePlanData: {},
            generateKeySuccess: false,
        })


    }

    // used for close modal
    closeModal = () => {
        this.setState({
            viewData: false,
            selectedData: {},
            apiKeyModal: false,
            secretKeyModal: false,
            apiKey: "",
            secreyKey: "",
            editApiKey: false,
            editApiKeyData: {},
            addNewData: false,
            deleteData: false,
            deletePlanData: {},
            generateKeySuccess: false,
        })
    }

    // used for set update Api key data
    UpdateApiKey = (editData) => {
        this.setState({
            editApiKey: true,
            editApiKeyData: editData
        })
    }

    //used for handle confirmation of 2FA
    handleConfirmation = () => {
        // check for whitelist bit
        if (this.state.twoFA) {
            if (this.state.code !== "" && this.state.code.length === 6) {
                this.setState({ varify2faCode: 1 })
                this.props.verify2fa({
                    'Code': this.state.code,
                });
            }
        }

    };

    // used for add API key list
    addAPIKeyList = () => {

        if (this.state.TwoFAStatus) {

            this.setState({
                twoFA: true,
                showDialog: true
            });

        } else {
            NotificationManager.error(<IntlMessages id="sidebar.apikey.title.error.2fa" />)
            setTimeout(function () {
                window.location.href = '/app/my-account/my-profile-info';
            }, 2000);
        }

    }

    // handle state for change api key
    handleChangeApiKey = (event) => {
        event.preventDefault()
        this.setState({
            apiKeyName: event.target.value
        })
    }

    // used for cancel api key
    CancelApiKey = (event) => {
        event.preventDefault()

        this.setState({
            viewData: false,
            selectedData: {},
            apiKeyModal: false,
            secretKeyModal: false,
            apiKey: "",
            secreyKey: "",
            editApiKey: false,
            editApiKeyData: {},
            addNewData: false,
            deleteData: false,
            apiKeyName: "",
            apiPermission: ""

        })

    }

    // used for set state of api permission
    handleChangeApiPermission = (e) => {
        this.setState({
            apiPermission: e.target.value
        })
    }

    // used for open modal for delet key
    DeleteKey = (item) => {

        this.setState({
            deleteData: true,
            deletePlanData: item
        })
    }

    //renders the component
    render() {

        return (
            <Fragment>
                {
                    (this.props.userPlanLoading ||
                        this.props.TwOFALoader ||
                        this.props.ipWhitelistLoading ||
                        this.props.response2fa.loading || this.props.loading) &&
                    <JbsSectionLoader />
                }
                <div className="charts-widgets-wrapper">
                    <PageTitleBar title={<IntlMessages id="sidebar.view.public.ApiKey" />} match={this.props.match} />

                    {this.state.userActivePlan && this.state.userActivePlan !== null && this.state.userActivePlan !== {} &&
                        this.state.UserActivePlanList === 0 &&
                        this.state.viewData === false &&
                        this.state.addNewData === false &&
                        this.state.generateKeySuccess === false &&
                        <div className="row">

                            <div className="offset-md-2 col-md-8 col-sm-12">
                                <div className="p-5" style={{ border: "1px solid #5D92F4" }}>
                                    <Row className="m-0 mt-5">

                                        <Col md={6} sm={6} className="text-right">
                                            <div className="text-left font-weight-bold" style={{ fontSize: "24px" }}><IntlMessages id="sidebar.apikey.title.viewapi.key" /></div>
                                        </Col>

                                        <Col md={6} sm={6} className="text-right">
                                            <div >

                                                <Button style={{ fontSize: "18px" }} color="info" size="sm" onClick={this.addAPIKeyList}>
                                                    <i className="fa fa-plus mr-1" />
                                                    <IntlMessages id="sidebar.view.button.ApiKey.create" />
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="m-5" style={{ fontSize: "24px !important" }}>
                                        <h3><IntlMessages id="sidebar.apikeys.info" /></h3>
                                    </Row>

                                    <Card className="m-5">
                                        <div className="row p-5 m-5 api_key_step">
                                            <Col md={4} sm={4} className="api_plan">
                                                <i style={{ fontSize: "80px" }} className="pl-30 fa fa-bullseye font-weight-bold m-10"></i>
                                                <p className="text-primary pl-30 iconplan text-uppercase"><IntlMessages id="sidebar.ApiPlan" /></p>
                                            </Col>

                                            <Col md={4} sm={4} className="plan_tlt">

                                                <div className="apikeyplantitle">
                                                    <p>{this.state.userActivePlan.PlanName}</p>
                                                    <span>{this.state.userActivePlan.TotalAmt} {" "} </span>
                                                </div>

                                            </Col>

                                            <Col md={4} sm={4}
                                                className={this.state.userActivePlan.PlanStatus === 1 ?

                                                    "text-success mt-10 api_status" :

                                                    this.state.userActivePlan.PlanStatus === 0 ?
                                                        "text-danger mt-10 api_status" :

                                                        this.state.userActivePlan.PlanStatus === 9 &&
                                                        "text-warning mt-10 api_status"

                                                }>


                                                <div className="text-right font-weight-bold" style={{ fontSize: "24px" }}>

                                                    {/* <div>  */}
                                                    {this.state.userActivePlan.PlanStatus === "1" &&
                                                        <span
                                                            style={{ fontSize: "100%" }}
                                                            className={`badge badge-xs badge-success position-relative d-inline-flex mr-2`}
                                                        >
                                                            &nbsp;
                                         </span>
                                                    }
                                                    {this.state.userActivePlan.PlanStatus === "0" &&
                                                        <span
                                                            style={{ fontSize: "100%" }}
                                                            className={`badge badge-xs badge-danger position-relative d-inline-flex mr-2`}
                                                        >
                                                            &nbsp;
                                         </span>
                                                    }
                                                    {this.state.userActivePlan.PlanStatus === "9" &&
                                                        <span
                                                            style={{ fontSize: "100%" }}
                                                            className={`badge badge-xs badge-warning position-relative d-inline-flex mr-2`}
                                                        >
                                                            &nbsp;
                                        </span>
                                                    }

                                                    {this.state.userActivePlan.PlanStatus === 1 ? <IntlMessages id="sidebar.active" />
                                                        : this.state.userActivePlan.PlanStatus === 0 ? <IntlMessages id="sidebar.inActive" />

                                                            : this.state.userActivePlan.PlanStatus === 9 ? <IntlMessages id="sidebar.inProcess" /> : ""

                                                    }

                                                </div>
                                            </Col>

                                        </div>
                                    </Card>
                                    {this.state.apiKeyList && this.state.apiKeyList.length > 0 &&
                                        <Card className="m-5 apikeylist" >
                                            <Row className="m-5">
                                                <Col md={6} sm={12}>
                                                    <h1 className="m-10">
                                                        <IntlMessages id="sidebar.apikeys.public" />
                                                    </h1>
                                                </Col>

                                                <Col md={4} sm={6}>
                                                    <div className="m-10 d-none">
                                                        <input type="text" value="Hello" />
                                                    </div>
                                                </Col>

                                                <Col md={2} sm={6} className="totalapiKeys">
                                                    <p style={{ fontSize: "30px" }}>{this.state.keyCount} / {this.state.keyLimit}</p>
                                                    <p><IntlMessages id="sidebar.apikeys.totalapikeys" /></p>
                                                </Col>
                                                <hr />
                                            </Row>
                                            <div className="tbl_overflow_auto">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <td>{<IntlMessages id="sidebar.view.button.aliasname" />}</td>
                                                            <td>{<IntlMessages id="sidebar.ApiKey" />}</td>
                                                            <td>{<IntlMessages id="sidebar.secretKey" />}</td>
                                                            <td>{<IntlMessages id="sidebar.view.createdon" />}</td>
                                                            <td>{<IntlMessages id="sidebar.view.apiaccess" />}</td>
                                                            <td>{<IntlMessages id="sidebar.view.ipaccess" />}</td>
                                                            <td>{<IntlMessages id="sidebar.colActions" />}</td>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {this.state.apiKeyList && this.state.apiKeyList.length > 0 ?
                                                            this.state.apiKeyList.map((apiKey, key) => {
                                                                return <tr key={key}>
                                                                    <td>{apiKey.AliasName}</td>
                                                                    <td>{apiKey.APIKey.substring(apiKey.APIKey.length - 10, apiKey.APIKey.length)}
                                                                        <a href="javascript:void(0)" onClick={() =>
                                                                            this.ViewApiKey(apiKey.KeyId)}><i
                                                                                className="fa fa-eye pl-5" style={{ fontSize: "16px" }}></i>
                                                                        </a>
                                                                    </td>
                                                                    <td>{apiKey.SecretKey.substring(apiKey.SecretKey.length - 10, apiKey.SecretKey.length)}
                                                                        <a href="javascript:void(0)" onClick={() =>
                                                                            this.ViewSecretKey(apiKey.KeyId)}><i
                                                                                className="fa fa-eye pl-5" style={{ fontSize: "16px" }}></i>
                                                                        </a>
                                                                    </td>
                                                                    <td>{apiKey.CreatedDate.replace('T', ' ').split('.')[0]}</td>
                                                                    <td>{apiKey.APIAccess === 1 ? <IntlMessages id="sidebar.view.adminrights" />
                                                                        : <IntlMessages id="sidebar.view.viewrights" />}</td>
                                                                    <td>{apiKey.IPAccess === 1 ? <IntlMessages id="sidebar.view.restrictedaccess" />
                                                                        : <IntlMessages id="sidebar.view.unrestrictedaccess" />}</td>
                                                                    <td>
                                                                        <div>
                                                                            <a href="javascript:void(0)" onClick={() => this.DeleteKey(apiKey)}><i className="fa fa-trash pl-5" style={{ fontSize: "16px" }}></i></a>
                                                                            <a href="javascript:void(0)" onClick={() => this.ViewData(apiKey)}><i className="fa fa-eye pl-5" style={{ fontSize: "16px" }}></i></a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            })

                                                            :

                                                            ""
                                                        }

                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Card>
                                    }

                                    {this.state.apiKeyList && this.state.apiKeyList.length === 0 &&
                                        <Card className="m-5" >
                                            <div className="text-center">
                                                <a href="javascript:void(0)" onClick={this.addAPIKeyList}>
                                                    <i className="fa fa-plus" aria-hidden="true" style={{ fontSize: "100px" }} />
                                                </a>
                                            </div>
                                            <div className="m-10 p-5 text-center" style={{ fontSize: "20px" }}>
                                                <IntlMessages id="sidebar.view.create.key" /></div>


                                            <p className="text-center" style={{ fontSize: "18px" }}><IntlMessages id="sidebar.view.create.key.detail" />
                                            </p>
                                        </Card>
                                    }
                                </div>
                            </div>
                        </div>


                    }

                    <Dialog
                        open={this.state.showDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        fullWidth={true}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        {(this.state.twoFA) ?
                            <Fragment>

                                <DialogTitle id="alert-dialog-slide-title">
                                    <div className="list-action justify-content-between d-flex">
                                        <IntlMessages id="myAccount.Dashboard.2faAuthentication" />
                                        <a
                                            href="javascript:void(0)"
                                            onClick={this.handleClose}
                                        >
                                            <i className="ti-close" />
                                        </a>
                                    </div>
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-slide-description">
                                        {this.props.response2fa.loading && <JbsSectionLoader />}
                                        <Form onSubmit={(e) => { e.preventDefault() }}>
                                            <FormGroup className="mb-0">
                                                <Label for="Code"><IntlMessages id="my_account.googleAuthCode" /></Label>
                                                <Input type="text" name="Code" id="Code" maxLength="6" autoComplete="off" value={this.state.code} onChange={(e) => (this.setState({ code: e.target.value }))} />
                                                {this.props.errors.hasOwnProperty("ErrorCode") && <span className="text-danger"><IntlMessages id={`apiErrCode.${this.props.errors.ErrorCode}`} /></span>}
                                            </FormGroup>
                                            <div className="mt-20 justify-content-center d-flex">
                                                <Button type="submit" variant="raised" onClick={this.handleConfirmation} className={classnames("btn-success text-white", { "disabled": !this.state.code })} > <IntlMessages id="wallet.btnVerify" /></Button>
                                            </div>
                                        </Form>
                                    </DialogContentText>
                                </DialogContent>
                            </Fragment>
                            :
                            <Fragment>
                                <DialogTitle id="alert-dialog-slide-title">
                                    {"Are you sure?"}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-slide-description">
                                        <ul type="circle" className="pl-20 mb-0">
                                            <li>{<IntlMessages id="wallet.WDPleaseNoteFirst" />}</li>
                                            <li>{<IntlMessages id="wallet.WDPleaseNoteSecond1" />}
                                                <a href="#">{<IntlMessages id="wallet.AGPLinkHistory" />}</a>{<IntlMessages id="wallet.WDPleaseNoteSecond2" />}</li>
                                        </ul>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="raised" onClick={this.handleClose} className="btn-danger text-white mr-10"><IntlMessages id="button.cancel" /></Button>
                                    <Button variant="raised" onClick={this.handleConfirmation} className="btn-success text-white mr-10"><IntlMessages id="wallet.AGDialogButtonAgree" /></Button>
                                </DialogActions>
                            </Fragment>
                        }
                    </Dialog>

                    {
                        this.state.viewData && this.state.selectedData &&
                        this.state.addNewData === false && this.state.editApiKey === false &&
                        this.state.generateKeySuccess === false &&
                        <ViewApiKeyData selectedData={this.state.selectedData}
                            changeIpAccess={this.UpdateApiKey}
                            PlanID={this.state.userActivePlan.PlanID}
                            APIKeyID={this.state.userActivePlan.PlanID}
                            keyCount={this.state.keyCount}
                            keyLimit={this.state.keyLimit}
                            totalIPCount={this.state.IPCount}
                            totalIPLimit={this.state.IPLimit}
                            ipWhitelistData={this.state.ipWhitelistData.length > 0 ? this.state.ipWhitelistData : []}
                            closeViewData={this.closeModal}
                            CloseDeleteModal={this.CloseDeleteModal}
                            DeleteKey={this.DeleteKey}
                        />
                    }


                    {
                        this.state.addNewData &&
                        <Modal isOpen={this.state.addNewData}>
                            <AddApiKeyData
                                userActivePlan={this.state.userActivePlan}
                                CancelApiKey={this.CancelApiKey}
                                togglemodel={this.togglemodel}
                                PlanID={this.state.userActivePlan.PlanID}

                            />
                        </Modal>
                    }
                </div>

                <Modal isOpen={this.state.apiKeyModal || this.state.secretKeyModal}>
                    {

                        this.props.apiKeyListByIDLoading &&
                        <JbsSectionLoader />
                    }
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


                <Modal isOpen={this.state.deleteData && this.state.deletePlanData}>
                    <DeleteApiKeyData
                        deletePlanData={this.state.deletePlanData}
                        CloseDeleteModal={this.CloseDeleteModal}
                        getKeyData={this.getKeyData}
                    />
                </Modal>
            </Fragment>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ apiPlan, apiKey, editProfileRdcer, withdrawApp }) => {
    const {
        userPlanError,
        userPlanLoading,
        UserPlanList,
        userPlanBit,
        userErrorCode
    } = apiPlan;
    const {
        apiKeyList,
        loading,
        error,
        errorCode,
        keyLimit,
        keyCount,
        apiKeyListByID,
        apiKeyListByIDError,
        apiKeyListByIDLoading
    } = apiKey

    let data = editProfileRdcer.data;
    let TwOFALoader = editProfileRdcer.loading;

    const { response2fa, errors } = withdrawApp;

    return {
        userPlanError,
        userPlanLoading,
        UserPlanList,
        userPlanBit,
        userErrorCode,
        apiKeyList,
        loading,
        error,
        errorCode,
        keyLimit,
        keyCount,
        data,
        TwOFALoader,
        response2fa,
        errors,
        apiKeyListByID,
        apiKeyListByIDError,
        apiKeyListByIDLoading
    }

}

// export this component with action methods and props
export default connect(mapStateToProps,
    {
        getUserActivePlan,
        getApiKeyList,
        getProfileByID,
        verify2fa,
        getApiKeyByID
    }
)(injectIntl(ViewAPIKeyList));