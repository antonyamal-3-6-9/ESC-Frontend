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
import NFTCreationForm from './Components/NFT/Create/NFTCreationForm'
import NFTCollection from './Components/NFT/Collection/CollectionListing'
import OrderDetails from './Components/Orders/OrderDetails'
import { useAppSelector } from './store'
import NFTOrderListing from './Components/Orders/OrderList'

function App () {
  const { isOpen } = useAppSelector(state => state.wallet)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth() as never)
  }, [dispatch])

  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <>
              <OrderDetails />
            </>
          }
        />
        <Route path='/trader/register/' element={<Register />} />
        <Route path='/trader/login/' element={<Login />} />
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
