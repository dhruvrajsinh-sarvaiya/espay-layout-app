import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  DataTypeProvider,
  EditingState,
  SortingState,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
  FilteringState,
  IntegratedFiltering,
  SearchState,
  SelectionState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  PagingPanel,
  TableFilterRow,
  Toolbar,
  SearchPanel,
  TableSelection,
} from '@devexpress/dx-react-grid-material-ui';

// import {
//   generateRows,
// } from './generator';

const getRowId = row => row.id;

const BooleanFormatter = ({ value }) => <Chip label={value ? 'Yes' : 'No'} />;

const BooleanEditor = ({ value, onValueChange }) => (
  <Select
    input={<Input />}
    value={value ? 'Yes' : 'No'}
    onChange={event => onValueChange(event.target.value === 'Yes')}
    style={{ width: '100%' }}
  >
    <MenuItem value="Yes">
      Yes
    </MenuItem>
    <MenuItem value="No">
      No
    </MenuItem>
  </Select>
);

const BooleanTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={BooleanFormatter}
    editorComponent={BooleanEditor}
    {...props}
  />
);

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.props.tableColumns,
      booleanColumns: ['shipped'],
    //   rows: generateRows({
    //     columnValues: { id: ({ index }) => index, ...this.props.globalSalesValues },
    //     length: 13,
    //   }),
    rows:this.props.tableData,
        currentPage: 0,
        pageSize: 10,
        pageSizes: [10, 25, 50],
        selection: [1],
    };
    console.log(this.props.sample);
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    
    this.changeSelection = selection => this.setState({ selection });

    this.commitChanges = ({ added, changed, deleted }) => {
      let { rows } = this.state;
      if (added) {
        const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
        rows = [
          ...rows,
          ...added.map((row, index) => ({
            id: startingAddedId + index,
            ...row,
          })),
        ];
      }
      if (changed) {
        rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      }
      if (deleted) {
        const deletedSet = new Set(deleted);
        rows = rows.filter(row => !deletedSet.has(row.id));
      }
      this.setState({ rows });
    };
  }

  render() {
    const { rows, columns, booleanColumns, selection, pageSize, pageSizes, currentPage,  } = this.state;
    let displaySearch, displaySearchPanel;
    if (this.props.displaySearch){
        displaySearchPanel = (<SearchPanel />); 
        displaySearch = (<SearchState defaultValue="" />);
        
    };
    return (
      <Paper>
        <Grid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
        <SelectionState
            selection={selection}
            onSelectionChange={this.changeSelection}
          />
        {displaySearch}
        
        <SortingState
            defaultSorting={[{ columnName: 'customer', direction: 'asc' }]}
          />
          <IntegratedSorting /> 
          <BooleanTypeProvider
            for={booleanColumns}
          />
          <EditingState
            onCommitChanges={this.commitChanges}
            defaultEditingRowIds={[0]}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <IntegratedPaging />
          <PagingPanel
            pageSizes={pageSizes}
          />
          <FilteringState defaultFilters={[]} />
          <IntegratedFiltering />
          <Table />
          <TableHeaderRow showSortingControls />
          <TableSelection />
          <Toolbar />
          {displaySearchPanel}
          <TableFilterRow />
          <TableEditRow />
          <TableEditColumn
            showAddCommand
            showEditCommand
            showDeleteCommand
          />
        </Grid>
      </Paper>
    );
  }
}
