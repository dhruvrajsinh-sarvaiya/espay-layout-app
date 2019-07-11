/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : Language List
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import MatButton from "@material-ui/core/Button";
import {
	Badge
} from 'reactstrap';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

//Import CRUD Operation For Language Actions...
import { getAllLanguage } from 'Actions/Language';


const columns = [
	{
		name: <IntlMessages id="languages.title.languageId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="languages.title.languageName" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="languages.title.code" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="languages.title.locale" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="languages.title.sortOrder" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="languages.title.status" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="sidebar.colAction" />,
		options: { sort: false, filter: false }
	}
];

class Language extends Component {
	
	constructor(props) {
		super(props);
	
		// default ui local state
		this.state = {
			loading: true, // loading activity
			languagelist: [],
			errors : {}
		};
		
	}

	componentWillMount() {
		this.props.getAllLanguage();
    }
  
	componentWillReceiveProps(nextProps) {

		this.setState({
			languagelist: nextProps.language_list.data,
			loading: nextProps.loading
		});
		
	}

	render() {
		const { loading,languagelist} = this.state;

		const options = {
			filterType: "dropdown",
			responsive: "scroll",
			selectableRows: false,
			print: false,
			download: false,
			resizableColumns: false,
			viewColumns: false,
			filter: false,
			rowsPerPageOptions : [10, 25, 50, 100],
			serverSide: false,
			customToolbar: () => {
				return (
					<MatButton
						component={Link}
						to="/app/localization/add-language"
						variant="raised"
						className="btn-primary text-white"
					>
						<IntlMessages id="languages.button.addLanguage" />
					</MatButton>
				);
			}
		};

		return (
				<Fragment>
				<div className="responsive-table-wrapper">
					<PageTitleBar title={<IntlMessages id="sidebar.languages" />} match={this.props.match} />
					<Fragment>
					<JbsCollapsibleCard fullBlock>
					<MUIDataTable
						title={<IntlMessages id="sidebar.languages" />}
						data={languagelist && languagelist.map(language => {
							return [
								language.id,
								language.language_name,
								language.code,
								language.locale,
								language.sort_order,
								language.status == 1 ? (
								<Badge className="mb-10 mr-10" color="primary">
									<IntlMessages id="global.form.status.active" />
								</Badge>
								) : (
								<Badge className="mb-10 mr-10" color="danger">
									<IntlMessages id="global.form.status.inactive" />
								</Badge>
								),
								<div className="list-action">
									<Link  color="primary" to={{pathname:"/app/localization/edit-language", state : { data : language }}} ><i className="ti-pencil" /></Link>
								</div>
								
							]
						})}
						columns={columns}
						options={options}
					/>
					{loading &&
						<JbsSectionLoader />
					}
					</JbsCollapsibleCard>
            		</Fragment>
				</div>
				</Fragment>
		);
	}
}

const mapStateToProps = ({ languages }) => {

	const { language_list, loading } = languages;
    return { language_list, loading }
}

export default withRouter(connect(mapStateToProps,{
	getAllLanguage
}) (Language));