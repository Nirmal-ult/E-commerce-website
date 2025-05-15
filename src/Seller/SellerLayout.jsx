import React from 'react'
import DashBoard from './DashBoard'
import { Outlet } from 'react-router-dom'

const SellerLayout = ({setCurrentUser}) => {
  return (
    <>
    <DashBoard setCurrentUser={setCurrentUser}/>
    <Outlet/>
    </>
  )
}

export default SellerLayout