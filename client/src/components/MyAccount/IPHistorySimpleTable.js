/**
 * IP History Simple Table
 */
import React, { Fragment } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

const IPHistorySimpleTable = ({ title, data, columns }) => {
		return (
			<div className="table-wrapper">
				<JbsCollapsibleCard heading="" fullBlock>
					<div className="table-responsive">
						<Table>
							<TableHead>
								<TableRow hover>
									<TableCell>Date</TableCell>
									<TableCell>IP Address</TableCell>
									<TableCell>Location</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<Fragment>
								{data.map(n => {
										return (
											<TableRow hover key={Math.random}>
												<TableCell>{n[0]}</TableCell>
												<TableCell >{n[1]}</TableCell>
												<TableCell >{n[2]}</TableCell>
											</TableRow>
										);
									})}
								</Fragment>
							</TableBody>
						</Table>
					</div>
				</JbsCollapsibleCard>
		</div>
	);
}
export default IPHistorySimpleTable