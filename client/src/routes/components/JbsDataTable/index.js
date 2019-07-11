/**
 * Agency Dashboard
 */
import React, { Component } from 'react'

// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// jbs DataTable added
import { DataTableFilter, DataTableWithApi, VirtualTable} from "Components/JbsDataTable";

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

import { PhoneWidget } from "Components/Widgets";

// widgets data
import {
   myTableData,  
   myTableDataColumns
} from './data';

export default class JbsDataTable extends Component {
   render() {
      return (
        <div className="table-wrapper">
            <PageTitleBar title={<IntlMessages id="sidebar.JbsDataTable" />} match={this.props.match} />

            <JbsCollapsibleCard heading="Phone Number Input For International" fullBlock>
                <div className="col-sm-12 col-lg-12 col-md-12">
                    <div className="row">
                        <div className="col-sm-12 col-lg-12 col-md-12">
                            <PhoneWidget/>
                        </div>
                    </div>
                </div>
            </JbsCollapsibleCard>

            <JbsCollapsibleCard heading="Filer Option With Table" fullBlock>
                <div className="row">
                    <div className="col-sm-12 col-lg-12 col-md-12">
                        <DataTableFilter tableData={myTableData} tableColumns={myTableDataColumns} displaySearch={false} displayFilter={false}/>
                    </div>
                </div>
            </JbsCollapsibleCard>

            <JbsCollapsibleCard heading="DataTable With API Table" fullBlock>
                <div className="row">
                    <div className="col-sm-12 col-lg-12 col-md-12">
                        <DataTableWithApi/>
                    </div>
                </div>
            </JbsCollapsibleCard>

            <JbsCollapsibleCard heading="Sticky Table" fullBlock>
                <div className="row">
                    <div className="col-sm-12 col-lg-12 col-md-12">
                        <VirtualTable/>
                    </div>
                </div>
            </JbsCollapsibleCard>

            


         </div>
      )
   }
}
