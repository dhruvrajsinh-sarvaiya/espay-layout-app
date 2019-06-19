/**
 * CreatedBy : Jinesh Bhatt
 * Date : 08-01-2019
 */
/**
 * Display HTML Body of email
 */
import React, { Component, Fragment } from "react";

import {Badge, Form, Input, Label} from "reactstrap";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import Button from '@material-ui/core/Button';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}


import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
export default class EmailQueueWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            HtmlBODY:"",
            __HTMLContent:""
        };
        this.renderBodyContents = this.renderBodyContents.bind(this);

    }
    componentWillMount() {
        
        this.setState({
            HtmlBODY:this.props.props.Body
        });

    }

    componentWillReceiveProps (nextProps){
        
        this.setState({
            HtmlBODY:nextProps.props.Body
        });
    }
    
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName:''
        })
    }

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    changeDefault = (index) => {
        this.setState({
            defaultIndex: index
        });
    }

    // on change if change in any field store value in state

    renderBodyContents = () => {
        
        return {__html: this.state.HtmlBODY}
    };

    render() {
        const { drawerClose } = this.props;
        return (
            <React.Fragment>
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2>Email Body</h2>
                    </div>
                    <div className="page-title-wrap">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                <JbsCollapsibleCard>
                    <div className="row">
                        <div className="col-md-12">
                            <div dangerouslySetInnerHTML={this.renderBodyContents()}>
                            </div>
                        </div>
                    </div>
                </JbsCollapsibleCard>

            </React.Fragment>


        );
    }
}
// map state to props


