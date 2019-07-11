/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 11-01-2019
    UpdatedDate : 11-01-2019
    Description : Search Component for Help Center
*/
import React, { Component } from 'react';
import { Form,FormGroup, Input } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';

// actions
import { updateSearchHelp, onSearchHelp, showHelpLoadingIndicator } from 'Actions/HelpCenter';

// jbs card
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class SearchHelp extends Component {

    /**
     * On Search Helps
     */
    onUpdateSearchHelps(e) {
        this.props.updateSearchHelp(e.target.value);
        if(e.target.value=='')
        {
            this.props.onSearchHelp(e.target.value); 
        }
    }

    /**
     * On Search helps
     */
    onSearchHelps() {
        this.props.showHelpLoadingIndicator();
        const { searchHelpText } = this.props;
        let self = this;
        setTimeout(() => {
            self.props.onSearchHelp(searchHelpText);
        }, 1500);
    }

    enterPressed(e) {
        var code = e.keyCode || e.which;
        if(code === 13) { //13 is the enter keycode
            this.props.showHelpLoadingIndicator();
            const { searchHelpText } = this.props;
            let self = this;
            setTimeout(() => {
                self.props.onSearchHelp(searchHelpText);
            }, 1500);
        } 
    }

    render() {
        const { searchHelpText } = this.props;
        return (
            <JbsCollapsibleCard customClasses="search-filter">
                <Form id="helpsearchform" onSubmit={(e) => { e.preventDefault() }}>
                    <h2 className="heading mb-15"><IntlMessages id="help.search.title" /></h2>
                    <FormGroup className="mb-0 w-20">
                        <Input
                            type="text"
                            name="search"
                            autoComplete="off"
                            onChange={(e) => this.onUpdateSearchHelps(e)}
                            value={searchHelpText}
                            onKeyPress={(e) =>this.enterPressed(e)}
                        />
                    </FormGroup>
                    <Button variant="raised" color="primary" className="text-white" onClick={() => this.onSearchHelps()}><IntlMessages id="faq.button.search" /></Button>
                </Form>
            </JbsCollapsibleCard>
        );
    }
}

// map state to props
const mapStateToProps = ({ helpCenter }) => {
    return helpCenter;
}

export default connect(mapStateToProps, {
    updateSearchHelp,
    onSearchHelp,
    showHelpLoadingIndicator
})(SearchHelp);
