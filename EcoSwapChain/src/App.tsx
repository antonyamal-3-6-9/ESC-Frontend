/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import './index.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Register from './Components/Registration/TraderRegistration'
import Login from './Components/Login/Login'
import { useDispatch } from 'react-redux'
import { checkAuth } from './Redux/userActions'
import { useEffect, useState } from 'react'
import WalletModal from './Components/Wallet/WalletModal'
import BackDrop from './Components/Backdrop/Backdrop'
import ProductGrid from './Components/NFT/listNFT'
import ProductDetailPage from './Components/NFT/NFTDetails'
import CreateNFT from './Components/NFT/Create/CreateNFT'
import NFTOrderDetails from './Components/Orders/OrderDetails'
import NFTOrderListing from './Components/Orders/OrderList'
import ProfileCard from './Components/Profile/ProfileCard'
import LandingPageThree from './Components/LandingPage/L3'
import SwapchainNavbar from './Components/Admin/AdminNavbar'

import HubManagementDashboard from './Components/Hub/Hub'


import ShippingHubForm from './Components/Hub/AddNewHub'

import Navbar from './Components/NavBar/Navbar'
import CollapsibleAlert from './Components/Alert/Alert'
import RouteDisplayC from './Components/RouteDisplay'

import NFTAdminDashboard from './Components/Admin/Home'



import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

function App() {

  const dispatch = useDispatch()
  
  const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
      dispatch(checkAuth() as never)
    }, [dispatch])
  
  const location = useLocation()

  useEffect(() => {

      setIsAdmin(location.pathname.split('/')[1] === "admin");

  }, [location.pathname]);
   

  return (
    <>{isAdmin ? <SwapchainNavbar /> : <Navbar />}
      <RouteDisplayC />
      <CollapsibleAlert />
      <BackDrop />
      <Routes>

        <Route
          path='/'
          element={<LandingPageThree />}
        />


        <Route path='/trader/register' element={<Register />} />
        <Route path='/:role/login' element={<Login/>} />


        <Route path='/trader/nft/create' element={<CreateNFT />} />
        <Route path='/trader/dashboard' element={<ProfileCard />} />

        <Route path='/nft/retrieve/:id' element={<ProductDetailPage />} />
        <Route path='/nft/list/all' element={<ProductGrid />} />

        <Route path='/order/retrieve/:id' element={<NFTOrderDetails />} />
        <Route path='/order/list/all' element={<NFTOrderListing />} />


        <Route path='/admin/dashboard' element={<NFTAdminDashboard />} />
        <Route path="admin/hub/manage/" element={<HubManagementDashboard />} />
        <Route path='admin/hub/add/' element={<ShippingHubForm />} />

      </Routes>
      <WalletModal/>
      <BackDrop/>
    </>
  )
}

export default App
