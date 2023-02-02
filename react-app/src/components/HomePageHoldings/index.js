import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUserHoldings } from "../../store/holdings";
import { formatToCurrency, isObjectEmpty } from "../utility";

import { getHoldingCurrentPriceFinnHub } from "../../store/holdings";
// import {getSingleStockCurrentPriceYahoo} from '../../store/stocks';
import { getAllStocks } from "../../store/stockList";
import StockList from "../StockList";
import WatchListStockChartMini from "../WatchListsStockChartMini";
import OpenModalButton from "../OpenModalButton";

import './HomePageHoldings.css';

const HomePageHoldings = () => {
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(true);

	const user = useSelector((state) => state.session.user);

	const holdings = useSelector((state) => state.holdings.allHoldings);

	const holdingsStockData = useSelector((state) => state.holdings.stockData);

	const hitAPI = async () => {
		if (holdings.length > 0) {
			holdings.forEach((holding) => {
				holding?.stock?.forEach(async (stock) => {
					// console.log(stock.symbol)
					if ((typeof holdingsStockData[stock.symbol] === 'undefined') || !holdingsStockData[stock.symbol]?.currentPrice || !isObjectEmpty(holdingsStockData[stock.symbol]?.currentPrice)) {
						await dispatch(
							getHoldingCurrentPriceFinnHub(stock.symbol)
						);
						// await dispatch(getWatchlistStockData(stock.symbol))
						// await dispatch(getWatchlistStockDataDaily(stock.symbol))
					}
				});
			});
		}
	};

	useEffect(() => {
		setLoading(true);

		const timer = setTimeout(() => {
			hitAPI();
		}, 5000);

		// console.log(state)
		setLoading(false);

		return () => clearTimeout(timer);
	}, [dispatch]);

	return (
		<div className="home-page-holdings-container">
			<div>
				<div className="home-page-holdings-header">
					<h3>Stocks</h3>
				</div>
			</div>
			<>
				{holdings.length > 0 ? (
					<>
						<div className="watchlist-stock-list">
							{holdings.map((holding) => {
								const stock = holding.stock[0];
								console.log("stock", stock);
								if (!stock) return null;

								return (
									<div
										key={stock.id}
										value={stock.id}
										className="watchlist-stock-individual"
									>
										<div className="watchlist-stock-individual-symbol">
											<div className="watchlist-stock-individual-symbol">
												<Link
													to={`/stocks/${stock.symbol}`}
												>
													<div className="watchlist-stock-individual-symbol-symbol">
														{stock.symbol}
													</div>
													<div className="stock-individual-number-of-shares">
														{0 < holding.shares <= 1
															?
															<>
																{holding.shares} Share
															</>
															:
															<>
																{holding.shares} Shares
															</>
														}
													</div>
												</Link>
											</div>
										</div>
										<div className="watchlist-stock-individual-chart">
											<div>
												{holdingsStockData[stock.symbol]?.values?.length >
													1 ? (
													<WatchListStockChartMini stockSymbol={stock.symbol} />
												) : (
													<p>Loading...</p>
												)}
											</div>
										</div>
										<div className="watchlist-stock-individual-price-and-change">
											<>
												{(typeof holdingsStockData[stock.symbol] !== "undefined") && (!isNaN(
													holdingsStockData[stock.symbol]?.currentPrice?.c)) ? (
													<div>
														<div>
															{
																<div>
																	$
																	{parseFloat(
																		holdingsStockData[stock.symbol]?.currentPrice?.c
																	).toFixed(
																		2
																	)}
																</div>
															}
														</div>
														<div>
															{/* {holdingsStockData[stock.symbol]?.percent_change > 0  */}
															{holdingsStockData[stock.symbol]?.currentPrice?.dp > 0 ? (
																<div className="watchlist-stock-individual-price-and-change-positive">
																	{/* +{parseFloat(holdingsStockData[stock.symbol]?.Info?.percent_change).toFixed(2)}% */}
																	+
																	{parseFloat(
																		holdingsStockData[
																			stock
																				.symbol
																		]
																			?.currentPrice
																			?.dp
																	).toFixed(
																		2
																	)}
																	%
																</div>
															) : (
																<div className="watchlist-stock-individual-price-and-change-negative">
																	{/* {parseFloat(holdingsStockData[stock.symbol]?.Info?.percent_change).toFixed(2)}% */}
																	{parseFloat(
																		holdingsStockData[stock.symbol]
																			?.currentPrice
																			?.dp
																	).toFixed(
																		2
																	)}
																	%
																</div>
															)}
														</div>
													</div>
												) : (
													<div className="watchlist-stock-individual-delete-button">
														{/* <button onClick={() => formatWatchlistStockData(stock.symbol)}>
                                                                <i className="fa-solid fa-sync"></i>
                                                            </button> */}
													</div>
												)}
											</>
										</div>
									</div>
								);
							})}
						</div>
					</>
				) : (
					// <table>
					//     <thead>
					//         <tr>
					//             <th>Symbol</th>
					//             <th>Company Name</th>
					//             <th>Shares</th>
					//             <th>Avg. Cost</th>
					//         </tr>
					//     </thead>
					//     <tbody>
					//         <>
					//             {
					//                 holdings.map(holding => (
					//                     <tr>
					//                         <td>{holding.stock[0].symbol}</td>
					//                         <td>{holding.stock[0].company_name}</td>
					//                         <td>x{holding.shares}</td>
					//                         <td>${formatToCurrency(holding.avg_cost)}</td>
					//                     </tr>
					//                 ))
					//             }
					//         </>
					//     </tbody>
					// </table>
					<p>You do not have any holdings</p>
				)}
			</>
		</div>
	);
};
export default HomePageHoldings;
