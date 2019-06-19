/// component for add api key data by Tejas 8/3/2019

import React, { Fragment, Component } from 'react';

// import for design
import {
    Row,
    Col,
    Button,
    ModalBody,
    ModalHeader,
    ModalFooter,
} from 'reactstrap';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// used for display notifications
import { NotificationManager } from 'react-notifications';

// import for connect store
import { connect } from 'react-redux';

//used for conver messages in different language
import IntlMessages from 'Util/IntlMessages';

// actions for Call API 
import {
    deleteApiKey,
} from 'Actions/ApiKey';

//class for add api key data
class DeleteApiKeyData extends Component {

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
            deletePlanData: props.deletePlanData ? props.deletePlanData : {},
            addNewData: props.addNewData ? true : false
        }
    }

    DeleteApiKey = () => {
        const data = {
            planKey: this.state.deletePlanData.KeyId
        }

        this.props.deleteApiKey(data)
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.deleteApiKeyData && this.state.deleteAPiKeyBit !== nextprops.deleteAPiKeyBit && nextprops.deleteApiKeyData.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id="sidebar.apikeys.generate.delete.success" />)
            this.setState({
                deleteApiKeyData: nextprops.deleteApiKeyData,
                deleteAPiKeyBit: nextprops.deleteAPiKeyBit,
                deleteData: false
            })
            this.props.CloseDeleteModal();
            this.props.getKeyData()
        } else if (nextprops.deleteApiKeyError && this.state.deleteAPiKeyBit !== nextprops.deleteAPiKeyBit && nextprops.deleteApiKeyError.ReturnCode === 1) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.deleteApiKeyError.ErrorCode}`} />);
            this.setState({
                deleteAPiKeyBit: nextprops.deleteAPiKeyBit,
                deleteData: false
            })
            this.props.CloseDeleteModal();
        }
    }

    //renders the component
    render() {

        //returns the component
        return (
            <Fragment>

                {this.props.deleteApiKeyLoading && <JbsSectionLoader />}
                <ModalHeader className="modal_header_success">
                    <IntlMessages id="sidebar.apikeys.delete" />
                </ModalHeader>

                <ModalBody>
                    <Col md={12}>
                        <Row>
                            <Col md={6}>
                                <IntlMessages id="sidebar.colAliasName" />
                            </Col>

                            <Col md={6}>
                                <div className="text-right font-weight-bold">
                                    {this.state.deletePlanData.AliasName}
                                </div>
                            </Col>
                        </Row>


                        <Row>
                            <Col md={6}>
                                <IntlMessages id="sidebar.view.createdon" />
                            </Col>

                            <Col md={6}>
                                <div className="text-right font-weight-bold">
                                    {this.state.deletePlanData.CreatedDate ?
                                        this.state.deletePlanData.CreatedDate.replace('T', ' ').split('.')[0]
                                        : "-"
                                    }
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <IntlMessages id="sidebar.apikeys.allowes.access" />
                            </Col>

                            <Col md={6}>
                                <div className="text-right font-weight-bold">
                                    {this.state.deletePlanData.APIAccess === 1 ?
                                        <IntlMessages id="sidebar.view.adminrights" />
                                        : <IntlMessages id="sidebar.view.viewrights" />}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <hr />

                    <Col md={12}>
                        <div className="text-warning font-weight-bold">
                            <IntlMessages id="sidebar.apikeys.delete.note" />
                        </div>
                    </Col>
                </ModalBody>
                <ModalFooter>
                    <Row>
                        <Button
                            variant="raised"
                            onClick={() => this.props.CloseDeleteModal()}
                            className="btn-danger text-white m-5"
                        >
                            <span>
                                <IntlMessages id="button.cancel" />
                            </span>
                        </Button>
                        <Button
                            variant="raised"
                            onClick={() => this.DeleteApiKey()}
                            className="btn-info text-white m-5"
                        >
                            <span>
                                <IntlMessages id="widgets.apikey.remove" />
                            </span>
                        </Button>
                    </Row>
                </ModalFooter>
            </Fragment>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ apiKey }) => {
    const {

        deleteApiKeyData,
        deleteApiKeyLoading,
        deleteApiKeyError,
        deleteAPiKeyBit,
    } = apiKey

    return {
        deleteApiKeyData,
        deleteApiKeyLoading,
        deleteApiKeyError,
        deleteAPiKeyBit,
    }

}

// export this component with action methods and props
export default connect(mapStateToProps,
    {
        deleteApiKey,
    }
)(DeleteApiKeyData);