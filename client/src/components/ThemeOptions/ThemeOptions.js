/**
 * Theme Options
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { DropdownToggle, DropdownMenu, Dropdown } from 'reactstrap';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Scrollbars } from 'react-custom-scrollbars';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import $ from 'jquery';
import AppConfig from 'Constants/AppConfig';

import AgencyLayoutBgProvider from "./AgencyLayoutBgProvider";

// redux actions
import {
    toggleSidebarImage,
    setSidebarBgImageAction,
    miniSidebarAction,
    darkModeAction,
    boxLayoutAction,
    rtlLayoutAction,
    changeThemeColor,
    toggleDarkSidebar
} from 'Actions';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class ThemeOptions extends Component {

    state = {
        switched: false,
        themeOptionPanelOpen: false
    }

    componentDidMount() {
        const { darkMode, boxLayout, rtlLayout, miniSidebar } = this.props;
        if (darkMode) {
            this.darkModeHanlder(true);
        }
        if (boxLayout) {
            this.boxLayoutHanlder(true);
        }
        if (rtlLayout) {
            this.rtlLayoutHanlder(true);
        }
        if (miniSidebar) {
            this.miniSidebarHanlder(true);
        }
    }

    /**
     * Set Sidebar Background Image
     */
    setSidebarBgImage(sidebarImage) {
        this.props.setSidebarBgImageAction(sidebarImage);
    }

    /**
     * Function To Toggle Theme Option Panel
     */
    toggleThemePanel() {
        this.setState({
            themeOptionPanelOpen: !this.state.themeOptionPanelOpen
        });
    }

    /**
     * Mini Sidebar Event Handler
    */
    miniSidebarHanlder(isTrue) {
        if (isTrue) {
            $('body').addClass('mini-sidebar');
        } else {
            $('body').removeClass('mini-sidebar');
        }
        setTimeout(() => {
            this.props.miniSidebarAction(isTrue);
        }, 100)
    }

    /**
     * Dark Mode Event Hanlder
     * Use To Enable Dark Mode
     * @param {*object} event
    */
    darkModeHanlder(isTrue) {
        if (isTrue) {
            $('body').addClass('dark-mode');
        } else {
            $('body').removeClass('dark-mode');
        }
        this.props.darkModeAction(isTrue);
    }

    /**
     * Box Layout Event Hanlder
     * Use To Enable Boxed Layout
     * @param {*object} event
    */
    boxLayoutHanlder(isTrue) {
        if (isTrue) {
            $('body').addClass('boxed-layout');
        } else {
            $('body').removeClass('boxed-layout');
        }
        this.props.boxLayoutAction(isTrue);
    }

    /**
     * Rtl Layout Event Hanlder
     * Use to Enable rtl Layout
     * @param {*object} event
    */
    rtlLayoutHanlder(isTrue) {
        if (isTrue) {
            $("html").attr("dir", "rtl");
            $('body').addClass('rtl');
        } else {
            $("html").attr("dir", "ltr")
            $('body').removeClass('rtl');
        }
        this.props.rtlLayoutAction(isTrue);
    }

    /**
     * Change Theme Color Event Handler
     * @param {*object} theme 
     */
    changeThemeColor(theme) {
        const { themes } = this.props;
        for (const appTheme of themes) {
            if ($('body').hasClass(`theme-${appTheme.name}`)) {
                $('body').removeClass(`theme-${appTheme.name}`);
            }
        }
        $('body').addClass(`theme-${theme.name}`);
        this.darkModeHanlder(false);
        this.props.changeThemeColor(theme);
    }

    render() {
        const {
            darkMode,
            boxLayout,
        } = this.props;
        return (
            <div className="fixed-plugin">
                {AppConfig.enableThemeOptions &&
                    <Dropdown isOpen={this.state.themeOptionPanelOpen} toggle={() => this.toggleThemePanel()}>
                        <DropdownToggle className="bg-primary">
                            <Tooltip title="Theme Options" placement="left">
                                <i className="zmdi zmdi-settings font-2x tour-step-6"></i>
                            </Tooltip>
                        </DropdownToggle>
                        <DropdownMenu>
                            <Scrollbars className="jbs-scroll" autoHeight autoHeightMin={100} autoHeightMax={530} autoHide autoHideDuration={100}>
                                
                                <AgencyLayoutBgProvider />
                                <ul className="list-unstyled mb-0 p-10 app-settings">
                                 <li className="header-title">
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={darkMode}
                                                    onChange={(e) => this.darkModeHanlder(e.target.checked)}
                                                    className="switch-btn"
                                                />
                                            }
                                            label={<IntlMessages id="themeOptions.darkMode" />}
                                            className="m-0"
                                        />
                                    </li>
                                    
                                    <li className="header-title box-layout-option">
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={boxLayout}
                                                    onChange={(e) => this.boxLayoutHanlder(e.target.checked)}
                                                    className="switch-btn"
                                                />
                                            }
                                            label={<IntlMessages id="themeOptions.boxLayout" />}
                                            className="m-0"
                                        />
                                    </li>
                                    
                                </ul>
                            </Scrollbars>
                        </DropdownMenu>
                    </Dropdown>
                }
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ settings }) => {
    return settings;
};

export default connect(mapStateToProps, {
    toggleSidebarImage,
    setSidebarBgImageAction,
    miniSidebarAction,
    darkModeAction,
    boxLayoutAction,
    rtlLayoutAction,
    changeThemeColor,
    toggleDarkSidebar
})(ThemeOptions);
