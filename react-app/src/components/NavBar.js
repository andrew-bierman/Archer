
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from './auth/LogoutButton';
import SearchBar from './SearchBar';
import ArcherLogoCrop from '../images/Logo/ArcherLogoCrop.png';
import path200 from '../images/Logo/path200.svg';

const NavBar = () => {
  const user = useSelector(state => state.session.user);

  return (
    <nav>
      <ul>
          <li>
              <NavLink to='/' exact={true} activeClassName='active'>
                <div className='navbar-logo-and-name'>
                  {/* <img src={ArcherLogoCrop}/> */}
                  <img src={path200} className='navbar-logo-img'/>
                  Archer
                </div>
              </NavLink>
          </li>
          {
            !user
            ?
            <div className='navbar-right-side '>
              <li>
                <NavLink to='/login' exact={true} activeClassName='active'>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to='/sign-up' exact={true} activeClassName='active'>
                  Sign Up
                </NavLink>
              </li>
              {/* <li>
                <NavLink to='/users' exact={true} activeClassName='active'>
                  Users
                </NavLink>
              </li> */}
            </div>
            :
            <>
              {/* <div className='navbar-middle-section'>
                <li> */}
                  <SearchBar />
                {/* </li>
              </div> */}
              <div className='navbar-right-side '>
                <li>
                  <NavLink to='/profile' exact={true} activeClassName='active'>
                    <button>
                      Profile
                    </button>
                  </NavLink>
                </li>
                <li>
                  <LogoutButton />
                </li>
              </div>
            </>

          }

      </ul>
    </nav>
  );
}

export default NavBar;
