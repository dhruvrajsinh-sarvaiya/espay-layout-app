// Component for User Trade Dashboard by :tejas
// import react 
import React from 'react';

//import method for connect component
import { connect } from 'react-redux';

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

// import component for row and column
import { Row, Col } from 'reactstrap';

//import drawer component
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";

// import card for display details
import { CardType6 } from '../../DashboardCard/CardType6'
//import action for user Trade count
import { getUserTradeCount } from 'Actions/Trading';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

// import components
import Todays from './TodaysTrade';
import Week from './WeeklyTrade';
import Month from './MonthlyTrade';
import Year from './YearlyTrade';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// componenet listing
const components = {
    Todays: Todays,
    Week: Week,
    Month: Month,
    Year: Year,
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, marginTradingBit,IsArbitrage) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, marginTradingBit,IsArbitrage });
};

/// create component for Active User trade
class ActiveUserTrade extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            defaultIndex: 0,
            userTradeCounts: this.props.userTradeCounts ? this.props.userTradeCounts : [],
            //added by parth andhariya
            marginTradingBit: props.marginTradingBit,
            menudetail: [],
            notificationFlag: true
        };
    }

    //function for toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: ''
        })
    }

    // used for display and set component in state
    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    // used for close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    fetchRecords = (e) => {
        e.stopPropagation();
        if (this.state.marginTradingBit === 1) {
            this.props.getUserTradeCount({ IsMargin: 1 });
        } else {
            this.props.getUserTradeCount({});
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.marginTradingBit === 1 ? 'E341B106-6F7E-0FF3-50E5-B277EF9E79DB' : '9F248B4B-9B99-6573-6D84-BD2A3F694EA0'); // get Trading menu permission
    }
    //added by parth andhariya
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();

            }
               //added by jayshreeba gohil (18/06/2019)
               var reqObject = {};
               if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                   reqObject.IsArbitrage = this.props.IsArbitrage;
               }
               this.props.getUserTradeCount(reqObject);
               //end
            this.setState({ notificationFlag: false });
        }
        this.setState({
            marginTradingBit: nextProps.marginTradingBit
        })
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
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
        const { drawerClose, userTradeCounts } = this.props;
        const { marginTradingBit } = this.state;
        
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
                title: marginTradingBit === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
                link: '',
                index: 0
            },
            {
                title: <IntlMessages id="card.list.title.usertrade" />,
                link: '',
                index: 1
            }
        ];

        return (
            <div className="drawer-data trading-dashboard-wrapper jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="card.list.title.usertrade" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '7A549A53-9590-55EE-728A-1643A0F6972C' : '93251177-057B-3B8E-371C-BB9F3A075116') && //93251177-057B-3B8E-371C-BB9F3A075116  && margin_GUID 7A549A53-9590-55EE-728A-1643A0F6972C
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('Todays',{IsArbitrage:1}, (this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '7A549A53-9590-55EE-728A-1643A0F6972C' : '93251177-057B-3B8E-371C-BB9F3A075116')).HasChild)} className="text-dark col-sm-full">
                                <CardType6
                                    title={<IntlMessages id="widgets.today" />}
                                    count={userTradeCounts.Today ? userTradeCounts.Today.Total : 0}
                                    TotalCancel={userTradeCounts.Today ? userTradeCounts.Today.Cancel : 0}
                                    TotalSettle={userTradeCounts.Today ? userTradeCounts.Today.Settled : 0}
                                    OpenTotal={userTradeCounts.Today ? userTradeCounts.Today.Active : 0}
                                    PartialCancel={userTradeCounts.Today ? userTradeCounts.Today.PartialCancel : 0}
                                    SystemFail={userTradeCounts.Today ? userTradeCounts.Today.SystemFail : 0}
                                    icon="fa fa-calendar-check-o"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'E96B8FAC-2BCB-1539-7B61-C37B6AB08E52' : 'E90A0C4E-A4EA-8EA4-6846-622DE87C0B42') && //E90A0C4E-A4EA-8EA4-6846-622DE87C0B42 && margin_GUID E96B8FAC-2BCB-1539-7B61-C37B6AB08E52
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('Week',{IsArbitrage:1}, (this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'E96B8FAC-2BCB-1539-7B61-C37B6AB08E52' : 'E90A0C4E-A4EA-8EA4-6846-622DE87C0B42')).HasChild)} className="text-dark col-sm-full">
                                <CardType6
                                    title={<IntlMessages id="widgets.thisWeek" />}
                                    count={userTradeCounts.Week ? userTradeCounts.Week.Total : 0}
                                    TotalCancel={userTradeCounts.Week ? userTradeCounts.Week.Cancel : 0}
                                    TotalSettle={userTradeCounts.Week ? userTradeCounts.Week.Settled : 0}
                                    OpenTotal={userTradeCounts.Week ? userTradeCounts.Week.Active : 0}
                                    PartialCancel={userTradeCounts.Week ? userTradeCounts.Week.PartialCancel : 0}
                                    SystemFail={userTradeCounts.Week ? userTradeCounts.Week.SystemFail : 0}
                                    icon="fa fa-calendar-plus-o"
                                />
                            </a>

                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '799C3D99-A644-0923-6E83-E8933C8A835A' : '10ABD8AD-6045-24F0-8786-3ACF31E151F3') && //10ABD8AD-6045-24F0-8786-3ACF31E151F3 && margin_GUID 799C3D99-A644-0923-6E83-E8933C8A835A
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('Month',{IsArbitrage:1}, (this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '799C3D99-A644-0923-6E83-E8933C8A835A' : '10ABD8AD-6045-24F0-8786-3ACF31E151F3')).HasChild)} className="text-dark col-sm-full">
                                <CardType6
                                    title={<IntlMessages id="trading.admin.cards.lable.month" />}
                                    count={userTradeCounts.Month ? userTradeCounts.Month.Total : 0}
                                    TotalCancel={userTradeCounts.Month ? userTradeCounts.Month.Cancel : 0}
                                    TotalSettle={userTradeCounts.Month ? userTradeCounts.Month.Settled : 0}
                                    OpenTotal={userTradeCounts.Month ? userTradeCounts.Month.Active : 0}
                                    PartialCancel={userTradeCounts.Month ? userTradeCounts.Month.PartialCancel : 0}
                                    SystemFail={userTradeCounts.Month ? userTradeCounts.Month.SystemFail : 0}
                                    icon="fa fa-calendar"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '0C47E0CE-5001-5DF4-1D1B-766281BB4300' : '107859D0-1D93-9AC9-4F18-34049A6F945B') && //107859D0-1D93-9AC9-4F18-34049A6F945B && margin_GUID 0C47E0CE-5001-5DF4-1D1B-766281BB4300
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('Year',{IsArbitrage:1}, (this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '0C47E0CE-5001-5DF4-1D1B-766281BB4300' : '107859D0-1D93-9AC9-4F18-34049A6F945B')).HasChild)} className="text-dark col-sm-full">
                                <CardType6
                                    title={<IntlMessages id="trading.admin.cards.lable.year" />}
                                    count={userTradeCounts.Year ? userTradeCounts.Year.Total : 0}
                                    TotalCancel={userTradeCounts.Year ? userTradeCounts.Year.Cancel : 0}
                                    TotalSettle={userTradeCounts.Year ? userTradeCounts.Year.Settled : 0}
                                    OpenTotal={userTradeCounts.Year ? userTradeCounts.Year.Active : 0}
                                    PartialCancel={userTradeCounts.Year ? userTradeCounts.Year.PartialCancel : 0}
                                    SystemFail={userTradeCounts.Year ? userTradeCounts.Year.SystemFail : 0}
                                    icon="fa fa-calendar-o"
                                />
                            </a>
                        </div>
                    }
                </div>
                <Drawer
                    width="100%"
                    handler={null}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className={null}
                    level={null}
                    placement="right"
                    levelMove={100}
                    getContainer={null}
                    showMask={false}
                >
                    {/* added by parth andhariya for margin-trading */}
                    {this.state.componentName !== '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll, this.state.marginTradingBit,this.props.IsArbitrage)}
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ totalCount, drawerclose, authTokenRdcer }) => {
    const { userTradeCounts } = totalCount;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    // code added by devnag parekh for handle breadscum issue (18-3-2019)
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    //end
    return { userTradeCounts, drawerclose, menuLoading, menu_rights };
}

// export this component with action methods and props
export default connect(mapStateToProps, {
    getUserTradeCount,
    getMenuPermissionByID
})(ActiveUserTrade);
