/**
 * Create By Sanjay 
 * Created Date 30-05-2019
 * Component For Add Image Slider
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { Col, FormGroup, Input, Label, Button, Row } from "reactstrap";
import { NotificationManager } from "react-notifications"; 
import Switch from '@material-ui/core/Switch';
import validator from 'validator';

import { getImageSliders, addImageSliders } from 'Actions/ImageSliders';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
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
        title: <IntlMessages id="imageSlider.title.add-imageSlider" />,
        link: '',
        index: 0
    }
];


class add extends Component {

    state = {
        slidername: "",
        status: 0,
        imageslist: [
            {
                image: "",
                imagepreviewurl: "",
                imagelink: "",
                sortorder: ""
            }
        ],
        checked: false,
        errors: {}
    }

    componentWillReceiveProps(nextProps) {        
        if (nextProps.add_image_slider.responseCode === 0) {
            NotificationManager.success(<IntlMessages id="imageSlider.addImageSliderSuccess" />);
            this.props.getImageSliders();
            this.resetData();
        } else if (nextProps.add_image_slider.responseCode === 1 || nextProps.add_image_slider.responseCode === 9) {
            var errMsg = <IntlMessages id="htmlBlock.addHTMLBlockFail" />;
            NotificationManager.error(errMsg);
        }
    }

    resetData = () => {
        this.setState({
            slidername: "",
            status: 0,
            imageslist: [
                {
                    image: "",
                    imagepreviewurl: "",
                    imagelink: "",
                    sortorder: ""
                }
            ],
            checked: false,
            errors: {}
        })
        this.props.drawerClose();
    }

    closeAll = () => {
        this.setState({
            slidername: "",
            status: 0,
            imageslist: [
                {
                    image: "",
                    imagepreviewurl: "",
                    imagelink: "",
                    sortorder: ""
                }
            ],
            checked: false,
            errors: {}
        })
        this.props.closeAll();
    }

    addNewRow = () => {
        let newObj = {
            image: "",
            imagepreviewurl: "",
            imagelink: "",
            sortorder: ""
        };
        this.setState({ imageslist: this.state.imageslist.concat(newObj) });
    }

    // handle change
    handleChange(e, index, key) {
        if (key === 'sortorder') {
            if (validator.isNumeric(e.target.value, { no_symbols: true }) || e.target.value === "") {
                let tmpObject = Object.assign([], this.state.imageslist);
                tmpObject[index][key] = e.target.value;
                this.setState({ imageslist: tmpObject });
            }
        } else if (key === 'imagelink') {
            let tmpObject = Object.assign([], this.state.imageslist);
            tmpObject[index][key] = e.target.value;
            this.setState({ imageslist: tmpObject });
        }
    }

    handelRemove(index) {
        if (this.state.imageslist.length > 1) {
            this.state.imageslist.splice(index, 1)
            this.setState({ imageslist: this.state.imageslist })
        }
    }

    handleSliderNameChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

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

    handleselectedFile(e, index, key) {
        let statusCopy = Object.assign({}, this.state);
        statusCopy.imageslist[index][key] = e.target.files[0];
        this.setState(statusCopy);
        let reader = new FileReader();
        reader.onloadend = () => {
            statusCopy.imageslist[index]["imagepreviewurl"] = reader.result;
            this.setState({ statusCopy });
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    onAddImageSlider = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateImageSliderFormInput(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const data = {
                slidername: this.state.slidername,
                status: this.state.status,
                imageslist: this.state.imageslist
            }
            this.props.addImageSliders(data);
        }
    }

    render() {
        const { loading } = this.props;
        const { slidername, errors } = this.state;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="imageSlider.title.add-imageSlider" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
                        this.state.imageslist.map((lst, key) => {
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
                                            src={this.state.imageslist[key].imagepreviewurl ? this.state.imageslist[key].imagepreviewurl : "http://placehold.it/180"}
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
                                            value={this.state.imageslist[key].imagelink}
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
                                            value={this.state.imageslist[key].sortorder}
                                            onChange={e => this.handleChange(e, key, "sortorder")}
                                        />
                                        {errors.sortorder && <span className="text-danger text-left"><IntlMessages id={errors.sortorder} /></span>}
                                    </Row>
                                    <Row>
                                        <Button
                                            className="text-white text-bold btn btn bg-danger text-white"
                                            onClick={() => this.handelRemove(key)}
                                        >
                                            Remove
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
                            onClick={(e) => { this.onAddImageSlider(e) }}
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
                </FormGroup>
            </div>
        )
    }
}

const mapDispatchToProps = ({ ImageSlidersReducer }) => {
    const { add_image_slider, loading } = ImageSlidersReducer;
    return { add_image_slider, loading };
};

export default connect(
    mapDispatchToProps,
    {
        addImageSliders,
        getImageSliders
    }
)(add);
