import React, { useEffect, useState } from "react";
import { NavLink, useHistory, Redirect, Link } from "react-router-dom";
import './SearchBar.css';

const SearchBar = () => {
    const history = useHistory();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [matchingText, setMatchingText] = useState('');
    const [active, setActive] = useState('');

    const MAX_RESULTS = 5;

    useEffect(() => {
        if (query.length > 0) {
            handleSearch();
        } else {
            setResults([]);
            setActive('');
        }
    }, [query]);


    const handleFormSubmit = (e) => {
        e.preventDefault();
    }


    async function handleSearch(e) {
        // e.preventDefault();
        const res = await fetch(`/api/stocks/search/${query}`);
        const data = await res.json();
        setResults(data.stocks);
        setActive('active');
        setMatchingText(query.toUpperCase().split(''))
    }

    const handleSearchClick = (symbol) => {

        if (typeof symbol === 'string') {
            setQuery('');
            setResults([]);
            symbol = symbol.toUpperCase();
            // Redirect(`/stocks/${symbol}`);
            // .then(() => history.push(`/stocks/${symbol}`));
            // history.push(`/stocks/${symbol}`)
            // return <Redirect to={`/stocks/${symbol}`}></Redirect>
        } else {
            return
        }
    }

    return (
        <div className="search-bar-container">
            <form onSubmit={handleFormSubmit}>
                <i className="fa-solid fa-magnifying-glass"></i>
                &nbsp;
                <input type="search" onChange={e => setQuery(e.target.value)} value={query}
                    placeholder="Search for a stock"
                />
                {/* <button onClick={handleSearch}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button> */}
            </form>
            <div className={`search-results-dropdown ${results.length > 0 ? `${active}` : ''}`}>
                <div id="search-results-ul">
                    {results.slice(0, MAX_RESULTS).map(result => (
                        <div key={result.id} className='search-results-individual-result' onClick={() => handleSearchClick(result.symbol)}>
                            <Link to={`/stocks/${result.symbol}`}>
                                <span className='search-results-individual-result-symbol'>
                                    {result.symbol.split('').map((text, i) => (
                                        <span key={i} className={matchingText.includes(text.toUpperCase()) ? 'highlight' : ''}>
                                            {text}
                                        </span>
                                    ))}
                                    {/* {result.symbol} */}
                                </span>
                                &nbsp;
                                -
                                &nbsp;
                                <span className='search-results-individual-result-name'>
                                    {result.company_name.split('').map((text, i) => (
                                        <span key={i} className={matchingText.includes(text.toUpperCase()) ? 'highlight' : ''}>
                                            {text}
                                        </span>
                                    ))}
                                    {/* {result.company_name} */}
                                </span>
                            </Link>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    );
}

export default SearchBar;