/* 
    Createdby : dhara gajera
    CreatedDate : 4-1-2019
    Description : coinListRequest Form Component custom
*/
import React, { Component,Fragment } from "react";
import { Input, Form, Label, Col, FormGroup, Alert ,Row} from "reactstrap";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
// redux actions
import { addCoinListRequest,getCoinlistRequest,getCountry} from "Actions/Coinlist";
// intl messages
import IntlMessages from "Util/IntlMessages";
//Validation for coin list request Form
const validateCoinListRequestForm = require("../../validation/CoinList/CoinListRequestForm");

class coinListRequestFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        coin_name:"",
        coin_ticker:"",
        date_of_issuance:"",
        coin_logo:"",
        coin_website:"",
        website_faq:"",
        coin_forum:"",
        bitcoin_talk:"",
        whitepaper_business:"",
        whitepaper_technical:"",
        stack_channel:"",
        official_gitHub_repository_link:"",
        team_contact:"",
        team_bio:"",
        headquarter_address:"",
        wallet_source_code:"",
        node_source_code:"",
        official_blockchain_explorer_link:"",
        max_coin_supply:"",
        tx_Fee_for_transaction:"",
        social_media_links:"",
        code_review_audit_trusted_community:"",
        deployment_process:"",
        premined_coin_amount:"",
        premined_coin_in_escrow:"",
        number_of_addresses_coins_were_distributed:"",
        segwit_exhibition:"",
        blockspeed:"",
        core_algorithm:"",
        amount_raised_during_pre_ico:"",
        advisory:"",
        number_of_blocks_mined:"",
        dev_language:"",
        erc_20_compliant:"",
        difficulty:"",
        wallet:"",
        usual_cost:"",
        if_this_coin_is_a_security:"",
        coin_type:"",
        coin_description:"",
        coin_short_name:"",
        coin_address:"",
        decimal:"",
        total_supply:"",
        circulating_supply:"",
        first_name:"",
        last_name:"",
        address:"",
        address_line_2:"",
        city:"",
        state:"",
        postalCode:"",
        country:"",
        phone:"",
        email:"",
        project_name:"",
        project_website_link:"",
        do_you_have_an_active_community:"",
        information_on_how_funds_were_raised:"",
        current_listing_on_other_exchanges:""
      },
      errors: {},
      loading: false, // loading activity
      err_msg: '',
      err_alert: true,
      success_msg: '',
      success_alert: true,
      coinListFields:[],
      countryAll: [],
    }

    this.onDismiss = this.onDismiss.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeAddCountryDetails = this.onChangeAddCountryDetails.bind(this);
  }

  onChangeAddCountryDetails(key, value) {
      this.setState({
        data: {
          ...this.state.data,
          [key]: value
        }
      });
  }

  onChange(event) {
    let newObj = Object.assign({}, this.state.data);
    newObj[event.target.name] = event.target.value;
    this.setState({ data: newObj });
  }

  onDismiss() {
    this.setState({ err_alert: false, success_alert:false });
  }

  /**
   * Add  coin list request  Data
   */

  onSubmit(event) {
    event.preventDefault();
    
    let useremail='';
		if(this.props.location.state.hasOwnProperty('userData'))
		{
				useremail= this.props.location.state.userData.Email;
    }
    const { errors, isValid } = validateCoinListRequestForm.validateCoinListRequestFormInput(this.state.data,this.state.coinListFields,useremail);
    if(typeof errors.message !=='undefined'){
      this.setState({ err_msg: <IntlMessages id={errors.message} />  });
    }else{
      this.setState({ errors:errors });
    }

    if (isValid) {
      this.setState({ loading: true });
      var requestdata ={
        userId:useremail,
        coinFields:this.state.data
      }
      this.props.addCoinListRequest(requestdata);
    }
  }

  cleanData() {
    this.setState({
      data: {
        coin_name:"",
        coin_ticker:"",
        date_of_issuance:"",
        coin_logo:"",
        coin_website:"",
        website_faq:"",
        coin_forum:"",
        bitcoin_talk:"",
        whitepaper_business:"",
        whitepaper_technical:"",
        stack_channel:"",
        official_gitHub_repository_link:"",
        team_contact:"",
        team_bio:"",
        headquarter_address:"",
        wallet_source_code:"",
        node_source_code:"",
        official_blockchain_explorer_link:"",
        max_coin_supply:"",
        tx_Fee_for_transaction:"",
        social_media_links:"",
        code_review_audit_trusted_community:"",
        deployment_process:"",
        premined_coin_amount:"",
        premined_coin_in_escrow:"",
        number_of_addresses_coins_were_distributed:"",
        segwit_exhibition:"",
        blockspeed:"",
        core_algorithm:"",
        amount_raised_during_pre_ico:"",
        advisory:"",
        number_of_blocks_mined:"",
        dev_language:"",
        erc_20_compliant:"",
        difficulty:"",
        wallet:"",
        usual_cost:"",
        if_this_coin_is_a_security:"",
        coin_type:"",
        coin_description:"",
        coin_short_name:"",
        coin_address:"",
        decimal:"",
        total_supply:"",
        circulating_supply:"",
        first_name:"",
        last_name:"",
        address:"",
        address_line_2:"",
        city:"",
        state:"",
        postalCode:"",
        country:"",
        phone:"",
        email:"",
        project_name:"",
        project_website_link:"",
        do_you_have_an_active_community:"",
        information_on_how_funds_were_raised:"",
        current_listing_on_other_exchanges:""
      },
      errors: {},
      err_msg:{},
      loading: false
    });
  }
  componentWillMount() {
    this.props.getCoinlistRequest();
    this.props.getCountry({ page: 'all' });
  }

  componentWillReceiveProps(nextProps) {
    if(typeof nextProps.coinFields_list !=='undefined' && nextProps.coinFields_list !==null && nextProps.coinFields_list !=="" && nextProps.coinFields_list.responseCode===0){
       this.setState({
            coinListFields: nextProps.coinFields_list.data[0].formfields
      });
    }
    if(typeof nextProps.data !=='undefined' && nextProps.data !=null && nextProps.data !=="" && nextProps.data.responseCode===0){
      this.setState({loading: false, success_msg: <IntlMessages id={"coinListRequestForm.add.request.success"} />, success_alert: true });
      setTimeout(function () {
				this.setState({ success_alert: false, err_alert: false });
			}.bind(this), 5000);
      this.cleanData();
    }else if(typeof nextProps.data !=='undefined' && nextProps.data !=null && nextProps.data !=="" && (nextProps.data.responseCode===1 || nextProps.data.responseCode===9)){
      if(typeof nextProps.data.errors !=='undefined' && nextProps.data.errors !=="" && nextProps.data.errors !=null){
            this.setState({ err_msg:<IntlMessages id={nextProps.data.errors.message} /> ,loading: false });
        }
     }
     
    if (typeof nextProps.countryData !=='undefined' && nextProps.countryData.responseCode===0) {
      this.setState({
        countryAll: nextProps.countryData.data
      });
    }
  }

  render() {
    const { coin_name,coin_ticker,date_of_issuance,coin_logo,coin_website,website_faq,coin_forum,bitcoin_talk,whitepaper_business,whitepaper_technical,stack_channel,official_gitHub_repository_link,team_contact,team_bio,headquarter_address,wallet_source_code,node_source_code,official_blockchain_explorer_link,max_coin_supply,tx_Fee_for_transaction,social_media_links,code_review_audit_trusted_community,deployment_process,premined_coin_amount,premined_coin_in_escrow,number_of_addresses_coins_were_distributed,segwit_exhibition,blockspeed,core_algorithm,amount_raised_during_pre_ico,advisory,number_of_blocks_mined,dev_language,erc_20_compliant,difficulty,wallet,usual_cost,if_this_coin_is_a_security,coin_type,coin_description,coin_short_name,coin_address,decimal,total_supply,circulating_supply,first_name,last_name,address,address_line_2,city,state,postalCode,country,phone,email,project_name,project_website_link,do_you_have_an_active_community,information_on_how_funds_were_raised,current_listing_on_other_exchanges } = this.state.data;  
    const {countryAll, err_alert, err_msg, success_msg, success_alert, loading, errors,coinListFields } = this.state;
    return (
      <Fragment>
      <div className="row">
        <div className="col-sm-12 col-md-10 col-lg-7">
        {loading && <div><LinearProgress color="secondary" /></div>}
        {success_msg && <div className="alert_area">
          <Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
        </div>}
        {err_msg && <div className="alert_area">
          <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
        </div>}
       
          <Form id="coinListForm">
          <Row>
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_type")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_type"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="coin_type">
                      <IntlMessages id="coinListRequestForm.CoinType" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_type")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_type"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <Input type="select" name="coin_type" id="coin_type" value={coin_type} onChange={this.onChange}>
                      <IntlMessages id="coinListRequestForm.selectCoin">
                          {(optionValue) => <option value="">{optionValue}</option>}
                      </IntlMessages>
                      <IntlMessages id="coinListRequestForm.coin">
                          {(optionValue) => <option value="coin">{optionValue}</option>}
                      </IntlMessages>
                      <IntlMessages id="coinListRequestForm.ERC20Tokens">
                          {(optionValue) => <option value="ERC20 Tokens">{optionValue}</option>}
                      </IntlMessages>
                  </Input>
                  {errors.coin_type && (
                    <span className="text-danger">
                      <IntlMessages id={errors.coin_type} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "first_name")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "first_name"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="first_name">
                      <IntlMessages id="coinListRequestForm.FirstName" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "first_name")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "first_name"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.FirstName">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={first_name}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.first_name && (
                    <span className="text-danger">
                      <IntlMessages id={errors.first_name} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_name")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_name"))].status===1) &&
            <Col sm={6}>
              <FormGroup>
                  <Label for="coin_name">
                      <IntlMessages id="coinListRequestForm.CoinName" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_name")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_name"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.CoinName">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="coin_name"
                        id="coin_name"
                        value={coin_name}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.coin_name && (
                    <span className="text-danger">
                      <IntlMessages id={errors.coin_name} />
                    </span>
                  )}
              </FormGroup>
            </Col>
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "last_name")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "last_name"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="last_name">
                      <IntlMessages id="coinListRequestForm.LastName" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "last_name")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "last_name"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.LastName">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={last_name}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.last_name && (
                    <span className="text-danger">
                      <IntlMessages id={errors.last_name} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_description")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_description"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="coin_description">
                      <IntlMessages id="coinListRequestForm.CoinDescription" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_description")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_description"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.CoinDescription">
                      { (placeholder) =>
                        <Input
                        type="textarea"
                        rows="7"
                        className="input-lg"
                        name="coin_description"
                        id="coin_description"
                        value={coin_description}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.coin_description && (
                    <span className="text-danger">
                      <IntlMessages id={errors.coin_description} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "address")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "address"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="address">
                      <IntlMessages id="coinListRequestForm.address" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "address")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "address"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.address">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="address"
                        id="address"
                        value={address}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.address && (
                    <span className="text-danger">
                      <IntlMessages id={errors.address} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_short_name")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_short_name"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="coin_description">
                      <IntlMessages id="coinListRequestForm.CoinShortName" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_short_name")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_short_name"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.CoinShortName">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="coin_short_name"
                        id="coin_short_name"
                        value={coin_short_name}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.coin_short_name && (
                    <span className="text-danger">
                      <IntlMessages id={errors.coin_short_name} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "address_line_2")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "address_line_2"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="address_line_2">
                      <IntlMessages id="coinListRequestForm.AddressLine2" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "address_line_2")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "address_line_2"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.AddressLine2">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="address_line_2"
                        id="address_line_2"
                        value={address_line_2}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.address_line_2 && (
                    <span className="text-danger">
                      <IntlMessages id={errors.address_line_2} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_address")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_address"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="coin_address">
                      <IntlMessages id="coinListRequestForm.CoinAddress" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_address")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_address"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.CoinAddress">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="coin_address"
                        id="coin_address"
                        value={coin_address}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.coin_address && (
                    <span className="text-danger">
                      <IntlMessages id={errors.coin_address} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "city")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "city"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="city">
                      <IntlMessages id="coinListRequestForm.City" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "city")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "city"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.City">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="city"
                        id="city"
                        value={city}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.city && (
                    <span className="text-danger">
                      <IntlMessages id={errors.city} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "official_gitHub_repository_link")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "official_gitHub_repository_link"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="official_gitHub_repository_link">
                      <IntlMessages id="coinListRequestForm.official_gitHub_repository_link" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "official_gitHub_repository_link")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "official_gitHub_repository_link"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.official_gitHub_repository_link">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="official_gitHub_repository_link"
                        id="official_gitHub_repository_link"
                        value={official_gitHub_repository_link}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.official_gitHub_repository_link && (
                    <span className="text-danger">
                      <IntlMessages id={errors.official_gitHub_repository_link} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "state")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "state"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="state">
                      <IntlMessages id="coinListRequestForm.State" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "state")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "state"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.State">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="state"
                        id="state"
                        value={state}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.state && (
                    <span className="text-danger">
                      <IntlMessages id={errors.state} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "official_blockchain_explorer_link")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "official_blockchain_explorer_link"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="official_blockchain_explorer_link">
                      <IntlMessages id="coinListRequestForm.BlockchainExplorer" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "official_blockchain_explorer_link")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "official_blockchain_explorer_link"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.BlockchainExplorer">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="official_blockchain_explorer_link"
                        id="official_blockchain_explorer_link"
                        value={official_blockchain_explorer_link}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.official_blockchain_explorer_link && (
                    <span className="text-danger">
                      <IntlMessages id={errors.official_blockchain_explorer_link} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "postalCode")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "postalCode"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="postalCode">
                      <IntlMessages id="coinListRequestForm.PostalCode" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "postalCode")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "postalCode"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.PostalCode">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        value={postalCode}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.postalCode && (
                    <span className="text-danger">
                      <IntlMessages id={errors.postalCode} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "decimal")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "decimal"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="decimal">
                      <IntlMessages id="coinListRequestForm.Decimal" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "decimal")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "decimal"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.Decimal">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="decimal"
                        id="decimal"
                        value={decimal}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.decimal && (
                    <span className="text-danger">
                      <IntlMessages id={errors.decimal} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "country")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "country"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label><IntlMessages id="coinListRequestForm.Country" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "country")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "country"))].Isrequired===1) && <span className="text-danger">*</span>}</Label>
                  <Input type="select" name="country" id="country" value={country} onChange={(e) => this.onChangeAddCountryDetails("country", e.target.value)}>
                    <option value="">Please Select</option>
                    {countryAll && countryAll.map((list, index) => (
                      <option key={index} value={list.locale.en}>{list.locale.en}</option>
                    ))}
                  </Input>
                  {errors.country && (
                    <span className="text-danger">
                      <IntlMessages id={errors.country} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "total_supply")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "total_supply"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="total_supply">
                      <IntlMessages id="coinListRequestForm.TotalSupply" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "total_supply")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "total_supply"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.TotalSupply">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="total_supply"
                        id="total_supply"
                        value={total_supply}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.total_supply && (
                    <span className="text-danger">
                      <IntlMessages id={errors.total_supply} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
          
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "phone")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "phone"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="phone">
                      <IntlMessages id="coinListRequestForm.Phone" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "phone")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "phone"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.Phone">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="phone"
                        id="phone"
                        value={phone}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.phone && (
                    <span className="text-danger">
                      <IntlMessages id={errors.phone} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "circulating_supply")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "circulating_supply"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="circulating_supply">
                      <IntlMessages id="coinListRequestForm.CirculatingSupply" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "circulating_supply")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "circulating_supply"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.CirculatingSupply">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="circulating_supply"
                        id="circulating_supply"
                        value={circulating_supply}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.circulating_supply && (
                    <span className="text-danger">
                      <IntlMessages id={errors.circulating_supply} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "email")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "email"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="circulating_supply">
                      <IntlMessages id="coinListRequestForm.Email" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "email")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "email"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.Email">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="email"
                        id="email"
                        value={email}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.email && (
                    <span className="text-danger">
                      <IntlMessages id={errors.email} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "tx_Fee_for_transaction")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "tx_Fee_for_transaction"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="circulating_supply">
                      <IntlMessages id="coinListRequestForm.TxFeeForTransaction" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "tx_Fee_for_transaction")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "tx_Fee_for_transaction"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.TxFeeForTransaction">
                      { (placeholder) =>
                        <Input
                        type="textarea"
                        rows="7"
                        className="input-lg"
                        name="tx_Fee_for_transaction"
                        id="tx_Fee_for_transaction"
                        value={tx_Fee_for_transaction}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.tx_Fee_for_transaction && (
                    <span className="text-danger">
                      <IntlMessages id={errors.tx_Fee_for_transaction} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "project_name")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "project_name"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="circulating_supply">
                      <IntlMessages id="coinListRequestForm.ProjectName" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "project_name")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "project_name"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.ProjectName">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="project_name"
                        id="project_name"
                        value={project_name}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.project_name && (
                    <span className="text-danger">
                      <IntlMessages id={errors.project_name} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "project_website_link")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "project_website_link"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="project_website_link">
                      <IntlMessages id="coinListRequestForm.ProjectWebsiteLink" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "project_website_link")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "project_website_link"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.ProjectWebsiteLink">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="project_website_link"
                        id="project_website_link"
                        value={project_website_link}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.project_website_link && (
                    <span className="text-danger">
                      <IntlMessages id={errors.project_website_link} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "do_you_have_an_active_community")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "do_you_have_an_active_community"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="do_you_have_an_active_community">
                      <IntlMessages id="coinListRequestForm.DoYouHaveActiveCommunity" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "do_you_have_an_active_community")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "do_you_have_an_active_community"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.DoYouHaveActiveCommunity">
                      { (placeholder) =>
                        <Input
                        type="textarea"
                        rows="7"
                        className="input-lg"
                        name="do_you_have_an_active_community"
                        id="do_you_have_an_active_community"
                        value={do_you_have_an_active_community}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.do_you_have_an_active_community && (
                    <span className="text-danger">
                      <IntlMessages id={errors.do_you_have_an_active_community} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "information_on_how_funds_were_raised")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "information_on_how_funds_were_raised"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="information_on_how_funds_were_raised">
                      <IntlMessages id="coinListRequestForm.InformationOnFunds" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "information_on_how_funds_were_raised")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "information_on_how_funds_were_raised"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.InformationOnFunds">
                      { (placeholder) =>
                        <Input
                        type="textarea"
                        rows="7"
                        className="input-lg"
                        name="information_on_how_funds_were_raised"
                        id="information_on_how_funds_were_raised"
                        value={information_on_how_funds_were_raised}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.information_on_how_funds_were_raised && (
                    <span className="text-danger">
                      <IntlMessages id={errors.information_on_how_funds_were_raised} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "current_listing_on_other_exchanges")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "current_listing_on_other_exchanges"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="current_listing_on_other_exchanges">
                      <IntlMessages id="coinListRequestForm.OtherExchanges" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "current_listing_on_other_exchanges")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "current_listing_on_other_exchanges"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.OtherExchanges">
                      { (placeholder) =>
                        <Input
                        type="textarea"
                        rows="7"
                        className="input-lg"
                        name="current_listing_on_other_exchanges"
                        id="current_listing_on_other_exchanges"
                        value={current_listing_on_other_exchanges}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.current_listing_on_other_exchanges && (
                    <span className="text-danger">
                      <IntlMessages id={errors.current_listing_on_other_exchanges} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }

            {(coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "date_of_issuance")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "date_of_issuance"))].status===1) &&
            <Col sm={6}>
              <FormGroup>
                  <Label for="date_of_issuance">
                      <IntlMessages id="coinListRequestForm.DateOfIssuance" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "date_of_issuance")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "date_of_issuance"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.DateOfIssuance">
                      { (placeholder) =>
                        <Input
                        type="date"
                        name="date_of_issuance"
                        id="date_of_issuance"
                        value={date_of_issuance}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.date_of_issuance && (
                    <span className="text-danger">
                      <IntlMessages id={errors.date_of_issuance} />
                    </span>
                  )}
              </FormGroup>
            </Col>
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "website_faq")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "website_faq"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="website_faq">
                      <IntlMessages id="coinListRequestForm.WebsiteFAQ" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "website_faq")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "website_faq"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.WebsiteFAQ">
                      { (placeholder) =>
                          <Input
                          type="textarea"
                          rows="7"
                          className="input-lg"
                          name="website_faq"
                          id="website_faq"
                          value={website_faq}
                          placeholder={placeholder}
                          autoComplete="off"
                          onChange={this.onChange}
                          />
                      }
                  </IntlMessages>
                  {errors.website_faq && (
                    <span className="text-danger">
                      <IntlMessages id={errors.website_faq} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }

            {(coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_ticker")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_ticker"))].status===1) &&
            <Col sm={6}>
              <FormGroup>
                  <Label for="coin_ticker">
                      <IntlMessages id="coinListRequestForm.CoinTicker" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_ticker")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_ticker"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.CoinTicker">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="coin_ticker"
                        id="coin_ticker"
                        value={coin_ticker}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.coin_ticker && (
                    <span className="text-danger">
                      <IntlMessages id={errors.coin_ticker} />
                    </span>
                  )}
              </FormGroup>
            </Col>
            }
          
            {(coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_logo")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_logo"))].status===1) &&
            <Col sm={6}>
              <FormGroup>
                  <Label for="coin_logo">
                      <IntlMessages id="coinListRequestForm.CoinLogo" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_logo")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_logo"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.CoinLogo">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="coin_logo"
                        id="coin_logo"
                        value={coin_logo}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.coin_logo && (
                    <span className="text-danger">
                      <IntlMessages id={errors.coin_logo} />
                    </span>
                  )}
              </FormGroup>
            </Col>
            }
            {(coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_website")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_website"))].status===1) &&
            <Col sm={6}>
              <FormGroup>
                  <Label for="coin_website">
                      <IntlMessages id="coinListRequestForm.coinWebsite" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_website")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_website"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.coinWebsite">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="coin_website"
                        id="coin_website"
                        value={coin_website}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.coin_website && (
                    <span className="text-danger">
                      <IntlMessages id={errors.coin_website} />
                    </span>
                  )}
              </FormGroup>
            </Col>
            }
            
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_forum")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_forum"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="coin_forum">
                      <IntlMessages id="coinListRequestForm.CoinForum" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_forum")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_forum"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.CoinForum">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="coin_forum"
                        id="coin_forum"
                        value={coin_forum}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.coin_forum && (
                    <span className="text-danger">
                      <IntlMessages id={errors.coin_forum} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "bitcoin_talk")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "bitcoin_talk"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="bitcoin_talk">
                      <IntlMessages id="coinListRequestForm.BitcoinTalk" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "bitcoin_talk")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "bitcoin_talk"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.BitcoinTalk">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="bitcoin_talk"
                        id="bitcoin_talk"
                        value={bitcoin_talk}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.bitcoin_talk && (
                    <span className="text-danger">
                      <IntlMessages id={errors.bitcoin_talk} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_business")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_business"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="whitepaper_business">
                      <IntlMessages id="coinListRequestForm.whitepaperBusiness" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_business")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_business"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.whitepaperBusiness">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="whitepaper_business"
                        id="whitepaper_business"
                        value={whitepaper_business}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.whitepaper_business && (
                    <span className="text-danger">
                      <IntlMessages id={errors.whitepaper_business} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_technical")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_technical"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="whitepaper_technical">
                      <IntlMessages id="coinListRequestForm.WhitepaperTechnical" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_technical")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_technical"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.WhitepaperTechnical">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="whitepaper_technical"
                        id="whitepaper_technical"
                        value={whitepaper_technical}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.whitepaper_technical && (
                    <span className="text-danger">
                      <IntlMessages id={errors.whitepaper_technical} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "stack_channel")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "stack_channel"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="stack_channel">
                      <IntlMessages id="coinListRequestForm.StackChannel" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "stack_channel")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "stack_channel"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.StackChannel">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="stack_channel"
                        id="stack_channel"
                        value={stack_channel}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.stack_channel && (
                    <span className="text-danger">
                      <IntlMessages id={errors.stack_channel} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "team_contact")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "team_contact"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="team_contact">
                      <IntlMessages id="coinListRequestForm.TeamContact" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "team_contact")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "team_contact"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.TeamContact">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="team_contact"
                        id="team_contact"
                        value={team_contact}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.team_contact && (
                    <span className="text-danger">
                      <IntlMessages id={errors.team_contact} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "team_bio")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "team_bio"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="team_bio">
                      <IntlMessages id="coinListRequestForm.TeamBio" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "team_bio")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "team_bio"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.TeamBio">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="team_bio"
                        id="team_bio"
                        value={team_bio}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.team_bio && (
                    <span className="text-danger">
                      <IntlMessages id={errors.team_bio} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "headquarter_address")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "headquarter_address"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="headquarter_address">
                      <IntlMessages id="coinListRequestForm.headquarterAddress" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "headquarter_address")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "headquarter_address"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.headquarterAddress">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="headquarter_address"
                        id="headquarter_address"
                        value={headquarter_address}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.headquarter_address && (
                    <span className="text-danger">
                      <IntlMessages id={errors.headquarter_address} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet_source_code")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet_source_code"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="wallet_source_code">
                      <IntlMessages id="coinListRequestForm.WalletSourceCode" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet_source_code")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet_source_code"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.WalletSourceCode">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="wallet_source_code"
                        id="wallet_source_code"
                        value={wallet_source_code}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.wallet_source_code && (
                    <span className="text-danger">
                      <IntlMessages id={errors.wallet_source_code} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "node_source_code")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "node_source_code"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="node_source_code">
                      <IntlMessages id="coinListRequestForm.NodeSourceCode" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "node_source_code")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "node_source_code"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.NodeSourceCode">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="node_source_code"
                        id="node_source_code"
                        value={node_source_code}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.node_source_code && (
                    <span className="text-danger">
                      <IntlMessages id={errors.node_source_code} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
           
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "max_coin_supply")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "max_coin_supply"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="max_coin_supply">
                      <IntlMessages id="coinListRequestForm.MaxCoinSupply" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "max_coin_supply")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "max_coin_supply"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.MaxCoinSupply">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="max_coin_supply"
                        id="max_coin_supply"
                        value={max_coin_supply}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.max_coin_supply && (
                    <span className="text-danger">
                      <IntlMessages id={errors.max_coin_supply} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }

            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "social_media_links")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "social_media_links"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="social_media_links">
                      <IntlMessages id="coinListRequestForm.SocialMediaLinks" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "social_media_links")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "social_media_links"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.SocialMediaLinks">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="social_media_links"
                        id="social_media_links"
                        value={social_media_links}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.social_media_links && (
                    <span className="text-danger">
                      <IntlMessages id={errors.social_media_links} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "code_review_audit_trusted_community")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "code_review_audit_trusted_community"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="code_review_audit_trusted_community">
                      <IntlMessages id="coinListRequestForm.CodeReviewAuditTrustedCommunity" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "code_review_audit_trusted_community")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "code_review_audit_trusted_community"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.CodeReviewAuditTrustedCommunity">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="code_review_audit_trusted_community"
                        id="code_review_audit_trusted_community"
                        value={code_review_audit_trusted_community}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.code_review_audit_trusted_community && (
                    <span className="text-danger">
                      <IntlMessages id={errors.code_review_audit_trusted_community} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "deployment_process")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "deployment_process"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="deployment_process">
                      <IntlMessages id="coinListRequestForm.DeploymentProcess" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "deployment_process")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "deployment_process"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.DeploymentProcess">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="deployment_process"
                        id="deployment_process"
                        value={deployment_process}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.deployment_process && (
                    <span className="text-danger">
                      <IntlMessages id={errors.deployment_process} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_amount")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_amount"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="premined_coin_amount">
                      <IntlMessages id="coinListRequestForm.PreminedCoinAmount" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_amount")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_amount"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.PreminedCoinAmount">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="premined_coin_amount"
                        id="premined_coin_amount"
                        value={premined_coin_amount}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.premined_coin_amount && (
                    <span className="text-danger">
                      <IntlMessages id={errors.premined_coin_amount} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_in_escrow")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_in_escrow"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="premined_coin_in_escrow">
                      <IntlMessages id="coinListRequestForm.PreminedCoinInEscrow" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_in_escrow")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_in_escrow"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.PreminedCoinInEscrow">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="premined_coin_in_escrow"
                        id="premined_coin_in_escrow"
                        value={premined_coin_in_escrow}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.premined_coin_in_escrow && (
                    <span className="text-danger">
                      <IntlMessages id={errors.premined_coin_in_escrow} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_addresses_coins_were_distributed")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_addresses_coins_were_distributed"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="number_of_addresses_coins_were_distributed">
                      <IntlMessages id="coinListRequestForm.NumberOfAddressesCoinsWereDistributed" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_addresses_coins_were_distributed")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_addresses_coins_were_distributed"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.NumberOfAddressesCoinsWereDistributed">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="number_of_addresses_coins_were_distributed"
                        id="number_of_addresses_coins_were_distributed"
                        value={number_of_addresses_coins_were_distributed}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.number_of_addresses_coins_were_distributed && (
                    <span className="text-danger">
                      <IntlMessages id={errors.number_of_addresses_coins_were_distributed} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "segwit_exhibition")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "segwit_exhibition"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="segwit_exhibition">
                      <IntlMessages id="coinListRequestForm.SegwitExhibition" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "segwit_exhibition")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "segwit_exhibition"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.SegwitExhibition">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="segwit_exhibition"
                        id="segwit_exhibition"
                        value={segwit_exhibition}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.segwit_exhibition && (
                    <span className="text-danger">
                      <IntlMessages id={errors.segwit_exhibition} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "blockspeed")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "blockspeed"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="blockspeed">
                      <IntlMessages id="coinListRequestForm.Blockspeed" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "blockspeed")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "blockspeed"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.Blockspeed">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="blockspeed"
                        id="blockspeed"
                        value={blockspeed}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.blockspeed && (
                    <span className="text-danger">
                      <IntlMessages id={errors.blockspeed} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "core_algorithm")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "core_algorithm"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="core_algorithm">
                      <IntlMessages id="coinListRequestForm.CoreAlgorithm" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "core_algorithm")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "core_algorithm"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.CoreAlgorithm">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="core_algorithm"
                        id="core_algorithm"
                        value={core_algorithm}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.core_algorithm && (
                    <span className="text-danger">
                      <IntlMessages id={errors.core_algorithm} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "amount_raised_during_pre_ico")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "amount_raised_during_pre_ico"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="amount_raised_during_pre_ico">
                      <IntlMessages id="coinListRequestForm.AmountRaisedDuringPreICO" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "amount_raised_during_pre_ico")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "amount_raised_during_pre_ico"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.AmountRaisedDuringPreICO">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="amount_raised_during_pre_ico"
                        id="amount_raised_during_pre_ico"
                        value={amount_raised_during_pre_ico}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.amount_raised_during_pre_ico && (
                    <span className="text-danger">
                      <IntlMessages id={errors.amount_raised_during_pre_ico} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "advisory")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "advisory"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="advisory">
                      <IntlMessages id="coinListRequestForm.Advisory" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "advisory")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "advisory"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.Advisory">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="advisory"
                        id="advisory"
                        value={advisory}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.advisory && (
                    <span className="text-danger">
                      <IntlMessages id={errors.advisory} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_blocks_mined")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_blocks_mined"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="number_of_blocks_mined">
                      <IntlMessages id="coinListRequestForm.NumberOfBlocksMined" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_blocks_mined")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_blocks_mined"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.NumberOfBlocksMined">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="number_of_blocks_mined"
                        id="number_of_blocks_mined"
                        value={number_of_blocks_mined}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.number_of_blocks_mined && (
                    <span className="text-danger">
                      <IntlMessages id={errors.number_of_blocks_mined} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "dev_language")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "dev_language"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="dev_language">
                      <IntlMessages id="coinListRequestForm.DevLanguage" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "dev_language")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "dev_language"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.DevLanguage">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="dev_language"
                        id="dev_language"
                        value={dev_language}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.dev_language && (
                    <span className="text-danger">
                      <IntlMessages id={errors.dev_language} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "erc_20_compliant")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "erc_20_compliant"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="erc_20_compliant">
                      <IntlMessages id="coinListRequestForm.ERC20Compliant" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "erc_20_compliant")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "erc_20_compliant"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.ERC20Compliant">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="erc_20_compliant"
                        id="erc_20_compliant"
                        value={erc_20_compliant}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.erc_20_compliant && (
                    <span className="text-danger">
                      <IntlMessages id={errors.erc_20_compliant} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "difficulty")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "difficulty"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="difficulty">
                      <IntlMessages id="coinListRequestForm.Difficulty" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "difficulty")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "difficulty"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.Difficulty">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="difficulty"
                        id="difficulty"
                        value={difficulty}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.difficulty && (
                    <span className="text-danger">
                      <IntlMessages id={errors.difficulty} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="wallet">
                      <IntlMessages id="coinListRequestForm.Wallet" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.Wallet">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="wallet"
                        id="wallet"
                        value={wallet}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.wallet && (
                    <span className="text-danger">
                      <IntlMessages id={errors.wallet} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "usual_cost")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "usual_cost"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="usual_cost">
                      <IntlMessages id="coinListRequestForm.usualCost" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "usual_cost")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "usual_cost"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.usualCost">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="usual_cost"
                        id="usual_cost"
                        value={usual_cost}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.usual_cost && (
                    <span className="text-danger">
                      <IntlMessages id={errors.usual_cost} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
            { (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "if_this_coin_is_a_security")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "if_this_coin_is_a_security"))].status===1) &&
            <Col sm={6}>      
              <FormGroup>
                  <Label for="if_this_coin_is_a_security">
                      <IntlMessages id="coinListRequestForm.IfThisCoinIsSecurity" />{ (coinListFields && coinListFields.findIndex(coinListformField => (coinListformField.key === "if_this_coin_is_a_security")) !==-1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "if_this_coin_is_a_security"))].Isrequired===1) && <span className="text-danger">*</span>}
                  </Label>
                  <IntlMessages id="coinListRequestForm.IfThisCoinIsSecurity">
                      { (placeholder) =>
                        <Input
                        type="text"
                        name="if_this_coin_is_a_security"
                        id="if_this_coin_is_a_security"
                        value={if_this_coin_is_a_security}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={this.onChange}
                      />
                      }
                  </IntlMessages>
                  {errors.if_this_coin_is_a_security && (
                    <span className="text-danger">
                      <IntlMessages id={errors.if_this_coin_is_a_security} />
                    </span>
                  )}
              </FormGroup>                                 
            </Col>     
            }
           
          </Row>
            <FormGroup row>
              <Label sm={2}>&nbsp;</Label>
              <Col sm={6}>
                <Button disabled={loading}
                  variant="raised"
                  className="btn-primary text-white"
                  onClick={this.onSubmit}
                >
                  <IntlMessages id="coinListRequestForm.button.submit" />
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ coinlistRequest }) => {
    var response = {
      loading: coinlistRequest.loading,
      coinFields_list:coinlistRequest.coinFields_list,
      data:coinlistRequest.data,
      countryData: coinlistRequest.country_list,
    };
    return response;
  };

export default connect(
  mapStateToProps,
  {
    addCoinListRequest,
    getCoinlistRequest,
    getCountry
  }
)(coinListRequestFrom);
