/**
 * Footer
 */
import React,{ Component }from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import { Container,Row,Col } from 'reactstrap';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// app config
import AppConfig from 'Constants/AppConfig';
import SocialIcon from '../Social';
import MatButton from '@material-ui/core/Button';

//Cooldex Footer Start
import FooterLogo from 'Assets/image/CoolDexLogo-tm.png';

import Socialicon from 'Assets/image/social.png';
import Socialicon1 from 'Assets/image/social1.png';
import Socialicon2 from 'Assets/image/social2.png';
import Socialicon3 from 'Assets/image/social3.png';
import Socialicon4 from 'Assets/image/social4.png';

//For Getting Sitesetting Copyrights
const general = localStorage.getItem('general') !=='undefined' && localStorage.getItem('general') ? JSON.parse(localStorage.getItem('general')) : '';
var copyrights = general != null && general.locale && general.locale[localStorage.getItem('locale')] && general.locale[localStorage.getItem('locale')].copyrights ? general.locale[localStorage.getItem("locale")].copyrights : 'COOLDEX © 2018 All Rights Reserved.'
//console.log(copyrights);
const CoolFooter = () => (
    
	<div className="cooldexfooterbg">
	    <Container fluid>
            <Row>
                <Col md={6} xs={12}>
                    <img className="img-fluid footerlogo" src={FooterLogo} alt="Coin" title="Coin" />
                </Col>
                <Col md={{size:1,offset:2}} xs={6}>
                    <div className="footerlist">
                    <IntlMessages id="footerlink.about"/>
                        {/* <span>About</span> */}
                        <ul>
                            <li><Link to="/app/pages/about-us"><IntlMessages id="sidebar.aboutUs" /></Link></li>
                            <li><Link to="/app/pages/contact-us"><IntlMessages id="sidebar.contactUs" /></Link></li>
                            {/* <li><Link to="/">Mission</Link></li>
                            <li><Link to="/">Vision</Link></li> */}
                        </ul>
                    </div>
                </Col>
                <Col md={1} xs={6} className="p-0">
                    <div className="footerlist">
                    <IntlMessages id="footerlink.getstarted"/>
                        {/* <span>Get Started</span> */}
                         <ul>
                         <li><Link to="/app/pages/application-center"><IntlMessages id="sidebar.applicationCenter" /></Link></li>
                         <li><Link to="/app/pages/refund-policy"><IntlMessages id="sidebar.refundPolicy" /></Link></li>
                            {/* <li><Link to="/app/pages/coin-list"><IntlMessages id="sidebar.coinList" /></Link></li>
                            <li><Link to="/app/pages/fees"><IntlMessages id="sidebar.fees" /></Link></li> */}
                            {/* /*<li><Link to="/">Guides</Link></li>
                            <li><Link to="/">Examples</Link></li>
                            <li><Link to="/">Docs</Link></li>*/ }
                        </ul>
                    </div>
                </Col>
                <Col md={1} xs={6}>
                    <div className="footerlist">
                        {/* <span>Privacy</span> */}
                        <IntlMessages id="footerlink.privacy"/>
                        <ul>
                            <li><Link to="/app/pages/legal-statement"><IntlMessages id="sidebar.legalStatement" /></Link></li>
                            <li><Link to="/app/pages/terms-of-service"><IntlMessages id="sidebar.termsOfService" /></Link></li>
                            <li><Link to="/app/pages/privacy-policy"><IntlMessages id="sidebar.privacyPolicy" /></Link></li>
                        </ul>
                    </div>
                </Col>
                <Col md={1} xs={6}>
                    <div className="footerlist">
                            <IntlMessages id="widgets.support"/>
                        {/* <span>Support</span> */}
                        <ul>
                        <li><Link to="/app/pages/coin-list"><IntlMessages id="sidebar.coinList" /></Link></li>
                            <li><Link to="/app/pages/fees"><IntlMessages id="sidebar.fees" /></Link></li>                            
                            <li><Link to="/app/pages/faq"><IntlMessages id="sidebar.faq(s)" /></Link></li>
                            {/* <li><Link to="/app/pages/refund-policy"><IntlMessages id="sidebar.refundPolicy" /></Link></li> */}
                             {/* <li><Link to="/">Ticket</Link></li> */}
                        </ul>
                    </div>
                </Col>
            </Row>
        
            <Row className="coprightmain">
                <Col md={6}>
                    <span>{copyrights}</span>
                </Col>
                <Col md={6}>
                {/* <SocialIcon/> */}
                {/* <ul>
                    <li><Link to="/"><img className="img-fluid" src={Socialicon} alt="social" title="social" /></Link></li>
                    <li><Link to="/"><img className="img-fluid" src={Socialicon1} alt="social" title="social" /></Link></li>
                    <li><Link to="/"><img className="img-fluid" src={Socialicon2} alt="social" title="social" /></Link></li>
                    <li><Link to="/"><img className="img-fluid" src={Socialicon3} alt="social" title="social" /></Link></li>
                    <li><Link to="/"><img className="img-fluid" src={Socialicon4} alt="social" title="social" /></Link></li>
                </ul> */}
                    <ul className="list-inline footer-menus mt-5">

                        {typeof AppConfig.facebooklink!='undefined' && AppConfig.facebooklink!='' && 
                        <a href={AppConfig.facebooklink} target="_blank">
                            <li className="list-inline-item">
                                <MatButton variant="fab" mini className="btn-facebook text-white social-button">
                                    <i className="zmdi zmdi-facebook zmdi-hc-fw"></i>
                                </MatButton>
                            </li>
                        </a>
                        }
                        {typeof AppConfig.twitterlink!='undefined' && AppConfig.twitterlink!='' && 
                        <a href={AppConfig.twitterlink} target="_blank">
                            <li className="list-inline-item">
                                <MatButton variant="fab" mini className="btn-twitter text-white social-button">
                                    <i className="zmdi zmdi-twitter zmdi-hc-fw"></i>
                                </MatButton>
                            </li>
                        </a>
                        }
                        {typeof AppConfig.linkedinlink!='undefined' && AppConfig.linkedinlink!='' && 
                        <a href={AppConfig.linkedinlink} target="_blank">
                            <li className="list-inline-item">
                                <MatButton variant="fab" mini className="btn-linkedin text-white social-button">
                                    <i className="zmdi zmdi-linkedin zmdi-hc-fw"></i>
                                </MatButton>
                            </li>
                        </a>
                        }
                        {typeof AppConfig.googlepluslink!='undefined' && AppConfig.googlepluslink!='' && 
                        <a href={AppConfig.googlepluslink} target="_blank">
                            <li className="list-inline-item">
                                <MatButton variant="fab" mini className="btn-google text-white social-button">
                                    <i className="zmdi zmdi-google zmdi-hc-fw"></i>
                                </MatButton>
                            </li>
                        </a>
                        }
                        
                        {typeof AppConfig.whatsapplink!='undefined' && AppConfig.whatsapplink!='' && 
                        <a href={AppConfig.whatsapplink} target="_blank">
                            <li className="list-inline-item">
                                <MatButton variant="fab" mini className="btn-instagram text-white social-button">
                                    <i className="zmdi zmdi-whatsapp zmdi-hc-fw"></i>
                                </MatButton>
                            </li>
                        </a>
                        }
                    
                        {typeof AppConfig.instagramlink!='undefined' && AppConfig.instagramlink!='' && 
                        <a href={AppConfig.instagramlink} target="_blank">
                            <li className="list-inline-item">
                                <MatButton variant="fab" mini className="btn-instagram text-white social-button">
                                    <i className="zmdi zmdi-instagram zmdi-hc-fw"></i>
                                </MatButton>
                            </li>
                        </a>
                        }
                    </ul>
                </Col>
            </Row> 
        </Container>
	</div>
);

export default CoolFooter;
