/**
 * Create By Sanjay 
 * Created Date 30-05-2019
 * Component For Edit Slider Component 
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, FormGroup, Input, Label, Button, Row } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { NotificationManager } from "react-notifications";
import Switch from '@material-ui/core/Switch';
import validator from 'validator';

import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import { getImageSliders, editImageSliders } from 'Actions/ImageSliders';
import { DashboardPageTitle } from '../DashboardPageTitle';
const validateImageSliderFormInput = require('../../../validation/ImageSlider/imageslider');

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
        title: <IntlMessages id="sidebar.ImageSliders" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="imageSlider.title.edit-imageSlider" />,
        link: '',
        index: 0
    }
];

class edit extends Component {

    state = {
        editImageSliderDetails: {},
        errors: {},
        checked: true,
        open: false,
        flag: true
    }

    componentWillMount() {
        this.setState({ editImageSliderDetails: this.props.selectedData })
        if (this.props.selectedData.status === 1) {
            this.setState({ checked: true })
        } else if (this.props.selectedData.status === 0) {
            this.setState({ checked: false })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.edit_image_slider.responseCode === 0 && this.state.flag) {
            NotificationManager.success(<IntlMessages id="htmlBlock.updateHTMLBlockSuccess" />);
            this.props.getImageSliders();
            this.resetData();
            this.setState({
                flag: false
            })
        } else if (nextProps.edit_image_slider.responseCode === 1 || nextProps.edit_image_slider.responseCode === 9) {
            const errMsg = <IntlMessages id="htmlBlock.addHTMLBlockFail" />;
            NotificationManager.error(errMsg);
        }
    }

    resetData = () => {
        this.setState({
            // editImageSliderDetails: {},
            errors: {},
            checked: true,
            flag: true
        });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.setState({
            editImageSliderDetails: {},
            errors: {},
            checked: true
        });
        this.props.closeAll();
    }

    addNewRow = () => {
        let newObj = {
            image: "",
            imagepreviewurl: "",
            imagelink: "",
            sortorder: ""
        };
        this.setState({
            editImageSliderDetails: {
                ...this.state.editImageSliderDetails,
                imageslist: this.state.editImageSliderDetails.imageslist.concat(newObj)
            }
        });
    }

    handleselectedFile(e, index, key) {
        let statusCopy = Object.assign({}, this.state.editImageSliderDetails);
        statusCopy.imageslist[index][key] = e.target.files[0];
        this.setState(statusCopy);
        let reader = new FileReader();
        reader.onloadend = () => {
            statusCopy.imageslist[index]["imagepreviewurl"] = reader.result;
            this.setState({ statusCopy });
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    onEditImageSlider = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateImageSliderFormInput(this.state.editImageSliderDetails);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.editImageSliders(this.state.editImageSliderDetails);
        }
    }

    handleChangeSwitch = name => event => {
        this.setState({ [name]: event.target.checked });
        let tempObj = Object.assign({}, this.state.editImageSliderDetails);
        if (this.state.checked === false) {
            tempObj["status"] = 1;
            this.setState({
                editImageSliderDetails: tempObj
            })
        }
        else {
            tempObj["status"] = 0;
            this.setState({
                editImageSliderDetails: tempObj
            })
        }
    };

    // handle change
    handleChange(e, index, key) {
        if (key === 'sortorder') {
            if (validator.isNumeric(e.target.value, { no_symbols: true }) || e.target.value === "") {
                let tmpObject = Object.assign([], this.state.editImageSliderDetails.imageslist);
                tmpObject[index][key] = e.target.value;
                this.setState({
                    editImageSliderDetails: {
                        ...this.state.editImageSliderDetails,
                        imageslist: tmpObject
                    }
                });
            }
        } else if (key === 'imagelink') {
            let tmpObject = Object.assign([], this.state.editImageSliderDetails.imageslist);
            tmpObject[index][key] = e.target.value;
            this.setState({
                editImageSliderDetails: {
                    ...this.state.editImageSliderDetails,
                    imageslist: tmpObject
                }
            });
        }
    }

    handelRemove(index) {
        if (this.state.editImageSliderDetails.imageslist.length > 1) {
            this.state.editImageSliderDetails.imageslist.splice(index, 1)
            this.setState({
                editImageSliderDetails: {
                    ...this.state.editImageSliderDetails,
                    imageslist: this.state.editImageSliderDetails.imageslist
                }
            })
        }
    }

    handleSliderNameChange = (e) => {
        let tempObj = Object.assign({}, this.state.editImageSliderDetails);
        tempObj[e.target.name] = e.target.value
        this.setState({ editImageSliderDetails: tempObj })
    }

    render() {
        const { loading } = this.props;
        const { slidername } = this.state.editImageSliderDetails;
        const { errors } = this.state;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="imageSlider.title.edit-imageSlider" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
                {loading && <JbsSectionLoader />}
                <FormGroup>
                    <Label for="slidername">
                        <IntlMessages id="imageSlider.table.label.SliderName" />
                    </Label>
                    <Col md={5}>
                        <Input
                            type="text"
                            name="slidername"
                            id="slidername"
                            maxLength="50"
                            value={slidername}
                            onChange={this.handleSliderNameChange}
                        />
                    </Col>
                    {errors.slidername && <span className="text-danger text-left"><IntlMessages id={errors.slidername} /></span>}
                </FormGroup>
                <FormGroup>
                    <Label for="status">
                        <IntlMessages id="htmlblock.status" />
                    </Label>
                    <Col>
                        <Switch
                            checked={this.state.checked}
                            onChange={this.handleChangeSwitch('checked')}
                            value="checked"
                            color="primary"
                        />
                    </Col>
                </FormGroup>
                <JbsCollapsibleCard>
                    {
                        this.state.editImageSliderDetails.imageslist.map((lst, key) => {
                            return (
                                <Row key={key} className="ml-10 mt-20">
                                    <Row>
                                        <Label for="image">
                                            <IntlMessages id="imageSlider.image" />
                                        </Label>
                                        <Input
                                            type="file"
                                            onChange={e => this.handleselectedFile(e, key, "image")}
                                        />
                                        {errors.image && <span className="text-danger text-left"><IntlMessages id={errors.image} /></span>}
                                    </Row>
                                    <Row className="mr-50">
                                        <img
                                            id="imagepreviewurl"
                                            src={this.state.editImageSliderDetails.imageslist[key].imagepreviewurl ? this.state.editImageSliderDetails.imageslist[key].imagepreviewurl : "http://placehold.it/180"}
                                            alt="Logo"
                                            height="100"
                                            width="100"
                                        />
                                    </Row>
                                    <Row>
                                        <Label for="imagelink">
                                            <IntlMessages id="imageSlider.imageLink" />
                                        </Label>
                                        <Input
                                            type="text"
                                            name="imagelink"
                                            value={this.state.editImageSliderDetails.imageslist[key].imagelink}
                                            onChange={e => this.handleChange(e, key, "imagelink")}
                                        />
                                        {errors.imagelink && <span className="text-danger text-left"><IntlMessages id={errors.imagelink} /></span>}
                                    </Row>
                                    <Row className="ml-20 mr-50">
                                        <Label for="sortorder">
                                            <IntlMessages id="imageSlider.sortOrder" />
                                        </Label>
                                        <Input
                                            type="text"
                                            name="sortorder"
                                            value={this.state.editImageSliderDetails.imageslist[key].sortorder}
                                            onChange={e => this.handleChange(e, key, "sortorder")}
                                        />
                                        {errors.sortorder && <span className="text-danger text-left"><IntlMessages id={errors.sortorder} /></span>}
                                    </Row>
                                    <Row>
                                        <Button
                                            className="text-white text-bold btn btn bg-danger text-white"
                                            onClick={() => this.handelRemove(key)}
                                        >
                                            <IntlMessages id="button.delete" />
                                        </Button>
                                    </Row>
                                </Row>
                            )
                        })
                    }
                    <Button className="mt-10" color="primary" onClick={(e) => this.addNewRow(e)}>Add</Button>
                </JbsCollapsibleCard>
                <FormGroup row>
                    <Row style={{ textAlign: "center", margin: "0 auto" }}>
                        <Button
                            className="text-white mr-10 text-bold btn"
                            color="primary"
                            onClick={(e) => { this.onEditImageSlider(e) }}
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

const mapDispatchToProps = ({ ImageSlidersReducer }) => {
    const { edit_image_slider, loading } = ImageSlidersReducer;
    return { edit_image_slider, loading };
};

export default connect(
    mapDispatchToProps,
    {
        editImageSliders,
        getImageSliders
    }
)(edit);