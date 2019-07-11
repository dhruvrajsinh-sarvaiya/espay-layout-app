// component for Top Gainer Data By:Tejas Date : 1- 1- 2019

// import react and component
import React, { Component } from "react";
//import method for connect store in component
import { connect } from "react-redux";
// import notification manager display warning,success, or error 
import { NotificationManager } from "react-notifications";
// import section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// import drawer for display new screen
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
// import method for get top gainers data list
import { getTopGainersData } from "Actions/Trade";
// import component for drawer
import TopGainerLoserData from './TopGainerLoserData';
// import component
import { Card, Table, Input } from 'reactstrap';
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

const components = {
    TopGainerLoserData: TopGainerLoserData,
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, state, topGainerLoser) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, state, topGainerLoser });
};

// create class for Top gainer component
class TopGainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topGainerList: [],
            open: false,
            componentName: '',
            selectedType: 2,
            //added by parth andhariya
            marginTradingBit: props.marginTradingBit,
            notificationFlag: true,
            menudetail: [],

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
        this.setState({ open: false });
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
        if (nextprops.topGainersList.length !== 0 && nextprops.error.length === 0) {
            this.setState({
                topGainerList: nextprops.topGainersList,
            })
        }

        if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open1 === false) {
            this.setState({ open: false })
        }

        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                //added by parth andhariya
                if (this.state.marginTradingBit === 1) {
                    this.props.getTopGainersData({ Type: this.state.selectedType, IsMargin: 1 })
                } else {
                    this.props.getTopGainersData({ Type: this.state.selectedType })
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
            this.props.getTopGainersData({ Type: event.target.value, IsMargin: 1 })
        } else {
            this.props.getTopGainersData({ Type: event.target.value })
        }

        this.setState({ selectedType: event.target.value })
    }

    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        let response = false;
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
        const topGainers = []
        if (this.state.topGainerList.length !== 0) {
            this.state.topGainerList.map((value, key) => {
                if (key < 10) {
                    topGainers.push(value)
                }
            })
        }

        return (
            <Card className="mb-10">
                {this.props.loading && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="trading.topgainers.label.title" /></h2>
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
                    <Table responsive>
                        <thead>
                            <tr>
                                <th><IntlMessages id="exchangefeedConfig.list.column.label.pair" /></th>
                                {this.state.selectedType === 1 && <th><IntlMessages id="trade.summary.trade.volume" />  </th>}
                                {this.state.selectedType === 2 && <th><IntlMessages id="trading.topgainerslosers.label.changeper" />  </th>}
                                {this.state.selectedType === 3 && <th><IntlMessages id="trading.admin.markets.label.lastprice" />  </th>}
                                {this.state.selectedType === 4 && <th><IntlMessages id="trading.topgainerslosers.label.changeval" />  </th>}
                                <th><IntlMessages id="widgets.high" /></th>
                                <th><IntlMessages id="widgets.low" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {topGainers.length !== 0 && topGainers.map((topGainer, key) =>
                                <tr key={key}>
                                    <td>{topGainer.PairName}</td>
                                    {this.state.selectedType === 1 && <td>{parseFloat(topGainer.Volume).toFixed(8)}</td>}
                                    {this.state.selectedType === 2 && <td>{parseFloat(topGainer.ChangePer).toFixed(2)}</td>}
                                    {this.state.selectedType === 3 && <td>{parseFloat(topGainer.LTP).toFixed(8)}</td>}
                                    {this.state.selectedType === 4 && <td>{parseFloat(topGainer.ChangeValue).toFixed(8)}</td>}
                                    <td>{parseFloat(topGainer.High).toFixed(8)}</td>
                                    <td>{parseFloat(topGainer.Low).toFixed(8)}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
                <div className="mt-5 topgainerloser" style={{ position: 'absolute' }}>
                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('TopGainerLoserData', this.checkAndGetMenuAccessDetail(this.state.marginTradingBit === 1 ? '2A6715B8-6FB9-1FDF-9822-60BD999B2244' : '6A32294E-78EB-75BA-0507-537851461ABD'))} className="col-sm-full" style={{ float: "right", padding: "5px" }}>
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
                    {this.state.componentName !== '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll, this.state, this.props.topGainerLoser)}
                </Drawer>
            </Card>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ topGainers, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const topGainersList = topGainers.topGainers;
    const { loading, error } = topGainers;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { topGainersList, loading, error, drawerclose, menuLoading, menu_rights };
}
export default connect(mapStateToProps, {
    getTopGainersData,
    getMenuPermissionByID
})(TopGainer);