import React from 'react';
import { Outlet } from 'react-router-dom';
import Home from './Home';

const BuyerLayout = ({ setCurrentUser }) => {
  return (
    <>
      <Home setCurrentUser={setCurrentUser} />
      <Outlet />
    </>
  );
};

export default BuyerLayout;
