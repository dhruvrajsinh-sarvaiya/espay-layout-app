/**
 * Create By Sanjay 
 * Created Date 28-05-2019
 * Component For ADD HTML Block 
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, FormGroup, Input, Label, Button, Row } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { NotificationManager } from "react-notifications";
import ReactQuill from 'react-quill';//for editor
import Switch from '@material-ui/core/Switch';

import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import { getHTMLBlocks, addHTMLBlockDetails } from 'Actions/HTMLBlocks';
import { DashboardPageTitle } from '../DashboardPageTitle';
const validateHTMLBlockFormInput = require('../../../validation/HTMLBlocks/htmlblocks');

//BreadCrumbData
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.cms" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.HTMLBlocks" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="htmlBlock.title.add-HtmlBlock" />,
        link: '',
        index: 0
    }
];

class add extends Component {

    state = {
        addHtmlBlockDetails: {
            name: "",
            content: "",
            status: 1
        },
        errors: {},
        checked: true
    }

    componentWillReceiveProps(nextProps){        
        if (nextProps.add_htmlblock.responseCode === 0) {
            NotificationManager.success(<IntlMessages id="htmlBlock.addHTMLBlockSuccess" />);
            this.props.getHTMLBlocks();
            this.resetData();
        } else if (nextProps.add_htmlblock.responseCode === 1 || nextProps.add_htmlblock.responseCode === 9) {
            var errMsg = <IntlMessages id="htmlBlock.addHTMLBlockFail"/>;
            NotificationManager.error(errMsg);
        }
    }

    resetData = () => {
        this.setState({
            addHtmlBlockDetails: {
                name: "",
                content: "",
                status: 1
            },
            errors: {},
            checked: true
        });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.setState({
            addHtmlBlockDetails: {
                name: "",
                content: "",
                status: 1
            },
            errors: {},
            checked: true
        });
        this.props.closeAll();
    }

    handleChangeSwitch = name => event => {
        this.setState({ [name]: event.target.checked });
        let tempObj = Object.assign({}, this.state.addHtmlBlockDetails);
        if (this.state.checked === false) {
            tempObj["status"] = 1;
            this.setState({
                addHtmlBlockDetails: tempObj
            })
        }
        else {
            tempObj["status"] = 0;
            this.setState({
                addHtmlBlockDetails: tempObj
            })
        }
    };

    handleContentChange = (value) => {
        let tempObj = Object.assign({}, this.state.addHtmlBlockDetails);
        tempObj["content"] = value;

        this.setState({
            addHtmlBlockDetails: tempObj
        })
    }

    handleNameChange = (e) => {
        let tempObj = Object.assign({}, this.state.addHtmlBlockDetails);
        tempObj[e.target.name] = e.target.value;

        this.setState({
            addHtmlBlockDetails: tempObj
        })
    }

    onAddHTMLBlock = (event) => {        
        event.preventDefault();        
        const { errors, isValid } = validateHTMLBlockFormInput(this.state.addHtmlBlockDetails);        
        this.setState({ errors: errors });        
        if (isValid) {                 
            this.props.addHTMLBlockDetails(this.state.addHtmlBlockDetails);
        }
    }

    render() {
        const { loading } = this.props;
        const { name, content } = this.state.addHtmlBlockDetails;
        const { errors } = this.state;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="htmlBlock.title.add-HtmlBlock" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
                {loading && <JbsSectionLoader />}
                <FormGroup row>
                    <Label for="name" md={3}>
                        <IntlMessages id="htmlblock.BlockName" />
                    </Label>
                    <Col md={9}>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            maxLength="50"
                            value={name}
                            onChange={this.handleNameChange}
                        />
                        {errors.name && <span className="text-danger text-left"><IntlMessages id={errors.name} /></span>}
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label md={3} for="content"><IntlMessages id="htmlblock.content" /></Label>
                    <Col md={9}>
                        <ReactQuill
                            value={content}
                            onChange={this.handleContentChange}
                        />
                        {errors.content && <span className="text-danger text-left"><IntlMessages id={errors.content} /></span>}
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label md={3} for="status">
                        <IntlMessages id="htmlblock.status" />
                    </Label>
                    <Col md={9}>
                        <Switch
                            checked={this.state.checked}
                            onChange={this.handleChangeSwitch('checked')}
                            value="checked"
                            color="primary"
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label md={3} for="button" />
                    <Col md={9}>
                        <Row style={{ marginLeft: "inherit" }}>
                            <Button
                                className="text-white mr-10 text-bold btn"                                
                                color="primary"
                                onClick={(e) => {this.onAddHTMLBlock(e)}}
                                disabled={loading}
                            >
                                <IntlMessages id="button.add" />
                            </Button>
                            <Button
                                className="text-white text-bold btn btn bg-danger text-white"                                
                                onClick={this.resetData}
                            >
                                <IntlMessages id="button.cancel" />
                            </Button>
                        </Row>
                    </Col>
                </FormGroup>
            </div>
        )
    }
}

const mapDispatchToProps = ({ HTMLBlocksReducer }) => {
    const { add_htmlblock, loading } = HTMLBlocksReducer;
    return { add_htmlblock, loading };
};

export default connect(
    mapDispatchToProps,
    {
        addHTMLBlockDetails,
        getHTMLBlocks
    }
)(add);