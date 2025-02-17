import {Modal, Box, Button, Typography} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router';

interface KeyModalProps{
    passKey: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}



const KeyModal: React.FC<KeyModalProps> = ({passKey, open, setOpen}) => {

    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
        navigate('/');
    };

    return (
        <Modal open={open}>
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant="h5" component="h2" textAlign={'center'}>
                Please note down the generated key for future transactions in the blockchain.
            </Typography>
            <Typography variant="h5" component="h2" textAlign={'center'}>
                You will never see this again
            </Typography>
            <Typography variant='h6' component="h2" textAlign={'center'}>
                {passKey}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClose}>
                Close
            </Button>
        </Box>
    </Modal>
    )
}

export default KeyModal