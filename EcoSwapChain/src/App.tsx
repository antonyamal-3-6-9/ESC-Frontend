/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import './index.css'
import { Routes, Route } from 'react-router-dom'
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
import NFTOwnershipHistoryModal from './Components/NFT/OwnershipHistory'



import Navbar from './Components/NavBar/Navbar'
import CollapsibleAlert from './Components/Alert/Alert'

import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

interface Transaction {
  transferedTo: string;
  transferedFrom: string;
  transactionHash: string;
  transactionType: 'mint' | 'transfer';
  timestamp: number; // Unix timestamp
  status: 'success' | 'failed';
}

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(checkAuth() as never)
    }, [dispatch])
  
  const transactionHistory: Transaction[]= [
    {
      transferedTo: "0xabc123def456ghi789jkl",
      transferedFrom: "0x987zyx654wvu321tsr",
      transactionHash: "0xabcdef1234567890abcdef1234567890",
      transactionType: "transfer",
      timestamp: Date.now() - 1000000, // Current owner (recent transaction)
      status: "success"
    },
    {
      transferedTo: "0x987zyx654wvu321tsr",
      transferedFrom: "0x555thx444you333very222much111",
      transactionHash: "0x0123456789abcdef0123456789abcdef",
      transactionType: "transfer",
      timestamp: Date.now() - 5000000000, // Previous owner
      status: "success"
    },
    {
      transferedTo: "0x555thx444you333very222much111",
      transferedFrom: "0x000contract000address000",
      transactionHash: "0xfedcba9876543210fedcba9876543210",
      transactionType: "mint",
      timestamp: Date.now() - 10000000000, // Original mint
      status: "success"
    }
  ];

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  return (
    <div>
      <Navbar />
      <CollapsibleAlert />
      <BackDrop />
      <NFTOwnershipHistoryModal
        open={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        transactions={transactionHistory}
      />
      <Routes>



        <Route
          path='/'
          element={
            <>
              <LandingPageThree />
            </>
          }
        />


        <Route path='/trader/register' element={<Register />} />
        <Route path='/trader/login' element={<Login />} />

        <Route path='/trader/nft/create' element={<CreateNFT />} />
        <Route path='/trader/profile' element={<ProfileCard />} />

        <Route path='/nft/retrieve/:id' element={<ProductDetailPage />} />
        <Route path='/nft/list/all' element={<ProductGrid />} />

        <Route path='/order/retrieve/:id' element={<NFTOrderDetails />} />
        <Route path='/order/list/all' element={<NFTOrderListing />} />

      </Routes>
      <WalletModal/>
      <BackDrop/>
    </div>
  )
}

export default App
