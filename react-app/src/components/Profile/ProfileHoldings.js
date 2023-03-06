import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ReactApexChart from 'react-apexcharts';

import { getAllUserHoldings } from "../../store/holdings";

import { formatToCurrency } from "../utility";

const ProfileHoldings = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        options: {
            labels: [],
            legend: {
                position: 'right'
            }
        },
        series: []
    });
    const [chartKey, setChartKey] = useState(0);

    const user = useSelector((state) => state.session.user);

    const holdings = useSelector((state) => state.holdings.allHoldings);

    const getChartData = () => {
        const data = {
            options: {
                labels: [],
                legend: {
                    position: 'right'
                }
            },
            series: []
        };
        if (holdings && holdings.length > 0) {
            data.options.labels = holdings.map(holding => holding.stock[0].symbol);
            data.series = holdings.map(holding => {
                return Math.round(holding.shares * holding.avg_cost * 100) / 100;
            });
        }
        return data;
    }

    useEffect(() => {
        // const getData = async () => {
        //     await dispatch(getAllUserHoldings(user.id))
        //         .then(() => {
        //             const data = getChartData();
        //             setChartData(data);
        //             setLoading(false);
        //         })
        // }
        // getData();

        setLoading(true);
        if(holdings && holdings.length > 0) {
            const data = getChartData();
            setChartData(data);
        }
        setLoading(false);

    }, [dispatch, user.id, holdings]);

    useEffect(() => {
        setChartKey(chartKey + 1);
    }, [holdings, chartData, user.id]);

    return (
        <div className="profile-page-holdings-container">
            <>
                {holdings && holdings.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Company Name</th>
                                <th>Shares</th>
                                <th>Avg. Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {holdings.map((holding) => (
                                    <tr key={holding.id}>
                                        <td>
                                            <NavLink to={`/stocks/${holding.stock[0].symbol}`}>
                                                {holding.stock[0].symbol}
                                            </NavLink>
                                        </td>
                                        <td>
                                            <NavLink to={`/stocks/${holding.stock[0].symbol}`}>
                                                {holding.stock[0].company_name}
                                            </NavLink>
                                        </td>
                                        <td>x{holding.shares}</td>
                                        <td>${formatToCurrency(holding.avg_cost)}</td>
                                    </tr>
                                ))}
                            </>
                        </tbody>
                    </table>
                ) : (
                    <p>You do not have any holdings</p>
                )}
                {!loading && holdings && holdings.length > 0 && chartData.series.length > 0 && (
                    <div className="chart" key={chartKey}>
                        <ReactApexChart options={chartData.options} series={chartData.series} type="pie" width={'100%'} />
                    </div>
                )}
            </>
        </div>
    );
};
export default ProfileHoldings;
