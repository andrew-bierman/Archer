import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserSession } from "../../store/session";
import { getSingleStockInfo } from "../../store/stocks";
import { getAllUserHoldings, createNewHolding, updateHolding, deleteHolding, getHoldingByStockSymbol, resetCurrentHolding } from "../../store/holdings";
import './BuySellStock.css';

const BuySellStock = ({stockInfo, stockCurrentPrice, loading}) => {
    const dispatch = useDispatch();

    // const currentPrice = useSelector(state => state.stockInfo.CurrentPrice.close);

    const buyingPower = useSelector(state => state.session.user.buying_power);
    const [quantity, setQuantity] = useState(0);
    const [total, setTotal] = useState(0);

    const [isBuying, setIsBuying] = useState(true);
    const [isSelling, setIsSelling] = useState(false);

    const userHoldings = useSelector(state => state.holdings.allHoldings);
    const currentHolding = useSelector(state => state.holdings.currentHolding);
    const currentHoldingId = Object.values(currentHolding)[0]?.id

    const { symbol } = useParams();

    useEffect(() => {
        dispatch(getAllUserHoldings());
        dispatch(getSingleStockInfo(symbol))
        dispatch(getHoldingByStockSymbol(symbol))
        dispatch(getUserSession())

        return () => {
            resetForm();
            // dispatch(resetCurrentHolding());
        }

    }, [dispatch]);

    const handleSwitch = (switchTo) => {
        if (switchTo === 'buy') {
            setIsBuying(true);
            setIsSelling(false);
        }
        if (switchTo === 'sell') {
            setIsBuying(false);
            setIsSelling(true);
        }

    }

    function isObjectEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    const handleBuy = async () => {
        // console.log('buying')
        if (quantity > 0) {
            if (quantity * stockCurrentPrice <= buyingPower) {
                if (!isObjectEmpty(currentHolding)) {
                    // console.log('updating holding', Object.values(currentHolding)[0].id)
                    await dispatch(updateHolding(Object.values(currentHolding)[0].id, quantity, stockCurrentPrice))
                    await dispatch(getHoldingByStockSymbol(stockInfo.symbol))
                    await dispatch(getAllUserHoldings())
                    await dispatch(getUserSession())
                } else {
                    await dispatch(createNewHolding(stockInfo.symbol, quantity, stockCurrentPrice))
                    await dispatch(getAllUserHoldings())
                    await dispatch(getHoldingByStockSymbol(stockInfo.symbol))
                    await dispatch(getUserSession())
                }
            } else {
                alert('Not enough buying power')
            }
        }
    }

    const handleSell = async () => {
        // console.log('selling')
        if (quantity > 0) {
            if (quantity < Object.values(currentHolding)[0].shares) {
                dispatch(updateHolding(Object.values(currentHolding)[0].id, -quantity, stockCurrentPrice))
                await dispatch(getHoldingByStockSymbol(stockInfo.symbol))
                await dispatch(getAllUserHoldings())
                await dispatch(getUserSession())
            } else if (parseFloat(quantity) === Object.values(currentHolding)[0].shares) {
                dispatch(deleteHolding(Object.values(currentHolding)[0].id))
                await dispatch(getAllUserHoldings())
                await dispatch(getHoldingByStockSymbol(stockInfo.symbol))
                await dispatch(getUserSession())
            } else {
                console.log(typeof quantity)
                console.log(typeof Object.values(currentHolding)[0].shares)
                alert('Not enough shares')
            }
        }
    }

    const resetForm = () => {
        setQuantity(0);
        setTotal(0);
    }

    function isNumber(n) {
        return typeof n === 'number' && isFinite(n);
    }

    function formatToCurrency(amount){
        if(amount === null || amount === undefined || amount === NaN) return '';

        if(!isNumber(amount)) return amount;

        return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
    }





    return (
        <>
            {
                (!loading && stockCurrentPrice > 0) &&

                <div className="stock-page-buy-sell-container">
                    <div className="stock-page-buy-sell-top-buttons">
                        <button onClick={() => handleSwitch('buy')} className='stock-page-buy-button-top'>
                            Buy {stockInfo.symbol}
                        </button>
                        <button onClick={() => handleSwitch('sell')} className='stock-page-sell-button-top'>
                            Sell {stockInfo.symbol}
                        </button>
                    </div>
                    <div className="stock-page-buy-sell-details-container">
                        {isBuying &&
                            <div className="stock-page-buy-sell-buy">
                                <h3>Buy {stockInfo.symbol}</h3>
                                <div className="stock-page-buy-sell-buy-inputs">
                                    <div className="stock-page-buy-sell-buy-inputs-quantity">
                                        <h5>Quantity</h5>
                                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>
                                    </div>
                                    <div className="stock-page-buy-sell-buy-inputs-price">
                                        <h5>Price</h5>
                                        <h5>${formatToCurrency(stockCurrentPrice)}</h5>
                                    </div>
                                    <div className="stock-page-buy-sell-buy-inputs-total">
                                        <h5>Total</h5>
                                        <h5>${formatToCurrency(stockCurrentPrice * quantity)}</h5>
                                    </div>
                                </div>
                                <div className="stock-page-buy-sell-buy-buttons">
                                    <button className='stock-page-buy' onClick={() => handleBuy()}>Buy</button>
                                    {/* <button onClick={() => resetForm()}>Cancel</button> */}
                                </div>
                            </div>
                        }
                        {isSelling &&
                            <div className="stock-page-buy-sell-sell">
                                <h3>Sell {stockInfo.symbol}</h3>
                                <div className="stock-page-buy-sell-sell-inputs">
                                    <div className="stock-page-buy-sell-sell-inputs-quantity">
                                        <h5>Quantity</h5>
                                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>
                                    </div>
                                    <div className="stock-page-buy-sell-sell-inputs-price">
                                        <h5>Price</h5>
                                        <h5>${formatToCurrency(stockCurrentPrice)}</h5>
                                    </div>
                                    <div className="stock-page-buy-sell-sell-inputs-total">
                                        <h5>Total</h5>
                                        <h5>${formatToCurrency(stockCurrentPrice * quantity)}</h5>
                                    </div>
                                </div>
                                <div className="stock-page-buy-sell-sell-buttons">
                                    <button className='stock-page-sell' onClick={() => handleSell()}>Sell</button>
                                    {/* <button onClick={() => resetForm()}>Cancel</button> */}
                                </div>
                            </div>
                        }

                    </div>
                    <div className='stock-page-buy-sell-buying-power'>
                        <h6>Buying Power ${formatToCurrency(buyingPower)}</h6>
                    </div>
                </div>
            }
        </>
    );
}

export default BuySellStock;