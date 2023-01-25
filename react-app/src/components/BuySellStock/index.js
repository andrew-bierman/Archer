import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import './BuySellStock.css';

const BuySellStock = ({stockInfo, stockCurrentPrice, loading}) => {
    const dispatch = useDispatch();

    // const currentPrice = useSelector(state => state.stockInfo.CurrentPrice.close);

    const buyingPower = useSelector(state => state.session.user.buying_power);
    const [quantity, setQuantity] = useState(0);
    const [total, setTotal] = useState(0);

    const [isBuying, setIsBuying] = useState(true);
    const [isSelling, setIsSelling] = useState(false);

    const handleSwitch = (switchFrom) => {
        if (switchFrom === 'buy') {
            setIsBuying(false);
            setIsSelling(true);
        }
        if (switchFrom === 'sell') {
            setIsBuying(true);
            setIsSelling(false);
        }

    }

    const handleBuy = () => {
        console.log('buying')
    }

    const handleSell = () => {
        console.log('selling')
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
                        <button onClick={() => handleSwitch('buy')}>
                            Buy {stockInfo.symbol}
                        </button>
                        <button onClick={() => handleSwitch('sell')}>
                            Sell {stockInfo.symbol}
                        </button>
                    </div>
                    <div>
                        {isBuying && (stockCurrentPrice ) &&
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
                                    <button>Buy</button>
                                    <button>Cancel</button>
                                </div>
                            </div>
                        }
                        {isSelling && (stockCurrentPrice ) &&
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
                                    <button>Sell</button>
                                    <button>Cancel</button>
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