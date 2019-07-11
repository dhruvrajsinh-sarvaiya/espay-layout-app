/**
 * Create By San/jay 
 * Created Date 18/03/2019
 * Components For API Plan Configuration
 */

import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import { Card, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
// import for drawer
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import AppConfig from "Constants/AppConfig";
import PublicApiStatisticsCard from './PublicApiStatisticsCard';
import PlanUsersLinearGraph from './PlanUsersLinearGraph';
import PlanPurchasedGraph from './PlanPurchasedGraph';
import ListRecentHTTPErrors from './ListRecentHTTPErrors';
import HTTPStatusCodeCountBarChart from './HTTPStatusCodeCountBarChart';
import APIAccessPieChart from './APIAccessPieChart';
import HitByBrowserPieChart from './HitByBrowserPieChart';
import ListMostActiveIpAddess from './ListMostActiveIpAddess';
import ListFrequentlyUseAPI from './ListFrequentlyUseAPI';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { getAPIPlanRequestCount, listFrequentUse, listMostActiveIpAddress } from 'Actions/APIPlanConfiguration';
import { NotificationManager } from "react-notifications";
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

class APIPlanConfiguration extends Component {
    state = {
        APIUsers: "",
        Browser: [],
        ErrorCodeList: [],
        FaliureCount: "",
        PlanUsers: [],
        PurchasePlan: [],
        RegisterToday: "",
        StatusCode: [],
        SuccessCount: "",
        FrequentUse: [],
        MostActiveIpAddress: [],
        open: false,
        openData: false,
        openFrequent: false,
        openMostActiveIP: false,
        menudetail: []
    }
    componentWillMount() {
        this.setState({ menudetail: this.props.menudetail });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.APIPlanRequestData !== undefined && nextProps.APIPlanRequestData.ReturnCode === 0) {
            this.setState({
                APIUsers: nextProps.APIPlanRequestData.APIUsers,
                Browser: nextProps.APIPlanRequestData.Browser,
                ErrorCodeList: nextProps.APIPlanRequestData.ErrorCodeList,
                FaliureCount: nextProps.APIPlanRequestData.FaliureCount,
                PlanUsers: nextProps.APIPlanRequestData.PlanUsers,
                PurchasePlan: nextProps.APIPlanRequestData.PurchasePlan,
                RegisterToday: nextProps.APIPlanRequestData.RegisterToday,
                StatusCode: nextProps.APIPlanRequestData.StatusCode,
                SuccessCount: nextProps.APIPlanRequestData.SuccessCount
            })

            if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
                this.setState({
                    open: false,
                    openData: false,
                    componentName: '',
                    openMostActiveIP: false,
                    openFrequent: false
                })
            }
        }
        if (nextProps.FrequentUseData !== undefined && nextProps.FrequentUseData.ReturnCode === 0) {
            this.setState({
                FrequentUse: nextProps.FrequentUseData.Response
            })
        }
        if (nextProps.MostActiveIpAddressData !== undefined && nextProps.MostActiveIpAddressData.ReturnCode === 0) {
            this.setState({
                MostActiveIpAddress: nextProps.MostActiveIpAddressData.Response
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getAPIPlanRequestCount();
                this.props.listFrequentUse();
                this.props.listMostActiveIpAddress();
                this.setState({ menudetail: nextProps.menudetail });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }
    }

    OpenHttpErrors = (e) => {
        this.setState({
            openData: true,
            openFrequent: false,
            open: true,
            openMostActiveIP: false
        })
    }

    OpenFrequentAPI = (e) => {
        this.setState({
            openFrequent: true,
            openData: false,
            open: true,
            openMostActiveIP: false
        });
    };
    OpenMostActiveAddress = (e) => {
        this.setState({
            openMostActiveIP: true,
            open: true,
            openData: false
        })
    }

    // toggkle drawer
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: '',
            openData: false,
            openFrequent: false,
            openMostActiveIP: false
        })
    }

    //close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            openData: false,
            openFrequent: false,
            componentName: '',
            openMostActiveIP: false
        });
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = false;
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                    response = menudetail[index];
            }
        }
        return response;
    }
    render() {
        const { APIUsers, Browser, ErrorCodeList, FaliureCount, PlanUsers, PurchasePlan, RegisterToday, StatusCode, SuccessCount, FrequentUse, MostActiveIpAddress } = this.state;
        const { loading } = this.props;
        return (
            <div>
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}

                {(this.checkAndGetMenuAccessDetail('0349ED47-491D-49CC-3551-8CE00FEE52BE') || this.checkAndGetMenuAccessDetail('DAB36AEB-05E5-0326-5A95-AC2D02772227') || this.checkAndGetMenuAccessDetail('BE67BD06-073B-A226-3D30-AEFF55690C2C')) && // 0349ED47-491D-49CC-3551-8CE00FEE52BE,DAB36AEB-05E5-0326-5A95-AC2D02772227,BE67BD06-073B-A226-3D30-AEFF55690C2C
                    <PublicApiStatisticsCard APIUsers={APIUsers} FaliureCount={FaliureCount} SuccessCount={SuccessCount} RegisterToday={RegisterToday} menudetail={this.state.menudetail} />
                }
                <Row className="plan-user-purchased">
                    {this.checkAndGetMenuAccessDetail('83FA1CC3-0653-4D61-9B33-3EBD789C8006') && // 83FA1CC3-0653-4D61-9B33-3EBD789C8006 
                        <Col md="6" sm="12" className="pln_user">
                            <Card>
                                <PlanUsersLinearGraph PlanUsers={PlanUsers} />
                            </Card>
                        </Col>
                    }

                    {this.checkAndGetMenuAccessDetail('E5E159DF-187B-1313-2A27-436D18331EA9') && // E5E159DF-187B-1313-2A27-436D18331EA9
                        <Col md="6" sm="12" className="pln_prchase">
                            <PlanPurchasedGraph PurchasePlan={PurchasePlan} />
                        </Col>
                    }
                </Row>

                {this.state.openData == false && this.state.openMostActiveIP == false && this.checkAndGetMenuAccessDetail('361C6E9F-816B-673D-5A8D-D980617369F3') && // 361C6E9F-816B-673D-5A8D-D980617369F3
                    <ListRecentHTTPErrors openData={(this.state.openData && this.state.openMostActiveIP == false) ? true : false} ErrorCodeList={ErrorCodeList} OpenHttpErrors={this.OpenHttpErrors} />
                }

                {this.checkAndGetMenuAccessDetail('511450D4-389E-2E25-61F2-2720CCA73C4B') && // 511450D4-389E-2E25-61F2-2720CCA73C4B
                    <HTTPStatusCodeCountBarChart StatusCode={StatusCode} />
                }

                <Row>
                    {this.checkAndGetMenuAccessDetail('2261B246-3587-92C7-4B75-BC72D70649CB') && // 2261B246-3587-92C7-4B75-BC72D70649CB
                        <Col md="6" sm="12">
                            <APIAccessPieChart />
                        </Col>
                    }

                    {this.checkAndGetMenuAccessDetail('BE19E908-9170-7B7C-924B-9476E2EF30E1') && // BE19E908-9170-7B7C-924B-9476E2EF30E1
                        <Col md="6" sm="12">
                            <HitByBrowserPieChart Browser={Browser} />
                        </Col>
                    }
                </Row>

                {this.state.openData == false && this.state.openMostActiveIP == false && this.checkAndGetMenuAccessDetail('E4383BC6-6B2B-7DBB-A77E-47D19D189441') && // E4383BC6-6B2B-7DBB-A77E-47D19D189441          
                    <ListMostActiveIpAddess openData={(this.state.openData == false && this.state.openMostActiveIP) ? true : false} MostActiveIpAddress={MostActiveIpAddress} OpenMostActiveAddress={this.OpenMostActiveAddress} />
                }

                {this.state.openFrequent === false && this.checkAndGetMenuAccessDetail(
                    "BF6C5F9C-A530-0D6D-7EC8-D78231F33DDA"
                ) && ( // BF6C5F9C-A530-0D6D-7EC8-D78231F33DDA
                        <ListFrequentlyUseAPI
                            FrequentUse={FrequentUse}
                            openFrequent={this.state.openFrequent ? true : false}
                            OpenFrequentAPI={this.OpenFrequentAPI}
                        />
                    )}

                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {(this.state.openData && this.checkAndGetMenuAccessDetail('361C6E9F-816B-673D-5A8D-D980617369F3')) && //361C6E9F-816B-673D-5A8D-D980617369F3
                        <ListRecentHTTPErrors {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} menudetail={this.state.menudetail} />
                    }
                    {(this.state.openData === false && this.state.openMostActiveIP && this.checkAndGetMenuAccessDetail('E4383BC6-6B2B-7DBB-A77E-47D19D189441')) && //E4383BC6-6B2B-7DBB-A77E-47D19D189441
                        <ListMostActiveIpAddess {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} menudetail={this.state.menudetail} />
                    }

                    {this.state.openFrequent &&
                        this.checkAndGetMenuAccessDetail(
                            "BF6C5F9C-A530-0D6D-7EC8-D78231F33DDA"
                        ) && ( //3F430D1D-70C9-14E5-916E-D68BA2AF6DE2
                            <ListFrequentlyUseAPI
                                {...this.props}
                                drawerClose={this.toggleDrawer}
                                closeAll={this.closeAll}
                                menudetail={this.state.menudetail}
                            />
                        )}
                </Drawer>

            </div>
        )
    }
}

const mapStateToProps = ({ drawerclose, APIPlanConfigurationReducer, authTokenRdcer }) => {
    const { APIPlanRequestData, FrequentUseData, MostActiveIpAddressData, loading } = APIPlanConfigurationReducer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }

    return { drawerclose, APIPlanRequestData, FrequentUseData, MostActiveIpAddressData, loading, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    getAPIPlanRequestCount,
    listMostActiveIpAddress,
    listFrequentUse,
    getMenuPermissionByID
})(APIPlanConfiguration);
