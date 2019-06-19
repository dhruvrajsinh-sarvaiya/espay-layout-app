/**
 * Create BY Sanjay
 * Created Date 29-05-2019
 * Component For Image Slider CRUD 
 */

import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import { Badge } from "reactstrap";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import { DashboardPageTitle } from '../DashboardPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { getImageSliders } from "Actions/ImageSliders";
import AddImageSlider from './add';
import EditImageSlider from './edit';

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
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.ImageSliders" />,
        link: '',
        index: 1
    }
];

//Table Object...
const columns = [
    {
        name: <IntlMessages id="sidebar.colId" />,
        options: { sort: true, filter: false }
    },
    {
        name: <IntlMessages id="imageSlider.table.label.SliderName" />,
        options: { sort: true, filter: false }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { sort: true, filter: false }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: { sort: false, filter: false }
    }
];

class index extends Component {

    state = {
        ImageSliderList: [],
        open: false,
        addData: false,
        editData: false,
        componentName: '',
        editDetails: ""
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            editData: false,
            componentName: ''
        });
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false
            })
        }

        if (typeof nextProps.imagesliders_list.data !== 'undefined' && nextProps.imagesliders_list.responseCode === 0) {
            this.setState({
                ImageSliderList: nextProps.imagesliders_list.data
            });
        } else if (nextProps.imagesliders_list.responseCode === 9) {
            this.setState({
                ImageSliderList: []
            });
        }
    }

    componentWillMount() {
        this.props.getImageSliders();
    }

    // open drawer and set data for add new request
    onAddData = () => {

        this.setState({
            addData: true,
            editData: false
        })

    }

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
    }

    // open drawer and set data for Edit new request
    onEditData = (selectedData) => {

        this.setState({
            editData: true,
            editDetails: selectedData,
            addData: false
        })

    }

    // toogle drawer 
    toggleDrawer = () => {
        this.setState({
            open: false,
            componentName: '',
            addData: false,
            editData: false,
        })
    }

    render() {
        const { ImageSliderList, addData, editData, editDetails } = this.state;
        const { drawerClose, loading } = this.props;
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            resizableColumns: false,
            viewColumns: false,
            filter: false,
            rowsPerPageOptions: [10, 25, 50, 100],
            customToolbar: () => {
                return <Button
                    variant="raised"
                    onClick={(e) => {
                        this.onAddData();
                        this.showComponent('AddImageSlider')
                    }
                    }
                    className="btn-primary text-white"
                >
                    <IntlMessages id="button.add" />
                </Button>
            }
        };
        return (
            <Fragment>
                <div className="jbs-page-content">
                    <DashboardPageTitle title={<IntlMessages id="sidebar.ImageSliders" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <JbsCollapsibleCard fullBlock>
                        <div className="StackingHistory">
                            <MUIDataTable
                                data={
                                    ImageSliderList &&
                                    ImageSliderList.map(lst => {
                                        return [
                                            lst.sliderid,
                                            lst.slidername,
                                            lst.status === 1 ? (
                                                <Badge color="primary">
                                                    <IntlMessages id="global.form.status.active" />
                                                </Badge>
                                            ) : (
                                                    <Badge color="danger">
                                                        <IntlMessages id="global.form.status.inactive" />
                                                    </Badge>
                                                ),
                                            <div className="list-action">
                                                <a
                                                    href="javascript:void(0)"
                                                    color="primary"
                                                    onClick={(e) => {
                                                        this.onEditData(lst)
                                                        this.showComponent('EditImageSlider')
                                                    }
                                                    }
                                                >
                                                    <i className="ti-pencil" />
                                                </a>
                                            </div>
                                        ];
                                    })
                                }
                                columns={columns}
                                options={options}
                            />
                            {loading && <JbsSectionLoader />}
                        </div>
                    </JbsCollapsibleCard>
                </div>
                <Drawer
                    style={{ zIndex: '5' }}
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer2 half_drawer"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {addData &&
                        <AddImageSlider {...this.props}
                            drawerClose={this.toggleDrawer}
                            closeAll={this.closeAll} />
                    }

                    {editData && editDetails &&
                        <EditImageSlider {...this.props}
                            selectedData={editDetails}
                            drawerClose={this.toggleDrawer}
                            closeAll={this.closeAll}
                        />
                    }
                </Drawer>
            </Fragment>
        )
    }
}

const mapStateToProps = ({ ImageSlidersReducer, drawerclose }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { imagesliders_list, loading } = ImageSlidersReducer;
    return { imagesliders_list, loading, drawerclose };
};

export default connect(
    mapStateToProps,
    {
        getImageSliders
    }
)(index);