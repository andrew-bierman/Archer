import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from './auth/LogoutButton';
import SearchBar from './SearchBar';
import LogoIconComp from './LogoIconComp/LogoIconComp';
import ArcherLogoCrop from '../images/Logo/ArcherLogoCrop.png';
import path200 from '../images/Logo/path200.svg';
import DarkModeToggle from './DarkModeToggle';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector((state) => state.session.user);
  const dark_mode_pref = useSelector(
    (state) => state.session.user?.dark_mode_pref
  );

  return (
    <>
      <nav>
        <div className={`navbar-logo-and-name ${dark_mode_pref ? 'logo-color-light' : 'logo-color-dark'
          }`}>
          <NavLink to="/" exact={true} activeClassName="active">
            <img src={path200} className="navbar-logo-img" />
            Archer
          </NavLink>
        </div>
        <div className="navbar-menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          <div className={`navbar-menu-toggle-line ${isOpen ? 'open' : ''}`} />
          <div className={`navbar-menu-toggle-line ${isOpen ? 'open' : ''}`} />
          <div className={`navbar-menu-toggle-line ${isOpen ? 'open' : ''}`} />
        </div>
        <ul className={`navbar-menu ${isOpen ? 'open' : 'closed'}`}>
          {!user ? (
            <>
              <div className='navbar-right-side-container'>
                <li className='navbar-right-side-item'>
                  <NavLink to="/login" exact={true} activeClassName="active">
                    Login
                  </NavLink>
                </li>
                <li className='navbar-right-side-item'>
                  <NavLink to="/sign-up" exact={true} activeClassName="active">
                    Sign Up
                  </NavLink>
                </li>
              </div>
            </>
          ) : (
            <>
              <li className='navbar-search-container'>
                <SearchBar />
              </li>
              <div className='navbar-right-side-container'>
                <li className='navbar-right-side'>
                  <DarkModeToggle />
                </li>
                <li className='navbar-right-side'>
                  <NavLink to="/profile" exact={true} activeClassName="active">
                    <button>Profile</button>
                  </NavLink>
                </li>
                <li className='navbar-right-side'>
                  <LogoutButton />
                </li>
              </div>
            </>
          )}
        </ul>
      </nav>
      {/* <div className='navbar-space-filler'></div> */}
    </>
  );
};

export default NavBar;