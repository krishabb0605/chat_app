import React from 'react';
import logo from '../assets/logo.png';
import { Outlet } from 'react-router-dom';

const AuthLayouts = () => {
  return (
    <>
      <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
        <img src={logo} alt='Logo' width={180} height={60} />
      </header>
      <Outlet />
    </>
  );
};

export default AuthLayouts;
