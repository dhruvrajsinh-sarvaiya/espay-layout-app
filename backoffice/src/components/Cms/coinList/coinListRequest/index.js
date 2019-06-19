/* 
    Createdby :dhara gajera
    CreatedDate : 12-1-2019
    Description : user coin list request data show
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Label } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
//Import CRUD Operation For Coinlist Request Actions...
import { getCoinListRequests } from "Actions/CoinListRequest";
import { DashboardPageTitle } from '../../DashboardPageTitle';
import MUIDataTable from "mui-datatables";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
//BreadCrumbData
const BreadCrumbData = [
  {
    title: <IntlMessages id="sidebar.app" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.dashboard" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.cms" />,
    link: '',
    index: 0
  },
  // Added By Megha Kariya (05-02-2019)
  {
    title: <IntlMessages id="sidebar.coinList" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.coinListRequest" />,
    link: '',
    index: 0
  },
];
//Table Object...
const columns = [
  {
    name: <IntlMessages id="coinListRequest.table.label.userId" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="coinListRequest.table.view.coinName" />,
    options: { sort: false, filter: false }
  },
  {
    name: <IntlMessages id="coinListRequest.table.view.dateTime" />,
    options: { sort: false, filter: false }
  },
  {
    name: <IntlMessages id="coinListRequest.table.label.View" />,
    options: { sort: false, filter: false }
  }
];

class CoinListRequest extends Component {
  constructor(props) {
    super();
    // default ui local state
    this.state = {
      loading: false, // loading activity
      coinListRequest: [],
      errors: {},
      err_msg: "",
      err_alert: true,
      showErrorStatus: false,
      showSuccessStatus: false,
      responseMessageForList: "",
      addNewUserModal: false, // add new user form modal
      coinListRequestFields: null,
      menudetail: [],
      Pflag: true,
    };
    this.onDismiss = this.onDismiss.bind(this);
  }

  // Dismiss Alert Message
  onDismiss() {
    let err = delete this.state.errors['message'];
    this.setState({ err_alert: false, errors: err });
  }

  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  /**
 * On view coin list detail
 */
  onViewFields(user) {
    this.setState({ addNewUserModal: true, coinListRequestFields: user });
  }

	/**
	 * On Close coin list detail Modal 
	 */
  closeViewDetailsDialog() {
    this.setState({ addNewUserModal: false, coinListRequestFields: null })
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('02F68038-6B00-1397-5B6B-1534616D3A05');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getCoinListRequests();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (typeof nextProps.coinRequest_list != 'undefined' && (nextProps.coinRequest_list.responseCode === 1 || nextProps.coinRequest_list.responseCode === 9)) { //getlist fail
      if (typeof nextProps.coinRequest_list.errors.message != 'undefined' && nextProps.coinRequest_list.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.coinRequest_list.errors
      });
    }
    else if (typeof nextProps.coinRequest_list != 'undefined' && nextProps.coinRequest_list != null && nextProps.coinRequest_list.responseCode == 0) {
      this.setState({
        coinListRequest: nextProps.coinRequest_list.data,
        loading: false
      });
    }
  }

  /* check menu permission */
  checkAndGetMenuAccessDetail(GUID) {
    var response = false;
    var index;
    const { menudetail } = this.state;
    if (menudetail.length) {
      for (index in menudetail) {
        if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
          response = menudetail[index];
      }
    }
    return response;
  }

  render() {
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7F536014-9B9B-02F6-056E-389A41AB68AD'); //7F536014-9B9B-02F6-056E-389A41AB68AD
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }
    const { loading, err_alert, errors, coinListRequest, coinListRequestFields } = this.state;
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
      print: false,
      download: false,
      resizableColumns: false,
      viewColumns: false,
      filter: false,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 50, 100],
      search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
    };
    const { drawerClose } = this.props;
    return (
      <Fragment>
        <div className="jbs-page-content">
          <DashboardPageTitle title={<IntlMessages id="sidebar.coinListRequest" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
          <Fragment>
            {errors.message && <div className="alert_area">
              <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
            </div>}
            <Alert color="danger" isOpen={this.state.showErrorStatus} toggle={(e) => this.setState({ showErrorStatus: false })}>
              <IntlMessages id={this.state.responseMessageForList} />
            </Alert>
            <Alert color="success" isOpen={this.state.showSuccessStatus} toggle={(e) => this.setState({ showSuccessStatus: false })}>
              <IntlMessages id={this.state.responseMessageForList} />
            </Alert>

            <div className="StackingHistory">
              <MUIDataTable
                // title={<IntlMessages id="sidebar.coinListRequest" />}
                data={
                  coinListRequest &&
                  coinListRequest.map((coinList, key) => {
                    return [
                      coinList.userId,
                      coinList.coin_name,
                      new Date(coinList.date_created).toLocaleString(),
                      menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 &&
                      <a href="javascript:void(0)" onClick={() => this.onViewFields(coinList)}><i className="ti-eye"></i></a>
                    ];
                  })
                }
                columns={columns}
                options={options}
              />
              {(loading || this.props.menuLoading) && <JbsSectionLoader />}
            </div>

            <Modal isOpen={this.state.addNewUserModal} toggle={() => this.closeViewDetailsDialog()}>
              <ModalHeader toggle={() => this.closeViewDetailsDialog()}><IntlMessages id="sidebar.coinListRequest" /></ModalHeader>
              <ModalBody>
                {coinListRequestFields !== null &&
                  <div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.coinName" />: </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.coin_name ? coinListRequestFields.coin_name : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.coinTicker" />: </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.coin_ticker ? coinListRequestFields.coin_ticker : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.dateOfIssuance" />: </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.date_of_issuance ? coinListRequestFields.date_of_issuance : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.coinLogo" />: </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.coin_logo ? coinListRequestFields.coin_logo : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.coinWebsite" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.coin_website ? coinListRequestFields.coin_website : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.websiteFaq" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.website_faq ? coinListRequestFields.website_faq : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.coinForum" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.coin_forum ? coinListRequestFields.coin_forum : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.bitcoinTalk" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.bitcoin_talk ? coinListRequestFields.bitcoin_talk : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.whitepaperBusiness" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.whitepaper_business ? coinListRequestFields.whitepaper_business : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.whitepaperTechnical" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.whitepaper_technical ? coinListRequestFields.whitepaper_technical : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.stackChannel" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.stack_channel ? coinListRequestFields.stack_channel : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.OfficialGitHubRepositoryLink" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.official_gitHub_repository_link ? coinListRequestFields.official_gitHub_repository_link : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.teamContact" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.team_contact ? coinListRequestFields.team_contact : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.teamBio" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.team_bio ? coinListRequestFields.team_bio : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.headquarterAddress" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.headquarter_address ? coinListRequestFields.headquarter_address : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.walletSourceCode" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.wallet_source_code ? coinListRequestFields.wallet_source_code : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.nodeSourceCode" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.node_source_code ? coinListRequestFields.node_source_code : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.OfficialBlockchainExplorerLink" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.official_blockchain_explorer_link}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.maxCoinSupply" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.max_coin_supply ? coinListRequestFields.max_coin_supply : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.tx_Fee_for_transaction" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.tx_Fee_for_transaction ? coinListRequestFields.tx_Fee_for_transaction : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.socialMediaLinks" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.social_media_links ? coinListRequestFields.social_media_links : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.code_review_audit_trusted_community" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.code_review_audit_trusted_community ? coinListRequestFields.code_review_audit_trusted_community : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.deploymentProcess" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.deployment_process ? coinListRequestFields.deployment_process : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.preminedCoinAmount" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.premined_coin_amount ? coinListRequestFields.premined_coin_amount : ""}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.preminedCoin_in_escrow" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.premined_coin_in_escrow ? coinListRequestFields.premined_coin_in_escrow : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.number_of_addressesCoinsWereDistributed" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.number_of_addresses_coins_were_distributed ? coinListRequestFields.number_of_addresses_coins_were_distributed : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.segwitExhibition" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.segwit_exhibition ? coinListRequestFields.segwit_exhibition : ""}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.blockspeed" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.blockspeed ? coinListRequestFields.blockspeed : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.coreAlgorithm" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.core_algorithm ? coinListRequestFields.core_algorithm : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.amountRaised_during_pre_ico" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.amount_raised_during_pre_ico ? coinListRequestFields.amount_raised_during_pre_ico : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.advisory" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.advisory ? coinListRequestFields.advisory : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.number_ofBlocksMined" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.number_of_blocks_mined ? coinListRequestFields.number_of_blocks_mined : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.devLanguage" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.dev_language ? coinListRequestFields.dev_language : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.erc_20_compliant" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.erc_20_compliant ? coinListRequestFields.erc_20_compliant : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.difficulty" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.difficulty ? coinListRequestFields.difficulty : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.wallet" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.wallet ? coinListRequestFields.wallet : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.usualCost" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.usual_cost ? coinListRequestFields.usual_cost : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.if_this_coin_is_a_security" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.if_this_coin_is_a_security ? coinListRequestFields.if_this_coin_is_a_security : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.coin_type" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.coin_type ? coinListRequestFields.coin_type : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.coin_description" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.coin_description ? coinListRequestFields.coin_description : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.coin_short_name" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.coin_short_name ? coinListRequestFields.coin_short_name : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.coin_address" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.coin_address ? coinListRequestFields.coin_address : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.decimal" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.decimal ? coinListRequestFields.decimal : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.total_supply" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.total_supply ? coinListRequestFields.total_supply : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.circulating_supply" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.circulating_supply ? coinListRequestFields.circulating_supply : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.first_name" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.first_name ? coinListRequestFields.first_name : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.last_name" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.last_name ? coinListRequestFields.last_name : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.address" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.address ? coinListRequestFields.address : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.address_line_2" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.address_line_2 ? coinListRequestFields.address_line_2 : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.city" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.city ? coinListRequestFields.city : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.state" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.state ? coinListRequestFields.state : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.postalCode" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.postalCode ? coinListRequestFields.postalCode : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.country" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.country ? coinListRequestFields.country : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.phone" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.phone ? coinListRequestFields.phone : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.email" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.email ? coinListRequestFields.email : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.project_name" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.project_name ? coinListRequestFields.project_name : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.project_website_link" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.project_website_link ? coinListRequestFields.project_website_link : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.do_you_have_an_active_community" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.do_you_have_an_active_community ? coinListRequestFields.do_you_have_an_active_community : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.information_on_how_funds_were_raised" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.information_on_how_funds_were_raised ? coinListRequestFields.information_on_how_funds_were_raised : "---"}</span></Label></div></div>
                    <div className="row"><div className="col-md-6"><Label><IntlMessages id="coinListRequest.table.view.current_listing_on_other_exchanges" /> : </Label></div><div className="col-md-6"><Label><span className="fw-bold">{coinListRequestFields.current_listing_on_other_exchanges ? coinListRequestFields.current_listing_on_other_exchanges : "---"}</span></Label></div></div>
                  </div>
                }
              </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </Modal>
          </Fragment>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ CoinListRequest, authTokenRdcer }) => {
  var response = {
    loading: CoinListRequest.loading,
    coinRequest_list: CoinListRequest.coinRequest_list,
    data: CoinListRequest.data,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    getCoinListRequests, getMenuPermissionByID
  }
)(CoinListRequest);