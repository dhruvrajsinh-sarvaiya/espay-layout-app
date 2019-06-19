import React, { Component } from 'react'
import { Container , Table } from 'reactstrap';

//imges
import Bitcoin from '../../../assets/img/bitcoin.png';
import Ethecoin from '../../../assets/img/ethereum.png';
import Litecoin from '../../../assets/img/litecoin.png';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// helpers
import { hexToRgbA } from '../../../helpers/helpers';

 // visitors data

export default class tabledata extends Component {
  render() {
    //   const visitorsData =this.state
    return (
        <div className="datatable">
        <Container>
        <div className="responsive-table-wrapper">
			<div className="table-responsive">
				<div className=" main-table">
					<Table hover>
						<thead>
							<tr className="text-black">
								<th>Rank</th>
								<th>Name</th>
                                <th>Market Cap</th>
								<th>Price</th>
								<th>24th Volume</th>
								<th>Change</th>
								<th>7 Days</th>
							</tr>
						</thead>
						<tbody>

							<tr>
                                <td>1</td>
								<td><img src={Bitcoin} className="w-20" /><span className="coinname">BitCoin</span></td>
								<td className="tabled-price">$18,007,0256</td>
								<td>$7,511</td>
								<td>$1,007,0256</td>
								<td className="tabled-price">96%</td>
								<td>  
                                    {/* <VisitorAreaChartWidget data={visitorsData} /> */}
                                </td>
							</tr>

                            <tr>
                                <td>2</td>
								<td><img src={Ethecoin} className="w-20" /><span className="coinname">Ethereum</span></td>
								<td className="tabled-price">$18,007,0256</td>
								<td>$7,511</td>
								<td>$1,007,0256</td>
								<td className="tabled-price">96%</td>
								<td>  
                                    {/* <VisitorAreaChartWidget data={visitorsData} /> */}
                                </td>
							</tr>

                           

                            <tr>
                                <td>3</td>
								<td><img src={Litecoin} className="w-20" /><span className="coinname">Litecoin</span></td>
								<td className="tabled-price">$18,007,0256</td>
								<td>$7,511</td>
								<td>$1,007,0256</td>
								<td className="tabled-price">96%</td>
								<td>  
                                    {/* <VisitorAreaChartWidget data={visitorsData} /> */}
                                </td>
							</tr>

                            <tr>
                                <td>4</td>
								<td><img src={Bitcoin} className="w-20" /><span className="coinname">BitCoin</span></td>
								<td className="tabled-price">$18,007,0256</td>
								<td>$7,511</td>
								<td>$1,007,0256</td>
								<td className="tabled-price">96%</td>
								<td>  
                                    {/* <VisitorAreaChartWidget data={visitorsData} /> */}
                                </td>
							</tr>

                            <tr>
                                <td>5</td>
								<td><img src={Ethecoin} className="w-20" /><span className="coinname">Ethereum</span></td>
								<td className="tabled-price">$18,007,0256</td>
								<td>$7,511</td>
								<td>$1,007,0256</td>
								<td className="tabled-price">96%</td>
								<td>  
                                    {/* <VisitorAreaChartWidget data={visitorsData} /> */}
                                </td>
							</tr>

                            <tr>
                                <td>6</td>
								<td><img src={Litecoin} className="w-20" /><span className="coinname">Litecoin</span></td>
								<td className="tabled-price">$18,007,0256</td>
								<td>$7,511</td>
								<td>$1,007,0256</td>
								<td className="tabled-price">96%</td>
								<td>  
                                    {/* <VisitorAreaChartWidget data={visitorsData} /> */}
                                </td>
							</tr>

                                                        <tr>
                                <td>7</td>
								<td><img src={Bitcoin} className="w-20" /><span className="coinname">BitCoin</span></td>
								<td className="tabled-price">$18,007,0256</td>
								<td>$7,511</td>
								<td>$1,007,0256</td>
								<td className="tabled-price">96%</td>
								<td>  
                                    {/* <VisitorAreaChartWidget data={visitorsData} /> */}
                                </td>
							</tr>

                            <tr>
                                <td>8</td>
								<td><img src={Ethecoin} className="w-20" /><span className="coinname">Ethereum</span></td>
								<td className="tabled-price">$18,007,0256</td>
								<td>$7,511</td>
								<td>$1,007,0256</td>
								<td className="tabled-price">96%</td>
								<td>  
                                    {/* <VisitorAreaChartWidget data={visitorsData} /> */}
                                </td>
							</tr>

                            <tr>
                                <td>9</td>
								<td><img src={Litecoin} className="w-20" /><span className="coinname">Litecoin</span></td>
								<td className="tabled-price">$18,007,0256</td>
								<td>$7,511</td>
								<td>$1,007,0256</td>
								<td className="tabled-price">96%</td>
								<td>  
                                    {/* <VisitorAreaChartWidget data={visitorsData} /> */}
                                </td>
							</tr>
                           
							
						</tbody>
					</Table>
				</div>
			</div>
        </div>
      </Container>
    </div>
    )
  }
}
