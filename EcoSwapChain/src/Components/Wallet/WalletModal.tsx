import { Modal, Box } from '@mui/material'
import Wallet from './Wallet'
import { useAppSelector } from '../../store'
import { triggerWallet } from '../../Redux/walletSlice'
import { useDispatch } from 'react-redux'

const WalletModal = () => {
  const dispatch = useDispatch()
  const { isOpen } = useAppSelector(state => state.wallet)

  const handleClose = () => {
    dispatch(triggerWallet())
  }

  return (
    <>
      <Modal open={isOpen} onClose={handleClose} disableAutoFocus disableEnforceFocus>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '80%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 3,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Wallet
            publicKey='HN5sE2LfZAX1gECW6GkHqJ4ScyYbQXdL5T3DKLKXqY5G'
            swapcoinBalance={150.5}
            onWithdraw={() => console.log('Withdraw to Solana')}
          />
        </Box>
      </Modal>
    </>
  )
}

export default WalletModal
