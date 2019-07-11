/**
 * Jbs Horizontal Menu Layout
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';

// Components
import Header from 'Components/Header/Header';
import Footer from 'Components/Footer/Footer';
import HorizontalMenu from 'Components/HorizontalMenu/HorizontalMenu';
import ThemeOptions from 'Components/ThemeOptions/ThemeOptions';

class JbsHorizontalLayout extends Component {

    renderPage() {
        const { pathname } = this.props.location;
        const { children, match } = this.props;
        if (pathname === `${match.url}/chat` || pathname.startsWith(`${match.url}/mail`) || pathname === `${match.url}/todo`) {
            return (
                <div className="jbs-page-content p-0">
                    {children}
                </div>
            );
        }
        return (
           
                <div className="jbs-page-content">
                 <Scrollbars
                className="jbs-scroll"
                autoHide
                autoHideDuration={100}
                style={{ height: 'calc(100vh - 10px)' }}
            >
                    {children}
                    </Scrollbars>
                    <Footer />
                </div>
                
            
        );
    }

    render() {
        return (
            <div className="app-horizontal collapsed-sidebar">
                <div className="app-container">
                    <div className="jbs-page-wrapper">
                        <div className="jbs-app-content">
                            <div className="app-header">
                                <Header horizontalMenu />
                            </div>
                            <div className="jbs-page">
                                <HorizontalMenu />
                                {this.renderPage()}
                            </div>
                            <ThemeOptions />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(JbsHorizontalLayout);
