/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import './index.css'
import { Routes, Route } from 'react-router-dom'
import Register from './Components/Registration/TraderRegistration'
import Login from './Components/Login/Login'
import LandingPage from './Components/LandingPage/LandingPage'
import { useDispatch } from 'react-redux'
import { checkAuth } from './Redux/userActions'
import { useEffect } from 'react'
import WalletModal from './Components/Wallet/WalletModal'
import BackDrop from './Components/Backdrop/Backdrop'
import ProductGrid from './Components/NFT/listNFT'
import ProductDetailPage from './Components/NFT/NFTDetails'
import CreateNFT from './Components/NFT/Create/CreateNFT'
import NFTCollection from './Components/NFT/Collection/CollectionListing'
import OrderDetails from './Components/Orders/OrderDetails'
import NFTOrderListing from './Components/Orders/OrderList'
import ProfileCard from './Components/Profile/ProfileCard'
import LandingPageThree from './Components/LandingPage/L3'



import Navbar from './Components/NavBar/Navbar'
import CollapsibleAlert from './Components/Alert/Alert'

import * as buffer from "buffer";
window.Buffer = buffer.Buffer;


  function App() {
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
              <OrderDetails />
            </>
          }
        />


        <Route path='/trader/register' element={<Register />} />
        <Route path='/trader/login' element={<Login />} />

        <Route path='/trader/nft/create' element={<CreateNFT />} />
        <Route path='/trader/profile' element={<ProfileCard />} />
        <Route path='/nft/retrieve/:id' element={<ProductDetailPage />} />

        <Route path='/nft/list/all' element={<ProductGrid />} />

      </Routes>
      <WalletModal/>
      <BackDrop/>
    </div>
  )
}

export default App
