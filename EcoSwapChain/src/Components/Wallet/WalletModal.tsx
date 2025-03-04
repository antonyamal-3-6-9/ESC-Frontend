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
    <Modal 
      open={isOpen} 
      onClose={handleClose} 
      disableAutoFocus 
      disableEnforceFocus
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 450,
          height: '90vh',
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Wallet />
      </Box>
    </Modal>
  )
}

export default WalletModal