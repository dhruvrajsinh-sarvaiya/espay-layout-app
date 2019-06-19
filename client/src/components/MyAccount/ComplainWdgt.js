import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Row, Col } from "reactstrap";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
// intl messages
import IntlMessages from "Util/IntlMessages";
import Tooltip from '@material-ui/core/Tooltip';
import { ComplainFormWdgt, ComplainReportsWdgt, ComplainReplayFormWdgt } from './HelpAndSupport';

class ComplainWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ListComplain: true,
            ComplainNumber: "",
        }
        this.GetListComplain = this.GetListComplain.bind(this);
    }

    GetListComplain() {
        this.setState({ ListComplain: true });
    }
    myCallbackComplainWdgt = (dataFromChild, ComplainNumber) => {
        this.setState({ ListComplain: dataFromChild, ComplainNumber: ComplainNumber });
    };

    myCallbackComplainWdgt1 = (dataFromChild) => {
        this.setState({ ListComplain: dataFromChild });
    };

    render() {
        const { ListComplain, ComplainNumber } = this.state;
        return (
            <Fragment>
                <Tabs defaultTab="raiseComplain">
                    <Row>
                        <Col md={3} className="pr-0 prsnl_col">
                            <div className="innertabpanel ">
                                <TabList className="myaccountinnerTab">
                                    <Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="raiseComplain">
                                        <Tooltip id="tooltip-icon" title={<IntlMessages id="sidebar.raiseComplain" />}><i class="zmdi zmdi-help" /></Tooltip>
                                        <IntlMessages id="sidebar.raiseComplain" />
                                    </Tab>
                                    <Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="complainList" onClick={this.GetListComplain}>
                                        <Tooltip id="tooltip-icon" title={<IntlMessages id="sidebar.complain" />}><i class="zmdi zmdi-comment-list" /></Tooltip>
                                        <IntlMessages id="sidebar.complain" />
                                    </Tab>
                                </TabList>
                            </div>
                        </Col>
                        <Col md={9} className="p-0">
                            <TabPanel tabId="raiseComplain" >
                                <div className="mb-0 pb-10 tabformtitle">
                                    <span><IntlMessages id="sidebar.raiseComplain" /></span>
                                    <p><IntlMessages id="my_account.helpNSupoortNote.complainFormWdgt" /></p>
                                </div>
                                <div className="ml-10 user-account-body">
                                    <div className="p-15  mb-5">
                                        <ComplainFormWdgt {...this.props} />
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel tabId="complainList">
                                {ListComplain ?
                                    <div>
                                        <div className="tabformtitle">
                                            <span><IntlMessages id="sidebar.complain" /></span>
                                            <p><IntlMessages id="my_account.helpNSupoortNote.complainReportWdgt" /></p>
                                        </div>
                                        <div className="ml-10 user-account-body">
                                            <div className="p-15 mb-5">
                                                <ComplainReportsWdgt {...this.props} myCallbackComplainWdgt={this.myCallbackComplainWdgt} />
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <div className="tabformtitle">
                                            <span><IntlMessages id="sidebar.replyComplain" /></span>
                                            <p><IntlMessages id="my_account.replyHelpNSupoortNote.complainReplayFormWdgt" /></p>
                                        </div>
                                        <div className="ml-10 user-account-body">
                                            <div className="p-15 mb-5">
                                                <ComplainReplayFormWdgt {...this.props} myCallbackComplainWdgt1={this.myCallbackComplainWdgt1} ComplainNumber={ComplainNumber} />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </TabPanel>
                        </Col>
                    </Row>
                </Tabs>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ settings }) => {
    const { darkMode } = settings;
    return { darkMode };
}
export default connect(mapStateToProps)(ComplainWdgt);