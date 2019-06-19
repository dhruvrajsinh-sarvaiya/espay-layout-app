/**
 * Create By Sanjay 
 * Created Date 04-06-2019
 * Component For Advance HTML  Blocks List 
 */

import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import { Badge } from "reactstrap";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import { DashboardPageTitle } from '../DashboardPageTitle';//For Page Title And Back&Home Button UI
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";//for loader while api calling 
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { getAdvanceHTMLBlocksList } from "Actions/AdvanceHTMLBlocks";//for call Actions from Component
import AddAdvanceHTMLBlock from './add';//Add Component Import
import EditAdvanceHTMLBlock from './edit';//Edit Component Import 

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
        title: <IntlMessages id="sidebar.AdvanceHTMLBlocks" />,
        link: '',
        index: 1
    }
];


//Table Header Object...
const columns = [
    {
        name: <IntlMessages id="sidebar.colId" />,
        options: { sort: true, filter: false }
    },
    {
        name: <IntlMessages id="htmlBlocks.table.label.blockName" />,
        options: { sort: true, filter: false }
    },
    {
        name: <IntlMessages id="htmlBlocks.table.label.blockType" />,
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
        AdvanceHTMLBlocksList: [],
        open: false,
        componentName: '',
        addData: false,
        editData: false,
        editDetails: ""
    }

    //Call this function when click on Home Button 
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            componentName: '',
            addData: false,
            editData: false,
        });
    }

    componentWillMount() {
        this.props.getAdvanceHTMLBlocksList();//when Component mount Call List API
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }

        //Get List API Responce And Set In State 
        if (typeof nextProps.advance_htmlblocks_list.data !== 'undefined' && nextProps.advance_htmlblocks_list.responseCode === 0) {
            this.setState({
                AdvanceHTMLBlocksList: nextProps.advance_htmlblocks_list.data
            });
        } else if (nextProps.advance_htmlblocks_list.responseCode === 9) {
            this.setState({
                AdvanceHTMLBlocksList: []
            });
        }

    }

    // open drawer for add new request
    onAddData = () => {

        this.setState({
            addData: true,
            editData: false
        })

    }

    // open drawer and set data for Edit new request
    onEditData = (selectedData) => {

        this.setState({
            editData: true,
            editDetails: selectedData,
            addData: false
        })

    }

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
    }

    // toogle drawer 
    toggleDrawer = () => {
        this.setState({
            open: false,
            componentName: '',
            addData: false,
            editData: false
        })
    }

    render() {
        const { AdvanceHTMLBlocksList, addData, editData, editDetails } = this.state;
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
            //Add Button In Table
            customToolbar: () => {
                return <Button
                    variant="raised"
                    onClick={(e) => {
                        this.onAddData();
                        this.showComponent('AddAdvanceHTMLBlock')
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
                    <DashboardPageTitle title={<IntlMessages id="sidebar.AdvanceHTMLBlocks" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <JbsCollapsibleCard fullBlock>
                        <div className="StackingHistory">
                            <MUIDataTable
                                data={
                                    AdvanceHTMLBlocksList &&
                                    AdvanceHTMLBlocksList.map(lst => {
                                        return [
                                            lst.advancehtmlblockid,
                                            lst.name,
                                            lst.type === 1 ? "Tab" : lst.type === 2 ? "Panle" : "Modal",
                                            lst.status === 1 ? (
                                                <Badge color="primary">
                                                    <IntlMessages id="global.form.status.active" />
                                                </Badge>
                                            ) : (
                                                    <Badge color="danger">
                                                        <IntlMessages id="global.form.status.inactive" />
                                                    </Badge>
                                                ),
                                            //Edit Button Icon In Table 
                                            <div className="list-action">
                                                <a
                                                    href="javascript:void(0)"
                                                    color="primary"
                                                    onClick={(e) => {
                                                        this.onEditData(lst)
                                                        this.showComponent('EditAdvanceHTMLBlock')
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
                        <AddAdvanceHTMLBlock {...this.props}
                            drawerClose={this.toggleDrawer}
                            closeAll={this.closeAll} />
                    }

                    {editData && editDetails &&
                        <EditAdvanceHTMLBlock {...this.props}
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

//use Reducer State as a Props
const mapStateToProps = ({ AdvanceHTMLBlocksReducer, drawerclose }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { advance_htmlblocks_list, loading } = AdvanceHTMLBlocksReducer;
    return { advance_htmlblocks_list, loading, drawerclose };
};

export default connect(
    mapStateToProps,
    {
        getAdvanceHTMLBlocksList
    }
)(index);