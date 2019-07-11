// component for Top Loser Data By:Tejas Date : 1- 1- 2019

// import react and component
import React, { Component} from "react";

//import method for connect store in component
import { connect } from "react-redux";

// import notification manager display warning,success, or error 
import { NotificationManager } from "react-notifications";

// import section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// import drawer for display new screen
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

// import method for get top Losers data list
import { getTopLosersData } from "Actions/Trade";

// import component
import { Card, Table, Input } from 'reactstrap';

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

// import component for drawer
import TopGainerLoserData from '../TopGainer/TopGainerLoserData';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const components = {
    TopGainerLoserData: TopGainerLoserData,
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, state, topGainerLoser) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, state, topGainerLoser });
};

// create class for Top Loser component
class TopLoser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topLoserList: [],
            open: false,
            componentName: '',
            selectedType: 2,
            //added by parth andhariya
            marginTradingBit: props.marginTradingBit,
            notificationFlag: true,
            menudetail: [],
            TopLoserBit: true
        };
    }
    // method for set component
    showComponent = (componentName, menuDetail) => {

        if (menuDetail.HasChild) {

            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                menuDetail: menuDetail.ChildNodes[0]
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    // handle close drawer
    closeAll = () => {
        this.setState({
            open: false,
        });
    }

    // used for toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: ''
        });
    }
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.marginTradingBit === 1 ? '1B6C71F0-9D76-396D-25E6-6187D0F30F0A' : '5F9F682D-3B7E-35C0-6062-C3F80C2D4C56'); // get Trading menu permission
    }
    componentWillReceiveProps(nextprops) {

        if (nextprops.topLoserList.length !== 0 && nextprops.error.length == 0) {
            this.setState({
                topLoserList: nextprops.topLoserList,
            })
        }
        if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open1 === false) {
            this.setState({
                open: false,
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                //added by parth andhariya
                if (this.state.marginTradingBit === 1) {
                    this.props.getTopLosersData({ Type: this.state.selectedType, IsMargin: 1 })
                } else {
                    this.props.getTopLosersData({ Type: this.state.selectedType })
                }
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    // handle selected type for call api
    handleChange = (event) => {
        //added by parth andhariya
        if (this.state.marginTradingBit === 1) {
            this.props.getTopLosersData({ Type: event.target.value, IsMargin: 1 })
        } else {
            this.props.getTopLosersData({ Type: event.target.value })
        }

        this.setState({
            selectedType: event.target.value
        })
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
        const topLosers = []

        if (this.state.topLoserList.length !== 0) {
            this.state.topLoserList.map((value, key) => {
                if (key < 10) {
                    topLosers.push(value)
                }
            })
        }

        return (
            <Card className="mb-10">
                {this.props.loading && <JbsSectionLoader />}


                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="trading.toplosers.label.title" /></h2>
                    </div>
                    <div className="page-title-wrap">
                        <Input
                            type="select"
                            name="currency"
                            value={this.state.selectedType}
                            onChange={(e) => this.handleChange(e)}
                        >
                            <IntlMessages id="widgets.volume">
                                {(select) =>
                                    <option value="1">{select}</option>
                                }
                            </IntlMessages>

                            <IntlMessages id="trading.topgainerslosers.label.changeper">
                                {(select) =>
                                    <option value="2">{select}</option>
                                }
                            </IntlMessages>

                            <IntlMessages id="trading.admin.markets.label.lastprice">
                                {(select) =>
                                    <option value="3">{select}</option>
                                }
                            </IntlMessages>

                            <IntlMessages id="trading.topgainerslosers.label.changeval">
                                {(select) =>
                                    <option value="4">{select}</option>
                                }
                            </IntlMessages>
                        </Input>
                    </div>
                </div>

                <div className="StackingHistory">
                    {/* <Table className="gainerlosertable"> */}
                    <Table responsive>
                        <thead>
                            <tr>
                                <th><IntlMessages id="exchangefeedConfig.list.column.label.pair" /></th>
                                {this.state.selectedType == 1 && <th><IntlMessages id="trade.summary.trade.volume" />  </th>}
                                {this.state.selectedType == 2 && <th><IntlMessages id="trading.topgainerslosers.label.changeper" />  </th>}
                                {this.state.selectedType == 3 && <th><IntlMessages id="trading.admin.markets.label.lastprice" />  </th>}
                                {this.state.selectedType == 4 && <th><IntlMessages id="trading.topgainerslosers.label.changeval" />  </th>}
                                <th><IntlMessages id="widgets.high" /></th>
                                <th><IntlMessages id="widgets.low" /></th>
                            </tr>

                        </thead>
                        <tbody>
                            {topLosers.length !== 0 && topLosers.map((topLoser, key) =>
                                <tr key={key}>
                                    <td>{topLoser.PairName}</td>
                                    {this.state.selectedType == 1 && <td>{parseFloat(topLoser.Volume).toFixed(8)}</td>}
                                    {this.state.selectedType == 2 && <td>{parseFloat(topLoser.ChangePer).toFixed(2)}</td>}
                                    {this.state.selectedType == 3 && <td>{parseFloat(topLoser.LTP).toFixed(8)}</td>}
                                    {this.state.selectedType == 4 && <td>{parseFloat(topLoser.ChangeValue).toFixed(8)}</td>}
                                    <td>{parseFloat(topLoser.High).toFixed(8)}</td>
                                    <td>{parseFloat(topLoser.Low).toFixed(8)}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
                <div className="mt-5 topgainerloser" style={{ position: 'relative' }}>
                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('TopGainerLoserData', this.checkAndGetMenuAccessDetail(this.state.marginTradingBit === 1 ? 'C3BE46EF-05DC-4B51-6CC5-5CEC9CB23EE1' : '28DADF99-3CA6-98EA-2CFB-7FF5E8630317'))} className="col-sm-full" style={{ float: "right", padding: "5px" }}>
                        <IntlMessages id="trading.showmore" />
                    </a>
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer1"
                    placement="right"
                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll, this.state, this.props.topGainerLoser)}
                </Drawer>
            </Card>
        )
    }

}

// map states to props when changed in states from reducer
const mapStateToProps = ({ topLosers, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const topLoserList = topLosers.topLosers;
    const { loading, error } = topLosers;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { loading, error, topLoserList, drawerclose, menuLoading, menu_rights };

}
export default connect(
    mapStateToProps,
    {
        getTopLosersData,
        getMenuPermissionByID
    }
)(TopLoser);