/**
 * CreatedBy : Jinesh Bhatt
 * Date : 08-01-2019
 * Edit Email API
 */
import React, {Component, Fragment} from "react";
import { Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import Button from '@material-ui/core/Button';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';


const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
};

export default class ViewEmailAPIDetail extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            EmailApiDetail:props.EmailApiDetail ? props.EmailApiDetail : {},
            open: false,
            isAPICall:false,
            type:props.type
        };

        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.showComponent = this.showComponent.bind(this);
        this.closeAll = this.closeAll.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            EmailApiDetail:nextProps.EmailApiDetail
        });
    }

    componentWillMount() {
        // console.log('EmailApiDetail : ', this.props.EmailApiDetail);
        this.setState({
            EmailApiDetail:this.props.EmailApiDetail
        });
    }

    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName:''
        })
    };

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    };

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };
    changeDefault = (index) => {
        this.setState({
            defaultIndex: index
        });
    };


    render() {
        const {drawerClose} = this.props;

        return (
            <React.Fragment>
                <JbsCollapsibleCard>
                    <div className="m-20 page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2><IntlMessages id={this.state.type === 2  ? "emailAPIManager.viewEmailAPI": "emailAPIManager.viewSMSAPI"}/></h2>
                        </div>
                        <div className="page-title-wrap">
                            <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
                                    mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                            <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini
                                    onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                        </div>
                    </div>


                    <Row>
                        <Col>
                            <Label for="ServiceID" sm={4}>
                                {<IntlMessages id="emailAPIManager.label.ServiceID"/>}
                            </Label>
                        </Col>
                        <Col>
                            <Label for="ServiceID" sm={4}>
                                {this.state.EmailApiDetail.ServiceID}
                            </Label>
                        </Col>
                    </Row>{/*

                    <Row>
                        <Col>
                            <Label for="SerproID" sm={4}>
                                {<IntlMessages id="emailAPIManager.label.SerproID"/>}
                            </Label>
                        </Col>
                        <Col>
                            <Label for="SerproID" sm={4}>
                                {this.state.EmailApiDetail.SerproID}
                            </Label>
                        </Col>
                    </Row><Row>
                    <Col>
                        <Label for="ServiceTypeID" sm={4}>
                            {<IntlMessages id="emailAPIManager.label.ServiceTypeID"/>}
                        </Label>
                    </Col>
                    <Col>
                        <Label for="ServiceTypeID" sm={4}>
                            {this.state.EmailApiDetail.ServiceTypeID}
                        </Label>
                    </Col>
                </Row>*/}
                <Row>
                    <Col>
                        <Label for="SenderID" sm={4}>
                            {<IntlMessages id="emailAPIManager.label.SenderID"/>}
                        </Label>
                    </Col>
                    <Col>
                        <Label for="SenderID" sm={4}>
                            {this.state.EmailApiDetail.SenderID}
                        </Label>
                    </Col>
                </Row><Row>
                    <Col>
                        <Label for="SendURL" sm={4}>
                            {<IntlMessages id="emailAPIManager.label.SendURL"/>}
                        </Label>
                    </Col>
                    <Col>
                        <Label for="SendURL" sm={4}>
                            {this.state.EmailApiDetail.SendURL}
                        </Label>
                    </Col>
                </Row><Row>
                    <Col>
                        <Label for="Priority" sm={4}>
                            {<IntlMessages id="emailAPIManager.label.Priority"/>}
                        </Label>
                    </Col>
                    <Col>
                        <Label for="Priority" sm={4}>
                            {this.state.EmailApiDetail.Priority}
                        </Label>
                    </Col>
                </Row>{/*<Row>
                    <Col>
                        <Label for="RequestID" sm={4}>
                            {<IntlMessages id="emailAPIManager.label.RequestID"/>}
                        </Label>
                    </Col>
                    <Col>
                        <Label for="RequestID" sm={4}>
                            {this.state.EmailApiDetail.RequestID}
                        </Label>
                    </Col>
                </Row>*/}
                <Row>
                    <Col>
                        <Label for="ServiceName" sm={4}>
                            {<IntlMessages id="emailAPIManager.label.ServiceName"/>}
                        </Label>
                    </Col>
                    <Col>
                        <Label for="ServiceName" sm={4}>
                            {this.state.EmailApiDetail.ServiceName}
                        </Label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label for="SerproName" sm={4}>
                            {<IntlMessages id="emailAPIManager.label.SerproName"/>}
                        </Label>
                    </Col>
                    <Col>
                        <Label for="SerproName" sm={4}>
                            {this.state.EmailApiDetail.SerproName}
                        </Label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label for="UserID" sm={4}>
                            {<IntlMessages id="emailAPIManager.label.UserID"/>}
                        </Label>
                    </Col>
                    <Col>
                        <Label for="UserID" sm={4}>
                            {this.state.EmailApiDetail.UserID}
                        </Label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label for="Password" sm={4}>
                            {<IntlMessages id="emailAPIManager.label.Password"/>}
                        </Label>
                    </Col>
                    <Col>
                        <Label for="Password" sm={4}>
                            {this.state.EmailApiDetail.Password}
                        </Label>
                    </Col>
                </Row>
                </JbsCollapsibleCard>
            </React.Fragment>
        );
    }
}
// map state to props