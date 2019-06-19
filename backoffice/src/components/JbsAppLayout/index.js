/**
 * App Routes
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from 'react-sidebar';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';

// Components
import Header from 'Components/Header/Header';
import SidebarContent from 'Components/Sidebar';
import Footer from 'Components/Footer/Footer';
import Tour from 'Components/Tour';
import ThemeOptions from 'Components/ThemeOptions/ThemeOptions';

// preload Components
import PreloadHeader from 'Components/PreloadLayout/PreloadHeader';
import PreloadSidebar from 'Components/PreloadLayout/PreloadSidebar';


// app config
import AppConfig from 'Constants/AppConfig';

// actions
import { collapsedSidebarAction, startUserTour } from 'Actions';

class MainApp extends Component {

    /* state = {
        height_style: {
            minHeight:0
        }
    } */

    state = {
        loadingHeader: true,
        loadingSidebar: true
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        const { windowWidth } = this.state;
        window.addEventListener("resize", this.updateDimensions);
        if (AppConfig.enableUserTour && windowWidth > 600) {
            setTimeout(() => {
                this.props.startUserTour();
            }, 2000);
        }
        setTimeout(() => {
            this.setState({ loadingHeader: false, loadingSidebar: false });
        }, 114);
        //added dynamic height for footer by screen resolution wise set
        /* var xyz = $(".jbs-page-content").height();
        // console.log("xyz",xyz);
        xyz = 70+xyz+32;
        // console.log("xyz",xyz);
        this.setState({height_style : {minHeight:(xyz)+"px"}});
        if(xyz<$(window).height()){
            xyz=($(window).height()-xyz);
            // console.log("xyz",xyz);
            this.setState({height_style : {minHeight:(xyz)+"px"}});        
        } */
        // console.log($(window).height());
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    componentWillReceiveProps(nextProps) {
        const { windowWidth } = this.state;
        if (nextProps.location !== this.props.location) {
            if (windowWidth <= 1199) {
                this.props.collapsedSidebarAction(false);
            }
        }
    }

    updateDimensions = () => {
        this.setState({ windowWidth: $(window).width(), windowHeight: $(window).height() });
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    renderPage() {
        const { pathname } = this.props.location;
        const { children } = this.props;
        /* const mystyle = this.state.height_style; */
        // console.log("mystyle",mystyle);
        if (pathname === '/app/chat' || pathname.startsWith('/app/mail') || pathname === '/app/todo') {
            return (
                <div className="jbs-page-content p-0">
                    {children}
                </div>
            );
        }
        return (
            <Scrollbars
                className="jbs-scroll"
                autoHide
                autoHideDuration={100}
                style={this.getScrollBarStyle()}
            >
                <div className="jbs-page-content">
                    {children}
                </div>
                <Footer />
            </Scrollbars>
        );
    }

    // render header
    renderHeader() {
        const { loadingHeader } = this.state;
        if (loadingHeader) {
            return <PreloadHeader />;
        }
        return <Header />
    }

    //render Sidebar
    renderSidebar() {
        const { loadingSidebar } = this.state;
        if (loadingSidebar) {
            return <PreloadSidebar />;
        }
        return <SidebarContent />
    }

    //Scrollbar height
    getScrollBarStyle() {
        return {
            height: 'calc(100vh - 200px)'
        }
    }

    render() {
        const { navCollapsed, rtlLayout, miniSidebar } = this.props.settings;
        const { windowWidth } = this.state;
        return (
            <div className="app">
                <div className="app-main-container">
                    <Tour />
                    <Sidebar
                        sidebar={this.renderSidebar()}
                        open={windowWidth <= 1199 ? navCollapsed : false}
                        docked={windowWidth > 1199 ? !navCollapsed : false}
                        pullRight={rtlLayout}
                        onSetOpen={() => this.props.collapsedSidebarAction(false)}
                        styles={{ content: { overflowY: '' } }}
                        contentClassName={classnames({ 'app-conrainer-wrapper': miniSidebar })}
                    >
                        <div className="app-container">
                            <div className="jbs-app-content">
                                <div className="app-header">
                                    {this.renderHeader()}
                                </div>
                                <div className="jbs-page">
                                    {this.renderPage()}
                                </div>
                            </div>
                        </div>
                    </Sidebar>
                    <ThemeOptions />
                </div>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ settings }) => {
    return { settings }
}

export default withRouter(connect(mapStateToProps, {
    collapsedSidebarAction,
    startUserTour
})(MainApp));
