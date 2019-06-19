/**
 * Create By Sanjay 
 * Created Date 05-06-2019
 * Component For Edit Advance HTML Blocks
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';//for connect react with redux
import { Col, FormGroup, Input, Label, Button, Row } from "reactstrap";
import IntlMessages from "Util/IntlMessages";//for Supporting to Multi Language 
import { NotificationManager } from "react-notifications";//for Notification PopUp 
import ReactQuill from 'react-quill';//for editor
import Switch from '@material-ui/core/Switch';
import validator from 'validator';//validation purpose

import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';//for loader while API call 
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { getAdvanceHTMLBlocksList, editAdvanceHTMLBlock } from 'Actions/AdvanceHTMLBlocks';//call Actions for Add and list 
import { DashboardPageTitle } from '../DashboardPageTitle';
const validateAdvanceHTMLBlockFormInput = require('../../../validation/AdvanceHTMLBlocks/advancehtmlblocks');//Validation for fields

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
        title: <IntlMessages id="sidebar.AdvanceHTMLBlocks" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="advanceHtmlBlock.title.edit-AdvanceHtmlBlock" />,
        link: '',
        index: 0
    }
];

class edit extends Component {

    state = {
        name: "",
        status: 0,
        type: "1",
        content: {
            tabs: [
                {
                    tabtype: "1",
                    tabtitle: "",
                    tabcontenttype: "1",
                    tabcontent: "",
                    sortorder: ""
                }
            ],
            panles: [
                {
                    panletitle: "",
                    panlecontenttype: "1",
                    panlecontent: "",
                    sortorder: ""
                }
            ],
            modals: [
                {
                    modaltype: "1",
                    modalcaption: "",
                    modaltitle: "",
                    modalcontenttype: "1",
                    modalcontent: "",
                    sortorder: ""
                }
            ]
        },
        errors: {},
        checked: false
    }

    componentWillMount() {
        this.setState({
            name: this.props.selectedData.name,
            status: this.props.selectedData.status,
            type: this.props.selectedData.type.toString(),
            content: {
                ...this.state.content,
                tabs: this.props.selectedData.content.tabs.length !== 0 ? this.props.selectedData.content.tabs : [{ tabtype: "1", tabtitle: "", tabcontenttype: "1", tabcontent: "", sortorder: "" }],
                panles: this.props.selectedData.content.panles.length !== 0 ? this.props.selectedData.content.panles : [{ panletitle: "", panlecontenttype: "1", panlecontent: "", sortorder: "" }],
                modals: this.props.selectedData.content.modals.length !== 0 ? this.props.selectedData.content.modals : [{ modaltype: "1", modalcaption: "", modaltitle: "", modalcontenttype: "1", modalcontent: "", sortorder: "" }]
            }
        })
        if (this.props.selectedData.status === 1) {
            this.setState({ checked: true })
        } else if (this.props.selectedData.status === 0) {
            this.setState({ checked: false })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.edit_advance_htmlblock.responseCode === 0) {
            NotificationManager.success(<IntlMessages id="advanceHtmlBlock.updateHTMLBlockSuccess" />);
            this.props.getAdvanceHTMLBlocksList();
            this.resetData();
        } else if (nextProps.edit_advance_htmlblock.responseCode === 1 || nextProps.edit_advance_htmlblock.responseCode === 9) {
            const errMsg = <IntlMessages id="htmlBlock.addHTMLBlockFail" />;
            NotificationManager.error(errMsg);
        }
    }

    //function for Back Button 
    resetData = () => {
        this.setState({
            name: "",
            status: 0,
            type: "1",
            content: {
                tabs: [
                    {
                        tabtype: "1",
                        tabtitle: "",
                        tabcontenttype: "1",
                        tabcontent: "",
                        sortorder: ""
                    }
                ],
                panles: [
                    {
                        panletitle: "",
                        panlecontenttype: "1",
                        panlecontent: "",
                        sortorder: ""
                    }
                ],
                modals: [
                    {
                        modaltype: "1",
                        modalcaption: "",
                        modaltitle: "",
                        modalcontenttype: "1",
                        modalcontent: "",
                        sortorder: ""
                    }
                ]
            },
            errors: {},
            checked: false
        });
        this.props.drawerClose();
    }

    //function for Home Button
    closeAll = () => {
        this.setState({
            name: "",
            status: 0,
            type: "1",
            content: {
                tabs: [
                    {
                        tabtype: "1",
                        tabtitle: "",
                        tabcontenttype: "1",
                        tabcontent: "",
                        sortorder: ""
                    }
                ],
                panles: [
                    {
                        panletitle: "",
                        panlecontenttype: "1",
                        panlecontent: "",
                        sortorder: ""
                    }
                ],
                modals: [
                    {
                        modaltype: "1",
                        modalcaption: "",
                        modaltitle: "",
                        modalcontenttype: "1",
                        modalcontent: "",
                        sortorder: ""
                    }
                ]
            },
            errors: {},
            checked: false
        });
        this.props.closeAll();
    }

    //remove row/section of Tab 
    handelTabRemove(index) {
        if (this.state.content.tabs.length > 1) {
            this.state.content.tabs.splice(index, 1)
            this.setState({
                content: {
                    ...this.state.content,
                    tabs: this.state.content.tabs
                }
            })
        }
    }

    //Add New Row/section of Tab
    addNewTabRow = () => {
        let newObj = {
            tabtype: "1",
            tabtitle: "",
            tabcontenttype: "1",
            tabcontent: "",
            sortorder: ""
        };
        this.setState({
            content: {
                ...this.state.content,
                tabs: this.state.content.tabs.concat(newObj)
            }
        });
    }

    //remove row/section of Panle 
    handelPanleRemove(index) {
        if (this.state.content.panles.length > 1) {
            this.state.content.panles.splice(index, 1)
            this.setState({
                content: {
                    ...this.state.content,
                    panles: this.state.content.panles
                }
            })
        }
    }

    //Add New Row/section of Panle
    addNewPanleRow = () => {
        let newObj = {
            panletitle: "",
            panlecontenttype: "1",
            panlecontent: "",
            sortorder: ""
        };
        this.setState({
            content: {
                ...this.state.content,
                panles: this.state.content.panles.concat(newObj)
            }
        });
    }

    //remove row/section of Modal 
    handelModalRemove(index) {
        if (this.state.content.modals.length > 1) {
            this.state.content.modals.splice(index, 1)
            this.setState({
                content: {
                    ...this.state.content,
                    modals: this.state.content.modals
                }
            })
        }
    }

    //Add New Row/section of Modal
    addNewModalRow = () => {
        let newObj = {
            modaltype: "1",
            modalcaption: "",
            modaltitle: "",
            modalcontenttype: "1",
            modalcontent: "",
            sortorder: ""
        };
        this.setState({
            content: {
                ...this.state.content,
                modals: this.state.content.modals.concat(newObj)
            }
        });
    }

    //Handel Change Event
    handelChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    //Handle Switch Change 
    handleChangeSwitch = name => event => {
        this.setState({ [name]: event.target.checked });
        if (this.state.checked) {
            this.setState({
                status: 0
            })
        }
        else {
            this.setState({
                status: 1
            })
        }
    };

    //Handle Tab Change
    handleTabChange(e, index, key, flag) {
        if (key === 'sortorder') {
            if (validator.isNumeric(e.target.value, { no_symbols: true }) || e.target.value === "") {
                let tmpObject = Object.assign([], this.state.content.tabs);
                tmpObject[index][key] = e.target.value.toString();
                this.setState({
                    content: {
                        ...this.state.content,
                        tabs: tmpObject
                    }
                });
            }
        } else if (key === "tabcontent") {
            let tmpObject = Object.assign([], this.state.content.tabs);
            if (flag === true) {
                tmpObject[index][key] = e;
                this.setState({
                    content: {
                        ...this.state.content,
                        tabs: tmpObject
                    }
                });
            } else {
                tmpObject[index][key] = e.target.value;
                this.setState({
                    content: {
                        ...this.state.content,
                        tabs: tmpObject
                    }
                });
            }
        } else if (key === "tabcontenttype") {
            let tmpObject = Object.assign([], this.state.content.tabs);
            tmpObject[index][key] = e.target.value.toString();
            tmpObject[index]["tabcontent"] = "";
            this.setState({
                content: {
                    ...this.state.content,
                    tabs: tmpObject
                }
            });
        } else {
            let tmpObject = Object.assign([], this.state.content.tabs);
            tmpObject[index][key] = e.target.value.toString();
            this.setState({
                content: {
                    ...this.state.content,
                    tabs: tmpObject
                }
            });
        }
    }

    //Handle Panle Change
    handlePanleChange(e, index, key, flag) {
        if (key === 'sortorder') {
            if (validator.isNumeric(e.target.value, { no_symbols: true }) || e.target.value === "") {
                let tmpObject = Object.assign([], this.state.content.panles);
                tmpObject[index][key] = e.target.value.toString();
                this.setState({
                    content: {
                        ...this.state.content,
                        panles: tmpObject
                    }
                });
            }
        } else if (key === "panlecontent") {
            let tmpObject = Object.assign([], this.state.content.panles);
            if (flag === true) {
                tmpObject[index][key] = e;
                this.setState({
                    content: {
                        ...this.state.content,
                        panles: tmpObject
                    }
                });
            } else {
                tmpObject[index][key] = e.target.value;
                this.setState({
                    content: {
                        ...this.state.content,
                        panles: tmpObject
                    }
                });
            }
        } else if (key === "panlecontenttype") {
            let tmpObject = Object.assign([], this.state.content.panles);
            tmpObject[index][key] = e.target.value.toString();
            tmpObject[index]["panlecontent"] = "";
            this.setState({
                content: {
                    ...this.state.content,
                    panles: tmpObject
                }
            });
        } else {
            let tmpObject = Object.assign([], this.state.content.panles);
            tmpObject[index][key] = e.target.value.toString();
            this.setState({
                content: {
                    ...this.state.content,
                    panles: tmpObject
                }
            });
        }
    }

    //Handle Modal Change
    handleModalChange(e, index, key, flag) {
        if (key === 'sortorder') {
            if (validator.isNumeric(e.target.value, { no_symbols: true }) || e.target.value === "") {
                let tmpObject = Object.assign([], this.state.content.modals);
                tmpObject[index][key] = e.target.value.toString();
                this.setState({
                    content: {
                        ...this.state.content,
                        modals: tmpObject
                    }
                });
            }
        } else if (key === "modalcontent") {
            let tmpObject = Object.assign([], this.state.content.modals);
            if (flag === true) {
                tmpObject[index][key] = e;
                this.setState({
                    content: {
                        ...this.state.content,
                        modals: tmpObject
                    }
                });
            } else {
                tmpObject[index][key] = e.target.value;
                this.setState({
                    content: {
                        ...this.state.content,
                        modals: tmpObject
                    }
                });
            }
        } else if (key === "modalcontenttype") {
            let tmpObject = Object.assign([], this.state.content.modals);
            tmpObject[index][key] = e.target.value.toString();
            tmpObject[index]["modalcontent"] = "";
            this.setState({
                content: {
                    ...this.state.content,
                    modals: tmpObject
                }
            });
        } else {
            let tmpObject = Object.assign([], this.state.content.modals);
            tmpObject[index][key] = e.target.value.toString();
            this.setState({
                content: {
                    ...this.state.content,
                    modals: tmpObject
                }
            });
        }
    }

    onEditBlock = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateAdvanceHTMLBlockFormInput(this.state);
        this.setState({ errors: errors });

        if (isValid || Object.keys(errors).length === 0) {
            const Obj = {
                advancehtmlblockid: this.props.selectedData.advancehtmlblockid,
                name: this.state.name,
                status: this.state.status,
                type: this.state.type,
                content: {
                    tabs: this.state.type === "1" ? this.state.content.tabs : [],
                    panles: this.state.type === "2" ? this.state.content.panles : [],
                    modals: this.state.type === "3" ? this.state.content.modals : []
                }
            }
            this.props.editAdvanceHTMLBlock(Obj);
        }
    }

    render() {
        const { loading } = this.props;
        const { errors, name, type } = this.state;
        const { tabs, panles, modals } = this.state.content;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="advanceHtmlBlock.title.edit-AdvanceHtmlBlock" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
                {loading && <JbsSectionLoader />}
                <Row form>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="name"><IntlMessages id="htmlblock.BlockName" /></Label>
                            <Col>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={this.handelChange}
                                />
                                {errors.name && <span className="text-danger text-left"><IntlMessages id={errors.name} /></span>}
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="name"><IntlMessages id="advanceHtmlblock.BlockType" /></Label>
                            <Col>
                                <Input
                                    type="select"
                                    name="type"
                                    id="type"
                                    value={type}
                                    onChange={this.handelChange}
                                >
                                    <option value="">Select Block Type</option>
                                    <option value="1">Tabs</option>
                                    <option value="2">Panles</option>
                                    <option value="3">Modals</option>
                                </Input>
                                {errors.type && <span className="text-danger text-left"><IntlMessages id={errors.type} /></span>}
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="status"><IntlMessages id="htmlblock.status" /></Label>
                            <div>
                                <Switch
                                    checked={this.state.checked}
                                    onChange={this.handleChangeSwitch('checked')}
                                    value="checked"
                                    color="primary"
                                />
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
                <JbsCollapsibleCard>
                    {
                        type === "1" ?
                            <Fragment>
                                <Row>
                                    {
                                        tabs.map((lst, key) => {
                                            return (
                                                <Col key={key} md={6} className="mt-20">
                                                    <FormGroup>
                                                        <Label for="tabtype"><IntlMessages id="advanceHtmlblock.tabType" /></Label>
                                                        <Col>
                                                            <Input
                                                                type="select"
                                                                name="tabtype"
                                                                id="tabtype"
                                                                value={tabs[key].tabtype}
                                                                onChange={e => this.handleTabChange(e, key, "tabtype")}
                                                            >
                                                                <option value="">Select Tab Type</option>
                                                                <option value="1">Verticale</option>
                                                                <option value="2">Horizontal</option>
                                                            </Input>
                                                            {errors && errors[key] && errors[key].tabtype && <span className="text-danger text-left"><IntlMessages id={errors[key].tabtype} /></span>}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="tabtitle"><IntlMessages id="advanceHtmlblock.tabTitle" /></Label>
                                                        <Col>
                                                            <Input
                                                                type="text"
                                                                name="tabtitle"
                                                                id="tabtitle"
                                                                value={tabs[key].tabtitle}
                                                                onChange={e => this.handleTabChange(e, key, "tabtitle")}
                                                            />
                                                            {errors && errors[key] && errors[key].tabtitle && <span className="text-danger text-left"><IntlMessages id={errors[key].tabtitle} /></span>}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="tabcontenttype"><IntlMessages id="advanceHtmlblock.contentType" /></Label>
                                                        <Col>
                                                            <Input
                                                                type="select"
                                                                name="tabcontenttype"
                                                                id="tabcontenttype"
                                                                value={tabs[key].tabcontenttype}
                                                                onChange={e => this.handleTabChange(e, key, "tabcontenttype")}
                                                            >
                                                                <option value="">Select Content Type</option>
                                                                <option value="1">HTML Editor</option>
                                                                <option value="2">Load From URL</option>
                                                            </Input>
                                                            {errors && errors[key] && errors[key].tabcontenttype && <span className="text-danger text-left"><IntlMessages id={errors[key].tabcontenttype} /></span>}
                                                        </Col>
                                                    </FormGroup>
                                                    {
                                                        tabs[key].tabcontenttype.toString() === "1" ?
                                                            <FormGroup>
                                                                <Label for="tabcontent"><IntlMessages id="advanceHtmlblock.tabContent" /></Label>
                                                                <Col>
                                                                    <ReactQuill
                                                                        value={tabs[key].tabcontent}
                                                                        onChange={e => this.handleTabChange(e, key, "tabcontent", true)}
                                                                    />
                                                                    {errors && errors[key] && errors[key].tabcontent && <span className="text-danger text-left"><IntlMessages id={errors[key].tabcontent} /></span>}
                                                                </Col>
                                                            </FormGroup> :
                                                            <FormGroup>
                                                                <Label for="tabcontent"><IntlMessages id="advanceHtmlblock.tabContent" /></Label>
                                                                <Col>
                                                                    <Input
                                                                        type="text"
                                                                        name="tabcontent"
                                                                        id="tabcontent"
                                                                        value={tabs[key].tabcontent}
                                                                        onChange={e => this.handleTabChange(e, key, "tabcontent", false)}
                                                                    />
                                                                    {errors && errors[key] && errors[key].tabcontent && <span className="text-danger text-left"><IntlMessages id={errors[key].tabcontent} /></span>}
                                                                </Col>
                                                            </FormGroup>
                                                    }
                                                    <FormGroup>
                                                        <Label for="sortorder"><IntlMessages id="advanceHtmlblock.sortOrder" /></Label>
                                                        <Col>
                                                            <Input
                                                                type="text"
                                                                name="sortorder"
                                                                id="sortorder"
                                                                value={tabs[key].sortorder}
                                                                onChange={e => this.handleTabChange(e, key, "sortorder")}
                                                            />
                                                            {errors && errors[key] && errors[key].tabcontent && <span className="text-danger text-left"><IntlMessages id={errors[key].tabcontent} /></span>}
                                                        </Col>
                                                    </FormGroup>
                                                    <Button
                                                        className="text-white text-bold btn btn bg-danger text-white"
                                                        onClick={() => this.handelTabRemove(key)}
                                                        style={{ width: "20%" }}
                                                    >
                                                        <IntlMessages id="advanceHtmlblock.remove" />
                                                    </Button>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                                <div style={{ textAlign: "center" }}>
                                    <Button className="mt-10" color="primary" onClick={(e) => this.addNewTabRow(e)}>Add</Button>
                                </div>
                            </Fragment>
                            : type === "2" ?
                                <Fragment>
                                    <Row>
                                        {
                                            panles.map((lst, key) => {
                                                return (
                                                    <Col md={6} className="mt-20">
                                                        <FormGroup>
                                                            <Label for="panletitle"><IntlMessages id="advanceHtmlblock.panleTitle" /></Label>
                                                            <Col>
                                                                <Input
                                                                    type="text"
                                                                    name="panletitle"
                                                                    id="panletitle"
                                                                    value={panles[key].panletitle}
                                                                    onChange={e => this.handlePanleChange(e, key, "panletitle")}
                                                                />
                                                                {errors && errors[key] && errors[key].panletitle && <span className="text-danger text-left"><IntlMessages id={errors[key].panletitle} /></span>}
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="panlecontenttype"><IntlMessages id="advanceHtmlblock.panleContentType" /></Label>
                                                            <Col>
                                                                <Input
                                                                    type="select"
                                                                    name="panlecontenttype"
                                                                    id="panlecontenttype"
                                                                    value={panles[key].panlecontenttype}
                                                                    onChange={e => this.handlePanleChange(e, key, "panlecontenttype")}
                                                                >
                                                                    <option value="">Select Content Type</option>
                                                                    <option value="1">HTML Editor</option>
                                                                    <option value="2">Load From URL</option>
                                                                </Input>
                                                                {errors && errors[key] && errors[key].panlecontenttype && <span className="text-danger text-left"><IntlMessages id={errors[key].panlecontenttype} /></span>}
                                                            </Col>
                                                        </FormGroup>
                                                        {
                                                            panles[key].panlecontenttype.toString() === "1" ?
                                                                <FormGroup>
                                                                    <Label for="panlecontent"><IntlMessages id="advanceHtmlblock.panleContent" /></Label>
                                                                    <Col>
                                                                        <ReactQuill
                                                                            value={panles[key].panlecontent}
                                                                            onChange={e => this.handlePanleChange(e, key, "panlecontent", true)}
                                                                        />
                                                                        {errors && errors[key] && errors[key].panlecontent && <span className="text-danger text-left"><IntlMessages id={errors[key].panlecontent} /></span>}
                                                                    </Col>
                                                                </FormGroup> :
                                                                <FormGroup>
                                                                    <Label for="panlecontent"><IntlMessages id="advanceHtmlblock.panleContent" /></Label>
                                                                    <Col>
                                                                        <Input
                                                                            type="text"
                                                                            name="panlecontent"
                                                                            id="panlecontent"
                                                                            value={panles[key].panlecontent}
                                                                            onChange={e => this.handlePanleChange(e, key, "panlecontent", false)}
                                                                        />
                                                                        {errors && errors[key] && errors[key].panlecontent && <span className="text-danger text-left"><IntlMessages id={errors[key].panlecontent} /></span>}
                                                                    </Col>
                                                                </FormGroup>
                                                        }
                                                        <FormGroup>
                                                            <Label for="sortorder"><IntlMessages id="advanceHtmlblock.sortOrder" /></Label>
                                                            <Col>
                                                                <Input
                                                                    type="text"
                                                                    name="sortorder"
                                                                    id="sortorder"
                                                                    value={panles[key].sortorder}
                                                                    onChange={e => this.handlePanleChange(e, key, "sortorder")}
                                                                />
                                                                {errors && errors[key] && errors[key].sortorder && <span className="text-danger text-left"><IntlMessages id={errors[key].sortorder} /></span>}
                                                            </Col>
                                                        </FormGroup>
                                                        <Button
                                                            className="text-white text-bold btn btn bg-danger text-white"
                                                            onClick={() => this.handelPanleRemove(key)}
                                                            style={{ width: "20%" }}
                                                        >
                                                            <IntlMessages id="advanceHtmlblock.remove" />
                                                        </Button>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                    <div style={{ textAlign: "center" }}>
                                        <Button className="mt-10" color="primary" onClick={(e) => this.addNewPanleRow(e)}>Add</Button>
                                    </div>
                                </Fragment> :
                                <Fragment>
                                    <Row>
                                        {
                                            modals.map((lst, key) => {
                                                return (
                                                    <Col md={6} className="mt-20">
                                                        <FormGroup>
                                                            <Label for="modaltype"><IntlMessages id="advanceHtmlblock.modalType" /></Label>
                                                            <Col>
                                                                <Input
                                                                    type="select"
                                                                    name="modaltype"
                                                                    id="modaltype"
                                                                    value={modals[key].modaltype}
                                                                    onChange={e => this.handleModalChange(e, key, "modaltype")}
                                                                >
                                                                    <option value="">Select Modal Type</option>
                                                                    <option value="1">Button</option>
                                                                    <option value="2">Text</option>
                                                                </Input>
                                                                {errors && errors[key] && errors[key].modaltype && <span className="text-danger text-left"><IntlMessages id={errors[key].modaltype} /></span>}
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="modalcaption"><IntlMessages id="advanceHtmlblock.caption" /></Label>
                                                            <Col>
                                                                <Input
                                                                    type="text"
                                                                    name="modalcaption"
                                                                    id="modalcaption"
                                                                    value={modals[key].modalcaption}
                                                                    onChange={e => this.handleModalChange(e, key, "modalcaption")}
                                                                />
                                                                {errors && errors[key] && errors[key].modalcaption && <span className="text-danger text-left"><IntlMessages id={errors[key].modalcaption} /></span>}
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="modaltitle"><IntlMessages id="advanceHtmlblock.modalTitle" /></Label>
                                                            <Col>
                                                                <Input
                                                                    type="text"
                                                                    name="modaltitle"
                                                                    id="modaltitle"
                                                                    value={modals[key].modaltitle}
                                                                    onChange={e => this.handleModalChange(e, key, "modaltitle")}
                                                                />
                                                                {errors && errors[key] && errors[key].modaltitle && <span className="text-danger text-left"><IntlMessages id={errors[key].modaltitle} /></span>}
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="modalcontenttype"><IntlMessages id="advanceHtmlblock.modalContentType" /></Label>
                                                            <Col>
                                                                <Input
                                                                    type="select"
                                                                    name="modalcontenttype"
                                                                    id="modalcontenttype"
                                                                    value={modals[key].modalcontenttype}
                                                                    onChange={e => this.handleModalChange(e, key, "modalcontenttype")}
                                                                >
                                                                    <option value="">Select Content Type</option>
                                                                    <option value="1">HTML Editor</option>
                                                                    <option value="2">Load From URL</option>
                                                                </Input>
                                                                {errors && errors[key] && errors[key].modalcontenttype && <span className="text-danger text-left"><IntlMessages id={errors[key].modalcontenttype} /></span>}
                                                            </Col>
                                                        </FormGroup>
                                                        {
                                                            modals[key].modalcontenttype.toString() === "1" ?
                                                                <FormGroup>
                                                                    <Label for="modalcontent"><IntlMessages id="advanceHtmlblock.modalContent" /></Label>
                                                                    <Col>
                                                                        <ReactQuill
                                                                            value={modals[key].modalcontent}
                                                                            onChange={e => this.handleModalChange(e, key, "modalcontent", true)}
                                                                        />
                                                                        {errors && errors[key] && errors[key].modalcontent && <span className="text-danger text-left"><IntlMessages id={errors[key].modalcontent} /></span>}
                                                                    </Col>
                                                                </FormGroup> :
                                                                <FormGroup>
                                                                    <Label for="modalcontent"><IntlMessages id="advanceHtmlblock.modalContent" /></Label>
                                                                    <Col>
                                                                        <Input
                                                                            type="text"
                                                                            name="modalcontent"
                                                                            id="modalcontent"
                                                                            value={modals[key].modalcontent}
                                                                            onChange={e => this.handleModalChange(e, key, "modalcontent", false)}
                                                                        />
                                                                        {errors && errors[key] && errors[key].modalcontent && <span className="text-danger text-left"><IntlMessages id={errors[key].modalcontent} /></span>}
                                                                    </Col>
                                                                </FormGroup>
                                                        }
                                                        <FormGroup>
                                                            <Label for="sortorder"><IntlMessages id="advanceHtmlblock.sortOrder" /></Label>
                                                            <Col>
                                                                <Input
                                                                    type="text"
                                                                    name="sortorder"
                                                                    id="sortorder"
                                                                    value={modals[key].sortorder}
                                                                    onChange={e => this.handleModalChange(e, key, "sortorder")}
                                                                />
                                                                {errors && errors[key] && errors[key].sortorder && <span className="text-danger text-left"><IntlMessages id={errors[key].sortorder} /></span>}
                                                            </Col>
                                                        </FormGroup>
                                                        <Button
                                                            className="text-white text-bold btn btn bg-danger text-white"
                                                            onClick={() => this.handelModalRemove(key)}
                                                            style={{ width: "20%" }}
                                                        >
                                                            <IntlMessages id="advanceHtmlblock.remove" />
                                                        </Button>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                    <div style={{ textAlign: "center" }}>
                                        <Button className="mt-10" color="primary" onClick={(e) => this.addNewModalRow(e)}>Add</Button>
                                    </div>
                                </Fragment>
                    }
                </JbsCollapsibleCard>
                <FormGroup row>
                    <Row style={{ textAlign: "center", margin: "0 auto" }}>
                        <Button
                            className="text-white mr-10 text-bold btn"
                            color="primary"
                            onClick={(e) => { this.onEditBlock(e) }}
                            disabled={loading}
                        >
                            <IntlMessages id="button.update" />
                        </Button>
                        <Button
                            className="text-white text-bold btn btn bg-danger text-white"
                            onClick={this.resetData}
                        >
                            <IntlMessages id="button.cancel" />
                        </Button>
                    </Row>
                </FormGroup>
            </div>
        )
    }
}


const mapDispatchToProps = ({ AdvanceHTMLBlocksReducer }) => {
    const { edit_advance_htmlblock, loading } = AdvanceHTMLBlocksReducer;
    return { edit_advance_htmlblock, loading };
};

export default connect(
    mapDispatchToProps,
    {
        editAdvanceHTMLBlock,
        getAdvanceHTMLBlocksList
    }
)(edit);
