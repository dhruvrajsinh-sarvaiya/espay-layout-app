/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 19-09-2018
    UpdatedDate : 19-09-2018
    Description : Search Component for FAQ
*/
import React, { Component } from 'react';
import { Form,FormGroup, Input } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';

// actions
import { updateSearchFaq, onSearchFaq, showFaqLoadingIndicator } from 'Actions/Faq';

// jbs card
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class SearchFaq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            isValid:true
        };
    }
    /**
     * On Search faqs
     */
    onUpdateSearchFaqs(e) {
        e.preventDefault();
        let error = {};
        if (e.target.name === "search") {
            if (isScriptTag(e.target.value)) {
                error.search = "my_account.err.scriptTag";
                this.setState({ errors: error, isValid: false })
            }
            else if (isHtmlTag(e.target.value)) {
                error.search = "my_account.err.htmlTag";
                this.setState({ errors: error, isValid: false })
            }
            else {
                this.setState({ errors: {}, isValid: true })
            }

        }
        if (this.state.isValid) {
            this.props.updateSearchFaq(e.target.value);
            if (e.target.value == '') {
                this.props.onSearchFaq(e.target.value);
            }
        }
     }
    /**
     * On Search faqs
     */
    onSearchFaqs() {
        this.props.showFaqLoadingIndicator();
        const { searchFaqText } = this.props;
        let self = this;
        setTimeout(() => {
            self.props.onSearchFaq(searchFaqText);
        }, 1500);
    }

    enterPressed(e) {
        var code = e.keyCode || e.which;
        if(code === 13) { //13 is the enter keycode
            this.props.showFaqLoadingIndicator();
            const { searchFaqText } = this.props;
            let self = this;
            setTimeout(() => {
                self.props.onSearchFaq(searchFaqText);
            }, 1500);
        } 
    }

    render() {
        const { searchFaqText } = this.props;
        const { errors } = this.state;
        return (
            <JbsCollapsibleCard customClasses="search-filter">
                <Form id="faqsearch" onSubmit={(e) => { e.preventDefault() }}>
                    <h2 className="heading mb-15"><IntlMessages id="faq.search.title" /></h2>
                    <div className="row">
                        <FormGroup className="col-md-4 col-sm-8 col-8 m-0">
                            <Input
                                type="text"
                                name="search"
                                autoComplete="off"
                                onChange={(e) => this.onUpdateSearchFaqs(e)}
                                value={searchFaqText}
                                onKeyPress={(e) =>this.enterPressed(e)}
                            />
                   {errors.search && <span className="text-danger text-left"><IntlMessages id={errors.search} /></span>}
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4 col-4 m-0">
                            <Button variant="raised" color="primary" className="text-white"
                            disabled={Object.keys(errors).length===0?false:true}    onClick={() => this.onSearchFaqs()}><IntlMessages id="faq.button.search" /></Button>
                        </FormGroup>
                    </div>
                </Form>
            </JbsCollapsibleCard>
        );
    }
}

// map state to props
const mapStateToProps = ({ faq }) => {
    return faq;
}

export default connect(mapStateToProps, {
    updateSearchFaq,
    onSearchFaq,
    showFaqLoadingIndicator
})(SearchFaq);
