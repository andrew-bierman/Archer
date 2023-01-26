import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUserHoldings } from '../../store/holdings';


const Profile = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const user = useSelector(state => state.session.user);
    const holdings = useSelector(state => state.holdings);

    useEffect(() => {
        setLoading(true);
        dispatch(getAllUserHoldings(user.id));
        setLoading(false);
        console.log('profile, holdings: ', holdings)
    }, [dispatch, user.id]);
    
    return (
        <>
            {
                !loading ?
                <div>
                    <h1>Profile</h1>
                    <h2>{user.username}</h2>
                    <h3>Holdings</h3>
                    <ul>
                        {holdings.allHoldings.map(holding => (
                            <li key={holding.id}>
                                {holding.stock[0].symbol}
                                &nbsp;
                                -
                                &nbsp;
                                {holding.stock[0].company_name}
                                &nbsp;
                                -
                                &nbsp;
                                x{holding.shares}
                                &nbsp;
                                -
                                &nbsp;
                                ${holding.avg_cost} avg. cost
                            </li>
                        ))}
                    </ul>
                </div>
            :
            <></>
            }
        </>
    );
    }

export default Profile;