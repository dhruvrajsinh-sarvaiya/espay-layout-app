// component for display When Api plan Available By Tejas 26/2/2019

// import necessary components and react for component
import React, { Component } from 'react';

// import for design
import {
    Col,
} from 'reactstrap';

// used for button
import CloseButton from "@material-ui/core/Button";

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// component when data is not availabel
import NotAvailable from "./ApiPlanNotAvailable";

// components for dispplay
import Subscribe from "./SubscribePlan";
import AutoRenew from "./SetAutoRenewData";
import ViewActivePlan from "./ViewActiveApiPlan";

// component for slider
import Slider from "react-slick";

//import Button from '@material-ui/core/Button';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}
//Slider Settings nextarrow
function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "none" }}
            onClick={onClick}
        />
    );
}

//Slider Settings prevarrow
function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "none" }}
            onClick={onClick}
        />
    );
}

// class for Api plan Component
class ViewActiveApiPlan extends Component {

    // define constrctor and set default state
    constructor(props) {
        super(props)

        if (props.data && props.SubscribeData) {
            var isAvailableDowngrade = props.data.findIndex(plan => plan.Priority > props.SubscribeData.Priority)
            var isAvailableUpgrade = props.data.findIndex(plan => plan.Priority < props.SubscribeData.Priority)
        }

        this.state = {
            planList: props.data,
            settings2: undefined,
            viewMore: false,
            viewMoreData: {},
            openMenu: null,
            SubscribeID: props.SubscribeID ? props.SubscribeID : 0,
            setAutoRenew: false,
            autoRenewData: {},
            viewActivePlan: props.SubscribeData ? true : false,
            viewActivePlanData: props.SubscribeData ? props.SubscribeData : {},
            isUpgrade: false,
            isDowngrade: false,
            isDisplayDownGrade: isAvailableDowngrade === -1 ? true : false,
            isDisplayUpGrade: isAvailableUpgrade === -1 ? true : false,
            bgColor: [
                'price-color1 pricing-tab',
                'price-color2 pricing-tab',
                'price-color3 pricing-tab',
                'price-color4 pricing-tab'
            ],
            selectedColor: '',
            icons: [
                'fa fa-thumbs-up',
                'fa fa-home',
                'fa fa-trophy',
                'fa fa-diamond'
            ]
        }
    }

    //Open Modal Dialog
    openModal = (item) => {
        this.setState({ viewMoreData: item, viewMore: true });
    }

    // invoke when component is about to get props
    componentWillReceiveProps(nextprops) {

        if (nextprops.data && nextprops.SubscribeData) {
            var isAvailableDowngrade = nextprops.data.findIndex(plan => plan.Priority > nextprops.SubscribeData.Priority)
            var isAvailableUpgrade = nextprops.data.findIndex(plan => plan.Priority < nextprops.SubscribeData.Priority)

            if (isAvailableDowngrade === -1) {
                this.setState({
                    isDisplayDownGrade: true
                })
            } else {
                this.setState({
                    isDisplayDownGrade: false
                })
            }

            if (isAvailableUpgrade === -1) {
                this.setState({
                    isDisplayUpGrade: true
                })
            } else {
                this.setState({
                    isDisplayUpGrade: false
                })
            }
        }

        if (nextprops.data) {
            this.setState({
                planList: nextprops.data
            })
        }
        if (nextprops.SubscribeData) {
            this.setState({
                viewActivePlanData: nextprops.SubscribeData,
                viewActivePlan: true
            })
        } else {
            this.setState({
                viewActivePlan: false
            })
        }

        if (nextprops.SubscribeID) {
            this.setState({
                SubscribeID: nextprops.SubscribeID
            })
        } else {
            this.setState({
                SubscribeID: 0
            })
        }

        // set plan list in state or display error if data not found
        if (nextprops.data.length !== 0) {
            nextprops.data.map((value, key) => {
                if (value.SubscribeID !== 0) {
                    this.setState({
                        SubscribeID: value.ID,
                    })
                }
            })

            this.setState({
                planList: nextprops.data
            })
        }
    }
    // handle close and Close Dialog
    handleClose = () => {
        this.setState({
            viewMore: false,
            viewMoreData: {},
            setAutoRenew: false,
            autoRenewData: {},
            openMenu: null,
        });
    }

    // set default value fro settinf of slider
    componentDidMount() {
        this.setState({
            settings2: this.settings2
        })
    }

