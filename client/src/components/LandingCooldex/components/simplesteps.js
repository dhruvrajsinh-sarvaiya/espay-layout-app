import React, { Component, Fragment } from 'react';
import ReactHtmlParser from "react-html-parser";
export default class simplesteps extends Component {
    render() {
        const html = this.props.content != null && this.props.content && this.props.content[localStorage.getItem('locale')] && this.props.content[localStorage.getItem('locale')].content ? this.props.content[localStorage.getItem("locale")].content : "";
        return (
            <Fragment>
                {ReactHtmlParser(html)}
            </Fragment>
        )
    }
}
