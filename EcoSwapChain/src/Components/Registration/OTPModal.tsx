import React from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import BackDrop from '../Backdrop/Backdrop';

interface OTPModalProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit: (otp: string) => void;
    otp: string;
    setOtp: (otp: string) => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ open, handleClose, handleSubmit, otp, setOtp }) => {


    const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(event.target.value);
    };

    const handleFormSubmit = () => {
        handleSubmit(otp);
    };


    return (
        <Modal open={open} onClose={handleClose}>
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
                <Typography variant="h6" component="h2" textAlign={'center'}>
                    Enter OTP
                </Typography>
                <TextField
                    label="OTP"
                    variant="outlined"
                    fullWidth
                    type='number'
                    margin="normal"
                    name='otp'
                    value={otp}
                    onChange={handleOtpChange}
                />
                <Button variant="contained" color="primary" onClick={handleFormSubmit}>
                    Submit
                </Button>
            </Box>
        </Modal>
    );
};

export default OTPModal;