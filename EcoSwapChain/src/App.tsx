/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import './index.css'
import { Routes, Route } from 'react-router-dom'
import Register from './Components/Registration/TraderRegistration'
import Login from './Components/Login/Login'
import LandingPage from './Components/LandingPage/LandingPage'
import { useDispatch } from 'react-redux'
import { checkAuth } from './Redux/userActions'
import { useState, useEffect } from 'react'
import WalletModal from './Components/Wallet/WalletModal'
import BackDrop from './Components/Backdrop/Backdrop'
import ProductGrid from './Components/NFT/listNFT'
import ProductDetailPage from './Components/NFT/NFTDetails'

import CreateNFT from './Components/NFT/Create/CreateNFT'

import NFTCreationForm from './Components/NFT/Create/NFTCreationForm'
import NFTCollection from './Components/NFT/Collection/CollectionListing'
import OrderDetails from './Components/Orders/OrderDetails'
import { useAppSelector } from './store'
import NFTOrderListing from './Components/Orders/OrderList'



import Navbar from './Components/NavBar/Navbar'
import CollapsibleAlert from './Components/Alert/Alert'
import NFTMintingModal from './Components/NFT/Create/NFTMintingModal'

import * as buffer from "buffer";
window.Buffer = buffer.Buffer;


  function App() {
    const { isOpen } = useAppSelector(state => state.wallet)
    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(checkAuth() as never)
    }, [dispatch])

  return (
    <div>
      <Navbar />
      <CollapsibleAlert />
      <BackDrop/>
      <Routes>
        <Route
          path='/'
          element={
            <>
              <LandingPage />
            </>
          }
        />
        <Route path='trader/register' element={<Register />} />
        <Route path='/trader/login' element={<Login />} />
        <Route path='/nft/create' element={<CreateNFT />} />
      </Routes>
      {
        isOpen && <WalletModal />
      }
      <WalletModal/>
      <BackDrop/>
    </div>
  )
}

export default App