    _getRandomColor() {
        var item = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)];
        this.setState({
            selectedColor: item,
        })
    }

    // set value for view more data
    ViewMore = (index) => {

        if (index.IsSubscribePlan) {
            this.setState({
                SubscribeID: index.ID,
                viewActivePlan: true,
                viewActivePlanData: index
            })
        } else {
            this.setState({
                viewMoreData: index, viewMore: true
            })
        }
    }

    // used fro active plan data
    setApiPlanData = (index, type) => {

        this.setState({
            viewMore: false,
            viewMoreData: {},
            openMenu: null,
            SubscribeID: 0,
            setAutoRenew: false,
            autoRenewData: {},
            viewActivePlan: false,
            viewActivePlanData: {}
        })
        var data = []
        if (type === "upgrade") {
            this.state.planList.map((value, key) => {
                if (value.Priority < index.Priority) {
                    data.push(value)
                }
            })

            this.setState({
                planList: data,
                SubscribeID: index.PlanID,
                isUpgrade: true
            })
        } else if (type === "downgrade") {

            var isAvailable = this.state.planList.findIndex(plan => plan.Priority === index.Priority)
            if (isAvailable !== -1) {

                data.push(this.state.planList[isAvailable + 1])
            }

            this.setState({
                planList: data,
                SubscribeID: index.PlanID,
                isDowngrade: true
            })
        }


    }

    // used forhandle back button 
    handleClickBack = () => {

        this.props.callRecords()
        this.setState({
            planList: this.props.data,
            viewMore: false,
            viewMoreData: {},
            openMenu: null,
            setAutoRenew: false,
            autoRenewData: {},
            isUpgrade: false,
            isDowngrade: false
        })

    }

    // used forhandle back button 
    handleBack = () => {

        this.setState({
            planList: this.props.data,
            viewMore: false,
            viewMoreData: {},
            openMenu: null,
            SubscribeID: this.props.SubscribeID ? this.props.SubscribeID : 0,
            setAutoRenew: false,
            autoRenewData: {},
            viewActivePlan: this.props.SubscribeID ? true : false,
            viewActivePlanData: this.props.SubscribeID ? this.props.SubscribeData : {},
            isUpgrade: false,
            isDowngrade: false
        })

    }

    //renders the  component
    render() {

        const data = this.state.planList;

        // settings for slider
        const settings2 = {
            slidesToShow: 4,
            slidesToScroll: 1,
            dots: false,
            autoplay: false,
            speed: 2000,
            infinite: true,
            cssEase: "linear",
            focusOnSelect: false,
            ref: (slider) => (this.settings2 = slider),
            asNavFor: this.state.settings1,
            rtl: false,
            adaptiveHeight: true,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        nextArrow: <SampleNextArrow />,
                        prevArrow: <SamplePrevArrow />,
                        className: "left",
                        infinite: false,
                        Padding: "-50px",
                    }
                }
            ]
        };

        //returns the component
        return (
            <div className="pricing style11" style={{background:"transaparent"}}>
                {this.state.viewMore === false && this.state.setAutoRenew === false && this.state.viewActivePlan === false &&

                    <div className="m-5 page-title d-flex justify-content-between align-items-center">
                        <div className="mt-5 page-title-wrap font-weight-bold" style={{ fontSize: "25px" }}>
                            {this.state.isDowngrade === true ? <IntlMessages id="sidebar.ApiPlan.downgradeplan" /> :
                                this.state.isUpgrade === true ? <IntlMessages id="sidebar.ApiPlan.upgradeplan" /> :
                                    <IntlMessages id="sidebar.ApiPlan.chooseplan" />}
                        </div>
                        {(this.state.isUpgrade || this.state.isDowngrade) &&
                            <div className="mt-5 page-title-wrap">
                                <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.handleBack}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                            </div>
                        }
                    </div>

                }
                {this.state.viewMore === false && this.state.setAutoRenew === false && this.state.viewActivePlan === false &&

                    <Slider {...settings2}
                        className="apiPlan-pricebox ml-20 mr-20 pl-20 pr-20"
                    >
                        {data.length > 0 ?
                            data.map((value, key) => {
                                var classData = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)]; 
                                 var iconData = this.state.icons[Math.floor(Math.random() * this.state.icons.length)]; 
                                return <Col md={12} key={key}
                                    className={classData}>

                                    <Col md={3} key={key} className="d-inline p-0 text-center ">

                                        <div className="price-head text-center">

                                            <h3 className="m-10"> {value.PlanName.toUpperCase()}</h3>

                                            <p className="price-label" style={{ fontSize: "30px" }}>{value.Price}  </p>

                                            <div className="text-center price-icon">
                                                <i className={iconData} />
                                            </div>
                                        </div>


                                        <Col md={12} className="price-content">

                                            <div className="text-center m-5">
                                                {value.PlanValidity + " "}
                                                {value.PlanValidityType === 1 ? <IntlMessages id="sidebar.ApiPlan.day" /> :
                                                    value.PlanValidityType === 2 ?
                                                        <IntlMessages id="components.month" /> :
                                                        value.PlanValidityType === 3 ?
                                                            <IntlMessages id="components.year" /> : ""

                                                } {" "}
                                                {<IntlMessages id="sidebar.apiplan.planvalidity" />}
                                            </div>

                                            <div className="text-center m-5">
                                                {value.ConcurrentEndPoints} {" "} {<IntlMessages id="sidebar.apiplan.concurrentendpoints" />}
                                            </div>

                                            <div className="text-center m-5">
                                                {value.HistoricalDataMonth} {" "} {<IntlMessages id="sidebar.apiplan.historical" />}
                                            </div>

                                            <div className="text-center m-5">
                                                <IntlMessages id={`sidebar.apiplan.maxperday.param`}
                                                    values={{
                                                        Param1: value.MaxPerDay,
                                                    }} />
                                            </div>

                                            <div className="text-center m-5">
                                                <IntlMessages id={`sidebar.apiplan.maxpersec.param`}
                                                    values={{
                                                        Param1: value.MaxOrderPerSec,
                                                    }} />
                                            </div>


                                            <div className="text-center m-5">
                                                <IntlMessages id={`sidebar.apiplan.maxpermin.param`}
                                                    values={{
                                                        Param1: value.MaxPerMinute,
                                                    }} />
                                            </div>

                                            <div className="text-center m-5">
                                                <IntlMessages id={`sidebar.apiplan.maxpermonth.param`}
                                                    values={{
                                                        Param1: value.MaxPerMonth,
                                                    }} />
                                            </div>

                                            <div className="text-center m-5">
                                                <IntlMessages id={`sidebar.apiplan.maxrecperreq.param`}
                                                    values={{
                                                        Param1: value.MaxRecPerRequest,
                                                    }} />
                                            </div>

                                            <div className="text-center m-5">
                                                <IntlMessages id={`sidebar.apiplan.maxreq.param`}
                                                    values={{
                                                        Param1: value.MaxReqSize,
                                                    }} />
                                            </div>

                                            <div className="text-center m-5">
                                                <IntlMessages id={`sidebar.apiplan.maxres.param`}
                                                    values={{
                                                        Param1: value.MaxResSize,
                                                    }} />
                                            </div>

                                            <div className="text-center mt-10">
                                                <a onClick={() => this.ViewMore(value)}
                                                    href="javascript:void(0)"
                                                    className="btn submit text-light font-weight-bold"
                                                >
                                                    {<IntlMessages id="sidebar.apiplan.button.viewmore" />}
                                                </a>
                                            </div>
                                        </Col>


                                    </Col>
                                </Col>

                            })
                            :
                            <Col md={12} className="d-inline p-0">
                                <NotAvailable />
                            </Col>

                        }
                    </Slider>
                }

                {this.state.viewMore === true && <Subscribe selectedData={this.state.viewMoreData}
                    SubscribeID={this.state.SubscribeID}
                    isUpgrade={this.state.isUpgrade}
                    isDowngrade={this.state.isDowngrade}
                    handleClose={this.handleClose}
                    closeAllModal={this.handleClickBack}
                    wallets={this.props.wallets}
                />}

                {this.state.setAutoRenew === true &&
                    <AutoRenew selectedData={this.state.autoRenewData}
                        handleCloseAutoRenew={this.handleClose}
                        callRecords={this.props.callRecords}
                    />
                }

                {this.state.viewActivePlan === true && this.state.viewActivePlanData &&

                    <ViewActivePlan
                        selectedData={this.state.viewActivePlanData}
                        planData={this.state.planList}
                        setApiPlanData={this.setApiPlanData}
                        displayDownGrade={this.state.isDisplayDownGrade}
                        displayUpGrade={this.state.isDisplayUpGrade}
                        callRecords={this.props.callRecords}
                        wallets={this.props.wallets}
                    />
                }

            </div>
        )
    }
}

export default ViewActiveApiPlan;