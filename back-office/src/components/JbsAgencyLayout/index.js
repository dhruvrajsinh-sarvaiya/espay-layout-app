/**
 * Jbs Horizontal Menu Layout
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from "react-redux";

// Components
import Footer from 'Components/Footer/Footer';
import ThemeOptions from 'Components/ThemeOptions/ThemeOptions';

class JbsAgencyLayout extends Component {

   renderPage() {
      const { pathname } = this.props.location;
      const { children, match } = this.props;
      if (pathname === `${match.url}/chat` || pathname.startsWith(`${match.url}/mail`) || pathname === `${match.url}/todo`) {
         return (
            <div className="jbs-page-content p-0" style={{ height: 'calc(100vh - 15.5rem)' }}>
               {children}
            </div>
         );
      }
      return (
         <Scrollbars
            className="jbs-scroll"
            autoHide
            autoHideDuration={100}
            style={{ height: 'calc(100vh - 15.5rem)' }}
         >
            <div className="jbs-page-content">
               {children}
            </div>
         </Scrollbars>
      );
   }
   getActiveLayoutBg() {
      const { agencyLayoutBgColors, enableBgImage} = this.props;
      if(!enableBgImage) {
         for (const layoutBg of agencyLayoutBgColors) {
            if (layoutBg.active) {
               return layoutBg.class
            }
         }
      } else {
         return "app-boxed-v2"
      }
   }

   render() {
      return (
         <div className={`app-boxed ${this.getActiveLayoutBg()}`} >
            <div className="app-container">
               <div className="jbs-page-wrapper">
                  <div className="jbs-app-content">
                     <div className="app-header">
                     </div>
                     <div className="jbs-page">
                        {this.renderPage()}
                     </div>
                     <ThemeOptions />
                     <Footer />
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

// map state to props
const mapStateToProps = ({ settings }) => {
   const { agencyLayoutBgColors } = settings;
   return { agencyLayoutBgColors }
}

export default connect(mapStateToProps)(withRouter(JbsAgencyLayout));
