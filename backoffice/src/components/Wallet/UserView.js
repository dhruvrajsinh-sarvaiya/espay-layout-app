/* 
    Developer : Nishant Vadgama
    Date : 13-12-2018
    File Comment : User specific view page
*/
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import ChartConfig from 'Constants/chart-config';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { JbsCard } from 'Components/JbsCard';
import { hexToRgbA } from 'Helpers/helpers';
import { Form, FormGroup, Label, Input } from "reactstrap";
import {
    MultiLineChart
} from './DashboardWidgets';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}
export default class UserView extends Component {
    state = {
        userinfo: {
            firstname: "Nishant",
            lastname: "Vadgama",
            email: "email@example.com",
            mobile: "9898989898",
            organization: "Joshi Biztech",
            createddate: "15-12-2018"
        },
        openChild: false,
        editMode: false,
    }
    onChildClick = () => {
        this.setState({
            openChild: !this.state.openChild,
        })
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            openChild: false,
        });
    }
    render() {
        const { drawerClose } = this.props;
        const ChargesTypesData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Wallet Balance',
                    fill: true,
                    lineTension: 0.3,
                    fillOpacity: 0.3,
                    backgroundColor: hexToRgbA(ChartConfig.color.info, 0.1),
                    borderColor: hexToRgbA(ChartConfig.color.info, 3),
                    borderWidth: 3,
                    pointBackgroundColor: hexToRgbA(ChartConfig.color.info, 3),
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    pointBorderColor: ChartConfig.color.info,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 2,
                    data: [2500, 900, 400, 1100, 1250, 900, 2100, 3400, 1950, 2000, 700, 740]
                }
            ],
            customLegends: [
                {
                    name: 'Wallet Balance',
                    className: 'badge-info'
                },
            ]
        }
        const { userinfo } = this.state;
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="sidebar.userProfile" /></h2>
                    </div>
                    <div className="page-title-wrap">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                <JbsCard customClasses="profile-head">
                    <div className="profile-top">
                        <img src={require('Assets/img/profile-banner.jpg')} alt="profile banner" width="1920" height="200" />
                    </div>
                    <div className="profile-bottom border-bottom">
                        <div className="user-image text-center mb-30">
                            <img
                                src={require('Assets/avatars/user-11.jpg')}
                                className="img-fluid rounded-circle jbs-notify mx-auto"
                                alt="user images"
                                width="110"
                                height="110"
                            />
                        </div>
                        <div className="user-list-content">
                            {this.state.editMode ?
                                <div className="text-center mb-20">
                                    <Input type="text" placeholder="First Name" bsSize="sm" value={userinfo.firstname} className="col-sm-2 offset-5 mb-10" />
                                    <Input type="text" placeholder="Last Name" bsSize="sm" value={userinfo.lastname} className="col-sm-2 offset-5 mb-10" />
                                    <Input type="text" placeholder="Mobile" bsSize="sm" value={userinfo.mobile} className="col-sm-2 offset-5 mb-10" />
                                    <Input type="text" placeholder="Email" bsSize="sm" value={userinfo.email} className="col-sm-2 offset-5 mb-10" />
                                    <Button variant="raised" color="primary" size="small" onClick={(e) => (this.setState({ editMode: false }))} >
                                        <IntlMessages id="button.save" />
                                    </Button>
                                </div>
                                :
                                <div className="text-center">
                                    <h3 className="fw-bold">
                                        {userinfo.firstname + " " + userinfo.lastname} &nbsp;&nbsp;
                                        <a href="javascript:void(0)" onClick={(e) => (this.setState({ editMode: true }))}><i className="ti-pencil"></i></a>
                                    </h3>
                                    <p>{userinfo.mobile}</p>
                                    <p>{userinfo.email}</p>
                                    <p>{userinfo.organization}</p>
                                    <p>{userinfo.createddate}</p>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="user-activity text-center">
                        <ul className="list-inline d-inline-block">
                            <li className="list-inline-item">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => { // console.log('clicked') }}
                                >
                                    <span className="fw-bold">588</span>
                                    <span>Wallet Balance</span>
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => { // console.log('clicked') }}
                                >
                                    <span className="fw-bold">24</span>
                                    <span>Policy</span>
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => { // console.log('clicked') }}
                                >
                                    <span className="fw-bold">12</span>
                                    <span>Transaction Types</span>
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => { // console.log('clicked') }}
                                >
                                    <span className="fw-bold">54</span>
                                    <span>Wallets</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </JbsCard>
                <div className="row mb-20">
                    <JbsCollapsibleCard
                        colClasses="col-sm-12 w-12-full"
                    >
                        < MultiLineChart
                            data={ChargesTypesData}
                        />
                    </JbsCollapsibleCard>
                </div>
                {/* <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.openChild}
                    onMaskClick={this.onChildClick}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    <OrganizationView {...this.props} drawerClose={this.onChildClick} closeAll={this.closeAll}/>
                </Drawer> */}
            </div>
        )
    }
}