import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleStockCompanyInfoFromAPI } from "../../store/stocks";
import { formatToCurrency, abbrNum } from "../utility";
import "./StockPageAboutCompany.css";

const StockPageAboutCompany = () => {
    const dispatch = useDispatch();
    const { symbol } = useParams();

    useEffect(() => {
        dispatch(getSingleStockCompanyInfoFromAPI(symbol));
        console.log('company info', companyInfo)
    }, [dispatch, symbol]);

    const companyInfo = useSelector(state => state.stocks.singleStock.CompanyInfo);


    return (
        <div classname='stock-page-about-company-container'>
            <div className="stock-page-about-company-container-section-header">
                <h2>About</h2>
            </div>
            <p>{companyInfo.Description}</p>
            <div classname='stock-page-about-company-about-details'>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Industry</th>
                        <th>Exchange</th>
                    </tr>
                    <tr>
                        <td>{companyInfo.Name}</td>
                        <td>{companyInfo.Address}</td>
                        <td>{companyInfo.Industry}</td>
                        <td>{companyInfo.Exchange}</td>
                    </tr>
                </table>
            </div>
            <div classname='stock-page-about-company-key-statistics-container'>
                <div className="stock-page-about-company-container-section-header">
                    <h2>Key Statistics</h2>
                </div>
                <table>
                    <tr>
                        <th>Market Cap</th>
                        <th>PE Ratio</th>
                        <th>Dividend Yield</th>
                        <th>Analyst Target Price</th>

                    </tr>
                    <tr>
                        <td>${abbrNum(parseFloat(companyInfo.MarketCapitalization), 2).length > 0 && abbrNum(parseFloat(companyInfo.MarketCapitalization), 2).toUpperCase() }</td>
                        <td>{companyInfo.PERatio}</td>
                        <td>{companyInfo.DividendYield}</td>
                        <td>${formatToCurrency(companyInfo.AnalystTargetPrice)}</td>
                    </tr>
                    <tr>
                        <th></th>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <th>Symbol</th>
                        <th>Year High</th>
                        <th>Year Low</th>
                        <th>Sector</th>
                    </tr>
                    <tr>
                        <td>{companyInfo.Symbol}</td>
                        <td>${formatToCurrency(companyInfo["52WeekHigh"])}</td>
                        <td>${formatToCurrency(companyInfo["52WeekLow"])}</td>
                        <td>{companyInfo.Sector}</td>
                    </tr>


                </table>
                {/* <div>
                    <p>Market Capitalization</p>
                    <p>{companyInfo.MarketCapitalization}</p>
                </div>
                <div>
                    <p>Price-Earnings Ratio</p>
                    <p>{companyInfo.PERatio}</p>
                </div>
                <div>
                    <p>Dividend Yield</p>
                    <p>{companyInfo.DividendYield}</p>
                </div>
                <div>
                    <p>Analyst Target Price</p>
                    <p>{companyInfo.AnalystTargetPrice}</p>
                </div>
                <div>
                    <p>Symbol</p>
                    <p>{companyInfo.Symbol}</p>
                </div>
                <div>
                    <p>Year High</p>
                    <p>{companyInfo["52WeekHigh"]}</p>
                </div>
                <div>
                    <p>Year Low</p>
                    <p>{companyInfo["52WeekLow"]}</p>
                </div>
                <div>
                    <p>Sector</p>
                    <p>{companyInfo.Sector}</p>
                </div> */}
            </div>
        </div>
    );
}

export default StockPageAboutCompany;