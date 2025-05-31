
import './App.css'
import './index.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Register from './Components/Registration/TraderRegistration'
import Login from './Components/Login/Login'
import { useDispatch } from 'react-redux'
import { checkAuth } from './Redux/userActions'
import { useEffect } from 'react'
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
import AddressForm from './Components/Address/AddressForm'
import SwapShippingVerification from './Components/ShippingPartner/ShippingPartner'

import HubManagementDashboard from './Components/Hub/Hub'


import ShippingHubForm from './Components/Hub/AddNewHub'

import Navbar from './Components/NavBar/Navbar'
import CollapsibleAlert from './Components/Alert/Alert'
import RouteDisplayC from './Components/RouteDisplay'

import NFTAdminDashboard from './Components/Admin/Home'

import HubManagerLogin from './Components/ShippingPartner/PartnerLogin'

import type { AppDispatch } from './store'



import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

function App() {

  const dispatch = useDispatch<AppDispatch>()
  


  const location = useLocation()
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

    

  return (
    <>
      {location.pathname.split("/")[1] !== "shipping" && ( location.pathname.split("/")[1] === "admin"  ? <SwapchainNavbar /> : <Navbar /> )}
      
      {location.pathname.split("/")[3] !== "login" && <RouteDisplayC />}
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
        <Route path="/admin/hub/manage/" element={<HubManagementDashboard />} />
        <Route path='/admin/hub/add/' element={<ShippingHubForm />} />

        <Route path="/trader/address/create" element={<AddressForm />} />
        
        <Route path='/shipping/hub/login/' element={<HubManagerLogin />} />
        <Route path='/shipping/verify/' element={<SwapShippingVerification />} />

      </Routes>
      <WalletModal/>
    </>
  )
}

export default App
